'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getWeather, WeatherClientError } from '@/services/weatherClient';
import type { WeatherData } from '@/types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseWeatherResult {
  data: WeatherData | null;
  error: string | null;
  status: WeatherStatus;
  refetch: () => void;
  setQuery: (query: string) => void;
  query: string | null;
}

/**
 * Fetches and caches weather data for the active query. The query can be a
 * city name (`"London"`) or a "lat,lon" pair (`"51.5,-0.12"`).
 */
export function useWeather(
  initialQuery: string | null = null,
): UseWeatherResult {
  const [query, setQuery] = useState<string | null>(initialQuery);
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const inflightRef = useRef<AbortController | null>(null);

  const load = useCallback(async (q: string) => {
    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;

    setStatus('loading');
    setError(null);

    try {
      const result = await getWeather(q, controller.signal);
      if (controller.signal.aborted) return;
      setData(result);
      setStatus('success');
    } catch (err) {
      if (controller.signal.aborted) return;
      const message =
        err instanceof WeatherClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Something went wrong while fetching the weather.';
      setError(message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!query) return;
    void load(query);
    return () => inflightRef.current?.abort();
  }, [query, load]);

  const refetch = useCallback(() => {
    if (query) void load(query);
  }, [query, load]);

  return { data, error, status, refetch, setQuery, query };
}
