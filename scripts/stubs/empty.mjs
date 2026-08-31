/*
 * Stands in for "server-only" under `node --test`.
 *
 * The real package throws unless it is resolved through React's "react-server"
 * export condition, which only a bundler provides. Stubbing it here lets the
 * server modules be unit-tested directly while the genuine build-time guard
 * still applies to every `next build`.
 */
export {};
