import FlightsResults from '@/components/FlightsResults';
import PageChrome from '@/components/PageChrome';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import { searchFlights } from '@/lib/catalog';
import { first } from '@/lib/validation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FlightsPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const results = searchFlights(query);

  const from = first(query.from);
  const to = first(query.to);
  const depart = first(query.depart);
  const returnDate = first(query.return);
  const travelers = first(query.travelers);
  const tripType = first(query.tripType);

  const chips = [
    from && to ? `${from} → ${to}` : from ? `From ${from}` : to ? `To ${to}` : '',
    depart ? (returnDate ? `${depart} – ${returnDate}` : depart) : '',
    tripType === 'oneway' ? 'One-way' : '',
    travelers ? `${travelers} ${travelers === '1' ? 'traveler' : 'travelers'}` : '',
  ].filter(Boolean);

  const searching = chips.length > 0;

  return (
    <PageChrome>
      <section className="results-page">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Flights</p>
            <h1>Fares between the places we cover.</h1>
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
            defaultDate={depart || undefined}
            defaultTravelers={travelers ? Number(travelers) : undefined}
          />
        </div>
      </section>
    </PageChrome>
  );
}
