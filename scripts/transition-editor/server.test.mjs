import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createTransitionEditorServer } from './server.mjs';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'monkai-editor-server-'));
  const sourceDirectory = join(root, 'clips');
  const staticDirectory = join(root, 'ui');
  const manifestPath = join(root, 'monkey-scenes.json');
  await mkdir(sourceDirectory);
  await mkdir(staticDirectory);
  await writeFile(join(sourceDirectory, 'desk.mp4'), '0123456789');
  await writeFile(join(sourceDirectory, 'laptop.mp4'), 'abcdefghij');
  await writeFile(join(staticDirectory, 'index.html'), '<h1>Editor</h1>');
  await writeFile(manifestPath, `${JSON.stringify([
    { id: 'desk', file: 'desk.mp4', duration: 8, transition: 0 },
    { id: 'laptop', file: 'laptop.mp4', duration: 8, transition: 0.18 },
  ], null, 2)}\n`);

  const server = createTransitionEditorServer({
    manifestPath,
    sourceDirectory,
    staticDirectory,
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    baseUrl,
    manifestPath,
    server,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

test('GET /api/scenes returns effective trims and ordered boundaries', async (context) => {
  const app = await fixture();
  context.after(app.close);

  const response = await fetch(`${app.baseUrl}/api/scenes`);
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(payload.scenes[0].effectiveTrim, {
    trimStart: 0,
    trimEnd: 8,
    playDuration: 8,
  });
  assert.deepEqual(payload.boundaries, [{
    index: 1,
    leftId: 'desk',
    rightId: 'laptop',
  }]);
});

test('PUT /api/boundaries/:index atomically stores validated cut points', async (context) => {
  const app = await fixture();
  context.after(app.close);

  const response = await fetch(`${app.baseUrl}/api/boundaries/1`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      leftTrimEnd: 7.7,
      rightTrimStart: 0.35,
    }),
  });

  assert.equal(response.status, 200);
  const saved = JSON.parse(await readFile(app.manifestPath, 'utf8'));
  assert.equal(saved[0].trimEnd, 7.7);
  assert.equal(saved[1].trimStart, 0.35);
  assert.equal(saved[0].transition, 0);
});

test('invalid boundary updates return 400 and preserve the manifest', async (context) => {
  const app = await fixture();
  context.after(app.close);
  const before = await readFile(app.manifestPath, 'utf8');

  const response = await fetch(`${app.baseUrl}/api/boundaries/1`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      leftTrimEnd: 0,
      rightTrimStart: 9,
    }),
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /trim/i);
  assert.equal(await readFile(app.manifestPath, 'utf8'), before);
});

test('media endpoint supports byte ranges and rejects unknown scene ids', async (context) => {
  const app = await fixture();
  context.after(app.close);

  const partial = await fetch(`${app.baseUrl}/api/media/desk`, {
    headers: { range: 'bytes=2-5' },
  });
  assert.equal(partial.status, 206);
  assert.equal(partial.headers.get('content-range'), 'bytes 2-5/10');
  assert.equal(await partial.text(), '2345');

  const missing = await fetch(`${app.baseUrl}/api/media/missing`);
  assert.equal(missing.status, 404);
});

test('the editor server is explicitly bound to localhost', async (context) => {
  const app = await fixture();
  context.after(app.close);

  assert.equal(app.server.address().address, '127.0.0.1');
});
