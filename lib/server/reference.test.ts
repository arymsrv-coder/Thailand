import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { newReference, REFERENCE_PATTERN } from './reference';

describe('newReference', () => {
  test('matches the documented shape', () => {
    for (let i = 0; i < 50; i += 1) {
      assert.match(newReference(), REFERENCE_PATTERN);
    }
  });

  test('never uses an ambiguous character', () => {
    const codes = Array.from({ length: 500 }, newReference).join('');
    for (const character of ['I', 'O', '0', '1']) {
      assert.ok(!codes.includes(character), `found ${character}`);
    }
  });

  test('is not trivially repetitive', () => {
    const codes = new Set(Array.from({ length: 300 }, newReference));
    assert.ok(codes.size > 290, `expected near-unique codes, got ${codes.size}`);
  });
});
