import Link from 'next/link';
import { TagIcon } from './icons';

/*
 * The banner mid-list, in the same spot a real search-results page uses for
 * a cross-sell. Bundling a flight with a stay is something this site
 * genuinely offers (see /packages), so the link goes somewhere real — no
 * fabricated discount amount.
 */
export default function FlightsPromoBanner() {
  return (
    <div className="cars-promo">
      <span className="cars-promo-icon">
        <TagIcon width={20} height={20} />
      </span>
      <div>
        <p className="cars-promo-title">Bundle your flight with a stay</p>
        <p className="cars-promo-subtitle">
          Flight + hotel packages are booked as one reservation, with the hotel already picked for
          you.
        </p>
        <Link href="/packages" className="btn btn-ghost cars-promo-cta">
          See packages
        </Link>
      </div>
    </div>
  );
}
