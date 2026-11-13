import { z } from 'zod';

import { findBookedFlights } from '../../data/flights';
import { defineMacro } from '../../dsl/macro';
import { bind } from './components';

export const boardingPasses = defineMacro({
  name: 'BoardingPasses',
  description: 'Boarding passes for my next booked flights.',
  args: z.object({
    count: z
      .number()
      .int()
      .positive()
      .max(8)
      .default(2)
      .describe('Number of boarding passes (default: 2).'),
  }),
  load: async ({ count }) => {
    const flights = await findBookedFlights();
    return { tickets: flights.slice(0, count) };
  },
  render: ({ id }) => {
    const ticketId = `${id}_ticket`;
    return [
      // One TicketWidget per ticket. It's a custom component of our
      // catalog, implemented by the client.
      { id, component: 'Column', children: { componentId: ticketId, path: `/${id}/tickets` } },
      { id: ticketId, component: 'TicketWidget', ticket: bind('.') },
    ];
  },
});
