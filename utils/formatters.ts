import type { TemperatureUnit } from '@/types/weather';

export function formatTemperature(
  celsius: number,
  fahrenheit: number,
  unit: TemperatureUnit,
): string {
  const value = unit === 'C' ? celsius : fahrenheit;
  return `${Math.round(value)}°${unit}`;
}

export function formatTime(isoTime: string, timezone?: string): string {
  const date = new Date(isoTime.replace(' ', 'T'));
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  }).format(date);
}

export function formatHour(isoTime: string, timezone?: string): string {
  const date = new Date(isoTime.replace(' ', 'T'));
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: timezone,
  }).format(date);
}

export function formatDay(isoDate: string, opts?: { short?: boolean }): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: opts?.short ? 'short' : 'long',
  }).format(date);
}

export function formatFullDate(isoString: string, timezone?: string): string {
  const date = new Date(isoString.replace(' ', 'T'));
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  }).format(date);
}

export function isToday(isoDate: string): boolean {
  const today = new Date();
  const d = new Date(`${isoDate}T00:00:00`);
  return (
    today.getFullYear() === d.getFullYear() &&
    today.getMonth() === d.getMonth() &&
    today.getDate() === d.getDate()
  );
}
