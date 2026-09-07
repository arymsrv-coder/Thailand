import Link from 'next/link';
import type { Tour } from '@/lib/types';
import TourTeaserCard from './TourTeaserCard';
import Reveal from './motion/Reveal';
import SplitText from './motion/SplitText';

/**
 * The homepage's tour preview — a handful of featured tours and a link to the
 * real search/results page at /things-to-do, which does the actual filtering
 * and booking. Never search-filtered itself, so it always shows the same set
 * regardless of what's in the URL.
 */
export default function ToursTeaser({ tours, totalCount }: { tours: Tour[]; totalCount: number }) {
  return (
    <section className="tours">
      <div className="container">
        <div className="section-head">
          <Reveal as="p" className="eyebrow" distance="sm">
            Book a tour
          </Reveal>
          <h2>
            <SplitText lines={['Small groups, honest prices,', 'no fine print.']} />
          </h2>
        </div>

        <div className="tour-grid">
          {tours.map((tour, index) => (
            <Reveal key={tour.id} delay={Math.min(index, 5) * 55}>
              <TourTeaserCard tour={tour} />
            </Reveal>
          ))}
        </div>

        <div className="tours-teaser-cta">
          <Link href="/things-to-do" className="btn btn-primary">
            See all {totalCount} tours
          </Link>
        </div>
      </div>
    </section>
  );
}
