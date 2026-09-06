import FlightsDateStrip from '@/components/FlightsDateStrip';
import FlightsFilters from '@/components/FlightsFilters';
import FlightsResults from '@/components/FlightsResults';
import FlightsSearchBar from '@/components/FlightsSearchBar';
import FlightsSortSelect from '@/components/FlightsSortSelect';
import PageChrome from '@/components/PageChrome';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import {
  flightAirlineSummary,
  flightDateStrip,
  flightStopsSummary,
  searchFlights,
} from '@/lib/catalog';
import { first, today } from '@/lib/validation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FlightsPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const results = searchFlights(query);

  const from = first(query.from);
  const to = first(query.to);
  const depart = first(query.depart);
  // The date strip needs a center date even with no search yet — that
  // fallback shouldn't itself count as "a search is active", so it's kept
  // separate from `depart`, which chips/summary key off of.
  const centerDate = depart || today();
  const returnDate = first(query.return);
  const travelers = first(query.travelers);
  const cabin = first(query.cabin);
  const tripType = first(query.tripType);
  const sort = first(query.sort) || 'recommended';
  const selectedStops = Array.isArray(query.stops) ? query.stops : query.stops ? [query.stops] : [];
  const selectedAirlines = Array.isArray(query.airline)
    ? query.airline
    : query.airline
      ? [query.airline]
      : [];

  const chips = [
    from && to ? `${from} → ${to}` : from ? `From ${from}` : to ? `To ${to}` : '',
    depart ? (returnDate ? `${depart} – ${returnDate}` : depart) : '',
    tripType === 'oneway' ? 'One-way' : '',
    travelers ? `${travelers} ${travelers === '1' ? 'traveler' : 'travelers'}` : '',
    ...selectedStops.map((s) => (s === '0' ? 'Nonstop' : s === '1' ? '1 stop' : '2+ stops')),
    ...selectedAirlines,
  ].filter(Boolean);

  const searching = chips.length > 0;
  const dateStripDays = flightDateStrip(query, centerDate);
  const promoAfterIndex = results.length > 2 ? 2 : undefined;

  return (
    <PageChrome>
      <section className="results-page">
        <div className="container">
          <FlightsSearchBar
            defaultFrom={from}
            defaultTo={to}
            defaultDepart={centerDate}
            defaultReturn={returnDate}
            defaultTripType={tripType}
            defaultTravelers={travelers}
            defaultCabin={cabin}
          />

          <div className="cars-layout">
            <aside className="cars-sidebar">
              <FlightsFilters
                stopsOptions={flightStopsSummary()}
                selectedStops={selectedStops}
                airlineOptions={flightAirlineSummary()}
                selectedAirlines={selectedAirlines}
                query={query}
              />
            </aside>

            <div className="cars-main">
              <FlightsDateStrip days={dateStripDays} selectedDate={centerDate} query={query} />

              <div className="cars-toolbar">
                <p>
                  {results.length} {results.length === 1 ? 'flight' : 'flights'} · Fares shown per
                  traveler
                </p>
                <FlightsSortSelect value={sort} query={query} />
              </div>

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
                defaultDate={centerDate}
                defaultTravelers={travelers ? Number(travelers) : undefined}
                promoAfterIndex={promoAfterIndex}
              />
            </div>
          </div>
        </div>
      </section>
    </PageChrome>
  );
}
