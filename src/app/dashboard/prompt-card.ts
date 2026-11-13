import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

import { LlmSettingsStore } from '../llm-settings/llm-settings-store';
import { DashboardStore } from './dashboard-store';
import { examplePrompts } from './example-prompts';

@Component({
  selector: 'app-prompt-card',
  imports: [FormField, FormRoot],
  template: `
    <section class="card" aria-labelledby="prompt-title">
      <h2 id="prompt-title">Describe your dashboard</h2>

      <form [formRoot]="promptForm">
        <label for="prompt">Prompt</label>
        <textarea id="prompt" rows="5" [formField]="promptForm"></textarea>

        <div class="actions">
          <button type="submit" class="btn-primary" [disabled]="!canGenerate()">Generate</button>
          @for (example of examples; track example.label) {
            <button
              type="button"
              [disabled]="!settingsValid() || isRunning()"
              (click)="useExample(example.prompt)"
            >
              Example: {{ example.label }}
            </button>
          }
          <span class="status" role="status">
            @if (isRunning()) {
              Generating
              <span class="ai-wait-indicator" aria-hidden="true"
                ><span></span><span></span><span></span
              ></span>
            }
          </span>
        </div>

        @if (!settingsValid()) {
          <p class="hint">Enter the connection data for the language model first.</p>
        }
        @if (error()) {
          <p class="error" role="alert">{{ error() }}</p>
        }
      </form>
    </section>
  `,
  styles: `
    textarea {
      margin-bottom: 1rem;
    }

    .actions {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .status {
      align-items: center;
      display: inline-flex;
      font-size: var(--font-size-sm);
      gap: 0.5rem;
      margin-left: auto;
    }

    .hint,
    .error {
      font-size: var(--font-size-sm);
      margin: 1rem 0 0;
    }

    .error {
      color: var(--color-error);
    }
  `,
})
export class PromptCard {
  private readonly dashboard = inject(DashboardStore);
  private readonly llmSettings = inject(LlmSettingsStore);

  protected readonly examples = examplePrompts;
  protected readonly isRunning = this.dashboard.isRunning;
  protected readonly error = this.dashboard.error;
  protected readonly settingsValid = computed(() => this.llmSettings.form().valid());

  private readonly prompt = signal('');
  protected readonly promptForm = form(this.prompt, (path) => required(path), {
    submission: { action: () => this.generate() },
  });

  protected readonly canGenerate = computed(
    () => this.settingsValid() && this.promptForm().valid() && !this.isRunning(),
  );

  protected useExample(prompt: string): void {
    this.prompt.set(prompt);
    void this.generate();
  }

  private async generate(): Promise<void> {
    await this.dashboard.generate(this.prompt(), this.llmSettings.settings());
  }
}
