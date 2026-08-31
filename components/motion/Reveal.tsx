'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * Fades and lifts its children into place the first time they reach the
 * viewport, then stops watching.
 *
 * The hidden starting state lives in CSS behind `.motion-ready`, a class the
 * inline script in <head> sets before first paint and only when the visitor has
 * not asked for reduced motion. So the content is visible by default: with
 * JavaScript off, with reduced motion on, or if the bundle never arrives,
 * nothing here can hide it.
 */

type Props = {
  children: React.ReactNode;
  /** Stagger, in ms, for items revealed as a group. */
  delay?: number;
  /** How far up the element travels. */
  distance?: 'sm' | 'md' | 'lg';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'p' | 'span';
};

export default function Reveal({
  children,
  delay = 0,
  distance = 'md',
  className,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Without IntersectionObserver, show immediately rather than never.
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        // One-way: re-hiding on scroll-up reads as a glitch, not an effect.
        observer.disconnect();
      },
      // Start a little before the element's edge so the motion finishes
      // around the moment it is properly in view.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const classes = [
    'reveal',
    `reveal-${distance}`,
    isVisible ? 'is-in' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      // The ref type varies per tag; the DOM node is the same either way.
      ref={ref as React.Ref<never>}
      className={classes}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
