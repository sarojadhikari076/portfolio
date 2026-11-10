# Saroj Adhikari

Source for my portfolio: case studies, writing, and a home page that opens on a live diagram of
[Mela](https://melatickets.com)'s event flow.

**Live:** [saroj-adhikari.vercel.app](https://saroj-adhikari.vercel.app)

## What's here

| Route                            | What it is                                                          |
| -------------------------------- | ------------------------------------------------------------------- |
| `/`                              | Hero with the event mesh, selected work, experience, latest writing |
| `/work`, `/work/[slug]`          | Case studies, starting with Mela                                    |
| `/writing`, `/writing/[slug]`    | Posts on how things were built, with a topic filter                 |
| `/about`, `/resume`, `/colophon` | Background, a printable résumé, how the site is made                |
| `/feed.xml`, `/sitemap.xml`      | RSS and sitemap                                                     |

## Stack

Next.js 16 (App Router, every route static), React 19 with the React Compiler, TypeScript 6 in
strict mode, HeroUI 3 on Tailwind CSS 4, three.js with React Three Fiber for the hero, and MDX for
content. Hosted on Vercel.

## Layout

```
content/            MDX posts and case studies, validated at build time
docs/decisions/     Why the site is built the way it is
src/app/            Routes, share cards, feed, sitemap
src/components/     Layout chrome, MDX components, small UI pieces
src/data/           Profile, experience and skills, from the résumé
src/features/hero/  The event mesh: topology, simulation, store, scene, SVG fallback
src/features/       Work and writing views
src/lib/            Content loading, feed, structured data, site config
tests/e2e/          Playwright: pages, hero, palette, feeds, axe in both themes
```

The hero is the most involved part. `topology.ts` and `simulation.ts` are plain data and pure
functions with unit tests; `mesh-store.ts` holds state outside React; `mesh-scene.ts` owns every
buffer the frame loop mutates; `mesh-diagram.tsx` draws the same topology as a server-rendered SVG.
[The post about it](content/writing/building-the-event-mesh-hero.mdx) explains why.

## Running it

Requires Node 24 and pnpm.

```sh
pnpm install
pnpm dev          # http://localhost:3000, drafts included
```

| Script                   | Does                                                       |
| ------------------------ | ---------------------------------------------------------- |
| `pnpm build`             | Production build; every page is generated here             |
| `pnpm check`             | Format, lint, types, unit tests and knip                   |
| `pnpm test`              | Unit tests: content, simulation, feed                      |
| `pnpm test:e2e`          | Browser and accessibility tests against a production build |
| `pnpm exec lhci autorun` | Lighthouse budgets on a simulated phone                    |

Commits follow Conventional Commits, checked by commitlint. lint-staged and a type check run before
each commit.

## Quality gates

CI runs on every push: format, lint (typescript-eslint strict type-checked), types, unit tests,
knip, and a build; then Playwright on a desktop and a phone profile with axe in both themes; then
Lighthouse.

Measured on a production build, Lighthouse mobile, median of three:

| Page       | Performance | LCP    | CLS | Accessibility, best practices, SEO |
| ---------- | ----------- | ------ | --- | ---------------------------------- |
| Home       | 97          | 1.74 s | 0   | 100                                |
| Case study | 99          | 1.72 s | 0   | 100                                |
| Post       | 99          | 1.74 s | 0   | 100                                |

## Decisions

1. [Static first](docs/decisions/0001-static-first.md)
2. [HeroUI, themed by tokens and imported à la carte](docs/decisions/0002-heroui-themed-by-tokens.md)
3. [Content as MDX in the repository](docs/decisions/0003-content-as-mdx-in-the-repository.md)
4. [The hero earns its bytes](docs/decisions/0004-hero-budget.md)

## Licence

The code is MIT. The writing, case studies and résumé are mine; please don't republish them.
