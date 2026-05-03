'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import type { TemperatureUnit } from '@/types/weather';
import { buildDayView } from '@/utils/dayView';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CurrentWeather } from '@/components/CurrentWeather';
import { DailyForecast } from '@/components/DailyForecast';
import { ErrorMessage } from '@/components/ErrorMessage';
import { HourlyForecast } from '@/components/HourlyForecast';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WeatherDetails } from '@/components/WeatherDetails';
import { WeatherSkeleton } from '@/components/skeletons/WeatherSkeleton';

interface WeatherViewProps {
  defaultLocation: string;
}

export function WeatherView({ defaultLocation }: WeatherViewProps) {
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const autoLocatedRef = useRef(false);

  const {
    loading: locLoading,
    error: locError,
    request: requestLocation,
  } = useGeolocation();

  const { data, error, status, refetch, setQuery } =
    useWeather(defaultLocation);

  // Reset to "today" whenever a new location's data arrives.
  useEffect(() => {
    setSelectedDayIndex(0);
  }, [data?.location.name, data?.location.latitude, data?.location.longitude]);

  // On first mount, try to silently swap from the default city to the user's
  // actual location. If it fails (denied/blocked), we just stay on default.
  useEffect(() => {
    if (autoLocatedRef.current) return;
    autoLocatedRef.current = true;
    void requestLocation()
      .then((c) => setQuery(`${c.latitude},${c.longitude}`))
      .catch(() => {
        /* keep default location */
      });
  }, [requestLocation, setQuery]);

  // Explicit click on the "use my location" button. Always re-requests fresh
  // coordinates and swaps the active query.
  const handleUseMyLocation = useCallback(async () => {
    try {
      const c = await requestLocation();
      setQuery(`${c.latitude},${c.longitude}`);
    } catch {
      // hook state already holds the readable error message
    }
  }, [requestLocation, setQuery]);

  const dayView = useMemo(
    () => (data ? buildDayView(data, selectedDayIndex, unit) : null),
    [data, selectedDayIndex, unit],
  );

  return (
    <>
      <AnimatedBackground />

      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>
              🌤️
            </span>
            <span className="text-lg font-semibold text-white">SkyCast</span>
          </div>
          <ThemeToggle />
        </header>

        <SearchBar
          onSelect={setQuery}
          onUseMyLocation={handleUseMyLocation}
          loadingLocation={locLoading}
        />

        {locError && (
          <p
            className="rounded-2xl bg-white/95 px-4 py-2 text-center text-xs font-medium text-amber-700 shadow-sm dark:bg-amber-500/15 dark:text-amber-200"
            role="status"
          >
            {locError}
          </p>
        )}

        <main className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <WeatherSkeleton />
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ErrorMessage
                  message={error ?? 'Failed to load weather data.'}
                  onRetry={refetch}
                />
              </motion.div>
            )}

            {status === 'success' && data && dayView && (
              <motion.div
                key={`weather-${data.location.name}-${data.current.lastUpdated}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                <CurrentWeather
                  current={dayView.current}
                  location={data.location}
                  unit={unit}
                  onToggleUnit={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
                  dateLabel={dayView.dateLabel}
                  secondaryLine={dayView.secondaryLine}
                />
                <WeatherDetails current={dayView.current} today={dayView.day} />
                <HourlyForecast
                  hours={dayView.hours}
                  unit={unit}
                  timezone={data.location.timezone}
                  showNowPill={dayView.isToday}
                  title={
                    dayView.isToday ? 'Hourly Overview' : 'Hourly Forecast'
                  }
                />
                <DailyForecast
                  days={data.daily}
                  unit={unit}
                  location={data.location}
                  selectedIndex={selectedDayIndex}
                  onSelect={setSelectedDayIndex}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-auto pt-6 text-center text-xs text-white/60">
          Powered by{' '}
          <a
            href="https://www.weatherapi.com/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            WeatherAPI.com
          </a>
        </footer>
      </div>
    </>
  );
}
