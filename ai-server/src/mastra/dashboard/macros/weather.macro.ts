import { z } from 'zod';

import { findBookedFlights } from '../../data/flights';
import { forecast, formatForecast } from '../../data/weather';
import { defineMacro } from '../../dsl/macro';
import { card, itemList } from './components';

export const weatherList = defineMacro({
  name: 'WeatherList',
  description: 'Weather forecast for the destinations of my booked flights.',
  args: z.object({
    maxRows: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Maximum number of forecasts (default: all).'),
  }),
  load: async ({ maxRows }) => {
    const flights = await findBookedFlights();
    const items = flights.slice(0, maxRows).map((flight) => {
      const weather = forecast(flight.to, flight.date);
      return { title: flight.to, subtitle: `${weather.date}: ${formatForecast(weather)}` };
    });
    return { items };
  },
  render: ({ id }) => [
    ...card(id, 'Weather at my destinations', [`${id}_list`]),
    ...itemList(`${id}_list`, `/${id}/items`),
  ],
});
