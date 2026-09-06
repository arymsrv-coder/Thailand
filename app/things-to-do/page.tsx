import PageChrome from '@/components/PageChrome';
import SearchSummary from '@/components/SearchSummary';
import Tours from '@/components/Tours';
import { isSearchActive, searchTours } from '@/lib/catalog';
import { tours } from '@/lib/tours';
import { validateSearch } from '@/lib/validation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * The real Things to do results page — everything the homepage's old inline
 * Tours section did, on its own route so it can be linked to, bookmarked and
 * reloaded on its own rather than living only as a homepage anchor. Tours
 * itself renders the heading, so this page only adds the search banner above it.
 */
export default async function ThingsToDoPage({ searchParams }: PageProps) {
  const query = validateSearch(await searchParams);
  const matchedTours = searchTours(query);
  const searching = isSearchActive(query);

  return (
    <PageChrome>
      {searching && (
        <div className="container things-to-do-summary">
          <SearchSummary query={query} tourCount={matchedTours.length} clearHref="/things-to-do" />
        </div>
      )}

      <Tours tours={matchedTours} query={query} totalCount={tours.length} />
    </PageChrome>
  );
}
