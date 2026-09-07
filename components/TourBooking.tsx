'use client';

import { useRawQueryAfterMount } from '@/lib/useRawQuery';
import { validateSearch } from '@/lib/validation';
import { useState } from 'react';
import type { SearchQuery, Tour } from '@/lib/types';
import BookingModal from './BookingModal';

/** The booking entry point on a tour's own detail page — same modal as the results grid. */
export default function TourBooking({ tour }: { tour: Tour }) {
  // Prefill comes from the URL, read here rather than passed down: the page
  // above is prerendered and has no request to read it from. Reading it after
  // mount keeps that page prerendered — see useRawQueryAfterMount.
  const query = validateSearch(useRawQueryAfterMount());
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn btn-primary btn-block" onClick={() => setIsOpen(true)}>
        Book this tour
      </button>
      <BookingModal tour={isOpen ? tour : null} query={query} onClose={() => setIsOpen(false)} />
    </>
  );
}
