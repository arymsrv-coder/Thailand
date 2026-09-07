# Amara Siam

A Thailand travel booking front end built with Next.js 16 (App Router),
React 19 and TypeScript. No UI framework and no CSS-in-JS — one stylesheet
and plain components.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests
npm run typecheck  # tsc --noEmit
npm run build      # static export into out/
```

## Deploying

The site is a **static export**: `npm run build` prerenders every route into
`out/`, which any file host can serve. `.github/workflows/pages.yml` builds it
on every push to `main` and publishes it to GitHub Pages — enable Pages for
the repository with **Settings → Pages → Source: GitHub Actions** once, and
after that a push is a deploy.

`NEXT_PUBLIC_BASE_PATH` decides the prefix every URL is built with. The
workflow sets it to `/<repo>`, which is where a project Pages site lives. Set
it to an empty string for a custom domain or a user/org Pages site, where the
site sits at the root.

### What being static means

There is no server, so there is nothing to run server code on. Three things
work differently as a result, and all three are deliberate:

- **Search and filtering happen in the browser.** Every route ships as
  finished HTML, then reads the query string on the client and filters the
  bundled catalogue (`lib/catalog.ts`). The filtering code is unchanged — it
  was always pure functions over static data.
- **Forms hand off to email.** `lib/forms.ts` validates a submission exactly
  as before, then returns a prefilled `mailto:` instead of storing anything,
  because there is nowhere to store it. Wiring the site to a form service
  (Formspree, Basin, a Cloudflare Worker) means replacing the body of those
  three functions and nothing else.
- **Saved destinations live in `localStorage`.** Per browser, per device, and
  gone if the visitor clears site data.

Routes that read the query string (`/`, `/flights`, `/cars`, `/packages`,
`/cruises`, `/things-to-do`) render after their JavaScript loads rather than
arriving as content in the HTML — the cost of URL-driven filtering with no
server to do it. Tour detail pages are fully prerendered.

### Images

`next/image`'s optimizer is a server, so it is replaced by
`lib/imageLoader.ts`, which serves the originals from `public/` and adds the
base path (`basePath` does not reach image `src` attributes). The photos are
sized for the web already — 69 files, 126 KB on average. `next/image` still
handles lazy loading and reserves each image's space so the page does not
reflow as they arrive.

### Moving back to a server

Nothing here is one-way. Drop `output: 'export'` from `next.config.ts`, and
the client components under `components/pages/` can go back to being server
components that take `searchParams` — they were mechanically converted and the
page logic is untouched.
