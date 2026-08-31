'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react';
import { toggleSavedDestination } from '@/app/actions';

/*
 * Saved destinations, shared by the heart on each card and the count in the
 * navbar so the two can never disagree.
 *
 * The heart flips immediately via useOptimistic and only then waits on the
 * server, which is what makes saving feel instant on a slow connection. If the
 * request fails the optimistic value is dropped and the confirmed list shows
 * through again, so a failed save never looks like a successful one.
 */

type FavoritesContextValue = {
  saved: string[];
  isSaved: (slug: string) => boolean;
  toggle: (slug: string) => void;
  error: string | null;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>');
  }
  return context;
}

export default function FavoritesProvider({
  initial,
  children,
}: {
  initial: string[];
  children: React.ReactNode;
}) {
  const [confirmed, setConfirmed] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [saved, applyOptimistic] = useOptimistic(
    confirmed,
    (current: string[], slug: string) =>
      current.includes(slug)
        ? current.filter((entry) => entry !== slug)
        : [...current, slug]
  );

  /*
   * A search re-renders the page on the server with a fresh list, but this
   * provider keeps its position in the tree and so keeps its state. Re-seed
   * when the server's answer actually differs, comparing by value — the array
   * identity changes on every render.
   */
  const initialKey = initial.join(',');
  const lastSeeded = useRef(initialKey);
  useEffect(() => {
    if (lastSeeded.current === initialKey) return;
    lastSeeded.current = initialKey;
    setConfirmed(initial);
  }, [initial, initialKey]);

  const toggle = useCallback((slug: string) => {
    setError(null);
    startTransition(async () => {
      applyOptimistic(slug);
      const result = await toggleSavedDestination(slug);
      if (result.ok) {
        setConfirmed(result.value);
      } else {
        setError(result.errors.form ?? 'Could not save that just now.');
      }
    });
  }, [applyOptimistic]);

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  return (
    <FavoritesContext.Provider value={{ saved, isSaved, toggle, error }}>
      {children}
    </FavoritesContext.Provider>
  );
}
