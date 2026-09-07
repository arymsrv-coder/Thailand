import { Suspense } from 'react';
import CruisesClient from '@/components/pages/CruisesClient';

/*
 * A static shell. The page's real work happens in CruisesClient, which reads the
 * query string in the browser — this build has no server to read it.
 */
export default function CruisesPage() {
  return (
    <Suspense fallback={null}>
      <CruisesClient />
    </Suspense>
  );
}
