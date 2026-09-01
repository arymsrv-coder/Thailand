import Image from 'next/image';
import type { Tour } from '@/lib/types';
import Parallax from './motion/Parallax';

type Props = {
  tour: Tour;
  onBook: (tour: Tour) => void;
};

/**
 * "Guest favorite" / "Popular pick" on the destination cards comes from
 * editorial data (see lib/destinations.ts); tours have no such field, so the
 * same tag here is derived straight from the rating instead of asserted —
 * high bars, and most tours simply carry no badge at all.
 */
function qualityBadge(rating: string): { label: string; alt: boolean } | null {
  const value = Number.parseFloat(rating);
  if (Number.isNaN(value)) return null;
  if (value >= 4.9) return { label: 'Guest favorite', alt: false };
  if (value >= 4.7) return { label: 'Popular pick', alt: true };
  return null;
}

export default function TourCard({ tour, onBook }: Props) {
  // "Full day · 6 hrs" → "Full day"
  const durationBadge = tour.duration.split(' · ')[0];
  const badge = qualityBadge(tour.rating);

  return (
    <article className="tour-card">
      <div className="tour-media">
        <Parallax intensity={0.55}>
          <Image
            src={tour.image}
            alt={tour.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
          />
        </Parallax>
        {/* Outside the parallax frame, so the badges stay put as the photo drifts. */}
        <span className="tour-badge">{durationBadge}</span>
        {badge && (
          <button
            type="button"
            className={`listing-badge tour-quality-badge${badge.alt ? ' listing-badge-alt' : ''}`}
            title={`${badge.label} — rated ${tour.rating} by travelers`}
          >
            {badge.label}
          </button>
        )}
      </div>
      <div className="tour-body">
        <div className="tour-rating">
          <span className="star">★</span> {tour.rating}{' '}
          <span className="tour-loc">· {tour.location}</span>
        </div>
        <h3>{tour.title}</h3>
        <div className="tour-footer">
          <span className="tour-price price-pill">
            {tour.price} <small>/ person</small>
          </span>
          <button
            className="btn btn-primary btn-book"
            type="button"
            onClick={() => onBook(tour)}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}
