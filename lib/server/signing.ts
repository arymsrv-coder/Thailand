import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/*
 * Pure signing for the anonymous visitor id — no framework, no I/O, so it can
 * be reasoned about and tested on its own. The cookie plumbing that uses it
 * lives in ./session.ts.
 *
 * There are no accounts on this site, so a visitor is just an opaque random id.
 * It is signed so a visitor cannot hand themselves someone else's id by editing
 * the cookie, and signatures are compared in constant time.
 */

const ID_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

export function newVisitorId(): string {
  return randomBytes(18).toString('base64url');
}

export function newSecret(): string {
  return randomBytes(32).toString('base64url');
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function signVisitorId(id: string, secret: string): string {
  return `${id}.${sign(id, secret)}`;
}

/** Returns the id only when the signature verifies, otherwise null. */
export function readVisitorId(
  cookieValue: string | undefined,
  secret: string
): string | null {
  if (!cookieValue) return null;

  const parts = cookieValue.split('.');
  if (parts.length !== 2) return null;

  const [id, signature] = parts;
  if (!ID_PATTERN.test(id) || !signature) return null;

  const expected = Buffer.from(sign(id, secret));
  const given = Buffer.from(signature);
  // timingSafeEqual throws on a length mismatch, so screen for that first.
  if (expected.length !== given.length) return null;

  return timingSafeEqual(expected, given) ? id : null;
}
