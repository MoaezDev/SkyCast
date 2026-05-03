'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role="alert"
    >
      <Card className="flex flex-col items-center gap-3 text-center">
        <div
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300"
        >
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
        )}
      </Card>
    </motion.div>
  );
}
