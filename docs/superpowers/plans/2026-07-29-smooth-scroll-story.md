# Smooth Scroll Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maak zowel handmatige Monkey-scrubbing als de automatische tour vloeiend zonder hoofdstukken, knippunten of mobiele fallback te wijzigen.

**Architecture:** Autoplay laat de video sequentieel afspelen en vertaalt `video.currentTime` via een inverse hoofdstukmapping naar de scrollpositie. Handmatig scrollen behoudt de bestaande seekroute, maar gebruikt MP4 als voorkeursbron en masters met maximaal drie frames per GOP.

**Tech Stack:** Astro 5, browser HTMLMediaElement API, JavaScript ES modules, Node.js tests, PowerShell en FFmpeg.

## Global Constraints

- Handmatig scrollen pauzeert playback en blijft de video aan de scrollpositie koppelen.
- Autoplay gebruikt normale videoweergave en veroorzaakt geen herhaalde seeks.
- De bestaande tourduur van 7,5 seconden per hoofdstuk blijft behouden via `playbackRate`.
- MP4/H.264 staat vóór WebM in de bronvolgorde.
- MP4 en WebM gebruiken GOP 3 bij 24 fps.
- Reduced motion, mobiel, knippunten, copy en paneelposities veranderen niet.
- `public/media/monkai.glb` en `public/media/monkai.png` blijven onaangeroerd.

---

### Task 1: Inverse timing en playbacktempo

**Files:**
- Modify: `src/utils/scrollStoryTiming.mjs`
- Modify: `src/utils/scrollStoryAutoplay.mjs`
- Modify: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Produces: `timeToProgress(time: number, chapterTimings: Array<{timeStart:number,timeEnd:number}>): number`
- Produces: `autoplayPlaybackRate(videoDuration: number, chapterCount: number): number`

- [ ] **Step 1: Schrijf falende tests**

Voeg aan `scripts/check-scroll-story.mjs` toe:

```js
expect(
  approximately(timeToProgress(14, sampleTimings), 0.5),
  'De inverse timing moet een videotijd terug naar hoofdstukprogressie vertalen.',
);
expect(
  approximately(
    autoplayPlaybackRate(119.542, 13),
    119.542 / 97.5,
  ),
  'Autoplay moet de bestaande tourduur via playbackRate behouden.',
);
```

- [ ] **Step 2: Bevestig RED**

Run: `npm.cmd run check:scroll-story`

Expected: FAIL omdat `timeToProgress` en `autoplayPlaybackRate` nog niet geëxporteerd worden.

- [ ] **Step 3: Implementeer de pure functies**

`timeToProgress` klemt vóór het eerste frame op `0`, na het laatste frame op `1`, zoekt het bijbehorende hoofdstuk en retourneert `(chapterIndex + localProgress) / chapterCount`.

`autoplayPlaybackRate` retourneert `videoDuration / (chapterCount * AUTO_SCROLL_CHAPTER_MS / 1000)`, begrensd tussen `0.25` en `4`, en `1` bij ongeldige invoer.

- [ ] **Step 4: Bevestig GREEN**

Run: `npm.cmd run check:scroll-story`

Expected: `Scrollstory-check geslaagd.`

- [ ] **Step 5: Commit**

```powershell
git add src/utils/scrollStoryTiming.mjs src/utils/scrollStoryAutoplay.mjs scripts/check-scroll-story.mjs
git commit -m "test: define sequential autoplay timing"
```

### Task 2: Sequentiële autoplay

**Files:**
- Modify: `src/components/ScrollStory.astro`
- Modify: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Consumes: `timeToProgress`
- Consumes: `autoplayPlaybackRate`
- Produces: Autoplay waarin `video.play()` de tijd bepaalt en `autoplayTick` alleen de pagina positioneert.

- [ ] **Step 1: Schrijf falende contractchecks**

Voeg verwachtingen toe die eisen dat:

```js
component.includes('video.play()')
component.includes('timeToProgress(video.currentTime, timings)')
component.includes('if (!autoplayPlaying')
```

en verwijder de oude verwachtingen voor `advanceAutoScroll`.

- [ ] **Step 2: Bevestig RED**

Run: `npm.cmd run check:scroll-story`

Expected: FAIL op de nieuwe sequentiële autoplaycontracten.

- [ ] **Step 3: Vervang afstandsgedreven autoplay**

- `startAutoplay()` zet de huidige scrollpositie om naar `targetTime`, stelt `video.playbackRate` in en start `video.play()`.
- `autoplayTick()` zet `video.currentTime` via `timeToProgress` om naar de scrollpositie.
- De seeksectie in `render()` voert alleen uit wanneer `autoplayPlaying === false`.
- `stopAutoplay()` pauzeert de video en synchroniseert `targetTime` en `renderedTime` met het zichtbare frame.
- Een afgewezen `video.play()` stopt autoplay zonder handmatig scrubben te breken.
- Het einde scrollt exact naar `bounds.end` en stopt.

- [ ] **Step 4: Bevestig GREEN**

Run: `npm.cmd run check:scroll-story`

Expected: `Scrollstory-check geslaagd.`

- [ ] **Step 5: Commit**

```powershell
git add src/components/ScrollStory.astro scripts/check-scroll-story.mjs src/utils/scrollStoryAutoplay.mjs
git commit -m "fix: play monkey tour sequentially"
```

### Task 3: Scrubvriendelijke videomasters

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `scripts/build-scroll-story.ps1`
- Modify: `scripts/transition-editor/builder.test.mjs`
- Modify: `src/components/ScrollStory.astro`
- Modify: `public/media/scroll-story/monkai-scroll-story.mp4`
- Modify: `public/media/scroll-story/monkai-scroll-story.webm`
- Modify: `public/media/scroll-story/monkai-scroll-story-poster.jpg`

**Interfaces:**
- Produces: Reproduceerbare `ffmpeg-static` bouwer met GOP 3.
- Produces: MP4 als eerste HTML-videobron.

- [ ] **Step 1: Schrijf falende encoder- en bronvolgordetests**

Breid de planuitvoer van `build-scroll-story.ps1 -PlanOnly` uit met:

```json
{
  "keyframeInterval": 3
}
```

Laat `builder.test.mjs` eisen dat `keyframeInterval === 3`. Laat `check-scroll-story.mjs` eisen dat de MP4-bron vóór de WebM-bron staat.

- [ ] **Step 2: Bevestig RED**

Run:

```powershell
node --test scripts/transition-editor/builder.test.mjs
npm.cmd run check:scroll-story
```

Expected: beide controles falen op het ontbrekende GOP-contract en de oude bronvolgorde.

- [ ] **Step 3: Maak de bouwer reproduceerbaar**

Run: `npm.cmd install --save-dev ffmpeg-static`

Pas de bouwer aan:

```powershell
'-g', '3',
'-keyint_min', '3',
```

voor MP4 en `'-g', '3'` voor WebM. Geef `keyframeInterval = 3` terug in `-PlanOnly`.

- [ ] **Step 4: Zet MP4 eerst**

In `ScrollStory.astro`:

```astro
<source data-src="/media/scroll-story/monkai-scroll-story.mp4" type="video/mp4" />
<source data-src="/media/scroll-story/monkai-scroll-story.webm" type="video/webm" />
```

- [ ] **Step 5: Bouw de masters opnieuw**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/build-scroll-story.ps1
```

Expected: MP4, WebM en poster worden zonder audio opnieuw gegenereerd vanuit `scripts/monkey-scenes.json`.

- [ ] **Step 6: Bevestig GREEN**

Run:

```powershell
node --test scripts/transition-editor/builder.test.mjs
npm.cmd run check:scroll-story
```

Expected: beide controles slagen.

- [ ] **Step 7: Commit**

```powershell
git add package.json package-lock.json scripts/build-scroll-story.ps1 scripts/transition-editor/builder.test.mjs src/components/ScrollStory.astro scripts/check-scroll-story.mjs public/media/scroll-story
git commit -m "perf: optimize monkey video for scrubbing"
```

### Task 4: Volledige verificatie en live handoff

**Files:** Geen aanvullende productiecode.

- [ ] **Step 1: Draai alle geautomatiseerde verificatie**

```powershell
node --test scripts/transition-editor/*.test.mjs
npm.cmd run check:scroll-story
npm.cmd run check:monkey
npm.cmd run build
git diff --check
```

- [ ] **Step 2: Controleer lokaal in de browser**

- Meet autoplay gedurende minstens 3 seconden: de video moet continu vooruitgaan zonder herhaalde seeks.
- Scroll handmatig door meerdere hoofdstukken: videosprongen moeten duidelijk kleiner zijn dan met GOP 24.
- Controleer dat play/pause, einde, mobiele fallback en reduced motion behouden blijven.
- Controleer de browserconsole op fouten.

- [ ] **Step 3: Controleer repositoryscope**

`git status --short` mag alleen de twee bestaande ongetrackte mediabestanden tonen.

- [ ] **Step 4: Push**

```powershell
git push origin main
```

Controleer dat `HEAD` en `origin/main` dezelfde commit bevatten.
