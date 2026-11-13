import { z } from 'zod';

import { barChart, type ChartData, pieChart } from '../../charts/charts';
import { publishChart } from '../../charts/charts.route';
import { findFlights, formatDate } from '../../data/flights';
import { defineMacro } from '../../dsl/macro';
import { bind, card } from './components';

export const delayShareChart = defineMacro({
  name: 'DelayShareChart',
  description: 'Chart comparing on-time and delayed flights between two cities.',
  args: z.object({
    from: z.string(),
    to: z.string(),
    chartType: z.enum(['pie', 'bar']).default('pie').describe('"pie" (default) or "bar".'),
  }),
  load: async ({ from, to, chartType }) => {
    const flights = await findFlights(from, to);
    const delayed = flights.filter((flight) => flight.delay > 0).length;
    const data: ChartData = {
      labels: ['On time', 'Delayed'],
      series: [{ name: 'Flights', values: [flights.length - delayed, delayed] }],
    };
    const svg = chartType === 'pie' ? pieChart(data) : barChart(data);
    return { url: publishChart(svg) };
  },
  render: ({ id, from, to }) => chartCard(id, `Delay share ${from} → ${to}`),
});

export const delaysPerDayChart = defineMacro({
  name: 'DelaysPerDayChart',
  description: 'Bar chart with on-time and delayed flights per day between two cities.',
  args: z.object({
    from: z.string(),
    to: z.string(),
  }),
  load: async ({ from, to }) => {
    const flights = await findFlights(from, to);
    const days = [...new Set(flights.map(formatDate))].sort();
    const count = (day: string, delayed: boolean) =>
      flights.filter((f) => formatDate(f) === day && f.delay > 0 === delayed).length;

    const data: ChartData = {
      labels: days.map((day) => day.slice(5)),
      series: [
        { name: 'On time', values: days.map((day) => count(day, false)) },
        { name: 'Delayed', values: days.map((day) => count(day, true)) },
      ],
    };
    return { url: publishChart(barChart(data)) };
  },
  render: ({ id, from, to }) => chartCard(id, `Delays per day ${from} → ${to}`),
});

function chartCard(id: string, title: string) {
  return [
    ...card(id, title, [`${id}_chart`]),
    {
      id: `${id}_chart`,
      component: 'Image',
      url: bind(`/${id}/url`),
      description: title,
      variant: 'largeFeature',
      fit: 'contain',
      // Takes the remaining height of the tile
      weight: 1,
    },
  ];
}
