import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md',
          'dark:border-white/10 dark:bg-white/5',
          className,
        )}
        {...props}
      />
    );
  },
);
