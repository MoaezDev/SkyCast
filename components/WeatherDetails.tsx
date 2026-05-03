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
    <div className="flex items-start gap-3">
      <div
        aria-hidden
        className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wide text-white/70">
          {label}
        </span>
        <span className="text-lg font-semibold text-white">{value}</span>
        {hint && <span className="text-xs text-white/60">{hint}</span>}
      </div>
    </div>
  );
}

export function WeatherDetails({ current, today }: WeatherDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        <DetailItem
          icon={<Droplets className="h-5 w-5" />}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <DetailItem
          icon={<Wind className="h-5 w-5" />}
          label="Wind"
          value={`${Math.round(current.windKph)} km/h`}
          hint={current.windDirection}
        />
        <DetailItem
          icon={<Gauge className="h-5 w-5" />}
          label="Pressure"
          value={`${Math.round(current.pressureMb)} mb`}
        />
        <DetailItem
          icon={<Eye className="h-5 w-5" />}
          label="Visibility"
          value={`${Math.round(current.visibilityKm)} km`}
        />
        <DetailItem
          icon={<Thermometer className="h-5 w-5" />}
          label="UV Index"
          value={`${Math.round(current.uv)}`}
        />
        <DetailItem
          icon={<Droplets className="h-5 w-5" />}
          label="Cloud Cover"
          value={`${current.cloudCover}%`}
        />
        {today && (
          <>
            <DetailItem
              icon={<Sunrise className="h-5 w-5" />}
              label="Sunrise"
              value={today.sunrise}
            />
            <DetailItem
              icon={<Sunset className="h-5 w-5" />}
              label="Sunset"
              value={today.sunset}
            />
          </>
        )}
      </Card>
    </motion.div>
  );
}
