export type SkillGroup = { name: string; items: readonly string[] };

/** What I reach for, grouped the way the résumé groups it. No ratings: they mean nothing. */
export const skills: readonly SkillGroup[] = [
  { name: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java'] },
  {
    name: 'Backend',
    items: ['Node.js', 'NestJS', 'Express', 'REST', 'WebSockets', 'Kafka', 'BullMQ'],
  },
  {
    name: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'HeroUI', 'Component architecture'],
  },
  { name: 'Data', items: ['PostgreSQL', 'Redis', 'MongoDB', 'MySQL', 'Prisma'] },
  {
    name: 'Cloud and delivery',
    items: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel'],
  },
  { name: 'Testing', items: ['Vitest', 'Playwright', 'Cypress', 'Testcontainers'] },
  {
    name: 'AI engineering',
    items: ['LLM integration', 'Workflow automation', 'Claude', 'Cursor', 'GitHub Copilot'],
  },
];
