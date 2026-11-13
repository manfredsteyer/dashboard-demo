export interface RentalCar {
  category: string;
  model: string;
  pricePerDay: number;
  image: string;
}

// The images are static assets of the Angular app (public/images).
const CARS: RentalCar[] = [
  { category: 'Compact', model: 'VW Polo', pricePerDay: 39, image: '/images/cars/vw-polo.webp' },
  {
    category: 'Estate',
    model: 'Skoda Octavia',
    pricePerDay: 69,
    image: '/images/cars/skoda-octavia.webp',
  },
  { category: 'Premium', model: 'BMW 5', pricePerDay: 119, image: '/images/cars/bmw-5.webp' },
];

/**
 * Fake car rental: every city has the same three cars.
 */
export function findRentalCars(_city: string): RentalCar[] {
  return CARS;
}
