# 1. Static first

**Status:** accepted, November 2026

## Context

Nothing on this site changes per request: case studies, posts, a résumé. It needs to be fast on a
phone on a poor connection, cheap to host, and impossible to take down with traffic.

## Decision

Every route is generated at build time with `generateStaticParams` and `dynamicParams = false`.
Feeds, the sitemap and share cards are static too. JavaScript ships only for parts that are
interactive.

## Consequences

- A new post needs a deploy. With Git-connected Vercel builds, that's a push.
- Unknown slugs 404 at the edge rather than reaching a function.
- The Content Security Policy can't use nonces, because there's no request to attach one to, so
  `script-src` allows `'unsafe-inline'` for Next.js's inline payload and next-themes. Everything
  else is locked to this origin.
