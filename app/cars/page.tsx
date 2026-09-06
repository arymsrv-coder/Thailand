import CarSearchBar from '@/components/CarSearchBar';
import CarsFilters from '@/components/CarsFilters';
import CarsMapThumb from '@/components/CarsMapThumb';
import CarsResults from '@/components/CarsResults';
import CarsSortSelect from '@/components/CarsSortSelect';
import PageChrome from '@/components/PageChrome';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import { carCategorySummary, searchCars } from '@/lib/catalog';
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
  const sort = first(query.sort) || 'recommended';
  const selectedTypes = Array.isArray(query.carType)
    ? query.carType
    : query.carType
      ? [query.carType]
      : [];

  const chips = [
    pickupLocation ? `Pick-up: ${pickupLocation}` : '',
    dropoffLocation ? `Drop-off: ${dropoffLocation}` : '',
    pickupDate ? (dropoffDate ? `${pickupDate} – ${dropoffDate}` : pickupDate) : '',
    ...selectedTypes,
  ].filter(Boolean);

  const searching = chips.length > 0;

  return (
    <PageChrome>
      <section className="results-page cars-page">
        <div className="container">
          <CarSearchBar
            defaultPickupLocation={pickupLocation}
            defaultDropoffLocation={dropoffLocation}
            defaultPickupDate={pickupDate}
            defaultDropoffDate={dropoffDate}
          />

          <div className="cars-layout">
            <aside className="cars-sidebar">
              <CarsMapThumb />
              <CarsFilters categories={carCategorySummary()} selected={selectedTypes} query={query} />
            </aside>

            <div className="cars-main">
              <div className="cars-toolbar">
                <p>
                  {results.length} {results.length === 1 ? 'car' : 'cars'} · Prices shown per day
                </p>
                <CarsSortSelect value={sort} query={query} />
              </div>

              {searching && (
                <ResultsSearchSummary
                  chips={chips}
                  count={results.length}
                  noun="car"
                  clearHref="/cars"
                />
              )}

              <CarsResults cars={results} defaultDate={pickupDate || undefined} />
            </div>
          </div>
        </div>
      </section>
    </PageChrome>
  );
}
