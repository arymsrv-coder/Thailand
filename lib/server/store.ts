import 'server-only';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

/*
 * A small JSON collection store.
 *
 * Two properties matter here. Writes are atomic: the new contents go to a
 * temp file which is then renamed over the target, so a crash mid-write leaves
 * the previous version intact rather than a truncated file. And writes to one
 * collection are serialised through a promise chain, so two requests appending
 * at the same time cannot read-modify-write over each other — the case a naive
 * "read, push, write" would silently lose.
 *
 * This is deliberately the only module that knows data lives in files. The
 * repositories above it (bookings, messages, favourites) expose domain
 * operations, so moving to a real database means rewriting this file alone.
 */

/*
 * Where collections live. Overridable so a deployment can point at a mounted
 * volume, and so tests can run against a scratch directory.
 */
export const DATA_DIR = process.env.AMARA_DATA_DIR
  ? resolve(process.env.AMARA_DATA_DIR)
  : resolve(process.cwd(), '.data');

export type Store<T> = {
  all(): Promise<T[]>;
  append(row: T): Promise<void>;
  /** Rewrites the collection and resolves with what was written. */
  update(fn: (rows: T[]) => T[]): Promise<T[]>;
};

/** One queue per file path, shared by every store instance for that file. */
const writeQueues = new Map<string, Promise<unknown>>();

function enqueue<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(key) ?? Promise.resolve();
  // The queue must survive a failed task, so errors are swallowed for the
  // purposes of chaining while still reaching the caller.
  const run = previous.then(task, task);
  writeQueues.set(
    key,
    run.catch(() => {})
  );
  return run;
}

export function createStore<T>(name: string, directory: string = DATA_DIR): Store<T> {
  const file = join(directory, `${name}.json`);

  async function read(): Promise<T[]> {
    let raw: string;
    try {
      raw = await readFile(file, 'utf8');
    } catch (error) {
      // A collection that has never been written is simply empty.
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      // A hand-edited or half-written file should not take the site down.
      console.error(`[store] ${file} is not valid JSON; treating as empty`);
      return [];
    }
  }

  async function write(rows: T[]): Promise<void> {
    await mkdir(directory, { recursive: true });
    // Unique per write so two queues in one process cannot share a temp path.
    const temporary = `${file}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
    try {
      await writeFile(temporary, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
      await rename(temporary, file);
    } catch (error) {
      await unlink(temporary).catch(() => {});
      throw error;
    }
  }

  return {
    all: read,
    append: (row) => enqueue(file, async () => write([...(await read()), row])),
    update: (fn) =>
      enqueue(file, async () => {
        const rows = fn(await read());
        await write(rows);
        return rows;
      }),
  };
}
