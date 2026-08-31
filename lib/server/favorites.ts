import 'server-only';
import { createStore } from './store';

/*
 * Saved destinations, keyed by the anonymous visitor id from the cookie.
 * One record per visitor rather than one row per save, so reading a visitor's
 * list is a single lookup.
 */

type FavoriteRecord = {
  visitorId: string;
  slugs: string[];
  updatedAt: string;
};

const store = createStore<FavoriteRecord>('favorites');

export async function getFavorites(visitorId: string | null): Promise<string[]> {
  if (!visitorId) return [];
  const rows = await store.all();
  return rows.find((row) => row.visitorId === visitorId)?.slugs ?? [];
}

/**
 * Adds or removes a destination, returning the visitor's full list afterwards.
 * The read-modify-write runs inside the store's write queue, so two toggles
 * arriving together cannot overwrite one another.
 */
export async function toggleFavorite(
  visitorId: string,
  slug: string
): Promise<string[]> {
  let result: string[] = [];

  await store.update((rows) => {
    const existing = rows.find((row) => row.visitorId === visitorId);
    const current = existing?.slugs ?? [];

    const slugs = current.includes(slug)
      ? current.filter((saved) => saved !== slug)
      : [...current, slug];

    result = slugs;
    const updated: FavoriteRecord = {
      visitorId,
      slugs,
      updatedAt: new Date().toISOString(),
    };

    return existing
      ? rows.map((row) => (row.visitorId === visitorId ? updated : row))
      : [...rows, updated];
  });

  return result;
}
