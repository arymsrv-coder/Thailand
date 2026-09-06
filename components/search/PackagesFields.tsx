'use client';

import { useState } from 'react';
import { today } from '@/lib/validation';
import { CalendarIcon, PinIcon } from '../icons';
import TravelersStepper from './TravelersStepper';

/** Field group for the Packages tab (flight + stay bundled). See FlightsFields for rationale. */
export default function PackagesFields() {
  const minDate = today();
  const [depart, setDepart] = useState('');

  return (
    <>
      <div className="search-field">
        <PinIcon />
        <div>
          <label htmlFor="packagesFrom">Leaving from</label>
          <input id="packagesFrom" type="text" name="from" placeholder="Bangkok (BKK)" autoComplete="off" />
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <PinIcon />
        <div>
          <label htmlFor="packagesTo">Going to</label>
          <input id="packagesTo" type="text" name="to" placeholder="Phuket, Thailand" autoComplete="off" />
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field search-field-dates">
        <CalendarIcon />
        <div>
          <label htmlFor="packagesDepart">Dates</label>
          <div className="date-pair">
            <input
              id="packagesDepart"
              type="date"
              name="depart"
              min={minDate}
              aria-label="Depart"
              onChange={(event) => setDepart(event.target.value)}
            />
            <span aria-hidden="true">→</span>
            <input type="date" name="return" min={depart || minDate} aria-label="Return" />
          </div>
        </div>
      </div>

      <div className="search-divider" />

      <TravelersStepper name="travelers" defaultValue={2} />
    </>
  );
}
