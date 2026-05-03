'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import type { HourlyForecastEntry, TemperatureUnit } from '@/types/weather';
import { Card } from '@/components/ui/Card';
import { formatHour, formatTemperature } from '@/utils/formatters';

interface HourlyForecastProps {
  hours: HourlyForecastEntry[];
  unit: TemperatureUnit;
  timezone: string;
  /** Show the "Now" pill on the first hour. Disable for non-today views. */
  showNowPill?: boolean;
  /** Title shown above the list. */
  title?: string;
}

export function HourlyForecast({
  hours,
  unit,
  timezone,
  showNowPill = true,
  title = 'Hourly Overview',
}: HourlyForecastProps) {
  if (hours.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      aria-label="Hourly forecast"
    >
      <Card>
        <header className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {showNowPill ? 'Next 24h' : '24h'}
          </span>
        </header>

        <div className="-mx-2 overflow-x-auto px-2 pb-2">
          <ul className="flex min-w-max gap-2.5">
            {hours.map((h, idx) => {
              const isNow = showNowPill && idx === 0;
              return (
                <li
                  key={h.time}
                  className={`relative flex min-w-[88px] flex-col items-center gap-1.5 rounded-2xl px-3 py-3 text-center transition ${
                    isNow
                      ? 'bg-gradient-to-b from-sky-500 to-blue-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-700/60 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isNow
                        ? 'text-white/90'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {showNowPill && idx === 0
                      ? 'Now'
                      : formatHour(h.time, timezone)}
                  </span>
                  <Image
                    src={h.condition.icon}
                    alt={h.condition.text}
                    width={48}
                    height={48}
                    className="h-11 w-11 object-contain drop-shadow-sm"
                  />
                  <span className="text-base font-bold">
                    {formatTemperature(h.temperatureC, h.temperatureF, unit)}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[10px] ${
                      isNow
                        ? 'text-white/85'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Droplets className="h-3 w-3" aria-hidden />
                    {h.chanceOfRain}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
    </motion.section>
  );
}
