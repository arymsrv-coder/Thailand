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
 *   measure — read layout, on its own frame, never during a scroll frame
 *   apply   — write transforms, pure arithmetic, never reading anything
 *
 * That separation is the whole point. The first version let each parallax
 * layer call getBoundingClientRect() and then write its own transform, on every
 * frame. Reading layout after writing to it forces the browser to re-lay out
 * the document synchronously, so eighteen layers meant eighteen forced layouts
 * per frame — measured at seventeen reads a frame, and the visible result was a
 * scroll that stuttered under any real load.
 *
 * Three further rules, each of which cost a visible scroll glitch:
 *
 * 1. `apply` has exactly one caller during a scroll — Lenis — and always
 *    receives Lenis's own scroll value. A second caller passing window.scrollY
 *    writes transforms computed from a different origin, and the layers then
 *    snap between the two positions on alternate frames. That reads as the
 *    page juddering up and down under the pointer.
 *
 * 2. `apply` never measures. Measuring mixes a window.scrollY-based origin into
 *    a frame that is being drawn against Lenis's, which puts every layer out by
 *    the difference for that frame, and it does ~30 forced layouts while the
 *    scroll is running.
 *
 * 3. The invalidation observer watches the parallax frames, not <body>. Body
 *    height changes on this site constantly while scrolling — every lazily
 *    loaded image, every reveal — and watching it meant re-measuring
 *    everything, mid-scroll, over and over.
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
  /** Set by the effect; lets registration invalidate without reaching into it. */
  const invalidateRef = useRef<() => void>(() => {});
  const frameObserver = useRef<ResizeObserver | null>(null);

  const registerParallax = useCallback(
    (frame: HTMLElement, layer: HTMLElement, intensity: number) => {
      const entry: ParallaxEntry = { frame, layer, intensity, top: 0, height: 0 };
      entries.current.add(entry);
      frameObserver.current?.observe(frame);
      invalidateRef.current();

      return () => {
        entries.current.delete(entry);
        frameObserver.current?.unobserve(frame);
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
      /*
       * Follow the input closely. At 0.12 the page trailed far enough behind
       * the wheel to read as lag; this keeps the easing without the drag.
       */
      lerp: 0.22,
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

    /**
     * Read phase. Runs on its own frame, never inside a scroll frame, and
     * pairs `rect.top` with the document scroll that actually produced it.
     */
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

    // Lenis is the only thing that drives a scroll frame, and it always passes
    // its own scroll value — see rule 1 above.
    instance.on('scroll', ({ scroll }: { scroll: number }) => {
      if (needsMeasure.current) return; // the pending measure frame will apply
      apply(scroll);
    });

    /*
     * Anything that can change layout invalidates the cache rather than
     * remeasuring immediately, so a burst of changes costs one read, on the
     * next frame, instead of one per change.
     */
    let pending = 0;
    const invalidate = () => {
      needsMeasure.current = true;
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        measure();
        apply(instance.scroll);
      });
    };
    invalidateRef.current = invalidate;

    window.addEventListener('resize', invalidate, { passive: true });

    /*
     * Watch the frames themselves. Watching <body> instead meant every lazily
     * loaded image anywhere on the page re-measured every layer, mid-scroll.
     */
    const observer = new ResizeObserver(invalidate);
    frameObserver.current = observer;
    for (const entry of entries.current) observer.observe(entry.frame);

    setLenis(instance);

    /*
     * First pass runs synchronously. Deferring it to the invalidate rAF would
     * paint every layer once at translate(0) and then jump it into place.
     * Nothing is scrolling yet, so measuring here costs nothing.
     */
    measure();
    apply(instance.scroll);

    return () => {
      reduced.removeEventListener('change', onPreferenceChange);
      window.removeEventListener('resize', invalidate);
      if (pending) cancelAnimationFrame(pending);
      observer.disconnect();
      frameObserver.current = null;
      invalidateRef.current = () => {};
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
