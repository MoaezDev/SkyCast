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
        'border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-md',
        'transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-white/10 dark:bg-white/5',
        className,
      )}
      {...props}
    />
  );
});
