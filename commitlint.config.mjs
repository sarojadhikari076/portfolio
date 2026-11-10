/**
 * Conventional Commits, as in Mela. `subject-case` is off because subjects here often open with a
 * proper noun (HeroUI, MDX, Vercel), and `body-max-line-length` is off because a body is wrapped
 * for a reader, not a counter.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0],
    'subject-case': [0],
  },
};
