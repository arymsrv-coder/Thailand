import PosterCard, { type PosterCardData } from './PosterCard';

/*
 * The four Main Booking tiles, all the same size — the Hotels & Homes card
 * here is just a doorway into the real, detailed section below
 * (<HotelsSection>, at #hotels); Flights, Cars and Flight + Hotel have no
 * page behind them yet, so they stay inert with a "Coming soon" tag rather
 * than a live link that goes nowhere.
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
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80',
    tag: { label: 'Coming soon', tone: 'soon' },
  },
  {
    title: 'Cars',
    location: 'Nationwide',
    meta: 'Rentals, airport transfers, and chauffeur service',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&q=80',
    tag: { label: 'Coming soon', tone: 'soon' },
  },
  {
    title: 'Flight + Hotel',
    location: 'Bundles',
    meta: 'Your flight and stay, packaged into one price',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=900&q=80',
    tag: { label: 'Coming soon', tone: 'soon' },
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
