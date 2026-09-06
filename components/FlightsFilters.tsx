'use client';

import { useRouter } from 'next/navigation';

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

/** The "Filter by → Stops / Airlines" sidebar — same toggle-and-renavigate
 *  pattern as CarsFilters, over two independent filter dimensions. */
export default function FlightsFilters({
  stopsOptions,
  selectedStops,
  airlineOptions,
  selectedAirlines,
  query,
}: {
  stopsOptions: { key: string; label: string; fromPrice: string }[];
  selectedStops: string[];
  airlineOptions: { airline: string; fromPrice: string }[];
  selectedAirlines: string[];
  query: RawQuery;
}) {
  const router = useRouter();

  function toggleStops(key: string) {
    const next = selectedStops.includes(key)
      ? selectedStops.filter((s) => s !== key)
      : [...selectedStops, key];
    const params = paramsExcluding(query, 'stops');
    next.forEach((s) => params.append('stops', s));
    router.push(`/flights?${params.toString()}`);
  }

  function toggleAirline(airline: string) {
    const next = selectedAirlines.includes(airline)
      ? selectedAirlines.filter((a) => a !== airline)
      : [...selectedAirlines, airline];
    const params = paramsExcluding(query, 'airline');
    next.forEach((a) => params.append('airline', a));
    router.push(`/flights?${params.toString()}`);
  }

  return (
    <div className="cars-filters">
      <h2>Filter by</h2>

      <p className="cars-filters-group-label">Stops</p>
      <ul className="cars-filter-list">
        {stopsOptions.map(({ key, label, fromPrice }) => (
          <li key={key}>
            <label>
              <input
                type="checkbox"
                checked={selectedStops.includes(key)}
                onChange={() => toggleStops(key)}
              />
              <span className="cars-filter-name">{label}</span>
              <span className="cars-filter-price">From {fromPrice}</span>
            </label>
          </li>
        ))}
      </ul>

      <p className="cars-filters-group-label cars-filters-group-label-spaced">Airlines</p>
      <ul className="cars-filter-list">
        {airlineOptions.map(({ airline, fromPrice }) => (
          <li key={airline}>
            <label>
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline)}
                onChange={() => toggleAirline(airline)}
              />
              <span className="cars-filter-name">{airline}</span>
              <span className="cars-filter-price">From {fromPrice}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
