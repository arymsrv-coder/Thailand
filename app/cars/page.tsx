import ComingSoon from '@/components/ComingSoon';
import PageChrome from '@/components/PageChrome';
import { CarIcon } from '@/components/icons';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CarsPage({ searchParams }: PageProps) {
  const query = await searchParams;

  return (
    <PageChrome>
      <ComingSoon
        icon={CarIcon}
        title="Car rentals are on the way"
        description="We're lining up rental partners across Thailand's airports and cities. In the meantime, browse our curated tours and destinations."
        query={query}
      />
    </PageChrome>
  );
}
