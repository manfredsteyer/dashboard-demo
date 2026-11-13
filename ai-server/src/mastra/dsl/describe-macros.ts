import type { z } from 'zod';

import type { Macro } from './macro';

/**
 * Lists the macros for the system prompt, e.g.
 *
 * - FlightsTable(from, to, maxRows?): Table with the flights between two cities.
 *     maxRows: Maximum number of rows (default: 10).
 */
export function describeMacros(macros: Macro[]): string {
  return macros.map(describeMacro).join('\n');
}

function describeMacro(macro: Macro): string {
  const args = Object.entries(macro.args.shape as Record<string, z.ZodType>);
  const params = args.map(([name, schema]) => (isOptional(schema) ? `${name}?` : name));

  const lines = [`- ${macro.name}(${params.join(', ')}): ${macro.description}`];
  for (const [name, schema] of args) {
    if (schema.description) {
      lines.push(`    ${name}: ${schema.description}`);
    }
  }
  return lines.join('\n');
}

function isOptional(schema: z.ZodType): boolean {
  return schema.safeParse(undefined).success;
}
