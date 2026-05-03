'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchLocations, WeatherClientError } from '@/services/weatherClient';
import type { WeatherApiSearchResult } from '@/types/weatherApi';

interface UseCitySearchResult {
  results: WeatherApiSearchResult[];
  loading: boolean;
  error: string | null;
}

/**
 * Debounced city autocomplete. Cancels in-flight requests when the input
 * changes so only the latest query's results are surfaced.
 */
export function useCitySearch(query: string, delay = 350): UseCitySearchResult {
  const debounced = useDebounce(query.trim(), delay);
  const [results, setResults] = useState<WeatherApiSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inflightRef = useRef<AbortController | null>(null);

  useEffect(() => {
    inflightRef.current?.abort();

    if (debounced.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    inflightRef.current = controller;
    setLoading(true);
    setError(null);

    searchLocations(debounced, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        setResults(res);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (err instanceof WeatherClientError) setError(err.message);
        else if (err instanceof Error) setError(err.message);
        else setError('Failed to search locations.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [debounced]);

  return { results, loading, error };
}
