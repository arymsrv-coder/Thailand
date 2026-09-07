'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ResultsFilterGroup } from '@/lib/catalog';

type RawQuery = Record<string, string | string[] | undefined>;

function paramsExcluding(query: RawQuery, ...keys: string[]): URLSearchParams {
  const params = new URLSearchParams();
  const skip = new Set(keys);
  for (const [k, value] of Object.entries(query)) {
    if (skip.has(k)) continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(k, v));
    else if (value) params.set(k, value);
  }
  return params;
}

/**
 * One sidebar group: a header row carrying the group name and the "From"
 * column, then its checkboxes — collapsed behind "Show more" once the group
 * runs longer than the reference's six visible rows.
 */
function FilterGroup({
  group,
  selected,
  onToggle,
}: {
  group: ResultsFilterGroup;
  selected: string[];
  onToggle: (param: string, key: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = group.options.length > group.initialVisible;
  const visible = expanded || !collapsible ? group.options : group.options.slice(0, group.initialVisible);

  return (
    <div className="cars-filter-group">
      <div className="cars-filter-group-head">
        <p className="cars-filters-group-label">{group.label}</p>
        {group.showFrom && <span className="cars-filter-from">From</span>}
      </div>

      <ul className="cars-filter-list">
        {visible.map((option) => (
          <li key={option.key}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(option.key)}
                onChange={() => onToggle(group.param, option.key)}
              />
              <span className="cars-filter-name">{option.label}</span>
              {option.fromPrice && <span className="cars-filter-price">{option.fromPrice}</span>}
            </label>
            {option.note && <p className="cars-filter-note">{option.note}</p>}
          </li>
        ))}
      </ul>

      {collapsible && (
        <button
          type="button"
          className="cars-filter-showmore"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

/**
 * The "Filter by" sidebar, shared by the Flights and Cars results pages.
 * Every group toggles the same way: checking a box re-navigates with that
 * group's parameter added or removed, preserving every other search param —
 * so filters compose and the URL stays shareable.
 */
export default function ResultsFilters({
  basePath,
  groups,
  selectedByParam,
  query,
}: {
  /** Where a toggled checkbox navigates back to, e.g. "/flights". */
  basePath: string;
  groups: ResultsFilterGroup[];
  selectedByParam: Record<string, string[]>;
  query: RawQuery;
}) {
  const router = useRouter();

  function toggle(param: string, key: string) {
    const current = selectedByParam[param] ?? [];
    const next = current.includes(key)
      ? current.filter((value) => value !== key)
      : [...current, key];

    const params = paramsExcluding(query, param);
    next.forEach((value) => params.append(param, value));
    const search = params.toString();
    router.push(search ? `${basePath}?${search}` : basePath);
  }

  /** Drop every filter this panel owns, keeping the search itself intact. */
  function clearAll() {
    const params = paramsExcluding(query, ...groups.map((group) => group.param));
    const search = params.toString();
    router.push(search ? `${basePath}?${search}` : basePath);
  }

  const activeCount = groups.reduce(
    (total, group) => total + (selectedByParam[group.param]?.length ?? 0),
    0
  );

  return (
    <div className="cars-filters">
      <div className="cars-filters-head">
        <h2>Filter by</h2>
        {activeCount > 0 && (
          <button type="button" className="cars-filters-clear" onClick={clearAll}>
            Clear all ({activeCount})
          </button>
        )}
      </div>
      {groups.map((group) => (
        <FilterGroup
          key={group.param}
          group={group}
          selected={selectedByParam[group.param] ?? []}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}
