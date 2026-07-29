# Live Site Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De vier bevindingen uit de live validatie corrigeren op `main`.

**Architecture:** Behoud de bestaande Astro-componenten en voeg alleen gerichte copy-, link- en CSS-aanpassingen toe. Breid de bestaande statische regressiechecks uit zodat de zichtbare afspraken blijvend worden bewaakt.

**Tech Stack:** Astro 5, TypeScript, CSS, Node.js-controles.

## Global Constraints

- Wijzig geen scrolltiming of Monkey Mode-media.
- Behoud gelijke nadruk voor toestemmingsknoppen.
- Raak `public/media/monkai.glb` en `public/media/monkai.png` niet aan.

---

### Task 1: Regressiechecks

**Files:**
- Modify: `scripts/check-monkey-mode.mjs`

**Produces:** Controles voor de echte AI Act-link, de verbeterde teamcopy, de compacte dienstenlayout en de compacte cookiemelding.

- [ ] Voeg verwachtingen toe voor alle vier gewenste uitkomsten.
- [ ] Voer `npm run check:monkey` uit en bevestig dat de nieuwe verwachtingen falen.

### Task 2: Copy en link

**Files:**
- Modify: `src/components/AiAct.astro`
- Modify: `src/components/Team.astro`

- [ ] Verwijs de AI-geletterdheidslink naar `/blog/eu-ai-act-kmo`.
- [ ] Vervang “thuis prutst ik” door “thuis experimenteer ik”.
- [ ] Voer `npm run check:monkey` uit en controleer welke layoutverwachtingen nog falen.

### Task 3: Dienstenpaneel en cookiemelding

**Files:**
- Modify: `src/components/ScrollStory.astro`
- Modify: `src/components/ConsentBanner.astro`

- [ ] Centreer het dienstenhoofdstuk verticaal en geef het een eigen compacte paneelklasse.
- [ ] Verklein typografie, tussenruimte en kaartpadding alleen binnen het dienstenpaneel.
- [ ] Maak de cookiemelding smaller, compacter en licht transparant met behoud van gelijke knoppen.
- [ ] Voer `npm run check:monkey` uit en bevestig dat alle regressiechecks slagen.

### Task 4: Volledige verificatie

**Files:** Geen productieaanpassingen.

- [ ] Voer de transitie-editortests uit.
- [ ] Voer `npm run check:scroll-story` en `npm run check:monkey` uit.
- [ ] Voer `npm run build` uit.
- [ ] Controleer de homepage visueel op desktop.
- [ ] Controleer dat alleen bedoelde bestanden gewijzigd zijn.
- [ ] Commit en push de wijzigingen op `main`.
