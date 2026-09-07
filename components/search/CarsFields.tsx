'use client';

import { useState } from 'react';
import { today } from '@/lib/validation';
import { CalendarIcon, PinIcon } from '../icons';

/** Field group for the Cars tab. See FlightsFields for the uncontrolled-form rationale. */
export default function CarsFields() {
  const minDate = today();
  const [pickupDate, setPickupDate] = useState('');

  return (
    <>
      <div className="search-field">
        <PinIcon />
        <div>
          <label htmlFor="carsPickup">Pick-up location</label>
          <input
            id="carsPickup"
            type="text"
            name="pickupLocation"
            placeholder="Bangkok Airport (BKK)"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <PinIcon />
        <div>
          <label htmlFor="carsDropoff">Drop-off location</label>
          <input
            id="carsDropoff"
            type="text"
            name="dropoffLocation"
            placeholder="Same as pick-up"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="search-divider" />

      <div className="search-field search-field-dates">
        <CalendarIcon />
        <div>
          <label htmlFor="carsPickupDate">Dates</label>
          <div className="date-pair">
            <input
              id="carsPickupDate"
              type="date"
              name="pickupDate"
              min={minDate}
              aria-label="Pick-up date"
              onChange={(event) => setPickupDate(event.target.value)}
            />
            <span aria-hidden="true">→</span>
            <input
              type="date"
              name="dropoffDate"
              min={pickupDate || minDate}
              aria-label="Drop-off date"
            />
          </div>
        </div>
      </div>
    </>
  );
}
