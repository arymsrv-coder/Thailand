import PosterCard, { type PosterCardData } from './PosterCard';

/*
 * Private Tours and Group Tours use this site's own tour photos and real
 * data (rating-derived tag, cheapest matching price) — genuine subsets of
 * the tour catalogue: this catalogue's temple walks and island-hopping trips
 * genuinely are the "private" kind, and its scheduled day trips (Ayutthaya,
 * market runs) genuinely are the "group" kind. Cruises has no such match —
 * nothing in the catalogue is a river cruise or catamaran charter — so it
 * stays inert with a "Coming soon" tag.
 */
const EXPERIENCES: PosterCardData[] = [
  {
    title: 'Private Tours',
    location: 'Bangkok · Krabi',
    meta: '4.9 · From $65',
    image: '/Content/wat-pho-bangkok-700-7.jpg',
    tag: { label: 'Guest Favorite', tone: 'favorite' },
    href: '/#tours',
  },
  {
    title: 'Group Tours',
    location: 'Ayutthaya',
    meta: '4.7 · From $52',
    image: '/Content/ayutthaya-chao-sam-phraya-national-museum-700-2.jpg',
    tag: { label: 'Popular Pick', tone: 'popular' },
    href: '/#tours',
  },
  {
    title: 'Cruises',
    location: 'Chao Phraya & beyond',
    meta: 'River dinner cruises and catamaran charters',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=900&q=80',
    tag: { label: 'Coming soon', tone: 'soon' },
  },
];

export default function ExperienceCards() {
  return (
    <div className="category-section">
      <div className="container">
        <h3 className="category-heading">Tours &amp; Experiences</h3>
        <div className="category-grid">
          {EXPERIENCES.map((card) => (
            <PosterCard card={card} key={card.title} />
          ))}
        </div>
      </div>
    </div>
  );
}
