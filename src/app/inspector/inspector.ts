import { Component, computed, inject } from '@angular/core';

import { DashboardStore } from '../dashboard/dashboard-store';

/**
 * Shows what happens behind the scenes: the DSL program the LLM wrote,
 * the A2UI 1.0 messages the server compiled from it, and the actions
 * the dashboard's buttons send.
 */
@Component({
  selector: 'app-inspector',
  template: `
    <section aria-labelledby="dsl-title">
      <h2 id="dsl-title">Dashboard DSL</h2>
      <p class="muted">Written by the LLM, based on macros</p>
      @if (dsl()) {
        <pre tabindex="0" aria-labelledby="dsl-title"><code>{{ dsl() }}</code></pre>
      } @else {
        <p class="muted">Nothing generated yet.</p>
      }
    </section>

    @if (actionJson()) {
      <section aria-labelledby="action-title">
        <h2 id="action-title">Last action</h2>
        <p class="muted">Sent by an A2UI button, with its context resolved</p>
        <pre tabindex="0" aria-labelledby="action-title"><code>{{ actionJson() }}</code></pre>
      </section>
    }

    <section class="a2ui" aria-labelledby="a2ui-title">
      <h2 id="a2ui-title">A2UI 1.0</h2>
      <p class="muted">Compiled by the server, rendered by the client</p>
      @if (a2uiJson()) {
        <pre tabindex="0" aria-labelledby="a2ui-title"><code>{{ a2uiJson() }}</code></pre>
      } @else {
        <p class="muted">Nothing generated yet.</p>
      }
    </section>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: 100%;
    }

    h2 {
      font-size: var(--font-size);
      margin: 0;
    }

    .muted {
      margin: 0.25rem 0 0.75rem;
    }

    .a2ui {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
    }

    pre {
      background: var(--color-code-background);
      border-radius: var(--border-radius);
      color: var(--color-code);
      font-family: var(--font-family-mono);
      font-size: var(--font-size-tiny);
      line-height: 1.5;
      margin: 0;
      overflow: auto;
      padding: 0.75rem;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .a2ui pre {
      flex: 1;
      white-space: pre;
    }
  `,
})
export class Inspector {
  private readonly dashboard = inject(DashboardStore);

  protected readonly dsl = this.dashboard.dsl;

  protected readonly actionJson = computed(() => {
    const action = this.dashboard.lastAction();
    if (!action) {
      return '';
    }
    const { name, sourceComponentId, context } = action;
    return JSON.stringify({ name, sourceComponentId, context }, null, 2);
  });

  protected readonly a2uiJson = computed(() => {
    const operations = this.dashboard.a2uiOperations();
    return operations.length > 0 ? JSON.stringify(operations, null, 2) : '';
  });
}
