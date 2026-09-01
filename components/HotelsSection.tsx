import PosterCard, { type PosterCardData } from './PosterCard';

/*
 * 12 real, named Thailand hotels, researched from public sources —
 * Wikipedia, since Booking.com, Agoda and TripAdvisor's own pages are
 * JS-rendered SPAs that returned nothing fetchable, and are bot-walled
 * besides. That got real names, real cities, and a genuine verified detail
 * for each (a press accolade, a professionally-audited Forbes Travel Guide
 * rating where one exists, a real notable fact) — it did NOT get a
 * trustworthy live user rating, a real review count, or a current nightly
 * rate for any of them, and inventing plausible-looking numbers next to a
 * real, identifiable hotel's name would be misrepresenting an actual
 * business rather than a shortcut. So the top-left tag carries each one's
 * real star classification instead of a fabricated score, and each card
 * links out to that hotel's own official site rather than a fake "book now"
 * — Amara Siam doesn't sell hotel stays, so nothing here pretends to.
 */
const HOTELS: PosterCardData[] = [
  {
    title: 'Mandarin Oriental',
    location: 'Bangkok',
    meta: 'Named World’s Best Hotel — The Telegraph, 2024',
    // A real Bangkok/Phuket/Koh Samui landmark, not a photo of the hotel
    // itself — this project has no rights to any of these properties' own
    // photography, and an unrelated stock "luxury resort" shot risked being
    // mistaken for the actual place.
    image: '/Content/bangkok-grand-palace-700-2.jpg',
    tag: { label: '5-Star', tone: 'luxury' },
    href: 'https://www.mandarinoriental.com/en/bangkok/chao-phraya-river',
    external: true,
  },
  {
    title: 'The Peninsula',
    location: 'Bangkok',
    meta: 'Riverside 5-star icon, open since 1998',
    image: '/Content/wat-pho-bangkok-700-7.jpg',
    tag: { label: '5-Star', tone: 'luxury' },
    href: 'https://www.peninsula.com/en/bangkok',
    external: true,
  },
  {
    title: 'Shangri-La Bangkok',
    location: 'Bangkok',
    meta: 'Hosted the 2015 ASEAN Summit',
    image: '/Content/chinatown-bangkok-yaowarat-700-1.jpg',
    tag: { label: '5-Star', tone: 'luxury' },
    href: 'https://www.shangri-la.com/bangkok/shangrila',
    external: true,
  },
  {
    title: 'The Sukhothai',
    location: 'Bangkok',
    meta: 'Forbes Travel Guide 4-Star rated, 2016–2018',
    image: '/Content/bangkok-wat-traimit-700-2.jpg',
    tag: { label: '4-Star', tone: 'luxury' },
    href: 'https://www.sukhothai.com',
    external: true,
  },
  {
    title: 'Lebua at State Tower',
    location: 'Bangkok',
    // No external link here: its verified domain (lebua.com/state-tower,
    // confirmed via Wikipedia's own infobox) refused every connection
    // attempt from this machine — rather than ship a link that might be
    // dead right now, this one stays informational only.
    meta: '#3 Favorite Hotel in Bangkok — Travel + Leisure, 2025',
    image: '/Content/bangkok-night-market-700-1.jpg',
    tag: { label: '5-Star', tone: 'luxury' },
  },
  {
    title: 'Conrad Bangkok',
    location: 'Bangkok',
    meta: 'Distinctive octagonal tower on Wireless Road',
    image: '/Content/wat-arun-thai-eiffel-tower-700-1.jpg',
    tag: { label: '5-Star', tone: 'luxury' },
    href: 'https://www.hilton.com/en/hotels/bkkcici-conrad-bangkok/',
    external: true,
  },
  {
    title: 'Amanpuri',
    location: 'Phuket',
    meta: 'Aman’s flagship resort, open since 1988',
    image: '/Content/phuket-old-town-700-1.jpg',
    tag: { label: '5-Star', tone: 'luxury' },
    href: 'https://www.aman.com/resorts/amanpuri',
    external: true,
  },
  {
    title: 'Sri Panwa',
    location: 'Phuket',
    meta: 'Featured in CNN Travel’s best pool villas in Phuket',
    image: '/Content/phuket-old-town-700-2.jpg',
    tag: { label: '5-Star', tone: 'luxury' },
    href: 'https://www.sripanwa.com',
    external: true,
  },
  {
    title: 'Cape Panwa Hotel',
    location: 'Phuket',
    meta: 'One of Phuket’s first luxury resorts, open since 1987',
    image: '/Content/phuket-phang-nga-bay-tour-700-2.jpg',
    tag: { label: 'Luxury', tone: 'luxury' },
    href: 'https://www.capepanwa.com',
    external: true,
  },
  {
    title: 'Anantara Bophut',
    location: 'Koh Samui',
    meta: 'A filming location for The White Lotus, Season 3',
    image: '/Content/bophut-fisherman-village.jpg',
    tag: { label: '5-Star', tone: 'luxury' },
    href: 'https://www.anantara.com/en/bophut-koh-samui',
    external: true,
  },
  {
    title: 'Belmond Napasai',
    location: 'Koh Samui',
    meta: '67 villas across 43 acres of tropical grounds',
    image: '/Content/thailand-koh-samui-700-2.jpg',
    tag: { label: '5-Star', tone: 'luxury' },
    href: 'https://www.belmond.com/hotels/asia/thailand/koh-samui/belmond-napasai',
    external: true,
  },
  {
    title: 'Nikki Beach Koh Samui',
    location: 'Koh Samui',
    meta: 'Part of the global Nikki Beach resort brand',
    image: '/Content/thailand-koh-samui-700-4.jpg',
    tag: { label: 'Resort', tone: 'luxury' },
    href: 'https://nikkibeach.com/koh-samui/',
    external: true,
  },
];

export default function HotelsSection() {
  return (
    <div className="category-section hotels-section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Stays in Thailand</p>
          <h2 className="category-heading" id="hotels">
            Hotels &amp; Homes
          </h2>
        </div>

        <div className="category-grid">
          {HOTELS.map((card) => (
            <PosterCard card={card} key={card.title} />
          ))}
        </div>
      </div>
    </div>
  );
}
