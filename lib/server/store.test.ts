import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore } from './store';

let dir: string;

before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'amara-store-'));
});

after(async () => {
  await rm(dir, { recursive: true, force: true });
});

type Row = { id: string; n: number };

describe('createStore', () => {
  let store: ReturnType<typeof createStore<Row>>;

  beforeEach(async () => {
    await rm(join(dir, 'rows.json'), { force: true });
    store = createStore<Row>('rows', dir);
  });

  test('reads an empty list when the file does not exist', async () => {
    assert.deepEqual(await store.all(), []);
  });

  test('append then read round-trips', async () => {
    await store.append({ id: 'a', n: 1 });
    await store.append({ id: 'b', n: 2 });
    assert.deepEqual(await store.all(), [
      { id: 'a', n: 1 },
      { id: 'b', n: 2 },
    ]);
  });

  test('persists across store instances', async () => {
    await store.append({ id: 'a', n: 1 });
    const reopened = createStore<Row>('rows', dir);
    assert.deepEqual(await reopened.all(), [{ id: 'a', n: 1 }]);
  });

  test('concurrent appends do not lose writes', async () => {
    await Promise.all(
      Array.from({ length: 40 }, (_, i) => store.append({ id: `r${i}`, n: i }))
    );
    const rows = await store.all();
    assert.equal(rows.length, 40);
    assert.equal(new Set(rows.map((r) => r.id)).size, 40);
  });

  test('leaves no temp files behind', async () => {
    await store.append({ id: 'a', n: 1 });
    const files = await readdir(dir);
    assert.deepEqual(files, ['rows.json']);
  });

  test('writes readable, indented JSON', async () => {
    await store.append({ id: 'a', n: 1 });
    const raw = await readFile(join(dir, 'rows.json'), 'utf8');
    assert.ok(raw.includes('\n  '), 'expected indented output');
    assert.deepEqual(JSON.parse(raw), [{ id: 'a', n: 1 }]);
  });

  test('treats a corrupt file as empty rather than throwing', async () => {
    await writeFile(join(dir, 'rows.json'), '{not json');
    assert.deepEqual(await store.all(), []);
  });

  test('update rewrites the whole collection', async () => {
    await store.append({ id: 'a', n: 1 });
    await store.append({ id: 'b', n: 2 });
    await store.update((rows) => rows.filter((r) => r.id !== 'a'));
    assert.deepEqual(await store.all(), [{ id: 'b', n: 2 }]);
  });

  test('update sees writes queued before it', async () => {
    await Promise.all([
      store.append({ id: 'a', n: 1 }),
      store.update((rows) => [...rows, { id: 'b', n: 2 }]),
    ]);
    const ids = (await store.all()).map((r) => r.id).sort();
    assert.deepEqual(ids, ['a', 'b']);
  });

  test('separate collections do not collide', async () => {
    const other = createStore<Row>('others', dir);
    await store.append({ id: 'a', n: 1 });
    await other.append({ id: 'z', n: 9 });
    assert.deepEqual(await store.all(), [{ id: 'a', n: 1 }]);
    assert.deepEqual(await other.all(), [{ id: 'z', n: 9 }]);
    await rm(join(dir, 'others.json'), { force: true });
  });
});

describe('update return value', () => {
  test('resolves with the rows it wrote', async () => {
    const store = createStore<Row>('returned', dir);
    const written = await store.update(() => [{ id: 'x', n: 7 }]);
    assert.deepEqual(written, [{ id: 'x', n: 7 }]);
    assert.deepEqual(await store.all(), written);
    await rm(join(dir, 'returned.json'), { force: true });
  });
});
