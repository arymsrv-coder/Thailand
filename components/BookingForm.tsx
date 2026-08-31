'use client';

import { useActionState } from 'react';
import type { ActionResult, SearchQuery, Tour } from '@/lib/types';
import { submitBooking, type BookingSuccess } from '@/app/actions';
import { GUESTS_MAX, GUESTS_MIN, today } from '@/lib/validation';
import { CheckCircleIcon } from './icons';

/*
 * The booking form and its success panel.
 *
 * Kept separate from the modal shell, and remounted by the shell each time the
 * modal opens, so the action state starts clean. Left inside the shell it would
 * survive a close, and the next tour opened would greet the visitor with the
 * previous booking's confirmation.
 */
export default function BookingForm({
  tour,
  query,
  onClose,
}: {
  tour: Tour;
  query: SearchQuery;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState<
    ActionResult<BookingSuccess> | null,
    FormData
  >(submitBooking, null);

  const isSubmitted = state?.ok === true;
  const errors = state && !state.ok ? state.errors : {};
  const maxGuests = Math.min(GUESTS_MAX, tour.maxGroupSize);

  if (isSubmitted && state.ok) {
    return (
      <div className="modal-success" aria-live="polite">
        <CheckCircleIcon />
        <h3>Request received</h3>
        <p>Thanks — a coordinator will confirm your dates by email shortly.</p>
        <p className="modal-reference">
          Your reference: <strong>{state.value.reference}</strong>
        </p>
        <button className="btn btn-ghost" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <form className="booking-form" action={formAction} noValidate>
      <input type="hidden" name="tourId" value={tour.id} />

      {(errors.form || errors.tourId) && (
        <p className="form-error form-error-block" role="alert">
          {errors.form ?? errors.tourId}
        </p>
      )}

      <div className="field-row">
        <label>
          <span>Full name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'bookingNameError' : undefined}
          />
          {errors.name && (
            <span className="form-error" id="bookingNameError">
              {errors.name}
            </span>
          )}
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'bookingEmailError' : undefined}
          />
          {errors.email && (
            <span className="form-error" id="bookingEmailError">
              {errors.email}
            </span>
          )}
        </label>
      </div>

      <div className="field-row">
        <label>
          <span>Preferred date</span>
          <input
            type="date"
            name="date"
            required
            min={today()}
            defaultValue={query.from ?? ''}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'bookingDateError' : undefined}
          />
          {errors.date && (
            <span className="form-error" id="bookingDateError">
              {errors.date}
            </span>
          )}
        </label>
        <label>
          <span>Guests</span>
          <input
            type="number"
            name="guests"
            min={GUESTS_MIN}
            max={maxGuests}
            defaultValue={Math.min(query.guests ?? 2, maxGuests)}
            required
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? 'bookingGuestsError' : undefined}
          />
          {errors.guests && (
            <span className="form-error" id="bookingGuestsError">
              {errors.guests}
            </span>
          )}
        </label>
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={isPending}>
        {isPending ? 'Sending…' : 'Request to Book'}
      </button>
      <p className="modal-note">
        No payment is taken here — this is a booking request only. This tour
        takes up to {tour.maxGroupSize} guests.
      </p>
    </form>
  );
}
