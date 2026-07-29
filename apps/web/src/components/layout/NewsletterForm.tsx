'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email');
    const honeypot = formData.get('company');

    setStatus('submitting');
    setMessage(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, honeypot }),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;

      if (!res.ok || !data?.success) {
        setStatus('error');
        setMessage(data?.message ?? 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage('Thanks for subscribing!');
      form.reset();
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-2 border-b border-cream/30 pb-2">
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          disabled={status === 'submitting'}
          className="w-full bg-transparent text-sm text-cream placeholder:text-cream/50 focus:outline-none disabled:opacity-60"
        />
        {/* Honeypot: hidden from real users via CSS (not display:none, which some bots
            skip), never focusable/autofilled — see app/api/newsletter/route.ts. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={status === 'submitting'}
          className="shrink-0 text-cream disabled:opacity-60"
        >
          <span aria-hidden="true">→</span>
        </button>
      </form>
      {message ? (
        <p className={`mt-2 text-sm ${status === 'error' ? 'text-red-300' : 'text-cream/70'}`} role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
