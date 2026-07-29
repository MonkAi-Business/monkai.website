# Monkey UI polish implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the white favicon tile in the Monkey Mode switch with the shared MonkAi mark and turn the hero's secondary action into the selected transparent outline button.

**Architecture:** A focused `MonkeyMark.astro` component becomes the single source for the monkey SVG used by the logo and theme switch. `ScrollStory.astro` receives one hero-specific modifier class so the selected outline treatment does not affect other story links.

**Tech Stack:** Astro components, scoped CSS, Node.js contract checks

## Global constraints

- The external favicon remains unchanged.
- The monkey mark shape remains unchanged.
- Monkey Mode remains hidden on screens up to 768 pixels wide.
- `Laten we praten` remains the green primary action.
- Only the hero link to `#monkey-aanpak` receives the outline treatment.
- Both hero actions use a handcursor and a visible keyboard focus style.
- No runtime dependency is added.
- New project copy and commit messages use regular hyphens.

---

### Task 1: Share the monkey SVG mark

**Files:**
- Create: `src/components/MonkeyMark.astro`
- Modify: `src/components/Logo.astro`
- Modify: `src/components/ThemeToggle.astro`
- Modify: `scripts/check-monkey-mode.mjs`
- Test: `scripts/check-monkey-mode.mjs`

**Interfaces:**
- Consumes: width, height, face color, ear accent and cutout color
- Produces: `MonkeyMark.astro`, a decorative SVG with the existing 36 by 30 mark

- [ ] **Step 1: Change the contract assertions first**

Replace the favicon assertion in `scripts/check-monkey-mode.mjs` and add logo
and component checks:

```js
const logo = read('src', 'components', 'Logo.astro');
const monkeyMarkPath = join(root, 'src', 'components', 'MonkeyMark.astro');

expect(existsSync(monkeyMarkPath), 'De gedeelde MonkeyMark-component ontbreekt.');
expect(
  toggle.includes("import MonkeyMark from './MonkeyMark.astro'")
    && toggle.includes('<MonkeyMark'),
  'De themaschakelaar gebruikt MonkeyMark niet.',
);
expect(
  logo.includes("import MonkeyMark from './MonkeyMark.astro'")
    && logo.includes('<MonkeyMark'),
  'Het logo gebruikt MonkeyMark niet.',
);
expect(
  !toggle.includes('src="/favicon.svg"'),
  'De Monkey-knop mag de favicon met achtergrondtegel niet gebruiken.',
);
```

- [ ] **Step 2: Run the check and verify RED**

Run: `npm.cmd run check:monkey`

Expected: exit code 1 because `MonkeyMark.astro` and both imports are missing
and the favicon is still rendered.

- [ ] **Step 3: Create the shared mark**

Create `src/components/MonkeyMark.astro`:

```astro
---
export interface Props {
  width?: number;
  height?: number;
  face?: string;
  earAccent?: string;
  cutout?: string;
}

const {
  width = 36,
  height = Math.round((width * 30) / 36),
  face = 'currentColor',
  earAccent = 'var(--green)',
  cutout = 'transparent',
} = Astro.props;
---

<svg
  width={width}
  height={height}
  viewBox="0 0 36 30"
  aria-hidden="true"
  style={`--monkey-face:${face}; --monkey-ear-accent:${earAccent}; --monkey-cutout:${cutout};`}
>
  <circle cx="6" cy="15" r="4.6" fill="var(--monkey-face)"></circle>
  <circle cx="30" cy="15" r="4.6" fill="var(--monkey-face)"></circle>
  <circle cx="6" cy="15" r="2" fill="var(--monkey-ear-accent)"></circle>
  <circle cx="30" cy="15" r="2" fill="var(--monkey-ear-accent)"></circle>
  <circle cx="18" cy="15" r="11" fill="var(--monkey-face)"></circle>
  <circle cx="13.5" cy="12" r="4.4" fill="var(--monkey-cutout)"></circle>
  <circle cx="22.5" cy="12" r="4.4" fill="var(--monkey-cutout)"></circle>
  <ellipse cx="18" cy="17.5" rx="7" ry="6" fill="var(--monkey-cutout)"></ellipse>
  <circle cx="14.5" cy="13.5" r="1.5" fill="var(--monkey-face)"></circle>
  <circle cx="21.5" cy="13.5" r="1.5" fill="var(--monkey-face)"></circle>
  <circle cx="16.9" cy="17.6" r="0.9" fill="var(--monkey-face)"></circle>
  <circle cx="19.1" cy="17.6" r="0.9" fill="var(--monkey-face)"></circle>
  <path
    d="M14.8 20 Q18 23.2 21.2 20"
    stroke="var(--monkey-face)"
    stroke-width="1.3"
    fill="none"
    stroke-linecap="round"
  ></path>
</svg>
```

- [ ] **Step 4: Reuse the mark in the logo**

Import the component in `Logo.astro`:

```astro
import MonkeyMark from './MonkeyMark.astro';
```

Replace the current inline SVG with:

```astro
<MonkeyMark
  width={iconSize}
  height={iconHeight}
  face={monkeyFace}
  earAccent={earAccent}
  cutout={faceCutout}
/>
```

Remove the now-unused `.logo-mark` style.

- [ ] **Step 5: Reuse the mark in the theme switch**

Import the component in `ThemeToggle.astro`:

```astro
import MonkeyMark from './MonkeyMark.astro';
```

Replace the favicon image with:

```astro
<MonkeyMark
  width={18}
  height={15}
  face="currentColor"
  earAccent="var(--green-light)"
  cutout="var(--monkey-mark-cutout)"
/>
```

Add the inherited cutout colors:

```css
.theme-toggle button {
  --monkey-mark-cutout: var(--card);
}

.theme-toggle button[aria-pressed='true'] {
  --monkey-mark-cutout: var(--green);
}
```

- [ ] **Step 6: Run focused checks and verify GREEN**

Run:

```powershell
npm.cmd run check:monkey
npm.cmd run check:scroll-story
```

Expected: both commands exit with code 0.

- [ ] **Step 7: Commit the shared mark**

```powershell
git add scripts/check-monkey-mode.mjs src/components/MonkeyMark.astro src/components/Logo.astro src/components/ThemeToggle.astro
git commit -m "refactor: share monkey logo mark"
```

---

### Task 2: Style the hero secondary action

**Files:**
- Modify: `src/components/ScrollStory.astro`
- Modify: `scripts/check-scroll-story.mjs`
- Test: `scripts/check-scroll-story.mjs`

**Interfaces:**
- Consumes: the existing hero link to `#monkey-aanpak`
- Produces: `.monkey-link-outline`, scoped to the hero secondary action

- [ ] **Step 1: Add the failing hero-action assertions**

Add inside the existing `ScrollStory.astro` contract block:

```js
expect(
  component.includes('class="monkey-link monkey-link-outline" href="#monkey-aanpak"'),
  'De hero-link naar de aanpak mist de outline-stijl.',
);
expect(
  /\.monkey-link-outline\s*\{[\s\S]*display:\s*inline-flex;[\s\S]*padding:\s*15px 22px;[\s\S]*cursor:\s*pointer;/.test(component),
  'De hero outline-knop mist de gekozen afmetingen of handcursor.',
);
```

- [ ] **Step 2: Run the check and verify RED**

Run: `npm.cmd run check:scroll-story`

Expected: exit code 1 on both new hero-action assertions.

- [ ] **Step 3: Add the modifier class**

Change only the hero secondary link:

```astro
<a class="monkey-link monkey-link-outline" href="#monkey-aanpak">Bekijk de aanpak</a>
```

- [ ] **Step 4: Add the selected outline treatment**

Add a handcursor to the existing primary-action rule:

```css
.monkey-actions .btn {
  color: var(--on-green);
  cursor: pointer;
}
```

Add after the general `.monkey-link:hover` rule:

```css
.monkey-link-outline {
  align-self: auto;
  display: inline-flex;
  padding: 15px 22px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(196, 225, 188, 0.54);
  border-radius: var(--radius-sm);
  background: transparent;
  color: #fff;
  cursor: pointer;
}

.monkey-link-outline:hover {
  border-color: rgba(196, 225, 188, 0.86);
  background: rgba(196, 225, 188, 0.08);
  color: #fff;
}

.monkey-link-outline:focus-visible {
  outline: 2px solid #c4e1bc;
  outline-offset: 3px;
}
```

The full `border` declaration replaces the general link's bottom border.
The 15 pixel vertical padding matches the global `.btn` padding.

- [ ] **Step 5: Run focused checks and verify GREEN**

Run:

```powershell
npm.cmd run check:scroll-story
npm.cmd run check:monkey
```

Expected: both commands exit with code 0.

- [ ] **Step 6: Commit the CTA treatment**

```powershell
git add scripts/check-scroll-story.mjs src/components/ScrollStory.astro
git commit -m "fix: align monkey hero actions"
```

---

### Task 3: Verify the complete desktop interaction

**Files:**
- Verify: `src/components/MonkeyMark.astro`
- Verify: `src/components/ThemeToggle.astro`
- Verify: `src/components/ScrollStory.astro`

**Interfaces:**
- Consumes: the complete local Monkey Mode page
- Produces: verified desktop behavior with no source changes

- [ ] **Step 1: Run all project checks**

Run:

```powershell
npm.cmd run check:monkey
npm.cmd run check:scroll-story
npm.cmd run build
git diff --check
```

Expected: every command exits with code 0.

- [ ] **Step 2: Verify at 1920 by 1080 in Monkey Mode**

At `http://localhost:4321/`, verify:

- the Monkey Mode switch shows the shared mark without a white tile;
- the active icon remains legible on the green button;
- the two hero actions have equal height and aligned top and bottom edges;
- the outline action has a handcursor and visible keyboard focus;
- the autoplay control remains clickable below the progress indicator;
- Play changes to Pause and advances the story;
- manual input returns the control to Play.

- [ ] **Step 3: Verify the contact endpoint**

Start the tour near FAQ and verify it stops at the beginning of Contact with
the complete contact panel visible.

- [ ] **Step 4: Inspect browser logs**

Expected: no new error or warning entries from the theme switch, shared mark,
hero action or autoplay control.
