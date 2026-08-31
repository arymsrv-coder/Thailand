import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { destinations } from './destinations';
import { tours } from './tours';
import {
  searchTours,
  searchDestinations,
  suggestDestinations,
  monthsInRange,
  findTour,
  findDestination,
  isSearchActive,
  toSearchParams,
} from './catalog';

describe('data integrity', () => {
  test('every tour points at a real destination', () => {
    const slugs = new Set(destinations.map((d) => d.slug));
    for (const tour of tours) {
      assert.ok(
        slugs.has(tour.destinationSlug),
        `${tour.id} -> ${tour.destinationSlug} is not a destination`
      );
    }
  });

  test('every tour has a sane capacity and season', () => {
    for (const tour of tours) {
      assert.ok(tour.maxGroupSize >= 1, `${tour.id} capacity`);
      assert.ok(tour.openMonths.length > 0, `${tour.id} season`);
      for (const month of tour.openMonths) {
        assert.ok(month >= 1 && month <= 12, `${tour.id} month ${month}`);
      }
    }
  });

  test('ids and slugs are unique', () => {
    assert.equal(new Set(tours.map((t) => t.id)).size, tours.length);
    assert.equal(new Set(destinations.map((d) => d.slug)).size, destinations.length);
  });
});

describe('monthsInRange', () => {
  test('a single day is one month', () => {
    assert.deepEqual(monthsInRange('2026-09-10', undefined), [9]);
  });

  test('a range within a month is one month', () => {
    assert.deepEqual(monthsInRange('2026-09-10', '2026-09-20'), [9]);
  });

  test('a range spanning months lists each', () => {
    assert.deepEqual(monthsInRange('2026-09-28', '2026-11-03'), [9, 10, 11]);
  });

  test('a range crossing a year boundary wraps', () => {
    assert.deepEqual(monthsInRange('2026-12-20', '2027-02-05'), [12, 1, 2]);
  });

  test('no dates means no constraint', () => {
    assert.deepEqual(monthsInRange(undefined, undefined), []);
  });

  test('a range over a year covers every month once', () => {
    assert.deepEqual(monthsInRange('2026-01-01', '2027-06-01').sort((a, b) => a - b),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
});

describe('searchTours', () => {
  test('an empty query returns everything', () => {
    assert.equal(searchTours({}).length, tours.length);
  });

  test('filters by destination', () => {
    const result = searchTours({ where: 'bangkok' });
    assert.ok(result.length > 0);
    assert.ok(result.every((t) => t.destinationSlug === 'bangkok'));
  });

  test('a destination with no tours returns none', () => {
    assert.deepEqual(searchTours({ where: 'sukhothai' }), []);
  });

  test('filters out tours that cannot take the party size', () => {
    const result = searchTours({ guests: 12 });
    assert.ok(result.every((t) => t.maxGroupSize >= 12));
    assert.ok(result.length < tours.length, 'expected some tours excluded');
  });

  test('one guest excludes nothing on capacity', () => {
    assert.equal(searchTours({ guests: 1 }).length, tours.length);
  });

  test('excludes tours closed in the requested month', () => {
    // July is inside the southwest monsoon, when Andaman boat trips stop.
    const july = searchTours({ from: '2027-07-01', to: '2027-07-08' });
    assert.ok(july.every((t) => t.openMonths.includes(7)));
    assert.ok(july.length < tours.length, 'expected monsoon closures');
  });

  test('keeps a tour open in any month of a spanning range', () => {
    const result = searchTours({ from: '2027-04-25', to: '2027-05-05' });
    const ids = result.map((t) => t.id);
    assert.ok(
      ids.includes('maya-bay-phi-phi-islands-speedboat'),
      'a tour open in April should survive an April-May range'
    );
  });

  test('combines filters', () => {
    const result = searchTours({ where: 'chiang-mai', guests: 8 });
    assert.ok(result.every((t) => t.destinationSlug === 'chiang-mai' && t.maxGroupSize >= 8));
  });

  test('an over-constrained query returns nothing rather than throwing', () => {
    assert.deepEqual(searchTours({ where: 'bangkok', guests: 12, from: '2027-07-01' }).length >= 0, true);
    assert.deepEqual(searchTours({ where: 'sukhothai', guests: 12 }), []);
  });
});

describe('searchDestinations', () => {
  test('an empty query returns everything in order', () => {
    assert.deepEqual(
      searchDestinations({}).map((d) => d.slug),
      destinations.map((d) => d.slug)
    );
  });

  test('a destination filter narrows to that one', () => {
    assert.deepEqual(searchDestinations({ where: 'krabi' }).map((d) => d.slug), ['krabi']);
  });

  test('date and guest filters drop destinations left with no tours', () => {
    const result = searchDestinations({ guests: 12 });
    for (const destination of result) {
      assert.ok(
        searchTours({ guests: 12, where: destination.slug }).length > 0,
        `${destination.slug} kept but has no matching tour`
      );
    }
  });

  test('an explicit destination is kept even when its tours are filtered out', () => {
    // Asking for a place by name should still show the place.
    const result = searchDestinations({ where: 'sukhothai', guests: 12 });
    assert.deepEqual(result.map((d) => d.slug), ['sukhothai']);
  });
});

describe('suggestDestinations', () => {
  test('matches a prefix case-insensitively', () => {
    assert.deepEqual(suggestDestinations('chi').map((d) => d.slug), ['chiang-mai', 'chiang-rai']);
  });

  test('matches mid-word', () => {
    assert.ok(suggestDestinations('samui').some((d) => d.slug === 'koh-samui'));
  });

  test('ranks a prefix match above a mid-word match', () => {
    const result = suggestDestinations('ka');
    assert.equal(result[0].slug, 'kanchanaburi');
  });

  test('trims and ignores case', () => {
    assert.deepEqual(suggestDestinations('  BANGKOK '), suggestDestinations('bangkok'));
  });

  test('an empty term returns nothing', () => {
    assert.deepEqual(suggestDestinations(''), []);
    assert.deepEqual(suggestDestinations('   '), []);
  });

  test('an unmatched term returns nothing', () => {
    assert.deepEqual(suggestDestinations('atlantis'), []);
  });

  test('respects the limit', () => {
    assert.ok(suggestDestinations('a', 3).length <= 3);
  });
});

describe('lookups', () => {
  test('findTour returns a known tour', () => {
    assert.equal(findTour(tours[0].id)?.id, tours[0].id);
  });

  test('findTour returns undefined for an unknown id', () => {
    assert.equal(findTour('nope'), undefined);
  });

  test('findDestination returns a known destination', () => {
    assert.equal(findDestination('phuket')?.name, 'Phuket');
  });
});

describe('query helpers', () => {
  test('isSearchActive is false for an empty query', () => {
    assert.equal(isSearchActive({}), false);
  });

  test('isSearchActive is true when any filter is set', () => {
    assert.equal(isSearchActive({ where: 'phuket' }), true);
    assert.equal(isSearchActive({ guests: 2 }), true);
    assert.equal(isSearchActive({ from: '2026-09-01' }), true);
  });

  test('toSearchParams round-trips a query', () => {
    const params = toSearchParams({ where: 'phuket', from: '2026-09-01', guests: 4 });
    assert.equal(params.get('where'), 'phuket');
    assert.equal(params.get('from'), '2026-09-01');
    assert.equal(params.get('guests'), '4');
    assert.equal(params.get('to'), null);
  });

  test('toSearchParams omits everything for an empty query', () => {
    assert.equal(toSearchParams({}).toString(), '');
  });
});
