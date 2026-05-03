import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names with conditional support.
 * Combines `clsx` (conditional logic) and `tailwind-merge` (deduping conflicts).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
