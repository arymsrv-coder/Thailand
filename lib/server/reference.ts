import { randomInt } from 'node:crypto';

/*
 * Human-facing booking codes. The alphabet omits I, O, 0 and 1 so a code read
 * over the phone or copied off a screen cannot be transcribed wrongly.
 */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LENGTH = 6;

export function newReference(): string {
  let code = '';
  for (let i = 0; i < LENGTH; i += 1) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `AS-${code}`;
}

export const REFERENCE_PATTERN = /^AS-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/;
