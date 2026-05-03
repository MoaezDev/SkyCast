import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use the sky-blue accent treatment for hero/featured cards. */
  variant?: 'default' | 'accent';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = 'default', children, ...props },
  ref,
) {
  const base =
    variant === 'accent'
      ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-[0_15px_40px_-15px_rgba(14,165,233,0.6)]'
      : 'bg-white text-slate-900 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] dark:bg-slate-800 dark:text-slate-100';

  return (
    <div
      ref={ref}
      className={cn('relative rounded-3xl p-5', base, className)}
      {...props}
    >
      {children}
    </div>
  );
});
