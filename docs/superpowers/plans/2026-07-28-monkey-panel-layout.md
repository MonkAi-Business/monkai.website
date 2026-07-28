# Monkey Panel Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Position every Monkey mode content panel in a scene-specific safe zone and make the panels more transparent without losing readability.

**Architecture:** Each chapter declares `data-panel-side`, `data-panel-vertical`, and `data-panel-size`. CSS uses these attributes for alignment and sizing, while the scroll controller copies the active side to the story element so the video shade can follow the panel.

**Tech Stack:** Astro, scoped CSS, browser DOM APIs, Node.js contract checks

## Global Constraints

- Monkey mode remains desktop-only.
- All existing topics, copy, links, focus behavior, scroll timing, and reduced-motion behavior remain available.
- The contact chapter remains pending until its source clip exists.
- New project copy and commit messages use regular hyphens, not em dashes or en dashes.
- No new runtime dependency is introduced.

---

### Task 1: Add the panel layout contract

**Files:**
- Modify: `scripts/check-scroll-story.mjs`
- Test: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Consumes: chapter opening tags from `src/components/ScrollStory.astro`
- Produces: a contract requiring explicit side, vertical position, and size for every chapter

- [ ] **Step 1: Write the failing test**

Add a layout map and inspect every chapter opening tag:

```js
const expectedPanelLayouts = {
  hero: ['left', 'middle', 'normal'],
  problemen: ['left', 'middle', 'normal'],
  overdracht: ['left', 'middle', 'compact'],
  team: ['left', 'middle', 'compact'],
  aanpak: ['right', 'middle', 'compact'],
  niveaus: ['right', 'middle', 'compact'],
  'use-cases': ['left', 'bottom', 'compact'],
  diensten: ['left', 'bottom', 'wide'],
  'breder-dan-chat': ['right', 'bottom', 'compact'],
  'ai-act': ['left', 'bottom', 'compact'],
  afspraak: ['left', 'top', 'compact'],
  blog: ['left', 'bottom', 'compact'],
  faq: ['left', 'top', 'compact'],
  contact: ['left', 'middle', 'compact'],
};

const chapterTags = [...component.matchAll(/<section\b[^>]*\bdata-monkey-chapter\b[^>]*>/g)]
  .map((match) => match[0]);
const attribute = (tag, name) => tag.match(new RegExp(`${name}="([^"]+)"`))?.[1];

for (const [id, [side, vertical, size]] of Object.entries(expectedPanelLayouts)) {
  const tag = chapterTags.find((candidate) => attribute(candidate, 'data-chapter') === id) ?? '';
  expect(attribute(tag, 'data-panel-side') === side, `${id} heeft de verkeerde paneelzijde.`);
  expect(attribute(tag, 'data-panel-vertical') === vertical, `${id} heeft de verkeerde verticale paneelpositie.`);
  expect(attribute(tag, 'data-panel-size') === size, `${id} heeft het verkeerde paneelformaat.`);
}

expect(component.includes("story.dataset.activePanelSide"), 'De videolaag volgt de actieve paneelzijde niet.');
expect(component.includes('background: rgba(3, 13, 19, 0.64);'), 'Het paneel is niet transparant genoeg.');
expect(component.includes('backdrop-filter: blur(16px);'), 'De transparantere panelen missen extra vervaging.');
```

- [ ] **Step 2: Run the contract and verify RED**

Run: `npm.cmd run check:scroll-story`

Expected: FAIL because the chapters do not yet declare the three layout attributes and the panel still uses opacity `0.78`.

- [ ] **Step 3: Commit the failing test with the implementation**

Keep the failing test uncommitted until Task 2 turns it green.

---

### Task 2: Implement scene-specific safe zones

**Files:**
- Modify: `src/components/ScrollStory.astro`
- Test: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Consumes: `data-panel-side`, `data-panel-vertical`, and `data-panel-size`
- Produces: `story.dataset.activePanelSide` and CSS-aligned panels

- [ ] **Step 1: Declare the approved layout on every chapter**

Add the three data attributes to each chapter according to the layout map from Task 1. For example:

```astro
<section
  class="monkey-chapter"
  data-monkey-chapter
  data-chapter="team"
  data-panel-side="left"
  data-panel-vertical="middle"
  data-panel-size="normal"
>
```

- [ ] **Step 2: Make the active shade follow the panel**

Inside `setActiveChapter`, copy the side from the active chapter:

```ts
story.dataset.activePanelSide = activeChapter.dataset.panelSide ?? 'left';
```

Use a left shade by default and flip it for right panels:

```css
.monkey-story[data-active-panel-side='right'] .monkey-shade {
  background:
    linear-gradient(270deg, rgba(3, 13, 19, 0.78) 0%, rgba(3, 13, 19, 0.3) 42%, rgba(3, 13, 19, 0.08) 100%),
    linear-gradient(0deg, rgba(3, 13, 19, 0.45) 0%, transparent 42%);
}
```

- [ ] **Step 3: Replace the binary alignment with attribute-based alignment**

Implement the three position dimensions:

```css
.monkey-chapter[data-panel-side='right'] {
  justify-content: flex-end;
}

.monkey-chapter[data-panel-vertical='top'] {
  align-items: flex-start;
  padding-top: clamp(132px, 10vw, 168px);
}

.monkey-chapter[data-panel-vertical='bottom'] {
  align-items: flex-end;
  padding-bottom: clamp(72px, 8vw, 112px);
}
```

- [ ] **Step 4: Implement transparent size variants**

Use a `0.64` panel background, `16px` blur, subtler shadow, and explicit widths:

```css
.monkey-panel {
  width: min(680px, 46vw);
  background: rgba(3, 13, 19, 0.64);
  box-shadow: 0 20px 56px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(16px);
}

.monkey-chapter[data-panel-size='compact'] .monkey-panel {
  width: min(560px, 40vw);
}

.monkey-chapter[data-panel-size='wide'] .monkey-panel {
  width: min(820px, 58vw);
}
```

Add dense compact styles for headings, gaps, grids, and cards so no topic or link is removed.

- [ ] **Step 5: Run the focused checks and verify GREEN**

Run:

```powershell
npm.cmd run check:scroll-story
npm.cmd run check:monkey
```

Expected: both checks pass.

- [ ] **Step 6: Commit the layout implementation**

```powershell
git add scripts/check-scroll-story.mjs src/components/ScrollStory.astro
git commit -m "fix: keep monkey panels clear of scenes"
```

---

### Task 3: Verify the complete film and desktop experience

**Files:**
- Modify: `CLAUDE.md`
- Verify: `public/media/scroll-story/monkai-scroll-story.mp4`
- Verify: `public/media/scroll-story/monkai-scroll-story.webm`

**Interfaces:**
- Consumes: the completed FAQ master film and layout attributes
- Produces: verified desktop behavior and updated project handoff notes

- [ ] **Step 1: Run the production build**

Run: `npm.cmd run build`

Expected: Astro build exits with code 0.

- [ ] **Step 2: Inspect the media contract**

Use the bundled FFmpeg executable to verify both outputs:

```powershell
node_modules\ffmpeg-static\ffmpeg.exe -hide_banner -i public\media\scroll-story\monkai-scroll-story.mp4
node_modules\ffmpeg-static\ffmpeg.exe -hide_banner -i public\media\scroll-story\monkai-scroll-story.webm
```

Expected: duration about `00:02:00.63`, resolution `1280x720`, frame rate `24 fps`, and no audio stream.

- [ ] **Step 3: Check every chapter in a desktop browser**

Open the local preview at a viewport around `1920x1080`, activate Monkey mode, visit every chapter, and confirm:

- the panel is on its declared side and vertical position;
- the face, headphones, and core action remain identifiable;
- the panel remains readable through the film;
- the approach shows all four steps;
- FAQ scrubs through the new clip;
- Contact holds the final FAQ frame;
- the progress indicator remains unobstructed.

- [ ] **Step 4: Record the updated media state**

Update `CLAUDE.md` to state that the master film contains fifteen source clips, thirteen chapters have their own footage, the film lasts about 121 seconds, and only Contact is still missing.

- [ ] **Step 5: Run final verification**

Run:

```powershell
npm.cmd run check:monkey
npm.cmd run check:scroll-story
npm.cmd run build
git diff --check
```

Expected: all commands exit with code 0 and no whitespace errors are reported.

- [ ] **Step 6: Commit the verified FAQ and handoff state**

```powershell
git add CLAUDE.md public/media/scroll-story/monkai-scroll-story.mp4 public/media/scroll-story/monkai-scroll-story.webm scripts/monkey-scenes.json scripts/check-monkey-mode.mjs scripts/check-scroll-story.mjs src/components/ScrollStory.astro
git commit -m "feat: add monkey faq and safer panels"
```
