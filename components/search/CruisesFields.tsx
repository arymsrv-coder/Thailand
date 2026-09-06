'use client';

import { today } from '@/lib/validation';
import { CalendarIcon, PinIcon } from '../icons';
import TravelersStepper from './TravelersStepper';

/** Field group for the Cruises tab. See FlightsFields for the uncontrolled-form rationale. */
export default function CruisesFields() {
  return (
    <>
      <div className="search-field">
        <PinIcon />
        <div>
          <label htmlFor="cruisesDestination">Where to</label>
          <input
            id="cruisesDestination"
            type="text"
            name="destination"
            placeholder="Andaman Sea, Gulf of Thailand…"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <CalendarIcon />
        <div>
          <label htmlFor="cruisesDepart">Sail date</label>
          <input id="cruisesDepart" type="date" name="depart" min={today()} aria-label="Sail date" />
        </div>
      </div>

      <div className="search-divider" />

      <TravelersStepper name="travelers" defaultValue={2} />
    </>
  );
}
