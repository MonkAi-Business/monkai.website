# Monkey Buffer Loader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Toon in Monkey Mode echte videobufferprogressie met een apenstaart en geef de tour vrij zodra de eerste scène veilig speelbaar is.

**Architecture:** Een kleine pure utility vertaalt `TimeRanges`-achtige data naar bufferpercentage en een `ready`-status. `ScrollStory.astro` gebruikt die status om een SVG-loader bij te werken, autoplay tijdelijk te blokkeren en de loader na acht gebufferde seconden te verwijderen.

**Tech Stack:** Astro, browser video API, TypeScript in Astro scripts, SVG, CSS, Node test runner.

## Global Constraints

- De loader wordt alleen geactiveerd op desktop wanneer Monkey Mode actief is.
- Buiten Monkey Mode worden geen videobestanden geladen.
- De eerste scène is klaar bij minimaal acht gebufferde seconden en `readyState >= 3`.
- De rest van de video blijft na het verdwijnen van de loader op de achtergrond laden.
- Bij verminderde beweging zijn er geen pulserende of draaiende animaties.
- Een laadfout mag de gewone website niet blokkeren.

---

### Task 1: Bufferstatus en tail-loader

**Files:**
- Create: `src/utils/scrollStoryBuffer.mjs`
- Create: `src/utils/scrollStoryBuffer.test.mjs`
- Modify: `src/components/ScrollStory.astro`
- Modify: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Produces: `bufferedEnd(ranges): number`
- Produces: `bufferStatus({ duration, bufferedUntil, readyState, requiredSeconds }): { progress: number, ready: boolean }`
- Consumes: `HTMLVideoElement.buffered`, `duration`, `readyState`, `progress`, `canplay`, `error`

- [ ] **Step 1: Schrijf falende unittests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { bufferedEnd, bufferStatus } from './scrollStoryBuffer.mjs';

test('bufferedEnd returns the furthest buffered point', () => {
  const ranges = { length: 2, end: (index) => [4, 11][index] };
  assert.equal(bufferedEnd(ranges), 11);
});

test('bufferStatus unlocks after eight seconds with future data', () => {
  assert.deepEqual(
    bufferStatus({ duration: 120, bufferedUntil: 8, readyState: 3, requiredSeconds: 8 }),
    { progress: 7, ready: true },
  );
});
```

- [ ] **Step 2: Verifieer dat de tests falen**

Run: `node --test src/utils/scrollStoryBuffer.test.mjs`

Expected: FAIL omdat `scrollStoryBuffer.mjs` nog niet bestaat.

- [ ] **Step 3: Implementeer de pure bufferfuncties**

```js
export const bufferedEnd = (ranges) => {
  let furthest = 0;
  for (let index = 0; index < ranges.length; index += 1) {
    furthest = Math.max(furthest, ranges.end(index));
  }
  return furthest;
};

export const bufferStatus = ({
  duration,
  bufferedUntil,
  readyState,
  requiredSeconds = 8,
}) => ({
  progress: Number.isFinite(duration) && duration > 0
    ? Math.round(Math.min(1, Math.max(0, bufferedUntil / duration)) * 100)
    : 0,
  ready: bufferedUntil >= requiredSeconds && readyState >= 3,
});
```

- [ ] **Step 4: Voeg loader-markup en contractchecks toe**

Voeg een `data-story-loader` statusblok toe met:

```html
<svg viewBox="0 0 72 72" aria-hidden="true">
  <path class="monkey-loader-tail-track" d="M52 16c-16-8-34 4-32 22 2 17 24 24 36 12 10-10 5-26-8-27-10-1-16 10-10 16 6 7 17 2 15-6" />
  <path class="monkey-loader-tail-progress" data-story-loader-tail d="M52 16c-16-8-34 4-32 22 2 17 24 24 36 12 10-10 5-26-8-27-10-1-16 10-10 16 6 7 17 2 15-6" />
</svg>
<span data-story-loader-value>0%</span>
```

Laat `scripts/check-scroll-story.mjs` controleren op `data-story-loader`, `data-story-loader-tail`, `data-story-loader-value`, `aria-disabled` en de foutstatus.

- [ ] **Step 5: Koppel de loader aan de video**

Importeer de utility in `ScrollStory.astro`. Werk de status bij op `loadedmetadata`, `progress`, `canplay`, `canplaythrough` en `error`. Houd autoplay uitgeschakeld tot `ready === true`, werk `stroke-dashoffset` bij met de bufferprogressie en verwijder de loader na gereedmelding. Bij een fout wordt “Video kon niet laden” getoond en blijft de pagina navigeerbaar.

- [ ] **Step 6: Voeg styling en reduced-motion toe**

Maak een compacte halftransparante badge, animeer alleen de kleine staartpunt en schakel die animatie uit binnen `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 7: Draai gerichte en volledige verificatie**

Run:

```powershell
node --test src/utils/scrollStoryBuffer.test.mjs
npm.cmd run check:scroll-story
npm.cmd run check:monkey
npm.cmd run build
```

Expected: alle opdrachten slagen.

- [ ] **Step 8: Verifieer in de browser**

Controleer in de productie-preview dat de loader bij het kiezen van Monkey Mode verschijnt, stijgende progressie toont, na acht gebufferde seconden verdwijnt, autoplay activeert en buiten Monkey Mode geen video laadt.

- [ ] **Step 9: Commit**

```powershell
git add src/utils/scrollStoryBuffer.mjs src/utils/scrollStoryBuffer.test.mjs src/components/ScrollStory.astro scripts/check-scroll-story.mjs
git commit -m "feat: add monkey video loader"
```
