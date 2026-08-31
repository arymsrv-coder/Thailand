import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

/*
 * The original page pulled these from the Google Fonts CDN with a <link>.
 * next/font self-hosts them instead — no external request, no layout shift —
 * and exposes them as the CSS variables globals.css already reads.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-fraunces',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Amara Siam — Thailand, Quietly Redefined',
  description:
    'Curated Thailand journeys — temples, islands, and cities — booked simply.',
};

/*
 * Runs before first paint, so elements that are about to animate in start
 * hidden rather than flashing into view and then disappearing.
 *
 * Two safeguards make this safe to do in <head>. It only arms when the visitor
 * has not asked for reduced motion; and if React has not signalled that it is
 * running within a few seconds, it un-hides everything — so a bundle that fails
 * to load leaves a plain, fully visible page rather than a blank one.
 */
const MOTION_BOOTSTRAP = `
try {
  var root = document.documentElement;
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    root.classList.add('motion-ready');
    setTimeout(function () {
      if (!root.classList.contains('motion-active')) {
        root.classList.remove('motion-ready');
      }
    }, 4000);
  }
} catch (error) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable}`}
      /* MOTION_BOOTSTRAP below adds a class before React hydrates, so the
         server and client markup differ here by design. */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
