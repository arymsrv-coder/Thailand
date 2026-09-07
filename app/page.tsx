import { Suspense } from 'react';
import HomeClient from '@/components/pages/HomeClient';

/*
 * A static shell. The homepage's search state lives in the query string, which
 * this build reads in the browser — there is no server to read it here.
 */
export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeClient />
    </Suspense>
  );
}
