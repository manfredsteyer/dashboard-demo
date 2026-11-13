import { Component, inject } from '@angular/core';
import { CopilotActivity } from '@copilotkit/angular';

import { DASHBOARD_AGENT_ID } from '../../../shared/dashboard-protocol';
import { DashboardStore } from './dashboard-store';

@Component({
  selector: 'app-dashboard-view',
  imports: [CopilotActivity],
  template: `
    <section class="dashboard" aria-labelledby="dashboard-title">
      <h2 id="dashboard-title">Your dashboard</h2>

      @let activity = a2uiActivity();
      @if (activity) {
        <!-- CopilotKit picks the renderer registered for the activity type -->
        <copilot-activity [message]="activity" [agentId]="agentId" />
      } @else {
        <p class="muted">The generated dashboard will appear here.</p>
      }
    </section>
  `,
})
export class DashboardView {
  protected readonly agentId = DASHBOARD_AGENT_ID;
  protected readonly a2uiActivity = inject(DashboardStore).a2uiActivity;
}
