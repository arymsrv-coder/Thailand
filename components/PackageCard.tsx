'use client';

import Image from 'next/image';
import { findDestination } from '@/lib/catalog';
import type { PackageDeal } from '@/lib/types';
import type { InquiryItem } from './InquiryModal';

export default function PackageCard({
  pkg,
  onSelect,
}: {
  pkg: PackageDeal;
  onSelect: (item: InquiryItem) => void;
}) {
  const destination = findDestination(pkg.destinationSlug);
  const image = destination?.images[0];

  function handleSelect() {
    onSelect({
      kind: 'package',
      id: pkg.id,
      label: pkg.title,
      subtitle: `${pkg.nights}-night package from ${pkg.fromCity}`,
      price: `${pkg.price} / person`,
      image,
    });
  }

  return (
    <article className="tour-card">
      <div className="tour-media">
        {image && (
          <Image
            src={image}
            alt={destination?.name ?? pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
          />
        )}
        <span className="tour-badge">{pkg.nights} nights</span>
      </div>
      <div className="tour-body">
        <div className="tour-rating">
          <span className="tour-loc">
            {destination?.name ?? pkg.destinationSlug} · from {pkg.fromCity}
          </span>
        </div>
        <h3>{pkg.title}</h3>
        <ul className="package-includes">
          {pkg.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="tour-footer">
          <span className="tour-price price-pill">
            {pkg.price} <small>/ person</small>
          </span>
          <button className="btn btn-primary btn-book" type="button" onClick={handleSelect}>
            Select
          </button>
        </div>
      </div>
    </article>
  );
}
