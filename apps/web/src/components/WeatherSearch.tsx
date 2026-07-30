'use client';

import { useState, type FormEvent } from 'react';
import { describeWeatherCode } from '@/lib/weather/conditions';

export interface WeatherDisplay {
  label: string;
  temperatureC: number;
  weatherCode: number;
}

interface GeocodingResult {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
  admin1?: string;
}

/**
 * Client-side city search on top of the server-fetched default (Pune) weather.
 * Both Open-Meteo endpoints here are free/keyless and CORS-enabled, so this calls
 * them directly from the browser rather than proxying through our own API — there's
 * no secret to protect, unlike lib/weather/client.ts's server-only default fetch.
 */
export function WeatherSearch({ initial }: { initial: WeatherDisplay | null }) {
  const [weather, setWeather] = useState<WeatherDisplay | null>(initial);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const city = query.trim();
    if (!city || status === 'loading') return;

    setStatus('loading');
    setError(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
      );
      if (!geoRes.ok) throw new Error('geocoding request failed');
      const geoData = (await geoRes.json()) as { results?: GeocodingResult[] };
      const place = geoData.results?.[0];

      if (!place) {
        setStatus('error');
        setError(`No city found matching "${city}"`);
        return;
      }

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true`,
      );
      if (!weatherRes.ok) throw new Error('weather request failed');
      const weatherData = (await weatherRes.json()) as {
        current_weather?: { temperature: number; weathercode: number };
      };

      if (!weatherData.current_weather) {
        setStatus('error');
        setError('Weather unavailable for that location right now.');
        return;
      }

      setWeather({
        label: [place.name, place.admin1, place.country].filter(Boolean).join(', '),
        temperatureC: weatherData.current_weather.temperature,
        weatherCode: weatherData.current_weather.weathercode,
      });
      setStatus('idle');
      setQuery('');
    } catch {
      setStatus('error');
      setError('Something went wrong — try again.');
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold tracking-wide text-ink uppercase">Current weather</p>

      <div className="rounded-full border border-ink/20 px-6 py-3 text-base font-medium text-ink sm:text-lg">
        {weather ? (
          <span>
            {weather.label}: {Math.round(weather.temperatureC)}°C, {describeWeatherCode(weather.weatherCode)}
          </span>
        ) : (
          <span>Weather unavailable</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a city…"
          aria-label="Search for a city's weather"
          disabled={status === 'loading'}
          className="rounded-full border border-ink/20 bg-transparent px-4 py-2 text-base text-ink placeholder:text-ink/50 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !query.trim()}
          className="shrink-0 rounded-full border border-ink/20 px-4 py-2 text-base font-medium text-ink hover:bg-ink/5 disabled:opacity-60"
        >
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error ? (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
