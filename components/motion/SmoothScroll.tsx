'use client';

import Lenis from 'lenis';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/*
 * The scroll engine the rest of the motion system rides on.
 *
 * One Lenis instance provides the inertial scrolling, and one registry drives
 * every scroll-linked effect, in two strictly separated phases:
 *
 *   measure — read layout, but only when layout can actually have changed
 *   apply   — write transforms, never reading anything
 *
 * That separation is the whole point. The first version let each parallax
 * layer call getBoundingClientRect() and then write its own transform, on every
 * frame. Reading layout after writing to it forces the browser to re-lay out
 * the document synchronously, so eighteen layers meant eighteen forced layouts
 * per frame — measured at seventeen reads a frame, and the visible result was a
 * scroll that stuttered under any real load.
 *
 * Positions are now derived arithmetically from the scroll offset alone, so a
 * scroll frame does no layout work at all.
 */

type ParallaxEntry = {
  frame: HTMLElement;
  layer: HTMLElement;
  intensity: number;
  /** Document-absolute top and height, refreshed only by measure(). */
  top: number;
  height: number;
};

type MotionContextValue = {
  lenis: Lenis | null;
  registerParallax: (
    frame: HTMLElement,
    layer: HTMLElement,
    intensity: number
  ) => () => void;
  prefersReducedMotion: boolean;
};

const MotionContext = createContext<MotionContextValue>({
  lenis: null,
  registerParallax: () => () => {},
  prefersReducedMotion: false,
});

export function useMotion(): MotionContextValue {
  return useContext(MotionContext);
}

export function useLenis(): Lenis | null {
  return useContext(MotionContext).lenis;
}

/*
 * The layer overhangs its frame by 12% top and bottom (see .parallax-layer),
 * and travel is capped just inside that, so an edge can never be exposed.
 */
const OVERHANG = 0.12;
const TRAVEL = OVERHANG * 0.82;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const entries = useRef(new Set<ParallaxEntry>());
  const needsMeasure = useRef(true);

  const registerParallax = useCallback(
    (frame: HTMLElement, layer: HTMLElement, intensity: number) => {
      const entry: ParallaxEntry = { frame, layer, intensity, top: 0, height: 0 };
      entries.current.add(entry);
      needsMeasure.current = true;
      return () => {
        entries.current.delete(entry);
        layer.style.transform = '';
      };
    },
    []
  );

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(reduced.matches);
    const onPreferenceChange = () => setPrefersReducedMotion(reduced.matches);
    reduced.addEventListener('change', onPreferenceChange);

    /*
     * Tells the inline script in <head> that React is alive. Without this the
     * script un-hides the page after a few seconds, so a bundle that never
     * arrives cannot leave the content invisible.
     */
    document.documentElement.classList.add('motion-active');

    const instance = new Lenis({
      autoRaf: true,
      // Higher than the 0.09 this started at: a low value trails the input
      // device far enough behind that the page feels detached from the wheel.
      lerp: 0.12,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      /*
       * No anchor offset here on purpose: the stylesheet already gives every
       * section `scroll-margin-top: var(--nav-height)`, which Lenis honours.
       * Adding a navbar offset as well counted the gap twice.
       */
      anchors: true,
      prevent: (node) => node.hasAttribute?.('data-lenis-prevent') ?? false,
    });

    /** Read phase. Batched, and only when layout may have changed. */
    const measure = () => {
      const scroll = window.scrollY;
      for (const entry of entries.current) {
        const rect = entry.frame.getBoundingClientRect();
        entry.top = rect.top + scroll;
        entry.height = rect.height;
      }
      needsMeasure.current = false;
    };

    /** Write phase. Pure arithmetic on the scroll offset — no layout reads. */
    const apply = (scroll: number) => {
      if (needsMeasure.current) measure();

      const viewport = window.innerHeight;
      const half = viewport / 2;

      for (const entry of entries.current) {
        // Frame centre relative to viewport centre, without touching layout.
        const centre = entry.top + entry.height / 2 - scroll;
        const denominator = half + entry.height / 2;
        const progress = (half - centre) / denominator;
        const clamped = progress < -1 ? -1 : progress > 1 ? 1 : progress;

        entry.layer.style.transform = `translate3d(0, ${
          clamped * TRAVEL * entry.intensity * entry.height
        }px, 0)`;
      }
    };

    instance.on('scroll', ({ scroll }: { scroll: number }) => apply(scroll));

    /*
     * Anything that can change layout invalidates the cache rather than
     * remeasuring immediately, so a burst of changes costs one read, on the
     * next frame, instead of one per change.
     */
    const invalidate = () => {
      needsMeasure.current = true;
      apply(window.scrollY);
    };

    window.addEventListener('resize', invalidate, { passive: true });
    // Catches accordions opening, search results changing, images arriving.
    const bodyObserver = new ResizeObserver(invalidate);
    bodyObserver.observe(document.body);

    setLenis(instance);
    apply(window.scrollY);

    return () => {
      reduced.removeEventListener('change', onPreferenceChange);
      window.removeEventListener('resize', invalidate);
      bodyObserver.disconnect();
      instance.destroy();
      document.documentElement.classList.remove('motion-active');
      setLenis(null);
    };
  }, []);

  const value = useMemo(
    () => ({ lenis, registerParallax, prefersReducedMotion }),
    [lenis, registerParallax, prefersReducedMotion]
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
