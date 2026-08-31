# Legacy static site

The original hand-written version of this site, kept for reference after the
Next.js port.

- `index.html` — the single-page markup (now `app/page.tsx` + `components/`)
- `js/main.js` — the vanilla DOM wiring (now React state in the components)

The stylesheet these files used has moved to `app/globals.css` and the photos to
`public/Content` / `public/assets`, so opening `legacy/index.html` directly will
render unstyled and without images. Everything here is safe to delete — it lives
in git history either way.
