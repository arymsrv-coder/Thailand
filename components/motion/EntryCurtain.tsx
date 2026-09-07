'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLenis } from './SmoothScroll';

/*
 * The opening wipe: a full-bleed panel carrying the logo that lifts away to
 * reveal the hero, as Studio Aurora does on load.
 *
 * It plays once per browsing session — a curtain that reappears on every visit
 * stops being an entrance and becomes an obstacle. It is skipped entirely under
 * reduced motion, and being client-only it never exists for a visitor without
 * JavaScript, so it can never hide the page.
 *
 * Two details it is easy to get wrong, and which cost real bugs here:
 *
 * 1. The decision is made once per page load and cached at module scope. Read
 *    from sessionStorage inside the effect instead, and React's development
 *    double-invoke sees the flag its own first pass just wrote, bails out, and
 *    leaves a curtain that never lifts — over a page whose scroll it stopped.
 *
 * 2. Reduced motion is read straight from matchMedia rather than from context.
 *    Context state arrives a render late, by which time the curtain has already
 *    begun playing for exactly the visitor who asked it not to.
 *
 * The lift itself is a CSS animation ended by its own animationend event, so
 * there are no timers to fall out of step with what is on screen.
 */

const SESSION_KEY = 'amara-curtain-shown';

/** null until decided; then fixed for the life of this page load. */
let shouldPlay: boolean | null = null;

function decideOnce(): boolean {
  if (shouldPlay !== null) return shouldPlay;

  if (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    shouldPlay = false;
    return shouldPlay;
  }

  try {
    shouldPlay = sessionStorage.getItem(SESSION_KEY) !== '1';
    if (shouldPlay) sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Private browsing can throw on access. Playing once more is harmless.
    shouldPlay = true;
  }

  return shouldPlay;
}

export default function EntryCurtain() {
  const lenis = useLenis();
  // Never render on the server: the markup would not match what the client
  // decides, and a curtain in the static HTML is a curtain that can get stuck.
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(decideOnce());
  }, []);

  /*
   * Hold the page still underneath the curtain — scrolling a page you cannot
   * see leaves you somewhere unexpected when it opens. The cleanup always
   * restarts Lenis, so no path out of here can leave scrolling disabled.
   */
  useEffect(() => {
    if (!isPlaying || !lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [isPlaying, lenis]);

  if (!isPlaying) return null;

  return (
    <div
      className="curtain"
      aria-hidden="true"
      onAnimationEnd={(event) => {
        // Only the panel's own lift ends the curtain, not the logo's.
        if (event.target === event.currentTarget) setIsPlaying(false);
      }}
    >
      <span className="curtain-mark">
        <Image
          src="/brand/amara-siam-lockup.png"
          alt=""
          width={976}
          height={1156}
          priority
        />
      </span>
    </div>
  );
}
