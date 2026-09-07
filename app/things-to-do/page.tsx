import Link from 'next/link';
import ActivityFiltersPanel from '@/components/activities/ActivityFiltersPanel';
import ActivityResults from '@/components/activities/ActivityResults';
import ActivityToolbar from '@/components/activities/ActivityToolbar';
import BackButton from '@/components/BackButton';
import AdviceGrid from '@/components/discover/AdviceGrid';
import BrowseStrip from '@/components/discover/BrowseStrip';
import DiscoverBand from '@/components/discover/DiscoverBand';
import DiscoverProse from '@/components/discover/DiscoverProse';
import DiscoverSearchBar, { DiscoverDateRange } from '@/components/discover/DiscoverSearchBar';
import FeaturedTravel from '@/components/discover/FeaturedTravel';
import PageChrome from '@/components/PageChrome';
import {
  ACTIVITY_CATEGORIES,
  activityCategoryCounts,
  applyActivityFilters,
  hasActivityFilters,
  searchTours,
  validateActivityFilters,
} from '@/lib/catalog';
import { destinations } from '@/lib/destinations';
import { thingsToDoContent } from '@/lib/discover';
import type { ActivityCategorySlug } from '@/lib/types';
import { today, validateSearch } from '@/lib/validation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Things to do, laid out as an activity search-results page: a search row over
 * a filter sidebar and a run of themed result grids, with the editorial
 * sections kept below.
 *
 * Both halves of the query are validated before anything renders —
 * `validateSearch` for where/when/party size, `validateActivityFilters` for the
 * sidebar — so an unknown or hand-edited parameter is dropped rather than
 * echoed back into the page.
 */
export default async function ThingsToDoPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const query = validateSearch(raw);
  const filters = validateActivityFilters(raw);

  const matched = searchTours(query);
  const results = applyActivityFilters(matched, filters);
  const categories = activityCategoryCounts(matched);
  const hasFilters = hasActivityFilters(filters);

  const place = query.where
    ? (destinations.find((destination) => destination.slug === query.where)?.name ?? 'Thailand')
    : 'Thailand';

  /** A link that narrows the page to one category, keeping everything else. */
  function categoryHref(slug: ActivityCategorySlug): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(raw)) {
      if (key === 'category') continue;
      if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      else if (typeof value === 'string' && value) params.set(key, value);
    }
    params.set('category', slug);
    return `/things-to-do?${params.toString()}`;
  }

  // Built here rather than passed as a function: a Server Component cannot hand
  // a callback to a Client Component.
  const categoryHrefs = Object.fromEntries(
    ACTIVITY_CATEGORIES.map(({ slug }) => [slug, categoryHref(slug)])
  ) as Record<ActivityCategorySlug, string>;

  return (
    <PageChrome>
      <div className="act-page">
        <div className="container">
          <BackButton />

          <DiscoverSearchBar
            title={`Things to do in ${place}`}
            note="Small groups, guides who live there, and no charge until a date is confirmed."
            action="/things-to-do"
            preserve={{ guests: query.guests ? String(query.guests) : '' }}
          >
            <div className="dsc-field">
              <label htmlFor="ttdWhere">Going to</label>
              <select id="ttdWhere" name="where" defaultValue={query.where ?? ''}>
                <option value="">Anywhere in Thailand</option>
                {destinations.map((destination) => (
                  <option key={destination.slug} value={destination.slug}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </div>

            <DiscoverDateRange
              label="Dates"
              fromName="from"
              toName="to"
              defaultFrom={query.from}
              defaultTo={query.to}
              minDate={today()}
            />
          </DiscoverSearchBar>

          <div className="act-layout">
            <ActivityFiltersPanel filters={filters} query={raw} hasFilters={hasFilters} />

            <div className="act-main">
              {categories.length > 0 && (
                <ul className="act-chips">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={categoryHref(category.slug)}
                        className={`act-chip${filters.category === category.slug ? ' is-active' : ''}`}
                      >
                        <span className="act-chip-label">{category.label}</span>
                        <span className="act-chip-count">
                          {category.count} {category.count === 1 ? 'thing' : 'things'} to do
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <ActivityToolbar count={results.length} sort={filters.sort} query={raw} />

              <ActivityResults
                tours={results}
                query={query}
                categoryFilter={filters.category}
                categoryHrefs={categoryHrefs}
              />
            </div>
          </div>

          {/* Editorial sections, kept below the results. */}
          <FeaturedTravel
            feature={thingsToDoContent.feature}
            promos={thingsToDoContent.promos}
          />
          <AdviceGrid cards={thingsToDoContent.advice} />
          <DiscoverBand band={thingsToDoContent.band} />
          <BrowseStrip
            heading={thingsToDoContent.browseHeading}
            tiles={thingsToDoContent.browse}
          />
          <DiscoverProse
            heading={thingsToDoContent.proseHeading}
            entries={thingsToDoContent.prose}
            columns={2}
          />
        </div>
      </div>
    </PageChrome>
  );
}
