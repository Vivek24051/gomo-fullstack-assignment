import { Container } from '@/components/ui/Container';
import { WeatherSearch } from '@/components/WeatherSearch';
import { getCurrentWeather, type Coordinates } from '@/lib/weather/client';

interface WeatherLocation extends Coordinates {
  label: string;
}

const DEFAULT_LOCATION: WeatherLocation = { latitude: 18.5204, longitude: 73.8567, label: 'Pune, India' };

/**
 * External-API demo widget (Open-Meteo) — deliberately outside the CMS Dynamic Zone;
 * this isn't editorial content, it's a small live data feed. Rendered wrapped in
 * <Suspense> (see app/page.tsx) so a slow/unreachable external API can never delay the
 * rest of the homepage — this component resolves independently.
 *
 * Fetches the default location server-side (fast first paint, no client JS needed for
 * the common case), then hands off to WeatherSearch — a Client Component — which owns
 * the interactive "search any other city" behavior on top of that initial value.
 */
export async function WeatherWidget({ location = DEFAULT_LOCATION }: { location?: WeatherLocation }) {
  const weather = await getCurrentWeather(location).catch(() => null);

  return (
    <section className="py-10">
      <Container className="flex justify-center">
        <WeatherSearch
          initial={
            weather
              ? { label: location.label, temperatureC: weather.temperatureC, weatherCode: weather.weatherCode }
              : null
          }
        />
      </Container>
    </section>
  );
}

/** Matches WeatherWidget's rendered footprint so the Suspense fallback doesn't shift layout. */
export function WeatherWidgetSkeleton() {
  return (
    <section className="py-10">
      <Container className="flex flex-col items-center gap-3">
        <p className="text-sm font-semibold tracking-wide text-ink uppercase">Current weather</p>
        <div className="h-11 w-72 animate-pulse rounded-full bg-ink/5" />
        <div className="h-10 w-56 animate-pulse rounded-full bg-ink/5" />
      </Container>
    </section>
  );
}
