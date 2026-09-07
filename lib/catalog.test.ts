import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { destinations } from './destinations';
import { tours } from './tours';
import {
  ACTIVITY_CATEGORIES,
  activityCategoryCounts,
  activityScoreLabel,
  applyActivityFilters,
  formatActivityDuration,
  hasActivityFilters,
  searchTours,
  searchDestinations,
  suggestDestinations,
  monthsInRange,
  findTour,
  findDestination,
  isSearchActive,
  toSearchParams,
  validateActivityFilters,
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
    // Every catalogued destination now has at least one tour, so this checks
    // the empty case with a slug the tour catalogue does not cover.
    assert.deepEqual(searchTours({ where: 'no-such-destination' }), []);
  });

  test('every catalogued destination has at least one tour', () => {
    for (const destination of destinations) {
      assert.ok(
        searchTours({ where: destination.slug }).length > 0,
        `expected at least one tour for ${destination.slug}`
      );
    }
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

describe('activity filters', () => {
  test('every tour sits in a known category', () => {
    const known = new Set(ACTIVITY_CATEGORIES.map((c) => c.slug));
    for (const tour of tours) {
      assert.ok(known.has(tour.categorySlug), `${tour.id} -> ${tour.categorySlug}`);
    }
  });

  test('an empty query sets no filters', () => {
    const filters = validateActivityFilters({});
    assert.equal(hasActivityFilters(filters), false);
    assert.equal(applyActivityFilters(tours, filters).length, tours.length);
  });

  test('unknown values are dropped rather than applied', () => {
    const filters = validateActivityFilters({
      rating: '11',
      rec: ['not-a-recommendation'],
      start: ['midnight'],
      length: ['forever'],
      category: '<script>',
      sort: 'sideways',
    });
    assert.deepEqual(filters, {
      minScore: 0,
      recommendations: [],
      startTimes: [],
      durations: [],
      keyword: '',
      category: '',
      sort: 'recommended',
    });
  });

  test('a keyword is trimmed and length-capped', () => {
    const filters = validateActivityFilters({ q: `  ${'x'.repeat(200)}  ` });
    assert.equal(filters.keyword.length, 80);
  });

  test('the rating filter keeps only scores at or above the bar', () => {
    const filters = validateActivityFilters({ rating: '9' });
    const result = applyActivityFilters(tours, filters);
    assert.ok(result.length > 0);
    assert.ok(result.every((t) => t.score >= 9));
  });

  test('options within a group are OR-ed', () => {
    const filters = validateActivityFilters({ start: ['morning', 'evening'] });
    const result = applyActivityFilters(tours, filters);
    assert.ok(
      result.every((t) => {
        const hour = Number.parseInt(t.startTime.slice(0, 2), 10);
        return (hour >= 6 && hour < 12) || hour >= 17;
      })
    );
    // An afternoon departure is excluded by that pair.
    assert.ok(!result.some((t) => t.startTime.startsWith('13')));
  });

  test('groups are AND-ed together', () => {
    const filters = validateActivityFilters({ rating: '9', rec: ['local-expert'] });
    const result = applyActivityFilters(tours, filters);
    assert.ok(result.length > 0);
    assert.ok(result.every((t) => t.score >= 9 && t.localExpertPick));
  });

  test('price sorts run in the direction they claim', () => {
    const asc = applyActivityFilters(tours, validateActivityFilters({ sort: 'price-asc' }));
    const desc = applyActivityFilters(tours, validateActivityFilters({ sort: 'price-desc' }));
    const value = (p: string) => Number.parseFloat(p.replace(/[^0-9.]/g, ''));
    assert.deepEqual(
      asc.map((t) => value(t.price)),
      [...asc.map((t) => value(t.price))].sort((a, b) => a - b)
    );
    assert.equal(value(desc[0].price) >= value(asc[0].price), true);
  });

  test('category counts only list categories that have tours', () => {
    for (const entry of activityCategoryCounts(tours)) {
      assert.ok(entry.count > 0, `${entry.slug} listed with no tours`);
    }
  });

  test('durations format the way the cards read them', () => {
    assert.equal(formatActivityDuration(360), '6h');
    assert.equal(formatActivityDuration(90), '1h 30m');
    assert.equal(formatActivityDuration(45), '45m');
    assert.equal(formatActivityDuration(2880), '2d');
  });

  test('score labels follow the published bands', () => {
    assert.equal(activityScoreLabel(9.8), 'Exceptional');
    assert.equal(activityScoreLabel(9.0), 'Wonderful');
    assert.equal(activityScoreLabel(8.6), 'Excellent');
    assert.equal(activityScoreLabel(8.0), 'Very Good');
    assert.equal(activityScoreLabel(7.2), 'Good');
    assert.equal(activityScoreLabel(6.0), '');
  });
});
