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
}

export function HourlyForecast({ hours, unit, timezone }: HourlyForecastProps) {
  if (hours.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      aria-label="Hourly forecast"
    >
      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">
          Next 24 hours
        </h2>
        <div className="-mx-2 overflow-x-auto px-2 pb-1">
          <ul className="flex min-w-max gap-3">
            {hours.map((h, idx) => (
              <li
                key={h.time}
                className={`flex min-w-[88px] flex-col items-center gap-1 rounded-2xl px-3 py-3 text-center text-white transition ${
                  idx === 0 ? 'bg-white/15' : 'hover:bg-white/10'
                }`}
              >
                <span className="text-xs font-medium text-white/80">
                  {idx === 0 ? 'Now' : formatHour(h.time, timezone)}
                </span>
                <Image
                  src={h.condition.icon}
                  alt={h.condition.text}
                  width={48}
                  height={48}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-base font-semibold">
                  {formatTemperature(h.temperatureC, h.temperatureF, unit)}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-white/70">
                  <Droplets className="h-3 w-3" aria-hidden />
                  {h.chanceOfRain}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.section>
  );
}
