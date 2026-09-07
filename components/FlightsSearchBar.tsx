'use client';

import { useState } from 'react';
import { GUESTS_MAX, GUESTS_MIN, today } from '@/lib/validation';
import { CalendarIcon, PinIcon, SearchIcon } from './icons';

/**
 * The Flights page's own search bar — five fields and a Search button in one
 * row, the same shape the results page's reference layout uses. Separate from
 * HeroSearch's Flights tab, which only ever starts a search from the homepage.
 *
 * There's no trip-type toggle: the Dates field holds the pair, and leaving the
 * return empty is what makes a search one-way.
 */
export default function FlightsSearchBar({
  defaultFrom,
  defaultTo,
  defaultDepart,
  defaultReturn,
  defaultTravelers,
  defaultCabin,
}: {
  defaultFrom?: string;
  defaultTo?: string;
  defaultDepart?: string;
  defaultReturn?: string;
  defaultTravelers?: string;
  defaultCabin?: string;
}) {
  const [depart, setDepart] = useState(defaultDepart ?? '');
  const minDate = today();

  return (
    <form className="cars-search-bar" method="get" action="/flights">
      <div className="cars-search-field">
        <PinIcon width={16} height={16} />
        <div>
          <label htmlFor="flightsBarFrom">Leaving from</label>
          <input
            id="flightsBarFrom"
            type="text"
            name="from"
            placeholder="City or airport"
            defaultValue={defaultFrom}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="cars-search-field">
        <PinIcon width={16} height={16} />
        <div>
          <label htmlFor="flightsBarTo">Going to</label>
          <input
            id="flightsBarTo"
            type="text"
            name="to"
            placeholder="City or airport"
            defaultValue={defaultTo}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="cars-search-field cars-search-field-dates">
        <CalendarIcon width={16} height={16} />
        <div>
          <label htmlFor="flightsBarDepart">Dates</label>
          <div className="date-pair">
            <input
              id="flightsBarDepart"
              type="date"
              name="depart"
              min={minDate}
              value={depart}
              aria-label="Depart"
              onChange={(event) => setDepart(event.target.value)}
            />
            <span aria-hidden="true">→</span>
            <input
              type="date"
              name="return"
              min={depart || minDate}
              defaultValue={defaultReturn}
              aria-label="Return"
            />
          </div>
        </div>
      </div>

      <div className="cars-search-field cars-search-field-select">
        <div>
          <label htmlFor="flightsBarTravelers">Travelers</label>
          <input
            id="flightsBarTravelers"
            type="number"
            name="travelers"
            min={GUESTS_MIN}
            max={GUESTS_MAX}
            defaultValue={defaultTravelers || 1}
          />
        </div>
      </div>

      <div className="cars-search-field cars-search-field-select">
        <div>
          <label htmlFor="flightsBarCabin">Cabin class</label>
          <select id="flightsBarCabin" name="cabinClass" defaultValue={defaultCabin ?? ''}>
            <option value="">Any cabin</option>
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      <button className="btn btn-primary cars-search-submit" type="submit">
        <SearchIcon width={16} height={16} />
        <span>Search</span>
      </button>
    </form>
  );
}
