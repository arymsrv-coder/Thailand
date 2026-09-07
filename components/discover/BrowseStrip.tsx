import Image from 'next/image';
import Link from 'next/link';
import type { BrowseTile } from '@/lib/discover';

/**
 * The horizontally scrolling strip of rounded tiles, each a photo with its
 * label centred over it.
 *
 * The reference labels this "Deals designed for you" and its tiles are themed
 * offers. This site has no offer engine behind such tiles, so they filter the
 * results above by a real search parameter instead — the layout is the same,
 * and every tile leads somewhere that exists.
 */
export default function BrowseStrip({
  heading,
  tiles,
}: {
  heading: string;
  tiles: BrowseTile[];
}) {
  return (
    <section className="dsc-section">
      <h2 className="dsc-heading">{heading}</h2>

      <ul className="dsc-strip">
        {tiles.map((tile) => (
          <li key={tile.href + tile.label}>
            <Link href={tile.href} className="dsc-strip-tile">
              <Image
                src={tile.image}
                alt={tile.imageAlt}
                fill
                sizes="200px"
                style={{ objectFit: 'cover' }}
              />
              <span className="dsc-strip-label">{tile.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
