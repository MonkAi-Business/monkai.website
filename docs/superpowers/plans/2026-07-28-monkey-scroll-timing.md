# Monkey Scroll Timing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the Monkey mode film moving through 85 percent of every scroll chapter, retain a 15 percent reading pause, and move the approach panel to the right.

**Architecture:** Extract the pure progress-to-video-time calculation into a small browser-compatible module so the exact 85/15 behavior can be tested directly. `ScrollStory.astro` imports that function and keeps all DOM, scrolling, rendering, and panel behavior in the existing component.

**Tech Stack:** Astro, browser JavaScript modules, Node.js contract checks

## Global Constraints

- The existing master film, chapter times, crossfades, panel animation durations, and chapter heights do not change.
- Contact keeps holding the final FAQ frame until its source clip exists.
- Monkey mode remains desktop-only.
- New project copy and commit messages use regular hyphens, not em dashes or en dashes.
- No new runtime dependency is introduced.

---

### Task 1: Make the 85/15 timing directly testable

**Files:**
- Create: `src/utils/scrollStoryTiming.mjs`
- Modify: `scripts/check-scroll-story.mjs`
- Modify: `src/components/ScrollStory.astro`
- Test: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Consumes: normalized story progress from `0` through `1` and chapter objects with numeric `timeStart` and `timeEnd`
- Produces: `progressToTime(progress, chapterTimings): number`

- [ ] **Step 1: Write the failing timing assertions**

Import the wished-for production function and add hand-calculated expectations:

```js
import { progressToTime } from '../src/utils/scrollStoryTiming.mjs';

const sampleTimings = [{ timeStart: 10, timeEnd: 18 }];
const approximately = (actual, expected) => Math.abs(actual - expected) < 0.001;

expect(
  approximately(progressToTime(0.42, sampleTimings), 13.952941),
  'Bij 42 procent mag de clip niet langer op het eindframe staan.',
);
expect(
  approximately(progressToTime(0.85, sampleTimings), 18),
  'Bij 85 procent moet de clip het eindframe bereiken.',
);
expect(
  approximately(progressToTime(1, sampleTimings), 18),
  'De laatste 15 procent moet het eindframe vasthouden.',
);
```

- [ ] **Step 2: Run the check and observe the missing-module failure**

Run: `npm.cmd run check:scroll-story`

Expected: the check exits nonzero with `ERR_MODULE_NOT_FOUND` for `scrollStoryTiming.mjs`.

- [ ] **Step 3: Add the minimal stub and observe a real assertion failure**

Create the module with:

```js
export function progressToTime() {
  return 0;
}
```

Run: `npm.cmd run check:scroll-story`

Expected: FAIL on the new timing assertions rather than a module-loading error.

- [ ] **Step 4: Implement the 85/15 calculation**

Replace the stub with:

```js
export function progressToTime(progress, chapterTimings) {
  const chapterPosition = Math.min(
    Math.max(progress, 0) * chapterTimings.length,
    chapterTimings.length - Number.EPSILON,
  );
  const chapterIndex = Math.min(
    Math.floor(chapterPosition),
    chapterTimings.length - 1,
  );
  const local = chapterPosition - chapterIndex;
  const move = local < 0.85 ? local / 0.85 : 1;
  const chapter = chapterTimings[chapterIndex];
  return chapter.timeStart + (chapter.timeEnd - chapter.timeStart) * move;
}
```

- [ ] **Step 5: Use the shared function in the component**

At the start of the component client script:

```ts
import { progressToTime } from '../utils/scrollStoryTiming.mjs';
```

Remove the old inline function containing the `0.42` boundary. Leave `updateTarget`, rendering interpolation, seeking frequency, and all chapter times unchanged.

- [ ] **Step 6: Run the focused checks**

Run:

```powershell
npm.cmd run check:scroll-story
npm.cmd run check:monkey
```

Expected: both checks exit with code 0.

---

### Task 2: Move the approach panel to the right

**Files:**
- Modify: `scripts/check-scroll-story.mjs`
- Modify: `src/components/ScrollStory.astro`
- Test: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Consumes: the existing `data-panel-side` layout contract
- Produces: `data-panel-side="right"` for the `aanpak` chapter and a right-oriented video shade

- [ ] **Step 1: Change the expected layout first**

Update the existing layout map:

```js
aanpak: ['right', 'middle', 'compact'],
```

- [ ] **Step 2: Run the check and verify RED**

Run: `npm.cmd run check:scroll-story`

Expected: FAIL with `aanpak heeft de verkeerde paneelzijde`.

- [ ] **Step 3: Change only the approach chapter side**

Update the chapter markup:

```astro
data-chapter="aanpak"
data-panel-side="right"
data-panel-vertical="middle"
data-panel-size="compact"
```

- [ ] **Step 4: Run the focused checks and verify GREEN**

Run:

```powershell
npm.cmd run check:scroll-story
npm.cmd run check:monkey
```

Expected: both checks exit with code 0.

- [ ] **Step 5: Commit the implementation**

```powershell
git add src/utils/scrollStoryTiming.mjs scripts/check-scroll-story.mjs src/components/ScrollStory.astro
git commit -m "fix: keep monkey story moving"
```

---

### Task 3: Verify the combined desktop behavior

**Files:**
- Verify: `src/components/ScrollStory.astro`
- Verify: `src/utils/scrollStoryTiming.mjs`

**Interfaces:**
- Consumes: the 85/15 mapping and right-side approach layout
- Produces: verified browser behavior with no media rebuild

- [ ] **Step 1: Run the production build**

Run: `npm.cmd run build`

Expected: Astro builds all routes and exits with code 0.

- [ ] **Step 2: Check timing in a desktop browser**

At a `1920x1080` viewport in Monkey mode, inspect one eight-second chapter at these local positions:

- 42 percent maps near 3.95 seconds after `timeStart`, not the end;
- 85 percent maps to `timeEnd`;
- 100 percent still maps to `timeEnd`.

- [ ] **Step 3: Check the approach chapter**

Navigate to `#monkey-aanpak` and verify:

- the active side is `right`;
- the panel remains fully inside the viewport;
- the progress indicator on the far right remains visible;
- the panel covers the intentionally hidden part of the animation.

- [ ] **Step 4: Run final verification**

Run:

```powershell
npm.cmd run check:monkey
npm.cmd run check:scroll-story
npm.cmd run build
git diff --check
```

Expected: all commands exit with code 0 and no whitespace errors are reported.
