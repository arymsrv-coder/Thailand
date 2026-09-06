import ComingSoon from '@/components/ComingSoon';
import PageChrome from '@/components/PageChrome';
import { SuitcaseIcon } from '@/components/icons';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PackagesPage({ searchParams }: PageProps) {
  const query = await searchParams;

  return (
    <PageChrome>
      <ComingSoon
        icon={SuitcaseIcon}
        title="Flight + stay packages are on the way"
        description="We're bundling flights and stays into one booking. In the meantime, browse our curated tours and destinations."
        query={query}
      />
    </PageChrome>
  );
}
