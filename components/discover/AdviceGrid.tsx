import Image from 'next/image';
import Link from 'next/link';
import type { AdviceCard } from '@/lib/discover';

/**
 * "Travel advice and inspiration": three cards, each an image with its title
 * laid over the lower edge and the standfirst below the image.
 */
export default function AdviceGrid({ cards }: { cards: AdviceCard[] }) {
  return (
    <section className="dsc-section">
      <h2 className="dsc-heading">Travel advice and inspiration</h2>

      <div className="dsc-advice">
        {cards.map((card) => (
          <Link key={card.href + card.title} href={card.href} className="dsc-advice-card">
            <span className="dsc-advice-media">
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
              <span className="dsc-advice-title">{card.title}</span>
            </span>
            <span className="dsc-advice-text">{card.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
