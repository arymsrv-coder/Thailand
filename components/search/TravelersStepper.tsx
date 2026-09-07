'use client';

import { useId, useState } from 'react';
import { GUESTS_MAX, GUESTS_MIN } from '@/lib/validation';
import { GuestsIcon } from '../icons';

/**
 * The traveler count control shared by every search tab that needs one. Two
 * buttons are the actual control; the count itself rides along as a hidden
 * input (rather than a visually-hidden number field) so it still takes
 * keyboard focus and survives a plain HTML form submit with JavaScript off.
 */
export default function TravelersStepper({
  name,
  label = 'Travelers',
  defaultValue = 2,
}: {
  name: string;
  label?: string;
  defaultValue?: number;
}) {
  const labelId = useId();
  const [count, setCount] = useState(defaultValue);

  return (
    <div className="search-field search-field-guests">
      <GuestsIcon />
      <div>
        <label id={labelId}>{label}</label>
        <input type="hidden" name={name} value={count} />
        <div className="guest-stepper" role="group" aria-labelledby={labelId}>
          <button
            type="button"
            aria-label={`Fewer ${label.toLowerCase()}`}
            disabled={count <= GUESTS_MIN}
            onClick={() => setCount((n) => Math.max(GUESTS_MIN, n - 1))}
          >
            &minus;
          </button>
          <span aria-hidden="true">{count}</span>
          <span className="sr-only" aria-live="polite">
            {count} {count === 1 ? label.slice(0, -1).toLowerCase() : label.toLowerCase()}
          </span>
          <button
            type="button"
            aria-label={`More ${label.toLowerCase()}`}
            disabled={count >= GUESTS_MAX}
            onClick={() => setCount((n) => Math.min(GUESTS_MAX, n + 1))}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
