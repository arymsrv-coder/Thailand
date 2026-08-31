# Amara Siam — Backend Design

**Date:** 2026-08-26
**Status:** Implemented

## Problem

The site is a Next.js 16 single page with no backend. `lib/*.ts` are static
arrays, the booking modal's submit handler sets a boolean, the hero search only
scrolls, the save heart lives in `useState`, and "Contact Us" links to a footer
that contains no form. Several controls therefore lead nowhere or somewhere
wrong.

## Goals

1. Persist booking requests, contact messages, and saved destinations.
2. Make the hero search really filter destinations and tours.
3. Wire every interactive control to a correct destination.
4. Keep the result responsive and accessible at the existing breakpoints.

## Non-goals

- Admin dashboard. Submissions are read from `.data/*.json`.
- Outbound email. Bookings are stored and logged; email can be layered behind
  the same repository interface later.
- Accounts and passwords. Visitors are identified by an anonymous signed cookie.

## Architecture

Hybrid: Server Actions for mutations, one Route Handler for typeahead, URL
search params for filter state. Both entry points import the same pure
validation module so rules exist in one place.

```
lib/
  validation.ts        pure rules; shared by actions, route handler, tests
  catalog.ts           pure queries: searchDestinations, searchTours, suggest
  server/
    store.ts           atomic JSON collection store, server-only
    signing.ts         pure HMAC sign/verify for the visitor id
    session.ts         cookie plumbing over signing.ts
    reference.ts       booking reference codes
    bookings.ts        createBooking / listBookings
    messages.ts        createMessage
    favorites.ts       getFavorites / toggleFavorite
app/
  actions.ts           'use server': submitBooking, submitContact,
                       toggleSavedDestination, readSavedDestinations
  api/suggest/route.ts GET typeahead
  page.tsx             Server Component; awaits searchParams; filters server-side
components/
  FavoritesProvider    client context; optimistic saves shared with the navbar
  HeroSearch           typeahead, date range, guests; writes the URL
  BookingForm          the form and its confirmation, keyed per modal open
  Contact              the contact form
  SearchSummary        result count, active filters, clear
```

Signing is split from the cookie plumbing because `next/headers` only resolves
inside a request; keeping the crypto pure makes it directly testable.

### Persistence

A JSON collection store under `.data/` (gitignored). Writes go to a temp file
and are then `rename`d over the target, so a crash mid-write cannot leave a
truncated file. Concurrent writes to one collection are serialised through an
in-process promise chain per file. Reads tolerate a missing file by returning
an empty collection.

The repository modules (`bookings`, `messages`, `favorites`) are the only
modules the application imports. Replacing the JSON store with a database
touches `lib/server/` alone.

### Sessions

An anonymous visitor id in a cookie, signed HMAC-SHA256 with a secret from
`AMARA_SESSION_SECRET`, falling back in development to a generated secret
persisted at `.data/.secret`. Cookies cannot be set during a render, so the
render path only reads the cookie; the first favourite toggle (a Server Action)
creates it. Tampered or unsigned cookies are treated as absent.

### Data flow

`app/page.tsx` awaits `searchParams`, calls `catalog.ts` to filter, and passes
the results plus the visitor's saved slugs into the tree. A client
`FavoritesProvider` seeds from that server state and uses `useOptimistic`, so
the heart and the navbar saved-count update instantly and reconcile against the
action, reverting if it fails. Forms use `useActionState` for pending, field
error, and success states.

### Search

Query keys: `where` (destination slug), `from`, `to` (ISO dates), `guests`
(1-12). The hero form is a Client Component that pushes the query string with
`router.push`; without JavaScript the same form still submits as a native GET,
so the filtered page renders regardless.

When a search is active the page renders a results header with a count and a
"Clear search" reset, and an empty state when nothing matches.

## Data model changes

`Tour` gains `destinationSlug`, `maxGroupSize` and `openMonths`. The existing
display strings stay.

`destinationSlug` makes tour-to-destination filtering exact — `location:
"Phang Nga"` matches no destination, so a naive string match would silently
drop that tour. `maxGroupSize` and `openMonths` are what give the guests and
dates pickers something to filter on; without them those two controls would
write to the URL and change nothing. Andaman boat trips carry a November–April
season, matching the southwest monsoon.

The numeric price fields the first draft proposed were dropped: nothing in
scope filters by price, so they would have been unused fields duplicating the
display strings.

## Control audit

| Control | Current | Target |
| --- | --- | --- |
| Hero search submit | scrolls to `#destinations` | pushes query, renders filtered results |
| Hero dates field | `readOnly` text | two `type="date"` inputs, validated |
| Guest stepper | local state | submitted as `guests` |
| "Where to" | plain input | autocomplete backed by `/api/suggest` |
| Contact Us (nav, footer) | `#contact` → footer block | new Contact section with a persisted form |
| Listing heart | `useState` | persisted per visitor; navbar count |
| "See {name} tours →" | `#tours` | `/?where=<slug>#tours` |
| Book Now → submit | sets a boolean | validated action, stored, reference code |
| Instagram (x3) | `instagram.com` | `instagram.com/amarasiam` |

## Validation rules

- Name: 2-80 characters after trimming.
- Email: single `@`, a dot in the domain, no whitespace, max 254 characters.
- Date: ISO `YYYY-MM-DD`, a real calendar date, not in the past.
- Date range: `to` strictly after `from` when both are present.
- Guests: integer 1-12.
- Message: 10-2000 characters.
- Tour id: must exist in the catalog.

Validation returns a field-keyed error map rather than throwing, so forms can
render errors inline. Every Server Action re-validates on the server; client
constraints are a convenience only.

## Error handling

Actions never throw to the user. They return
`{ ok: false, errors: Record<string, string> }` on invalid input and
`{ ok: false, errors: { form: "..." } }` on a store failure, which the forms
render in an `aria-live` region. Store failures are logged server-side with the
underlying error.

## Testing

`node --test` runs `.ts` files natively on Node 22.22, so no test toolchain is
added. A resolver hook (`scripts/ts-resolve.mjs`, loaded only by `npm test`)
teaches the runner the project's two bundler conventions — extensionless
relative imports and the `@/` alias — and substitutes `server-only` and
`next/headers`, neither of which resolves outside a bundler or a live request.
The substitutions never reach `next build`.

- `validation.test.ts` — boundaries of every rule above.
- `catalog.test.ts` — filtering by destination, dates, guests; empty results;
  every tour resolving to a real destination.
- `store.test.ts` — round-trip, missing-file default, concurrent appends not
  losing writes, temp file cleanup.
- `signing.test.ts` — signature round-trip, tampered value rejected.
- `reference.test.ts` — code shape, no ambiguous characters, uniqueness.
- `favorites.test.ts` — toggling, visitor isolation, concurrent writes.
- `actions.integration.test.ts` — the actions end to end, real FormData in and
  real records on disk out, covering the form-field wiring the unit tests
  cannot reach.

Then `next build` must pass, followed by a browser walkthrough of every control
in the audit table, including at 420px.

### Outcome

116 tests pass; typecheck and `next build` are clean. The browser walkthrough
was driven headlessly (the Chrome extension was not connected) and covers all
35 checks: typeahead including keyboard selection, search writing and clearing
the URL, saved destinations persisting across a reload, booking validation and
confirmation codes, a fresh form on each modal open, the contact form, and no
horizontal overflow at 360-1440px. The search was also confirmed to filter
correctly with JavaScript disabled.

---

# Addendum — Motion system (2026-08-26)

Ported the *motion vocabulary* of studioaurora.io, not its visual identity:
that site is dark and agency-minimal, this one is warm and editorial.

Measured on the reference site: Lenis for smooth scroll (no GSAP, no
ScrollTrigger, no Framer Motion in its bundles), headings split into per-word
spans rising from `translateY(20px)`, blocks fading up from `16px`, a
full-screen entry overlay, and a fixed right-hand section rail.

## Built

`components/motion/` — `SmoothScroll` (one Lenis instance plus one shared
scroll-subscriber list), `Reveal`, `SplitText`, `Parallax`, `EntryCurtain`,
`SectionRail`, `BackToTop`.

## The governing rule

**Content is never allowed to depend on JavaScript or animation to become
visible.** Hidden starting states live only under `.motion-ready`, a class an
inline script in `<head>` sets before first paint and only when the visitor has
not asked for reduced motion. That script also removes it again if React has
not signalled life within four seconds, so a bundle that fails to load leaves a
plain, fully readable page. Verified with JavaScript disabled and under
`prefers-reduced-motion: reduce`.

## Bugs found and fixed while building

- **Curtain froze the page.** It read sessionStorage inside its effect, so
  React's development double-invoke saw the flag its own first pass had written,
  bailed out, and left a curtain that never lifted over a page whose scroll it
  had stopped. Now the decision is cached at module scope and the lift is a CSS
  animation ended by its own `animationend` — no timers to fall out of step.
- **Curtain ignored reduced motion.** It read the preference from context,
  which arrives a render late, so it began playing for exactly the visitor who
  asked it not to. Now read synchronously from `matchMedia`.
- **Headings ran together** ("Entirejourney,"). The word separator sat inside
  `.split-word`, whose `overflow: hidden` swallowed it. Moved between spans.
- **Anchor offset double-counted.** The stylesheet already sets
  `scroll-margin-top: var(--nav-height)` on sections and Lenis honours it, so
  the extra offset dropped every section ~90px too low. Removed.
- **Hydration mismatch** on `<html>`, since the bootstrap script mutates its
  class list before hydration. Resolved with `suppressHydrationWarning`.
- **Date pair overflowed its column** and covered the guests stepper: the flex
  wrapper lacked `min-width: 0`, so it was sized by the date inputs' intrinsic
  width. Fixed, and the bar widened to 880px with a larger dates column.

## Verification

31 browser checks: curtain lifts and releases scroll, inertia after the wheel
stops, reveals fire on entry, parallax tracks scroll without ever exposing a
frame edge, rail navigates and tracks, anchors land flush under the navbar,
the modal holds the page still and releases it, and — critically — nothing is
hidden under reduced motion or with JavaScript off. Plus the 35 backend checks
and 116 unit/integration tests still passing, and no layout overflow at
360–1440px.
