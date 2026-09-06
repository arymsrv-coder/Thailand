import CruisesResults from '@/components/CruisesResults';
import PageChrome from '@/components/PageChrome';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import { searchCruises } from '@/lib/catalog';
import { first } from '@/lib/validation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CruisesPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const results = searchCruises(query);

  const destination = first(query.destination);
  const depart = first(query.depart);
  const travelers = first(query.travelers);

  const chips = [
    destination ? destination : '',
    depart ? depart : '',
    travelers ? `${travelers} ${travelers === '1' ? 'traveler' : 'travelers'}` : '',
  ].filter(Boolean);

  const searching = chips.length > 0;

  return (
    <PageChrome>
      <section className="results-page">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Cruises</p>
            <h1>Island-hopping routes through Thai waters.</h1>
          </div>

          {searching && (
            <ResultsSearchSummary
              chips={chips}
              count={results.length}
              noun="cruise"
              clearHref="/cruises"
            />
          )}

          <CruisesResults
            cruises={results}
            defaultDate={depart || undefined}
            defaultTravelers={travelers ? Number(travelers) : undefined}
          />
        </div>
      </section>
    </PageChrome>
  );
}
