import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const isDevelopment = process.env.NODE_ENV === 'development';

// Vercel's preview toolbar lives on vercel.live. Production never loads it, so neither does the
// production policy.
const vercelLive = process.env.VERCEL_ENV === 'preview' ? ' https://vercel.live' : '';

/**
 * Every page is static, so there is no request to hang a nonce on. `'unsafe-inline'` for scripts
 * is the cost of that: Next.js streams its payload in inline scripts, and next-themes sets the
 * theme before first paint with one. Everything else is locked to this origin.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // In development, Vercel Analytics loads a debug build from its CDN instead of this origin.
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''}${vercelLive}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${vercelLive}`,
  "font-src 'self'",
  `connect-src 'self'${vercelLive}`,
  `frame-src${vercelLive || " 'none'"}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactCompiler: true,
  typedRoutes: true,
  headers() {
    return Promise.resolve([{ source: '/(.*)', headers: securityHeaders }]);
  },
};

/**
 * Turbopack runs the MDX compiler in Rust, so plugins are named by package and their options must
 * be plain JSON. That rules out function options, which is why headings get their ids from
 * rehype-slug and the table of contents is read from the source instead of from a plugin.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm', 'remark-frontmatter'],
    rehypePlugins: [
      'rehype-slug',
      [
        'rehype-pretty-code',
        {
          theme: { dark: 'github-dark-dimmed', light: 'github-light' },
          keepBackground: false,
          defaultLang: 'plaintext',
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
