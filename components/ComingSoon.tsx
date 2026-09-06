import Link from 'next/link';
import type { ComponentType } from 'react';

/** "pickupLocation" -> "Pickup location" */
function humanize(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * The landing page for a vertical (Flights, Cars, Packages, Cruises) that has
 * no real inventory or booking flow behind it yet. Echoes back whatever was
 * searched so the tab feels connected to something, without promising a
 * result set this site can't actually produce.
 */
export default function ComingSoon({
  icon: Icon,
  title,
  description,
  query,
}: {
  icon: ComponentType<{ width?: number; height?: number }>;
  title: string;
  description: string;
  query: SearchParams;
}) {
  const chips = Object.entries(query)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].trim() !== '')
    .map(([key, value]) => ({ key, label: `${humanize(key)}: ${value}` }));

  return (
    <section className="coming-soon">
      <div className="container coming-soon-inner">
        <div className="coming-soon-icon">
          <Icon width={32} height={32} />
        </div>
        <h1>{title}</h1>
        <p>{description}</p>

        {chips.length > 0 && (
          <div className="search-summary coming-soon-summary">
            <div>
              <p className="search-summary-count">Your search</p>
              <ul className="search-chips">
                {chips.map((chip) => (
                  <li key={chip.key}>{chip.label}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Link href="/" className="btn btn-primary">
          Back to Amara Siam
        </Link>
      </div>
    </section>
  );
}
