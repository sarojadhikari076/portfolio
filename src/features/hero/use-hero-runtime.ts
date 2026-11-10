'use client';

import { type RefObject, useEffect, useState, useSyncExternalStore } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

let webglSupport: boolean | undefined;

function hasWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      webglSupport = Boolean(document.createElement('canvas').getContext('webgl2'));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

type NetworkInformation = { saveData?: boolean };

function prefersLessData(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return connection?.saveData === true;
}

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => {
    query.removeEventListener('change', onChange);
  };
}

/**
 * Whether the 3D scene may run at all: motion allowed, WebGL2 present, and no data-saver. The
 * server always says no, so the SVG is what renders first everywhere.
 */
export function useCanAnimate(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => !window.matchMedia(REDUCED_MOTION).matches && hasWebGL() && !prefersLessData(),
    () => false,
  );
}

/** True once the browser has a quiet moment after load, so the scene never competes with LCP. */
export function useAfterIdle(): boolean {
  const [isIdle, setIdle] = useState(false);

  useEffect(() => {
    const done = () => {
      setIdle(true);
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(done, { timeout: 2500 });
      return () => {
        window.cancelIdleCallback(id);
      };
    }

    const id = setTimeout(done, 1200);
    return () => {
      clearTimeout(id);
    };
  }, []);

  return isIdle;
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => {
    document.removeEventListener('visibilitychange', onChange);
  };
}

/** On screen and in a visible tab. Anything else and the render loop should stop. */
export function useIsOnScreen(target: RefObject<HTMLElement | null>): boolean {
  const [isIntersecting, setIntersecting] = useState(false);
  const isTabVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  );

  useEffect(() => {
    const element = target.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry?.isIntersecting ?? false);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [target]);

  return isIntersecting && isTabVisible;
}
