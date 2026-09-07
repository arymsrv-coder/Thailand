'use client';

import Image from 'next/image';
import { activityScoreLabel } from '@/lib/catalog';
import type { Cruise } from '@/lib/types';
import { CheckCircleIcon, ClockIcon, GuestsIcon, PinIcon, ShipIcon } from './icons';
import type { InquiryItem } from './InquiryModal';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** "Nov – Apr" from a run of month numbers; falls back to "All year". */
function seasonLabel(months: number[]): string {
  if (months.length >= 12) return 'All year';
  if (months.length === 0) return '';
  return `${MONTH_NAMES[months[0] - 1]} – ${MONTH_NAMES[months[months.length - 1] - 1]}`;
}

export default function CruiseCard({
  cruise,
  onSelect,
}: {
  cruise: Cruise;
  onSelect: (item: InquiryItem) => void;
}) {
  const lengthLabel = cruise.nights > 0 ? `${cruise.nights} nights` : 'Day sailing';
  const scoreLabel = activityScoreLabel(cruise.score);

  function handleSelect() {
    onSelect({
      kind: 'cruise',
      id: cruise.id,
      label: `${cruise.ship} — ${cruise.region}`,
      subtitle: `${cruise.nights > 0 ? `${cruise.nights}-night` : 'Day'} sailing from ${cruise.departurePort}`,
      price: `${cruise.price} / traveler`,
      image: cruise.image,
    });
  }

  return (
    <article className="cruise-card">
      <div className="cruise-card-media">
        <Image
          src={cruise.image}
          alt={cruise.imageAlt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
        <span className="cruise-card-badge">{lengthLabel}</span>
      </div>

      <div className="cruise-card-body">
        <p className="cruise-card-line">
          {cruise.line} · {cruise.region}
        </p>
        <h3>{cruise.ship}</h3>

        <p className="cruise-card-score">
          <span className={`act-score${cruise.score < 7 ? ' is-muted' : ''}`}>
            {cruise.score.toFixed(1)}
          </span>
          <span className="act-card-score-words">
            {scoreLabel && <strong>{scoreLabel}</strong>}
            {cruise.reviewCount} {cruise.reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </p>

        <p className="cruise-ports">
          <PinIcon width={14} height={14} />
          <span>{cruise.ports.join(' → ')}</span>
        </p>

        <ul className="cruise-card-facts">
          <li>
            <ShipIcon width={14} height={14} /> {cruise.capacity} berths
          </li>
          <li>
            <ClockIcon width={14} height={14} /> Departs {cruise.departureDays.join(', ')}
          </li>
          <li>
            <GuestsIcon width={14} height={14} /> {cruise.cabins.join(' · ')}
          </li>
        </ul>

        <p className="cruise-card-highlight">{cruise.highlights[0]}</p>

        <ul className="cruise-card-includes">
          {cruise.includes.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="cruise-card-season">
          Best {seasonLabel(cruise.bestMonths)}
          {cruise.freeCancellation && (
            <span className="cruise-card-cancel">
              <CheckCircleIcon width={13} height={13} /> Free cancellation
            </span>
          )}
        </p>

        <div className="cruise-card-foot">
          <div>
            <p className="cruise-card-price">{cruise.price}</p>
            <p className="act-card-fine">per traveler, includes port fees</p>
          </div>
          <button className="btn btn-primary act-card-book" type="button" onClick={handleSelect}>
            Select
          </button>
        </div>
      </div>
    </article>
  );
}
