'use client';

import { useRouter } from 'next/navigation';

type RawQuery = Record<string, string | string[] | undefined>;

/** "Sort by" — re-navigates with `sort` set (or removed, for Recommended). */
export default function CarsSortSelect({ value, query }: { value: string; query: RawQuery }) {
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    for (const [key, v] of Object.entries(query)) {
      if (key === 'sort') continue;
      if (Array.isArray(v)) v.forEach((x) => params.append(key, x));
      else if (v) params.set(key, v);
    }
    if (event.target.value !== 'recommended') params.set('sort', event.target.value);
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <label className="cars-sort">
      <span>Sort by</span>
      <select value={value} onChange={handleChange}>
        <option value="recommended">Recommended</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </label>
  );
}
