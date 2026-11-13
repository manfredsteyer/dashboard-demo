import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { serveStatic } from '@hono/node-server/serve-static';
import { Mastra } from '@mastra/core/mastra';
import { InMemoryStore } from '@mastra/core/storage';

import { chartsRoute } from './charts/charts.route';
import { dashboardAgent } from './dashboard/dashboard-agent';
import { dashboardRoute } from './dashboard/dashboard.route';
import { llmDefaultsRoute } from './llm/llm-defaults.route';

// The Angular app from `npm run build`. Mastra runs the server in
// .mastra/output and passes the project root as MASTRA_PROJECT_ROOT.
const APP_DIR = join(process.env['MASTRA_PROJECT_ROOT'] ?? '', 'dist/dashboard-demo/browser');

const PORT = process.env['PORT'] ?? '4111';

export const mastra = new Mastra({
  agents: { dashboardAgent },
  // The demo keeps no data. Choosing the in-memory store explicitly keeps
  // Mastra from warning that it falls back to it.
  storage: new InMemoryStore(),
  server: {
    // Port: PORT environment variable, default 4111
    apiRoutes: [dashboardRoute, llmDefaultsRoute, chartsRoute],
    // Serves the Angular app; all other paths go on to the API.
    middleware: existsSync(APP_DIR) ? [{ path: '*', handler: serveStatic({ root: APP_DIR }) }] : [],
    // Frees `/` for the app; Mastra Studio is at /studio during `mastra dev`.
    studioBase: '/studio',
  },
});

// `mastra dev` sets MASTRA_DEV. In dev mode, the Angular dev server
// reports its own URL.
if (process.env['MASTRA_DEV'] !== 'true') {
  console.log(`Dashboard Demo: http://localhost:${PORT}`);
}
