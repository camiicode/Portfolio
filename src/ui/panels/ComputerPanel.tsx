interface Project {
  title: string;
  description: string;
  stack: string;
}

const PROJECTS: Project[] = [
  {
    title: 'Aurora Analytics',
    description:
      'A realtime dashboard that turns messy event streams into charts a whole team can read in one glance.',
    stack: 'React · D3 · Websockets',
  },
  {
    title: 'Atlas Design System',
    description:
      'An accessible component library with tokens, docs and visual regression tests, adopted by six product teams.',
    stack: 'TypeScript · Storybook',
  },
  {
    title: 'Nightshift Editor',
    description:
      'A keyboard-first writing app with offline sync, local-first storage and zero-latency typing.',
    stack: 'Rust · WebAssembly',
  },
  {
    title: 'Harbor Commerce',
    description:
      'Storefront rebuild that cut load time by 68% and lifted checkout completion on mobile.',
    stack: 'Next.js · Stripe',
  },
];

/** Projects panel: terminal-styled four card grid. */
export function ComputerPanel() {
  return (
    <section
      aria-labelledby="computer-panel-title"
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl"
    >
      <header className="flex items-center gap-3 border-b border-slate-800 bg-slate-900/80 py-3 pl-5 pr-16">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </span>
        <h2 id="computer-panel-title" className="text-base font-semibold tracking-tight sm:text-lg">
          My Work
        </h2>
        <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-widest text-emerald-400/80 sm:inline">
          ~/projects
        </span>
      </header>

      <div className="max-h-[68vh] overflow-y-auto p-4 sm:p-6">
        <p className="mb-4 font-mono text-xs text-slate-400">$ ls ./projects --featured</p>
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {PROJECTS.map((project) => (
            <li
              key={project.title}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:border-emerald-400/50"
            >
              <h3 className="font-semibold text-slate-50">{project.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{project.description}</p>
              <p className="mt-3 font-mono text-[11px] text-slate-500">{project.stack}</p>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-emerald-400 underline-offset-4 hover:text-emerald-300 hover:underline"
              >
                View Project <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
