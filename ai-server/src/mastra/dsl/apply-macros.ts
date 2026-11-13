import type { A2uiComponent, Macro } from './macro';

export interface ExpandedSurface {
  components: A2uiComponent[];
  dataModel: Record<string, unknown>;
}

interface Expansion {
  id: string;
  components: A2uiComponent[];
  data?: unknown;
}

/**
 * Replaces every macro node with the A2UI components its macro renders
 * and collects the data the macros load. All macros load in parallel.
 */
export async function applyMacros(
  nodes: A2uiComponent[],
  macros: Macro[],
): Promise<ExpandedSurface> {
  const macrosByName = new Map(macros.map((macro) => [macro.name, macro]));

  const expansions = await Promise.all(
    nodes.map(async (node): Promise<Expansion> => {
      const macro = macrosByName.get(node.component);
      if (!macro) {
        return { id: node.id, components: [node] };
      }

      const args = { ...macro.args.parse(node), id: node.id };
      const data = await macro.load?.(args);
      return { id: node.id, components: macro.render(args), data };
    }),
  );

  return {
    components: expansions.flatMap((expansion) => expansion.components),
    dataModel: Object.fromEntries(
      expansions
        .filter((expansion) => expansion.data !== undefined)
        .map((expansion) => [expansion.id, expansion.data]),
    ),
  };
}
