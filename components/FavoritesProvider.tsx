'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/*
 * Saved destinations, shared by the heart on each card and anything else that
 * reads the list, so the two can never disagree.
 *
 * This is a static build with no server behind it, so the list lives in the
 * visitor's own browser. That means it is per-device and per-browser rather
 * than per-account, and it is gone if they clear site data — which is the
 * honest limit of a site with nowhere to persist anything.
 */

const STORAGE_KEY = 'amara-saved-destinations';

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

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    // Storage is visitor-writable, so never trust its shape.
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

export default function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  /*
   * Read after mount, not in the initial state. The static HTML is built with
   * an empty list, so reading storage during the first render would make the
   * client disagree with it and React would report a hydration mismatch.
   */
  useEffect(() => {
    setSaved(read());
  }, []);

  const toggle = useCallback((slug: string) => {
    setError(null);
    setSaved((current) => {
      const next = current.includes(slug)
        ? current.filter((entry) => entry !== slug)
        : [...current, slug];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Private browsing and "block site data" both throw here. The list
        // still works for this visit; it just will not be remembered.
        setError('Saved for this visit only — your browser is blocking storage.');
      }
      return next;
    });
  }, []);

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  return (
    <FavoritesContext.Provider value={{ saved, isSaved, toggle, error }}>
      {children}
    </FavoritesContext.Provider>
  );
}
