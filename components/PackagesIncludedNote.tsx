'use client';

import { useId, useState } from 'react';
import { CheckCircleIcon, ChevronDownIcon } from './icons';

/** The single collapsible explainer the reference puts above the deal sections. */
export default function PackagesIncludedNote() {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  return (
    <div className={`lp-included${open ? ' is-open' : ''}`}>
      <span className="lp-included-icon" aria-hidden="true">
        <CheckCircleIcon width={34} height={34} />
      </span>
      <div className="lp-included-main">
        <button
          type="button"
          className="lp-included-toggle"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>What&rsquo;s included in an Amara Siam package?</span>
          <ChevronDownIcon />
        </button>
        <div className="lp-included-body" id={bodyId}>
          <p>
            Every package on this page bundles round-trip flights with a hotel, booked as one
            reservation. What sits on top of that varies by package and is listed on each one —
            usually daily breakfast, airport transfers, and a guided day out. Meals and drinks
            beyond breakfast are not included unless a package says so.
          </p>
        </div>
      </div>
    </div>
  );
}
