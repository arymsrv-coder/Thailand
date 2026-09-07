import Image from 'next/image';
import Link from 'next/link';
import type { Band } from '@/lib/discover';
import { CompassIcon } from '../icons';

/**
 * The wide banded row: a marker, a title and standfirst, then three image
 * tiles with their captions over the lower-left corner.
 *
 * The reference uses this slot for a cruise-line ad, badged "Ad" and pointing
 * off-site. This one is editorial and every tile stays on this site, so it
 * carries a plain region marker instead of an advertiser's logo.
 */
export default function DiscoverBand({ band }: { band: Band }) {
  return (
    <section className="dsc-section dsc-band">
      <div className="dsc-band-head">
        <span className="dsc-band-mark" aria-hidden="true">
          <CompassIcon width={20} height={20} />
        </span>
        <div>
          <p className="dsc-band-kicker">{band.kicker}</p>
          <h2 className="dsc-band-title">{band.title}</h2>
          <p className="dsc-band-text">{band.description}</p>
        </div>
      </div>

      <div className="dsc-band-tiles">
        {band.tiles.map((tile) => (
          <Link key={tile.href + tile.caption} href={tile.href} className="dsc-band-tile">
            <Image
              src={tile.image}
              alt={tile.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
            <span className="dsc-band-caption">{tile.caption}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
