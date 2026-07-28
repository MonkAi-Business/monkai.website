# Monkey Autoplay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible play and pause control that automatically moves through the desktop Monkey scrollstory at eight seconds per chapter and stops with the complete contact panel visible.

**Architecture:** A new pure utility calculates frame-by-frame scroll positions and restart behavior. `ScrollStory.astro` owns the button, browser events, animation frame loop, theme integration and the actual scrolling. The existing video timing and master film remain unchanged.

**Tech Stack:** Astro, browser JavaScript modules, requestAnimationFrame, Node.js contract checks

## Global Constraints

- Autoplay is available only in desktop Monkey mode.
- Autoplay is hidden when `prefers-reduced-motion: reduce` is active.
- The tour starts from the current story position.
- Starting at or beyond the contact endpoint restarts at the story beginning.
- Every chapter before Contact receives eight seconds.
- The start of Contact is the autoplay endpoint, not the story or document bottom.
- Manual wheel, touch, pointer and scroll-key input pauses autoplay.
- Theme changes, breakpoint changes and a hidden browser tab pause autoplay.
- The existing 85/15 video timing, chapters, film and crossfades do not change.
- New project copy and commit messages use regular hyphens, not em dashes or en dashes.
- No new runtime dependency is introduced.

---

### Task 1: Build the pure autoplay calculation

**Files:**
- Create: `src/utils/scrollStoryAutoplay.mjs`
- Modify: `scripts/check-scroll-story.mjs`
- Test: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Consumes: absolute scroll positions, elapsed frame time, story start, contact start and the number of moving chapters
- Produces: `advanceAutoScroll(options): { position: number, done: boolean }`
- Produces: `resolveAutoScrollStart(current, start, end): number`
- Produces: `AUTO_SCROLL_CHAPTER_MS: 8000`

- [ ] **Step 1: Add failing imports and hand-calculated assertions**

Add this import to `scripts/check-scroll-story.mjs`:

```js
import {
  AUTO_SCROLL_CHAPTER_MS,
  advanceAutoScroll,
  resolveAutoScrollStart,
} from '../src/utils/scrollStoryAutoplay.mjs';
```

Add these assertions after the existing timing assertions:

```js
const autoplayStep = advanceAutoScroll({
  position: 100,
  elapsedMs: 4000,
  start: 0,
  end: 800,
  chapterCount: 1,
});

expect(AUTO_SCROLL_CHAPTER_MS === 8000, 'Autoplay moet acht seconden per hoofdstuk gebruiken.');
expect(
  approximately(autoplayStep.position, 500) && autoplayStep.done === false,
  'Autoplay moet met een constant hoofdstuktempo vooruitgaan.',
);

const autoplayEnd = advanceAutoScroll({
  position: 750,
  elapsedMs: 1000,
  start: 0,
  end: 800,
  chapterCount: 1,
});

expect(
  autoplayEnd.position === 800 && autoplayEnd.done === true,
  'Autoplay moet exact aan het contacteindpunt stoppen.',
);
expect(
  resolveAutoScrollStart(800, 0, 800) === 0,
  'Play aan het einde moet opnieuw aan het begin starten.',
);
expect(
  resolveAutoScrollStart(320, 0, 800) === 320,
  'Play binnen de story moet vanaf de huidige positie hervatten.',
);
```

- [ ] **Step 2: Run the check and verify the missing module failure**

Run: `npm.cmd run check:scroll-story`

Expected: exit code 1 with `ERR_MODULE_NOT_FOUND` for `scrollStoryAutoplay.mjs`.

- [ ] **Step 3: Create a minimal stub and verify real assertion failures**

Create `src/utils/scrollStoryAutoplay.mjs`:

```js
export const AUTO_SCROLL_CHAPTER_MS = 8000;

export function advanceAutoScroll() {
  return { position: 0, done: false };
}

export function resolveAutoScrollStart() {
  return 0;
}
```

Run: `npm.cmd run check:scroll-story`

Expected: exit code 1 on the constant-tempo and contact-endpoint assertions.

- [ ] **Step 4: Implement the minimal pure functions**

Replace the stub with:

```js
export const AUTO_SCROLL_CHAPTER_MS = 8000;

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(value, minimum), maximum);

export function resolveAutoScrollStart(current, start, end) {
  if (current >= end - 1) return start;
  return clamp(current, start, end);
}

export function advanceAutoScroll({
  position,
  elapsedMs,
  start,
  end,
  chapterCount,
}) {
  const distance = Math.max(end - start, 0);
  const duration = Math.max(chapterCount, 0) * AUTO_SCROLL_CHAPTER_MS;

  if (distance === 0 || duration === 0) {
    return { position: start, done: true };
  }

  const speed = distance / duration;
  const nextPosition = clamp(
    position + speed * Math.max(elapsedMs, 0),
    start,
    end,
  );

  return {
    position: nextPosition,
    done: nextPosition >= end,
  };
}
```

- [ ] **Step 5: Run the focused checks**

Run:

```powershell
npm.cmd run check:scroll-story
npm.cmd run check:monkey
```

Expected: both commands exit with code 0.

- [ ] **Step 6: Commit the pure autoplay calculation**

```powershell
git add src/utils/scrollStoryAutoplay.mjs scripts/check-scroll-story.mjs
git commit -m "test: define monkey autoplay timing"
```

---

### Task 2: Add the accessible play and pause control

**Files:**
- Modify: `scripts/check-scroll-story.mjs`
- Modify: `src/utils/scrollStoryAutoplay.mjs`
- Modify: `src/components/ScrollStory.astro`
- Test: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Produces: `autoplayButtonState(playing): { ariaLabel: string, ariaPressed: string, playing: string }`
- Produces: `isAutoplayScrollKey(key): boolean`
- Consumes: `data-story-autoplay` as the browser script hook
- Produces: a real button with `aria-label`, `aria-pressed` and `data-playing`

- [ ] **Step 1: Add failing control-state assertions**

Extend the autoplay import in `scripts/check-scroll-story.mjs` with:

```js
autoplayButtonState,
isAutoplayScrollKey,
```

Add:

```js
const stoppedButton = autoplayButtonState(false);
const playingButton = autoplayButtonState(true);

expect(
  stoppedButton.ariaLabel === 'Monkey-tour afspelen'
    && stoppedButton.ariaPressed === 'false'
    && stoppedButton.playing === 'false',
  'De gestopte autoplayknop moet een toegankelijke Play-status geven.',
);
expect(
  playingButton.ariaLabel === 'Monkey-tour pauzeren'
    && playingButton.ariaPressed === 'true'
    && playingButton.playing === 'true',
  'De actieve autoplayknop moet een toegankelijke Pauze-status geven.',
);
expect(
  isAutoplayScrollKey('PageDown') && !isAutoplayScrollKey('Enter'),
  'Alleen toetsen die de pagina scrollen mogen autoplay stoppen.',
);
```

- [ ] **Step 2: Run the check and verify RED**

Run: `npm.cmd run check:scroll-story`

Expected: exit code 1 because `autoplayButtonState` and `isAutoplayScrollKey` are not exported.

- [ ] **Step 3: Implement the control-state functions**

Add to `src/utils/scrollStoryAutoplay.mjs`:

```js
const autoplayScrollKeys = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
  ' ',
]);

export function autoplayButtonState(playing) {
  return {
    ariaLabel: playing ? 'Monkey-tour pauzeren' : 'Monkey-tour afspelen',
    ariaPressed: String(playing),
    playing: String(playing),
  };
}

export function isAutoplayScrollKey(key) {
  return autoplayScrollKeys.has(key);
}
```

Run: `npm.cmd run check:scroll-story`

Expected: exit code 0.

- [ ] **Step 4: Add the button markup**

Add this button inside `.monkey-stage`, after `.monkey-progress`:

```astro
<button
  class="monkey-autoplay"
  type="button"
  aria-label="Monkey-tour afspelen"
  aria-pressed="false"
  data-story-autoplay
  data-playing="false"
>
  <span class="monkey-autoplay-icon" aria-hidden="true"></span>
</button>
```

- [ ] **Step 5: Add the visual states**

Add styles beside the progress control:

```css
.monkey-autoplay {
  position: absolute;
  bottom: 24px;
  left: 50%;
  z-index: 3;
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 999px;
  background: rgba(3, 13, 19, 0.72);
  color: #fff;
  cursor: pointer;
  transform: translateX(-50%);
  backdrop-filter: blur(12px);
}

.monkey-autoplay:hover {
  border-color: rgba(196, 225, 188, 0.84);
  background: rgba(38, 64, 48, 0.82);
}

.monkey-autoplay:focus-visible {
  outline: 3px solid #c4e1bc;
  outline-offset: 4px;
}

.monkey-autoplay-icon {
  width: 0;
  height: 0;
  margin-left: 3px;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 11px solid currentColor;
}

.monkey-autoplay[data-playing='true'] .monkey-autoplay-icon {
  width: 12px;
  height: 14px;
  margin-left: 0;
  border: 0;
  background:
    linear-gradient(90deg, currentColor 0 4px, transparent 4px 8px, currentColor 8px 12px);
}
```

- [ ] **Step 6: Run the focused checks and verify GREEN**

Run:

```powershell
npm.cmd run check:scroll-story
npm.cmd run check:monkey
```

Expected: both commands exit with code 0.

- [ ] **Step 7: Commit the control**

```powershell
git add scripts/check-scroll-story.mjs src/utils/scrollStoryAutoplay.mjs src/components/ScrollStory.astro
git commit -m "feat: add monkey tour control"
```

---

### Task 3: Wire continuous autoplay and manual takeover

**Files:**
- Modify: `src/components/ScrollStory.astro`
- Test: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Consumes: `advanceAutoScroll`, `resolveAutoScrollStart` and `data-story-autoplay`
- Produces: one animation frame loop with `startAutoplay()`, `stopAutoplay()` and `toggleAutoplay()`

- [ ] **Step 1: Import the utility and query the controls**

At the start of the client script, add:

```ts
import {
  advanceAutoScroll,
  autoplayButtonState,
  isAutoplayScrollKey,
  resolveAutoScrollStart,
} from '../utils/scrollStoryAutoplay.mjs';
```

Inside the `if (story)` block, add:

```ts
const autoplayButton = story.querySelector<HTMLButtonElement>('[data-story-autoplay]');
const contactChapter = story.querySelector<HTMLElement>('[data-chapter="contact"]');
```

- [ ] **Step 2: Add autoplay state and button synchronization**

Beside the existing animation state, add:

```ts
let autoplayFrame = 0;
let autoplayTimestamp = 0;
let autoplayPlaying = false;

function syncAutoplayButton() {
  if (!autoplayButton) return;
  const state = autoplayButtonState(autoplayPlaying);
  autoplayButton.dataset.playing = state.playing;
  autoplayButton.setAttribute('aria-pressed', state.ariaPressed);
  autoplayButton.setAttribute('aria-label', state.ariaLabel);
}

function stopAutoplay() {
  if (autoplayFrame) window.cancelAnimationFrame(autoplayFrame);
  autoplayFrame = 0;
  autoplayTimestamp = 0;
  autoplayPlaying = false;
  syncAutoplayButton();
}
```

- [ ] **Step 3: Add the frame loop with Contact as endpoint**

Add:

```ts
function autoplayBounds() {
  if (!contactChapter) return null;
  const storyTop = window.scrollY + story.getBoundingClientRect().top;
  const contactTop = window.scrollY + contactChapter.getBoundingClientRect().top;
  return {
    start: storyTop,
    end: contactTop,
    chapterCount: Math.max(chapterElements.length - 1, 0),
  };
}

function autoplayTick(timestamp: number) {
  if (!autoplayPlaying || !canScrub() || document.hidden) {
    stopAutoplay();
    return;
  }

  const bounds = autoplayBounds();
  if (!bounds || bounds.end <= bounds.start) {
    stopAutoplay();
    return;
  }

  if (!autoplayTimestamp) autoplayTimestamp = timestamp;
  const step = advanceAutoScroll({
    position: window.scrollY,
    elapsedMs: timestamp - autoplayTimestamp,
    ...bounds,
  });
  autoplayTimestamp = timestamp;
  window.scrollTo({ top: step.position, behavior: 'auto' });

  if (step.done) {
    stopAutoplay();
    return;
  }

  autoplayFrame = window.requestAnimationFrame(autoplayTick);
}

function startAutoplay() {
  if (!canScrub()) return;
  const bounds = autoplayBounds();
  if (!bounds || bounds.end <= bounds.start) return;

  const startPosition = resolveAutoScrollStart(
    window.scrollY,
    bounds.start,
    bounds.end,
  );
  window.scrollTo({ top: startPosition, behavior: 'auto' });
  autoplayPlaying = true;
  autoplayTimestamp = 0;
  syncAutoplayButton();
  autoplayFrame = window.requestAnimationFrame(autoplayTick);
}

function toggleAutoplay() {
  if (autoplayPlaying) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
}
```

- [ ] **Step 4: Connect control and manual takeover events**

Add:

```ts
autoplayButton?.addEventListener('click', toggleAutoplay);
window.addEventListener('wheel', stopAutoplay, { passive: true });
window.addEventListener('touchstart', stopAutoplay, { passive: true });
window.addEventListener('pointerdown', (event) => {
  if (event.target instanceof Node && !autoplayButton?.contains(event.target)) {
    stopAutoplay();
  }
}, { passive: true });
window.addEventListener('keydown', (event) => {
  if (isAutoplayScrollKey(event.key)) stopAutoplay();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAutoplay();
});
```

At the start of `syncMode()`, add:

```ts
if (!canScrub()) stopAutoplay();
```

Call `syncAutoplayButton()` before the first `syncMode()`.

- [ ] **Step 5: Run the focused checks**

Run:

```powershell
npm.cmd run check:scroll-story
npm.cmd run check:monkey
```

Expected: both commands exit with code 0.

- [ ] **Step 6: Commit the interaction**

```powershell
git add src/components/ScrollStory.astro
git commit -m "feat: autoplay monkey scrollstory"
```

---

### Task 4: Verify desktop behavior and the final contact frame

**Files:**
- Verify: `src/components/ScrollStory.astro`
- Verify: `src/utils/scrollStoryAutoplay.mjs`

**Interfaces:**
- Consumes: the finished autoplay control
- Produces: verified desktop behavior without rebuilding the master film

- [ ] **Step 1: Run the production build**

Run: `npm.cmd run build`

Expected: Astro builds all routes and exits with code 0.

- [ ] **Step 2: Verify the button in a desktop browser**

At 1920x1080 in Monkey mode, verify:

- the play button is centered at the bottom;
- Play changes to Pause after activation;
- the page moves continuously rather than jumping by chapter;
- Pause leaves the current scroll position unchanged;
- a second Play resumes from that position.

- [ ] **Step 3: Verify manual takeover**

While the tour is active, verify separately that wheel input and a scroll key:

- stop movement;
- restore the Play label;
- retain the current scroll position.

- [ ] **Step 4: Verify the endpoint**

Resume near the FAQ chapter and let autoplay finish. Verify:

- the final scroll position equals the top of the Contact chapter within one pixel;
- the complete contact panel is inside the 1920x1080 viewport;
- the contact chapter is active;
- the last FAQ film frame remains visible;
- the button returns to Play.

- [ ] **Step 5: Run final verification**

Run:

```powershell
npm.cmd run check:monkey
npm.cmd run check:scroll-story
npm.cmd run build
git diff --check
git status --short
```

Expected: all commands exit with code 0, the diff has no whitespace errors and only the intended implementation files are modified.

- [ ] **Step 6: Commit any verification-only fixes**

Only when Step 2 through Step 4 required a code adjustment:

```powershell
git add src/components/ScrollStory.astro src/utils/scrollStoryAutoplay.mjs scripts/check-scroll-story.mjs
git commit -m "fix: polish monkey autoplay"
```
