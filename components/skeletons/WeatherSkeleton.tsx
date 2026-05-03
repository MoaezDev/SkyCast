import { cn } from '@/utils/cn';

const shimmer =
  'animate-shimmer bg-gradient-to-r from-white/10 via-white/30 to-white/10 bg-[length:1000px_100%]';

function Block({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-xl bg-white/10', shimmer, className)}
      aria-hidden
    />
  );
}

export function WeatherSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-label="Loading weather"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <Block className="h-4 w-48" />
          <Block className="h-4 w-32" />
          <Block className="h-20 w-44" />
        </div>
        <Block className="h-28 w-28 rounded-full" />
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Block className="h-10 w-10" />
              <div className="flex flex-col gap-2">
                <Block className="h-3 w-16" />
                <Block className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
        <Block className="mb-4 h-3 w-40" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <Block key={i} className="h-32 w-20 shrink-0" />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
        <Block className="mb-4 h-3 w-32" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Block key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading weather data…</span>
    </div>
  );
}
