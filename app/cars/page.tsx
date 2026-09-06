import CarsResults from '@/components/CarsResults';
import PageChrome from '@/components/PageChrome';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import { searchCars } from '@/lib/catalog';
import { first } from '@/lib/validation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CarsPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const results = searchCars(query);

  const pickupLocation = first(query.pickupLocation);
  const dropoffLocation = first(query.dropoffLocation);
  const pickupDate = first(query.pickupDate);
  const dropoffDate = first(query.dropoffDate);

  const chips = [
    pickupLocation ? `Pick-up: ${pickupLocation}` : '',
    dropoffLocation ? `Drop-off: ${dropoffLocation}` : '',
    pickupDate ? (dropoffDate ? `${pickupDate} – ${dropoffDate}` : pickupDate) : '',
  ].filter(Boolean);

  const searching = chips.length > 0;

  return (
    <PageChrome>
      <section className="results-page">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Cars</p>
            <h1>Rental cars at the airports and cities we cover.</h1>
          </div>

          {searching && (
            <ResultsSearchSummary chips={chips} count={results.length} noun="car" clearHref="/cars" />
          )}

          <CarsResults cars={results} defaultDate={pickupDate || undefined} />
        </div>
      </section>
    </PageChrome>
  );
}
