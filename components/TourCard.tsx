import Image from 'next/image';
import Link from 'next/link';
import type { Tour } from '@/lib/types';
import { tourQualityBadge } from '@/lib/catalog';
import Parallax from './motion/Parallax';

type Props = {
  tour: Tour;
  onBook: (tour: Tour) => void;
};

export default function TourCard({ tour, onBook }: Props) {
  // "Full day · 6 hrs" → "Full day"
  const durationBadge = tour.duration.split(' · ')[0];
  const badge = tourQualityBadge(tour.rating);
  const detailHref = `/things-to-do/${tour.id}`;

  return (
    <article className="tour-card">
      {/*
       * Two separate links to the same detail page, not one wrapping the
       * whole card — Book Now is its own button and can't nest inside an
       * anchor without breaking accessibility.
       */}
      <Link href={detailHref} className="tour-card-link">
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
            <span className={`listing-badge tour-quality-badge${badge.alt ? ' listing-badge-alt' : ''}`}>
              {badge.label}
            </span>
          )}
        </div>
      </Link>
      <div className="tour-body">
        <Link href={detailHref} className="tour-card-link">
          <div className="tour-rating">
            <span className="star">★</span> {tour.rating}{' '}
            <span className="tour-loc">· {tour.location}</span>
          </div>
          <h3>{tour.title}</h3>
        </Link>
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
