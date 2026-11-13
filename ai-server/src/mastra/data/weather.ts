export interface Forecast {
  city: string;
  date: string;
  icon: string;
  condition: string;
  temperature: number;
}

const CONDITIONS = [
  { condition: 'Sunny', icon: '☀️' },
  { condition: 'Partly cloudy', icon: '⛅' },
  { condition: 'Cloudy', icon: '☁️' },
  { condition: 'Rain', icon: '🌧️' },
  { condition: 'Thunder', icon: '⛈️' },
];

/**
 * A fake forecast: the same city and date always give the same weather.
 */
export function forecast(city: string, date: string): Forecast {
  const day = date.slice(0, 10);
  const seed = hash(`${city}|${day}`);
  const { condition, icon } = CONDITIONS[seed % CONDITIONS.length];
  return { city, date: day, icon, condition, temperature: seed % 25 };
}

export function formatForecast(forecast: Forecast): string {
  return `${forecast.icon} ${forecast.condition}, ${forecast.temperature} °C`;
}

function hash(value: string): number {
  let result = 0;
  for (const char of value) {
    result = (result * 31 + char.charCodeAt(0)) | 0;
  }
  return Math.abs(result);
}
