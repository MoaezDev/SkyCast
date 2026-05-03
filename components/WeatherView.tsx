'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import type { TemperatureUnit } from '@/types/weather';
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
  const { coords, loading: locLoading, error: locError, request } =
    useGeolocation({ immediate: true });
  const { data, error, status, refetch, setQuery, query } = useWeather(
    defaultLocation,
  );

  // When geolocation resolves and there is no explicit user query yet, switch
  // to the user's coordinates.
  useEffect(() => {
    if (coords && (!query || query === defaultLocation)) {
      setQuery(`${coords.latitude},${coords.longitude}`);
    }
  }, [coords, query, defaultLocation, setQuery]);

  const today = useMemo(() => data?.daily[0], [data]);

  return (
    <>
      <AnimatedBackground
        conditionCode={data?.current.condition.code}
        isDay={data?.current.condition.isDay ?? true}
      />

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
          onUseMyLocation={request}
          loadingLocation={locLoading}
        />

        {locError && !data && (
          <p className="text-center text-xs text-white/70">
            {locError} Showing default forecast for{' '}
            <span className="font-medium">{defaultLocation}</span>.
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

            {status === 'success' && data && (
              <motion.div
                key={`weather-${data.location.name}-${data.current.lastUpdated}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                <CurrentWeather
                  current={data.current}
                  location={data.location}
                  unit={unit}
                  onToggleUnit={() =>
                    setUnit((u) => (u === 'C' ? 'F' : 'C'))
                  }
                />
                <WeatherDetails current={data.current} today={today} />
                <HourlyForecast
                  hours={data.hourly}
                  unit={unit}
                  timezone={data.location.timezone}
                />
                <DailyForecast days={data.daily} unit={unit} />
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
