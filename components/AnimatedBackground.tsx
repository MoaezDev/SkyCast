'use client';

/**
 * Soft sky-blue page backdrop. Two faint white blobs add a hint of depth
 * without distracting from the dashboard cards layered on top.
 */
export function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 dark:from-slate-900 dark:via-slate-950 dark:to-black"
      aria-hidden
    >
      <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-white/30 blur-3xl dark:bg-sky-500/10" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl dark:bg-indigo-500/10" />
    </div>
  );
}
