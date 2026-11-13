import { A2uiRendererService, SurfaceComponent } from '@a2ui/angular';
import type { AbstractAgent, ActivityMessage } from '@ag-ui/client';
import { Component, computed, effect, inject, input } from '@angular/core';
import type {
  ActivityRenderer,
  AngularActivityContentSchema,
  RenderActivityMessageConfig,
} from '@copilotkit/angular';

import { A2UI_ACTIVITY_TYPE, type A2uiActivityContent } from '../../../shared/dashboard-protocol';

/**
 * Renders an A2UI 1.0 activity message. CopilotKit's built-in renderer
 * only understands A2UI 0.9, so we use the A2UI Angular renderer directly.
 */
@Component({
  selector: 'app-a2ui-activity',
  imports: [SurfaceComponent],
  // Each activity gets its own A2UI message processor.
  providers: [A2uiRendererService],
  template: `
    @for (surfaceId of surfaceIds(); track surfaceId) {
      <a2ui-v09-surface [surfaceId]="surfaceId" />
    }
  `,
})
export class A2uiActivity implements ActivityRenderer<A2uiActivityContent> {
  readonly activityType = input.required<string>();
  readonly content = input.required<A2uiActivityContent>();
  readonly message = input.required<ActivityMessage>();
  readonly agent = input<AbstractAgent>();

  private readonly renderer = inject(A2uiRendererService);
  private processedCount = 0;

  protected readonly surfaceIds = computed(() =>
    this.content().a2ui_operations.flatMap((operation) =>
      'createSurface' in operation ? [operation.createSurface.surfaceId] : [],
    ),
  );

  constructor() {
    // CopilotKit passes a new content object whenever the message list
    // changes. Hence, we only hand over operations we haven't processed yet.
    effect(() => {
      const operations = this.content().a2ui_operations;
      this.renderer.processMessages(operations.slice(this.processedCount));
      this.processedCount = operations.length;
    });
  }
}

const a2uiContentSchema: AngularActivityContentSchema<A2uiActivityContent> = {
  safeParse: (content) => {
    const valid = Array.isArray((content as Partial<A2uiActivityContent>)?.a2ui_operations);
    return valid ? { success: true, data: content as A2uiActivityContent } : { success: false };
  },
};

/**
 * Registers the renderer for A2UI 1.0 activities with CopilotKit.
 */
export const a2uiActivityRenderer: RenderActivityMessageConfig<A2uiActivityContent> = {
  activityType: A2UI_ACTIVITY_TYPE,
  content: a2uiContentSchema,
  component: A2uiActivity,
};
