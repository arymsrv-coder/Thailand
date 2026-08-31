'use client';

import { useEffect, useState } from 'react';
import { useLenis } from './SmoothScroll';

/** A pill that appears past the hero and glides the page home. */
export default function BackToTop() {
  const lenis = useLenis();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // `scroll` is Lenis's own animated offset, so no layout is read here.
    const update = ({ scroll }: { scroll: number }) => {
      // setState with an unchanged value is a no-op, so this does not
      // re-render on every scroll frame.
      setIsVisible(scroll > window.innerHeight * 0.9);
    };

    if (lenis) {
      lenis.on('scroll', update);
      return () => lenis.off('scroll', update);
    }

    // Before the engine exists, or if it never does, fall back to the event.
    const onScroll = () => setIsVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lenis]);

  return (
    <button
      type="button"
      className={`to-top${isVisible ? ' is-visible' : ''}`}
      aria-label="Back to top"
      // Kept out of the tab order while off screen, so it is never a focus
      // stop pointing at something the visitor cannot see.
      tabIndex={isVisible ? 0 : -1}
      onClick={() => {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18" strokeWidth="2">
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
