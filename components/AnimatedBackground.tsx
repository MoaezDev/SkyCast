'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { backgroundForCondition } from '@/utils/weatherBackgrounds';

interface AnimatedBackgroundProps {
  conditionCode?: number;
  isDay?: boolean;
}

/**
 * Full-viewport animated gradient backdrop. The gradient palette is selected
 * from the active weather condition; falls back to a neutral sky theme.
 */
export function AnimatedBackground({
  conditionCode,
  isDay = true,
}: AnimatedBackgroundProps) {
  const gradient =
    typeof conditionCode === 'number'
      ? backgroundForCondition(conditionCode, isDay)
      : 'from-sky-600 via-sky-700 to-indigo-700 dark:from-slate-900 dark:via-slate-950 dark:to-black';

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <motion.div
        key={gradient}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={cn('absolute inset-0 bg-gradient-to-br', gradient)}
      />
      {/* Subtle dark overlay guarantees white text contrast even on lighter
          gradient regions. */}
      <div className="absolute inset-0 bg-black/15 dark:bg-black/25" />
    </div>
  );
}
