'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Coordinates } from '@/types/weather';

interface GeolocationState {
  coords: Coordinates | null;
  error: string | null;
  loading: boolean;
  unsupported: boolean;
}

interface UseGeolocationOptions {
  /** Whether to request the location automatically on mount. Default: true. */
  immediate?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * Wraps the browser Geolocation API with a stable React-friendly surface.
 * Returns the coordinates, a loading flag, an error message (if any),
 * and a `request()` function that can be called to retry or trigger
 * location lookup on demand.
 */
export function useGeolocation(opts: UseGeolocationOptions = {}) {
  const {
    immediate = true,
    enableHighAccuracy = false,
    timeout = 10_000,
    maximumAge = 5 * 60_000,
  } = opts;

  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: false,
    unsupported: false,
  });

  const request = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setState({
        coords: null,
        error: 'Geolocation is not supported in this browser.',
        loading: false,
        unsupported: true,
      });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          error: null,
          loading: false,
          unsupported: false,
        });
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied.'
            : err.code === err.POSITION_UNAVAILABLE
              ? 'Location currently unavailable.'
              : err.code === err.TIMEOUT
                ? 'Location request timed out.'
                : 'Could not determine your location.';
        setState({
          coords: null,
          error: message,
          loading: false,
          unsupported: false,
        });
      },
      { enableHighAccuracy, timeout, maximumAge },
    );
  }, [enableHighAccuracy, timeout, maximumAge]);

  useEffect(() => {
    if (immediate) request();
  }, [immediate, request]);

  return { ...state, request };
}
