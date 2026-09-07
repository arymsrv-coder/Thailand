import { asset } from './assetPath';

/*
 * The image loader for the static export.
 *
 * `basePath` rewrites the framework's own asset URLs and every `<Link>`, but
 * it does not touch the `src` you hand to `next/image` — with no optimizer in
 * front of it, that string is used exactly as written, so `/Content/wat-pho.jpg`
 * asks github.io for `/Content/wat-pho.jpg` and gets a 404 rather than
 * `/Thailand/Content/wat-pho.jpg`.
 *
 * Prefixing here rather than at every call site keeps the photo paths in the
 * data files as plain public paths, and means moving the site to a root domain
 * is a change to one environment variable.
 *
 * There is no resizing to do: Pages serves files, so every width resolves to
 * the same file. `next/image` still does the useful part — intrinsic sizing,
 * lazy loading and the aspect ratio that stops the page reflowing as photos
 * arrive.
 */
export default function imageLoader({ src }: { src: string }): string {
  return asset(src);
}
