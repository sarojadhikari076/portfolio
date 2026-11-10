# 2. HeroUI, themed by tokens and imported à la carte

**Status:** accepted, November 2026

## Context

HeroUI 3 is the component library I use elsewhere (Mela). It's built on React Aria, so
accessibility comes from the primitives, and it reads all colour from CSS variables. Used carelessly
it looks like every other HeroUI site and ships more than the page needs.

## Decision

- **The theme is tokens.** One block per mode in `globals.css` overrides HeroUI's variables. No
  component is restyled from outside.
- **Server components use variant functions.** `buttonVariants`, `linkVariants`, `cardVariants` and
  `typographyVariants` from `@heroui/styles` return class names with no JavaScript, so a link
  styled as a button is still a server-rendered `<a>`.
- **Interactive components are client islands**, and the heavy ones load on first use: the mobile
  drawer and the command palette are `next/dynamic` imports behind their triggers.
- **CSS is imported per component** in HeroUI's documented order, rather than the full stylesheet.

## Consequences

- The full stylesheet was 48.5 KB gzipped and render-blocking; the selective import is 18.7 KB.
  Mobile Lighthouse went from 92 to 97 on the home page and LCP from 2.28 s to 1.74 s.
- A newly used HeroUI component needs its CSS import added, or it renders unstyled. The browser
  tests catch the obvious cases; the import list says so in a comment.
