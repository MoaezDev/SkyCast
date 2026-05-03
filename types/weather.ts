/**
 * Weather domain types used throughout the SkyCast app.
 *
 * These wrap the WeatherAPI.com response shapes into something a little nicer
 * for the rest of the codebase to consume — kept close to the source so the
 * API service layer is the only place that depends on the raw vendor schema.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  name: string;
  region: string;
  country: string;
  localTime: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
  isDay: boolean;
}

export interface CurrentWeather {
  temperatureC: number;
  temperatureF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  condition: WeatherCondition;
  humidity: number;
  windKph: number;
  windDirection: string;
  pressureMb: number;
  uv: number;
  visibilityKm: number;
  precipitationMm: number;
  cloudCover: number;
  lastUpdated: string;
}

export interface HourlyForecastEntry {
  time: string;
  temperatureC: number;
  temperatureF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  condition: WeatherCondition;
  chanceOfRain: number;
  windKph: number;
  windDirection: string;
  humidity: number;
  pressureMb: number;
  visibilityKm: number;
  uv: number;
  cloudCover: number;
  precipitationMm: number;
}

export interface DailyForecastEntry {
  date: string;
  maxTempC: number;
  minTempC: number;
  maxTempF: number;
  minTempF: number;
  avgTempC: number;
  condition: WeatherCondition;
  sunrise: string;
  sunset: string;
  chanceOfRain: number;
  hours: HourlyForecastEntry[];
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  daily: DailyForecastEntry[];
  hourly: HourlyForecastEntry[];
}

export type TemperatureUnit = 'C' | 'F';
