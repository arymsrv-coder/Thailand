import { NextResponse } from 'next/server';
import { suggestDestinations } from '@/lib/catalog';

/*
 * Typeahead for the hero's "Where to" field.
 *
 * A Route Handler rather than a Server Action: actions are POST and are
 * dispatched one at a time, which is exactly wrong for a per-keystroke lookup.
 * The response is derived from a static catalogue, so it is cacheable, but it
 * varies by query string and is small enough not to be worth revalidating.
 */

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get('q') ?? '';

  const results = suggestDestinations(term).map((destination) => ({
    slug: destination.slug,
    name: destination.name,
    sub: destination.sub,
  }));

  return NextResponse.json(
    { results },
    { headers: { 'Cache-Control': 'public, max-age=300' } }
  );
}
