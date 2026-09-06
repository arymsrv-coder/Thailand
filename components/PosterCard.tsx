'use client';

import Image from 'next/image';
import { useState } from 'react';
import { HeartIcon } from './icons';

export type Tag = {
  label: string;
  tone: 'favorite' | 'popular' | 'soon' | 'luxury';
};

export type PosterCardData = {
  title: string;
  location: string;
  meta: string;
  image: string;
  tag: Tag;
  href?: string;
  external?: boolean;
};

/*
 * The portrait poster tile shared by Main Booking, Hotels & Homes, and
 * Tours & Experiences — a full-bleed photo with everything else overlaid on
 * it (category tag + like button up top, a bottom scrim carrying location,
 * title and rating/detail line) rather than a separate white body below the
 * image.
 */
export default function PosterCard({ card }: { card: PosterCardData }) {
  // Purely a visual "like" — this grid has no backing favourites list of its
  // own (unlike destinations, which really do get saved), so this toggles
  // locally rather than pretending to persist anything.
  const [liked, setLiked] = useState(false);

  const media = (
    <div className="poster-media">
      <Image
        src={card.image}
        alt=""
        fill
        /*
         * Deliberately wider than these cards actually render (~220-370px
         * CSS-wide): every source photo here is landscape (~700x496 or
         * wider) but the box is a 3:4 portrait, so object-fit: cover crops
         * to the box's HEIGHT, not its width. Next's optimizer only ever
         * resizes by the width `sizes` implies, keeping the source's own
         * aspect ratio — so a width-accurate hint (e.g. "220px") produced an
         * image barely 130px tall, then stretched ~2.5x to cover a 360px-
         * tall box. Asking for more width than needed pulls a taller crop
         * along with it and fixes that at the cost of a heavier file.
         */
        sizes="(max-width: 640px) 90vw, (max-width: 1080px) 60vw, 550px"
      />
      <div className="poster-scrim" />

      <div className="poster-top">
        <span className={`poster-tag poster-tag-${card.tag.tone}`}>{card.tag.label}</span>
        <button
          type="button"
          className={`poster-heart${liked ? ' is-liked' : ''}`}
          aria-pressed={liked}
          aria-label={liked ? `Remove ${card.title} from liked` : `Like ${card.title}`}
          onClick={(event) => {
            event.preventDefault();
            setLiked((current) => !current);
          }}
        >
          <HeartIcon width={16} height={16} />
        </button>
      </div>

      <div className="poster-bottom">
        <span className="poster-location">{card.location}</span>
        <h4>{card.title}</h4>
        <p className="poster-meta">{card.meta}</p>
      </div>
    </div>
  );

  if (card.href) {
    return (
      <a
        className="poster-card"
        href={card.href}
        target={card.external ? '_blank' : undefined}
        rel={card.external ? 'noopener' : undefined}
      >
        {media}
      </a>
    );
  }

  return (
    <div className="poster-card is-disabled" aria-disabled="true">
      {media}
    </div>
  );
}
