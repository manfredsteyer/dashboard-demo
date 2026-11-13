import { z } from 'zod';

import { defineMacro } from '../../dsl/macro';

export const dashboard = defineMacro({
  name: 'Dashboard',
  description: 'The root of every program. Lists the tiles in display order.',
  args: z.object({
    // Marks the argument as a list of child components (A2UI's ChildList)
    children: z.array(z.string()).meta({ $ref: 'common_types.json#/$defs/ChildList' }),
  }),
  render: ({ id, children }) => [{ id, component: 'Column', children }],
});
