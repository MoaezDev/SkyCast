import { NextResponse } from 'next/server';
import { searchCities, WeatherApiError } from '@/services/weatherApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const results = await searchCities(q);
    return NextResponse.json(results, {
      headers: {
        'Cache-Control':
          's-maxage=600, stale-while-revalidate=3600, public',
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
      { error: 'Unexpected error searching locations.' },
      { status: 500 },
    );
  }
}
