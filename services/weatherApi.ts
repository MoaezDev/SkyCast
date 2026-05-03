import axios, { AxiosError } from 'axios';
import type {
  WeatherApiErrorResponse,
  WeatherApiResponse,
  WeatherApiSearchResult,
} from '@/types/weatherApi';

/**
 * Server-side WeatherAPI.com client.
 * Used only by Next.js Route Handlers — the API key never ships to the browser.
 */

const BASE_URL =
  process.env.WEATHER_API_BASE_URL ?? 'https://api.weatherapi.com/v1';

const apiKey = process.env.WEATHER_API_KEY;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

function ensureKey(): string {
  if (!apiKey) {
    throw new Error(
      'Missing WEATHER_API_KEY. Add it to .env.local — see .env.local.example.',
    );
  }
  return apiKey;
}

export class WeatherApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

function toApiError(err: unknown): WeatherApiError {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<WeatherApiErrorResponse>;
    const status = axiosErr.response?.status ?? 500;
    const message =
      axiosErr.response?.data?.error?.message ??
      axiosErr.message ??
      'Weather service request failed.';
    return new WeatherApiError(status, message);
  }
  if (err instanceof Error) return new WeatherApiError(500, err.message);
  return new WeatherApiError(500, 'Unknown weather service error.');
}

/**
 * Fetch a 7-day forecast (current + hourly + daily) for a location query.
 * `q` may be a city name, "lat,lon" pair, IP, postal code, or IATA airport code.
 */
export async function fetchForecast(q: string): Promise<WeatherApiResponse> {
  try {
    const { data } = await client.get<WeatherApiResponse>('/forecast.json', {
      params: {
        key: ensureKey(),
        q,
        days: 7,
        aqi: 'no',
        alerts: 'no',
      },
    });
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

/** Search/autocomplete city suggestions for a partial query. */
export async function searchCities(
  q: string,
): Promise<WeatherApiSearchResult[]> {
  if (!q.trim()) return [];
  try {
    const { data } = await client.get<WeatherApiSearchResult[]>(
      '/search.json',
      { params: { key: ensureKey(), q } },
    );
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}
