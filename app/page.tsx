import Contact from '@/components/Contact';
import Destinations from '@/components/Destinations';
import ExperienceCards from '@/components/ExperienceCards';
import Faq from '@/components/Faq';
import FavoritesProvider from '@/components/FavoritesProvider';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HotelsSection from '@/components/HotelsSection';
import MainBookingCards from '@/components/MainBookingCards';
import Navbar from '@/components/Navbar';
import PromoStrip from '@/components/PromoStrip';
import Sidebar from '@/components/Sidebar';
import Tours from '@/components/Tours';
import BackToTop from '@/components/motion/BackToTop';
import EntryCurtain from '@/components/motion/EntryCurtain';
import SmoothScroll from '@/components/motion/SmoothScroll';
import { searchDestinations, searchTours } from '@/lib/catalog';
import { tours } from '@/lib/tours';
import { validateSearch } from '@/lib/validation';
import { readSavedDestinations } from './actions';

/*
 * The whole site, rendered on the server from two inputs: the search in the
 * URL and the visitor's saved destinations from their cookie.
 *
 * Filtering happens here rather than in the browser, so the first paint is
 * already the answer — and a shared or reloaded URL renders the same page.
 */

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  // Anything unrecognised in the URL is dropped rather than rejected, so a
  // hand-edited query string still renders a page.
  const query = validateSearch(await searchParams);

  const matchedTours = searchTours(query);
  const matchedDestinations = searchDestinations(query);
  const saved = await readSavedDestinations();

  return (
    <SmoothScroll>
      <FavoritesProvider initial={saved}>
        <EntryCurtain />

        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <Navbar />

        <main id="main">
          <Hero query={query} />

          {/*
           * The sidebar rides alongside everything below the cinematic hero
           * (which stays full-bleed on purpose) — the same "category rail
           * beside the page" shape a big travel site's homepage uses, sized
           * down to what this one-vertical site actually has.
           */}
          <div className="home-layout">
            <Sidebar />
            <div className="home-content">
              <PromoStrip />
              <MainBookingCards />
              <Destinations
                destinations={matchedDestinations}
                query={query}
                tourCount={matchedTours.length}
              />
              <HotelsSection />
              <ExperienceCards />
              <Tours tours={matchedTours} query={query} totalCount={tours.length} />
              <Faq />
              <Contact />
            </div>
          </div>
        </main>

        <Footer />

        <BackToTop />
      </FavoritesProvider>
    </SmoothScroll>
  );
}
