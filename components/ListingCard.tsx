'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';
import type { Destination, SearchQuery } from '@/lib/types';
import { toSearchParams } from '@/lib/catalog';
import { useFavorites } from './FavoritesProvider';
import Parallax from './motion/Parallax';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CoordsIcon,
  HeartIcon,
  PinIcon,
} from './icons';

/**
 * A destination in the "Where to go" feed. Thumbnail dots switch the photo, the
 * heart toggles a save state, and activating the row expands an accordion panel
 * with the full gallery, an About paragraph and an address card. The collapsed
 * thumbnail and the expanded gallery share one photo index, so switching either
 * keeps the other in sync.
 *
 * The row is expanded by a transparent <button> stretched across it rather than
 * a click handler on the wrapper, so the accordion works from the keyboard and
 * announces its state. The heart and the dots paint above that button, so they
 * still receive their own clicks.
 */
export default function ListingCard({
  destination,
  query,
}: {
  destination: Destination;
  query: SearchQuery;
}) {
  const { name, images, coords } = destination;

  const panelId = useId();
  const favorites = useFavorites();
  const isSaved = favorites.isSaved(destination.slug);

  const [index, setIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  // Collapsed panels are zero-height but still in the DOM, and a zero-height
  // image intersects the viewport — so native lazy loading would fetch all ten
  // gallery photos and mount all ten map iframes on first paint. Both are held
  // back until the card is first opened, and kept mounted from then on so
  // collapsing does not reload them.
  const [hasOpened, setHasOpened] = useState(false);

  /*
   * Carries the rest of the current search across, so narrowing to one place
   * does not quietly discard the dates and party size already chosen.
   */
  const tourParams = toSearchParams({ ...query, where: destination.slug });
  const toursHref = `/?${tourParams.toString()}#tours`;

  const compactCoords = coords.replace(', ', ',');
  const mapSrc = `https://www.google.com/maps?q=${compactCoords}&z=11&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${compactCoords}`;

  function step(delta: number) {
    setIndex((current) => (current + delta + images.length) % images.length);
  }

  function toggleExpanded() {
    setIsExpanded((expanded) => !expanded);
    setHasOpened(true);
  }

  return (
    <article className={`listing-card${isExpanded ? ' is-expanded' : ''}`}>
      <div className="listing-row">
        <button
          type="button"
          className="listing-expand"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={toggleExpanded}
        >
          <span className="sr-only">
            {isExpanded ? `Hide details for ${name}` : `Show details for ${name}`}
          </span>
        </button>

        <div className="listing-media">
          <span
            className={`listing-badge${destination.badgeAlt ? ' listing-badge-alt' : ''}`}
          >
            {destination.badge}
          </span>
          <button
            className={`listing-heart${isSaved ? ' is-saved' : ''}`}
            type="button"
            aria-label={isSaved ? `Remove ${name} from saved` : `Save ${name}`}
            aria-pressed={isSaved}
            onClick={() => favorites.toggle(destination.slug)}
          >
            <HeartIcon />
          </button>
          <Parallax intensity={0.4}>
            <Image
              src={images[index]}
              alt={destination.thumbAlt}
              fill
              sizes="180px"
            />
          </Parallax>
          <div className="listing-dots">
            {images.map((image, i) => (
              <button
                key={image}
                type="button"
                aria-label={`Photo ${i + 1}`}
                className={i === index ? 'is-active' : undefined}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="listing-info">
          <div>
            <h3>{name}</h3>
            <p className="listing-sub">{destination.sub}</p>
            <p className="listing-facts">{destination.facts}</p>
          </div>
          <div className="listing-footer">
            <span className="listing-price">{destination.price}</span>
            <span className="listing-rating">
              <span className="star">★</span> {destination.rating}{' '}
              <span className="rating-count">({destination.ratingCount})</span>
            </span>
          </div>
        </div>

        <span className="listing-toggle" aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </div>

      <div className="listing-details" id={panelId}>
        <div>
          <div className="listing-details-inner">
            <div className="listing-gallery">
              <button
                type="button"
                className="gallery-arrow gallery-prev"
                aria-label="Previous photo"
                onClick={() => step(-1)}
              >
                <ChevronLeftIcon />
              </button>
              {hasOpened && (
                <Image
                  className="listing-gallery-img"
                  src={images[index]}
                  alt={`${name} — photo ${index + 1}`}
                  fill
                  sizes="(max-width: 1080px) 100vw, 640px"
                />
              )}
              <button
                type="button"
                className="gallery-arrow gallery-next"
                aria-label="Next photo"
                onClick={() => step(1)}
              >
                <ChevronRightIcon />
              </button>
              <span className="listing-gallery-counter">
                {index + 1} / {images.length}
              </span>
            </div>

            <div className="listing-details-body">
              <div className="listing-details-text">
                <h4>About</h4>
                <p>{destination.about}</p>
                <Link href={toursHref} scroll>
                  See {name} tours →
                </Link>
              </div>
              <div className="listing-map-card">
                <div className="listing-map-preview">
                  {hasOpened && (
                    <iframe title={`Map of ${name}`} src={mapSrc} loading="lazy" />
                  )}
                </div>
                <div className="listing-map-info">
                  <p className="listing-map-place">
                    <PinIcon width={16} height={16} />
                    <span>
                      <strong>{name}</strong>Thailand
                    </span>
                  </p>
                  <p className="listing-map-coords">
                    <CoordsIcon />
                    {coords}
                  </p>
                  <a
                    className="btn btn-primary listing-directions"
                    href={directionsHref}
                    target="_blank"
                    rel="noopener"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
