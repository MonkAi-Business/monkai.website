# MonkAi Business — CLAUDE.md

Durable knowledge base for future sessions on this repo. Keep this file accurate: update it whenever facts here change, and append to **Lessons learned** after every session that touches this codebase.

## Project

MonkAi Business is the AI-offering of **SDK Solutions BV** — a marketing site for AI-adoption coaching aimed at Flemish SMEs ("KMO's"), delivered by **Stijn De Ketelaere**. It is a static **Astro 5** site, content and copy in **Dutch (nl)**, deployed on **Netlify**.

The site is a single long-scroll homepage plus three sub-areas: a blog, a use-cases library, and a Netlify-Forms-powered contact flow with a thank-you page. The homepage sections, in their actual assembly order in `src/pages/index.astro`, are: Nav, Hero, Problem, Statement, Ladder, Approach, UseCases, Services, BeyondChat, AiAct ("EU AI Act" note), Agreement ("Onze afspraak"), BlogTeaser, About ("Over Stijn"), Contact, Footer.

## Writing style (IMPORTANT)

Avoid "AI slop" in all copy: site content, commit messages, docs, and chat replies.

- **Never use an em dash (—) or en dash (–). Use a plain hyphen "-" instead.** This is a hard rule. Where an em dash would join clauses, either use a hyphen with spaces (" - ") or rewrite as two sentences.
- Write plainly and concretely. Avoid filler, hype, and the typical LLM tics (e.g. "in het huidige landschap", "het is belangrijk om op te merken", overuse of "bovendien"/"daarnaast", tidy rule-of-three lists everywhere).
- Match the existing Dutch tone: direct, nuchter, no marketing bloat.

Note: older text in this file and in the codebase still contains em dashes from before this rule. Do not introduce new ones; replace them with "-" when you touch a file anyway.

## Design provenance

The visual design originates from a **Claude Design** project, not from this repo directly:

- Project name: **"Drie style tiles klaar"**
- Project ID: `d12a143b-8fe1-42af-bd49-3ebc7160a3cf`
- Files in that project:
  - `Homepage.dc.html` — the homepage design that was ported into this site.
  - `Style Tiles.dc.html` — the design-system reference (colors, type, components).
  - `favicon.svg`

**Important — what a `.dc.html` file actually is:** these are Claude **design canvases**, not deployable websites. Each one contains a **desktop variant** (`<div id="4a">`, 1440px wide) and a **mobile variant** (`<div id="4b">`, 390px wide) laid out side by side, wrapped in `<x-dc>` / `<helmet>` markup with Claude's own canvas tooling (`support.js`, `image-slot.js`, `<image-slot>` custom elements). None of that wrapper or tooling is ported — it exists only to let the canvas render inside Claude's design surface.

**Porting rule:** the **desktop `id="4a"`** frame is the source of truth for markup/content/layout at desktop width; the **mobile `id="4b"`** frame is the responsive reference used to size the same component down to small screens (breakpoints, stacking, font-size drops). When the two disagree on content, `4a` wins and `4b` is treated as "how this looks small," not as a second source of truth.

A local snapshot of the ported homepage source is kept at `docs/design-source/Homepage.dc.html` for reference — it is not built or imported by the app.

**How to re-pull / update the design later:** use the `claude_design` MCP server, tool **`DesignSync`**:
1. `list_files` (method, with the `projectId` above) to see what's currently in the project.
2. `get_file` (method, with the same `projectId` and a file name) to fetch the latest contents of `Homepage.dc.html`, `Style Tiles.dc.html`, or `favicon.svg`.
3. Diff the fetched `id="4a"` markup against what's currently in `src/components/`, then re-port only the changed sections into the matching Astro component(s) — translating inline styles to the tokens in `src/styles/tokens.css` as you go (see below).

## Design tokens

Canonical tokens live in **`src/styles/tokens.css`**, loaded globally. **Never hardcode a hex color, radius, or font stack in a component where a token already exists for it** — add a new token instead if the design introduces a genuinely new value.

| Token | Value | Use |
|---|---|---|
| `--bg-page` | `#F4F2EC` | Page background |
| `--bg-canvas` | `#E7E5DE` | Canvas/section background |
| `--ink` | `#24261F` | Primary text |
| `--ink-soft` | `#4A4E42` | Secondary text |
| `--muted` | `#656A5C` | Muted/tertiary text |
| `--border` | `#D9DACE` | Default border color |
| `--card` | `#FBFAF6` | Card background (light) |
| `--card-alt` | `#E9EADF` | Alternate card background |
| `--section-alt` | `#EFEDE5` | Alternate section background |
| `--green` | `#4C5F3B` | Brand green (buttons, links, accents) |
| `--green-hover` | `#37472A` | Brand green, hover/active state |
| `--green-light` | `#8FA478` | Light green accent |
| `--dark` | `#24261F` | Dark surface background (e.g. dark cards) |
| `--dark-text` | `#C9CBBF` | Text on dark surfaces |
| `--dark-dim` | `#A9AC9C` | Dimmed text on dark surfaces |
| `--input-bg` | `#FFFFFF` | Form input background |
| `--placeholder` | `#A5A79C` | Form placeholder text color |
| `--maxw` | `1120px` | Content max-width |
| `--radius-sm` | `4px` | Small corner radius (inputs, chips) |
| `--radius` | `6px` | Default corner radius (cards, buttons) |
| `--font-serif` | `'Source Serif 4', serif` | Headings |
| `--font-sans` | `'Work Sans', sans-serif` | Body/UI text |
| `--font-mono` | `'JetBrains Mono', monospace` | Mono accents (labels, tags) |

## Structure

```
src/
  layouts/
    BaseLayout.astro       — shared <head>, fonts, global.css/tokens.css import, Nav + Footer slot wrapper
  components/
    Nav.astro, Footer.astro, Logo.astro       — global chrome, used on every page
    Hero.astro, Problem.astro, Approach.astro,
    Ladder.astro, Agreement.astro, Services.astro,
    BeyondChat.astro, AiAct.astro, About.astro,
    Statement.astro                            — static homepage sections, ported 1:1 from Homepage.dc.html (4a)
    UseCases.astro, BlogTeaser.astro           — homepage sections driven by content collections
    Contact.astro                              — the Netlify-Forms contact form section
    VideoEmbed.astro                           — renders a use case's video (file/YouTube/Vimeo variants)
  content/
    blog/*.md              — blog post collection (see "Add a blog post" below)
    usecases/*.md           — use case collection (see "Add a use case" below)
    resources/*.md          — download/prompt collection for the hidden /data page (see "The /data page" below)
  content.config.ts        — Astro 5 collection definitions (glob loader + zod schemas) for blog, usecases & resources
  pages/
    index.astro             — homepage, assembles all sections in order
    data/index.astro         — hidden /data besloten zone (client-side login + tool tabs, see below)
    bedankt.astro            — thank-you page the contact form POSTs/redirects to
    blog/index.astro         — blog listing
    blog/[slug].astro        — blog post detail (dynamic route, slug = entry.id)
    use-cases/index.astro    — use case listing
    use-cases/[slug].astro   — use case detail (dynamic route, slug = entry.id)
  styles/
    tokens.css               — design tokens (see above), the single source of truth for colors/fonts/shape
    global.css                — resets, base element styles, typography defaults
public/
  favicon.svg
  media/
    stijn.svg               — placeholder profile image (see Deploy section)
docs/
  design-source/Homepage.dc.html   — local snapshot of the ported design canvas, for reference only
  superpowers/                     — spec/plan docs from the build process (not app code)
.superpowers/sdd/                  — per-task briefs/reports/diffs from this project's staged build (task-1..8)
netlify.toml                       — Netlify build config (see Deploy)
CLAUDE.md                          — this file
```

## How to add a blog post

Create `src/content/blog/<slug>.md` with frontmatter:

```yaml
---
title: "Post title"
date: 2026-07-23
description: "One or two sentence summary shown in listings and previews."
tags: ["optional", "tag", "list"]
image: "/media/blog/<slug>.svg"
imageAlt: "Korte beschrijving van het beeld"
draft: false
---
Post body in Markdown.
```

- `title` (string, required)
- `date` (string, required, `YYYY-MM-DD`)
- `description` (string, required)
- `tags` (array of strings, optional)
- `image` (string, optional) — cover/thumbnail path. Renders as a 3:2 cover on the detail page and as the card thumbnail in `/blog` + the homepage teaser; also fed into the `BlogPosting` schema. Posts without it still build (no image shown). The four existing posts use on-brand SVG covers in `public/media/blog/` (hand-authored, brand hex hardcoded because an `<img>`-loaded SVG can't read `tokens.css` variables).
- `imageAlt` (string, optional) — alt text for `image`
- `draft` (boolean, optional, default `false`)

The homepage teaser section automatically shows the **newest 3 non-draft** posts (sorted by `date`, descending). `/blog` lists all non-draft posts. Each post's detail page is served at `/blog/<slug>` (the file's slug, taken from `entry.id`).

## How to add a use case

Create `src/content/usecases/<slug>.md` with frontmatter:

```yaml
---
title: "Use case title"
order: 10
summary: "One or two sentence summary shown in the listing card."
video:
  type: file        # or: youtube | vimeo
  src: /media/example.mp4
  poster: /media/example-poster.jpg
draft: false
---
Use case body in Markdown.
```

- `title` (string, required)
- `order` (number, required) — controls sort order in the listing (ascending)
- `summary` (string, required)
- `video` (optional object): `type` is `file`, `youtube`, or `vimeo`; `src` is the file path or embed URL; `poster` (optional) is a poster image path, used with `type: file`
- `draft` (boolean, optional, default `false`)

For a local video, drop the `.mp4` (and poster image, if any) into `public/media/` and reference them as `/media/<filename>` with `type: file`. For a hosted video, use the YouTube or Vimeo embed URL with `type: youtube` or `type: vimeo` — `VideoEmbed.astro` renders the right markup for each case. The detail page is served at `/use-cases/<slug>`.

## The `/data` page (besloten zone) — how to add a resource

`/data` (`src/pages/data/index.astro`) is a **hidden, `noindex`, not-linked** page with a **client-side login** (`monkai` / `business`, checked in an inline script, `sessionStorage` flag `monkai_data_unlock`). After unlocking, five tool tabs (Claude / ChatGPT / Copilot / Gemini / Overig) filter downloadable resources.

⚠️ **This is obscurity, not security.** The password sits in the page source and every file under `public/data/files/` is reachable by direct URL regardless of login. Only ever put non-sensitive material here (workshop hand-outs, prompt templates). This was a deliberate choice (see lesson #11); do **not** describe it to the user as protected.

To add a resource, create `src/content/resources/<slug>.md` (body can be empty — only the frontmatter is used):

```yaml
---
title: "Offerte-prompt voor Claude"
tool: "claude"          # claude | chatgpt | copilot | gemini | overig
description: "Korte uitleg wat het is."
file: "/data/files/offerte-prompt.pptx"
type: "pptx"            # free-form label shown as a chip: pptx | pdf | prompt | docx | zip ...
order: 10               # ascending sort within a tool
draft: false
---
```

Drop the actual download (PowerPoint/PDF/prompt/...) into `public/data/files/` and point `file` at it. Empty tools render "Nog geen content voor <tool>." The `resources` collection is defined in `src/content.config.ts`; `/data` is filtered out of the sitemap in `astro.config.mjs`.

## Deploy

- GitHub repo: **`MonkAi-Business/monkai.website`** (already set as the `origin` remote).
- **Domain + Netlify: LIVE (connected 2026-07-24).** The user **owns `monkai.business`** and the GitHub repo is **connected to Netlify** (team `sdksolutionsbe`). Netlify reads `netlify.toml` at the repo root (`npm run build`, publish directory `dist`, Node 20) and **redeploys automatically on every push to `main`**. So: pushing to `main` = deploying to production.
- **⚠️ PostHog env var must be set in Netlify:** the analytics key lives in local `.env` only (gitignored). Netlify builds in the cloud and does **not** see `.env`, so `PUBLIC_POSTHOG_KEY` must be added under Netlify → Site settings → Environment variables, or production builds ship with analytics disabled. (Verify whether the user set this.)
- **Alternative — CLI:** `netlify deploy --prod`, authenticated with a Netlify personal access token.
- **Contact form:** uses **Netlify Forms** — the form has `data-netlify="true"`, a hidden `form-name` input matching the form's `name` attribute, and a honeypot field (`netlify-honeypot="bot-field"` + a hidden `bot-field` input). Netlify's build-time HTML parser detects the form from this static markup; no JS or serverless function is needed. Submissions appear under the site's **Forms** tab in the Netlify dashboard after the *first* deploy (the form must exist in a deployed build for Netlify to register it).
- **Analytics (PostHog):** cookieless PostHog wired via `src/components/Analytics.astro` (rendered in `BaseLayout` head). Set **`PUBLIC_POSTHOG_KEY`** as a Netlify environment variable (Site settings → Environment variables) for production — Astro inlines `PUBLIC_`-prefixed vars at build time, so it must exist in the build environment. Locally, copy `.env.example` to `.env` and fill the key. Without the key, the component renders nothing (no broken script). See lesson #9.
- **Contact email:** the public/contact address is **`stijn@monkai.business`** (changed sitewide from `hallo@` on 2026-07-24).
- **Known placeholders awaiting real assets:** the real profile photo is in place (`public/media/stijn.jpg`, 760×880 mozjpeg from the user's portrait, cropped from top; `About.astro` references it). The use-case videos are still placeholders — swap them for real media when available; no code changes should be needed beyond updating file paths in frontmatter. The PostHog key is still needed for analytics to run in production.

## Commands

- `npm run dev` — start the local dev server.
- `npm run build` — build the static site to `dist/`.
- `npm run preview` — preview the production build locally.

## Lessons learned

Running log — append an entry here after any future session that changes this codebase, so the project gets smarter over time.

1. The design lives as a Claude design canvas (`.dc.html`) with a desktop `id="4a"` frame and a mobile `id="4b"` frame side by side; port from `4a`, size mobile behavior from `4b`. The canvas file itself is not directly deployable — it's a design artifact, not a website.
2. Astro 5 content collections are configured in **`src/content.config.ts`** at the project root (NOT the older `src/content/config.ts` convention from Astro 2–4). Use the `glob` loader from `astro/loaders`, import `render()` from `astro:content` to render an entry's Markdown body, and use `entry.id` as the URL slug.
3. Every inline hex value in the design maps to a token CSS variable — keep `tokens.css` authoritative. When the design introduces a new value with no matching token (e.g. `--input-bg`, `--placeholder` for form styling), add a new token rather than hardcoding the hex in a component.
4. Nav/Footer links that point at homepage sections must be root-absolute (`/#aanpak`), not bare fragment links (`#aanpak`) — bare fragments break when the link is rendered on `/blog` or `/use-cases` sub-pages, since they'd resolve relative to the current path instead of the homepage.
5. Netlify Forms needs exactly three things present in the static (build-time) HTML to be detected: `data-netlify="true"` on the `<form>`, a hidden `<input name="form-name" value="...">` matching the form's `name` attribute, and a honeypot field (`netlify-honeypot` attribute + matching hidden input). No JavaScript or serverless function is involved in detection.
6. The design's Services section has **8 regular cards + 1 dark "Raad van advies" card (9 total)** — when porting from a design canvas, verify exact counts/variants against the actual `id="4a"` source markup, not against a prose summary of the section, since summaries can silently drop an outlier card.
7. Responsive behavior: multi-column grids collapse to a single column at `max-width: 768px`. Watch for `flex` rows with `flex-wrap: nowrap` and many inline items (e.g. the hero meta row) — these can overflow horizontally at narrow widths (390px) even when the surrounding grid collapses correctly; test the narrowest supported width explicitly, not just one intermediate breakpoint.
8. **SEO/AI-SEO/GEO layer (added 2026-07):** `BaseLayout.astro` is now the single source of head SEO — it builds a self-referencing `<link rel="canonical">` from `Astro.url`, Open Graph + Twitter tags, and always emits sitewide JSON-LD (`ProfessionalService` `#business` + `Person` `#stijn`, with `areaServed` = Oost-/West-Vlaanderen, Gent, Vlaamse Ardennen and `knowsAbout` = AI-adoptie, Claude-training, second/collective brain). It accepts `noindex` (used on `/bedankt`) and a `schema` prop (array of extra JSON-LD objects). Blog posts pass `BlogPosting` + `BreadcrumbList`; use cases pass `BreadcrumbList`. Target keywords are woven into copy + schema, never stuffed (stuffing costs ~-10% AI visibility). `Faq.astro` (homepage, between About and Contact) renders a `FAQPage` and is the main hook for AI citations. Sitemap via `@astrojs/sitemap` (config filters out `/bedankt`) at `/sitemap-index.xml`; `public/robots.txt` allows AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …) and references the sitemap; `public/llms.txt` gives AI systems a site overview. The `og:image` is a real 1200×630 PNG (`public/og-image.png`) rasterized from `public/og-image.svg` with sharp (regenerate: `sharp(svg).resize(1200,630).png()`); the SVG is kept as editable source. Legal pages `/privacy` and `/cookies` exist via a shared `LegalLayout.astro` (BaseLayout + Nav + Footer + prose); footer links and the contact-form privacy link point to `/privacy` and `/cookies` (no more dead `#` anchors). A ready-to-use Google Business Profile setup pack lives at `docs/google-business-profile.md` — Claude can't create the GBP itself (needs the user's Google account + verification), so it's pre-filled for copy-paste. **Still open:** the user must actually create/verify the GBP, and fonts are still loaded from Google Fonts (self-hosting would help LCP + GDPR).
9. **Analytics + copy corrections (2026-07-24):** PostHog is wired **cookieless** via `src/components/Analytics.astro` (included in `BaseLayout` head): EU host (`eu.i.posthog.com`), `persistence: 'memory'` (no cookies, no localStorage → **no consent banner needed**), `person_profiles: 'identified_only'`, session recording disabled, `respect_dnt: true`. The component only renders when `PUBLIC_POSTHOG_KEY` is set (env var; `.env.example` documents it), so a keyless build simply omits it — verified: with a dummy key the EU host + `persistence:'memory'` appear in `dist/index.html`; without, `posthog` count is 0. The Netlify env var `PUBLIC_POSTHOG_KEY` must be set for production (Astro inlines `PUBLIC_` vars at build). Primary conversion event **`contact_submitted`** fires via an inline script on `/bedankt` (Netlify form `action="/bedankt"`); other clicks are covered by PostHog autocapture. Tradeoff of `persistence:'memory'` on this MPA: each pageload is a fresh anonymous id, so "unique visitors" ≈ pageviews — that's the price of cookieless/no-consent. `/cookies` and `/privacy` were rewritten to disclose the cookieless analytics (legal basis: **gerechtvaardigd belang**, no consent required because it's cookieless + anonymous + honours DNT). Also this session: contact email changed sitewide `hallo@` → **`stijn@monkai.business`**; region framing broadened from "van Gent tot de Vlaamse Ardennen" to **"heel Oost- en West-Vlaanderen"** in the meta-description default (`BaseLayout`), `llms.txt`, and the OG image (SVG text edited + `og-image.png` re-rasterized with sharp). `areaServed` in the schema still lists both provinces + Gent + Vlaamse Ardennen (kept as extra served places — good for local SEO). Domain is fully `monkai.business` everywhere; site is hosted on monkai.business only.
10. **Writing style + blog covers (2026-07-24):** Added a **hard house-style rule** (see "Writing style" near the top): never use em/en dashes (— –), always a plain `-`; avoid AI-slop tics. All four blog posts were swept for dashes. Blog posts now support optional `image` + `imageAlt` frontmatter: rendered as a **2:1 banner cover** on the detail page and as full-bleed **16:9 card thumbnails** in `/blog` + `BlogTeaser` (cards were restructured: `padding` moved off `.card` onto a `.card-body`, image sits above with `overflow:hidden` on the card). **Gotcha:** the `<img>` has `width`/`height` attributes (for CLS), which map to a fixed CSS `height` and make `aspect-ratio` a no-op — the images render at the attribute height regardless of ratio. Fix is `height: auto` in the CSS alongside `aspect-ratio` + `object-fit: cover`. Motifs sit in the central band of each 3:2 SVG, so the 2:1/16:9 crops don't cut anything important. The four covers are **hand-authored on-brand SVGs** in `public/media/blog/` — chosen because there is no image-generation tool available in-session (the user first wanted AI photos, then opted for SVG). Brand hex is hardcoded inside each SVG on purpose: a `<img src>`-loaded SVG does **not** inherit `tokens.css` CSS variables. `image` also feeds the `BlogPosting` JSON-LD.
11. **`/data` besloten zone (2026-07-24):** Added a hidden resources page at `/data` with a **client-side-only** login (`monkai`/`business`) and five tool tabs filtering a new `resources` content collection (downloads live in `public/data/files/`). The user explicitly accepted that this is **obscurity, not security** (password in source, files reachable by direct URL) — fine for non-sensitive workshop material; never present it as protected. **Gotcha caught in visual QA:** toggling an element's `hidden` attribute does nothing if author CSS sets `display` on it — `.gate{display:flex}` beat the UA `[hidden]{display:none}`, so both the login card and the content showed at once. Fixed with `[hidden]{display:none !important}`. Lesson: when using the `hidden` attribute as a visibility toggle, add that override, and always screenshot JS-driven show/hide states rather than trusting a green build. `/data` is `noindex` + filtered out of the sitemap; not linked anywhere.
12. **Positioning correction - sessies, geen formele opleidingen (2026-07-25):** Stijn levert zelf **inspiratiesessies en sparringsessies in kleine groepen**; voor **concrete/formele opleidingen verwijst hij door** naar partners. Do NOT describe MonkAi as giving "Claude-training/opleidingen" as a course. Copy swept accordingly: the FAQ item "Doe je Claude-training voor bedrijven?" answer reframed (question text kept - it's the search phrase people use, a deliberate AEO hook); the two Services cards renamed `Claude-training voor kenniswerkers/developers` → **`Claude voor kenniswerkers/developers`** (both stress "in kleine groepen"); `AI-geletterdheid`-card and `Approach` step 04 dropped the word "opleiding" (→ "op maat" / "begeleiding"); the sitewide word **"Claude-training" → "Claude-sessies"** in the page `<title>`, `BaseLayout` default meta-description + both schema descriptions + both `knowsAbout` arrays, `llms.txt`, and the OG image (`og-image.svg` text edited, `og-image.png` re-rasterized with sharp per lesson #8). Hero meta row changed from `2 uur | 10 deelnemers | bij jou op locatie` to **`Inspiratiesessie | Sparring in kleine groepen | bij jou op locatie`** (user didn't want a headcount there). **Still carrying the old framing (left untouched, flag when relevant):** the Services `AI-inspiratiesessie` card still reads "Twee uur, tien deelnemers, bij jou op locatie", and `docs/google-business-profile.md` still says "Claude-training voor kenniswerkers/developers" + "Opleiding op maat" - update that GBP pack before the user pastes it into Google.
13. **Custom mail-onderwerp + statische form-definitie (2026-07-25):** Het contactformulier zet nu een custom onderwerp op de Netlify-notificatiemail via een verborgen `subject`-veld (vaste fallback "Nieuwe aanvraag via monkai.business", dynamisch aangevuld met naam + bedrijf via een inline script in `Contact.astro`). **Belangrijke valkuil:** Netlify registreert het formulier en zijn velden uit het statische `public/__forms.html`, niet uit de door Astro gerenderde pagina. Velden die daar niet in staan (zoals `subject`) worden bij inzending **genegeerd** - het veld leek te werken maar het onderwerp bleef op de standaard "Form submission from contact form" staan tot `subject` óók aan `__forms.html` werd toegevoegd. Les: elk nieuw veld in het echte formulier moet gespiegeld worden in `__forms.html`, anders slikt Netlify het stil in. Netlify's UI-onderwerp leeg laten; het HTML-`subject`-veld wint. Wacht altijd op de redeploy voor je test - een inzending vóór/tijdens de deploy gebruikt nog de oude definitie.
