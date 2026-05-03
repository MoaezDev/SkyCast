'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import { useCitySearch } from '@/hooks/useCitySearch';
import { cn } from '@/utils/cn';
import type { WeatherApiSearchResult } from '@/types/weatherApi';

interface SearchBarProps {
  onSelect: (query: string) => void;
  onUseMyLocation?: () => void;
  loadingLocation?: boolean;
  initialValue?: string;
}

export function SearchBar({
  onSelect,
  onUseMyLocation,
  loadingLocation,
  initialValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { results, loading } = useCitySearch(value);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    setOpen(true);
    setActiveIdx(-1);
  }

  function commit(item: WeatherApiSearchResult) {
    setValue(item.name);
    setOpen(false);
    onSelect(`${item.lat},${item.lon}`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (activeIdx >= 0 && results[activeIdx]) {
      commit(results[activeIdx]);
      return;
    }
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      setOpen(false);
      onSelect(trimmed);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative">
          <Search
            aria-hidden
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70"
          />
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            placeholder="Search city, ZIP, or coordinates"
            aria-label="Search location"
            autoComplete="off"
            spellCheck={false}
            className={cn(
              'w-full rounded-full border border-white/20 bg-white/10 py-3 pl-12 pr-24 text-white shadow-lg backdrop-blur-md',
              'placeholder:text-white/60',
              'focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30',
              'dark:border-white/10 dark:bg-white/5',
            )}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {value && (
              <button
                type="button"
                onClick={() => {
                  setValue('');
                  setOpen(false);
                }}
                aria-label="Clear search"
                className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {onUseMyLocation && (
              <button
                type="button"
                onClick={onUseMyLocation}
                aria-label="Use my location"
                title="Use my location"
                disabled={loadingLocation}
                className={cn(
                  'rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white',
                  loadingLocation && 'opacity-50',
                )}
              >
                {loadingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      <AnimatePresence>
        {open && (results.length > 0 || loading) && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className={cn(
              'absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-2xl border border-white/20 bg-white/95 p-1 shadow-xl backdrop-blur-md',
              'dark:border-white/10 dark:bg-slate-900/95',
            )}
          >
            {loading && (
              <li className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
              </li>
            )}
            {results.map((r, i) => {
              const active = i === activeIdx;
              return (
                <li key={r.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => commit(r)}
                    className={cn(
                      'flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition',
                      'text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800',
                      active && 'bg-slate-100 dark:bg-slate-800',
                    )}
                  >
                    <MapPin
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                    />
                    <span className="flex flex-col">
                      <span className="font-medium">{r.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {[r.region, r.country].filter(Boolean).join(', ')}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
