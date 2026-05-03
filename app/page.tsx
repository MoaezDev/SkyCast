import { WeatherView } from '@/components/WeatherView';

export default function HomePage() {
  const defaultLocation =
    process.env.NEXT_PUBLIC_DEFAULT_LOCATION?.trim() || 'London';
  return <WeatherView defaultLocation={defaultLocation} />;
}
