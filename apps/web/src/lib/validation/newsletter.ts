import { z } from 'zod';

/**
 * `honeypot` is a hidden form field real users never see or fill (see
 * components/layout/NewsletterForm.tsx). A non-empty value means the submission almost
 * certainly came from a bot, not a human — the route treats that as a silent no-op.
 */
export const newsletterSchema = z.object({
  // Trim/lowercase run before the email-format check, so " User@Example.com " normalizes
  // instead of failing validation on whitespace.
  email: z.string().trim().toLowerCase().max(254).pipe(z.email('Enter a valid email address')),
  honeypot: z.string().optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
