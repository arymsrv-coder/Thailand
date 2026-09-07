'use client';

import { useActionState } from 'react';
import type { ActionResult } from '@/lib/types';
import { submitInquiry, type InquirySuccess } from '@/app/actions';
import { GUESTS_MAX, GUESTS_MIN, today } from '@/lib/validation';
import { CheckCircleIcon } from './icons';
import type { InquiryItem } from './InquiryModal';

/** The request form and its success panel — see BookingForm for the tour equivalent. */
export default function InquiryForm({
  item,
  defaultDate,
  defaultTravelers,
  onClose,
}: {
  item: InquiryItem;
  defaultDate?: string;
  defaultTravelers?: number;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState<
    ActionResult<InquirySuccess> | null,
    FormData
  >(submitInquiry, null);

  const isSubmitted = state?.ok === true;
  const errors = state && !state.ok ? state.errors : {};

  if (isSubmitted && state.ok) {
    return (
      <div className="modal-success" aria-live="polite">
        <CheckCircleIcon />
        <h3>Request received</h3>
        <p>Thanks — a coordinator will confirm availability by email shortly.</p>
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
      <input type="hidden" name="kind" value={item.kind} />
      <input type="hidden" name="itemId" value={item.id} />
      <input type="hidden" name="itemLabel" value={item.label} />

      {(errors.form || errors.itemId || errors.kind) && (
        <p className="form-error form-error-block" role="alert">
          {errors.form ?? errors.itemId ?? errors.kind}
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
            aria-describedby={errors.name ? 'inquiryNameError' : undefined}
          />
          {errors.name && (
            <span className="form-error" id="inquiryNameError">
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
            aria-describedby={errors.email ? 'inquiryEmailError' : undefined}
          />
          {errors.email && (
            <span className="form-error" id="inquiryEmailError">
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
            defaultValue={defaultDate ?? ''}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'inquiryDateError' : undefined}
          />
          {errors.date && (
            <span className="form-error" id="inquiryDateError">
              {errors.date}
            </span>
          )}
        </label>
        <label>
          <span>Travelers</span>
          <input
            type="number"
            name="travelers"
            min={GUESTS_MIN}
            max={GUESTS_MAX}
            defaultValue={defaultTravelers ?? 2}
            required
            aria-invalid={Boolean(errors.travelers)}
            aria-describedby={errors.travelers ? 'inquiryTravelersError' : undefined}
          />
          {errors.travelers && (
            <span className="form-error" id="inquiryTravelersError">
              {errors.travelers}
            </span>
          )}
        </label>
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={isPending}>
        {isPending ? 'Sending…' : 'Request to Book'}
      </button>
      <p className="modal-note">No payment is taken here — this is a booking request only.</p>
    </form>
  );
}
