import { useState, type FormEvent } from 'react';

const FIELD_CLASS =
  'w-full rounded-lg border border-amber-800/70 bg-black/25 px-3 py-2 text-sm text-amber-50 placeholder:text-amber-200/40 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30';

const LABEL_CLASS = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-amber-200/80';

/** Contact panel: warm campfire palette and a plain React form. */
export function CampfirePanel() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    console.log('[campfire] contact form submitted', data);
    setSent(true);
  };

  return (
    <section
      aria-labelledby="campfire-panel-title"
      className="overflow-hidden rounded-2xl border border-amber-900/60 bg-gradient-to-br from-stone-900 via-orange-950 to-amber-950 text-amber-50 shadow-2xl"
    >
      <header className="border-b border-amber-900/50 py-4 pl-5 pr-16">
        <h2 id="campfire-panel-title" className="text-base font-semibold tracking-tight sm:text-lg">
          Let&rsquo;s Talk
        </h2>
        <p className="mt-1 text-sm text-amber-200/70">
          Pull up a log. Tell me what you are building and I will write back.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-h-[62vh] overflow-y-auto p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={LABEL_CLASS}>
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Ada Lovelace"
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={LABEL_CLASS}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ada@example.com"
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="contact-message" className={LABEL_CLASS}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            placeholder="A few lines about the project, timeline and budget."
            className={`${FIELD_CLASS} resize-none`}
          />
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
        >
          Send message
        </button>

        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-center text-xs text-amber-200/70">
          {sent ? 'Logged locally — wire this form up to your inbox when you are ready.' : ''}
        </p>
      </form>
    </section>
  );
}
