import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-gradient-to-br from-sky-500 via-sky-400 to-indigo-500 px-4 text-center text-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-light">404</h1>
        <p className="max-w-sm text-white/85">
          The page you&apos;re looking for blew away in the wind.
        </p>
        <Link
          href="/"
          className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium transition hover:bg-white/20"
        >
          Back to forecast
        </Link>
      </div>
    </main>
  );
}
