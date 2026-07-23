# MonkAi Business — website (design spec)

**Datum:** 2026-07-23
**Status:** Goedgekeurd, klaar voor implementatieplan

## Doel

Een verzorgde, statische marketingsite voor **MonkAi Business** (AI-adoptiecoaching voor
Vlaamse KMO's, door Stijn De Ketelaere / SDK Solutions BV). De homepage wordt pixel-getrouw
omgezet uit het Claude-designproject. Blogs en use cases worden markdown-gedreven zodat ze
stelselmatig bijgewerkt kunnen worden. Deploy op Netlify.

## Bron van het design (provenance)

- **Claude Design-project:** "Drie style tiles klaar"
- **projectId:** `d12a143b-8fe1-42af-bd49-3ebc7160a3cf`
- **Bestanden:** `Homepage.dc.html` (implementeren), `Style Tiles.dc.html` (designsysteem-referentie),
  `favicon.svg`
- **Her-ophalen:** via de `claude_design` MCP (tool `DesignSync`, methode `get_file`).
- Het `.dc.html`-bestand is een Claude *design-canvas* (desktop 1440 + mobiel 390 naast elkaar,
  met `<x-dc>`, `<helmet>`, `<image-slot>`, `support.js`, `image-slot.js`). Dit is **geen**
  deploybare site en wordt omgezet naar echte HTML/CSS.

## Techkeuze

- **Astro** (static output, geen SSR-adapter). Componentgebaseerde homepage, markdown content
  collections voor blog + use cases. Minimale client-side JS.
- **Netlify** voor hosting + `netlify.toml` (build `astro build`, publish `dist`).
- **Netlify Forms** voor het contactformulier (geen backend).

## Architectuur / mappenstructuur

```
monkai.website/
├─ CLAUDE.md                 # projectkennis, provenance, lessons learned
├─ netlify.toml
├─ astro.config.mjs · package.json · tsconfig.json
├─ public/
│   ├─ favicon.svg
│   └─ media/                # foto Stijn, use-case video's + posters (placeholders tot aanlevering)
├─ src/
│   ├─ styles/tokens.css     # design tokens
│   ├─ layouts/BaseLayout.astro
│   ├─ components/           # secties van de homepage (zie hieronder)
│   ├─ content/
│   │   ├─ config.ts         # collection-schema's
│   │   ├─ blog/*.md
│   │   └─ usecases/*.md
│   └─ pages/
│       ├─ index.astro
│       ├─ blog/index.astro · blog/[slug].astro
│       └─ use-cases/index.astro · use-cases/[slug].astro
```

## Design tokens (exact uit de bron)

**Kleuren**
- `--bg-page: #F4F2EC` · `--bg-canvas: #E7E5DE`
- `--ink: #24261F` · `--ink-soft: #4A4E42` · `--muted: #656A5C`
- `--border: #D9DACE`
- `--card: #FBFAF6` · `--card-alt: #E9EADF` · `--section-alt: #EFEDE5`
- `--green: #4C5F3B` · `--green-hover: #37472A` · `--green-light: #8FA478`
- op donker (`#24261F`): tekst `#C9CBBF`, gedempt `#A9AC9C`

**Typografie**
- Koppen: `Source Serif 4` (400/500/600)
- Tekst/UI: `Work Sans` (400/500/600)
- Labels/mono: `JetBrains Mono` (400/500)
- Geladen via Google Fonts (zoals in het design).

**Vorm**
- Radius: 4px (knoppen, inputs) · 6px (kaarten, blokken)
- Content-breedte: ~1120px, gecentreerd; sectiepadding ~90px verticaal (desktop).

## Homepage-secties (volgorde uit het design)

Elk wordt een component in `src/components/`:

1. **Nav** — logo (aap-SVG) + "MonkAi Business", links Aanpak/Diensten/Over Stijn, CTA "Laten we praten". Mobiel: hamburger.
2. **Hero** — "AI zonder apenstreken." + subtekst + 2 CTA's + meta (2 uur · 10 deelnemers · op locatie).
3. **Probleem** — 3 kaarten (Kopiëren en plakken / Kennis in mailboxen / Stiekem experimenteren).
4. **Statement** — "Mijn doel is dat je mij niet meer nodig hebt."
5. **Ladder** — 3 niveaus (Automatiseren / Onthouden / Versnellen), oplopend geaccentueerd, derde op donkere achtergrond.
6. **Aanpak** — 4 stappen (Inspireren / Kiezen / Experimenteren / Verankeren) met mono-nummers.
7. **Use cases** — overzicht van de nieuwste/uitgelichte cases (uit de collection), link naar `/use-cases`.
8. **Diensten** — 9 kaarten + 1 donkere "Raad van advies"-kaart.
9. **Breder dan chat** — AR / smart glasses / computer vision / connected worker.
10. **EU AI Act** — tekstblok + link "Lees meer over AI-geletterdheid".
11. **Onze afspraak** — 2 kolommen (Wat ik breng / Wat jij brengt).
12. **Blog** — 3 nieuwste posts (uit de collection), link "Alle artikels".
13. **Over Stijn** — foto (`public/media`) + tekst.
14. **Contact** — Netlify Form (naam, bedrijf, e-mail, telefoon optioneel, bericht, akkoord-checkbox).
15. **Footer** — logo, sitemap, SDK Solutions-gegevens, tagline.

## Content collections

**blog** (`src/content/blog/*.md`)
- Schema: `title` (string), `date` (date), `description` (string), `tags` (string[], optioneel),
  `draft` (boolean, default false).
- Homepage toont de 3 nieuwste (niet-draft), gesorteerd op datum aflopend.
- Startdata: de 3 posts uit het design (Shadow AI / EU AI Act voor KMO / Second brain) als
  volwaardige, publiceerbare artikels — geen lorem ipsum.

**usecases** (`src/content/usecases/*.md`)
- Schema: `title`, `order` (number), `summary` (string), `video` (optioneel object:
  `{ type: 'file' | 'youtube' | 'vimeo', src: string, poster?: string }`), `draft` (boolean).
- 6 startcases uit het design (Offertes in minuten, Facturen zonder overtypen, Interne kennis
  bevragen, Klantmails voorbereid, Rapporten die zichzelf schrijven, Sneller inwerken).
- Detailpagina rendert de video (indien aanwezig) met poster; anders alleen tekst.
- `/use-cases` toont het overzicht gesorteerd op `order`.

## Responsief gedrag

- Desktop-variant (1440) is leidend; mobiele variant (390) is de referentie voor mobiel.
- Grids (3- en 4-koloms) klappen naar 1 kolom onder ~768px.
- Nav wordt een hamburger op mobiel (eenvoudige toggle; minimale JS).
- Fluid tussen 390 en ~1200px; boven ~1200px gecentreerde content met marges.

## Contactformulier (Netlify Forms)

- `<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">`
- Velden: naam, bedrijf, e-mail, telefoon (optioneel), bericht, akkoord-checkbox.
- Honeypot-veld tegen spam. Inzendingen verschijnen in het Netlify-dashboard.
- Werkt pas na deploy op Netlify (lokaal geen submit-verwerking).

## Netlify-config

- `netlify.toml`: `[build] command = "astro build"`, `publish = "dist"`; Node-versie pinnen.
- Koppelen gebeurt later: GitHub-repo `MonkAi-Business/monkai.website` importeren in Netlify-team
  `sdksolutionsbe`. Alternatief: CLI-deploy met een Netlify personal access token.

## CLAUDE.md (self-improving)

Bevat: projectoverzicht · design-provenance (met her-ophaal-instructies) · design-tokens ·
mappenstructuur · "hoe voeg ik een blog/use case toe" · deploy-stappen · commando's ·
en een lopend **lessons-learned**-logboek dat na elke sessie wordt aangevuld.

## Bewust buiten scope (YAGNI)

- Echte foto-/videobestanden (placeholders tot aanlevering).
- Meertaligheid (site is NL).
- CMS/admin-interface (content is markdown in de repo).
- Server-side logica / SSR.

## Succescriteria

1. `npm run build` slaagt; `npm run dev` toont de homepage getrouw aan het design.
2. Homepage is responsief (getest op ~390px en ~1440px) en gebruikt de exacte tokens.
3. Blog- en use-case-collections werken: overzicht + detailpagina's genereren correct.
4. Contactformulier is Netlify-Forms-klaar.
5. `netlify.toml` staat klaar voor koppeling.
6. `CLAUDE.md` documenteert provenance, structuur, update-workflow en lessons learned.
