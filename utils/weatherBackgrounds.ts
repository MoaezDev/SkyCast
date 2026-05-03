/**
 * Maps a weather condition + day/night to a Tailwind gradient class string.
 *
 * Condition codes follow WeatherAPI.com's documented set:
 * https://www.weatherapi.com/docs/weather_conditions.json
 */

type Bucket =
  | 'clearDay'
  | 'clearNight'
  | 'cloudyDay'
  | 'cloudyNight'
  | 'rain'
  | 'thunder'
  | 'snow'
  | 'fog';

const BACKGROUNDS: Record<Bucket, string> = {
  clearDay:
    'from-sky-600 via-blue-500 to-amber-500 dark:from-slate-900 dark:via-indigo-950 dark:to-sky-950',
  clearNight:
    'from-indigo-900 via-slate-900 to-slate-950 dark:from-black dark:via-indigo-950 dark:to-slate-950',
  cloudyDay:
    'from-slate-500 via-slate-600 to-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950',
  cloudyNight:
    'from-slate-700 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-black',
  rain: 'from-slate-600 via-slate-700 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950',
  thunder:
    'from-slate-800 via-purple-900 to-slate-950 dark:from-slate-900 dark:via-purple-950 dark:to-black',
  snow: 'from-slate-500 via-slate-600 to-slate-700 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900',
  fog: 'from-slate-500 via-slate-600 to-slate-700 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900',
};

export function bucketForCondition(code: number, isDay: boolean): Bucket {
  // Sunny / Clear
  if (code === 1000) return isDay ? 'clearDay' : 'clearNight';
  // Cloud variants
  if ([1003, 1006, 1009].includes(code)) {
    return isDay ? 'cloudyDay' : 'cloudyNight';
  }
  // Fog / mist
  if ([1030, 1135, 1147].includes(code)) return 'fog';
  // Snow / sleet / ice
  if (
    [
      1066, 1069, 1072, 1114, 1117, 1147, 1168, 1171, 1204, 1207, 1210, 1213,
      1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264,
    ].includes(code)
  ) {
    return 'snow';
  }
  // Thunder
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'thunder';
  // Rain / drizzle / showers
  if (
    [
      1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240,
      1243, 1246,
    ].includes(code)
  ) {
    return 'rain';
  }
  return isDay ? 'cloudyDay' : 'cloudyNight';
}

export function backgroundForCondition(code: number, isDay: boolean): string {
  return BACKGROUNDS[bucketForCondition(code, isDay)];
}
