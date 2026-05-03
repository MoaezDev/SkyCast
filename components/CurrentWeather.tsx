'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { CurrentWeather as CurrentWeatherT, Location, TemperatureUnit } from '@/types/weather';
import { formatFullDate, formatTemperature } from '@/utils/formatters';

interface CurrentWeatherProps {
  current: CurrentWeatherT;
  location: Location;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
}

export function CurrentWeather({
  current,
  location,
  unit,
  onToggleUnit,
}: CurrentWeatherProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 text-white sm:flex-row sm:items-center sm:justify-between"
      aria-label="Current weather"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-white/80">
          <MapPin className="h-4 w-4" aria-hidden />
          <span>
            {location.name}
            {location.region ? `, ${location.region}` : ''}
            {location.country ? `, ${location.country}` : ''}
          </span>
        </div>
        <h1 className="text-base font-medium text-white/80 sm:text-lg">
          {formatFullDate(location.localTime, location.timezone)}
        </h1>

        <div className="mt-3 flex items-end gap-4">
          <motion.span
            key={`${current.temperatureC}-${unit}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="text-7xl font-light leading-none sm:text-8xl"
          >
            {formatTemperature(current.temperatureC, current.temperatureF, unit)}
          </motion.span>
          <button
            type="button"
            onClick={onToggleUnit}
            aria-label={`Switch temperature unit to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
            className="mb-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm transition hover:bg-white/20"
          >
            °{unit === 'C' ? 'F' : 'C'}
          </button>
        </div>
        <p className="text-sm text-white/80">
          Feels like{' '}
          {formatTemperature(current.feelsLikeC, current.feelsLikeF, unit)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative h-24 w-24 sm:h-32 sm:w-32"
        >
          <Image
            src={current.condition.icon}
            alt={current.condition.text}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-contain drop-shadow-md"
            priority
          />
        </motion.div>
        <p className="text-xl font-medium sm:text-2xl">
          {current.condition.text}
        </p>
      </div>
    </motion.section>
  );
}
