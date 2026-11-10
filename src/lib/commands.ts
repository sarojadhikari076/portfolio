import type { Route } from 'next';

import { getPosts } from './content/posts';
import { getProjects } from './content/projects';
import { NAV_ITEMS } from './site';

export type CommandGroup = 'pages' | 'work' | 'writing' | 'actions';

export type Command =
  | { id: string; group: Exclude<CommandGroup, 'actions'>; label: string; href: Route }
  | {
      id: string;
      group: 'actions';
      label: string;
      action: 'toggle-theme' | 'copy-email' | 'resume';
    };

/** Everything the palette can reach. Built on the server, so it costs the client nothing to know. */
export function getCommands(): Command[] {
  return [
    { id: 'page:home', group: 'pages', label: 'Home', href: '/' },
    ...NAV_ITEMS.map(({ href, label }): Command => ({
      id: `page:${href}`,
      group: 'pages',
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href,
    })),
    { id: 'page:/colophon', group: 'pages', label: 'Colophon', href: '/colophon' },
    ...getProjects().map(({ slug, frontmatter }): Command => ({
      id: `work:${slug}`,
      group: 'work',
      label: frontmatter.title,
      href: `/work/${slug}` as Route,
    })),
    ...getPosts().map(({ slug, frontmatter }): Command => ({
      id: `writing:${slug}`,
      group: 'writing',
      label: frontmatter.title,
      href: `/writing/${slug}` as Route,
    })),
    { id: 'action:theme', group: 'actions', label: 'Switch theme', action: 'toggle-theme' },
    { id: 'action:email', group: 'actions', label: 'Copy email address', action: 'copy-email' },
    { id: 'action:resume', group: 'actions', label: 'Download résumé (PDF)', action: 'resume' },
  ];
}
