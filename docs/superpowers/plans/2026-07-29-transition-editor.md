# Local Transition Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repository-local browser tool for selecting the end of one Monkey Mode clip and the start of the next, saving those trims safely, previewing the hard cut, and applying the trims when rebuilding the master film.

**Architecture:** A dependency-free Node HTTP server reads and atomically updates `scripts/monkey-scenes.json`, serves source clips only through validated scene IDs, and hosts a small static browser UI. Pure manifest functions live separately so validation and updates can be tested without starting the server. The existing PowerShell/FFmpeg builder consumes the optional trim values.

**Tech Stack:** Node.js built-ins, browser HTML/CSS/JavaScript, Node test runner, PowerShell, FFmpeg.

## Global Constraints

- The editor is a local development tool and must not create an Astro route or enter the public build.
- Bind the server only to `127.0.0.1`.
- Default the source directory to `C:\Users\stijn\Downloads`, with a `--source` override.
- Never modify source video files.
- Save only explicit `trimStart` and `trimEnd` values after validation.
- Write the manifest atomically through a temporary file in the same directory.
- Do not rebuild the master film automatically.
- The first preview uses a hard, non-overlapping cut.
- Use only existing dependencies and Node built-ins.

---

### Task 1: Manifest trim model

**Files:**
- Create: `scripts/transition-editor/model.mjs`
- Create: `scripts/transition-editor/model.test.mjs`

**Interfaces:**
- Produces: `effectiveTrim(scene)` returning `{ trimStart, trimEnd, playDuration }`.
- Produces: `updateBoundary(scenes, boundaryIndex, values)` returning a new scene array.
- Produces: `resolveSceneMedia(scenes, sceneId, sourceDirectory)` returning a safe absolute path.
- `values` has shape `{ leftTrimEnd?: number, rightTrimStart?: number, reset?: boolean }`.

- [ ] **Step 1: Write failing model tests**

Cover:

```js
test('effectiveTrim uses scene defaults', () => {
  assert.deepEqual(effectiveTrim({ duration: 8 }), {
    trimStart: 0,
    trimEnd: 8,
    playDuration: 8,
  });
});

test('effectiveTrim uses explicit trims', () => {
  assert.deepEqual(
    effectiveTrim({ duration: 8, trimStart: 0.42, trimEnd: 7.6 }),
    { trimStart: 0.42, trimEnd: 7.6, playDuration: 7.18 },
  );
});

test('updateBoundary saves both sides without mutating input', () => {
  const scenes = [
    { id: 'desk', duration: 8 },
    { id: 'laptop', duration: 8 },
  ];
  const updated = updateBoundary(scenes, 1, {
    leftTrimEnd: 7.7,
    rightTrimStart: 0.35,
  });
  assert.equal(updated[0].trimEnd, 7.7);
  assert.equal(updated[1].trimStart, 0.35);
  assert.equal(scenes[0].trimEnd, undefined);
});
```

Also assert rejection of an unknown boundary, negative values, values beyond the
scene duration, and `trimStart >= trimEnd`. Assert that reset removes only the
two fields belonging to the selected boundary.

- [ ] **Step 2: Run the model tests and verify RED**

Run:

```powershell
node --test scripts/transition-editor/model.test.mjs
```

Expected: FAIL because `model.mjs` does not exist.

- [ ] **Step 3: Implement the pure model**

Implement finite-number validation, immutable scene copies, reset behavior, and
path confinement. `resolveSceneMedia` must locate a scene only by its existing
ID, resolve its configured filename below the resolved source directory, and
throw when the resulting path escapes that directory.

- [ ] **Step 4: Run the model tests and verify GREEN**

Run:

```powershell
node --test scripts/transition-editor/model.test.mjs
```

Expected: all model tests PASS.

- [ ] **Step 5: Commit the model**

```powershell
git add scripts/transition-editor/model.mjs scripts/transition-editor/model.test.mjs
git commit -m "feat: add transition trim model"
```

---

### Task 2: Local editor server and API

**Files:**
- Create: `scripts/transition-editor/server.mjs`
- Create: `scripts/transition-editor/server.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `effectiveTrim`, `updateBoundary`, and `resolveSceneMedia`.
- Produces: `createTransitionEditorServer(options)` for tests and the CLI.
- Produces local endpoints:
  - `GET /api/scenes`
  - `GET /api/media/:sceneId`
  - `PUT /api/boundaries/:boundaryIndex`
  - static files below `/`.

- [ ] **Step 1: Write failing HTTP tests**

Use a temporary manifest and source directory. Start the exported server on an
ephemeral port and assert:

```js
const response = await fetch(`${baseUrl}/api/scenes`);
assert.equal(response.status, 200);
const payload = await response.json();
assert.equal(payload.scenes[0].effectiveTrim.trimEnd, 8);
assert.equal(payload.boundaries[0].leftId, 'desk');
assert.equal(payload.boundaries[0].rightId, 'laptop');
```

Assert that a valid `PUT` updates only the selected trim fields, an invalid
update returns HTTP 400 without changing the manifest, an unknown scene media
request returns HTTP 404, and the server address is `127.0.0.1`.

- [ ] **Step 2: Run the server tests and verify RED**

Run:

```powershell
node --test scripts/transition-editor/server.test.mjs
```

Expected: FAIL because `server.mjs` does not exist.

- [ ] **Step 3: Implement the local server**

Use `node:http`, `node:fs/promises`, and `node:path`. Parse request bodies with a
small JSON size limit. Before saving, re-read the latest manifest, apply the
pure update, write formatted JSON plus a trailing newline to a sibling temporary
file, then rename it over the manifest. Return JSON error messages without stack
traces.

The CLI must support:

```powershell
npm.cmd run edit:transitions
npm.cmd run edit:transitions -- --source "D:\video\monkey"
```

Print the local URL and source directory on startup. Add:

```json
"edit:transitions": "node scripts/transition-editor/server.mjs"
```

to `package.json`.

- [ ] **Step 4: Run the server and model tests**

Run:

```powershell
node --test scripts/transition-editor/model.test.mjs scripts/transition-editor/server.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 5: Commit the server**

```powershell
git add package.json scripts/transition-editor/server.mjs scripts/transition-editor/server.test.mjs
git commit -m "feat: serve local transition editor"
```

---

### Task 3: Browser transition editor

**Files:**
- Create: `scripts/transition-editor/index.html`
- Create: `scripts/transition-editor/styles.css`
- Create: `scripts/transition-editor/app.js`
- Create: `scripts/transition-editor/ui.test.mjs`

**Interfaces:**
- Consumes the Task 2 endpoints.
- Produces an accessible browser interface with boundary selection, source
  players, frame stepping, looped hard-cut preview, save, and reset.

- [ ] **Step 1: Write failing UI structure tests**

Read the static files and assert that the HTML provides:

- the boundary selector;
- two source video elements;
- end/start capture buttons;
- four frame-step buttons;
- two preview video elements;
- preview, save, and reset controls;
- a status region with `aria-live="polite"`.

Assert that `app.js` requests `/api/scenes`, uses
`PUT /api/boundaries/`, switches the preview from left to right without CSS
opacity blending, and uses a frame step of `1 / 24`.

- [ ] **Step 2: Run the UI test and verify RED**

Run:

```powershell
node --test scripts/transition-editor/ui.test.mjs
```

Expected: FAIL because the UI files do not exist.

- [ ] **Step 3: Implement the static interface**

Use the existing dark Monkey visual language without importing site assets.
Display the selected boundary as `clip 1 → clip 2`. Keep both source players
visible with exact time readouts.

Preview behavior:

1. Seek the left preview to `max(trimStart, trimEnd - 2)`.
2. Play until `trimEnd`.
3. Hide and pause the left preview.
4. Show the right preview at `trimStart`.
5. Play until `min(trimEnd, trimStart + 2)`.
6. Restart at step 1 while loop mode is enabled.

Save sends both currently selected cut points. Reset sends `{ "reset": true }`.
Disable saving while a request is active and report success or failure in the
live status region.

- [ ] **Step 4: Run all editor tests**

Run:

```powershell
node --test scripts/transition-editor/*.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 5: Commit the UI**

```powershell
git add scripts/transition-editor/index.html scripts/transition-editor/styles.css scripts/transition-editor/app.js scripts/transition-editor/ui.test.mjs
git commit -m "feat: add transition editor interface"
```

---

### Task 4: Apply trims in the master-film builder

**Files:**
- Modify: `scripts/build-scroll-story.ps1`
- Modify: `scripts/transition-editor/model.test.mjs`

**Interfaces:**
- Consumes optional numeric `trimStart` and `trimEnd` values from each manifest
  scene.
- Produces FFmpeg trim filters and timeline offsets based on effective durations.

- [ ] **Step 1: Add a failing builder contract test**

Extend the model test file to read `scripts/build-scroll-story.ps1` and assert
that it contains:

- fallback of `trimStart` to `0`;
- fallback of `trimEnd` to `duration`;
- FFmpeg `trim=start=...:end=...`;
- timeline calculations based on `trimEnd - trimStart`.

- [ ] **Step 2: Run the contract test and verify RED**

Run:

```powershell
node --test scripts/transition-editor/model.test.mjs
```

Expected: FAIL because the builder still trims only by duration.

- [ ] **Step 3: Implement trim-aware FFmpeg filters**

For each scene, calculate validated effective values and generate:

```text
[index:v]trim=start=<trimStart>:end=<trimEnd>,setpts=PTS-STARTPTS,...
```

Store each effective play duration and use those values for the initial
timeline and every subsequent transition offset. Throw a readable error when
the manifest contains an invalid range.

- [ ] **Step 4: Run tests and a non-destructive manifest validation**

Run:

```powershell
node --test scripts/transition-editor/*.test.mjs
npm.cmd run check:scroll-story
```

Expected: all tests PASS. Do not rebuild the master film yet because no trim
points have been selected.

- [ ] **Step 5: Commit the builder integration**

```powershell
git add scripts/build-scroll-story.ps1 scripts/transition-editor/model.test.mjs
git commit -m "feat: apply scene trims to scroll story"
```

---

### Task 5: End-to-end verification and usage handoff

**Files:**
- Modify: `README.md` only if it exists; otherwise create
  `docs/transition-editor.md`
- Test: all files from earlier tasks

**Interfaces:**
- Produces concise usage instructions for starting, selecting, previewing,
  saving, resetting, and rebuilding.

- [ ] **Step 1: Write the usage documentation**

Document:

```powershell
npm.cmd run edit:transitions
```

and the optional `--source` parameter. State explicitly that saving edits only
the manifest and that the original videos and current master remain unchanged
until `scripts/build-scroll-story.ps1` is run.

- [ ] **Step 2: Start the editor and verify the desk-to-laptop boundary**

Start the server, request `/api/scenes`, open the local editor, and confirm that:

- the `desk → laptop` boundary is selected;
- both clips load;
- frame stepping changes the displayed time by approximately `0.0417` seconds;
- preview switches directly from the left video to the right video;
- save and reset round-trip through the manifest.

Reset the boundary after the verification so no editorial trim decision is
committed accidentally.

- [ ] **Step 3: Run the full repository verification**

Run:

```powershell
node --test scripts/transition-editor/*.test.mjs
npm.cmd run check:scroll-story
npm.cmd run check:monkey
npm.cmd run build
git diff --check
```

Expected: every command exits successfully with no unexpected warnings.

- [ ] **Step 4: Commit documentation**

```powershell
git add docs/transition-editor.md
git commit -m "docs: explain transition editor"
```

- [ ] **Step 5: Report the local URL and first workflow**

Tell the user how to start the editor and ask them to select the desired
`desk → laptop` cut. Do not rebuild the master until they approve the first
saved boundary.
