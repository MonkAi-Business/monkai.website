import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { frameStepSeconds, previewRanges } from './preview.mjs';
import { createTransitionEditorServer } from './server.mjs';

const directory = dirname(fileURLToPath(import.meta.url));

test('previewRanges gives each side a bounded two-second preview window', () => {
  assert.deepEqual(
    previewRanges(
      { trimStart: 0.5, trimEnd: 7.7 },
      { trimStart: 0.35, trimEnd: 7.8 },
    ),
    {
      left: { start: 5.7, end: 7.7 },
      right: { start: 0.35, end: 2.35 },
    },
  );
});

test('frame stepping uses the master films 24 fps cadence', () => {
  assert.equal(frameStepSeconds, 1 / 24);
});

test('editor markup exposes all controls and an accessible status region', async () => {
  const html = await readFile(join(directory, 'index.html'), 'utf8');
  const requiredHooks = [
    'data-boundary-select',
    'data-left-video',
    'data-right-video',
    'data-left-back',
    'data-left-forward',
    'data-right-back',
    'data-right-forward',
    'data-capture-left',
    'data-capture-right',
    'data-preview-left',
    'data-preview-right',
    'data-preview-toggle',
    'data-save',
    'data-reset',
  ];

  for (const hook of requiredHooks) {
    assert.match(html, new RegExp(hook), `Missing editor control: ${hook}`);
  }
  assert.match(html, /aria-live="polite"/);
});

test('the local server delivers browser modules with a JavaScript content type', async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'monkai-editor-ui-'));
  const sourceDirectory = join(root, 'clips');
  const manifestPath = join(root, 'monkey-scenes.json');
  await mkdir(sourceDirectory);
  await writeFile(manifestPath, JSON.stringify([
    { id: 'left', file: 'left.mp4', duration: 1 },
    { id: 'right', file: 'right.mp4', duration: 1 },
  ]));

  const server = createTransitionEditorServer({
    manifestPath,
    sourceDirectory,
    staticDirectory: directory,
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  context.after(() => new Promise((resolve) => server.close(resolve)));

  const response = await fetch(
    `http://127.0.0.1:${server.address().port}/preview.mjs`,
  );
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get('content-type'),
    'text/javascript; charset=utf-8',
  );
});
