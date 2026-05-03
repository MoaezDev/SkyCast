import type { WeatherData } from '@/types/weather';
import type { WeatherApiSearchResult } from '@/types/weatherApi';

/**
 * Browser-side weather client.
 * All requests go through Next.js Route Handlers under `/api/*`, so the
 * upstream API key is never exposed to the client bundle.
 */

export class WeatherClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'WeatherClientError';
  }
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, cache: 'no-store' });
  const body = (await res.json().catch(() => null)) as
    | { error?: string }
    | T
    | null;

  if (!res.ok) {
    const message =
      (body as { error?: string } | null)?.error ??
      `Request failed with status ${res.status}`;
    throw new WeatherClientError(res.status, message);
  }
  return body as T;
}

export function getWeather(
  query: string,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const url = `/api/weather?q=${encodeURIComponent(query)}`;
  return getJson<WeatherData>(url, signal);
}

export function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<WeatherApiSearchResult[]> {
  if (!query.trim()) return Promise.resolve([]);
  const url = `/api/search?q=${encodeURIComponent(query)}`;
  return getJson<WeatherApiSearchResult[]>(url, signal);
}
