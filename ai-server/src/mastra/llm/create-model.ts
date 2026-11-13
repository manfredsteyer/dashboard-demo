import type { MastraModelConfig } from '@mastra/core/llm';

import type { LlmSettings } from '../../../../shared/dashboard-protocol';

/**
 * Selects the model via Mastra's model router ("provider/model"). The
 * credentials come from the client instead of environment variables.
 */
export function createModel(settings: LlmSettings): MastraModelConfig {
  switch (settings.provider) {
    case 'gemini':
      return {
        id: 'google/gemini-3.5-flash-lite',
        apiKey: settings.apiKey,
      };
    case 'cloudflare':
      return {
        id: 'cloudflare-workers-ai/@cf/google/gemma-4-26b-a4b-it',
        url: `https://api.cloudflare.com/client/v4/accounts/${settings.accountId}/ai/v1`,
        apiKey: settings.apiToken,
      };
  }
}

/**
 * Provider-specific request options. Gemma 4 thinks before answering by
 * default, which takes about 40 seconds longer. Writing a dashboard
 * program doesn't need that.
 */
export const providerOptions = {
  'cloudflare-workers-ai': {
    chat_template_kwargs: { enable_thinking: false },
  },
};
