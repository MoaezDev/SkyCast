import { cn } from '@/utils/cn';

const shimmer =
  'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:1000px_100%] dark:from-slate-700 dark:via-slate-600 dark:to-slate-700';

function Block({ className }: { className?: string }) {
  return <div className={cn('rounded-xl', shimmer, className)} aria-hidden />;
}

export function WeatherSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-label="Loading weather"
    >
      <div className="rounded-3xl bg-white p-6 shadow-md dark:bg-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <Block className="h-4 w-48" />
            <Block className="h-4 w-32" />
            <Block className="h-20 w-44" />
          </div>
          <Block className="h-28 w-28 rounded-full" />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-md dark:bg-slate-800">
        <Block className="mb-4 h-4 w-32" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Block className="h-9 w-9 rounded-xl" />
              <Block className="h-3 w-16" />
              <Block className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-md dark:bg-slate-800">
        <Block className="mb-4 h-4 w-40" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <Block key={i} className="h-32 w-20 shrink-0" />
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-md dark:bg-slate-800">
        <Block className="mb-4 h-4 w-32" />
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Block key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading weather data…</span>
    </div>
  );
}
