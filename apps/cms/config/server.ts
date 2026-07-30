import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Without this, Strapi constructs absolute URLs (media, admin links) from just
  // host+port — fine locally, but on a host like Render that means an internal,
  // unreachable address (e.g. http://0.0.0.0:10000/uploads/...) gets returned to the
  // browser instead of the real public HTTPS domain. Unset locally (falls back to
  // relative URLs, unchanged dev behavior); set to the deployed URL in production.
  url: env('PUBLIC_URL', undefined),
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
