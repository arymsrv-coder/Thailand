'use client';

import { useRouter } from 'next/navigation';

type RawQuery = Record<string, string | string[] | undefined>;

function paramsExcluding(query: RawQuery, key: string): URLSearchParams {
  const params = new URLSearchParams();
  for (const [k, value] of Object.entries(query)) {
    if (k === key) continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(k, v));
    else if (value) params.set(k, value);
  }
  return params;
}

/** The "Filter by → Car type" sidebar list. Toggling a checkbox re-navigates
 *  with `carType` added or removed, preserving every other search param. */
export default function CarsFilters({
  categories,
  selected,
  query,
}: {
  categories: { category: string; fromPrice: string }[];
  selected: string[];
  query: RawQuery;
}) {
  const router = useRouter();

  function toggle(category: string) {
    const next = selected.includes(category)
      ? selected.filter((c) => c !== category)
      : [...selected, category];

    const params = paramsExcluding(query, 'carType');
    next.forEach((c) => params.append('carType', c));
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <div className="cars-filters">
      <h2>Filter by</h2>
      <p className="cars-filters-group-label">Car type</p>
      <ul className="cars-filter-list">
        {categories.map(({ category, fromPrice }) => (
          <li key={category}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(category)}
                onChange={() => toggle(category)}
              />
              <span className="cars-filter-name">{category}</span>
              <span className="cars-filter-price">From {fromPrice}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
