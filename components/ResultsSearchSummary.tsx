import Link from 'next/link';
import { CloseIcon } from './icons';

/**
 * The "N results · chips · clear" banner for Flights/Cars/Packages/Cruises —
 * the same shape as SearchSummary, generalised over plain display chips since
 * each vertical's query fields have nothing in common with SearchQuery.
 */
export default function ResultsSearchSummary({
  chips,
  count,
  noun,
  clearHref,
}: {
  chips: string[];
  count: number;
  noun: string;
  clearHref: string;
}) {
  return (
    <div className="search-summary" role="status">
      <div className="search-summary-text">
        <p className="search-summary-count">
          {count === 0 ? `No ${noun}s match this search` : `${count} ${count === 1 ? noun : `${noun}s`}`}
        </p>
        {chips.length > 0 && (
          <ul className="search-chips">
            {chips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        )}
      </div>
      <Link className="btn btn-ghost search-clear" href={clearHref} scroll={false}>
        <CloseIcon />
        Clear search
      </Link>
    </div>
  );
}
