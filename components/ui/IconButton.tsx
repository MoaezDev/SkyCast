import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function IconButton({ className, type = 'button', ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        'bg-white text-slate-700 shadow-md transition-colors',
        'hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
        className,
      )}
      {...props}
    />
  );
});
