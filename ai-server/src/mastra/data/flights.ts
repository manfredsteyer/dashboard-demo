const FLIGHT_API = 'https://demo.angulararchitects.io/api/flight';

// The demo has no user management: these flights are "my bookings".
const BOOKED_FLIGHT_IDS = [1, 2, 50, 516];

export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delay: number;
}

export async function findFlights(from: string, to: string): Promise<Flight[]> {
  const params = new URLSearchParams({ from, to });
  const flights = await fetchJson<Flight[]>(`${FLIGHT_API}?${params}`);
  return flights.map(toFlight);
}

export async function findBookedFlights(): Promise<Flight[]> {
  const flights = await Promise.all(
    BOOKED_FLIGHT_IDS.map((id) => fetchJson<Flight>(`${FLIGHT_API}/${id}`)),
  );
  return flights.map(toFlight).sort((a, b) => a.date.localeCompare(b.date));
}

export async function findNextDestination(): Promise<string> {
  const [nextFlight] = await findBookedFlights();
  return nextFlight?.to ?? 'Hamburg';
}

export function formatDate(flight: Flight): string {
  return flight.date.slice(0, 10);
}

export function formatTime(flight: Flight): string {
  return flight.date.slice(11, 16);
}

export function formatStatus(flight: Flight): string {
  return flight.delay > 0 ? `${flight.delay} min late` : 'On time';
}

function toFlight({ id, from, to, date, delay }: Flight): Flight {
  return { id, from, to, date, delay };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Flight API answered ${response.status} for ${url}`);
  }
  return response.json() as Promise<T>;
}
