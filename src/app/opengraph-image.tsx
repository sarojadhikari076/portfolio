import { profile } from '@/data/profile';
import { OG_SIZE, renderShareCard } from '@/lib/og';

export const alt = `${profile.name}, ${profile.role.toLowerCase()}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderShareCard({
    eyebrow: `${profile.location.toLowerCase()} · case studies and writing`,
    title: profile.headline,
    detail: 'Senior full-stack engineer. TypeScript, NestJS, PostgreSQL and AWS.',
  });
}
