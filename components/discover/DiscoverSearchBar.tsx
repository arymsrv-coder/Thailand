'use client';

import { useState, type ReactNode } from 'react';
import { SearchIcon } from '../icons';

/**
 * The search row both reference pages open with: a title, an optional note,
 * then a row of bordered fields and a Search button.
 *
 * It submits as a plain GET form, so a search is an ordinary navigation with
 * the terms in the URL — no client-side request, nothing kept in storage, and
 * the page revalidates whatever comes back before using it.
 */
export default function DiscoverSearchBar({
  title,
  note,
  action,
  children,
  /** Values already in the URL that this bar has no field for, kept as hidden
   *  inputs so submitting does not silently drop them. */
  preserve,
}: {
  title: string;
  note?: ReactNode;
  action: string;
  children: ReactNode;
  preserve?: Record<string, string>;
}) {
  return (
    <div className="dsc-head">
      <h1 className="dsc-title">{title}</h1>
      {note && <p className="dsc-note">{note}</p>}

      <form className="dsc-search" method="get" action={action}>
        {preserve &&
          Object.entries(preserve)
            .filter(([, value]) => value !== '')
            .map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}

        {children}

        <button className="btn btn-primary dsc-search-submit" type="submit">
          <SearchIcon width={16} height={16} />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}

/** A date range whose end can never precede its start. */
export function DiscoverDateRange({
  fromName,
  toName,
  defaultFrom,
  defaultTo,
  minDate,
  label,
}: {
  fromName: string;
  toName: string;
  defaultFrom?: string;
  defaultTo?: string;
  minDate: string;
  label: string;
}) {
  const [from, setFrom] = useState(defaultFrom ?? '');
  const fieldId = `${fromName}-range`;

  return (
    <div className="dsc-field dsc-field-dates">
      <label htmlFor={fieldId}>{label}</label>
      <div className="date-pair">
        <input
          id={fieldId}
          type="date"
          name={fromName}
          min={minDate}
          value={from}
          aria-label={`${label} from`}
          onChange={(event) => setFrom(event.target.value)}
        />
        <span aria-hidden="true">→</span>
        <input
          type="date"
          name={toName}
          min={from || minDate}
          defaultValue={defaultTo}
          aria-label={`${label} to`}
        />
      </div>
    </div>
  );
}
