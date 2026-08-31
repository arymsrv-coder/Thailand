import Image from 'next/image';
import type { Tour } from '@/lib/types';
import Parallax from './motion/Parallax';

type Props = {
  tour: Tour;
  onBook: (tour: Tour) => void;
};

export default function TourCard({ tour, onBook }: Props) {
  // "Full day · 6 hrs" → "Full day"
  const badge = tour.duration.split(' · ')[0];

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
        {/* Outside the parallax frame, so the badge stays put as the photo drifts. */}
        <span className="tour-badge">{badge}</span>
      </div>
      <div className="tour-body">
        <div className="tour-rating">
          <span className="star">★</span> {tour.rating}{' '}
          <span className="tour-loc">· {tour.location}</span>
        </div>
        <h3>{tour.title}</h3>
        <div className="tour-footer">
          <span className="tour-price">
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
