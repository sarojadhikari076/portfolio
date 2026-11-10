export type Principle = { title: string; body: string; evidence: string };

/**
 * How I work, each backed by something on this site or the résumé. A principle with nothing behind
 * it is a slogan, so `evidence` says where to look.
 */
export const principles: readonly Principle[] = [
  {
    title: 'Write the decision down',
    body: 'A decision without its rejected alternative gets relitigated in six months by someone who wasn’t there, often me. I keep a log of what we chose, what we didn’t and why.',
    evidence: 'Mela’s decision log has 412 entries.',
  },
  {
    title: 'Make the rule a test',
    body: 'Architecture rules that live in a wiki decay. Module boundaries, coverage floors and performance budgets belong in CI, where breaking one fails the build instead of a review.',
    evidence: 'Mela enforces its boundaries with dependency-cruiser and a table-ownership test.',
  },
  {
    title: 'Measure, then change one thing',
    body: 'Most performance work is finding where the time or the bytes actually go. The fix is usually obvious once the measurement is honest.',
    evidence: 'Page load from 3.2 s to 900 ms; a Docker image from 1.2 GB to 340 MB.',
  },
  {
    title: 'Own it all the way to production',
    body: 'A feature isn’t done when it merges. It’s done when it runs, is observable, and someone on call knows what to do when it doesn’t.',
    evidence: 'Founding engineer at Sliceup; nine runbooks in Mela.',
  },
  {
    title: 'Let AI type, keep the judgement',
    body: 'AI tools make me faster at writing code. They don’t decide what the system should be, and they don’t get production credentials. Money, capacity and security code gets tests I wrote or approved, and I read every line.',
    evidence: 'How Mela is built, in its case study.',
  },
  {
    title: 'Teach through review',
    body: 'Code review is where a team’s standards actually get set. I use it to explain the why behind a change, not just to approve it.',
    evidence: 'Mentored three engineers at IPG Automotive.',
  },
];
