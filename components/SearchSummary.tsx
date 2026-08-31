import Link from 'next/link';
import type { SearchQuery } from '@/lib/types';
import { findDestination } from '@/lib/catalog';
import { CloseIcon } from './icons';

/*
 * The banner shown above the feed once a search is on. It states what was
 * asked for and how much matched, and offers the way back out — without it a
 * visitor who filters down to nothing has no obvious escape.
 */

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

export function describeQuery(query: SearchQuery): string[] {
  const parts: string[] = [];

  if (query.where) {
    parts.push(findDestination(query.where)?.name ?? query.where);
  }
  if (query.from) {
    parts.push(query.to ? `${formatDate(query.from)} – ${formatDate(query.to)}` : formatDate(query.from));
  }
  if (query.guests) {
    parts.push(`${query.guests} ${query.guests === 1 ? 'guest' : 'guests'}`);
  }

  return parts;
}

export default function SearchSummary({
  query,
  destinationCount,
  tourCount,
}: {
  query: SearchQuery;
  destinationCount: number;
  tourCount: number;
}) {
  const parts = describeQuery(query);

  return (
    <div className="search-summary" role="status">
      <div className="search-summary-text">
        <p className="search-summary-count">
          {tourCount === 0
            ? 'No tours match this search'
            : `${tourCount} ${tourCount === 1 ? 'tour' : 'tours'} · ${destinationCount} ${
                destinationCount === 1 ? 'destination' : 'destinations'
              }`}
        </p>
        {parts.length > 0 && (
          <ul className="search-chips">
            {parts.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ul>
        )}
      </div>
      <Link className="btn btn-ghost search-clear" href="/#results" scroll={false}>
        <CloseIcon />
        Clear search
      </Link>
    </div>
  );
}
