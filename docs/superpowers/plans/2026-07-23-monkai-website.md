# MonkAi Business Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Astro site for MonkAi Business, faithfully porting the approved homepage design and adding markdown-driven blog + use-case systems, ready to deploy on Netlify.

**Architecture:** Astro static output (no SSR). The homepage is composed of section components under `src/components/`. Blog posts and use cases are markdown files in content collections, rendered on the homepage (teasers) and on their own list + detail pages. The contact section is a Netlify Form.

**Tech Stack:** Astro 5, TypeScript, Astro content collections (`glob` loader), plain CSS with custom-property design tokens, Google Fonts, Netlify (hosting + Forms).

## Global Constraints

- **Design source of truth:** Claude Design project `d12a143b-8fe1-42af-bd49-3ebc7160a3cf`, file `Homepage.dc.html`, re-pullable via the `claude_design` MCP (`DesignSync` → `get_file`). Port markup from the **desktop 1440 variant (`id="4a"`)**; use the **mobile 390 variant (`id="4b"`)** as the mobile reference. Drop all canvas wrappers (`<x-dc>`, `<helmet>`, `<section>` frame) and Claude tooling (`support.js`, `image-slot.js`, `<image-slot>`).
- **Language:** All UI copy is Dutch (nl). `<html lang="nl">`.
- **Design tokens (verbatim):** `--bg-page:#F4F2EC` `--bg-canvas:#E7E5DE` `--ink:#24261F` `--ink-soft:#4A4E42` `--muted:#656A5C` `--border:#D9DACE` `--card:#FBFAF6` `--card-alt:#E9EADF` `--section-alt:#EFEDE5` `--green:#4C5F3B` `--green-hover:#37472A` `--green-light:#8FA478`. On dark (`#24261F`): text `#C9CBBF`, dim `#A9AC9C`.
- **Fonts:** `Source Serif 4` (headings), `Work Sans` (body/UI), `JetBrains Mono` (labels). Google Fonts URL from the design: `https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap`.
- **Shape:** radius 4px (buttons/inputs), 6px (cards). Content max-width ~1120px, centered. Desktop section padding ~90px vertical / 64px horizontal.
- **Node:** pin Node 20 for Netlify.
- **Verification is build-based:** the "test" for each task is `npm run build` succeeding and the dev server rendering the expected output — there is no unit-test suite for this marketing site.

---

### Task 1: Astro scaffold, config, tokens, base layout

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro` (temporary placeholder)
- Create: `public/favicon.svg` (pulled from design project)

**Interfaces:**
- Produces: `BaseLayout.astro` with props `{ title: string; description?: string }` and a default `<slot />`; loads fonts, `global.css`, sets `<html lang="nl">`.

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "monkai-website",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0"
  }
}
```

- [ ] **Step 2: Install**

Run: `npm install`
Expected: `astro` installed, `node_modules/` present, no errors.

- [ ] **Step 3: astro.config.mjs** (static output is the default)

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://monkai.business',
});
```

- [ ] **Step 4: tsconfig.json**

```json
{ "extends": "astro/tsconfigs/strict" }
```

- [ ] **Step 5: Pull favicon.svg from the design project into `public/favicon.svg`**

Use `DesignSync` `get_file` with `path: "favicon.svg"` on project `d12a143b-8fe1-42af-bd49-3ebc7160a3cf`, save the `content` to `public/favicon.svg`.

- [ ] **Step 6: src/styles/tokens.css** — declare every token from Global Constraints as a `:root` custom property, plus `--maxw:1120px`, `--radius-sm:4px`, `--radius:6px`, and font-family variables `--font-serif:'Source Serif 4',serif`, `--font-sans:'Work Sans',sans-serif`, `--font-mono:'JetBrains Mono',monospace`.

- [ ] **Step 7: src/styles/global.css**

```css
@import './tokens.css';

* { box-sizing: border-box; }
body { margin: 0; background: var(--bg-page); color: var(--ink); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
h1,h2,h3 { font-family: var(--font-serif); margin: 0; }
a { color: var(--green); text-decoration: none; }
a:hover { color: var(--green-hover); }
img { max-width: 100%; display: block; }
.container { max-width: var(--maxw); margin: 0 auto; }
.section { padding: 90px 64px; border-top: 1px solid var(--border); }
.eyebrow { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.btn { display: inline-block; background: var(--green); color: #fff; font-weight: 600; padding: 15px 28px; border-radius: var(--radius-sm); }
.btn:hover { color: #fff; background: var(--green-hover); }
@media (max-width: 768px) { .section { padding: 56px 22px; } }
```

- [ ] **Step 8: src/layouts/BaseLayout.astro**

```astro
---
const { title, description = 'AI zonder apenstreken. Rustig en veilig starten met AI voor Vlaamse KMO\'s.' } = Astro.props;
import '../styles/global.css';
---
<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 9: Temporary src/pages/index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="MonkAi Business">
  <main class="section"><h1>MonkAi Business</h1></main>
</BaseLayout>
```

- [ ] **Step 10: Verify build + dev**

Run: `npm run build`
Expected: `dist/index.html` generated, exit 0.
Run: `npm run dev` and load `http://localhost:4321/` — heading renders in Source Serif, cream background.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with design tokens and base layout"
```

---

### Task 2: Logo, Nav, Footer

**Files:**
- Create: `src/components/Logo.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`
- Modify: `src/pages/index.astro` (mount Nav + Footer)

**Interfaces:**
- Produces: `<Logo variant="light|dark" />` (renders the monkey SVG + wordmark; `light` = dark ink on cream, `dark` = cream on dark for the footer). `<Nav />`, `<Footer />` — no props.

- [ ] **Step 1: Logo.astro** — port both monkey SVGs from the design (nav uses ink `#24261F`; footer uses `#F4F2EC`/`#8FA478`). Accept a `variant` prop switching the fill set and wordmark colors. Wordmark: `Monk` + `<span style="color:var(--green)">Ai</span>` + ` Business` in Work Sans.

- [ ] **Step 2: Nav.astro** — port the desktop nav (logo left; `Aanpak` `Diensten` `Over Stijn` links + `Laten we praten` button right). Links are anchor links to homepage section ids (`#aanpak`, `#diensten`, `#over`, `#contact`). Add a mobile hamburger (two bars from the mobile variant) that toggles a dropdown menu with the same links via a tiny inline `<script>` (toggle a `data-open` attribute / `.open` class). Sticky top optional; keep the 1px bottom border.

- [ ] **Step 3: Footer.astro** — port the footer: `<Logo variant="dark" />` + tagline, Sitemap column (Aanpak/Diensten/Over Stijn/Blog/Contact), SDK Solutions column (address `Robert De Preesterstraat 55, 9700 Oudenaarde`, `BTW BE 1027.019.469`, `hallo@monkai.business`), bottom row (Privacy/Cookies + mono tagline "Geen apen nodig gehad bij het maken van deze site. Wel AI."). Dark background `#24261F`.

- [ ] **Step 4: Mount in index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="MonkAi Business — AI zonder apenstreken">
  <Nav />
  <main><h1 class="section">placeholder</h1></main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 5: Verify + commit**

Run: `npm run build` (expect exit 0), then `npm run dev` — nav + footer render, hamburger toggles under 768px (resize browser).
```bash
git add -A && git commit -m "feat: add logo, nav, and footer"
```

---

### Task 3: Static homepage sections

Port these sections from the desktop variant into one component each in `src/components/`. Each is a `<section class="section" id="…">` wrapping a `.container`. Replace inline hex with the token variables from `tokens.css`. Keep the exact Dutch copy from the design.

**Files (create):**
- `src/components/Hero.astro` (id `top`)
- `src/components/Problem.astro` — "Waar zit de monkey business bij jou?" (3 cards)
- `src/components/Statement.astro` — "Mijn doel is dat je mij niet meer nodig hebt."
- `src/components/Ladder.astro` (id `aanpak` shared with Approach section — put id on the first of the pair) — "Drie niveaus, één tempo" (Automatiseren / Onthouden / Versnellen)
- `src/components/Approach.astro` — "De aanpak" (4 numbered steps)
- `src/components/Services.astro` (id `diensten`) — "Diensten" (9 cards + dark "Raad van advies" card)
- `src/components/BeyondChat.astro` — "AI is breder dan chat" (4 rows)
- `src/components/AiAct.astro` — EU AI Act block
- `src/components/Agreement.astro` — "Onze afspraak" (Wat ik breng / Wat jij brengt)
- `src/components/About.astro` (id `over`) — "Over Stijn" with photo

**Modify:** `src/pages/index.astro` to import and place them in design order.

**Interfaces:**
- Produces: ten prop-less section components. `About.astro` references `/media/stijn.jpg` via a real `<img>` with `alt="Foto van Stijn De Ketelaere"`; create `public/media/stijn.jpg` as a placeholder (solid-color 380×440 or a committed placeholder) until the real photo arrives.

- [ ] **Step 1: Fully-worked example — Hero.astro** (use this as the porting pattern for all sections)

```astro
---
---
<section class="section hero" id="top" style="border-top:none;">
  <div class="hero-inner">
    <h1>AI zonder apenstreken<span style="color:var(--green)">.</span></h1>
    <p class="lede">Ik help Vlaamse KMO's rustig en veilig starten met AI. Klein beginnen, herhalen, beheersen.</p>
    <div class="hero-cta">
      <a class="btn" href="#contact">Laten we praten</a>
      <a class="link-underline" href="#aanpak">Bekijk de aanpak</a>
    </div>
    <div class="hero-meta"><span>2 uur</span><span class="sep">|</span><span>10 deelnemers</span><span class="sep">|</span><span>bij jou op locatie</span></div>
  </div>
</section>
<style>
  .hero { display:flex; flex-direction:column; align-items:center; text-align:center; padding:110px 64px 90px; }
  .hero-inner { display:flex; flex-direction:column; align-items:center; gap:28px; max-width:820px; }
  h1 { font-size:68px; font-weight:500; line-height:1.08; text-wrap:pretty; }
  .lede { margin:0; font-size:20px; line-height:1.6; color:var(--muted); max-width:620px; }
  .hero-cta { display:flex; gap:18px; align-items:center; }
  .link-underline { color:var(--ink); font-weight:600; padding:15px 4px; border-bottom:1.5px solid var(--ink); }
  .hero-meta { display:flex; gap:14px; color:var(--muted); font-size:15px; margin-top:8px; }
  .hero-meta .sep { color:var(--border); }
  @media (max-width:768px){ .hero{ padding:64px 22px 56px; } h1{ font-size:40px; } .lede{ font-size:17px; } .hero-cta{ flex-direction:column; width:100%; } .hero-cta .btn{ width:100%; text-align:center; } }
</style>
```

- [ ] **Step 2: Port the remaining nine sections** using the same pattern: copy the desktop markup for each numbered block from `Homepage.dc.html`, convert inline hex → token vars, move layout CSS into a scoped `<style>`, and add a `@media (max-width:768px)` block collapsing multi-column grids to `grid-template-columns:1fr` with reduced font sizes per the mobile variant. Preserve all headings/copy verbatim.

- [ ] **Step 3: Assemble index.astro** in order: `Nav, Hero, Problem, Statement, Ladder, Approach, UseCases (Task 5), Services, BeyondChat, AiAct, Agreement, BlogTeaser (Task 4), About, Contact (Task 6), Footer`. For now include only the sections built so far; leave clearly-marked import placeholders for UseCases/BlogTeaser/Contact added in later tasks.

- [ ] **Step 4: Verify + commit**

Run: `npm run build` (exit 0). `npm run dev` — every section renders, matches the design at 1440px, collapses cleanly at 390px.
```bash
git add -A && git commit -m "feat: build static homepage sections"
```

---

### Task 4: Blog collection, pages, teaser, and three posts

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/shadow-ai-verbieden-werkt-niet.md`, `eu-ai-act-kmo.md`, `second-brain-een-map.md`
- Create: `src/components/BlogTeaser.astro`
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`
- Modify: `src/pages/index.astro` (mount BlogTeaser)

**Interfaces:**
- Produces: `blog` collection with schema `{ title: string; date: Date; description: string; tags: string[]; draft: boolean }`, keyed by filename slug (`entry.id`). Detail route: `/blog/<slug>`.

- [ ] **Step 1: src/content.config.ts** (blog half — usecases added in Task 5)

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Write the three posts** as real, publishable Dutch articles (no lorem). Frontmatter example:

```md
---
title: "Shadow AI: waarom verbieden niet werkt"
date: 2026-07-12
description: "Je medewerkers gebruiken al AI. Geef het kattenkwaad een speelplaats."
tags: ["governance", "adoptie"]
---

Body in Dutch — several real paragraphs matching the site's nuchtere tone.
```
Dates/titles/descriptions come from the design's blog cards (12 juli 2026 / 28 juni 2026 / 14 juni 2026).

- [ ] **Step 3: BlogTeaser.astro** — "Uit de blog" section (id optional), background `--section-alt`. Fetch newest 3 non-draft:

```astro
---
import { getCollection } from 'astro:content';
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
const fmt = (d) => new Intl.DateTimeFormat('nl-BE', { day:'numeric', month:'long', year:'numeric' }).format(d);
---
<section class="section" style="background:var(--section-alt);">
  <div class="container">
    <div class="head"><h2>Uit de blog</h2><a class="link-underline" href="/blog">Alle artikels</a></div>
    <div class="grid">
      {posts.map((p) => (
        <a class="card" href={`/blog/${p.id}`}>
          <div class="eyebrow">{fmt(p.data.date)}</div>
          <h3>{p.data.title}</h3>
          <p>{p.data.description}</p>
        </a>
      ))}
    </div>
  </div>
</section>
```
Style the `.grid` as 3 columns (1 on mobile) and `.card` per the design's blog cards.

- [ ] **Step 3b: Mount `<BlogTeaser />`** in `index.astro` between Agreement and About.

- [ ] **Step 4: src/pages/blog/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}
const { post } = Astro.props;
const { Content } = await render(post);
const fmt = (d) => new Intl.DateTimeFormat('nl-BE', { day:'numeric', month:'long', year:'numeric' }).format(d);
---
<BaseLayout title={`${post.data.title} — MonkAi Business`} description={post.data.description}>
  <Nav />
  <main class="section">
    <article class="container" style="max-width:720px;">
      <div class="eyebrow">{fmt(post.data.date)}</div>
      <h1 style="font-size:44px; font-weight:500; margin:12px 0 24px;">{post.data.title}</h1>
      <div class="prose"><Content /></div>
    </article>
  </main>
  <Footer />
</BaseLayout>
```
Add `.prose` styling (line-height 1.7, `--muted` body, serif h2/h3, spacing) in a scoped `<style>`.

- [ ] **Step 5: src/pages/blog/index.astro** — list all non-draft posts newest-first (reuse teaser card markup), wrapped in Nav/Footer, heading "Blog".

- [ ] **Step 6: Verify + commit**

Run: `npm run build` — expect `/blog/index.html` and three `/blog/<slug>/index.html` pages generated.
`npm run dev` — `/blog` lists 3 posts; each detail page renders; homepage teaser shows newest 3.
```bash
git add -A && git commit -m "feat: add blog collection, pages, and teaser"
```

---

### Task 5: Use-case collection, pages, section, and six cases (with video support)

**Files:**
- Modify: `src/content.config.ts` (add `usecases`)
- Create: `src/content/usecases/*.md` (6 files)
- Create: `src/components/UseCases.astro`, `src/components/VideoEmbed.astro`
- Create: `src/pages/use-cases/index.astro`, `src/pages/use-cases/[slug].astro`
- Modify: `src/pages/index.astro` (mount UseCases)

**Interfaces:**
- Produces: `usecases` collection schema `{ title: string; order: number; summary: string; video?: { type: 'file'|'youtube'|'vimeo'; src: string; poster?: string }; draft: boolean }`. `<VideoEmbed video={...} />` renders a responsive player: `file` → `<video controls poster>`, `youtube`/`vimeo` → lazy `<iframe>`. Detail route `/use-cases/<slug>`.

- [ ] **Step 1: Extend content.config.ts**

```ts
const usecases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/usecases' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    video: z.object({
      type: z.enum(['file', 'youtube', 'vimeo']),
      src: z.string(),
      poster: z.string().optional(),
    }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, usecases };
```

- [ ] **Step 2: Six use-case markdown files** from the design list, `order` 1–6, real Dutch `summary` + body describing the case concretely (situatie → wat AI doet → resultaat). Leave `video` omitted for now (added when clips arrive). Titles: Offertes in minuten / Facturen zonder overtypen / Interne kennis bevragen / Klantmails voorbereid / Rapporten die zichzelf schrijven / Sneller inwerken.

- [ ] **Step 3: VideoEmbed.astro**

```astro
---
const { video } = Astro.props;
---
{video?.type === 'file' && (
  <video controls preload="none" poster={video.poster} style="width:100%; border-radius:var(--radius);">
    <source src={video.src} />
  </video>
)}
{(video?.type === 'youtube' || video?.type === 'vimeo') && (
  <div style="position:relative; aspect-ratio:16/9;">
    <iframe src={video.src} loading="lazy" allowfullscreen title="Use case video"
      style="position:absolute; inset:0; width:100%; height:100%; border:0; border-radius:var(--radius);"></iframe>
  </div>
)}
```

- [ ] **Step 4: UseCases.astro** — homepage section "Use cases uit de praktijk" + sub "Geen vergezichten. Dit werkt vandaag al bij KMO's." Render cases sorted by `order` as the two-column numbered list from the design; each links to `/use-cases/<id>`.

```astro
---
import { getCollection } from 'astro:content';
const cases = (await getCollection('usecases', ({ data }) => !data.draft))
  .sort((a, b) => a.data.order - b.data.order);
---
```

- [ ] **Step 4b: Mount `<UseCases />`** in `index.astro` between Approach and Services.

- [ ] **Step 5: use-cases/[slug].astro** — Nav/Footer wrapper; renders title, `<VideoEmbed>` if `data.video`, then `<Content />`. Mirror the blog detail `getStaticPaths` pattern with `getCollection('usecases', …)`.

- [ ] **Step 6: use-cases/index.astro** — overview of all non-draft cases sorted by `order`, heading "Use cases uit de praktijk".

- [ ] **Step 7: Verify + commit**

Run: `npm run build` — expect `/use-cases/index.html` + six detail pages.
`npm run dev` — homepage use-case list links correctly; a case with a temporary test `video` renders a player (then revert the test).
```bash
git add -A && git commit -m "feat: add use-case collection, pages, and video support"
```

---

### Task 6: Contact section (Netlify Form)

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro` (mount Contact, id `contact`)

**Interfaces:**
- Produces: `<Contact />` — a Netlify-detectable form.

- [ ] **Step 1: Contact.astro** — port the "Laten we eerst praten" section. Real `<form>`:

```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/bedankt">
  <input type="hidden" name="form-name" value="contact" />
  <p hidden><label>Laat dit leeg: <input name="bot-field" /></label></p>
  <!-- Naam, Bedrijf, E-mail, Telefoon (optioneel), Bericht (textarea), akkoord-checkbox -->
  <button type="submit" class="btn">Verstuur je vraag</button>
</form>
```
Use real `<input>/<textarea>/<label>` styled to match the design's field mockups (white bg, `--border`, radius 4px). Email `required type="email"`, name `required`, checkbox `required`.

- [ ] **Step 2: Bedankt-pagina** — create `src/pages/bedankt.astro` (Nav/Footer + short "Bedankt, ik antwoord binnen twee werkdagen." message) as the form `action` target.

- [ ] **Step 3: Mount `<Contact />`** in `index.astro` before `<Footer />`.

- [ ] **Step 4: Verify + commit**

Run: `npm run build` — form present in `dist/index.html` with `data-netlify="true"` and hidden `form-name`. (Submissions only work once deployed to Netlify.)
```bash
git add -A && git commit -m "feat: add Netlify-ready contact form and thank-you page"
```

---

### Task 7: Responsive polish and full-site verification

**Files:**
- Modify: any section component needing mobile fixes; `src/styles/global.css` if shared rules help.

- [ ] **Step 1:** Run `npm run dev`; check the homepage at 390px, 768px, 1440px. Verify: nav hamburger works, no horizontal overflow, all grids collapse to 1 column on mobile, hero/heading sizes match the mobile variant.
- [ ] **Step 2:** Fix any overflow/spacing issues inline in the offending component's scoped `<style>`.
- [ ] **Step 3:** Verify `/blog`, a blog post, `/use-cases`, a use case, and `/bedankt` are all responsive and wrapped in Nav/Footer.
- [ ] **Step 4:** Run `npm run build` — exit 0, all expected pages in `dist/`.
- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "fix: responsive polish across pages"
```

---

### Task 8: netlify.toml and CLAUDE.md

**Files:**
- Create: `netlify.toml`
- Create: `CLAUDE.md`

- [ ] **Step 1: netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

- [ ] **Step 2: CLAUDE.md** — sections:
  - **Project** — what MonkAi Business is; static Astro site.
  - **Design provenance** — Claude Design project `d12a143b-8fe1-42af-bd49-3ebc7160a3cf`, files `Homepage.dc.html` / `Style Tiles.dc.html` / `favicon.svg`; how to re-pull via `claude_design` MCP (`DesignSync` → `list_files` / `get_file`); note the `.dc.html` is a canvas, not deployable. Record that the desktop `id="4a"` variant is the source of truth.
  - **Design tokens** — the token table (mirror `tokens.css`).
  - **Structure** — the folder map.
  - **Add a blog post** — create `src/content/blog/<slug>.md` with frontmatter `title/date/description/tags`; newest 3 auto-appear on the homepage.
  - **Add a use case** — create `src/content/usecases/<slug>.md` with `title/order/summary` and optional `video: { type, src, poster }`; drop clips in `public/media/`.
  - **Deploy** — GitHub repo `MonkAi-Business/monkai.website` → Netlify team `sdksolutionsbe` (Import from GitHub); or CLI `netlify deploy` with a personal access token. Netlify reads `netlify.toml`. Contact form appears under Forms after first deploy.
  - **Commands** — `npm run dev|build|preview`.
  - **Lessons learned** — running log; append after each session (start with the port/tokenization and Astro-5 content-collection notes discovered during this build).

- [ ] **Step 3: Verify + commit**

Run: `npm run build` (exit 0).
```bash
git add -A && git commit -m "chore: add netlify config and CLAUDE.md with provenance and lessons learned"
```

---

## Self-Review

**Spec coverage:** Architecture → Task 1. Tokens/fonts → Task 1. Nav/Footer → Task 2. All 15 homepage sections → Tasks 2/3/4/5/6 (Nav=T2, Hero–About static=T3, UseCases=T5, BlogTeaser=T4, Contact=T6, Footer=T2). Blog collection+pages → Task 4. Use-case collection+pages+video → Task 5. Contact/Netlify Forms → Task 6. Responsive → Tasks 3 (per-section) + 7 (pass). netlify.toml → Task 8. CLAUDE.md/provenance/lessons → Task 8. Success criteria 1–6 all covered.

**Placeholder scan:** Section markup is ported from the named source artifact `Homepage.dc.html` (a concrete, re-pullable file), not "TBD" — the tokenization rules and a fully-worked Hero example define the transformation. Infra code (config, schemas, dynamic routes, teaser/embed logic, form) is given in full. `public/media/stijn.jpg` and use-case videos are explicitly placeholder-until-supplied, which is in-scope per the spec.

**Type consistency:** `blog` schema fields (`title/date/description/tags/draft`) match between Task 4 config and its consumers. `usecases` schema (`title/order/summary/video{type,src,poster}/draft`) matches between Task 5 config, `VideoEmbed`, and pages. `entry.id` used as slug consistently (Astro 5 glob loader). `render(entry)` import from `astro:content` used consistently in both detail routes.

---

## Execution Handoff

See end of session — offer subagent-driven vs inline execution.
