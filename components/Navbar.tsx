'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';

/** Scrolling past this many pixels is what lets the header hide at all — a
 *  visitor who has barely moved should never lose the nav entirely. */
const HIDE_THRESHOLD = 120;

export default function Navbar({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  // Solid background once the page has scrolled a little — or always, on a
  // page with no hero behind the navbar to justify starting transparent.
  const [isScrolled, setIsScrolled] = useState(false);
  // Hidden while scrolling down past the threshold; scrolling back up (by
  // any amount) brings it straight back, the common "auto-hiding" pattern.
  const [isHidden, setIsHidden] = useState(false);
  const isSolid = alwaysSolid || isScrolled;
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function update() {
      const y = window.scrollY;
      if (!alwaysSolid) setIsScrolled(y > 40);

      const isScrollingDown = y > lastScrollY.current;
      const hidden = isScrollingDown && y > HIDE_THRESHOLD;
      setIsHidden(hidden);
      /*
       * Set directly here, not from an effect keyed on isHidden — that would
       * still update in the same frame, but only after React commits the
       * render this triggered. Anything CSS-driven off --nav-offset (sticky
       * sidebars, the pinned hero) would lag the navbar's own slide by a
       * frame, which is exactly the kind of one-beat-late "settling" this
       * class exists to avoid.
       */
      document.documentElement.classList.toggle('nav-hidden', hidden);
      lastScrollY.current = y;
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [alwaysSolid]);

  return (
    <header
      className={`navbar${isSolid ? ' is-solid' : ''}${isHidden ? ' is-hidden' : ''}`}
      id="navbar"
    >
      <div className="navbar-inner">
        {/* The header carries the logo alone — no wordmark, no actions. */}
        <Link className="brand" href="/#top" aria-label="Amara Siam — home">
          <Image
            className="brand-mark"
            src="/brand/amara-siam-mark.png"
            alt=""
            width={970}
            height={992}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
