import 'server-only';
import { z } from 'zod';

/**
 * Server-only client for Open-Meteo's free forecast API (no key required). Mirrors
 * lib/strapi/client.ts's shape (typed error class, Next.js fetch-cache config) so
 * external-API and CMS data-fetching follow the same pattern in this codebase.
 */

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

// Weather doesn't need to be fresher than this for a small homepage widget, and keeps
// well within Open-Meteo's free-tier rate limits.
const REVALIDATE_SECONDS = 1800;

export class WeatherError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'WeatherError';
  }
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperatureC: number;
  windspeedKmh: number;
  weatherCode: number;
  isDay: boolean;
  observedAt: string;
}

// Only the fields this app reads — Open-Meteo's actual response has many more.
const openMeteoResponseSchema = z.object({
  current_weather: z.object({
    temperature: z.number(),
    windspeed: z.number(),
    weathercode: z.number(),
    is_day: z.union([z.literal(0), z.literal(1)]),
    time: z.string(),
  }),
});

export async function getCurrentWeather({ latitude, longitude }: Coordinates): Promise<CurrentWeather> {
  const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  } catch (cause) {
    throw new WeatherError(`Could not reach Open-Meteo`, { cause });
  }

  if (!res.ok) {
    throw new WeatherError(`Open-Meteo request failed: ${res.status} ${res.statusText}`);
  }

  const parsed = openMeteoResponseSchema.safeParse(await res.json());
  if (!parsed.success) {
    throw new WeatherError('Open-Meteo response was missing expected weather data', { cause: parsed.error });
  }

  const { temperature, windspeed, weathercode, is_day, time } = parsed.data.current_weather;
  return {
    temperatureC: temperature,
    windspeedKmh: windspeed,
    weatherCode: weathercode,
    isDay: is_day === 1,
    observedAt: time,
  };
}
