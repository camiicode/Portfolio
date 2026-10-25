interface Service {
  icon: string;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    icon: '🧩',
    title: 'Product design',
    description:
      'Flows, wireframes and interface systems that turn a rough idea into something a team can build against.',
  },
  {
    icon: '⚡',
    title: 'Frontend engineering',
    description:
      'Production React and TypeScript with an eye on performance budgets, motion and accessibility.',
  },
  {
    icon: '🎯',
    title: 'Design systems',
    description:
      'Tokens, components and documentation that keep a growing product consistent without slowing it down.',
  },
];

/** Services panel: clean, business-like list with a teal accent. */
export function ServicesPanel() {
  return (
    <section
      aria-labelledby="services-panel-title"
      className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl"
    >
      <header className="border-b border-slate-200 py-4 pl-5 pr-16 sm:pl-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Services</p>
        <h2 id="services-panel-title" className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
          What I Do
        </h2>
      </header>

      <ul className="max-h-[66vh] divide-y divide-slate-100 overflow-y-auto px-5 sm:px-8">
        {SERVICES.map((service) => (
          <li key={service.title} className="flex gap-4 py-5">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-xl ring-1 ring-teal-100"
            >
              {service.icon}
            </span>
            <div>
              <h3 className="font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{service.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
