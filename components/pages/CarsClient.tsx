'use client';

import { useRawQuery } from '@/lib/useRawQuery';
import BackButton from '@/components/BackButton';
import CarSearchBar from '@/components/CarSearchBar';
import CarsPromoBanner from '@/components/CarsPromoBanner';
import CarsResults from '@/components/CarsResults';
import CarsSortSelect from '@/components/CarsSortSelect';
import PageChrome from '@/components/PageChrome';
import ResultsFilters from '@/components/ResultsFilters';
import ResultsMapThumb from '@/components/ResultsMapThumb';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import { CAR_FILTER_PARAMS, carFilterGroups, searchCars } from '@/lib/catalog';
import { cars } from '@/lib/cars';
import { first } from '@/lib/validation';

const photoCredits = Array.from(new Set(cars.map((car) => car.photoCredit))).sort();

function values(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

export default function CarsClient() {
  const query = useRawQuery();
  const results = searchCars(query);
  const groups = carFilterGroups();

  const pickupLocation = first(query.pickupLocation);
  const dropoffLocation = first(query.dropoffLocation);
  const pickupDate = first(query.pickupDate);
  const dropoffDate = first(query.dropoffDate);
  const pickupTime = first(query.pickupTime);
  const dropoffTime = first(query.dropoffTime);
  const sort = first(query.sort) || 'recommended';

  const selectedByParam = Object.fromEntries(
    CAR_FILTER_PARAMS.map((param) => [param, values(query[param])])
  );

  // The chips read back what was searched for, so a filtered list never looks
  // like the whole catalogue. Sidebar selections show by label, not raw key.
  const filterChips = groups.flatMap((group) =>
    group.options
      .filter((option) => (selectedByParam[group.param] ?? []).includes(option.key))
      .map((option) => option.label)
  );

  const chips = [
    pickupLocation ? `Pick-up: ${pickupLocation}` : '',
    dropoffLocation ? `Drop-off: ${dropoffLocation}` : '',
    pickupDate ? (dropoffDate ? `${pickupDate} – ${dropoffDate}` : pickupDate) : '',
    ...filterChips,
  ].filter(Boolean);

  const searching = chips.length > 0;

  return (
    <PageChrome>
      <section className="results-page cars-page">
        <div className="container">
          <BackButton />

          <CarSearchBar
            defaultPickupLocation={pickupLocation}
            defaultDropoffLocation={dropoffLocation}
            defaultPickupDate={pickupDate}
            defaultDropoffDate={dropoffDate}
            defaultPickupTime={pickupTime}
            defaultDropoffTime={dropoffTime}
          />

          <div className="cars-layout">
            <aside className="cars-sidebar">
              <ResultsMapThumb />
              <ResultsFilters
                basePath="/cars"
                groups={groups}
                selectedByParam={selectedByParam}
                query={query}
              />
            </aside>

            <div className="cars-main">
              <div className="cars-toolbar">
                <p>
                  {results.length} {results.length === 1 ? 'Car' : 'Cars'} • Total includes taxes
                  and fees
                </p>
                <CarsSortSelect value={sort} query={query} />
              </div>

              <CarsPromoBanner />

              {searching && (
                <ResultsSearchSummary
                  chips={chips}
                  count={results.length}
                  noun="car"
                  clearHref="/cars"
                />
              )}

              <CarsResults cars={results} defaultDate={pickupDate || undefined} />

              <p className="results-disclaimer">
                The makes/models shown are examples only. We are unable to guarantee a specific
                make/model. Actual makes/models are subject to availability and vary by rental car
                company.
              </p>

              <p className="cars-photo-credits">
                Car photos: {photoCredits.join(' · ')} — images cropped and resized from the
                originals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageChrome>
  );
}
