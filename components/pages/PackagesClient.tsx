'use client';

import { useRawQuery } from '@/lib/useRawQuery';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import PackagesFaq from '@/components/PackagesFaq';
import PackagesHero from '@/components/PackagesHero';
import PackagesIncludedNote from '@/components/PackagesIncludedNote';
import PackagesLinkGroups, { type LinkGroup } from '@/components/PackagesLinkGroups';
import PackagesResults from '@/components/PackagesResults';
import PackagesSavingsBanner from '@/components/PackagesSavingsBanner';
import PageChrome from '@/components/PageChrome';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import { packageSections } from '@/lib/catalog';
import { destinations } from '@/lib/destinations';
import { tours } from '@/lib/tours';
import { first } from '@/lib/validation';

/*
 * The two link blocks that close the page. Both point somewhere real: every
 * destination we run packages to, and the tours those packages are built
 * around.
 */
const linkGroups: LinkGroup[] = [
  {
    title: 'Thailand Vacation Packages by Destination',
    links: destinations.map((destination) => ({
      href: `/packages?to=${encodeURIComponent(destination.name)}`,
      label: `${destination.name} Vacation Packages`,
    })),
  },
  {
    title: 'Popular Things to Do in Thailand',
    links: tours.slice(0, 16).map((tour) => ({
      href: `/things-to-do/${tour.id}`,
      label: tour.title,
    })),
  },
];

export default function PackagesClient() {
  const query = useRawQuery();
  const sections = packageSections(query);
  const dealCount = sections.reduce((total, section) => total + section.deals.length, 0);

  const from = first(query.from);
  const to = first(query.to);
  const depart = first(query.depart);
  const returnDate = first(query.return);
  const travelers = first(query.travelers);
  const flightClass = first(query.flightClass);

  const chips = [
    from && to ? `${from} → ${to}` : to ? `To ${to}` : from ? `From ${from}` : '',
    depart ? (returnDate ? `${depart} – ${returnDate}` : depart) : '',
    travelers ? `${travelers} ${travelers === '1' ? 'traveler' : 'travelers'}` : '',
  ].filter(Boolean);

  const searching = chips.length > 0;

  return (
    <PageChrome>
      <div className="lp-page">
        <nav className="lp-breadcrumb" aria-label="Breadcrumb">
          <div className="container">
            <BackButton />
            <Link href="/">Amara Siam</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Vacation Packages</span>
          </div>
        </nav>

        <PackagesHero
          defaultFrom={from}
          defaultTo={to}
          defaultDepart={depart}
          defaultReturn={returnDate}
          defaultTravelers={travelers}
          defaultFlightClass={flightClass}
        />

        <div className="container lp-body">
          <PackagesSavingsBanner />
          <PackagesIncludedNote />

          {searching && (
            <ResultsSearchSummary
              chips={chips}
              count={dealCount}
              noun="package"
              clearHref="/packages"
            />
          )}

          <PackagesResults
            sections={sections}
            query={query}
            defaultDate={depart || undefined}
            defaultTravelers={travelers ? Number(travelers) : undefined}
          />

          <PackagesFaq />
          <PackagesLinkGroups groups={linkGroups} />
        </div>
      </div>
    </PageChrome>
  );
}
