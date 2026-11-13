import type { ActionPayload } from '@a2ui/web_core/v1_0';
import { type ActivityMessage, randomUUID } from '@ag-ui/client';
import { computed, inject, Service, signal } from '@angular/core';
import { CopilotKit, injectAgentStore } from '@copilotkit/angular';

import {
  A2UI_ACTIVITY_TYPE,
  type A2uiActivityContent,
  DASHBOARD_AGENT_ID,
  DSL_ACTIVITY_TYPE,
  type DslActivityContent,
  type LlmSettings,
} from '../../../shared/dashboard-protocol';

/**
 * Talks to the dashboard agent and provides what it streams back.
 */
@Service()
export class DashboardStore {
  private readonly copilotKit = inject(CopilotKit);
  private readonly agentStore = injectAgentStore(DASHBOARD_AGENT_ID);

  readonly isRunning = computed(() => this.agentStore().isRunning());
  readonly error = signal('');

  /** The latest button click in the dashboard */
  readonly lastAction = signal<ActionPayload | undefined>(undefined);

  private readonly activities = computed(() =>
    this.agentStore()
      .messages()
      .filter((message): message is ActivityMessage => message.role === 'activity'),
  );

  /** The A2UI 1.0 surface compiled by the server */
  readonly a2uiActivity = computed(() =>
    this.activities().find((activity) => activity.activityType === A2UI_ACTIVITY_TYPE),
  );

  readonly a2uiOperations = computed(() => {
    const content = this.a2uiActivity()?.content as A2uiActivityContent | undefined;
    return content?.a2ui_operations ?? [];
  });

  /** The dashboard program the LLM wrote */
  readonly dsl = computed(() => {
    const activity = this.activities().find((a) => a.activityType === DSL_ACTIVITY_TYPE);
    return (activity?.content as DslActivityContent | undefined)?.dsl ?? '';
  });

  constructor() {
    // Reports failed requests as well as RUN_ERROR events from the server,
    // e.g. for an invalid API key.
    this.copilotKit.core.subscribe({
      onError: ({ error }) => this.error.set(error.message),
    });
  }

  async generate(prompt: string, llm: LlmSettings): Promise<void> {
    const agent = this.agentStore().agent;

    // Each dashboard only depends on its prompt, so we start a new conversation.
    agent.threadId = randomUUID();
    agent.setMessages([{ id: randomUUID(), role: 'user', content: prompt }]);
    this.error.set('');
    this.lastAction.set(undefined);

    // The server receives the LLM settings as forwardedProps.
    await this.copilotKit.core.runAgent({ agent, forwardedProps: { llm } });
  }
}
