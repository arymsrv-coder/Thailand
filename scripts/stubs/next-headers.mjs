/*
 * An in-memory stand-in for `next/headers` under `node --test`.
 *
 * The real module only works inside a request, so without it the Server
 * Actions could not be exercised outside a running server at all. This keeps
 * the cookie semantics the actions actually rely on — get, set, and a value
 * that persists across calls — and exposes a reset for test isolation.
 */

const jar = new Map();

export async function cookies() {
  return {
    get: (name) => (jar.has(name) ? { name, value: jar.get(name) } : undefined),
    set: (name, value) => jar.set(name, value),
    delete: (name) => jar.delete(name),
  };
}

export function __resetCookies() {
  jar.clear();
}

export function __getCookie(name) {
  return jar.get(name);
}
