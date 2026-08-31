'use client';

import { useCallback, useState } from 'react';
import type { SearchQuery, Tour } from '@/lib/types';
import BookingModal from './BookingModal';
import TourCard from './TourCard';
import Reveal from './motion/Reveal';
import SplitText from './motion/SplitText';

export default function Tours({
  tours,
  query,
  totalCount,
}: {
  tours: Tour[];
  query: SearchQuery;
  totalCount: number;
}) {
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const closeModal = useCallback(() => setActiveTour(null), []);

  const isFiltered = tours.length !== totalCount;

  return (
    <>
      <section className="tours" id="tours">
        <div className="container">
          <div className="section-head">
            <Reveal as="p" className="eyebrow" distance="sm">
              Book a tour
            </Reveal>
            <h2>
              <SplitText lines={['Small groups, honest prices,', 'no fine print.']} />
            </h2>
            {isFiltered && (
              <p className="section-note" role="status">
                Showing {tours.length} of {totalCount} tours for your search.
              </p>
            )}
          </div>

          {tours.length > 0 ? (
            <div className="tour-grid">
              {tours.map((tour, index) => (
                <Reveal key={tour.id} delay={Math.min(index, 5) * 55}>
                  <TourCard tour={tour} onBook={setActiveTour} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="empty-note">
              No tours run with that party size on those dates — some island
              trips pause for the monsoon between May and October. Widen the
              dates or clear the search to see all {totalCount}.
            </p>
          )}
        </div>
      </section>

      {/* Dates and party size already chosen carry into the booking form. */}
      <BookingModal tour={activeTour} query={query} onClose={closeModal} />
    </>
  );
}
