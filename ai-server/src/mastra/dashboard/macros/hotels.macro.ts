import { z } from 'zod';

import { findNextDestination } from '../../data/flights';
import { findHotels } from '../../data/hotels';
import { defineMacro } from '../../dsl/macro';
import { card, imageList } from './components';

export const hotels = defineMacro({
  name: 'Hotels',
  description: 'Hotels in a city, with pictures.',
  args: z.object({
    city: z.string().optional().describe('Default: destination of my next booked flight.'),
    maxItems: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Maximum number of hotels (default: all).'),
  }),
  load: async ({ city, maxItems }) => {
    const hotelCity = city ?? (await findNextDestination());
    const items = findHotels(hotelCity)
      .slice(0, maxItems)
      .map((hotel) => ({
        image: hotel.image,
        title: hotel.name,
        subtitle: `${'★'.repeat(hotel.stars)} · from € ${hotel.pricePerNight} per night`,
      }));
    return { items };
  },
  render: ({ id }) => [
    ...card(id, 'Book a hotel', [`${id}_list`]),
    ...imageList(`${id}_list`, `/${id}/items`),
  ],
});
