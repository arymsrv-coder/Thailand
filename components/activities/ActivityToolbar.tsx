'use client';

import { useRouter } from 'next/navigation';
import { InfoIcon } from '../icons';

type RawQuery = Record<string, string | string[] | undefined>;

/** What the note after the count says, per sort order. */
const SORT_NOTES: Record<string, string> = {
  recommended: 'sorted by what most travellers book first',
  'price-asc': 'sorted by price, lowest first',
  'price-desc': 'sorted by price, highest first',
  rating: 'sorted by traveler rating',
};

/** The row above the results: how sorting works on the left, the sort select on the right. */
export default function ActivityToolbar({
  count,
  sort,
  query,
}: {
  count: number;
  sort: string;
  query: RawQuery;
}) {
  const router = useRouter();

  function handleSort(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'sort') continue;
      if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      else if (value) params.set(key, value);
    }
    if (event.target.value !== 'recommended') params.set('sort', event.target.value);
    const search = params.toString();
    router.push(search ? `/things-to-do?${search}` : '/things-to-do', { scroll: false });
  }

  return (
    <div className="act-toolbar">
      <p className="act-toolbar-note">
        <InfoIcon width={14} height={14} />
        <span>
          {count} {count === 1 ? 'thing' : 'things'} to do ·{' '}
          {SORT_NOTES[sort] ?? SORT_NOTES.recommended}
        </span>
      </p>

      <label className="act-sort">
        <span>Sort by</span>
        <select value={sort} onChange={handleSort}>
          <option value="recommended">Recommended</option>
          <option value="price-asc">Price (low to high)</option>
          <option value="price-desc">Price (high to low)</option>
          <option value="rating">Traveler rating</option>
        </select>
      </label>
    </div>
  );
}
