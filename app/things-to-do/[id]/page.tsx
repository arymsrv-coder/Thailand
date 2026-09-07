import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageChrome from '@/components/PageChrome';
import TourBooking from '@/components/TourBooking';
import { findDestination, findTour } from '@/lib/catalog';
import { tours } from '@/lib/tours';

type PageProps = {
  params: Promise<{ id: string }>;
};

/** All 8 tours are known at build time, so each detail page can be prerendered. */
export function generateStaticParams() {
  return tours.map((tour) => ({ id: tour.id }));
}

export default async function TourDetailPage({ params }: PageProps) {
  const { id } = await params;
  const tour = findTour(id);
  if (!tour) notFound();

  // Dates and party size come from the URL, read client-side by <TourBooking>.
  const destination = findDestination(tour.destinationSlug);
  const gallery = destination?.images.filter((src) => src !== tour.image) ?? [];
  const mapSrc = destination
    ? `https://www.google.com/maps?q=${destination.coords.replace(', ', ',')}&z=10&output=embed`
    : null;

  return (
    <PageChrome>
      <section className="tour-detail">
        <div className="container tour-detail-layout">
          <div className="tour-detail-main">
            <div className="tour-detail-hero">
              <Image
                src={tour.image}
                alt={tour.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 720px"
                priority
              />
            </div>

            <p className="tour-detail-meta">
              <span className="star">★</span> {tour.rating}
              <span> · {tour.location} · {tour.duration}</span>
            </p>
            <h1>{tour.title}</h1>
            <p className="tour-detail-description">{tour.description}</p>

            {gallery.length > 0 && (
              <div className="tour-gallery">
                {gallery.map((src) => (
                  <div className="tour-gallery-item" key={src}>
                    <Image src={src} alt={tour.title} fill sizes="(max-width: 640px) 50vw, 220px" />
                  </div>
                ))}
              </div>
            )}

            <h2>Itinerary</h2>
            <ol className="tour-itinerary">
              {tour.itinerary.map((step) => (
                <li key={step.time}>
                  <span className="tour-itinerary-time">{step.time}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            {mapSrc && (
              <div className="tour-detail-map">
                <iframe
                  title={`Map of ${tour.location}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <aside className="tour-detail-sidebar">
            <div className="tour-detail-card">
              <p className="tour-price price-pill">
                {tour.price} <small>/ person</small>
              </p>
              <TourBooking tour={tour} />
            </div>
          </aside>
        </div>
      </section>
    </PageChrome>
  );
}
