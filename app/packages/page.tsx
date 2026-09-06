import PackagesResults from '@/components/PackagesResults';
import PageChrome from '@/components/PageChrome';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import { searchPackages } from '@/lib/catalog';
import { first } from '@/lib/validation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PackagesPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const results = searchPackages(query);

  const from = first(query.from);
  const to = first(query.to);
  const depart = first(query.depart);
  const returnDate = first(query.return);
  const travelers = first(query.travelers);

  const chips = [
    from && to ? `${from} → ${to}` : to ? `To ${to}` : '',
    depart ? (returnDate ? `${depart} – ${returnDate}` : depart) : '',
    travelers ? `${travelers} ${travelers === '1' ? 'traveler' : 'travelers'}` : '',
  ].filter(Boolean);

  const searching = chips.length > 0;

  return (
    <PageChrome>
      <section className="results-page">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Packages</p>
            <h1>Flight + stay bundles, one booking.</h1>
          </div>

          {searching && (
            <ResultsSearchSummary
              chips={chips}
              count={results.length}
              noun="package"
              clearHref="/packages"
            />
          )}

          <PackagesResults
            packages={results}
            defaultDate={depart || undefined}
            defaultTravelers={travelers ? Number(travelers) : undefined}
          />
        </div>
      </section>
    </PageChrome>
  );
}
