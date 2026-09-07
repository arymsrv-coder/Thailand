import { cars } from '@/lib/cars';
import { flights } from '@/lib/flights';
import { packages } from '@/lib/packages';
import PosterCard, { type PosterCardData } from './PosterCard';

/*
 * The four Main Booking tiles, all the same size. Each one is a doorway into
 * the section that serves it: Hotels & Homes into <HotelsSection> further down
 * this page, the other three into their own routes.
 *
 * Counts come from the catalogues rather than being written in, so a tile can
 * never advertise a number the page behind it does not have.
 */
const MAIN_BOOKING: PosterCardData[] = [
  {
    title: 'Hotels & Homes',
    location: 'Bangkok · Phuket · Koh Samui',
    meta: '12 real stays to browse',
    image: '/Content/10-Best-Attractions-Thailand-Grand-Palace.jpg',
    tag: { label: '12 Stays', tone: 'luxury' },
    href: '/#hotels',
  },
  {
    title: 'Flights',
    location: 'BKK · DMK · HKT · CNX',
    meta: 'Direct and connecting fares, compared in one search',
    image: '/Content/phuket-phang-nga-bay-tour-700-2.jpg',
    tag: { label: `${flights.length} Routes`, tone: 'popular' },
    href: '/flights',
  },
  {
    title: 'Cars',
    location: 'Nationwide',
    meta: 'Rentals, airport transfers, and chauffeur service',
    image: '/Content/cars/toyota-fortuner.jpg',
    tag: { label: `${cars.length} Cars`, tone: 'popular' },
    href: '/cars',
  },
  {
    title: 'Flight + Hotel',
    location: 'Bundles',
    meta: 'Your flight and stay, packaged into one price',
    image: '/Content/thailand-koh-samui-700-4.jpg',
    tag: { label: `${packages.length} Bundles`, tone: 'luxury' },
    href: '/packages',
  },
];

export default function MainBookingCards() {
  return (
    <div className="category-section">
      <div className="container">
        <h3 className="category-heading">Main Booking</h3>
        <div className="category-grid category-grid-feature">
          {MAIN_BOOKING.map((card) => (
            <PosterCard card={card} key={card.title} />
          ))}
        </div>
      </div>
    </div>
  );
}
