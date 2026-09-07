import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { submitBooking, submitContact, submitInquiry } from './forms';

/*
 * Coverage for the handoff the static build uses in place of the old Server
 * Actions: that the field names the forms post are the ones these read, that
 * invalid input is rejected before anything is handed back, and that a valid
 * submission carries every answer into the mailto: rather than dropping it.
 */

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

/** The body of a mailto:, decoded back to the text the mail client will show. */
function body(mailto: string): string {
  return decodeURIComponent(new URL(mailto).searchParams.get('body') ?? '');
}

describe('submitBooking', () => {
  test('carries every answer into the message', async () => {
    const date = futureDate();
    const result = await submitBooking(
      null,
      form({
        tourId: 'grand-palace-wat-pho-heritage-walk',
        name: 'Ari Tan',
        email: 'ari@example.com',
        date,
        guests: '3',
      })
    );

    assert.ok(result.ok, 'expected a valid booking to be accepted');
    const text = body(result.value.mailto);
    assert.match(text, /grand-palace-wat-pho-heritage-walk/);
    assert.match(text, /Ari Tan/);
    assert.match(text, /ari@example\.com/);
    assert.match(text, new RegExp(date));
    assert.match(text, /Guests: 3/);
  });

  test('rejects a bad email without handing anything back', async () => {
    const result = await submitBooking(
      null,
      form({
        tourId: 'grand-palace-wat-pho-heritage-walk',
        name: 'Ari Tan',
        email: 'not-an-email',
        date: futureDate(),
        guests: '3',
      })
    );

    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.email, 'expected an error on the email field');
  });

  test('rejects an unknown tour', async () => {
    const result = await submitBooking(
      null,
      form({
        tourId: 'no-such-tour',
        name: 'Ari Tan',
        email: 'ari@example.com',
        date: futureDate(),
        guests: '2',
      })
    );

    assert.equal(result.ok, false);
  });
});

describe('submitInquiry', () => {
  test('names the item in both the subject and the body', async () => {
    const result = await submitInquiry(
      null,
      form({
        kind: 'cruise',
        itemId: 'andaman-sunset',
        itemLabel: 'Andaman Sunset Voyage',
        name: 'Ari Tan',
        email: 'ari@example.com',
        date: futureDate(),
        travelers: '2',
      })
    );

    assert.ok(result.ok, 'expected a valid inquiry to be accepted');
    const url = new URL(result.value.mailto);
    assert.match(url.searchParams.get('subject') ?? '', /Andaman Sunset Voyage/);
    assert.match(body(result.value.mailto), /Andaman Sunset Voyage/);
  });
});

describe('submitContact', () => {
  test('keeps the message text intact', async () => {
    const message = 'Do you run the Chiang Mai lantern trip in November?';
    const result = await submitContact(
      null,
      form({ name: 'Ari Tan', email: 'ari@example.com', message })
    );

    assert.ok(result.ok, 'expected a valid message to be accepted');
    assert.match(body(result.value.mailto), new RegExp(message.replace(/\?/g, '\\?')));
  });

  test('rejects an empty message', async () => {
    const result = await submitContact(
      null,
      form({ name: 'Ari Tan', email: 'ari@example.com', message: '   ' })
    );

    assert.equal(result.ok, false);
  });
});
