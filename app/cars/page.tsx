import { Suspense } from 'react';
import CarsClient from '@/components/pages/CarsClient';

/*
 * A static shell. The page's real work happens in CarsClient, which reads the
 * query string in the browser — this build has no server to read it.
 */
export default function CarsPage() {
  return (
    <Suspense fallback={null}>
      <CarsClient />
    </Suspense>
  );
}
