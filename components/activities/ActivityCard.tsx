'use client';

import Image from 'next/image';
import Link from 'next/link';
import { activityScoreLabel, formatActivityDuration } from '@/lib/catalog';
import type { Tour } from '@/lib/types';
import { ClockIcon, HeartIcon } from '../icons';

/**
 * One activity in the results grid: photo, title, duration, traveler score,
 * cancellation note and price.
 *
 * The whole card links to the tour's own page; "Book" is a separate button so
 * it never nests inside the anchor.
 */
export default function ActivityCard({
  tour,
  /** 1-based position, shown only in the numbered "Top things to do" grid. */
  rank,
  onBook,
}: {
  tour: Tour;
  rank?: number;
  onBook: (tour: Tour) => void;
}) {
  const label = activityScoreLabel(tour.score);
  const href = `/things-to-do/${tour.id}`;

  return (
    <article className="act-card">
      <Link href={href} className="act-card-media" aria-label={tour.title}>
        <Image
          src={tour.image}
          alt={tour.imageAlt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
        {/* Decorative — this site has no saved-activities feature to back a toggle. */}
        <span className="act-card-heart" aria-hidden="true">
          <HeartIcon width={16} height={16} />
        </span>
      </Link>

      <div className="act-card-body">
        <Link href={href} className="act-card-title">
          {rank ? `${rank}. ` : ''}
          {tour.title}
        </Link>

        <p className="act-card-duration">
          <ClockIcon width={14} height={14} />
          {formatActivityDuration(tour.durationMinutes)}
        </p>

        <p className="act-card-score">
          <span className={`act-score${tour.score < 7 ? ' is-muted' : ''}`}>
            {tour.score.toFixed(1)}
          </span>
          <span className="act-card-score-words">
            {label && <strong>{label}</strong>}
            {tour.reviewCount} {tour.reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </p>

        {tour.freeCancellation && (
          <p className="act-card-cancel">Free cancellation available</p>
        )}

        <div className="act-card-foot">
          <div>
            <p className="act-card-price">{tour.price}</p>
            <p className="act-card-fine">includes taxes &amp; fees</p>
            <p className="act-card-fine">per {tour.priceUnit}</p>
          </div>
          <button className="btn btn-primary act-card-book" type="button" onClick={() => onBook(tour)}>
            Book
          </button>
        </div>
      </div>
    </article>
  );
}
