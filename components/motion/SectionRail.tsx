'use client';

import { useEffect, useState } from 'react';
import { useMotion } from './SmoothScroll';

/*
 * The fixed rail of section markers, mirroring Studio Aurora's right-hand dot
 * navigation: it shows where you are in the page and jumps you elsewhere.
 *
 * It is a real <nav> of buttons, so it is reachable by keyboard and announced
 * as navigation rather than being decorative dots. It is hidden below the
 * desktop breakpoint, where it would crowd the content.
 */

const SECTIONS = [
  { id: 'top', label: 'Intro' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'tours', label: 'Tours' },
  { id: 'faq', label: 'Good to Know' },
  { id: 'contact', label: 'Contact' },
];

export default function SectionRail() {
  const { lenis } = useMotion();
  const [activeId, setActiveId] = useState('top');

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null
    );
    if (elements.length === 0 || !('IntersectionObserver' in window)) return;

    /*
     * A band across the middle of the viewport decides what counts as the
     * current section, rather than whatever merely overlaps the edge — with
     * sections this tall, several are on screen at once.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="section-rail" aria-label="Page sections">
      {SECTIONS.map(({ id, label }) => {
        const isActive = id === activeId;
        return (
          <button
            key={id}
            type="button"
            className={`rail-dot${isActive ? ' is-active' : ''}`}
            aria-label={`Go to ${label}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => {
              const target = document.getElementById(id);
              if (!target) return;
              // No offset: section scroll-margin-top already clears the navbar.
              if (lenis) lenis.scrollTo(target);
              else target.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="rail-label">{label}</span>
            <span className="rail-mark" aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
