'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { SearchQuery } from '@/lib/types';
import HeroSearch from './HeroSearch';
import Reveal from './motion/Reveal';
import SplitText from './motion/SplitText';

export default function Hero({ query }: { query: SearchQuery }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Resolved on the client only, so the server and first client render agree.
  const [reducedMotion, setReducedMotion] = useState(false);
  // `is-static` cross-fades the video out for the poster image.
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /*
   * The video stays pinned to the top of the screen as the page scrolls (pure
   * CSS, see .hero-media). Once it has scrolled fully out of view it is paused
   * and swapped for a static poster to save resources; scrolling back up brings
   * it right back. An IntersectionObserver — rather than a scroll-position
   * calculation — keeps this correct however the hero's CSS dimensions change.
   */
  useEffect(() => {
    const media = mediaRef.current;
    if (reducedMotion || !media || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        setIsStatic(!entry.isIntersecting);
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0 }
    );
    observer.observe(media);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section className="hero" id="top">
      <div
        className={`hero-media${isStatic ? ' is-static' : ''}`}
        ref={mediaRef}
      >
        <video
          className="hero-video"
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/hero-poster.jpg"
          style={reducedMotion ? { display: 'none' } : undefined}
        >
          <source src="/assets/hero-bg.mp4" type="video/mp4" />
        </video>
        <Image
          className="hero-image"
          src="/Content/10-Best-Attractions-Thailand-Phang-Nga-Bay.webp"
          alt="Aerial view of Phang Nga Bay, Thailand"
          fill
          priority
          sizes="100vw"
          style={reducedMotion ? { opacity: 1 } : undefined}
        />
        <div className="hero-scrim" />
      </div>

      <div className="hero-content">
        <Reveal as="p" className="hero-eyebrow" distance="sm">
          Thailand, at your pace
        </Reveal>
        <h1>
          <SplitText lines={['Entire journey,', 'just for you.']} delay={90} />
        </h1>

        {/* Last in, after the headline has landed. */}
        <Reveal delay={380} distance="sm" className="hero-search-slot">
          <HeroSearch query={query} />
        </Reveal>

      </div>
    </section>
  );
}
