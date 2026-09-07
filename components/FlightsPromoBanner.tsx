import Link from 'next/link';
import { TagIcon } from './icons';

/*
 * The banner above the results list, in the spot the reference layout uses for
 * a sale callout. Bundling a flight with a stay is something this site
 * genuinely offers (see /packages), so the link goes somewhere real — no
 * fabricated discount, no countdown.
 */
export default function FlightsPromoBanner() {
  return (
    <div className="cars-promo">
      <span className="cars-promo-icon">
        <TagIcon width={20} height={20} />
      </span>
      <div>
        <p className="cars-promo-title">Flight + hotel: booked as one reservation</p>
        <p className="cars-promo-subtitle">
          Bundle any of these fares with a stay and the hotel is already picked for you.
        </p>
        <Link href="/packages" className="cars-promo-link">
          See packages
        </Link>
      </div>
    </div>
  );
}
