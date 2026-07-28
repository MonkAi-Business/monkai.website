# Scrollstory implementation plan

> **For Codex:** Follow this plan in order. Keep the existing homepage content after the hero intact. Use test-first checks and verify visually before completion.

**Goal:** Replace the desktop homepage hero with a silent scroll-controlled film while preserving the current static hero on mobile and for reduced motion.

**Architecture:** A new Astro component owns the sticky stage, HTML overlays and a small dependency-free controller. A reproducible PowerShell media script turns the seven supplied Veo clips into scrub-friendly MP4 and WebM assets plus a poster. A Node check validates the generated markup and media contract before the production build.

**Tech stack:** Astro 5, TypeScript in Astro scripts, browser video API, CSS, FFmpeg.

---

## Task 1: Add a failing contract check

**Files:**

- Create: `scripts/check-scroll-story.mjs`
- Modify: `package.json`

1. Add a Node check that asserts:
   - `src/components/ScrollStory.astro` exists.
   - the component contains a muted, playsinline video without controls.
   - responsive MP4 and WebM sources point to `/media/scroll-story/`.
   - the six required overlay messages are present.
   - reduced-motion and mobile fallback rules exist.
   - the homepage imports and renders `ScrollStory`.
   - the generated MP4, WebM and poster exist after media generation.
2. Add `check:scroll-story` to `package.json`.
3. Run the check and confirm it fails because the implementation and assets do not exist yet.

## Task 2: Build reproducible video assets

**Files:**

- Create: `scripts/build-scroll-story.ps1`
- Create: `public/media/scroll-story/monkai-scroll-story.mp4`
- Create: `public/media/scroll-story/monkai-scroll-story.webm`
- Create: `public/media/scroll-story/monkai-scroll-story-poster.jpg`

1. In the script, declare the seven source paths in story order.
2. Verify every source exists before encoding.
3. Normalize all clips to 1280 by 720 at 24 fps and remove audio.
4. Trim the vine clip before its final artefact.
5. Join the clips with short crossfades, using a longer sunlight transition between the door and jungle clips.
6. Encode H.264 with faststart and a short GOP for responsive seeking.
7. Encode VP9 with regular keyframes.
8. Export the opening frame as the poster.
9. Run the media script and inspect duration, dimensions, codecs and lack of audio.

## Task 3: Implement the scrollstory component

**Files:**

- Create: `src/components/ScrollStory.astro`
- Modify: `src/pages/index.astro`

1. Reuse the existing hero copy, CTA structure and analytics behavior as the first overlay.
2. Add the five later story overlays as semantic HTML.
3. Add the muted video with desktop-only MP4 and WebM sources.
4. Style a sticky, full-viewport stage with readable gradients and branded typography.
5. Make overlays transition through `data-active` and keep inactive content non-interactive.
6. Implement a dependency-free scroll controller:
   - calculate section progress from its bounding rectangle;
   - set the target video time from progress;
   - ease current time toward the target in `requestAnimationFrame`;
   - activate the overlay whose progress interval contains the current scroll position;
   - update on resize and page restoration;
   - pause work while the component is outside the viewport.
7. Collapse to the static hero below 769 pixels and under reduced motion.
8. Replace `Hero` with `ScrollStory` on the homepage.

## Task 4: Verify behavior and presentation

**Files:**

- Modify if needed: `src/components/ScrollStory.astro`
- Modify if needed: `scripts/check-scroll-story.mjs`

1. Run `npm run check:scroll-story`.
2. Run `npm run build`.
3. Serve the production build locally.
4. Inspect desktop at the start, each narrative stop and the handoff to the next homepage section.
5. Inspect a mobile viewport and confirm the static hero renders without the long scroll space.
6. Emulate reduced motion and confirm the same fallback.
7. Confirm no audio track exists and no native video controls are visible.
8. Check console output for runtime errors.

## Task 5: Document and hand off

**Files:**

- Modify: `CLAUDE.md`

1. Add a concise lesson about keeping generated-video text in HTML and providing lightweight fallbacks.
2. Review `git diff` and ensure no generated cache or review files are included.
3. Report the branch, worktree, verification commands and any known visual limitations.
