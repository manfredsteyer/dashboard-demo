import { Agent } from '@mastra/core/agent';

import { DASHBOARD_AGENT_ID, type LlmSettings } from '../../../../shared/dashboard-protocol';
import { createModel, providerOptions } from '../llm/create-model';
import { dashboardAgentPrompt } from './dashboard-agent.prompt';
import { renderDashboard } from './render-dashboard.tool';

export const dashboardAgent = new Agent({
  id: DASHBOARD_AGENT_ID,
  name: 'Dashboard Agent',
  instructions: dashboardAgentPrompt,
  // The client decides which LLM to use; the route puts its choice
  // into the request context.
  model: ({ requestContext }) => createModel(requestContext.get('llm') as LlmSettings),
  tools: { renderDashboard },
  defaultOptions: {
    // One step: the LLM writes the program, the server does the rest.
    maxSteps: 1,
    // Same prompt, same program: no creativity needed.
    modelSettings: { temperature: 0 },
    providerOptions,
  },
});
