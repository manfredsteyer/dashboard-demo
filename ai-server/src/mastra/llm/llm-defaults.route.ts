import { registerApiRoute } from '@mastra/core/server';

import { readLlmDefaults } from './llm-settings';

/**
 * Hands the keys from the .env file to the client, which offers them
 * as defaults. Fine for a local demo, never do this in production.
 */
export const llmDefaultsRoute = registerApiRoute('/llm-defaults', {
  method: 'GET',
  handler: (c) => c.json(readLlmDefaults()),
});
