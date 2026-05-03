# SkyCast — Modern Weather Forecast

A clean, production-ready weather application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** and **Framer Motion**.

- 🌍 Auto-detects the user's location (Geolocation API)
- 🔎 Debounced city autocomplete search
- 🌡️ Current temperature, condition, humidity, wind, pressure, UV, visibility, sunrise/sunset
- 🕐 24-hour rolling hourly forecast
- 📅 7-day forecast with min/max bars and rain probability
- 🎨 Dynamic backgrounds based on weather + day/night
- 🌗 Light / dark / system theme via `next-themes`
- 🔒 API key kept server-side via Next.js Route Handlers
- ⚡ Loading skeletons + graceful error states + retry
- 📱 Fully responsive, mobile-first

## Tech Stack

| Concern      | Library                              |
| ------------ | ------------------------------------ |
| Framework    | Next.js 15 (App Router)              |
| Language     | TypeScript 5                         |
| Styling      | Tailwind CSS 3                       |
| Animation    | Framer Motion                        |
| Icons        | lucide-react                         |
| HTTP         | axios (server) / fetch (client)      |
| Theming      | next-themes                          |
| Code quality | ESLint, Prettier, Husky, lint-staged |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file at the project root by copying the example:

```bash
cp .env.local.example .env.local
```

Sign up for a free [WeatherAPI.com](https://www.weatherapi.com/) account (1M calls/month on the free plan) and paste your key into `.env.local`:

```ini
WEATHER_API_KEY=your_weatherapi_key_here
WEATHER_API_BASE_URL=https://api.weatherapi.com/v1
NEXT_PUBLIC_DEFAULT_LOCATION=London
```

> The `WEATHER_API_KEY` is **never** sent to the browser — all upstream calls are made through Next.js Route Handlers under `/api/*`.

### 3. Initialize Husky (one-time)

```bash
npm run prepare
```

This wires the `pre-commit` hook so `lint-staged` runs ESLint + Prettier on staged files before each commit.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the dev server                          |
| `npm run build`        | Build for production                          |
| `npm start`            | Start the production server (after build)     |
| `npm run lint`         | Lint with ESLint (Next.js + TypeScript rules) |
| `npm run lint:fix`     | Lint and auto-fix                             |
| `npm run format`       | Format the codebase with Prettier             |
| `npm run format:check` | Verify formatting (CI-friendly)               |
| `npm run type-check`   | Run TypeScript without emitting               |

## Project Structure

```
.
├── app/                    # Next.js App Router (layouts, pages, API routes)
│   ├── api/
│   │   ├── search/         # GET /api/search?q=  (city autocomplete)
│   │   └── weather/        # GET /api/weather?q= (current + forecast)
│   ├── error.tsx           # Top-level error boundary
│   ├── globals.css         # Tailwind + design tokens
│   ├── layout.tsx          # Root layout w/ fonts & ThemeProvider
│   ├── not-found.tsx       # 404 page
│   ├── page.tsx            # Home page
│   └── providers.tsx       # next-themes provider
│
├── components/             # Reusable UI components
│   ├── ui/                 # Low-level primitives (Card, IconButton)
│   ├── skeletons/          # Loading skeletons
│   ├── AnimatedBackground.tsx
│   ├── CurrentWeather.tsx
│   ├── DailyForecast.tsx
│   ├── ErrorMessage.tsx
│   ├── HourlyForecast.tsx
│   ├── SearchBar.tsx
│   ├── ThemeToggle.tsx
│   ├── WeatherDetails.tsx
│   └── WeatherView.tsx     # Top-level page composition
│
├── hooks/                  # Custom React hooks
│   ├── useCitySearch.ts    # Debounced /api/search consumer
│   ├── useDebounce.ts
│   ├── useGeolocation.ts
│   └── useWeather.ts       # Loads, caches, retries, aborts
│
├── services/               # Network / data layer
│   ├── weatherApi.ts       # Server-side WeatherAPI.com client (axios)
│   ├── weatherClient.ts    # Browser-side fetch client
│   └── weatherMapper.ts    # Vendor → app domain types
│
├── types/                  # Shared TS types
│   ├── weather.ts          # App-internal domain types
│   └── weatherApi.ts       # Raw WeatherAPI.com response shapes
│
├── utils/                  # Pure helpers
│   ├── cn.ts               # clsx + tailwind-merge
│   ├── formatters.ts       # Date / temperature formatting
│   └── weatherBackgrounds.ts  # Condition → gradient map
│
├── .env.local.example
├── .eslintrc.json
├── .prettierrc
├── .husky/pre-commit
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## API Routes

Both routes are server-only — the upstream API key never leaves the server.

- `GET /api/weather?q=<city|lat,lon|zip>` → Current weather + 7-day forecast (mapped into `WeatherData`).
- `GET /api/search?q=<partial>` → City autocomplete results.

Responses are cached at the edge (`s-maxage` + `stale-while-revalidate`).

## Architecture Notes

- **Separation of concerns** — vendor schema (`types/weatherApi.ts`) is isolated from the app's internal domain types (`types/weather.ts`); a single mapper in `services/weatherMapper.ts` translates between them. Swapping providers (e.g. to OpenWeatherMap) only touches the service layer.
- **API key safety** — the WeatherAPI key lives in `WEATHER_API_KEY` (server-only, no `NEXT_PUBLIC_` prefix). The browser only talks to `/api/*` route handlers.
- **Aborting in-flight requests** — `useWeather` and `useCitySearch` use `AbortController` to cancel stale requests when inputs change.
- **Accessible UI** — semantic landmarks, ARIA labels on icon buttons, keyboard navigation in the search dropdown, `role="alert"` on error states, and `role="status"` on loading skeletons.
- **Hydration-safe theming** — `next-themes` with `suppressHydrationWarning` on `<html>` and `disableTransitionOnChange` to prevent flashes on toggle.

## Deployment

The app is a standard Next.js project — deploy to Vercel, Netlify, or any Node.js host. Make sure to set the same `WEATHER_API_KEY` (and optionally `NEXT_PUBLIC_DEFAULT_LOCATION`) in your hosting provider's environment variable dashboard.

## License

MIT
