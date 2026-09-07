'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { GUESTS_MAX, GUESTS_MIN, today } from '@/lib/validation';
import { CalendarIcon, PinIcon } from './icons';

/** The three verticals the reference offers above its search card. */
const TABS = [
  { href: '/packages', label: 'Packages' },
  { href: '/flights', label: 'Flights' },
  { href: '/cars', label: 'Cars' },
];

/**
 * The themed landing header: a full-bleed photo with the page title over it,
 * and the search card overlapping its lower edge.
 *
 * The three "added" pills mirror the reference's bundle builder. Every package
 * on this page is a flight and a stay together, so those two read as fixed
 * state rather than toggles; adding a car is a real trip to /cars, which is
 * where this site actually rents them.
 */
export default function PackagesHero({
  defaultFrom,
  defaultTo,
  defaultDepart,
  defaultReturn,
  defaultTravelers,
  defaultFlightClass,
}: {
  defaultFrom?: string;
  defaultTo?: string;
  defaultDepart?: string;
  defaultReturn?: string;
  defaultTravelers?: string;
  defaultFlightClass?: string;
}) {
  const [depart, setDepart] = useState(defaultDepart ?? '');
  const minDate = today();

  return (
    <header className="lp-hero">
      <div className="lp-hero-media">
        <Image
          src="/Content/thailand-koh-samui-700-2.jpg"
          alt="The Big Buddha at Wat Phra Yai, Koh Samui"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="container lp-hero-inner">
        <h1>Thailand Vacation Packages</h1>

        <form className="lp-search" method="get" action="/packages">
          <div className="lp-search-tabs" role="tablist" aria-label="What to book">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                role="tab"
                aria-selected={tab.href === '/packages'}
                className={`lp-search-tab${tab.href === '/packages' ? ' is-active' : ''}`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="lp-search-body">
            <p className="lp-search-note">Choose two or more items and save on your trip:</p>

            <div className="lp-search-row">
              <div className="lp-search-pills">
                <span className="lp-pill is-on">Stay added</span>
                <span className="lp-pill is-on">Flight added</span>
                <Link href="/cars" className="lp-pill">
                  Add a car
                </Link>
              </div>

              <div className="lp-search-selects">
                <label className="lp-select">
                  <span className="sr-only">Travelers</span>
                  <select name="travelers" defaultValue={defaultTravelers || '2'}>
                    {Array.from({ length: GUESTS_MAX - GUESTS_MIN + 1 }, (_, i) => i + GUESTS_MIN).map(
                      (count) => (
                        <option key={count} value={count}>
                          1 room, {count} {count === 1 ? 'traveler' : 'travelers'}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="lp-select">
                  <span className="sr-only">Flight class</span>
                  <select name="flightClass" defaultValue={defaultFlightClass || 'Economy'}>
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="lp-search-fields">
              <div className="lp-field">
                <PinIcon width={18} height={18} />
                <div>
                  <label htmlFor="lpFrom">Leaving from</label>
                  <input
                    id="lpFrom"
                    type="text"
                    name="from"
                    placeholder="Bangkok (BKK)"
                    defaultValue={defaultFrom}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="lp-field">
                <PinIcon width={18} height={18} />
                <div>
                  <label htmlFor="lpTo">Going to</label>
                  <input
                    id="lpTo"
                    type="text"
                    name="to"
                    placeholder="Phuket, Thailand"
                    defaultValue={defaultTo}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="lp-field">
                <CalendarIcon width={18} height={18} />
                <div>
                  <label htmlFor="lpDepart">Departing</label>
                  <input
                    id="lpDepart"
                    type="date"
                    name="depart"
                    min={minDate}
                    value={depart}
                    onChange={(event) => setDepart(event.target.value)}
                  />
                </div>
              </div>

              <div className="lp-field">
                <CalendarIcon width={18} height={18} />
                <div>
                  <label htmlFor="lpReturn">Returning</label>
                  <input
                    id="lpReturn"
                    type="date"
                    name="return"
                    min={depart || minDate}
                    defaultValue={defaultReturn}
                  />
                </div>
              </div>
            </div>

            <button className="btn btn-primary lp-search-submit" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
