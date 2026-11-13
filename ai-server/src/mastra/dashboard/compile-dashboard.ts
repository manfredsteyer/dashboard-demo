import { randomUUID } from 'node:crypto';

import type { AgentToRendererMessage } from '@a2ui/web_core/v1_0';

import { DASHBOARD_CATALOG_ID } from '../../../../shared/dashboard-protocol';
import { applyMacros } from '../dsl/apply-macros';
import { createDslParser } from '../dsl/parse-dsl';
import { dashboardMacros } from './macros';

const parseDsl = createDslParser(dashboardMacros);

/**
 * Compiles the LLM's dashboard program into A2UI 1.0:
 *
 * 1. Parse the DSL program into macro nodes.
 * 2. Expand the macros into catalog components and load their data.
 * 3. Wrap both into a single createSurface message.
 */
export async function compileDashboard(dsl: string): Promise<AgentToRendererMessage[]> {
  const nodes = parseDsl(dsl);
  const { components, dataModel } = await applyMacros(nodes, dashboardMacros);

  return [
    {
      version: '1.0',
      createSurface: {
        surfaceId: `dashboard-${randomUUID()}`,
        // The basic catalog plus the client's TicketWidget
        catalogId: DASHBOARD_CATALOG_ID,
        components,
        dataModel,
      },
    },
  ];
}
