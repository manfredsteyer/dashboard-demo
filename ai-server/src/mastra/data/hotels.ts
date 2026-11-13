export interface Hotel {
  name: string;
  stars: number;
  pricePerNight: number;
  image: string;
}

// The images are static assets of the Angular app (public/images).
const HOTEL_TEMPLATES = [
  {
    suffix: 'Grand Hotel',
    stars: 5,
    pricePerNight: 240,
    image: '/images/hotels/hotel-luxury.webp',
  },
  {
    suffix: 'City Lodge',
    stars: 3,
    pricePerNight: 95,
    image: '/images/hotels/hotel-exterior.webp',
  },
  {
    suffix: 'Boutique Suites',
    stars: 4,
    pricePerNight: 160,
    image: '/images/hotels/hotel-interior.webp',
  },
  { suffix: 'Airport Inn', stars: 3, pricePerNight: 80, image: '/images/hotels/hotel-lobby.webp' },
];

/**
 * Fake hotel search: every city has the same four hotels.
 */
export function findHotels(city: string): Hotel[] {
  return HOTEL_TEMPLATES.map(({ suffix, ...hotel }) => ({
    ...hotel,
    name: `${city} ${suffix}`,
  }));
}
