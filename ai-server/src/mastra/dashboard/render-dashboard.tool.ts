import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const RENDER_DASHBOARD = 'renderDashboard';

export const renderDashboardArgs = z.object({
  dsl: z.string().describe('The dashboard program, e.g. root = Dashboard([...])'),
});

/**
 * The LLM's only tool. It just defines the contract: the LLM passes its
 * dashboard program as an argument. The DashboardMiddleware picks the
 * program up from the AG-UI event stream and compiles it.
 */
export const renderDashboard = createTool({
  id: RENDER_DASHBOARD,
  description: 'Renders the dashboard described by a DSL program.',
  inputSchema: renderDashboardArgs,
  execute: async () => ({ ok: true }),
});
