/**
 * Raw response shapes returned by WeatherAPI.com.
 * Only the fields actually consumed by the app are typed.
 *
 * Reference: https://www.weatherapi.com/docs/
 */

export interface WeatherApiCondition {
  text: string;
  icon: string;
  code: number;
}

export interface WeatherApiLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherApiCurrent {
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: 0 | 1;
  condition: WeatherApiCondition;
  wind_kph: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  uv: number;
}

export interface WeatherApiHour {
  time: string;
  time_epoch: number;
  temp_c: number;
  temp_f: number;
  is_day: 0 | 1;
  condition: WeatherApiCondition;
  wind_kph: number;
  humidity: number;
  chance_of_rain: number;
}

export interface WeatherApiAstro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
}

export interface WeatherApiForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    maxtemp_f: number;
    mintemp_f: number;
    avgtemp_c: number;
    daily_chance_of_rain: number;
    condition: WeatherApiCondition;
  };
  astro: WeatherApiAstro;
  hour: WeatherApiHour[];
}

export interface WeatherApiForecast {
  forecastday: WeatherApiForecastDay[];
}

export interface WeatherApiResponse {
  location: WeatherApiLocation;
  current: WeatherApiCurrent;
  forecast: WeatherApiForecast;
}

export interface WeatherApiSearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export interface WeatherApiErrorResponse {
  error: {
    code: number;
    message: string;
  };
}
