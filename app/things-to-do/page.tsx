import { Suspense } from 'react';
import ThingsToDoClient from '@/components/pages/ThingsToDoClient';

/*
 * A static shell. The page's real work happens in ThingsToDoClient, which reads the
 * query string in the browser — this build has no server to read it.
 */
export default function ThingsToDoPage() {
  return (
    <Suspense fallback={null}>
      <ThingsToDoClient />
    </Suspense>
  );
}
