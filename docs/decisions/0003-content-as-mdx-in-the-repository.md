# 3. Content as MDX in the repository

**Status:** accepted, November 2026

## Context

Posts are technical: code excerpts, diagrams, the occasional interactive component. A CMS adds an
account, an API and a build hook for a site with one author.

## Decision

Posts and case studies are MDX files in `content/`, compiled by `@next/mdx` under Turbopack.
Frontmatter is parsed with gray-matter and validated with Zod at build time, so a bad field fails
the build with the file and field named. Code is highlighted at build time by Shiki through
rehype-pretty-code.

Turbopack runs the MDX compiler in Rust, so plugin options must be plain JSON. The table of
contents is therefore read from the source with the same slugger rehype-slug uses, instead of from
a plugin with a callback.

## Consequences

- Writing a post is a pull request, with lint, tests and a preview deployment.
- A test fails on filler words, on links to pages that don't exist, and on tags outside the fixed
  topic list.
- Drafts render in development only, and never reach production listings or the feed.
