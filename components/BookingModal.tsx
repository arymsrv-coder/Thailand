'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { SearchQuery, Tour } from '@/lib/types';
import BookingForm from './BookingForm';
import { CloseIcon } from './icons';
import { useLenis } from './motion/SmoothScroll';

type Props = {
  /** The tour being booked, or null when the modal is closed. */
  tour: Tour | null;
  /** The active search, used to prefill the date and party size. */
  query: SearchQuery;
  onClose: () => void;
};

/**
 * Booking modal. Submits to the `submitBooking` Server Action, which validates
 * again on the server and records the request, then shows the reference code it
 * came back with.
 *
 * The panel stays mounted so the open/close opacity transition can run, and it
 * keeps rendering the last tour while fading out rather than blanking
 * mid-animation.
 */
export default function BookingModal({ tour, query, onClose }: Props) {
  const [displayed, setDisplayed] = useState<Tour | null>(null);
  /*
   * Bumped on every open, and used as the form's key, so each visit starts
   * from a blank form rather than the last booking's confirmation.
   */
  const [openCount, setOpenCount] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  const isOpen = tour !== null;

  useEffect(() => {
    if (!tour) return;
    setDisplayed(tour);
    setOpenCount((count) => count + 1);
  }, [tour]);

  // Lock the page behind the modal, move focus in, keep Tab inside the dialog,
  // and hand focus back to whatever opened it on close.
  useEffect(() => {
    if (!isOpen) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    /*
     * Lenis animates the scroll position itself, so it keeps running even with
     * the body's overflow hidden — the page would drift behind the dialog.
     */
    lenis?.stop();
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      // Tabbing off either end of the dialog wraps to the other end, rather
      // than moving into the page behind it.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const visible = Array.from(focusable).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (visible.length === 0) return;

      const first = visible[0];
      const last = visible[visible.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      lenis?.start();
      lastFocusedRef.current?.focus();
    };
  }, [isOpen, onClose, lenis]);

  return (
    <div
      className={`modal${isOpen ? ' is-open' : ''}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="modal-backdrop" onClick={onClose} />
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        ref={panelRef}
      >
        <button
          className="modal-close"
          aria-label="Close"
          ref={closeButtonRef}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <div className="modal-media">
          {displayed && (
            <Image
              src={displayed.image}
              alt={displayed.title}
              fill
              sizes="(max-width: 860px) 100vw, 340px"
            />
          )}
        </div>
        <div className="modal-body">
          <p className="modal-meta">
            {displayed ? `${displayed.location} · ${displayed.duration}` : ''}
          </p>
          <h3 id="modalTitle">{displayed?.title ?? ''}</h3>
          <p className="modal-price">
            {displayed ? `${displayed.price} / person` : ''}
          </p>

          {displayed && (
            <BookingForm
              key={openCount}
              tour={displayed}
              query={query}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
