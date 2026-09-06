'use client';

import { useState } from 'react';
import { today } from '@/lib/validation';
import { CalendarIcon, PinIcon, SearchIcon } from './icons';

/**
 * The Cars page's own compact search bar — separate from HeroSearch's Cars
 * tab, which only ever starts a search from the homepage. This is the same
 * fields, styled as a plain toolbar rather than the homepage's frosted card,
 * since it lives inline at the top of the results page itself.
 */
export default function CarSearchBar({
  defaultPickupLocation,
  defaultDropoffLocation,
  defaultPickupDate,
  defaultDropoffDate,
}: {
  defaultPickupLocation?: string;
  defaultDropoffLocation?: string;
  defaultPickupDate?: string;
  defaultDropoffDate?: string;
}) {
  const [pickupDate, setPickupDate] = useState(defaultPickupDate ?? '');
  const minDate = today();

  return (
    <form className="cars-search-bar" method="get" action="/cars">
      <div className="cars-search-field">
        <PinIcon width={16} height={16} />
        <div>
          <label htmlFor="carsBarPickup">Pick-up</label>
          <input
            id="carsBarPickup"
            type="text"
            name="pickupLocation"
            placeholder="City or airport"
            defaultValue={defaultPickupLocation}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="cars-search-field">
        <PinIcon width={16} height={16} />
        <div>
          <label htmlFor="carsBarDropoff">Drop-off</label>
          <input
            id="carsBarDropoff"
            type="text"
            name="dropoffLocation"
            placeholder="Same as pick-up"
            defaultValue={defaultDropoffLocation}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="cars-search-field">
        <CalendarIcon width={16} height={16} />
        <div>
          <label htmlFor="carsBarPickupDate">Dates</label>
          <div className="date-pair">
            <input
              id="carsBarPickupDate"
              type="date"
              name="pickupDate"
              min={minDate}
              value={pickupDate}
              aria-label="Pick-up date"
              onChange={(event) => setPickupDate(event.target.value)}
            />
            <span aria-hidden="true">→</span>
            <input
              type="date"
              name="dropoffDate"
              min={pickupDate || minDate}
              defaultValue={defaultDropoffDate}
              aria-label="Drop-off date"
            />
          </div>
        </div>
      </div>

      <button className="btn btn-primary cars-search-submit" type="submit">
        <SearchIcon width={16} height={16} />
        <span>Search</span>
      </button>
    </form>
  );
}
