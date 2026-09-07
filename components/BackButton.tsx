'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from './icons';

/**
 * "Back" for the results pages.
 *
 * Rendered as a real link to `fallbackHref`, so it still works with
 * JavaScript unavailable and shows a sensible target on hover. When there is
 * history to step back through, the click is intercepted and the router goes
 * back instead — which restores the previous page's scroll position and any
 * search the visitor had typed. Opened cold in a fresh tab there is no history
 * to return to, so that case follows the link home.
 */
export default function BackButton({
  fallbackHref = '/',
  label = 'Back',
}: {
  fallbackHref?: string;
  label?: string;
}) {
  const router = useRouter();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Let the browser handle modified clicks (new tab, download, etc.).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    // `document.referrer` is not usable here: it is a property of the loaded
    // document, so it stays empty across client-side navigations and would
    // make this fall through to the fallback link every time within the app.
    if (window.history.length > 1) {
      event.preventDefault();
      router.back();
    }
  }

  return (
    <Link href={fallbackHref} className="back-button" onClick={handleClick}>
      <ChevronLeftIcon width={16} height={16} />
      <span>{label}</span>
    </Link>
  );
}
