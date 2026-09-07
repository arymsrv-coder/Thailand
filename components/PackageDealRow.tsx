'use client';

import Image from 'next/image';
import { findDestination, packageDiscountPercent } from '@/lib/catalog';
import type { PackageDeal } from '@/lib/types';
import { InfoIcon } from './icons';
import type { InquiryItem } from './InquiryModal';
import StarRating from './StarRating';

export default function PackageDealRow({
  pkg,
  onSelect,
}: {
  pkg: PackageDeal;
  onSelect: (item: InquiryItem) => void;
}) {
  const destination = findDestination(pkg.destinationSlug);
  const images = destination?.images ?? [];
  const image = images[pkg.imageIndex % Math.max(images.length, 1)];
  const discount = packageDiscountPercent(pkg);

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
    <article className="deal-row">
      <button type="button" className="deal-row-hit" onClick={handleSelect}>
        <span className="sr-only">Request {pkg.title}</span>
      </button>

      <div className="deal-row-media">
        {image && (
          <Image
            src={image}
            alt={destination?.name ?? pkg.title}
            fill
            sizes="(max-width: 720px) 100vw, 385px"
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>

      <div className="deal-row-body">
        <h3>{pkg.title}</h3>
        <StarRating rating={pkg.starRating} />
        <div className="deal-row-flight">
          <p>Roundtrip {pkg.nonstop ? 'non-stop ' : ''}flight included</p>
          <p>
            {pkg.fromCity} ({pkg.fromCode}) to {destination?.name ?? pkg.destinationSlug} (
            {pkg.toCode})
          </p>
        </div>
      </div>

      <div className="deal-row-price">
        {pkg.saveBadge && <span className="deal-row-save">{pkg.saveBadge}</span>}
        <p className="deal-row-amount">
          {pkg.wasPrice && (
            <span className="deal-row-was">
              <InfoIcon width={13} height={13} />
              <s>{pkg.wasPrice}</s>
            </span>
          )}
          <strong>{pkg.price}</strong>
        </p>
        <p className="deal-row-unit">per person</p>
        <p className="deal-row-dates">{pkg.dateRange}</p>
        {discount !== null && <p className="deal-row-off">{discount}% off</p>}
      </div>
    </article>
  );
}
