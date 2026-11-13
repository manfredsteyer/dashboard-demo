import { z } from 'zod';

import { type Flight, findFlights, formatDate, formatStatus, formatTime } from '../../data/flights';
import { defineMacro } from '../../dsl/macro';
import { bind, card, table } from './components';

const args = z.object({
  from: z.string(),
  to: z.string(),
  maxRows: z
    .number()
    .int()
    .positive()
    .default(10)
    .describe('Maximum number of rows (default: 10).'),
});

const columns = [
  { header: 'Flight', field: 'number' },
  { header: 'Date', field: 'date' },
  { header: 'Time', field: 'time' },
  { header: 'Status', field: 'status' },
];

export const flightsTable = defineMacro({
  name: 'FlightsTable',
  description: 'Table with the flights between two cities.',
  args,
  load: async ({ from, to, maxRows }) => {
    const flights = await findFlights(from, to);
    const rows = flights.slice(0, maxRows).map(toRow);
    return { rows, summary: `${rows.length} of ${flights.length} flights` };
  },
  render: ({ id, from, to }) => flightsCard(id, `Flights ${from} → ${to}`),
});

export const delayedFlightsTable = defineMacro({
  name: 'DelayedFlightsTable',
  description: 'Table with the delayed flights between two cities.',
  args,
  load: async ({ from, to, maxRows }) => {
    const flights = await findFlights(from, to);
    const delayed = flights.filter((flight) => flight.delay > 0);
    const rows = delayed.slice(0, maxRows).map(toRow);
    return { rows, summary: `${delayed.length} of ${flights.length} flights are delayed` };
  },
  render: ({ id, from, to }) => flightsCard(id, `Delayed flights ${from} → ${to}`),
});

function toRow(flight: Flight) {
  return {
    number: String(flight.id),
    date: formatDate(flight),
    time: formatTime(flight),
    status: formatStatus(flight),
  };
}

function flightsCard(id: string, title: string) {
  return [
    ...card(id, title, [`${id}_table`, `${id}_summary`]),
    ...table(`${id}_table`, `/${id}/rows`, columns),
    { id: `${id}_summary`, component: 'Text', text: bind(`/${id}/summary`), variant: 'caption' },
  ];
}
