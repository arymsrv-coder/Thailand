'use client';

import { useEffect, useState } from 'react';
import { useFavorites } from './FavoritesProvider';
import { HeartIcon, InstagramIcon } from './icons';

const INSTAGRAM_URL = 'https://instagram.com/amarasiam';

const links = [
  { href: '/#destinations', label: 'Destinations' },
  { href: '/#tours', label: 'Tours' },
  { href: '/#faq', label: 'Good to Know' },
];

export default function Navbar() {
  // Solid background once the page has scrolled a little.
  const [isSolid, setIsSolid] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { saved } = useFavorites();

  useEffect(() => {
    const update = () => setIsSolid(window.scrollY > 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  /*
   * Escape closes the menu, and so does growing past the breakpoint where the
   * toggle disappears — otherwise the panel would be left open and orphaned
   * behind a desktop layout that has no way to close it.
   */
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false);
    }
    const wide = window.matchMedia('(min-width: 861px)');
    const handleChange = () => wide.matches && setIsMenuOpen(false);

    document.addEventListener('keydown', handleKeyDown);
    wide.addEventListener('change', handleChange);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      wide.removeEventListener('change', handleChange);
    };
  }, [isMenuOpen]);

  const savedCount = saved.length;

  return (
    <header className={`navbar${isSolid ? ' is-solid' : ''}`} id="navbar">
      <div className="navbar-inner">
        <a className="brand" href="#top">
          AMARA <span>·</span> SIAM
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="navbar-actions">
          {savedCount > 0 && (
            <a
              className="saved-badge"
              href="#destinations"
              aria-label={`${savedCount} saved ${
                savedCount === 1 ? 'destination' : 'destinations'
              }`}
            >
              <HeartIcon />
              <span>{savedCount}</span>
            </a>
          )}
          <a className="btn btn-ghost" href="#contact">
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
          <button
            className="menu-toggle"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobileNav"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <nav
        className={`nav-mobile${isMenuOpen ? ' is-open' : ''}`}
        id="mobileNav"
        aria-label="Mobile"
        inert={!isMenuOpen}
      >
        {[...links, { href: '/#contact', label: 'Contact Us' }].map((link) => (
          <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
