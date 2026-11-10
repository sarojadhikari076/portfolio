export function SkipLink() {
  return (
    <a
      className="sr-only z-50 bg-accent px-3 py-2 font-mono text-sm text-accent-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      href="#main"
    >
      Skip to content
    </a>
  );
}
