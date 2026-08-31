import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { newVisitorId, signVisitorId, readVisitorId } from './signing';

const SECRET = 'test-secret-value';

describe('newVisitorId', () => {
  test('produces a url-safe id', () => {
    assert.match(newVisitorId(), /^[A-Za-z0-9_-]{16,}$/);
  });

  test('does not repeat', () => {
    const ids = new Set(Array.from({ length: 200 }, newVisitorId));
    assert.equal(ids.size, 200);
  });
});

describe('signVisitorId / readVisitorId', () => {
  test('round-trips a signed value', () => {
    const id = newVisitorId();
    assert.equal(readVisitorId(signVisitorId(id, SECRET), SECRET), id);
  });

  test('rejects a value signed with a different secret', () => {
    const signed = signVisitorId(newVisitorId(), 'other-secret');
    assert.equal(readVisitorId(signed, SECRET), null);
  });

  test('rejects a tampered payload', () => {
    const id = newVisitorId();
    const signed = signVisitorId(id, SECRET);
    const [, signature] = signed.split('.');
    assert.equal(readVisitorId(`someoneelse.${signature}`, SECRET), null);
  });

  test('rejects a tampered signature', () => {
    const signed = signVisitorId(newVisitorId(), SECRET);
    const [payload] = signed.split('.');
    assert.equal(readVisitorId(`${payload}.deadbeef`, SECRET), null);
  });

  test('rejects an unsigned value', () => {
    assert.equal(readVisitorId('plain-id', SECRET), null);
  });

  test('rejects empty and malformed input', () => {
    for (const value of ['', '.', 'a.', '.b', 'a.b.c']) {
      assert.equal(readVisitorId(value, SECRET), null, `should reject ${JSON.stringify(value)}`);
    }
  });

  test('rejects undefined', () => {
    assert.equal(readVisitorId(undefined, SECRET), null);
  });

  test('rejects a payload that is not a well-formed id', () => {
    const signed = signVisitorId('has spaces and !!', SECRET);
    assert.equal(readVisitorId(signed, SECRET), null);
  });
});
