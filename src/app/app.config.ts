import { provideA2UI, provideMarkdownRenderer } from '@a2ui/angular';
import { renderMarkdown } from '@a2ui/markdown-it';
import { HttpAgent } from '@ag-ui/client';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { type ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideCopilotKit } from '@copilotkit/angular';

import { DASHBOARD_AGENT_ID } from '../../shared/dashboard-protocol';
import { a2uiActivityRenderer } from './a2ui/a2ui-activity';
import { dashboardCatalog } from './a2ui/dashboard-catalog';
import { DashboardStore } from './dashboard/dashboard-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),

    provideCopilotKit({
      enableInspector: false,
      // The agent runs on our Mastra server, which also delivers this app.
      selfManagedAgents: {
        [DASHBOARD_AGENT_ID]: new HttpAgent({ url: '/ag-ui/dashboard' }),
      },
      // Our own renderer for A2UI 1.0 activities
      renderActivityMessages: [a2uiActivityRenderer],
    }),

    // A2UI 1.0 renderer with our catalog
    provideA2UI(() => {
      const dashboard = inject(DashboardStore);
      return {
        catalogs: [dashboardCatalog],
        // Button clicks; the inspector displays them.
        actionHandler: (action) => dashboard.lastAction.set(action),
      };
    }),
    provideMarkdownRenderer(renderMarkdown),
  ],
};
