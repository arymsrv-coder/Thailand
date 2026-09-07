'use client';

import { useRouter } from 'next/navigation';

type RawQuery = Record<string, string | string[] | undefined>;

/** "Sort by" — re-navigates with `sort` set (or removed, for Recommended). */
export default function FlightsSortSelect({ value, query }: { value: string; query: RawQuery }) {
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    for (const [key, v] of Object.entries(query)) {
      if (key === 'sort') continue;
      if (Array.isArray(v)) v.forEach((x) => params.append(key, x));
      else if (v) params.set(key, v);
    }
    if (event.target.value !== 'recommended') params.set('sort', event.target.value);
    const search = params.toString();
    router.push(search ? `/flights?${search}` : '/flights');
  }

  return (
    <label className="cars-sort">
      <span>Sort by</span>
      <select value={value} onChange={handleChange}>
        <option value="recommended">Recommended</option>
        <option value="price">Total price</option>
        <option value="duration">Duration</option>
        <option value="rating">Traveler ratings</option>
      </select>
    </label>
  );
}
