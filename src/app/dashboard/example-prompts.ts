export const examplePrompts = [
  {
    label: 'Flight analytics',
    prompt: `Build a flight analytics dashboard with these tiles:
- All flights from Graz to Hamburg
- The delayed flights from Graz to Hamburg
- A bar chart with on-time vs. delayed flights per day
- A pie chart with the share of delayed flights
- The same tiles for flights from Hamburg to Graz`,
  },
  {
    label: 'My trips',
    prompt: `Build my personal travel dashboard.

Include the following tiles:
- A boarding-pass tile for my next two upcoming booked flights.
- A list of my booked flights with a check-in button per flight.
- A flight-search tile defaulting to Graz / Hamburg.
- A "Rent a car" tile with a list of possible cars.
- A "Book hotel" tile with a list of possible hotels.
- List with weather forecast for the destinations of all booked flights.`,
  },
];
