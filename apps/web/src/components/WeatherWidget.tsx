import { Container } from '@/components/ui/Container';
import { getCurrentWeather, type Coordinates } from '@/lib/weather/client';
import { describeWeatherCode } from '@/lib/weather/conditions';

interface WeatherLocation extends Coordinates {
  label: string;
}

const DEFAULT_LOCATION: WeatherLocation = { latitude: 18.5204, longitude: 73.8567, label: 'Pune, India' };

/**
 * External-API demo widget (Open-Meteo) — deliberately outside the CMS Dynamic Zone;
 * this isn't editorial content, it's a small live data feed. Rendered wrapped in
 * <Suspense> (see app/page.tsx) so a slow/unreachable external API can never delay the
 * rest of the homepage — this component resolves independently.
 */
export async function WeatherWidget({ location = DEFAULT_LOCATION }: { location?: WeatherLocation }) {
  const weather = await getCurrentWeather(location).catch(() => null);

  return (
    <section className="py-10">
      <Container className="flex justify-center">
        <div className="rounded-full border border-ink/10 px-5 py-2.5 text-sm text-ink/60">
          {weather ? (
            <span>
              {location.label}: {Math.round(weather.temperatureC)}°C, {describeWeatherCode(weather.weatherCode)}
            </span>
          ) : (
            <span>Weather unavailable</span>
          )}
        </div>
      </Container>
    </section>
  );
}

/** Matches WeatherWidget's rendered footprint so the Suspense fallback doesn't shift layout. */
export function WeatherWidgetSkeleton() {
  return (
    <section className="py-10">
      <Container className="flex justify-center">
        <div className="h-9 w-64 animate-pulse rounded-full bg-ink/5" />
      </Container>
    </section>
  );
}
