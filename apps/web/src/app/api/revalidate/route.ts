import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * On-demand ISR endpoint, called by a Strapi webhook (Settings → Webhooks, configured
 * manually in the admin — not a code change to apps/cms) on entry publish/update.
 * Time-based revalidation (60s default, see lib/strapi/client.ts) is the safety net;
 * this makes CMS publishes reflect on the site immediately instead of waiting for it.
 */

interface StrapiWebhookPayload {
  event?: string;
  model?: string;
  entry?: { slug?: string };
}

// Next 16 requires a second argument on revalidateTag. `{ expire: 0 }` means immediate
// expiration, which the Next.js docs specifically recommend for this exact scenario —
// an external webhook triggering revalidation, as opposed to 'max' (stale-while-
// revalidate) which is meant for in-app Server Actions.
const IMMEDIATE = { expire: 0 };

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Reject if the env var isn't configured at all, not just on a mismatched value.
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as StrapiWebhookPayload | null;
  const model = body?.model;
  const slug = body?.entry?.slug;

  switch (model) {
    case 'page':
      revalidateTag('pages', IMMEDIATE);
      if (slug) {
        revalidateTag(`page:${slug}`, IMMEDIATE);
        revalidatePath(slug === 'home' ? '/' : `/${slug}`);
      }
      break;
    case 'header':
      revalidateTag('header', IMMEDIATE);
      break;
    case 'footer':
      revalidateTag('footer', IMMEDIATE);
      break;
    case 'global':
      revalidateTag('global', IMMEDIATE);
      break;
    default:
      // Unrecognized model or payload shape — revalidate broadly rather than no-op.
      revalidateTag('pages', IMMEDIATE);
      revalidateTag('header', IMMEDIATE);
      revalidateTag('footer', IMMEDIATE);
      revalidateTag('global', IMMEDIATE);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
