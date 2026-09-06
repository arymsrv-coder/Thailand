import FavoritesProvider from './FavoritesProvider';
import Footer from './Footer';
import Navbar from './Navbar';
import { readSavedDestinations } from '@/app/actions';

/**
 * Shared page frame for routes outside the homepage (currently the Flights /
 * Cars / Packages / Cruises placeholders): the same navbar, footer and saved-
 * destinations context the homepage renders, without the hero/search-results
 * layout that only makes sense there.
 */
export default async function PageChrome({ children }: { children: React.ReactNode }) {
  const saved = await readSavedDestinations();

  return (
    <FavoritesProvider initial={saved}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar alwaysSolid />

      <main id="main">{children}</main>

      <Footer />
    </FavoritesProvider>
  );
}
