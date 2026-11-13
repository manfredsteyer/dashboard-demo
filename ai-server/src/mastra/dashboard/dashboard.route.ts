import { type AbstractAgent, type BaseEvent, EventType, type RunAgentInput } from '@ag-ui/client';
import { RunAgentInputSchema } from '@ag-ui/core/schemas';
import { MastraAgent } from '@ag-ui/mastra';
import { registerApiRoute } from '@mastra/core/server';

import { DASHBOARD_AGENT_ID } from '../../../../shared/dashboard-protocol';
import { llmSettingsSchema } from '../llm/llm-settings';
import { DashboardMiddleware } from './dashboard.middleware';
import { withoutMemoryArgs } from './without-memory-args';

/**
 * AG-UI endpoint of the dashboard agent.
 */
export const dashboardRoute = registerApiRoute('/ag-ui/dashboard', {
  method: 'POST',
  handler: async (c) => {
    const input = RunAgentInputSchema.parse(await c.req.json());
    const llm = llmSettingsSchema.parse(input.forwardedProps?.llm);

    const requestContext = c.get('requestContext');
    requestContext.set('llm', llm);

    // Bridges between the Mastra agent and AG-UI
    const agent = new MastraAgent({
      agentId: DASHBOARD_AGENT_ID,
      agent: withoutMemoryArgs(c.get('mastra').getAgent(DASHBOARD_AGENT_ID)),
      requestContext,
      threadId: input.threadId,
      initialMessages: input.messages,
    }).use(new DashboardMiddleware());

    return streamEvents(agent, input);
  },
});

/**
 * Runs the agent and streams its AG-UI events as server-sent events.
 */
function streamEvents(agent: AbstractAgent, input: RunAgentInput): Response {
  const encoder = new TextEncoder();

  const body = new ReadableStream({
    async start(controller) {
      const send = (event: BaseEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        await agent.runAgent(input, { onEvent: ({ event }) => send(event) });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        send({ type: EventType.RUN_ERROR, message } as BaseEvent);
      }
      controller.close();
    },
  });

  return new Response(body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
