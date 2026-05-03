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
  /** Whether to attempt to read the location automatically on mount. */
  immediate?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const DEFAULTS: Required<Omit<UseGeolocationOptions, 'immediate'>> = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 5 * 60_000,
};

function describeError(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return 'Location permission denied. Allow it in your browser settings to use this feature.';
    case err.POSITION_UNAVAILABLE:
      return 'Location is currently unavailable.';
    case err.TIMEOUT:
      return 'Location request timed out.';
    default:
      return 'Could not determine your location.';
  }
}

/**
 * Wraps the browser Geolocation API with a stable React-friendly surface.
 *
 * - `request()` returns a Promise<Coordinates> so callers can `await` the
 *   result and act on it (e.g. setting a search query). It still updates the
 *   hook's internal state so any UI bound to `coords` / `loading` / `error`
 *   stays in sync.
 */
export function useGeolocation(opts: UseGeolocationOptions = {}) {
  const { immediate = false } = opts;
  const enableHighAccuracy =
    opts.enableHighAccuracy ?? DEFAULTS.enableHighAccuracy;
  const timeout = opts.timeout ?? DEFAULTS.timeout;
  const maximumAge = opts.maximumAge ?? DEFAULTS.maximumAge;

  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: false,
    unsupported: false,
  });

  const request = useCallback((): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('geolocation' in navigator)) {
        const message = 'Geolocation is not supported in this browser.';
        setState({
          coords: null,
          error: message,
          loading: false,
          unsupported: true,
        });
        reject(new Error(message));
        return;
      }

      setState((s) => ({ ...s, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c: Coordinates = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setState({
            coords: c,
            error: null,
            loading: false,
            unsupported: false,
          });
          resolve(c);
        },
        (err) => {
          const message = describeError(err);
          setState({
            coords: null,
            error: message,
            loading: false,
            unsupported: false,
          });
          reject(new Error(message));
        },
        { enableHighAccuracy, timeout, maximumAge },
      );
    });
  }, [enableHighAccuracy, timeout, maximumAge]);

  useEffect(() => {
    if (!immediate) return;
    // Swallow rejection — caller for auto-mount only cares about success.
    void request().catch(() => {});
  }, [immediate, request]);

  return { ...state, request };
}
