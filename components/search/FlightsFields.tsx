'use client';

import { useState } from 'react';
import { today } from '@/lib/validation';
import { CalendarIcon, PinIcon, PlaneIcon } from '../icons';
import TravelersStepper from './TravelersStepper';

/**
 * Field group for the Flights tab. Self-contained and uncontrolled from
 * HeroSearch's point of view — it reads back out of the form's FormData on
 * submit, the same way a plain HTML form would, since none of these fields
 * need the destination typeahead the Stays/Things to do tabs share.
 */
export default function FlightsFields() {
  const minDate = today();
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [depart, setDepart] = useState('');

  return (
    <>
      <div className="search-field search-field-triptype">
        <PlaneIcon />
        <div>
          <label>Trip</label>
          <div className="trip-toggle" role="radiogroup" aria-label="Trip type">
            {(['roundtrip', 'oneway'] as const).map((value) => (
              <label key={value} className={tripType === value ? 'is-active' : undefined}>
                <input
                  type="radio"
                  name="tripType"
                  value={value}
                  checked={tripType === value}
                  onChange={() => setTripType(value)}
                />
                {value === 'roundtrip' ? 'Round-trip' : 'One-way'}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <PinIcon />
        <div>
          <label htmlFor="flightsFrom">Leaving from</label>
          <input id="flightsFrom" type="text" name="from" placeholder="Bangkok (BKK)" autoComplete="off" />
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <PinIcon />
        <div>
          <label htmlFor="flightsTo">Going to</label>
          <input id="flightsTo" type="text" name="to" placeholder="Phuket (HKT)" autoComplete="off" />
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field search-field-dates">
        <CalendarIcon />
        <div>
          <label htmlFor="flightsDepart">Dates</label>
          <div className="date-pair">
            <input
              id="flightsDepart"
              type="date"
              name="depart"
              min={minDate}
              aria-label="Depart"
              onChange={(event) => setDepart(event.target.value)}
            />
            {tripType === 'roundtrip' && (
              <>
                <span aria-hidden="true">→</span>
                <input type="date" name="return" min={depart || minDate} aria-label="Return" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="search-divider" />

      <TravelersStepper name="travelers" defaultValue={1} />
    </>
  );
}
