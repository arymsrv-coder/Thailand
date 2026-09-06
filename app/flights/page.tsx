import ComingSoon from '@/components/ComingSoon';
import PageChrome from '@/components/PageChrome';
import { PlaneIcon } from '@/components/icons';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FlightsPage({ searchParams }: PageProps) {
  const query = await searchParams;

  return (
    <PageChrome>
      <ComingSoon
        icon={PlaneIcon}
        title="Flights are on the way"
        description="We're wiring up real fares between Bangkok, Phuket, Chiang Mai and beyond. In the meantime, browse our curated tours and destinations."
        query={query}
      />
    </PageChrome>
  );
}
