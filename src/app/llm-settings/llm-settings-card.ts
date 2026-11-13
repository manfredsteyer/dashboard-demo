import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import { LlmSettingsStore } from './llm-settings-store';

@Component({
  selector: 'app-llm-settings-card',
  imports: [FormField],
  template: `
    <section class="card" aria-labelledby="llm-settings-title">
      <h2 id="llm-settings-title">Language model</h2>

      <fieldset class="providers">
        <legend>Provider</legend>
        <label class="choice">
          <input type="radio" value="gemini" [formField]="form.provider" />
          Gemini Flash Lite
        </label>
        <label class="choice">
          <input type="radio" value="cloudflare" [formField]="form.provider" />
          Gemma 4 on Cloudflare
        </label>
      </fieldset>

      @if (form.provider().value() === 'gemini') {
        <div class="fields">
          <div class="field">
            <label for="gemini-api-key">API key</label>
            <input
              id="gemini-api-key"
              type="password"
              autocomplete="off"
              [formField]="form.geminiApiKey"
            />
          </div>
        </div>
      } @else {
        <div class="fields">
          <div class="field">
            <label for="cloudflare-account-id">Account ID</label>
            <input
              id="cloudflare-account-id"
              type="password"
              autocomplete="off"
              [formField]="form.cloudflareAccountId"
            />
          </div>
          <div class="field">
            <label for="cloudflare-api-token">API token</label>
            <input
              id="cloudflare-api-token"
              type="password"
              autocomplete="off"
              [formField]="form.cloudflareApiToken"
            />
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    .providers {
      border: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
      margin: 0 0 1rem;
      padding: 0;
    }

    .choice {
      align-items: center;
      color: var(--color-black);
      display: inline-flex;
      font-size: var(--font-size-sm);
      gap: 0.5rem;
      letter-spacing: normal;
      text-transform: none;
    }

    .fields {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    }
  `,
})
export class LlmSettingsCard {
  protected readonly form = inject(LlmSettingsStore).form;
}
