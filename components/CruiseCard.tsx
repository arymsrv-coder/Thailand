'use client';

import Image from 'next/image';
import type { Cruise } from '@/lib/types';
import type { InquiryItem } from './InquiryModal';

export default function CruiseCard({
  cruise,
  onSelect,
}: {
  cruise: Cruise;
  onSelect: (item: InquiryItem) => void;
}) {
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
    <article className="tour-card">
      <div className="tour-media">
        <Image
          src={cruise.image}
          alt={cruise.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
        />
        <span className="tour-badge">{cruise.nights > 0 ? `${cruise.nights} nights` : 'Day cruise'}</span>
      </div>
      <div className="tour-body">
        <div className="tour-rating">
          <span className="tour-loc">
            {cruise.line} · {cruise.region}
          </span>
        </div>
        <h3>{cruise.ship}</h3>
        <p className="cruise-ports">{cruise.ports.join(' → ')}</p>
        <div className="tour-footer">
          <span className="tour-price price-pill">
            {cruise.price} <small>/ traveler</small>
          </span>
          <button className="btn btn-primary btn-book" type="button" onClick={handleSelect}>
            Select
          </button>
        </div>
      </div>
    </article>
  );
}
