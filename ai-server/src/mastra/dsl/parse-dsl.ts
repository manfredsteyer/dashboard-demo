import { A2uiGenerator, CatalogConfig, InMemoryCatalogProvider } from '@a2ui/agent';
import { z } from 'zod';

import type { A2uiComponent, Macro } from './macro';

const MACRO_CATALOG_ID = 'dashboard-macros';
const A2UI_VERSION = '1.0';

/**
 * Creates a parser for DSL programs written in A2UI Express, e.g.
 *
 *   root = Dashboard([FlightsTable("Graz", "Hamburg", maxRows=5)])
 *
 * The parser only accepts the given macros, checks their arguments, and
 * returns one A2UI component (= macro node) per macro call.
 */
export function createDslParser(macros: Macro[]) {
  const catalog = new InMemoryCatalogProvider(toMacroCatalog(macros), A2UI_VERSION).load();
  const generator = new A2uiGenerator([new CatalogConfig(catalog)]);
  const processor = generator.createProcessor({ supportedCatalogIds: [MACRO_CATALOG_ID] });

  return (dsl: string): A2uiComponent[] => {
    const parts = processor.parseResponse(`<a2ui>${dsl}</a2ui>`);
    const messages = parts.flatMap((part) => (part.type === 'a2ui' ? part.a2ui : []));
    const components = messages.flatMap((message) =>
      'createSurface' in message ? (message.createSurface.components ?? []) : [],
    );

    if (components.length === 0) {
      throw new Error('The DSL program does not render any component.');
    }
    return components as A2uiComponent[];
  };
}

/**
 * Describes each macro as a catalog component. Its JSON schema lists
 * the arguments in positional order.
 */
function toMacroCatalog(macros: Macro[]) {
  const components = Object.fromEntries(
    macros.map((macro) => {
      const schema = z.object({ component: z.literal(macro.name) }).extend(macro.args.shape);
      // 'input' keeps arguments with a default optional
      return [macro.name, schema.toJSONSchema({ io: 'input' })];
    }),
  );
  return { catalogId: MACRO_CATALOG_ID, components };
}
