'use client';

import { useRouter } from 'next/navigation';
import type { PackageFilterSelect } from '@/lib/catalog';

type RawQuery = Record<string, string | string[] | undefined>;

/**
 * The "Trip length / Star rating / Flight class" pills above one destination's
 * deals, plus "Remove all filters". Each dropdown owns its own query parameter
 * — prefixed with the section slug — so narrowing one destination leaves the
 * rest of the page alone.
 */
export default function PackageSectionFilters({
  selects,
  filtered,
  query,
}: {
  selects: PackageFilterSelect[];
  filtered: boolean;
  query: RawQuery;
}) {
  const router = useRouter();

  function navigate(params: URLSearchParams) {
    const search = params.toString();
    router.push(search ? `/packages?${search}` : '/packages', { scroll: false });
  }

  function paramsFrom(skip: Set<string>): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (skip.has(key)) continue;
      if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      else if (value) params.set(key, value);
    }
    return params;
  }

  function change(param: string, value: string) {
    const params = paramsFrom(new Set([param]));
    if (value) params.set(param, value);
    navigate(params);
  }

  function clearAll() {
    navigate(paramsFrom(new Set(selects.map((select) => select.param))));
  }

  return (
    <div className="deal-filters">
      {selects.map((select) => (
        <label
          key={select.param}
          className={`deal-filter${select.value ? ' is-set' : ''}`}
        >
          <span className="sr-only">{select.label}</span>
          <select value={select.value} onChange={(event) => change(select.param, event.target.value)}>
            <option value="">{select.label}</option>
            {select.options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      {filtered && (
        <button type="button" className="deal-filters-clear" onClick={clearAll}>
          Remove all filters
        </button>
      )}
    </div>
  );
}
