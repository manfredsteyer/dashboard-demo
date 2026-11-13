import type { Macro } from '../../dsl/macro';
import { boardingPasses } from './boarding-passes.macro';
import { bookedFlightsList } from './booked-flights.macro';
import { dashboard } from './dashboard.macro';
import { delayShareChart, delaysPerDayChart } from './delay-charts.macro';
import { flightSearch } from './flight-search.macro';
import { delayedFlightsTable, flightsTable } from './flights-table.macro';
import { hotels } from './hotels.macro';
import { rentalCars } from './rental-cars.macro';
import { weatherList } from './weather.macro';

/**
 * Everything the LLM can use in its dashboard program.
 */
export const dashboardMacros: Macro[] = [
  dashboard,
  flightsTable,
  delayedFlightsTable,
  delaysPerDayChart,
  delayShareChart,
  boardingPasses,
  bookedFlightsList,
  flightSearch,
  rentalCars,
  hotels,
  weatherList,
];
