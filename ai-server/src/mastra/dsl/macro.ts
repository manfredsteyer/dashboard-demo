import type { z } from 'zod';

/**
 * A component in an A2UI 1.0 component list, e.g.
 * { id: 'title', component: 'Text', text: 'Hello' }
 */
export interface A2uiComponent {
  id: string;
  component: string;
  [property: string]: unknown;
}

/**
 * A macro call from the DSL program: the validated arguments plus the
 * id the parser assigned to it.
 */
export type MacroNode<TArgs extends z.ZodObject> = z.output<TArgs> & { id: string };

/**
 * A macro is a high-level component the LLM uses in its DSL program,
 * e.g. FlightsTable("Graz", "Hamburg"). The server expands it into
 * components of the A2UI basic catalog and loads the data they show.
 */
export interface Macro<TArgs extends z.ZodObject = z.ZodObject> {
  /** Name used in the DSL program. */
  name: string;

  /** Tells the LLM what the macro shows. */
  description: string;

  /** The arguments in positional order. */
  args: TArgs;

  /** Loads the data, which ends up in the data model at /<node.id>. */
  load?(node: MacroNode<TArgs>): Promise<unknown>;

  /** Returns the A2UI components. The root component must use node.id. */
  render(node: MacroNode<TArgs>): A2uiComponent[];
}

export function defineMacro<TArgs extends z.ZodObject>(macro: Macro<TArgs>): Macro<TArgs> {
  return macro;
}
