import Link from 'next/link';
import BackButton from '@/components/BackButton';
import AdviceGrid from '@/components/discover/AdviceGrid';
import BrowseStrip from '@/components/discover/BrowseStrip';
import CruisesResults from '@/components/CruisesResults';
import DiscoverBand from '@/components/discover/DiscoverBand';
import DiscoverProse from '@/components/discover/DiscoverProse';
import DiscoverSearchBar, { DiscoverDateRange } from '@/components/discover/DiscoverSearchBar';
import FeaturedTravel from '@/components/discover/FeaturedTravel';
import PageChrome from '@/components/PageChrome';
import ResultsSearchSummary from '@/components/ResultsSearchSummary';
import { cruiseDestinationOptions, cruiseDurationOptions, searchCruises } from '@/lib/catalog';
import { cruisesContent } from '@/lib/discover';
import { first, GUESTS_MAX, GUESTS_MIN, isValidIsoDate, today } from '@/lib/validation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * The Cruises page, on the same discovery skeleton as Things to do: a search
 * row, the sailings, then the editorial sections.
 *
 * The reference prints a sales phone number under its title. There is no
 * cruise desk behind this site, so that line links to the contact form rather
 * than showing a number that would not be answered.
 */
export default async function CruisesPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const results = searchCruises(query);

  const destination = first(query.destination);
  const duration = first(query.duration);
  // Dates are echoed back into the chips and the form, so only well-formed
  // ISO dates survive — a hand-edited URL renders an empty field, not its text.
  const departRaw = first(query.depart);
  const returnRaw = first(query.returnBy);
  const depart = isValidIsoDate(departRaw) ? departRaw : '';
  const returnBy = isValidIsoDate(returnRaw) && returnRaw >= depart ? returnRaw : '';

  // Party size arrives as free text on the URL. Keep it only when it is a whole
  // number in range, so nothing downstream ever sees NaN or an absurd value.
  const travelersRaw = Number.parseInt(first(query.travelers), 10);
  const travelers =
    Number.isInteger(travelersRaw) && travelersRaw >= GUESTS_MIN && travelersRaw <= GUESTS_MAX
      ? travelersRaw
      : undefined;

  const destinationOptions = cruiseDestinationOptions();
  const durationOptions = cruiseDurationOptions();

  // Only echo a term back as a chip once it is known to be one of ours, so a
  // hand-edited URL cannot put arbitrary text into the page.
  const knownDestination = destinationOptions.includes(destination) ? destination : '';
  const durationLabel = durationOptions.find((option) => option.key === duration)?.label ?? '';

  const chips = [
    knownDestination,
    durationLabel,
    depart ? (returnBy ? `${depart} – ${returnBy}` : depart) : '',
  ].filter(Boolean);

  const searching = chips.length > 0;

  return (
    <PageChrome>
      <div className="dsc-page">
        <div className="container">
          <BackButton />

          <DiscoverSearchBar
            title="Sailings along Thailand’s coasts and rivers"
            note={
              <>
                Planning a longer route or a private charter?{' '}
                <Link href="/#contact">Talk to us</Link> and we will put one together.
              </>
            }
            action="/cruises"
            preserve={{ travelers: travelers ? String(travelers) : '' }}
          >
            <div className="dsc-field">
              <label htmlFor="cruiseWhere">Going to</label>
              <select id="cruiseWhere" name="destination" defaultValue={knownDestination}>
                <option value="">Anywhere in Thailand</option>
                {destinationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <DiscoverDateRange
              label="Departing between"
              fromName="depart"
              toName="returnBy"
              defaultFrom={depart}
              defaultTo={returnBy}
              minDate={today()}
            />

            <div className="dsc-field">
              <label htmlFor="cruiseDuration">Duration</label>
              <select id="cruiseDuration" name="duration" defaultValue={duration}>
                <option value="">Any length</option>
                {durationOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </DiscoverSearchBar>

          {searching && (
            <ResultsSearchSummary
              chips={chips}
              count={results.length}
              noun="cruise"
              clearHref="/cruises"
            />
          )}

          <div className="dsc-results">
            <CruisesResults
              cruises={results}
              defaultDate={depart || undefined}
              defaultTravelers={travelers}
            />
          </div>

          {/* The editorial run that closes the page, in the reference's order. */}
          <FeaturedTravel feature={cruisesContent.feature} promos={cruisesContent.promos} />
          <AdviceGrid cards={cruisesContent.advice} />
          <DiscoverBand band={cruisesContent.band} />
          <BrowseStrip heading={cruisesContent.browseHeading} tiles={cruisesContent.browse} />
          <DiscoverProse
            heading={cruisesContent.proseHeading}
            entries={cruisesContent.prose}
            columns={1}
          />
        </div>
      </div>
    </PageChrome>
  );
}
