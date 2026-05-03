import type {
  CurrentWeather,
  DailyForecastEntry,
  HourlyForecastEntry,
  TemperatureUnit,
  WeatherData,
} from '@/types/weather';
import { formatFullDate } from '@/utils/formatters';

/**
 * Unified data shape consumed by the upper sections (hero, highlights, hourly).
 * `current` is either the live current weather (when viewing today) or a
 * snapshot synthesized from a future day's hourly data.
 */
export interface DayView {
  isToday: boolean;
  current: CurrentWeather;
  /** The full daily entry for the selected day — used for sunrise/sunset. */
  day: DailyForecastEntry;
  /** Hours to display. Today: rolling next 24. Future: that day's 24. */
  hours: HourlyForecastEntry[];
  /** Pre-formatted long date string. */
  dateLabel: string;
  /** Sub-text under the big temperature ("Feels like 30°" or "H: 41° / L: 26°"). */
  secondaryLine: string;
}

const avg = (nums: number[]): number =>
  nums.length === 0 ? 0 : nums.reduce((a, b) => a + b, 0) / nums.length;
const peak = (nums: number[]): number =>
  nums.length === 0 ? 0 : Math.max(...nums);
const total = (nums: number[]): number => nums.reduce((a, b) => a + b, 0);

/** Pick a representative daytime hour (12:00 if available, else first daytime). */
function representativeHour(
  day: DailyForecastEntry,
): HourlyForecastEntry | undefined {
  return (
    day.hours.find((h) => h.time.endsWith(' 12:00')) ??
    day.hours.find((h) => h.condition.isDay) ??
    day.hours[12] ??
    day.hours[0]
  );
}

function synthesizeCurrentFromDay(day: DailyForecastEntry): CurrentWeather {
  const ref = representativeHour(day);
  return {
    temperatureC: day.maxTempC,
    temperatureF: day.maxTempF,
    feelsLikeC: day.avgTempC,
    feelsLikeF: ref?.feelsLikeF ?? day.maxTempF,
    condition: day.condition,
    humidity: Math.round(avg(day.hours.map((h) => h.humidity))),
    windKph: peak(day.hours.map((h) => h.windKph)),
    windDirection: ref?.windDirection ?? '',
    pressureMb: Math.round(avg(day.hours.map((h) => h.pressureMb))),
    uv: peak(day.hours.map((h) => h.uv)),
    visibilityKm: avg(day.hours.map((h) => h.visibilityKm)),
    precipitationMm: total(day.hours.map((h) => h.precipitationMm)),
    cloudCover: Math.round(avg(day.hours.map((h) => h.cloudCover))),
    lastUpdated: day.date,
  };
}

function formatTempInt(c: number, f: number, unit: TemperatureUnit): string {
  return `${Math.round(unit === 'C' ? c : f)}°`;
}

export function buildDayView(
  data: WeatherData,
  index: number,
  unit: TemperatureUnit,
): DayView {
  if (index <= 0) {
    const today = data.daily[0];
    return {
      isToday: true,
      current: data.current,
      day: today,
      hours: data.hourly,
      dateLabel: formatFullDate(
        data.location.localTime,
        data.location.timezone,
      ),
      secondaryLine: `Feels like ${formatTempInt(
        data.current.feelsLikeC,
        data.current.feelsLikeF,
        unit,
      )}`,
    };
  }

  const day = data.daily[index];
  return {
    isToday: false,
    current: synthesizeCurrentFromDay(day),
    day,
    hours: day.hours,
    dateLabel: formatFullDate(`${day.date} 12:00`, data.location.timezone),
    secondaryLine: `H: ${formatTempInt(day.maxTempC, day.maxTempF, unit)} · L: ${formatTempInt(
      day.minTempC,
      day.minTempF,
      unit,
    )}`,
  };
}
