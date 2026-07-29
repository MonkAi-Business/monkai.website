# Hard Cuts and Final Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the generated scroll film match the transition editor’s hard-cut previews and end on the contact-card frame at source time 7.60 seconds.

**Architecture:** The PowerShell/FFmpeg builder keeps the existing per-scene trim filters, then joins all normalized video streams with one `concat` filter instead of overlapping them with `xfade`. The manifest owns the final contact trim, while `ScrollStory.astro` owns the matching thematic chapter ranges.

**Tech Stack:** PowerShell, FFmpeg, Node.js test runner, Astro.

## Global Constraints

- All fifteen scene transitions are hard cuts.
- Saved `trimStart` and `trimEnd` values are the only cut boundaries.
- No crossfade or time overlap may be added by the builder.
- The contact clip ends at source time `7.60` seconds with the card visible and both eyes open.
- The contact panel remains left-aligned and vertically centered at the automatic scroll endpoint.
- MP4 and WebM contain video only at 1280×720 and 24 fps.
- Do not add new dependencies or transition types.

---

### Task 1: Replace master-film crossfades with hard concatenation

**Files:**
- Modify: `scripts/transition-editor/builder.test.mjs`
- Modify: `scripts/build-scroll-story.ps1`

**Interfaces:**
- Consumes: the ordered manifest scenes and their effective trim durations.
- Produces: an FFmpeg filter ending in `[v0][v1]...concat=n=<count>:v=1:a=0[story]`.
- Produces: `timeline` equal to the sum of all effective durations.

- [ ] **Step 1: Change the builder test to require a hard cut**

Add these assertions to the existing two-scene PlanOnly test:

```js
assert.match(plan.filter, /\[v0\]\[v1\]concat=n=2:v=1:a=0\[story\]/);
assert.doesNotMatch(plan.filter, /xfade=/);
assert.equal(plan.timeline, 14.8);
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node --test scripts/transition-editor/builder.test.mjs
```

Expected: FAIL because the filter still contains `xfade` and reports `14.62`.

- [ ] **Step 3: Implement hard concatenation**

Keep the existing trim/scale/fps filters. Replace the xfade loop with:

```powershell
$concatInputs = (0..($scenes.Count - 1) | ForEach-Object { "[v$_]" }) -join ''
$filterParts += "${concatInputs}concat=n=$($scenes.Count):v=1:a=0[story]"
$timeline = ($effectiveDurations | Measure-Object -Sum).Sum
```

Do not read or subtract the manifest `transition` values.

- [ ] **Step 4: Run the builder test and verify GREEN**

Run:

```powershell
node --test scripts/transition-editor/builder.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the builder change**

```powershell
git add scripts/build-scroll-story.ps1 scripts/transition-editor/builder.test.mjs
git commit -m "fix: make scroll story cuts exact"
```

---

### Task 2: Pin the open-eye finale and resynchronize chapter ranges

**Files:**
- Modify: `scripts/monkey-scenes.json`
- Modify: `scripts/check-scroll-story.mjs`
- Modify: `src/components/ScrollStory.astro`

**Interfaces:**
- Consumes: the hard-cut builder timeline.
- Produces: a contact effective trim of `0.999688` through `7.60`.
- Produces: thematic ranges ending at `119.71` seconds.

- [ ] **Step 1: Change the scrollstory check to require the new ending**

Update the contact assertion to require:

```js
manifest.find((scene) => scene.id === 'contact')?.trimEnd === 7.6
```

Require these final chapter rows:

```text
{ id: 'faq', timeStart: 106.08, timeEnd: 113.11, footage: 'ready' }
{ id: 'contact', timeStart: 113.11, timeEnd: 119.71, footage: 'ready' }
```

- [ ] **Step 2: Run the check and verify RED**

Run:

```powershell
npm.cmd run check:scroll-story
```

Expected: FAIL because the manifest lacks `contact.trimEnd` and the component still uses the crossfade timeline.

- [ ] **Step 3: Apply the final trim and full hard-cut chapter timeline**

Set the contact scene to:

```json
"trimStart": 0.999688,
"trimEnd": 7.6,
"transition": 0.18
```

The builder ignores `transition`; it remains only for manifest compatibility.

Replace the chapter ranges with:

```text
hero             0.00 →   8.00
problemen        8.00 →  15.01
overdracht      15.01 →  32.64
team            32.64 →  50.03
aanpak          50.03 →  57.03
niveaus         57.03 →  64.05
use-cases       64.05 →  71.09
diensten        71.09 →  77.04
breder-dan-chat 77.04 →  85.00
ai-act          85.00 →  92.03
afspraak        92.03 →  99.06
blog            99.06 → 106.08
faq            106.08 → 113.11
contact        113.11 → 119.71
```

- [ ] **Step 4: Verify the plan and scrollstory check**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\build-scroll-story.ps1 -PlanOnly
npm.cmd run check:scroll-story
```

Expected: no `xfade`, sixteen concat inputs, timeline `119.712873`, and a passing scrollstory check.

- [ ] **Step 5: Commit the synchronized timing**

```powershell
git add scripts/monkey-scenes.json scripts/check-scroll-story.mjs src/components/ScrollStory.astro
git commit -m "fix: pin monkey finale frame"
```

---

### Task 3: Rebuild and verify the final master assets

**Files:**
- Modify: `public/media/scroll-story/monkai-scroll-story.mp4`
- Modify: `public/media/scroll-story/monkai-scroll-story.webm`

**Interfaces:**
- Consumes: the final manifest and concat filter.
- Produces: synchronized MP4 and WebM master films.

- [ ] **Step 1: Rebuild both master formats**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\build-scroll-story.ps1
```

Expected: MP4, WebM, and poster generation complete without an audio stream.

- [ ] **Step 2: Inspect hard-cut boundaries and final frame**

Extract frames immediately before and after representative boundaries, including `desk → laptop`, `services → beyond-chat`, and `faq → contact`. Confirm there is no blended double image. Extract the last frame near `119.68` seconds and confirm that the card and both open eyes are visible.

- [ ] **Step 3: Run full verification**

Run:

```powershell
node --test scripts/transition-editor/*.test.mjs
npm.cmd run check:scroll-story
npm.cmd run check:monkey
npm.cmd run build
git diff --check
```

Expected: 19 editor tests pass, both repository checks pass, all Astro pages build, and no whitespace errors are reported.

- [ ] **Step 4: Commit the final assets**

```powershell
git add public/media/scroll-story/monkai-scroll-story.mp4 public/media/scroll-story/monkai-scroll-story.webm
git commit -m "feat: rebuild scroll story with hard cuts"
```

- [ ] **Step 5: Report the final duration and commit IDs**

Report the verified MP4/WebM duration, open-eye final frame, passing checks, and the commits on `feature/kickass-chat`.
