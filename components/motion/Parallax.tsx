'use client';

import { useEffect, useRef } from 'react';
import { useMotion } from './SmoothScroll';

/*
 * A layer that drifts against the scroll inside a clipped frame.
 *
 * All the work happens in the shared engine (see SmoothScroll): this component
 * only hands over its two elements and gets out of the way. Doing the maths
 * here would mean every instance reading layout on every frame, which is what
 * made the scroll stutter in the first place.
 */
export default function Parallax({
  children,
  /** Share of the frame's height the layer travels, end to end. */
  intensity = 1,
  className,
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const { registerParallax, prefersReducedMotion } = useMotion();

  useEffect(() => {
    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer || prefersReducedMotion) return;
    return registerParallax(frame, layer, intensity);
  }, [registerParallax, intensity, prefersReducedMotion]);

  return (
    <div className={`parallax-frame${className ? ` ${className}` : ''}`} ref={frameRef}>
      <div className="parallax-layer" ref={layerRef}>
        {children}
      </div>
    </div>
  );
}
