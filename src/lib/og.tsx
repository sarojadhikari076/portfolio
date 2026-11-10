import { ImageResponse } from 'next/og';

import { profile } from '@/data/profile';

export const OG_SIZE = { width: 1200, height: 630 };

const COLOURS = {
  background: '#0b0c0e',
  grid: 'rgba(255,255,255,0.045)',
  foreground: '#e8e6e1',
  muted: '#8b8f96',
  edge: '#383d45',
  accent: '#f8a300',
};

type FontSpec = { family: string; weight: 400 | 600; text: string };

/**
 * Satori needs TTF or OTF, and next/font only ships WOFF2, so share cards fetch a subset of each
 * font from Google Fonts at build time: just the characters on the card. If that fails the card
 * still renders, in the default face.
 */
async function loadFont({ family, weight, text }: FontSpec) {
  try {
    const query = `family=${family.replaceAll(' ', '+')}:wght@${String(weight)}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text();
    const url = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css)?.[1];
    if (!url) return null;

    const data = await (await fetch(url)).arrayBuffer();
    return { name: family, data, weight, style: 'normal' as const };
  } catch {
    return null;
  }
}

type ShareCardArgs = { eyebrow: string; title: string; detail?: string };

export async function renderShareCard({ eyebrow, title, detail = '' }: ShareCardArgs) {
  const footer = `${profile.name.toLowerCase()} · ${profile.role.toLowerCase()}`;
  const fonts = (
    await Promise.all([
      loadFont({ family: 'Schibsted Grotesk', weight: 600, text: title }),
      loadFont({ family: 'Schibsted Grotesk', weight: 400, text: detail }),
      loadFont({ family: 'JetBrains Mono', weight: 400, text: `${eyebrow}${footer}` }),
    ])
  ).filter((font) => font !== null);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        backgroundColor: COLOURS.background,
        backgroundImage: `linear-gradient(${COLOURS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLOURS.grid} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        color: COLOURS.foreground,
        fontFamily: 'Schibsted Grotesk',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'JetBrains Mono',
          fontSize: 24,
          color: COLOURS.muted,
        }}
      >
        {eyebrow}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 48 ? 64 : 80,
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {detail ? (
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.35,
              color: COLOURS.muted,
              maxWidth: 940,
            }}
          >
            {detail}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: 'JetBrains Mono',
          fontSize: 22,
          color: COLOURS.muted,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            backgroundColor: COLOURS.accent,
            transform: 'rotate(45deg)',
          }}
        />
        {footer}
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  );
}
