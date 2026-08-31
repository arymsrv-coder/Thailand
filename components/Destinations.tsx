import type { Destination, SearchQuery } from '@/lib/types';
import { isSearchActive } from '@/lib/catalog';
import ListingCard from './ListingCard';
import SearchSummary from './SearchSummary';
import Reveal from './motion/Reveal';
import SplitText from './motion/SplitText';

/*
 * The "Where to go" feed. The list is decided on the server from the URL, so
 * this component only has to render what it is handed.
 */
export default function Destinations({
  destinations,
  query,
  tourCount,
}: {
  destinations: Destination[];
  query: SearchQuery;
  tourCount: number;
}) {
  const searching = isSearchActive(query);

  // With one destination in view, centre the map on it rather than the country.
  const focus = destinations.length === 1 ? destinations[0] : null;
  const mapSrc = focus
    ? `https://www.google.com/maps?q=${focus.coords.replace(', ', ',')}&z=10&output=embed`
    : 'https://www.google.com/maps?q=Thailand&z=6&output=embed';

  return (
    <section className="destinations" id="destinations">
      <div className="container">
        <div className="section-head" id="results">
          <Reveal as="p" className="eyebrow" distance="sm">
            Where to go
          </Reveal>
          <h2>
            <SplitText
              lines={
                searching
                  ? ['Your search,', 'narrowed down.']
                  : ['Ten places worth', 'rearranging your year for.']
              }
            />
          </h2>
        </div>

        {searching && (
          <SearchSummary
            query={query}
            destinationCount={destinations.length}
            tourCount={tourCount}
          />
        )}

        <div className="destinations-layout">
          <div className="listing-list">
            {destinations.length > 0 ? (
              destinations.map((destination, index) => (
                <Reveal
                  key={destination.slug}
                  /* Cards arrive in sequence rather than as a block, but the
                     stagger is capped so the tenth card is not left waiting. */
                  delay={Math.min(index, 5) * 55}
                >
                  <ListingCard destination={destination} query={query} />
                </Reveal>
              ))
            ) : (
              <p className="empty-note">
                Nothing matches those dates and party size. Try a wider range, or
                clear the search to see everywhere we go.
              </p>
            )}
          </div>

          <div className="map-frame">
            <iframe
              // Remounts when the focus changes so the embed recentres.
              key={focus?.slug ?? 'thailand'}
              title={focus ? `Map of ${focus.name}` : 'Map of Thailand'}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
