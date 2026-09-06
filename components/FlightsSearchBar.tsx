'use client';

import { useState } from 'react';
import { GUESTS_MAX, GUESTS_MIN, today } from '@/lib/validation';
import { CalendarIcon, PeopleIcon, PinIcon, SearchIcon } from './icons';

/**
 * The Flights page's own search bar — trip-type tabs above a compact
 * toolbar, same pattern as CarSearchBar. Separate from HeroSearch's Flights
 * tab, which only ever starts a search from the homepage.
 */
export default function FlightsSearchBar({
  defaultFrom,
  defaultTo,
  defaultDepart,
  defaultReturn,
  defaultTripType,
  defaultTravelers,
  defaultCabin,
}: {
  defaultFrom?: string;
  defaultTo?: string;
  defaultDepart?: string;
  defaultReturn?: string;
  defaultTripType?: string;
  defaultTravelers?: string;
  defaultCabin?: string;
}) {
  const [tripType, setTripType] = useState(defaultTripType === 'oneway' ? 'oneway' : 'roundtrip');
  const [depart, setDepart] = useState(defaultDepart ?? '');
  const minDate = today();

  return (
    <form className="cars-search-bar-wrap" method="get" action="/flights">
      <div className="flights-trip-tabs" role="tablist" aria-label="Trip type">
        {(['roundtrip', 'oneway'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tripType === value}
            className={`flights-trip-tab${tripType === value ? ' is-active' : ''}`}
            onClick={() => setTripType(value)}
          >
            {value === 'roundtrip' ? 'Roundtrip' : 'One-way'}
          </button>
        ))}
        <input type="hidden" name="tripType" value={tripType} />
      </div>

      <div className="cars-search-bar">
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

        <div className="cars-search-field">
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
              {tripType === 'roundtrip' && (
                <>
                  <span aria-hidden="true">→</span>
                  <input
                    type="date"
                    name="return"
                    min={depart || minDate}
                    defaultValue={defaultReturn}
                    aria-label="Return"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="cars-search-field">
          <PeopleIcon width={16} height={16} />
          <div>
            <label htmlFor="flightsBarTravelers">Travelers, cabin class</label>
            <div className="flights-travelers-cabin">
              <input
                id="flightsBarTravelers"
                type="number"
                name="travelers"
                min={GUESTS_MIN}
                max={GUESTS_MAX}
                defaultValue={defaultTravelers ?? 1}
                aria-label="Travelers"
              />
              <select name="cabin" defaultValue={defaultCabin ?? 'Economy'} aria-label="Cabin class">
                <option>Economy</option>
                <option>Business</option>
              </select>
            </div>
          </div>
        </div>

        <button className="btn btn-primary cars-search-submit" type="submit">
          <SearchIcon width={16} height={16} />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
