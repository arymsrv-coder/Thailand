import { Suspense } from 'react';
import FlightsClient from '@/components/pages/FlightsClient';

/*
 * A static shell. The page's real work happens in FlightsClient, which reads the
 * query string in the browser — this build has no server to read it.
 */
export default function FlightsPage() {
  return (
    <Suspense fallback={null}>
      <FlightsClient />
    </Suspense>
  );
}
