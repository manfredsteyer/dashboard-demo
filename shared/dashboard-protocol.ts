/**
 * The contract between the dashboard server and the Angular client.
 *
 * Besides the usual AG-UI events, the server streams two activity
 * messages (ACTIVITY_SNAPSHOT events) per generated dashboard:
 *
 * 1. `dashboard-dsl`: the program the LLM wrote, e.g.
 *    root = Dashboard([FlightsTable("Graz", "Hamburg")])
 * 2. `a2ui-surface-v1`: the A2UI 1.0 messages the server compiled
 *    from this program.
 *
 * Activity messages are meant for the UI only: AG-UI clients keep them
 * in the message list, but they are not part of the LLM conversation.
 */
import type { AgentToRendererMessage } from '@a2ui/web_core/v1_0';

export const DASHBOARD_AGENT_ID = 'dashboardAgent';

export const DSL_ACTIVITY_TYPE = 'dashboard-dsl';

export interface DslActivityContent {
  dsl: string;
}

export const A2UI_ACTIVITY_TYPE = 'a2ui-surface-v1';

/**
 * The A2UI catalog of the dashboard: the basic catalog plus the
 * client's TicketWidget.
 */
export const DASHBOARD_CATALOG_ID = 'https://example.com/catalogs/flights42-dashboard';

/**
 * Mirrors the content of CopilotKit's built-in `a2ui-surface` activity,
 * which only supports A2UI 0.9.
 */
export interface A2uiActivityContent {
  a2ui_operations: AgentToRendererMessage[];
}

/**
 * Connection data for the LLM. The client sends it with every run
 * as `forwardedProps.llm`.
 */
export type LlmSettings =
  | { provider: 'gemini'; apiKey: string }
  | { provider: 'cloudflare'; accountId: string; apiToken: string };

export type LlmProvider = LlmSettings['provider'];

/**
 * Values from the server's .env file, offered as defaults in the UI.
 */
export interface LlmDefaults {
  gemini: { apiKey: string };
  cloudflare: { accountId: string; apiToken: string };
}
