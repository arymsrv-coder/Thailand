import { TagIcon } from './icons';

/*
 * The banner above the results list, in the same spot a real search-results
 * page uses for a sale callout. This one makes no claim this site can't back
 * up — no countdown, no fake discount code — just the one thing that's
 * actually true of every listing below: free cancellation, pay at pick-up.
 */
export default function CarsPromoBanner() {
  return (
    <div className="cars-promo">
      <span className="cars-promo-icon">
        <TagIcon width={20} height={20} />
      </span>
      <div>
        <p className="cars-promo-title">Every car, free cancellation</p>
        <p className="cars-promo-subtitle">
          Change your plans? Cancel any reservation at no charge, right up until pick-up — no
          cancellation fee, no fine print.
        </p>
      </div>
    </div>
  );
}
