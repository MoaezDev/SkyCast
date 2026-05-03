'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type {
  CurrentWeather as CurrentWeatherT,
  Location,
  TemperatureUnit,
} from '@/types/weather';
import { Card } from '@/components/ui/Card';
import { formatFullDate, formatTemperature } from '@/utils/formatters';

interface CurrentWeatherProps {
  current: CurrentWeatherT;
  location: Location;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  /** Override the default `formatFullDate(localTime)` label. */
  dateLabel?: string;
  /** Override the default "Feels like X" sub-line. */
  secondaryLine?: string;
}

export function CurrentWeather({
  current,
  location,
  unit,
  onToggleUnit,
  dateLabel,
  secondaryLine,
}: CurrentWeatherProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Current weather"
    >
      <Card variant="accent" className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-white/90">
              <MapPin className="h-4 w-4" aria-hidden />
              <span>
                {location.name}
                {location.region ? `, ${location.region}` : ''}
                {location.country ? `, ${location.country}` : ''}
              </span>
            </div>
            <p className="text-sm text-white/80">
              {dateLabel ??
                formatFullDate(location.localTime, location.timezone)}
            </p>

            <div className="mt-4 flex items-end gap-3">
              <motion.span
                key={`${current.temperatureC}-${unit}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="text-7xl font-light leading-none tracking-tight sm:text-8xl"
              >
                {formatTemperature(
                  current.temperatureC,
                  current.temperatureF,
                  unit,
                )}
              </motion.span>
              <button
                type="button"
                onClick={onToggleUnit}
                aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
                className="mb-2 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-sm font-medium transition hover:bg-white/25"
              >
                °{unit === 'C' ? 'F' : 'C'}
              </button>
            </div>
            <p className="text-sm text-white/85">
              {secondaryLine ??
                `Feels like ${formatTemperature(
                  current.feelsLikeC,
                  current.feelsLikeF,
                  unit,
                )}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative h-28 w-28 sm:h-36 sm:w-36"
            >
              <Image
                src={current.condition.icon}
                alt={current.condition.text}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                priority
              />
            </motion.div>
            <p className="text-xl font-semibold sm:text-2xl">
              {current.condition.text}
            </p>
          </div>
        </div>
      </Card>
    </motion.section>
  );
}
