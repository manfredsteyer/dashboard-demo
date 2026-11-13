import { z } from 'zod';

import { defineMacro } from '../../dsl/macro';
import { bind, button, card } from './components';

export const flightSearch = defineMacro({
  name: 'FlightSearch',
  description: 'Form for searching flights.',
  args: z.object({
    defaultFrom: z.string().default('Graz').describe('Default: "Graz".'),
    defaultTo: z.string().default('Hamburg').describe('Default: "Hamburg".'),
  }),
  load: async ({ defaultFrom, defaultTo }) => ({ from: defaultFrom, to: defaultTo }),
  render: ({ id }) => {
    // Two-way bindings: the text fields write the user's input back
    // into the data model, where the button's action reads it.
    const from = bind(`/${id}/from`);
    const to = bind(`/${id}/to`);
    // The renderer doesn't connect label and input yet, so the
    // placeholder provides the accessible name.
    return [
      ...card(id, 'Find a flight', [`${id}_from`, `${id}_to`, `${id}_search`]),
      {
        id: `${id}_from`,
        component: 'TextField',
        label: 'From',
        placeholder: 'Departure city',
        value: from,
      },
      {
        id: `${id}_to`,
        component: 'TextField',
        label: 'To',
        placeholder: 'Destination city',
        value: to,
      },
      ...button(
        `${id}_search`,
        'Search',
        { name: 'searchFlights', context: { from, to } },
        'primary',
      ),
    ];
  },
});
