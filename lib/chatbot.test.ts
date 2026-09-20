import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { findAnswer, chatKnowledge } from './chatbot';

describe('findAnswer', () => {
  test('matches a visa question to the visa FAQ', () => {
    const result = findAnswer('Do I need a visa to visit?');
    assert.match(result?.prompt ?? '', /visa/i);
  });

  test('matches a paraphrased booking question', () => {
    const result = findAnswer('how can I rent a car in Phuket');
    assert.equal(result?.id, 'book-car');
  });

  test('matches on a synonym not present in the prompt or answer text', () => {
    const result = findAnswer('I need to speak to a human please');
    assert.equal(result?.id, 'contact-human');
  });

  test('returns null for input with no meaningful words', () => {
    assert.equal(findAnswer('the is a'), null);
  });

  test('returns null for unrelated input', () => {
    assert.equal(findAnswer('purple elephant quantum spreadsheet'), null);
  });

  test('every entry has a unique id', () => {
    const ids = chatKnowledge.map((entry) => entry.id);
    assert.equal(new Set(ids).size, ids.length);
  });
});
