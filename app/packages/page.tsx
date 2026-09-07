import { Suspense } from 'react';
import PackagesClient from '@/components/pages/PackagesClient';

/*
 * A static shell. The page's real work happens in PackagesClient, which reads the
 * query string in the browser — this build has no server to read it.
 */
export default function PackagesPage() {
  return (
    <Suspense fallback={null}>
      <PackagesClient />
    </Suspense>
  );
}
