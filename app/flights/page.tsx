import BackButton from '@/components/BackButton';
import FlightsPromoBanner from '@/components/FlightsPromoBanner';
import FlightsResults from '@/components/FlightsResults';
import FlightsSearchBar from '@/components/FlightsSearchBar';
import FlightsSortSelect from '@/components/FlightsSortSelect';
import PageChrome from '@/components/PageChrome';
import ResultsFilters from '@/components/ResultsFilters';
import ResultsMapThumb from '@/components/ResultsMapThumb';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import { FLIGHT_FILTER_PARAMS, flightFilterGroups, searchFlights } from '@/lib/catalog';
import { first } from '@/lib/validation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function values(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

export default async function FlightsPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const results = searchFlights(query);
  const groups = flightFilterGroups();

  const from = first(query.from);
  const to = first(query.to);
  const depart = first(query.depart);
  const returnDate = first(query.return);
  const travelers = first(query.travelers);
  const cabin = first(query.cabinClass);
  const sort = first(query.sort) || 'recommended';

  const selectedByParam = Object.fromEntries(
    FLIGHT_FILTER_PARAMS.map((param) => [param, values(query[param])])
  );

  // The chips read back what was searched for, so a filtered list never looks
  // like the whole catalogue. Sidebar selections show by label, not raw key.
  const filterChips = groups.flatMap((group) =>
    group.options
      .filter((option) => (selectedByParam[group.param] ?? []).includes(option.key))
      .map((option) => option.label)
  );

  const chips = [
    from && to ? `${from} → ${to}` : from ? `From ${from}` : to ? `To ${to}` : '',
    depart ? (returnDate ? `${depart} – ${returnDate}` : `${depart} · one-way`) : '',
    travelers ? `${travelers} ${travelers === '1' ? 'traveler' : 'travelers'}` : '',
    cabin,
    ...filterChips,
  ].filter(Boolean);

  const searching = chips.length > 0;

  return (
    <PageChrome>
      <section className="results-page">
        <div className="container">
          <BackButton />

          <FlightsSearchBar
            defaultFrom={from}
            defaultTo={to}
            defaultDepart={depart}
            defaultReturn={returnDate}
            defaultTravelers={travelers}
            defaultCabin={cabin}
          />

          <div className="cars-layout">
            <aside className="cars-sidebar">
              <ResultsMapThumb />
              <ResultsFilters
                basePath="/flights"
                groups={groups}
                selectedByParam={selectedByParam}
                query={query}
              />
            </aside>

            <div className="cars-main">
              <div className="cars-toolbar">
                <p>
                  {results.length} {results.length === 1 ? 'Flight' : 'Flights'} • Total includes
                  taxes and fees
                </p>
                <FlightsSortSelect value={sort} query={query} />
              </div>

              <FlightsPromoBanner />

              {searching && (
                <ResultsSearchSummary
                  chips={chips}
                  count={results.length}
                  noun="flight"
                  clearHref="/flights"
                />
              )}

              <FlightsResults
                flights={results}
                defaultDate={depart || undefined}
                defaultTravelers={travelers ? Number(travelers) : undefined}
              />

              <p className="results-disclaimer">
                The aircraft shown are examples only. We are unable to guarantee a specific
                aircraft. Actual aircraft are subject to availability and vary by airline.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageChrome>
  );
}
