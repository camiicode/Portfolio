/** About panel: light, typography-first layout with an initials avatar. */
export function TelescopePanel() {
  return (
    <section
      aria-labelledby="telescope-panel-title"
      className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl"
    >
      <header className="border-b border-slate-200 py-4 pl-5 pr-16 sm:pl-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">About</p>
        <h2
          id="telescope-panel-title"
          className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          About Me
        </h2>
      </header>

      <div className="max-h-[66vh] overflow-y-auto px-5 py-6 sm:px-8">
        <div className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-lg font-semibold tracking-wide text-white"
          >
            MC
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">Designer &amp; developer</p>
            <p className="text-sm text-slate-500">Building calm interfaces for busy systems</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-600">
          <p>
            I design and build web products end to end: research, interaction design, and the
            production code that ships them. My favourite projects sit where a dense system has to
            feel obvious to someone seeing it for the first time.
          </p>
          <p>
            Most of my work is in TypeScript with React, backed by a physics-of-the-browser mindset:
            fast first paint, honest states, and interfaces that stay out of the way. I care about
            accessibility as a baseline rather than a review pass.
          </p>
          <p>
            Away from the keyboard I read about cartography, take long walks with a camera, and
            rebuild small tools that already exist just to understand why they work.
          </p>
        </div>
      </div>
    </section>
  );
}
