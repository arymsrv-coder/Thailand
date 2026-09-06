'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GUESTS_MAX, GUESTS_MIN, today } from '@/lib/validation';
import type { SearchQuery } from '@/lib/types';
import { CalendarIcon, CompassIcon, GuestsIcon, PinIcon, SearchIcon } from './icons';

type Suggestion = { slug: string; name: string; sub: string };

/*
 * Two tabs over the one underlying search: "Tours" narrows by destination,
 * dates and party size; "Destinations" is just a place lookup. Both submit
 * through the same `where`/`from`/`to`/`guests` query — the tab only decides
 * which fields are on screen (and so which of them get submitted).
 */
const TABS = [
  { key: 'tours', label: 'Tours', icon: CompassIcon },
  { key: 'destinations', label: 'Destinations', icon: PinIcon },
] as const;

type TabKey = (typeof TABS)[number]['key'];

/*
 * The hero search. It writes its state into the URL rather than holding it,
 * so a search is shareable, survives a reload, and the back button undoes it.
 *
 * The form is a real <form> with method="get", so with JavaScript unavailable
 * the browser submits the same query string and the server renders the same
 * filtered page. With JavaScript it is intercepted and pushed through the
 * router instead, which keeps the scroll position and avoids a full reload.
 */
export default function HeroSearch({ query }: { query: SearchQuery }) {
  const router = useRouter();
  const listId = useId();
  const guestsLabelId = useId();

  const minDate = today();

  const [tab, setTab] = useState<TabKey>('tours');
  const [where, setWhere] = useState('');
  const [slug, setSlug] = useState(query.where ?? '');
  const [from, setFrom] = useState(query.from ?? '');
  const [to, setTo] = useState(query.to ?? '');
  const [guests, setGuests] = useState(query.guests ?? 2);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fieldRef = useRef<HTMLDivElement>(null);
  // Set when a suggestion is chosen, so the resulting text change does not
  // immediately reopen the menu.
  const skipNextLookup = useRef(false);

  // Reflect the server's understanding of the URL back into the field.
  useEffect(() => {
    setSlug(query.where ?? '');
    setFrom(query.from ?? '');
    setTo(query.to ?? '');
    if (query.guests) setGuests(query.guests);
  }, [query.where, query.from, query.to, query.guests]);

  /*
   * Typeahead. Debounced so a fast typist makes one request rather than one
   * per keystroke, and aborted on the next keystroke so a slow earlier response
   * cannot land after a newer one.
   */
  useEffect(() => {
    if (skipNextLookup.current) {
      skipNextLookup.current = false;
      return;
    }

    const term = where.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/suggest?q=${encodeURIComponent(term)}`,
          { signal: controller.signal }
        );
        if (!response.ok) return;
        const data = (await response.json()) as { results: Suggestion[] };
        setSuggestions(data.results);
        setActiveIndex(-1);
        setIsOpen(data.results.length > 0);
      } catch {
        // An aborted or failed lookup simply offers no suggestions; the field
        // still works as free text.
      }
    }, 160);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [where]);

  // Clicking away closes the menu.
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (!fieldRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  function choose(suggestion: Suggestion) {
    skipNextLookup.current = true;
    setWhere(suggestion.name);
    setSlug(suggestion.slug);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => {
        const next = current + delta;
        if (next < 0) return suggestions.length - 1;
        if (next >= suggestions.length) return 0;
        return next;
      });
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      // Choose the highlighted suggestion instead of submitting.
      event.preventDefault();
      choose(suggestions[activeIndex]);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    // A free-typed place that matched nothing is dropped rather than guessed at.
    if (slug) params.set('where', slug);
    // The Destinations tab only ever shows the place field, so dates and
    // party size — even if left over from a prior Tours search — never ride
    // along into a plain destination lookup.
    if (tab === 'tours') {
      if (from) params.set('from', from);
      if (to && from && to > from) params.set('to', to);
      if (guests !== 2) params.set('guests', String(guests));
    }

    const search = params.toString();
    router.push(search ? `/?${search}#results` : '/#results', { scroll: true });
    setIsOpen(false);
  }

  const activeId = activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined;

  return (
    <div className="search-card">
      <div className="search-tabs" role="tablist" aria-label="Search type">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`search-tab${tab === t.key ? ' is-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            <t.icon width={24} height={24} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <form className="hero-search" onSubmit={handleSubmit} method="get" action="/">
        {/* Carries the resolved slug when the browser submits this natively. */}
        <input type="hidden" name="where" value={slug} />

        <div className="search-field search-field-where" ref={fieldRef}>
          <PinIcon />
          <div>
            <label htmlFor="searchWhere">Where to</label>
            <input
              id="searchWhere"
              type="text"
              value={where}
              placeholder="Bangkok, Phuket, Chiang Mai…"
              autoComplete="off"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              onChange={(event) => {
                setWhere(event.target.value);
                // Typing again invalidates a previously chosen destination.
                setSlug('');
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            />
          </div>

          {isOpen && (
            <ul className="search-suggestions" id={listId} role="listbox">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.slug}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={index === activeIndex ? 'is-active' : undefined}
                  // onMouseDown, not onClick: blur would close the menu first.
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(suggestion);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <strong>{suggestion.name}</strong>
                  <span>{suggestion.sub}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {tab === 'tours' && (
          <>
            <div className="search-divider" />

            <div className="search-field search-field-dates">
              <CalendarIcon />
              <div>
                <label htmlFor="searchFrom">Dates</label>
                <div className="date-pair">
                  <input
                    id="searchFrom"
                    type="date"
                    name="from"
                    value={from}
                    min={minDate}
                    aria-label="Arrive"
                    onChange={(event) => {
                      const value = event.target.value;
                      setFrom(value);
                      // A return date that is no longer after arrival is cleared
                      // rather than silently submitted and dropped by the server.
                      if (to && value && to <= value) setTo('');
                    }}
                  />
                  <span aria-hidden="true">→</span>
                  <input
                    id="searchTo"
                    type="date"
                    name="to"
                    value={to}
                    min={from || minDate}
                    aria-label="Return"
                    onChange={(event) => setTo(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="search-divider" />

            <div className="search-field search-field-guests">
              <GuestsIcon />
              <div>
                <label id={guestsLabelId}>Guests</label>
                {/*
                  * The two buttons are the control, so the count is carried by a
                  * hidden input rather than a visually-hidden number field: an
                  * off-screen input still takes keyboard focus, and .search-field
                  * input's width rule out-specifies the .sr-only utility, which sent
                  * a full-width field off the side of the page on small screens.
                  */}
                <input type="hidden" name="guests" value={guests} />
                <div className="guest-stepper" role="group" aria-labelledby={guestsLabelId}>
                  <button
                    type="button"
                    aria-label="Fewer guests"
                    disabled={guests <= GUESTS_MIN}
                    onClick={() => setGuests((n) => Math.max(GUESTS_MIN, n - 1))}
                  >
                    &minus;
                  </button>
                  <span aria-hidden="true">{guests}</span>
                  {/* Announces the new total, which the bare digit above would not. */}
                  <span className="sr-only" aria-live="polite">
                    {guests} {guests === 1 ? 'guest' : 'guests'}
                  </span>
                  <button
                    type="button"
                    aria-label="More guests"
                    disabled={guests >= GUESTS_MAX}
                    onClick={() => setGuests((n) => Math.min(GUESTS_MAX, n + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <button
          className="search-submit"
          type="submit"
          aria-label={tab === 'tours' ? 'Search tours' : 'Search destinations'}
        >
          <SearchIcon width={16} height={16} />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
