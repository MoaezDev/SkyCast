'use client';

import { motion } from 'framer-motion';
import {
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { CurrentWeather, DailyForecastEntry } from '@/types/weather';
import { Card } from '@/components/ui/Card';

interface WeatherDetailsProps {
  current: CurrentWeather;
  today: DailyForecastEntry | undefined;
}

interface DetailItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}

function DetailItem({ icon, label, value, hint }: DetailItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300"
        >
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {hint && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}

export function WeatherDetails({ current, today }: WeatherDetailsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      aria-label="Today's highlights"
    >
      <Card>
        <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Today&apos;s Highlights
        </h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          <DetailItem
            icon={<Droplets className="h-4 w-4" />}
            label="Humidity"
            value={`${current.humidity}%`}
          />
          <DetailItem
            icon={<Wind className="h-4 w-4" />}
            label="Wind"
            value={`${Math.round(current.windKph)} km/h`}
            hint={current.windDirection}
          />
          <DetailItem
            icon={<Gauge className="h-4 w-4" />}
            label="Pressure"
            value={`${Math.round(current.pressureMb)} mb`}
          />
          <DetailItem
            icon={<Eye className="h-4 w-4" />}
            label="Visibility"
            value={`${Math.round(current.visibilityKm)} km`}
          />
          <DetailItem
            icon={<Thermometer className="h-4 w-4" />}
            label="UV Index"
            value={`${Math.round(current.uv)}`}
          />
          <DetailItem
            icon={<Droplets className="h-4 w-4" />}
            label="Cloud Cover"
            value={`${current.cloudCover}%`}
          />
          {today && (
            <>
              <DetailItem
                icon={<Sunrise className="h-4 w-4" />}
                label="Sunrise"
                value={today.sunrise}
              />
              <DetailItem
                icon={<Sunset className="h-4 w-4" />}
                label="Sunset"
                value={today.sunset}
              />
            </>
          )}
        </div>
      </Card>
    </motion.section>
  );
}
