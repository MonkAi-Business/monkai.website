import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdtemp,
  mkdir,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('build plan joins trimmed scenes with an exact hard cut without encoding', async (context) => {
  const root = await mkdtemp(join(tmpdir(), 'monkai-build-plan-'));
  const sourceDirectory = join(root, 'clips');
  const outputDirectory = join(root, 'output');
  const manifestPath = join(root, 'scenes.json');
  await mkdir(sourceDirectory);
  await writeFile(join(sourceDirectory, 'left.mp4'), '');
  await writeFile(join(sourceDirectory, 'right.mp4'), '');
  await writeFile(manifestPath, JSON.stringify([
    {
      id: 'left',
      file: 'left.mp4',
      duration: 8,
      trimStart: 0.5,
      trimEnd: 7.7,
      transition: 0,
    },
    {
      id: 'right',
      file: 'right.mp4',
      duration: 8,
      trimStart: 0.2,
      trimEnd: 7.8,
      transition: 0.18,
    },
  ]));
  context.after(() => rm(root, { recursive: true, force: true }));

  const result = spawnSync('powershell.exe', [
    '-NoProfile',
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    join(projectRoot, 'scripts', 'build-scroll-story.ps1'),
    '-SourceDirectory',
    sourceDirectory,
    '-ManifestPath',
    manifestPath,
    '-OutputDirectory',
    outputDirectory,
    '-PlanOnly',
  ], {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const plan = JSON.parse(result.stdout);
  assert.match(plan.filter, /\[0:v\]trim=start=0\.5:end=7\.7/);
  assert.match(plan.filter, /\[1:v\]trim=start=0\.2:end=7\.8/);
  assert.match(plan.filter, /\[v0\]\[v1\]concat=n=2:v=1:a=0\[story\]/);
  assert.doesNotMatch(plan.filter, /xfade=/);
  assert.equal(plan.keyframeInterval, 3);
  assert.equal(plan.effectiveDurations[0], 7.2);
  assert.equal(plan.effectiveDurations[1], 7.6);
  assert.equal(plan.timeline, 14.8);
  assert.deepEqual(await readdir(outputDirectory), []);
});
