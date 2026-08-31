import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateBooking,
  validateContact,
  validateSearch,
  isValidEmail,
  isValidIsoDate,
} from './validation';

const TODAY = '2026-08-26';

describe('isValidEmail', () => {
  const good = ['a@b.co', 'first.last@sub.domain.org', 'x+tag@mail.co.uk'];
  const bad = [
    '',
    'nope',
    'no@domain',
    'two@@at.com',
    'space in@mail.com',
    '@leading.com',
    'trailing@.com',
    `${'a'.repeat(250)}@mail.com`,
  ];
  for (const value of good) {
    test(`accepts ${value}`, () => assert.equal(isValidEmail(value), true));
  }
  for (const value of bad) {
    test(`rejects ${JSON.stringify(value)}`, () =>
      assert.equal(isValidEmail(value), false));
  }
});

describe('isValidIsoDate', () => {
  test('accepts a real date', () => assert.equal(isValidIsoDate('2026-02-28'), true));
  test('accepts a leap day in a leap year', () =>
    assert.equal(isValidIsoDate('2028-02-29'), true));
  test('rejects a leap day in a common year', () =>
    assert.equal(isValidIsoDate('2027-02-29'), false));
  test('rejects month 13', () => assert.equal(isValidIsoDate('2026-13-01'), false));
  test('rejects day 32', () => assert.equal(isValidIsoDate('2026-01-32'), false));
  test('rejects a non-date', () => assert.equal(isValidIsoDate('tomorrow'), false));
  test('rejects an empty string', () => assert.equal(isValidIsoDate(''), false));
});

describe('validateBooking', () => {
  const valid = {
    tourId: 'grand-palace-wat-pho-heritage-walk',
    name: 'Somchai P',
    email: 'somchai@example.com',
    date: '2026-09-10',
    guests: '2',
  };

  test('accepts a well-formed booking', () => {
    const result = validateBooking(valid, TODAY);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.value.guests, 2);
    assert.equal(result.value.name, 'Somchai P');
  });

  test('trims surrounding whitespace', () => {
    const result = validateBooking({ ...valid, name: '  Somchai P  ' }, TODAY);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.value.name, 'Somchai P');
  });

  test('rejects an unknown tour', () => {
    const result = validateBooking({ ...valid, tourId: 'not-a-tour' }, TODAY);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.tourId);
  });

  test('rejects a one-character name', () => {
    const result = validateBooking({ ...valid, name: 'S' }, TODAY);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.name);
  });

  test('rejects a date in the past', () => {
    const result = validateBooking({ ...valid, date: '2026-08-25' }, TODAY);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.date);
  });

  test('accepts today as the travel date', () => {
    const result = validateBooking({ ...valid, date: TODAY }, TODAY);
    assert.equal(result.ok, true);
  });

  test('rejects zero guests and thirteen guests', () => {
    for (const guests of ['0', '13', '-1', 'two', '2.5']) {
      const result = validateBooking({ ...valid, guests }, TODAY);
      assert.equal(result.ok, false, `guests=${guests} should fail`);
    }
  });

  test('reports every bad field at once', () => {
    const result = validateBooking(
      { tourId: '', name: '', email: 'x', date: '', guests: '99' },
      TODAY
    );
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.deepEqual(
      Object.keys(result.errors).sort(),
      ['date', 'email', 'guests', 'name', 'tourId']
    );
  });
});

describe('validateContact', () => {
  const valid = {
    name: 'Ana',
    email: 'ana@example.com',
    message: 'I would like to ask about a private tour in October.',
  };

  test('accepts a well-formed message', () => {
    assert.equal(validateContact(valid).ok, true);
  });

  test('rejects a message under ten characters', () => {
    const result = validateContact({ ...valid, message: 'too short' });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.message);
  });

  test('rejects a message over two thousand characters', () => {
    const result = validateContact({ ...valid, message: 'a'.repeat(2001) });
    assert.equal(result.ok, false);
  });

  test('rejects a bad email', () => {
    const result = validateContact({ ...valid, email: 'ana@' });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.email);
  });
});

describe('validateSearch', () => {
  test('returns an empty query for no params', () => {
    const result = validateSearch({}, TODAY);
    assert.deepEqual(result, {});
  });

  test('keeps a known destination slug', () => {
    assert.equal(validateSearch({ where: 'phuket' }, TODAY).where, 'phuket');
  });

  test('drops an unknown destination slug', () => {
    assert.equal(validateSearch({ where: 'atlantis' }, TODAY).where, undefined);
  });

  test('clamps guests into range rather than failing', () => {
    assert.equal(validateSearch({ guests: '99' }, TODAY).guests, 12);
    assert.equal(validateSearch({ guests: '0' }, TODAY).guests, 1);
    assert.equal(validateSearch({ guests: 'abc' }, TODAY).guests, undefined);
  });

  test('drops a past from-date', () => {
    assert.equal(validateSearch({ from: '2020-01-01' }, TODAY).from, undefined);
  });

  test('drops a to-date that is not after from', () => {
    const result = validateSearch({ from: '2026-09-10', to: '2026-09-10' }, TODAY);
    assert.equal(result.from, '2026-09-10');
    assert.equal(result.to, undefined);
  });

  test('keeps a valid range', () => {
    const result = validateSearch({ from: '2026-09-10', to: '2026-09-14' }, TODAY);
    assert.equal(result.from, '2026-09-10');
    assert.equal(result.to, '2026-09-14');
  });

  test('ignores array values from repeated query keys', () => {
    const result = validateSearch({ where: ['phuket', 'krabi'] }, TODAY);
    assert.equal(result.where, 'phuket');
  });
});
