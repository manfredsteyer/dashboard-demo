import { z } from 'zod';

import { findNextDestination } from '../../data/flights';
import { findRentalCars } from '../../data/rental-cars';
import { defineMacro } from '../../dsl/macro';
import { card, imageList } from './components';

export const rentalCars = defineMacro({
  name: 'RentalCars',
  description: 'Rental cars in a city, with pictures.',
  args: z.object({
    city: z.string().optional().describe('Default: destination of my next booked flight.'),
    maxItems: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Maximum number of cars (default: all).'),
  }),
  load: async ({ city, maxItems }) => {
    const carCity = city ?? (await findNextDestination());
    const items = findRentalCars(carCity)
      .slice(0, maxItems)
      .map((car) => ({
        image: car.image,
        title: `${car.category}: ${car.model}`,
        subtitle: `from € ${car.pricePerDay} per day in ${carCity}`,
      }));
    return { items };
  },
  render: ({ id }) => [
    ...card(id, 'Rent a car', [`${id}_list`]),
    ...imageList(`${id}_list`, `/${id}/items`),
  ],
});
