import { NextResponse } from 'next/server';
import { fetchForecast, WeatherApiError } from '@/services/weatherApi';
import { mapWeatherResponse } from '@/services/weatherMapper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json(
      { error: 'Missing required `q` query parameter.' },
      { status: 400 },
    );
  }

  try {
    const raw = await fetchForecast(q);
    const data = mapWeatherResponse(raw);
    return NextResponse.json(data, {
      headers: {
        // Cache at the edge for 5 minutes; allow stale-while-revalidate for 30m.
        'Cache-Control': 's-maxage=300, stale-while-revalidate=1800, public',
      },
    });
  } catch (err) {
    if (err instanceof WeatherApiError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 },
      );
    }
    return NextResponse.json(
      { error: 'Unexpected error fetching weather.' },
      { status: 500 },
    );
  }
}
