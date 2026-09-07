'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { InquiryKind } from '@/lib/types';
import InquiryForm from './InquiryForm';
import { CloseIcon } from './icons';
import { useLenis } from './motion/SmoothScroll';

export type InquiryItem = {
  kind: InquiryKind;
  id: string;
  label: string;
  subtitle: string;
  price: string;
  image?: string;
};

/**
 * The "request to book" modal shared by Flights/Cars/Packages/Cruises — the
 * same shell and behaviour as BookingModal (tours), generalised over any
 * listing shape since none of these four verticals share a catalog with
 * tours or with each other.
 */
export default function InquiryModal({
  item,
  defaultDate,
  defaultTravelers,
  onClose,
}: {
  item: InquiryItem | null;
  defaultDate?: string;
  defaultTravelers?: number;
  onClose: () => void;
}) {
  const [displayed, setDisplayed] = useState<InquiryItem | null>(null);
  const [openCount, setOpenCount] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  const isOpen = item !== null;

  useEffect(() => {
    if (!item) return;
    setDisplayed(item);
    setOpenCount((count) => count + 1);
  }, [item]);

  useEffect(() => {
    if (!isOpen) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

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
        className={`modal-panel${displayed?.image ? ' has-media' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiryModalTitle"
        ref={panelRef}
      >
        <button className="modal-close" aria-label="Close" ref={closeButtonRef} onClick={onClose}>
          <CloseIcon />
        </button>
        {displayed?.image && (
          <div className="modal-media">
            <Image
              src={displayed.image}
              alt={displayed.label}
              fill
              sizes="(max-width: 720px) 100vw, 420px"
            />
          </div>
        )}
        <div className="modal-body">
          <p className="modal-meta">{displayed?.subtitle ?? ''}</p>
          <h3 id="inquiryModalTitle">{displayed?.label ?? ''}</h3>
          <p className="modal-price">{displayed ? `${displayed.price}` : ''}</p>

          {displayed && (
            <InquiryForm
              key={openCount}
              item={displayed}
              defaultDate={defaultDate}
              defaultTravelers={defaultTravelers}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
