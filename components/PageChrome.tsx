import FavoritesProvider from './FavoritesProvider';
import Footer from './Footer';
import Navbar from './Navbar';

/**
 * Shared page frame for routes outside the homepage (currently the Flights /
 * Cars / Packages / Cruises placeholders): the same navbar, footer and saved-
 * destinations context the homepage renders, without the hero/search-results
 * layout that only makes sense there.
 */
export default function PageChrome({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar alwaysSolid />

      <main id="main">{children}</main>

      <Footer />
    </FavoritesProvider>
  );
}
