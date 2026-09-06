import ComingSoon from '@/components/ComingSoon';
import PageChrome from '@/components/PageChrome';
import { ShipIcon } from '@/components/icons';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CruisesPage({ searchParams }: PageProps) {
  const query = await searchParams;

  return (
    <PageChrome>
      <ComingSoon
        icon={ShipIcon}
        title="Cruises are on the way"
        description="We're charting island-hopping routes through the Andaman Sea and Gulf of Thailand. In the meantime, browse our curated tours and destinations."
        query={query}
      />
    </PageChrome>
  );
}
