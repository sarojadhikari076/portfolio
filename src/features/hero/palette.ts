/**
 * three.js can't read `oklch()` from CSS, so the scene keeps hex twins of the theme tokens in
 * globals.css. They are matched by eye against the same tokens, and only the scene uses them.
 */
export const SCENE_PALETTE = {
  dark: { edge: '#383d45', node: '#8b8f96', client: '#e8e6e1', accent: '#f8a300' },
  light: { edge: '#cfccc4', node: '#5c5f66', client: '#111214', accent: '#c47f00' },
} as const;
