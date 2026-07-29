import { type NextRequest, NextResponse } from 'next/server';
import { createNewsletterSignup } from '@/lib/mutations/newsletter';
import { StrapiError } from '@/lib/strapi/client';
import { newsletterSchema } from '@/lib/validation/newsletter';

/**
 * Backs the Footer newsletter form (components/layout/NewsletterForm.tsx). Writes to
 * Strapi's `newsletter-signup` collection via the same server-side API token already
 * used for reads (see .env.example) — that token must be granted `create` permission
 * on newsletter-signup in the Strapi admin for this to succeed.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  // A filled honeypot means a bot, not a human — fake success without writing anything
  // or logging the value, so scrapers don't learn the field is being checked.
  if (parsed.data.honeypot) {
    return NextResponse.json({ success: true });
  }

  try {
    await createNewsletterSignup(parsed.data.email);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (cause) {
    if (cause instanceof StrapiError) {
      console.error(`Newsletter signup failed: ${cause.status} ${cause.message}`);
    } else {
      console.error('Newsletter signup failed:', cause);
    }
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 502 },
    );
  }
}
