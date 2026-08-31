import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/*
 * The repository binds to DATA_DIR when its module first loads, so the scratch
 * directory has to be in the environment before the dynamic import below.
 */
let dir: string;
let favorites: typeof import('./favorites');

before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'amara-favorites-'));
  process.env.AMARA_DATA_DIR = dir;
  favorites = await import('./favorites');
});

after(async () => {
  delete process.env.AMARA_DATA_DIR;
  await rm(dir, { recursive: true, force: true });
});

describe('favorites', () => {
  test('an unknown visitor has none', async () => {
    assert.deepEqual(await favorites.getFavorites('visitor-unknown'), []);
  });

  test('a null visitor has none', async () => {
    assert.deepEqual(await favorites.getFavorites(null), []);
  });

  test('toggling on then off', async () => {
    const visitor = 'visitor-toggle';
    assert.deepEqual(await favorites.toggleFavorite(visitor, 'phuket'), ['phuket']);
    assert.deepEqual(await favorites.getFavorites(visitor), ['phuket']);
    assert.deepEqual(await favorites.toggleFavorite(visitor, 'phuket'), []);
    assert.deepEqual(await favorites.getFavorites(visitor), []);
  });

  test('keeps visitors separate', async () => {
    await favorites.toggleFavorite('visitor-a', 'krabi');
    await favorites.toggleFavorite('visitor-b', 'bangkok');
    assert.deepEqual(await favorites.getFavorites('visitor-a'), ['krabi']);
    assert.deepEqual(await favorites.getFavorites('visitor-b'), ['bangkok']);
  });

  test('concurrent toggles all land', async () => {
    const visitor = 'visitor-concurrent';
    const slugs = ['bangkok', 'phuket', 'krabi', 'chiang-mai', 'ayutthaya'];
    await Promise.all(slugs.map((slug) => favorites.toggleFavorite(visitor, slug)));
    const saved = await favorites.getFavorites(visitor);
    assert.deepEqual([...saved].sort(), [...slugs].sort());
  });

  test('survives a fresh read of the collection', async () => {
    await favorites.toggleFavorite('visitor-persist', 'sukhothai');
    assert.deepEqual(await favorites.getFavorites('visitor-persist'), ['sukhothai']);
  });
});
