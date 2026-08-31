import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REFERENCE_PATTERN } from './server/reference';

/*
 * End-to-end coverage of the Server Actions: real FormData in, real files on
 * disk out. These exercise the wiring the unit tests cannot — that the field
 * names the forms post match what the actions read, and that a submission
 * actually lands in the store.
 */

let dir: string;
let actions: typeof import('../app/actions');
let headers: { __resetCookies(): void; __getCookie(name: string): string | undefined };

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

/** A date safely in the future, so these tests do not rot. */
function futureDate(): string {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

async function readCollection(name: string): Promise<unknown[]> {
  try {
    return JSON.parse(await readFile(join(dir, `${name}.json`), 'utf8'));
  } catch {
    return [];
  }
}

before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'amara-actions-'));
  process.env.AMARA_DATA_DIR = dir;
  process.env.AMARA_SESSION_SECRET = 'integration-test-secret';
  actions = await import('../app/actions');
  headers = (await import('next/headers')) as unknown as typeof headers;
});

after(async () => {
  delete process.env.AMARA_DATA_DIR;
  delete process.env.AMARA_SESSION_SECRET;
  await rm(dir, { recursive: true, force: true });
});

beforeEach(() => headers.__resetCookies());

describe('submitBooking', () => {
  const valid = () => ({
    tourId: 'grand-palace-wat-pho-heritage-walk',
    name: 'Somchai P',
    email: 'somchai@example.com',
    date: futureDate(),
    guests: '3',
  });

  test('stores a valid booking and returns a reference', async () => {
    const result = await actions.submitBooking(null, form(valid()));
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.value.reference, REFERENCE_PATTERN);

    const stored = (await readCollection('bookings')) as Record<string, unknown>[];
    const row = stored.find((r) => r.reference === result.value.reference);
    assert.ok(row, 'booking was not written to disk');
    assert.equal(row.name, 'Somchai P');
    assert.equal(row.guests, 3);
    assert.equal(row.tourTitle, 'Grand Palace & Wat Pho Heritage Walk');
    assert.ok(typeof row.createdAt === 'string');
  });

  test('rejects a bad submission without writing anything', async () => {
    const before = (await readCollection('bookings')).length;
    const result = await actions.submitBooking(
      null,
      form({ ...valid(), email: 'not-an-email', guests: '40' })
    );
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.email);
    assert.ok(result.errors.guests);
    assert.equal((await readCollection('bookings')).length, before);
  });

  test('rejects a past date', async () => {
    const result = await actions.submitBooking(null, form({ ...valid(), date: '2020-01-01' }));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.date);
  });

  test('rejects a tour that does not exist', async () => {
    const result = await actions.submitBooking(null, form({ ...valid(), tourId: 'made-up' }));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.tourId);
  });

  test('issues a distinct reference per booking', async () => {
    const results = await Promise.all(
      Array.from({ length: 6 }, () => actions.submitBooking(null, form(valid())))
    );
    const references = results.map((r) => (r.ok ? r.value.reference : null));
    assert.ok(references.every(Boolean));
    assert.equal(new Set(references).size, references.length);

    // Every one of them survived the concurrent writes.
    const stored = (await readCollection('bookings')) as { reference: string }[];
    for (const reference of references) {
      assert.ok(stored.some((row) => row.reference === reference), `${reference} lost`);
    }
  });
});

describe('submitContact', () => {
  const valid = {
    name: 'Ana',
    email: 'ana@example.com',
    message: 'We are four adults looking at two weeks in February.',
  };

  test('stores a valid message', async () => {
    const result = await actions.submitContact(null, form(valid));
    assert.equal(result.ok, true);

    const stored = (await readCollection('messages')) as Record<string, unknown>[];
    assert.ok(stored.some((row) => row.email === 'ana@example.com'));
  });

  test('rejects a short message without writing', async () => {
    const before = (await readCollection('messages')).length;
    const result = await actions.submitContact(null, form({ ...valid, message: 'hi' }));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.message);
    assert.equal((await readCollection('messages')).length, before);
  });
});

describe('toggleSavedDestination', () => {
  test('saves, then unsaves, and mints a visitor cookie', async () => {
    assert.equal(headers.__getCookie('amara_visitor'), undefined);

    const saved = await actions.toggleSavedDestination('phuket');
    assert.equal(saved.ok, true);
    if (!saved.ok) return;
    assert.deepEqual(saved.value, ['phuket']);
    assert.ok(headers.__getCookie('amara_visitor'), 'expected a visitor cookie');

    const again = await actions.toggleSavedDestination('phuket');
    assert.equal(again.ok, true);
    if (!again.ok) return;
    assert.deepEqual(again.value, []);
  });

  test('the read side agrees with what was saved', async () => {
    await actions.toggleSavedDestination('krabi');
    await actions.toggleSavedDestination('bangkok');
    const saved = await actions.readSavedDestinations();
    assert.deepEqual([...saved].sort(), ['bangkok', 'krabi']);
  });

  test('a visitor with no cookie has nothing saved', async () => {
    assert.deepEqual(await actions.readSavedDestinations(), []);
  });

  test('rejects a destination that does not exist', async () => {
    const result = await actions.toggleSavedDestination('atlantis');
    assert.equal(result.ok, false);
  });

  test('one visitor cannot see another visitor saves', async () => {
    await actions.toggleSavedDestination('sukhothai');
    assert.deepEqual(await actions.readSavedDestinations(), ['sukhothai']);

    // A fresh browser: no cookie, so no saved list.
    headers.__resetCookies();
    assert.deepEqual(await actions.readSavedDestinations(), []);
  });
});
