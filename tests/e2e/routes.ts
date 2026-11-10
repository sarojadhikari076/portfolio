/** Every page a reader can reach, with the heading it should open on. */
export const ROUTES = [
  { path: '/', heading: 'Distributed systems, shipped end to end.' },
  { path: '/work', heading: 'Things I’ve built and run' },
  { path: '/work/mela', heading: 'Mela' },
  { path: '/work/sliceup', heading: 'Sliceup' },
  { path: '/writing', heading: 'How I built it' },
  { path: '/writing/selling-the-last-ticket', heading: 'Selling the last ticket exactly once' },
  { path: '/about', heading: 'From Kathmandu to Birmingham' },
  { path: '/resume', heading: 'Saroj Adhikari' },
  { path: '/colophon', heading: 'How this site is made' },
] as const;
