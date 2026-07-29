import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs/promises';

import {
  effectiveTrim,
  resolveSceneMedia,
  updateBoundary,
} from './model.mjs';

const scenes = () => [
  { id: 'desk', file: 'desk.mp4', duration: 8 },
  { id: 'laptop', file: 'laptop.mp4', duration: 8 },
  { id: 'door', file: 'door.mp4', duration: 8, trimStart: 0.2 },
];

test('effectiveTrim uses the complete scene by default', () => {
  assert.deepEqual(effectiveTrim({ duration: 8 }), {
    trimStart: 0,
    trimEnd: 8,
    playDuration: 8,
  });
});

test('effectiveTrim derives the playable duration from explicit trims', () => {
  assert.deepEqual(
    effectiveTrim({ duration: 8, trimStart: 0.42, trimEnd: 7.6 }),
    { trimStart: 0.42, trimEnd: 7.6, playDuration: 7.18 },
  );
});

test('effectiveTrim rejects invalid scene ranges', () => {
  assert.throws(
    () => effectiveTrim({ duration: 8, trimStart: 7.6, trimEnd: 7.6 }),
    /before trimEnd/i,
  );
  assert.throws(
    () => effectiveTrim({ duration: 8, trimStart: -0.1 }),
    /non-negative/i,
  );
  assert.throws(
    () => effectiveTrim({ duration: 8, trimEnd: 8.1 }),
    /scene duration/i,
  );
});

test('updateBoundary saves both cut points without mutating its input', () => {
  const original = scenes();
  const updated = updateBoundary(original, 1, {
    leftTrimEnd: 7.7,
    rightTrimStart: 0.35,
  });

  assert.equal(updated[0].trimEnd, 7.7);
  assert.equal(updated[1].trimStart, 0.35);
  assert.equal(original[0].trimEnd, undefined);
  assert.equal(original[1].trimStart, undefined);
});

test('updateBoundary rejects unknown and invalid boundaries', () => {
  assert.throws(
    () => updateBoundary(scenes(), 0, {
      leftTrimEnd: 7,
      rightTrimStart: 0.2,
    }),
    /boundary/i,
  );
  assert.throws(
    () => updateBoundary(scenes(), 3, {
      leftTrimEnd: 7,
      rightTrimStart: 0.2,
    }),
    /boundary/i,
  );
  assert.throws(
    () => updateBoundary(scenes(), 1, {
      leftTrimEnd: 0,
      rightTrimStart: 0.2,
    }),
    /before trimEnd/i,
  );
  assert.throws(
    () => updateBoundary(scenes(), 1, {
      leftTrimEnd: 7,
      rightTrimStart: Number.NaN,
    }),
    /finite/i,
  );
});

test('updateBoundary reset removes only fields owned by the selected boundary', () => {
  const original = [
    { ...scenes()[0], trimStart: 0.1, trimEnd: 7.7 },
    { ...scenes()[1], trimStart: 0.3, trimEnd: 7.8 },
    { ...scenes()[2], trimEnd: 7.9 },
  ];
  const updated = updateBoundary(original, 1, { reset: true });

  assert.equal(updated[0].trimStart, 0.1);
  assert.equal(updated[0].trimEnd, undefined);
  assert.equal(updated[1].trimStart, undefined);
  assert.equal(updated[1].trimEnd, 7.8);
  assert.deepEqual(updated[2], original[2]);
});

test('resolveSceneMedia resolves configured scene files below the source directory', async () => {
  const sourceDirectory = await mkdtemp(join(tmpdir(), 'monkai-transition-'));
  await mkdir(sourceDirectory, { recursive: true });
  await writeFile(join(sourceDirectory, 'desk.mp4'), 'video');

  assert.equal(
    resolveSceneMedia(scenes(), 'desk', sourceDirectory),
    join(sourceDirectory, 'desk.mp4'),
  );
});

test('resolveSceneMedia rejects unknown scenes and paths outside the source directory', () => {
  assert.throws(
    () => resolveSceneMedia(scenes(), 'missing', 'C:\\clips'),
    /unknown scene/i,
  );
  assert.throws(
    () => resolveSceneMedia(
      [{ id: 'escape', file: '..\\secret.mp4', duration: 8 }],
      'escape',
      'C:\\clips',
    ),
    /outside/i,
  );
});
