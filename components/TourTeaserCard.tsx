import Image from 'next/image';
import Link from 'next/link';
import type { Tour } from '@/lib/types';
import { tourQualityBadge } from '@/lib/catalog';
import Parallax from './motion/Parallax';

/**
 * The homepage's browse-only version of a tour card — no booking modal, since
 * the homepage teaser exists to point at /things-to-do, not to book from.
 */
export default function TourTeaserCard({ tour }: { tour: Tour }) {
  const durationBadge = tour.duration.split(' · ')[0];
  const badge = tourQualityBadge(tour.rating);

  return (
    <Link className="tour-card tour-teaser-card" href={`/things-to-do/${tour.id}`}>
      <div className="tour-media">
        <Parallax intensity={0.55}>
          <Image
            src={tour.image}
            alt={tour.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
          />
        </Parallax>
        <span className="tour-badge">{durationBadge}</span>
        {badge && (
          <span className={`listing-badge tour-quality-badge${badge.alt ? ' listing-badge-alt' : ''}`}>
            {badge.label}
          </span>
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
          <span className="btn btn-primary btn-book">View tour</span>
        </div>
      </div>
    </Link>
  );
}
