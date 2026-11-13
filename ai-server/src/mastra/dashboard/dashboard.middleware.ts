import {
  type AbstractAgent,
  type ActivitySnapshotEvent,
  type BaseEvent,
  EventType,
  type Message,
  Middleware,
  randomUUID,
  type RunAgentInput,
  type ToolCallEndEvent,
} from '@ag-ui/client';
import { concat, concatMap, defer, map, type Observable, of } from 'rxjs';

import {
  A2UI_ACTIVITY_TYPE,
  type A2uiActivityContent,
  DSL_ACTIVITY_TYPE,
  type DslActivityContent,
} from '../../../../shared/dashboard-protocol';
import { compileDashboard } from './compile-dashboard';
import { RENDER_DASHBOARD, renderDashboardArgs } from './render-dashboard.tool';

/**
 * AG-UI middleware that turns the LLM's renderDashboard call into UI.
 * As soon as the call is complete, it streams two activity messages:
 *
 * 1. the DSL program the LLM wrote
 * 2. the A2UI 1.0 surface compiled from it
 */
export class DashboardMiddleware extends Middleware {
  override run(input: RunAgentInput, next: AbstractAgent): Observable<BaseEvent> {
    // Besides each event, runNextWithState provides the messages after
    // applying it, including the complete arguments of each tool call.
    return this.runNextWithState(input, next).pipe(
      concatMap(({ event, messages }) => {
        const dsl = readDashboardProgram(event, messages);
        if (dsl === undefined) {
          return of(event);
        }
        return concat(of(event), dashboardActivities(dsl));
      }),
    );
  }
}

function readDashboardProgram(event: BaseEvent, messages: Message[]): string | undefined {
  if (event.type !== EventType.TOOL_CALL_END) {
    return undefined;
  }

  const { toolCallId } = event as ToolCallEndEvent;
  const toolCall = messages
    .flatMap((message) => (message.role === 'assistant' ? (message.toolCalls ?? []) : []))
    .find((call) => call.id === toolCallId);

  if (toolCall?.function.name !== RENDER_DASHBOARD) {
    return undefined;
  }
  return renderDashboardArgs.parse(JSON.parse(toolCall.function.arguments)).dsl;
}

function dashboardActivities(dsl: string): Observable<BaseEvent> {
  const id = randomUUID();
  const dslContent: DslActivityContent = { dsl };

  return concat(
    of(activitySnapshot(`${id}-dsl`, DSL_ACTIVITY_TYPE, dslContent)),
    defer(() => compileDashboard(dsl)).pipe(
      map((operations) => {
        const a2uiContent: A2uiActivityContent = { a2ui_operations: operations };
        return activitySnapshot(`${id}-a2ui`, A2UI_ACTIVITY_TYPE, a2uiContent);
      }),
    ),
  );
}

function activitySnapshot(
  messageId: string,
  activityType: string,
  content: DslActivityContent | A2uiActivityContent,
): ActivitySnapshotEvent {
  return { type: EventType.ACTIVITY_SNAPSHOT, messageId, activityType, content: { ...content } };
}
