import { z } from 'zod';

import type { LlmDefaults, LlmSettings } from '../../../../shared/dashboard-protocol';

export const llmSettingsSchema: z.ZodType<LlmSettings> = z.discriminatedUnion('provider', [
  z.object({
    provider: z.literal('gemini'),
    apiKey: z.string().min(1),
  }),
  z.object({
    provider: z.literal('cloudflare'),
    accountId: z.string().min(1),
    apiToken: z.string().min(1),
  }),
]);

export function readLlmDefaults(): LlmDefaults {
  return {
    gemini: {
      apiKey: process.env['GOOGLE_GENERATIVE_AI_API_KEY'] ?? '',
    },
    cloudflare: {
      accountId: process.env['CLOUDFLARE_ACCOUNT_ID'] ?? '',
      apiToken: process.env['CLOUDFLARE_API_TOKEN'] ?? '',
    },
  };
}
