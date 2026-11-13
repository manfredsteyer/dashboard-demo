import { Mastra } from '@mastra/core/mastra';

import { chartsRoute } from './charts/charts.route';
import { dashboardAgent } from './dashboard/dashboard-agent';
import { dashboardRoute } from './dashboard/dashboard.route';
import { llmDefaultsRoute } from './llm/llm-defaults.route';

export const mastra = new Mastra({
  agents: { dashboardAgent },
  server: {
    port: 4111,
    cors: { origin: '*', allowMethods: ['GET', 'POST'], allowHeaders: ['Content-Type'] },
    apiRoutes: [dashboardRoute, llmDefaultsRoute, chartsRoute],
  },
});
