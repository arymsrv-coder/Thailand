'use client';

import { useEffect, useRef, useState } from 'react';
import { useFavorites } from './FavoritesProvider';
import { HeartIcon, InstagramIcon } from './icons';

const INSTAGRAM_URL = 'https://instagram.com/amarasiam';

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
  const { saved } = useFavorites();
  const isSolid = alwaysSolid || isScrolled;
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function update() {
      const y = window.scrollY;
      if (!alwaysSolid) setIsScrolled(y > 40);

      const isScrollingDown = y > lastScrollY.current;
      setIsHidden(isScrollingDown && y > HIDE_THRESHOLD);
      lastScrollY.current = y;
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [alwaysSolid]);

  const savedCount = saved.length;

  return (
    <header
      className={`navbar${isSolid ? ' is-solid' : ''}${isHidden ? ' is-hidden' : ''}`}
      id="navbar"
    >
      <div className="navbar-inner">
        <a className="brand" href="/#top">
          AMARA <span>·</span> SIAM
        </a>
        <div className="navbar-actions">
          {savedCount > 0 && (
            <a
              className="saved-badge"
              href="/#destinations"
              aria-label={`${savedCount} saved ${
                savedCount === 1 ? 'destination' : 'destinations'
              }`}
            >
              <HeartIcon />
              <span>{savedCount}</span>
            </a>
          )}
          <a className="btn btn-ghost" href="/#contact">
            Contact Us
          </a>
          <a
            className="icon-link"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener"
            aria-label="Amara Siam on Instagram"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
    </header>
  );
}
