import Image from 'next/image';
import Link from 'next/link';
import type { FeatureCard, PromoCard } from '@/lib/discover';

/**
 * "Featured travel": a three-column grid where one large card spans two
 * columns and a stack of two compact promo cards fills the third.
 *
 * The reference runs paid placements here. Nothing on this site is sponsored,
 * so these are ordinary editorial cards linking to pages we serve — no "Ad"
 * chip, no third-party frames, no tracking pixels.
 */
export default function FeaturedTravel({
  feature,
  promos,
}: {
  feature: FeatureCard;
  promos: PromoCard[];
}) {
  return (
    <section className="dsc-section">
      <h2 className="dsc-heading">Featured travel</h2>

      <div className="dsc-featured">
        <Link href={feature.href} className="dsc-feature">
          <span className="dsc-feature-media">
            <Image
              src={feature.image}
              alt={feature.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 66vw"
              style={{ objectFit: 'cover' }}
            />
          </span>
          <span className="dsc-feature-body">
            <span className="dsc-feature-kicker">{feature.kicker}</span>
            <span className="dsc-feature-title">{feature.title}</span>
            <span className="dsc-feature-text">{feature.description}</span>
          </span>
        </Link>

        <div className="dsc-promos">
          {promos.map((promo) => (
            <Link key={promo.href + promo.title} href={promo.href} className="dsc-promo">
              <span className="dsc-promo-media">
                <Image
                  src={promo.image}
                  alt={promo.imageAlt}
                  fill
                  sizes="(max-width: 900px) 30vw, 100px"
                  style={{ objectFit: 'cover' }}
                />
              </span>
              <span className="dsc-promo-body">
                <span className="dsc-promo-title">{promo.title}</span>
                <span className="dsc-promo-text">{promo.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
