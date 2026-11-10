/**
 * Who this site is about. Every figure on the site comes from here, `experience.ts` or the Mela
 * case study, and every one of those traces back to the résumé PDF or to Mela's repository.
 */
export const profile = {
  name: 'Saroj Adhikari',
  role: 'Senior full-stack engineer',
  headline: 'Distributed systems, shipped end to end.',
  summary:
    'I build TypeScript systems for startups and production teams: APIs, event-driven backends and the interfaces on top of them. Six years in, most recently carving a monolith into nine services at IPG Automotive and building a delivery platform from its first commit at Sliceup.',
  location: 'Birmingham, UK',
  timeZone: 'Europe/London',
  email: 'sarojadhikari076@gmail.com',
  availability: 'Open to senior roles',
  links: {
    github: 'https://github.com/sarojadhikari076',
    linkedin: 'https://www.linkedin.com/in/sarojadhikari076',
  },
  resumePdf: '/saroj-adhikari-resume.pdf',
} as const;
