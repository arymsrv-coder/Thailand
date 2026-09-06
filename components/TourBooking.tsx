'use client';

import { useState } from 'react';
import type { SearchQuery, Tour } from '@/lib/types';
import BookingModal from './BookingModal';

/** The booking entry point on a tour's own detail page — same modal as the results grid. */
export default function TourBooking({ tour, query }: { tour: Tour; query: SearchQuery }) {
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
