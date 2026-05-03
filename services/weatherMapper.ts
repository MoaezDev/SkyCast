import type {
  CurrentWeather,
  DailyForecastEntry,
  HourlyForecastEntry,
  Location,
  WeatherCondition,
  WeatherData,
} from '@/types/weather';
import type {
  WeatherApiCondition,
  WeatherApiCurrent,
  WeatherApiForecastDay,
  WeatherApiHour,
  WeatherApiLocation,
  WeatherApiResponse,
} from '@/types/weatherApi';

/**
 * Maps the raw WeatherAPI.com response into the app's internal `WeatherData`
 * shape. Keeping this isolated means swapping providers later only touches
 * the service layer.
 */

function ensureHttps(url: string): string {
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http://')) return url.replace('http://', 'https://');
  return url;
}

function mapCondition(
  c: WeatherApiCondition,
  isDay: boolean,
): WeatherCondition {
  return {
    text: c.text,
    icon: ensureHttps(c.icon),
    code: c.code,
    isDay,
  };
}

function mapLocation(loc: WeatherApiLocation): Location {
  return {
    name: loc.name,
    region: loc.region,
    country: loc.country,
    localTime: loc.localtime,
    timezone: loc.tz_id,
    latitude: loc.lat,
    longitude: loc.lon,
  };
}

function mapCurrent(c: WeatherApiCurrent): CurrentWeather {
  return {
    temperatureC: c.temp_c,
    temperatureF: c.temp_f,
    feelsLikeC: c.feelslike_c,
    feelsLikeF: c.feelslike_f,
    condition: mapCondition(c.condition, c.is_day === 1),
    humidity: c.humidity,
    windKph: c.wind_kph,
    windDirection: c.wind_dir,
    pressureMb: c.pressure_mb,
    uv: c.uv,
    visibilityKm: c.vis_km,
    precipitationMm: c.precip_mm,
    cloudCover: c.cloud,
    lastUpdated: c.last_updated,
  };
}

function mapHour(h: WeatherApiHour): HourlyForecastEntry {
  return {
    time: h.time,
    temperatureC: h.temp_c,
    temperatureF: h.temp_f,
    feelsLikeC: h.feelslike_c,
    feelsLikeF: h.feelslike_f,
    condition: mapCondition(h.condition, h.is_day === 1),
    chanceOfRain: h.chance_of_rain,
    windKph: h.wind_kph,
    windDirection: h.wind_dir,
    humidity: h.humidity,
    pressureMb: h.pressure_mb,
    visibilityKm: h.vis_km,
    uv: h.uv,
    cloudCover: h.cloud,
    precipitationMm: h.precip_mm,
  };
}

function mapDay(d: WeatherApiForecastDay): DailyForecastEntry {
  return {
    date: d.date,
    maxTempC: d.day.maxtemp_c,
    minTempC: d.day.mintemp_c,
    maxTempF: d.day.maxtemp_f,
    minTempF: d.day.mintemp_f,
    avgTempC: d.day.avgtemp_c,
    condition: mapCondition(d.day.condition, true),
    sunrise: d.astro.sunrise,
    sunset: d.astro.sunset,
    chanceOfRain: d.day.daily_chance_of_rain,
    hours: d.hour.map(mapHour),
  };
}

/**
 * Build the consolidated 24-hour rolling hourly forecast starting from the
 * current local hour, drawing from today + tomorrow.
 */
function buildRollingHourly(
  days: DailyForecastEntry[],
  localTime: string,
): HourlyForecastEntry[] {
  const all = days.flatMap((d) => d.hours);
  const now = new Date(localTime.replace(' ', 'T')).getTime();
  const upcoming = all.filter((h) => {
    const t = new Date(h.time.replace(' ', 'T')).getTime();
    return t >= now - 60 * 60 * 1000;
  });
  return upcoming.slice(0, 24);
}

export function mapWeatherResponse(raw: WeatherApiResponse): WeatherData {
  const location = mapLocation(raw.location);
  const current = mapCurrent(raw.current);
  const daily = raw.forecast.forecastday.map(mapDay);
  const hourly = buildRollingHourly(daily, raw.location.localtime);
  return { location, current, daily, hourly };
}
