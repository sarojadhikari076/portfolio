import { describe, expect, it } from 'vitest';

import { extractHeadings, readingMinutes } from './markdown';

describe('extractHeadings', () => {
  it('returns h2 and h3 with the ids rehype-slug gives them', () => {
    const source = [
      '# Title',
      '## The `outbox` table',
      '### Why not [Kafka](https://x)?',
      '#### Deep',
    ].join('\n');

    expect(extractHeadings(source)).toEqual([
      { depth: 2, text: 'The outbox table', id: 'the-outbox-table' },
      { depth: 3, text: 'Why not Kafka?', id: 'why-not-kafka' },
    ]);
  });

  it('numbers repeated headings the way github-slugger does', () => {
    const ids = extractHeadings('## Results\n\n## Results').map((heading) => heading.id);
    expect(ids).toEqual(['results', 'results-1']);
  });

  it('ignores lines inside code fences', () => {
    const source = ['```sh', '## not a heading', '```', '## A heading'].join('\n');
    expect(extractHeadings(source).map((heading) => heading.text)).toEqual(['A heading']);
  });
});

describe('readingMinutes', () => {
  it('counts prose, not code', () => {
    const prose = Array.from({ length: 460 }, () => 'word').join(' ');
    const code = ['```ts', ...Array.from({ length: 500 }, () => 'const x = 1;'), '```'].join('\n');

    expect(readingMinutes(`${prose}\n${code}`)).toBe(2);
  });

  it('never says zero', () => {
    expect(readingMinutes('Short.')).toBe(1);
  });
});
