# Amara Siam

A Thailand travel booking front end built with Next.js 16 (App Router),
React 19 and TypeScript. No UI framework and no CSS-in-JS — one stylesheet
and plain server/client components.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## Deploying

This is a **server-rendered** app, not a static site. Every page reads its
search parameters at request time, the forms are Server Actions, and there is
an API route behind the destination typeahead. It therefore needs a host that
runs Node — it cannot be served by GitHub Pages or any other static file host,
which is why such a host returns 404: the build produces no `index.html`.

Any Next.js-capable host works. Point it at this repo; the defaults are
correct, so no build configuration is needed:

| | |
|---|---|
| Build command | `npm run build` |
| Output | `.next` (handled by the host's Next.js preset) |
| Node | 20.9 or newer (pinned in `package.json`) |

### Environment

See `.env.example`. One variable matters in production:

- **`AMARA_SESSION_SECRET`** — signs the visitor cookie behind saved
  destinations. Generate one with:

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
  ```

  Without it the app generates a secret into `.data/` and logs a warning; that
  secret does not survive a restart and is not shared between instances, so
  saved destinations reset.

### Where bookings are stored

`lib/server/store.ts` keeps bookings, contact messages and favourites as JSON
files under `.data/` (override with `AMARA_DATA_DIR`). That choice decides
which hosts work as-is:

- **Serverless** (Vercel, Netlify Functions) — the filesystem is read-only
  apart from `/tmp`, and `/tmp` is neither persistent nor shared. The site
  renders perfectly and forms will submit, but nothing is retained. Fine for a
  demo; not for real submissions.
- **A container or VM** (Railway, Render, Fly.io, a plain VPS) — attach a
  volume and set `AMARA_DATA_DIR` to it, and everything persists.

To move to a real database, rewrite `lib/server/store.ts` alone. It is
deliberately the only module that knows data lives in files; the repositories
above it expose domain operations and do not care.
