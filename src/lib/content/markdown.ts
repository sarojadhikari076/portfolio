import GithubSlugger from 'github-slugger';

const WORDS_PER_MINUTE = 230;

const FENCE = /^(```|~~~)/;

/** Lines of prose only: code fences, import/export statements and JSX tags are not read aloud. */
function proseLines(source: string): string[] {
  const lines: string[] = [];
  let inFence = false;

  for (const line of source.split('\n')) {
    if (FENCE.test(line.trimStart())) {
      inFence = !inFence;
      continue;
    }
    if (inFence || /^(import|export)\s/.test(line) || /^\s*<\/?[A-Z]/.test(line)) continue;
    lines.push(line);
  }

  return lines;
}

export function readingMinutes(source: string): number {
  const words = proseLines(source).join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export type Heading = { depth: 2 | 3; text: string; id: string };

/**
 * The table of contents, read from the source rather than from a rehype plugin, because Turbopack
 * can't pass a callback into the MDX compiler. The ids come from the same slugger rehype-slug uses,
 * in the same order, so the links land on the headings it generated.
 */
export function extractHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  for (const line of proseLines(source)) {
    const match = /^(#{1,6})\s+(.+?)\s*#*$/.exec(line);
    if (!match?.[1] || !match[2]) continue;

    const text = match[2].replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    const id = slugger.slug(text);
    const depth = match[1].length;

    if (depth === 2 || depth === 3) headings.push({ depth, text, id });
  }

  return headings;
}
