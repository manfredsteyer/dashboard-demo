import { z } from 'zod';

import { type Flight, findBookedFlights, formatDate, formatStatus } from '../../data/flights';
import { forecast, formatForecast } from '../../data/weather';
import { defineMacro } from '../../dsl/macro';
import { bind, button, card, itemList } from './components';

export const bookedFlightsList = defineMacro({
  name: 'BookedFlightsList',
  description: 'List of my booked flights.',
  args: z.object({
    showCheckInButton: z
      .boolean()
      .default(true)
      .describe('Adds a check-in button per flight (default: true).'),
    showWeather: z
      .boolean()
      .default(true)
      .describe('Adds the weather forecast for the destination (default: true).'),
    maxRows: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Maximum number of flights (default: all).'),
  }),
  load: async ({ showWeather, maxRows }) => {
    const flights = await findBookedFlights();
    const items = flights.slice(0, maxRows).map((flight) => ({
      flightId: flight.id,
      title: `${flight.from} → ${flight.to}`,
      subtitle: details(flight, showWeather),
    }));
    return { items };
  },
  render: ({ id, showCheckInButton }) => {
    const checkInId = `${id}_checkin`;
    // The button is part of the item template, so 'flightId' is the
    // flightId of the current list entry.
    const checkIn = button(checkInId, 'Check in', {
      name: 'checkIn',
      context: { flightId: bind('flightId') },
    });

    return [
      ...card(id, 'My booked flights', [`${id}_list`]),
      ...itemList(`${id}_list`, `/${id}/items`, showCheckInButton ? [checkInId] : []),
      ...(showCheckInButton ? checkIn : []),
    ];
  },
});

function details(flight: Flight, showWeather: boolean): string {
  const details = [formatDate(flight), formatStatus(flight)];
  if (showWeather) {
    details.push(formatForecast(forecast(flight.to, flight.date)));
  }
  return details.join(' · ');
}
