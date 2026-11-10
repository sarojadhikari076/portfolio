# 4. The hero earns its bytes

**Status:** accepted, November 2026

## Context

The home page opens with a 3D diagram of Mela's event flow. three.js and React Three Fiber are
about 245 KB gzipped, more than the rest of the page's JavaScript put together.

## Decision

- The server renders an SVG of the same topology through the same camera. It's the first paint, the
  poster the canvas fades in over, and the fallback.
- The canvas loads with `next/dynamic` and `ssr: false`, only after an idle callback, and only if
  motion is allowed, WebGL2 exists and data saver is off.
- The render loop stops whenever the hero is off screen or the tab is hidden.
- The simulation is pure and unit-tested; the frame loop's mutable state lives in a plain class, not
  in React.

## Consequences

- The headline is the largest contentful paint and three.js is never on the critical path.
- Reduced motion gets a static diagram with working flow buttons; the browser tests check that it
  never downloads three.js.
