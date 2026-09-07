'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFavorites } from './FavoritesProvider';
import {
  BedIcon,
  CarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  LightbulbIcon,
  MailIcon,
  MapIcon,
  PeopleIcon,
  PinIcon,
  PlaneIcon,
  QuestionIcon,
  ShipIcon,
  SparkleIcon,
  SuitcaseIcon,
  TagIcon,
} from './icons';

/*
 * The left-hand category rail, grouped the way a full multi-vertical travel
 * site organises its sidebar. Each item below is explicit about whether it
 * goes somewhere real: `href` set means a live link; left unset, the row
 * renders inert with a "Soon" tag rather than as a link that quietly does
 * nothing.
 *
 * Flights, Cars, Flight + Hotel (packages) and Cruises are mock verticals —
 * fixed sample listings and a "request to book" flow with no real inventory
 * behind them — but they are real pages, so they link out like everything
 * else here.
 *
 * Private Tours and Group Tours point at the one tours section that actually
 * exists: this catalogue's temple walks and island-hopping trips genuinely
 * are the "private" kind, and its scheduled day trips (Ayutthaya, market
 * runs) genuinely are the "group" kind.
 *
 * Hotels & Homes is real too, in the sense that its #hotels section holds
 * twelve actual named Thailand hotels (see CategoryCards) — this site still
 * doesn't book any of them, but "browse real hotels, link out to book
 * elsewhere" is a genuine destination.
 */
type Item = {
  label: string;
  icon: typeof PinIcon;
  href?: string;
  badge?: 'new';
};

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: 'Main booking',
    items: [
      { label: 'Hotels & Homes', icon: BedIcon, href: '/#hotels' },
      { label: 'Flights', icon: PlaneIcon, href: '/flights' },
      { label: 'Cars', icon: CarIcon, href: '/cars' },
      { label: 'Flight + Hotel', icon: SuitcaseIcon, href: '/packages' },
    ],
  },
  {
    title: 'Tours & experiences',
    items: [
      { label: 'Private Tours', icon: PinIcon, href: '/#tours' },
      { label: 'Group Tours', icon: PeopleIcon, href: '/#tours' },
      { label: 'Cruises', icon: ShipIcon, href: '/cruises' },
    ],
  },
  {
    title: 'Tools & account',
    items: [
      { label: 'Planner', icon: SparkleIcon, href: '/#top', badge: 'new' },
      { label: 'Travel Inspiration', icon: LightbulbIcon, href: '/#destinations' },
      { label: 'Interactive Map', icon: MapIcon, href: '/#map' },
      { label: 'Deals', icon: TagIcon, href: '/#tours' },
      { label: 'Saved', icon: HeartIcon, href: '/#destinations' },
      { label: 'Good to Know', icon: QuestionIcon, href: '/#faq' },
      { label: 'Contact Us', icon: MailIcon, href: '/#contact' },
    ],
  },
];

const STORAGE_KEY = 'amara:sidebar-collapsed';

export default function Sidebar() {
  const { saved } = useFavorites();

  // Starts expanded on the server and every first client render, then reads
  // the visitor's last choice — so there is one render's worth of layout
  // shift on load rather than a server/client markup mismatch.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      // Storage can be unavailable (private browsing, disabled cookies); the
      // sidebar just stays expanded for the session.
    }
  }, []);

  function toggle() {
    setCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        // Nothing to persist to; the choice just won't survive a reload.
      }
      return next;
    });
  }

  return (
    <aside
      className={`sidebar${collapsed ? ' is-collapsed' : ''}`}
      aria-label="Browse Amara Siam"
    >
      <button
        type="button"
        className="sidebar-toggle"
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={toggle}
      >
        {collapsed ? <ChevronRightIcon width={15} height={15} /> : <ChevronLeftIcon width={15} height={15} />}
      </button>

      {/*
       * data-lenis-prevent: the list can run taller than the viewport, so it
       * scrolls internally rather than growing the sticky panel past the
       * screen. Without this attribute Lenis's global wheel handler (see
       * SmoothScroll) would hijack that scroll for the page instead of the
       * list underneath the cursor.
       */}
      <nav className="sidebar-scroll" data-lenis-prevent>
        {GROUPS.map((group, groupIndex) => (
          <div className="sidebar-group" key={group.title}>
            {!collapsed && <p className="sidebar-group-label">{group.title}</p>}
            <ul className="sidebar-list">
              {group.items.map((item) => {
                // The one item that reads live app state rather than the
                // static list — everything else here is just a label.
                const savedCount = item.label === 'Saved' ? saved.length : 0;
                const content = (
                  <>
                    <item.icon width={22} height={22} />
                    <span className={collapsed ? 'sr-only' : undefined}>{item.label}</span>
                    {!collapsed && item.badge === 'new' && (
                      <em className="sidebar-badge sidebar-badge-new">New</em>
                    )}
                    {!collapsed && !item.href && (
                      <em className="sidebar-badge sidebar-badge-soon">Soon</em>
                    )}
                    {!collapsed && savedCount > 0 && (
                      <em className="sidebar-count">{savedCount}</em>
                    )}
                  </>
                );

                if (!item.href) {
                  return (
                    <li key={item.label}>
                      <span
                        className="sidebar-item is-disabled"
                        aria-disabled="true"
                        title={collapsed ? `${item.label} — coming soon` : undefined}
                      >
                        {content}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <Link className="sidebar-item" href={item.href} title={collapsed ? item.label : undefined}>
                      {content}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {groupIndex < GROUPS.length - 1 && <div className="sidebar-divider" />}
          </div>
        ))}
      </nav>
    </aside>
  );
}
