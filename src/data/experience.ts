export type Role = {
  company: string;
  title: string;
  location: string;
  /** ISO month, `YYYY-MM`. */
  start: string;
  /** ISO month, or `null` for the current role. */
  end: string | null;
  /** One line for the home page readout. */
  headline: string;
  /** Two numbers worth reading first, shown as readouts. */
  metrics: readonly { value: string; label: string }[];
  highlights: readonly string[];
};

/** Straight from the résumé. Wording is tightened; numbers are not changed. */
export const experience: readonly Role[] = [
  {
    company: 'IPG Automotive',
    title: 'Full Stack Software Engineer',
    location: 'Birmingham, UK',
    start: '2025-04',
    end: null,
    headline: 'Decomposing a monolith into independent services, and the TypeScript to hold it.',
    metrics: [
      { value: '9', label: 'services out of one monolith' },
      { value: '1.2 GB → 340 MB', label: 'Docker image' },
    ],
    highlights: [
      'Decomposed a monolithic backend into 9 independent microservices, so each can deploy on its own.',
      'Designed and built 30+ REST APIs with consistent schema validation and versioning.',
      'Migrated 50k+ lines of JavaScript to TypeScript, cutting runtime errors and making the code easier to change.',
      'Introduced event-driven workflows on Kafka for asynchronous processing across services.',
      'Cut the Docker image from 1.2 GB to 340 MB, which sped up builds and deploys.',
      'Evaluated AI-assisted developer tooling for speed and code quality.',
      'Mentored 3 engineers on TypeScript, AI-assisted development and system design through code review.',
    ],
  },
  {
    company: 'Sliceup',
    title: 'Founding Full Stack Engineer',
    location: 'Leicestershire, UK',
    start: '2023-10',
    end: '2025-03',
    headline: 'First engineer. Built the platform from scratch and owned it end to end.',
    metrics: [
      { value: '110+', label: 'vendors on the platform' },
      { value: '10k+', label: 'users served' },
    ],
    highlights: [
      'Built the platform from scratch as the first engineer, owning architecture, infrastructure and delivery.',
      'Designed a 5-component system covering the API, dashboards and real-time order processing.',
      'Scaled to 110+ vendors and 10k+ users with consistent performance under load.',
      'Built real-time order and driver allocation, reducing delivery latency across the network.',
      'Led technical decisions across backend, frontend, AWS infrastructure and AI tooling with the founders.',
    ],
  },
  {
    company: 'Naamche',
    title: 'Frontend Software Engineer',
    location: 'Kathmandu, Nepal',
    start: '2021-06',
    end: '2023-09',
    headline: 'Performance, a shared component library and the tests to keep them honest.',
    metrics: [
      { value: '3.2 s → 900 ms', label: 'page load' },
      { value: '75%', label: 'test coverage' },
    ],
    highlights: [
      'Cut page load from 3.2 s to 900 ms with code splitting and performance work.',
      'Improved Core Web Vitals by 35%, which helped retention and search ranking.',
      'Built a component library of 30+ components adopted across several teams.',
      'Raised test coverage to 75% and reduced regressions with Cypress end-to-end tests.',
    ],
  },
  {
    company: 'Swivt Technologies',
    title: 'Full Stack Software Engineer',
    location: 'Kathmandu, Nepal',
    start: '2018-05',
    end: '2021-06',
    headline: 'Fintech and e-commerce products, from schema to deploy pipeline.',
    metrics: [
      { value: '55%', label: 'faster queries' },
      { value: '2 h → 15 min', label: 'deploy time' },
    ],
    highlights: [
      'Delivered 5+ production applications across fintech and e-commerce.',
      'Made database queries 55% faster with indexing and query optimisation.',
      'Added Redis caching, improving response times by 40% under high load.',
      'Set up CI/CD pipelines, taking deploys from 2 hours to 15 minutes.',
    ],
  },
];

export const education = {
  institution: 'Birmingham City University',
  degree: 'MSc Computer Science',
  location: 'Birmingham, UK',
  completed: '2024',
} as const;
