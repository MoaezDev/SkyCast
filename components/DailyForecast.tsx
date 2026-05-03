'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import type { DailyForecastEntry, TemperatureUnit } from '@/types/weather';
import { Card } from '@/components/ui/Card';
import { formatDay, formatTemperature, isToday } from '@/utils/formatters';

interface DailyForecastProps {
  days: DailyForecastEntry[];
  unit: TemperatureUnit;
}

export function DailyForecast({ days, unit }: DailyForecastProps) {
  if (days.length === 0) return null;

  const minTemp = Math.min(...days.map((d) => d.minTempC));
  const maxTemp = Math.max(...days.map((d) => d.maxTempC));
  const range = Math.max(maxTemp - minTemp, 1);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      aria-label="7-day forecast"
    >
      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">
          7-day forecast
        </h2>
        <ul className="flex flex-col divide-y divide-white/10">
          {days.map((d) => {
            const startPct = ((d.minTempC - minTemp) / range) * 100;
            const widthPct = ((d.maxTempC - d.minTempC) / range) * 100;
            return (
              <li
                key={d.date}
                className="grid grid-cols-[80px_44px_1fr_120px] items-center gap-3 py-3 text-white sm:grid-cols-[100px_48px_1fr_140px]"
              >
                <span className="text-sm font-medium">
                  {isToday(d.date) ? 'Today' : formatDay(d.date, { short: true })}
                </span>
                <Image
                  src={d.condition.icon}
                  alt={d.condition.text}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="text-xs text-white/70">
                    {formatTemperature(d.minTempC, d.minTempF, unit)}
                  </span>
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-sky-300 to-amber-300"
                      style={{
                        left: `${startPct}%`,
                        width: `${Math.max(widthPct, 8)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {formatTemperature(d.maxTempC, d.maxTempF, unit)}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-3 sm:hidden">
                  <span className="text-xs text-white/70">
                    {formatTemperature(d.minTempC, d.minTempF, unit)} /
                  </span>
                  <span className="text-sm font-semibold">
                    {formatTemperature(d.maxTempC, d.maxTempF, unit)}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1 text-xs text-white/70">
                  <Droplets className="h-3.5 w-3.5" aria-hidden />
                  {d.chanceOfRain}%
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </motion.section>
  );
}
