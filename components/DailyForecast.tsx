'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Wind } from 'lucide-react';
import type {
  DailyForecastEntry,
  Location,
  TemperatureUnit,
} from '@/types/weather';
import { Card } from '@/components/ui/Card';
import { formatDay } from '@/utils/formatters';

interface DailyForecastProps {
  days: DailyForecastEntry[];
  unit: TemperatureUnit;
  location: Location;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function formatRangeLabel(days: DailyForecastEntry[]): string {
  if (days.length === 0) return '';
  const first = new Date(`${days[0].date}T00:00:00`);
  const last = new Date(`${days[days.length - 1].date}T00:00:00`);
  const month = first.toLocaleDateString('en-US', { month: 'short' });
  return `${month} ${first.getDate()}–${last.getDate()}`;
}

export function DailyForecast({
  days,
  unit,
  location,
  selectedIndex,
  onSelect,
}: DailyForecastProps) {
  if (days.length === 0) return null;
  const range = formatRangeLabel(days);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      aria-label="7-day forecast"
    >
      <Card>
        <header className="mb-5 flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            7-Day Forecast
          </h2>
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            <span>{location.name}</span>
            <span className="text-slate-300 dark:text-slate-600">◆</span>
            <span>{range}</span>
          </p>
        </header>

        <div className="-mx-2 overflow-x-auto px-2 pb-1">
          <ul className="grid min-w-max grid-cols-7 gap-2 sm:gap-3">
            {days.map((d, idx) => {
              const date = new Date(`${d.date}T00:00:00`);
              const dayLabel = formatDay(d.date, { short: true }).toUpperCase();
              const hi = unit === 'C' ? d.maxTempC : d.maxTempF;
              const lo = unit === 'C' ? d.minTempC : d.minTempF;
              const peakWind = Math.max(...d.hours.map((h) => h.windKph), 0);
              const isSelected = idx === selectedIndex;
              const isToday = isSelected;

              return (
                <li key={d.date}>
                  <button
                    type="button"
                    onClick={() => onSelect(idx)}
                    aria-pressed={isSelected}
                    aria-label={`Show forecast for ${dayLabel} ${date.getDate()}`}
                    className={`flex w-[88px] flex-col items-center gap-2 rounded-2xl px-2 py-3 transition focus:outline-none focus:ring-2 focus:ring-sky-300 sm:w-[100px] ${
                      isSelected
                        ? 'bg-gradient-to-b from-sky-500 to-blue-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-700/60 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-[11px] font-semibold tracking-wider ${
                          isToday
                            ? 'text-white/90'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {dayLabel}
                      </span>
                      <span
                        className={`text-xs ${
                          isToday
                            ? 'text-white/80'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    <div className="my-1 h-12 w-12 sm:h-14 sm:w-14">
                      <Image
                        src={d.condition.icon}
                        alt={d.condition.text}
                        width={64}
                        height={64}
                        className="h-full w-full object-contain drop-shadow-sm"
                      />
                    </div>

                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-lg font-bold sm:text-xl">
                        {Math.round(hi)}°
                      </span>
                      <span
                        className={`text-xs ${
                          isToday
                            ? 'text-white/80'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {Math.round(lo)}°
                      </span>
                    </div>

                    <div
                      className={`mt-1 flex flex-col items-center gap-0.5 text-[10px] ${
                        isToday
                          ? 'text-white/85'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Wind className="h-3 w-3" aria-hidden />
                      <span>{Math.round(peakWind)} km/h</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
    </motion.section>
  );
}
