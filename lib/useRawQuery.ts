'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

/*
 * The query string in the shape the catalogue helpers already expect —
 * `Record<string, string | string[] | undefined>`, exactly what a Server
 * Component's `searchParams` used to hand them.
 *
 * A static export has no server to read the URL, so every results page reads
 * it here instead and filters in the browser. The filtering itself is
 * unchanged: those helpers are pure functions over bundled data, so they run
 * the same either side.
 */
function toRecord(params: URLSearchParams): Record<string, string | string[] | undefined> {
  const out: Record<string, string | string[] | undefined> = {};
  for (const key of new Set(params.keys())) {
    const all = params.getAll(key);
    // Repeated keys (?stops=0&stops=1) stay arrays, as they were on the server.
    out[key] = all.length > 1 ? all : all[0];
  }
  return out;
}

export function useRawQuery(): Record<string, string | string[] | undefined> {
  const params = useSearchParams();

  return useMemo(() => toRecord(params), [params]);
}

/*
 * The same thing, read after mount instead.
 *
 * `useSearchParams` makes the whole route opt out of prerendering, which is
 * the right trade on a results page — the query *is* the page. It is the wrong
 * one where the query only prefills something, as on a tour's detail page:
 * that page's content is fixed and should ship as finished HTML. Reading the
 * URL here costs one render after hydration and keeps the page static.
 */
export function useRawQueryAfterMount(): Record<string, string | string[] | undefined> {
  const [query, setQuery] = useState<Record<string, string | string[] | undefined>>({});

  useEffect(() => {
    const read = () => setQuery(toRecord(new URLSearchParams(window.location.search)));
    read();
    // Back and forward can change the query without remounting.
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  return query;
}
