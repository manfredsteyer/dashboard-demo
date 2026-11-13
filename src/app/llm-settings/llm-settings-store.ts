import { httpResource } from '@angular/common/http';
import { computed, linkedSignal, Service } from '@angular/core';
import { form, required } from '@angular/forms/signals';

import type { LlmDefaults, LlmProvider, LlmSettings } from '../../../shared/dashboard-protocol';

interface LlmSettingsModel {
  provider: LlmProvider;
  geminiApiKey: string;
  cloudflareAccountId: string;
  cloudflareApiToken: string;
}

/**
 * Connection data for the LLM the dashboard agent uses.
 */
@Service()
export class LlmSettingsStore {
  // Values from the server's .env file
  private readonly defaults = httpResource<LlmDefaults>(() => '/llm-defaults');

  // Starts with the defaults; afterwards, the user edits it via the form
  private readonly model = linkedSignal<LlmSettingsModel>(() =>
    toModel(this.defaults.hasValue() ? this.defaults.value() : undefined),
  );

  readonly form = form(this.model, (path) => {
    const isGemini = () => this.model().provider === 'gemini';
    const isCloudflare = () => this.model().provider === 'cloudflare';

    required(path.geminiApiKey, { when: isGemini });
    required(path.cloudflareAccountId, { when: isCloudflare });
    required(path.cloudflareApiToken, { when: isCloudflare });
  });

  readonly settings = computed<LlmSettings>(() => {
    const model = this.model();
    if (model.provider === 'gemini') {
      return { provider: 'gemini', apiKey: model.geminiApiKey };
    }
    return {
      provider: 'cloudflare',
      accountId: model.cloudflareAccountId,
      apiToken: model.cloudflareApiToken,
    };
  });
}

function toModel(defaults: LlmDefaults | undefined): LlmSettingsModel {
  return {
    provider: 'gemini',
    geminiApiKey: defaults?.gemini.apiKey ?? '',
    cloudflareAccountId: defaults?.cloudflare.accountId ?? '',
    cloudflareApiToken: defaults?.cloudflare.apiToken ?? '',
  };
}
