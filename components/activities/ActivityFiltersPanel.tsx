'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ACTIVITY_DURATION_OPTIONS,
  RECOMMENDATION_OPTIONS,
  START_TIME_OPTIONS,
  TRAVELER_RATING_OPTIONS,
  type ActivityFilters,
} from '@/lib/catalog';
import { SearchIcon } from '../icons';

type RawQuery = Record<string, string | string[] | undefined>;

/**
 * The results sidebar: a keyword box over the four filter groups.
 *
 * Every control re-navigates with its own query parameter added or removed and
 * every other parameter preserved, so filters compose and the URL stays
 * shareable. Nothing is stored client-side.
 */
export default function ActivityFiltersPanel({
  filters,
  query,
  hasFilters,
}: {
  filters: ActivityFilters;
  query: RawQuery;
  hasFilters: boolean;
}) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(filters.keyword);

  function paramsWithout(...keys: string[]): URLSearchParams {
    const params = new URLSearchParams();
    const skip = new Set(keys);
    for (const [key, value] of Object.entries(query)) {
      if (skip.has(key)) continue;
      if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      else if (value) params.set(key, value);
    }
    return params;
  }

  function go(params: URLSearchParams) {
    const search = params.toString();
    router.push(search ? `/things-to-do?${search}` : '/things-to-do', { scroll: false });
  }

  function toggle(param: string, key: string, current: string[]) {
    const next = current.includes(key)
      ? current.filter((value) => value !== key)
      : [...current, key];
    const params = paramsWithout(param);
    next.forEach((value) => params.append(param, value));
    go(params);
  }

  function setRating(key: string) {
    const params = paramsWithout('rating');
    if (key) params.set('rating', key);
    go(params);
  }

  function submitKeyword(event: React.FormEvent) {
    event.preventDefault();
    const params = paramsWithout('q');
    const term = keyword.trim();
    if (term) params.set('q', term);
    go(params);
  }

  return (
    <aside className="act-sidebar">
      <form className="act-keyword" onSubmit={submitKeyword} role="search">
        <h2>Search for an activity</h2>
        <div className="act-keyword-field">
          <SearchIcon width={16} height={16} />
          <input
            type="search"
            name="q"
            value={keyword}
            maxLength={80}
            placeholder="Enter a keyword"
            aria-label="Search activities by keyword"
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
      </form>

      <div className="act-filters">
        <div className="act-filters-head">
          <h2>Filter by</h2>
          {hasFilters && (
            <button type="button" className="act-clear" onClick={() => go(new URLSearchParams())}>
              Clear all
            </button>
          )}
        </div>

        <fieldset className="act-group">
          <legend>Traveler rating</legend>
          {TRAVELER_RATING_OPTIONS.map((option) => (
            <label key={option.key || 'any'}>
              <input
                type="radio"
                name="rating"
                checked={String(filters.minScore || '') === option.key}
                onChange={() => setRating(option.key)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="act-group">
          <legend>Recommendations</legend>
          {RECOMMENDATION_OPTIONS.map((option) => (
            <label key={option.key}>
              <input
                type="checkbox"
                checked={filters.recommendations.includes(option.key)}
                onChange={() => toggle('rec', option.key, filters.recommendations)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="act-group">
          <legend>Start time</legend>
          {START_TIME_OPTIONS.map((option) => (
            <label key={option.key}>
              <input
                type="checkbox"
                checked={filters.startTimes.includes(option.key)}
                onChange={() => toggle('start', option.key, filters.startTimes)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="act-group">
          <legend>Duration</legend>
          {ACTIVITY_DURATION_OPTIONS.map((option) => (
            <label key={option.key}>
              <input
                type="checkbox"
                checked={filters.durations.includes(option.key)}
                onChange={() => toggle('length', option.key, filters.durations)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </aside>
  );
}
