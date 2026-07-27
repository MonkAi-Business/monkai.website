# Kickass superpowers-varianten: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tien uitgewerkte varianten van de superpowers-stand op een verborgen galerij `/kickass`, zodat Stijn er één kan kiezen op basis van wat hij ziet.

**Architecture:** Elke variant is een set token-overrides plus één laagcomponent, toegepast op dezelfde drie gedeelde secties (hero, ladder, services). De schakel is `data-kickass="<slug>"` op `<html>`, naast het bestaande `data-theme="superpowers"`. Elke variant krijgt een eigen paginabestand dat alleen zijn eigen laag importeert, zodat de CSS en de scripts van de negen andere varianten nooit meeliften.

**Tech Stack:** Astro 5 (statisch), CSS custom properties, canvas 2D, SVG-filters, three.js (alleen voor de twee 3D-varianten). Verificatie met een eigen Node-script zonder afhankelijkheden.

## Global Constraints

- Branch: `feature/kickass`. Niet naar `main` mergen zonder dat Stijn gekozen heeft.
- **Nooit een em dash (—) of en dash (–)**, ook niet in code-commentaar, commitboodschappen of zichtbare tekst. Altijd een gewone hyphen `-`.
- Alle zichtbare tekst en alle code-commentaar in het Nederlands, in de nuchtere toon van de rest van de repo.
- De echte site blijft ongemoeid: geen wijziging aan `src/pages/index.astro`, `Nav.astro`, `Footer.astro`, `BaseLayout.astro`, `tokens.css`, `Hero.astro`, `Ladder.astro`, `Services.astro`. De enige uitzondering is het sitemapfilter in `astro.config.mjs`.
- `SUPERPOWERS_ENABLED` in `src/utils/theme.ts` blijft `false`.
- De CSP in `netlify.toml` staat geen externe scripts of media toe. Alles self-hosted, alles gebundeld door Astro (`script-src 'self'`). Niets van een CDN.
- Elke laag zet al zijn CSS onder `:root[data-kickass='<slug>']`. Geen enkele regel mag buiten die prefix vallen.
- Elke laag declareert `--kickass-laag: '<slug>';` in zijn tokenblok. Het controlescript gebruikt dat als vingerafdruk.
- Bij `prefers-reduced-motion: reduce` valt in elke variant alle beweging weg. Kleur en typografie blijven.
- Gewichtsbudget: `/kickass` onder 400 kB, geen variantpagina boven 3,5 MB.

## Afwijkingen van de spec

Twee dingen zijn tijdens het plannen bijgestuurd. Ze staan hier zodat ze niet als vergissing gelezen worden.

1. **Tien paginabestanden in plaats van één dynamische route.** De spec vroeg `src/pages/kickass/[slug].astro`. Astro bundelt de stijlen van alles wat een pagina importeert, ook wat niet gerenderd wordt. Eén dynamische route die tien lagen importeert zou dus alle tien de CSS-blokken op elke variantpagina zetten, en dat botst met de hardere eis dat alleen de gekozen laag laadt. Tien paginabestanden van elf regels lossen dat op.
2. **Variant 10 (Vloeibaar) gebruikt SVG-filters in plaats van WebGL.** `feTurbulence` plus `feDisplacementMap` op de titel geeft hetzelfde vloeibare effect, werkt zonder GPU-context, valt vanzelf terug op gewone tekst als de browser het filter niet aankan, en scheelt honderden regels shadercode. WebGL blijft daardoor beperkt tot de twee varianten die echt een 3D-model tonen.

---

## Bestandsoverzicht

| Bestand | Verantwoordelijkheid |
|---|---|
| `src/kickass/variants.ts` | Het manifest: de tien varianten met slug, naam, pitch, techniek en gewicht. Eén bron voor de galerij en de paginabestanden. |
| `src/components/kickass/DemoShell.astro` | Het pagina-omhulsel: `<html>` met de twee attributen, head met fonts en noindex, en de balk met de navigatie tussen varianten. |
| `src/components/kickass/DemoHero.astro` | De gedeelde hero-inhoud. |
| `src/components/kickass/DemoLadder.astro` | De gedeelde ladder-inhoud, drie treden. |
| `src/components/kickass/DemoServices.astro` | De gedeelde services-inhoud, negen kaarten. |
| `src/components/kickass/layers/<Naam>.astro` | Tien lagen. Elk draagt de token-overrides, de eigen markup en het eigen script van één variant. |
| `src/pages/kickass/index.astro` | De galerij met tien tegels. |
| `src/pages/kickass/<slug>.astro` | Tien paginabestanden, elk elf regels, elk met precies één laagimport. |
| `scripts/check-kickass.mjs` | Controlescript op `dist/`: aanwezigheid, noindex, isolatie tussen varianten, sitemap, mediabudget. |
| `scripts/media-webp.mjs` | Eenmalige omzetting van de PNG naar WebP. |
| `public/media/superpowers/` | De geoptimaliseerde webversies van de media. |
| `astro.config.mjs` | Sitemapfilter uitbreiden met `/kickass`. |

## Het paginabestand van een variant

Elk van de tien paginabestanden ziet er hetzelfde uit. Alleen de twee gemarkeerde
plaatsen wisselen: de laagimport en de slug. Waar een taak zegt "patroon van Terminal",
bedoelt hij dit sjabloon met die twee waarden ingevuld.

```astro
---
import DemoShell from '../../components/kickass/DemoShell.astro';
import DemoHero from '../../components/kickass/DemoHero.astro';
import DemoLadder from '../../components/kickass/DemoLadder.astro';
import DemoServices from '../../components/kickass/DemoServices.astro';
import Laag from '../../components/kickass/layers/LAAGBESTAND.astro';
import { variantBySlug } from '../../kickass/variants';

const variant = variantBySlug('SLUG');
---
<DemoShell variant={variant}>
  <Laag>
    <DemoHero slot="hero" />
    <Fragment slot="rest">
      <DemoLadder />
      <DemoServices />
    </Fragment>
  </Laag>
</DemoShell>
```

| Pagina | LAAGBESTAND | SLUG |
|---|---|---|
| `src/pages/kickass/neon-jungle.astro` | `NeonJungle` | `neon-jungle` |
| `src/pages/kickass/maanlicht.astro` | `Maanlicht` | `maanlicht` |
| `src/pages/kickass/bento.astro` | `Bento` | `bento` |
| `src/pages/kickass/terminal.astro` | `Terminal` | `terminal` |
| `src/pages/kickass/aurora.astro` | `Aurora` | `aurora` |
| `src/pages/kickass/spotlight.astro` | `Spotlight` | `spotlight` |
| `src/pages/kickass/klimmen.astro` | `Klimmen` | `klimmen` |
| `src/pages/kickass/brutalist.astro` | `Brutalist` | `brutalist` |
| `src/pages/kickass/netwerk.astro` | `Netwerk` | `netwerk` |
| `src/pages/kickass/vloeibaar.astro` | `Vloeibaar` | `vloeibaar` |

---

## Task 1: Media klaarmaken voor het web

**Files:**
- Create: `scripts/media-webp.mjs`
- Create: `public/media/superpowers/monkai.webp`
- Create: `public/media/superpowers/monkai-640.webp`
- Create: `public/media/superpowers/monkai-web.glb`
- Create: `public/media/superpowers/LEESMIJ.md`

**Interfaces:**
- Consumes: `public/media/monkai.png` (1254x1254, 2,0 MB) en `public/media/monkai.glb` (30,6 MB, 499.758 driehoeken, textuur 14,5 MB) zoals Stijn ze aanleverde. Die twee blijven ongewijzigd staan.
- Produces: drie bestanden in `public/media/superpowers/`. Latere taken verwijzen ernaar met de paden `/media/superpowers/monkai.webp`, `/media/superpowers/monkai-640.webp` en `/media/superpowers/monkai-web.glb`.

- [ ] **Step 1: Schrijf het omzetscript voor het beeld**

Maak `scripts/media-webp.mjs`:

```js
// Eenmalige omzetting van het aangeleverde beeld naar webformaat.
//
// Draait buiten de build. sharp staat bewust niet in package.json: het is een
// zwaar binair pakket dat we één keer nodig hebben. Installeer het tijdelijk:
//
//   npm i --no-save sharp
//   node scripts/media-webp.mjs
//   npm remove --no-save sharp   (of gewoon node_modules laten staan)
//
// De uitvoer wordt gecommit, dus de build heeft sharp nooit nodig.
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const bron = 'public/media/monkai.png';
const doel = 'public/media/superpowers';

mkdirSync(doel, { recursive: true });

await sharp(bron).webp({ quality: 82 }).toFile(`${doel}/monkai.webp`);
await sharp(bron).resize(640).webp({ quality: 80 }).toFile(`${doel}/monkai-640.webp`);

console.log('klaar');
```

- [ ] **Step 2: Draai het en controleer de budgetten**

```bash
npm i --no-save sharp
node scripts/media-webp.mjs
ls -l public/media/superpowers/
```

Verwacht: `monkai.webp` onder 250 kB, `monkai-640.webp` onder 80 kB. Zit `monkai.webp` erboven, verlaag de kwaliteit naar 75 en draai opnieuw.

- [ ] **Step 3: Bekijk het resultaat**

Open `public/media/superpowers/monkai.webp` met de Read-tool en vergelijk met het origineel. Het aapje, de koptelefoon en de schermen op de achtergrond moeten scherp blijven. Is het beeld zichtbaar papperig, zet de kwaliteit op 88 en accepteer een groter bestand tot 350 kB.

- [ ] **Step 4: Optimaliseer het 3D-model**

```bash
mkdir -p public/media/superpowers
npx --yes @gltf-transform/cli@4 optimize public/media/monkai.glb public/media/superpowers/monkai-web.glb --compress meshopt --texture-compress webp --texture-size 2048 --simplify true --simplify-error 0.01
ls -l public/media/superpowers/monkai-web.glb
```

Verwacht: onder 3 MB. Zit het erboven, draai opnieuw met `--texture-size 1024` en `--simplify-error 0.02`. Blijft het erboven, verlaag verder tot het haalbaar is; het model wordt op hero-afstand getoond, niet van dichtbij.

- [ ] **Step 5: Reken na wat eruit kwam**

```bash
node -e "
const fs=require('fs');
const b=fs.readFileSync('public/media/superpowers/monkai-web.glb');
const jsonLen=b.readUInt32LE(12);
const j=JSON.parse(b.slice(20,20+jsonLen).toString('utf8'));
let tris=0;
for(const m of j.meshes||[]) for(const p of m.primitives||[]) { const a=j.accessors[p.indices]; if(a) tris+=a.count/3; }
console.log('driehoeken:', Math.round(tris));
console.log('extensies:', (j.extensionsUsed||[]).join(', '));
console.log('MB:', (b.length/1048576).toFixed(2));
"
```

Verwacht: minder dan 80.000 driehoeken, `EXT_meshopt_compression` in de extensies, onder 3 MB. Staat meshopt er niet bij, dan is de `--compress`-vlag genegeerd en moet taak 11 de decoder niet inhangen; noteer dat dan in het LEESMIJ.

- [ ] **Step 6: Schrijf het LEESMIJ**

Maak `public/media/superpowers/LEESMIJ.md`:

```markdown
# Media voor de superpowers-varianten

Deze bestanden zijn afgeleid van wat Stijn aanleverde in `public/media/`. De
originelen blijven daar staan en worden niet gebruikt op een pagina: ze zijn
samen 32 MB.

| Bestand | Bron | Hoe gemaakt |
|---|---|---|
| `monkai.webp` | `monkai.png` | `node scripts/media-webp.mjs` (sharp, kwaliteit 82) |
| `monkai-640.webp` | `monkai.png` | idem, 640 px breed |
| `monkai-web.glb` | `monkai.glb` | `npx @gltf-transform/cli optimize` (zie het plan, taak 1) |

Vervangt Stijn een origineel, draai die twee opdrachten opnieuw. De paden in de
componenten wijzen naar deze map, dus er hoeft geen code te wijzigen.
```

- [ ] **Step 7: Commit**

```bash
git add scripts/media-webp.mjs public/media/superpowers/
git commit -F - <<'EOF'
feat: webversies van het aapje, beeld en 3D-model

Het aangeleverde beeld is 2 MB en het model 30,6 MB met 500.000 driehoeken.
Beide zijn te zwaar om te tonen. De originelen blijven staan, hiernaast komen
webversies: WebP voor het beeld, meshopt en een kleinere textuur voor het model.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 2: Het fundament, de galerij en het controlescript

**Files:**
- Create: `src/kickass/variants.ts`
- Create: `src/components/kickass/DemoShell.astro`
- Create: `src/components/kickass/DemoHero.astro`
- Create: `src/components/kickass/DemoLadder.astro`
- Create: `src/components/kickass/DemoServices.astro`
- Create: `src/pages/kickass/index.astro`
- Create: `scripts/check-kickass.mjs`
- Modify: `astro.config.mjs:17-21`

**Interfaces:**
- Produces:
  - `VARIANTS: Variant[]` en `variantBySlug(slug: string): Variant` uit `src/kickass/variants.ts`. `Variant = { slug: string; nummer: number; naam: string; pitch: string; techniek: string; gewicht: 'licht' | 'middel' | 'zwaar' }`.
  - `DemoShell.astro` met prop `variant: Variant` en één naamloze slot.
  - `DemoHero.astro`, `DemoLadder.astro`, `DemoServices.astro`, geen props.
  - `node scripts/check-kickass.mjs` als controle na elke build.
- Consumes: niets uit taak 1. Deze taak kan er los van.

- [ ] **Step 1: Schrijf het manifest**

Maak `src/kickass/variants.ts`:

```ts
// Het manifest van de keuzeronde. De galerij en de tien paginabestanden lezen
// hieruit, zodat een naam of een pitch op één plek staat.
//
// De slug is ook de waarde van data-kickass op <html> en de prefix van elke
// CSS-regel van de bijbehorende laag. Wijzig een slug dus niet los.

export type Gewicht = 'licht' | 'middel' | 'zwaar';

export type Variant = {
  slug: string;
  nummer: number;
  naam: string;
  pitch: string;
  techniek: string;
  gewicht: Gewicht;
};

export const VARIANTS: Variant[] = [
  {
    slug: 'neon-jungle',
    nummer: 1,
    naam: 'Neon Jungle',
    pitch: 'Het aapje draait in 3D achter de titel, met felgroen randlicht op bijna zwart.',
    techniek: 'three.js met het geoptimaliseerde model',
    gewicht: 'zwaar',
  },
  {
    slug: 'maanlicht',
    nummer: 2,
    naam: 'Maanlicht',
    pitch: 'De avondscene vult het scherm, de maan komt op en het licht trekt traag over het beeld.',
    techniek: 'CSS-animatie op het beeld',
    gewicht: 'licht',
  },
  {
    slug: 'bento',
    nummer: 3,
    naam: 'Bento-cockpit',
    pitch: 'De hero wordt een raster van tegels die elk iets doen: typen, tellen, draaien, spelen.',
    techniek: 'raster plus 3D plus beeld',
    gewicht: 'zwaar',
  },
  {
    slug: 'terminal',
    nummer: 4,
    naam: 'Terminal',
    pitch: 'Fosforgroen op zwart, scanlijnen, en een titel die zich uittypt achter een knipperende cursor.',
    techniek: 'CSS met een kort script',
    gewicht: 'licht',
  },
  {
    slug: 'aurora',
    nummer: 5,
    naam: 'Aurora',
    pitch: 'Een traag bewegend kleurverloop achter matglazen kaarten.',
    techniek: 'CSS, geen script',
    gewicht: 'licht',
  },
  {
    slug: 'spotlight',
    nummer: 6,
    naam: 'Spotlight',
    pitch: 'Een lichtbundel rond je cursor onthult de pagina, kaarten lichten op waar je kijkt.',
    techniek: 'twee CSS-variabelen die de muis volgen',
    gewicht: 'licht',
  },
  {
    slug: 'klimmen',
    nummer: 7,
    naam: 'De klimmende aap',
    pitch: 'De ladder wordt plakkerig en het aapje klimt van trede naar trede terwijl je scrolt.',
    techniek: 'scroll-gestuurde CSS',
    gewicht: 'middel',
  },
  {
    slug: 'brutalist',
    nummer: 8,
    naam: 'Brutalist',
    pitch: 'Letters tot tegen de rand, harde vlakken, harde schaduwen, geen enkele afronding.',
    techniek: 'CSS, geen script',
    gewicht: 'licht',
  },
  {
    slug: 'netwerk',
    nummer: 9,
    naam: 'Neuraal netwerk',
    pitch: 'Een puntennetwerk dat op je muis reageert en in de hero even een apenkop vormt.',
    techniek: 'canvas 2D, eigen code',
    gewicht: 'middel',
  },
  {
    slug: 'vloeibaar',
    nummer: 10,
    naam: 'Vloeibaar',
    pitch: 'De titel golft als water waar je met de muis doorheen gaat, met korrel over de pagina.',
    techniek: 'SVG-filters',
    gewicht: 'middel',
  },
];

export function variantBySlug(slug: string): Variant {
  const gevonden = VARIANTS.find((v) => v.slug === slug);
  if (!gevonden) throw new Error(`Onbekende variant: ${slug}`);
  return gevonden;
}

export function buren(slug: string): { vorige: Variant; volgende: Variant } {
  const i = VARIANTS.findIndex((v) => v.slug === slug);
  return {
    vorige: VARIANTS[(i - 1 + VARIANTS.length) % VARIANTS.length],
    volgende: VARIANTS[(i + 1) % VARIANTS.length],
  };
}
```

- [ ] **Step 2: Schrijf het omhulsel**

Maak `src/components/kickass/DemoShell.astro`:

```astro
---
// Pagina-omhulsel voor de demovarianten. Bewust niet BaseLayout: die brengt
// navigatie, footer, consent-banner, analytics en de sitewide JSON-LD mee, en
// dat hoort geen van alle op een wegwerpdemo.
//
// Het blokkerende themascript uit BaseLayout zit hier niet in: de stand van een
// demopagina ligt vast en volgt niet de voorkeur van de bezoeker.
import '../../styles/global.css';
import { buren, type Variant } from '../../kickass/variants';

interface Props {
  variant: Variant;
}

const { variant } = Astro.props;
const { vorige, volgende } = buren(variant.slug);
---

<!doctype html>
<html lang="nl" data-theme="superpowers" data-kickass={variant.slug}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{variant.nummer}. {variant.naam} - kickass</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div class="demobalk">
      <a class="demobalk-terug" href="/kickass/">Alle varianten</a>
      <span class="demobalk-naam">{variant.nummer}. {variant.naam}</span>
      <span class="demobalk-nav">
        <a href={`/kickass/${vorige.slug}/`} title={vorige.naam}>vorige</a>
        <a href={`/kickass/${volgende.slug}/`} title={volgende.naam}>volgende</a>
      </span>
    </div>
    <slot />
  </body>
</html>

<style>
  /* Bewust niet in tokens uitgedrukt: de balk hoort bij het keuzegereedschap en
     moet in elke variant hetzelfde blijven, ook als die variant zijn tokens
     helemaal omgooit. Vandaar vaste waarden. */
  .demobalk {
    position: sticky;
    top: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 16px;
    height: 44px;
    padding: 0 16px;
    background: #101208;
    color: #C9CBBF;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    border-bottom: 1px solid #3A3D33;
  }

  .demobalk a {
    color: #C9CBBF;
    text-decoration: none;
    border-bottom: 1px solid transparent;
  }

  .demobalk a:hover {
    color: #FFFFFF;
    border-bottom-color: #FFFFFF;
  }

  .demobalk-naam {
    color: #FFFFFF;
  }

  .demobalk-nav {
    margin-left: auto;
    display: flex;
    gap: 14px;
  }

  @media (max-width: 768px) {
    .demobalk-terug {
      display: none;
    }
  }
</style>
```

- [ ] **Step 3: Schrijf de drie gedeelde secties**

Dit zijn kopieën van de echte componenten, met de klassenamen intact zodat de lagen erop kunnen mikken. Bewuste duplicatie: de echte site mag niet wijzigen voor een demo.

Maak `src/components/kickass/DemoHero.astro`:

```astro
---
// Kopie van Hero.astro, zonder het analytics-script. De klassenamen blijven
// gelijk zodat een laag ze kan herstijlen.
---
<section class="section hero" id="top" style="border-top:none;">
  <div class="hero-inner">
    <h1 class="hero-titel">AI zonder apenstreken<span style="color:var(--green)">.</span></h1>
    <p class="lede">Ik help Vlaamse KMO's rustig en veilig starten met AI. Klein beginnen, herhalen, beheersen.</p>
    <div class="hero-cta">
      <a class="btn" href="#aanpak">Laten we praten</a>
      <a class="link-underline" href="#aanpak">Bekijk de aanpak</a>
    </div>
    <div class="hero-meta"><span>Inspiratiesessie</span><span class="sep">|</span><span>Sparring in kleine groepen</span><span class="sep">|</span><span>bij jou op locatie</span></div>
  </div>
</section>
<style>
  .hero { display:flex; flex-direction:column; align-items:center; text-align:center; padding:110px 64px 90px; position:relative; }
  .hero-inner { display:flex; flex-direction:column; align-items:center; gap:28px; max-width:820px; position:relative; z-index:1; }
  h1 { font-size:68px; font-weight:500; line-height:1.08; text-wrap:pretty; }
  .lede { margin:0; font-size:20px; line-height:1.6; color:var(--muted); max-width:620px; }
  .hero-cta { display:flex; gap:18px; align-items:center; }
  .link-underline { color:var(--ink); font-weight:600; padding:15px 4px; border-bottom:1.5px solid var(--ink); }
  .hero-meta { display:flex; gap:14px; color:var(--muted); font-size:15px; margin-top:8px; }
  .hero-meta .sep { color:var(--border); }
  @media (max-width:768px){ .hero{ padding:64px 22px 56px; } h1{ font-size:40px; } .lede{ font-size:17px; } .hero-cta{ flex-direction:column; width:100%; } .hero-cta .btn{ width:100%; text-align:center; } .hero-meta{ flex-wrap:wrap; justify-content:center; gap:10px; font-size:14px; } }
</style>
```

Maak `src/components/kickass/DemoLadder.astro`:

```astro
---
// Kopie van Ladder.astro.
---
<section class="section ladder" id="aanpak">
  <div class="container ladder-inner">
    <div class="ladder-head">
      <h2>Drie niveaus, één tempo</h2>
      <p class="lede">Elk bedrijf start op het eerste niveau. De volgende komen pas als het vorige werkt.</p>
    </div>
    <div class="ladder-rows">
      <div class="ladder-row row-automate">
        <div class="ladder-title">Automatiseren</div>
        <p>Repetitieve back-office taken wegnemen met AI-automatisaties in n8n, Make of vergelijkbare tools. Bijvoorbeeld: bonnetjes en facturen automatisch laten lezen, hernoemen, taggen, in de juiste map zetten en doorsturen naar de boekhouding.</p>
      </div>
      <div class="ladder-row row-remember">
        <div class="ladder-title">Onthouden</div>
        <p>Een second brain voor jezelf, een collective brain voor het bedrijf: één gedeeld bedrijfsgeheugen waar kennis niet langer alleen in hoofden zit. Kennis zo structureren dat je in minuten een eerste versie hebt in plaats van in dagen.</p>
      </div>
      <div class="ladder-row row-accelerate">
        <div class="ladder-title">Versnellen</div>
        <p>Accelerated coding: ontwikkelteams die met AI sneller en met betere kwaliteit werken, met behoud van controle en security.</p>
      </div>
    </div>
  </div>
</section>
<style>
  .ladder-inner { display:flex; flex-direction:column; gap:44px; }
  .ladder-head { display:flex; flex-direction:column; gap:12px; max-width:640px; }
  h2 { font-size:40px; font-weight:500; }
  .lede { margin:0; font-size:17px; line-height:1.65; color:var(--muted); }
  .ladder-rows { display:flex; flex-direction:column; gap:14px; }
  .ladder-row { border-radius:var(--radius); display:grid; grid-template-columns:220px 1fr; gap:32px; align-items:baseline; }
  .ladder-row p { margin:0; font-size:17px; line-height:1.65; }
  .ladder-title { font-family:var(--font-serif); }
  .row-automate { background:var(--card); border:1px solid var(--border); padding:34px 40px; }
  .row-automate .ladder-title { font-size:26px; font-weight:500; }
  .row-automate p { color:var(--muted); }
  .row-remember { background:var(--card-alt); border:1px solid var(--border); padding:38px 40px; }
  .row-remember .ladder-title { font-size:28px; font-weight:600; }
  .row-remember p { color:var(--ink-soft); }
  .row-accelerate { background:var(--dark); padding:42px 40px; }
  .row-accelerate .ladder-title { font-size:30px; font-weight:600; color:var(--dark-bright); }
  .row-accelerate p { color:var(--dark-text); }
  @media (max-width:768px){
    h2{ font-size:30px; }
    .ladder-row{ grid-template-columns:1fr; gap:8px; }
    .ladder-row p{ font-size:16px; }
    .row-automate{ padding:24px; }
    .row-remember{ padding:26px 24px; }
    .row-accelerate{ padding:28px 24px; }
  }
</style>
```

Maak `src/components/kickass/DemoServices.astro`:

```astro
---
// Kopie van Services.astro, acht gewone kaarten plus de donkere kaart.
const services = [
  { title: 'AI-inspiratiesessie', text: 'Twee uur, max 10 deelnemers, bij jou op locatie. Het vertrekpunt van elk traject.' },
  { title: 'Use case workshop', text: 'Ideeën verzamelen en wegen op een impact/effort-matrix. Je vertrekt met drie haalbare cases.' },
  { title: 'AI-geletterdheid en AI-maturiteit', text: 'Waar staat je team vandaag? We werken op maat van elk niveau, van sceptisch tot gevorderd.' },
  { title: 'AI-governance en EU AI Act', text: 'Duidelijke afspraken over data, tools en verantwoordelijkheid. Klaar voor de wet, zonder juristentaal.' },
  { title: 'Claude voor kenniswerkers', text: 'In kleine groepen leren kenniswerkers veilig en slim werken met Claude, op hun eigen taken.' },
  { title: 'Claude voor developers', text: 'Accelerated coding: sneller ontwikkelen met Claude als assistent, met behoud van controle en kwaliteit.' },
  { title: 'Microsoft 365 Copilot veilig inzetten', text: 'Copilot staat vaak al aan. Ik help je het veilig en zinvol gebruiken.' },
  { title: 'Het juiste model kiezen', text: 'Niet gebonden aan één leverancier. Ook ChatGPT, Gemini en Chinese modellen komen op tafel als ze beter passen.' },
];
---
<section class="section services" id="diensten">
  <div class="container services-inner">
    <h2>Diensten</h2>
    <div class="services-grid">
      {services.map((service) => (
        <div class="service-card">
          <h3>{service.title}</h3>
          <p>{service.text}</p>
        </div>
      ))}
      <div class="service-card service-card--dark">
        <div class="eyebrow">Langlopend engagement</div>
        <h3>Raad van advies</h3>
        <p>Zetelen in je raad van advies rond AI, digitale transformatie en innovatie in de brede zin. Geen project, wel een vaste kritische stem aan tafel.</p>
      </div>
    </div>
  </div>
</section>
<style>
  .services { background:var(--section-alt); }
  .services-inner { display:flex; flex-direction:column; gap:44px; }
  h2 { font-size:40px; font-weight:500; }
  .services-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; }
  .service-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:28px; display:flex; flex-direction:column; gap:10px; }
  .service-card h3 { font-size:20px; font-weight:600; }
  .service-card p { margin:0; font-size:16px; line-height:1.6; color:var(--muted); }
  .service-card--dark { background:var(--dark); border:none; justify-content:center; }
  .service-card--dark .eyebrow { font-size:12px; color:var(--dark-dim); }
  .service-card--dark h3 { color:var(--dark-bright); }
  .service-card--dark p { color:var(--dark-text); }
  @media (max-width:768px){ h2{ font-size:30px; } .services-grid{ grid-template-columns:1fr; } }
</style>
```

- [ ] **Step 4: Schrijf de galerij**

Maak `src/pages/kickass/index.astro`:

```astro
---
import '../../styles/global.css';
import { VARIANTS } from '../../kickass/variants';
---
<!doctype html>
<html lang="nl" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kickass: tien superpowers-varianten</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <main class="section">
      <div class="container galerij">
        <div class="kop">
          <h1>Tien varianten voor de superpowers-stand</h1>
          <p class="lede">
            Klik ze door en kies er één. Wat je hier ziet zijn demo's: dezelfde drie secties in tien
            stijlen. Alleen de winnaar wordt daarna netjes gebouwd en aan de themaschakelaar gehangen.
          </p>
        </div>
        <ol class="tegels">
          {VARIANTS.map((variant) => (
            <li>
              <a class="tegel" href={`/kickass/${variant.slug}/`}>
                <span class="nummer">{String(variant.nummer).padStart(2, '0')}</span>
                <h2>{variant.naam}</h2>
                <p>{variant.pitch}</p>
                <span class="voet">
                  <span class="techniek">{variant.techniek}</span>
                  <span class={`gewicht gewicht--${variant.gewicht}`}>{variant.gewicht}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </main>
  </body>
</html>

<style>
  .galerij { display: flex; flex-direction: column; gap: 44px; }
  .kop { display: flex; flex-direction: column; gap: 12px; max-width: 660px; }
  h1 { font-size: 44px; font-weight: 500; }
  .lede { margin: 0; font-size: 17px; line-height: 1.65; color: var(--muted); }
  .tegels { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .tegel { display: flex; flex-direction: column; gap: 10px; height: 100%; padding: 28px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); color: var(--ink); }
  .tegel:hover { border-color: var(--green); color: var(--ink); }
  .nummer { font-family: var(--font-mono); font-size: 13px; color: var(--green); }
  .tegel h2 { font-size: 24px; font-weight: 600; }
  .tegel p { margin: 0; font-size: 16px; line-height: 1.6; color: var(--muted); }
  .voet { margin-top: auto; padding-top: 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-family: var(--font-mono); font-size: 12px; }
  .techniek { color: var(--muted); }
  .gewicht { padding: 2px 8px; border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--ink-soft); }
  .gewicht--zwaar { border-color: var(--green); color: var(--green); }
  @media (max-width: 768px) { h1 { font-size: 30px; } .tegels { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 5: Sluit /kickass uit de sitemap**

Wijzig `astro.config.mjs`, het filterblok:

```js
    sitemap({
      // /bedankt, /data, /inspiratie, /kickass en de doorstuurpaden /prompt(s) zijn
      // noindex, die horen niet in de sitemap. '/prompt' dekt ook '/prompts'.
      filter: (page) =>
        !page.includes('/bedankt') &&
        !page.includes('/data') &&
        !page.includes('/inspiratie') &&
        !page.includes('/kickass') &&
        !page.includes('/prompt'),
    }),
```

- [ ] **Step 6: Schrijf het controlescript**

Maak `scripts/check-kickass.mjs`:

```js
// Controle op de gebouwde site. Draai na `npm run build`:
//
//   node scripts/check-kickass.mjs
//
// Geen afhankelijkheden, alleen Node. Controleert vier dingen die je met het
// blote oog niet ziet: dat elke pagina er staat en noindex is, dat de CSS van
// variant A niet meelift op de pagina van variant B, dat /kickass uit de
// sitemap blijft, en dat de media binnen hun budget vallen.
import { readFileSync, existsSync, statSync } from 'node:fs';

const VERWACHT = [
  'neon-jungle', 'maanlicht', 'bento', 'terminal', 'aurora',
  'spotlight', 'klimmen', 'brutalist', 'netwerk', 'vloeibaar',
];

const BUDGET = {
  'public/media/superpowers/monkai.webp': 350 * 1024,
  'public/media/superpowers/monkai-640.webp': 80 * 1024,
  'public/media/superpowers/monkai-web.glb': 3 * 1024 * 1024,
};

let fouten = 0;
function fout(bericht) {
  console.error('FOUT  ' + bericht);
  fouten++;
}
function ok(bericht) {
  console.log('ok    ' + bericht);
}

// Alle CSS die een pagina binnenhaalt, plus zijn inline stijlen.
function stijlenVan(html) {
  let alles = '';
  for (const m of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) {
    const pad = 'dist' + m[1];
    if (existsSync(pad)) alles += readFileSync(pad, 'utf8');
    else fout(`stylesheet ontbreekt in dist: ${m[1]}`);
  }
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) alles += m[1];
  return alles;
}

// De galerij.
if (!existsSync('dist/kickass/index.html')) {
  fout('dist/kickass/index.html ontbreekt');
} else {
  const html = readFileSync('dist/kickass/index.html', 'utf8');
  if (!html.includes('noindex')) fout('de galerij mist de noindex-meta');
  for (const slug of VERWACHT) {
    if (!html.includes(`/kickass/${slug}/`)) fout(`de galerij linkt niet naar ${slug}`);
  }
  ok('galerij aanwezig, noindex, tien links');
}

// De tien varianten.
for (const slug of VERWACHT) {
  const pad = `dist/kickass/${slug}/index.html`;
  if (!existsSync(pad)) {
    fout(`${pad} ontbreekt`);
    continue;
  }
  const html = readFileSync(pad, 'utf8');

  if (!html.includes(`data-kickass="${slug}"`)) fout(`${slug}: data-kickass ontbreekt of klopt niet`);
  if (!html.includes('data-theme="superpowers"')) fout(`${slug}: data-theme staat niet op superpowers`);
  if (!html.includes('noindex')) fout(`${slug}: noindex-meta ontbreekt`);

  // Isolatie. Elke laag zet --kickass-laag met zijn eigen slug. Komt er meer dan
  // één voor, dan lift de CSS van een andere variant mee.
  const css = stijlenVan(html);
  const gevonden = [...css.matchAll(/--kickass-laag:\s*['"]([a-z-]+)['"]/g)].map((m) => m[1]);
  const uniek = [...new Set(gevonden)];
  if (uniek.length === 0) fout(`${slug}: geen --kickass-laag gevonden, laadt de laag wel?`);
  else if (uniek.length > 1) fout(`${slug}: CSS van meerdere varianten op één pagina: ${uniek.join(', ')}`);
  else if (uniek[0] !== slug) fout(`${slug}: draagt de laag van ${uniek[0]}`);
  else ok(`${slug}: pagina in orde en geïsoleerd`);
}

// De sitemap.
const sitemaps = ['dist/sitemap-0.xml', 'dist/sitemap-index.xml'];
for (const pad of sitemaps) {
  if (existsSync(pad) && readFileSync(pad, 'utf8').includes('/kickass')) {
    fout(`${pad} bevat /kickass`);
  }
}
ok('sitemap bevat geen /kickass');

// De mediabudgetten.
for (const [pad, max] of Object.entries(BUDGET)) {
  if (!existsSync(pad)) {
    console.log(`over   ${pad} bestaat nog niet, overgeslagen`);
    continue;
  }
  const grootte = statSync(pad).size;
  if (grootte > max) fout(`${pad} is ${(grootte / 1024).toFixed(0)} kB, budget is ${(max / 1024).toFixed(0)} kB`);
  else ok(`${pad}: ${(grootte / 1024).toFixed(0)} kB`);
}

if (fouten > 0) {
  console.error(`\n${fouten} fout(en).`);
  process.exit(1);
}
console.log('\nAlles in orde.');
```

- [ ] **Step 7: Draai de controle en zie hem falen op de juiste manier**

```bash
npm run build && node scripts/check-kickass.mjs
```

Verwacht: de galerij is in orde, en tien fouten van de vorm `dist/kickass/<slug>/index.html ontbreekt`. Dat is correct: de variantpagina's komen in de volgende taken. Faalt er iets anders, los dat eerst op.

- [ ] **Step 8: Commit**

```bash
git add src/kickass src/components/kickass src/pages/kickass scripts/check-kickass.mjs astro.config.mjs
git commit -F - <<'EOF'
feat: fundament voor de kickass-galerij

Manifest met de tien varianten, een eigen pagina-omhulsel zonder navigatie of
analytics, de drie gedeelde secties, de galerij zelf en een controlescript dat
na de build nakijkt of een variantpagina geen CSS van een andere variant draagt.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 3: Variant 4, Terminal

De eerste laag. Deze taak legt het patroon vast dat alle volgende lagen volgen: een `<style is:global>` met alles onder `:root[data-kickass='<slug>']`, een `--kickass-laag`-vingerafdruk, een `hero`- en een `rest`-slot, en een reduced-motion-blok.

**Files:**
- Create: `src/components/kickass/layers/Terminal.astro`
- Create: `src/pages/kickass/terminal.astro`

**Interfaces:**
- Consumes: `DemoShell.astro` (prop `variant`), `variantBySlug` uit taak 2.
- Produces: het laagpatroon. Elke laag exporteert twee slots: `hero` en `rest`. Een laag die de hero vervangt rendert `<slot name="hero" />` gewoon niet.

- [ ] **Step 1: Schrijf de laag**

Maak `src/components/kickass/layers/Terminal.astro`:

```astro
---
// Variant 4: de site als een terminal. Fosforgroen op zwart, scanlijnen, een
// prompt voor elke sectiekop en een titel die zich uittypt.
//
// Patroon voor alle lagen: alle CSS staat onder :root[data-kickass='<slug>'],
// zodat er niets kan lekken naar een andere variant. --kickass-laag is de
// vingerafdruk waarop scripts/check-kickass.mjs de isolatie controleert.
---

<div class="scanlijnen" aria-hidden="true"></div>
<slot name="hero" />
<slot name="rest" />

<script>
  // Typt de hero-titel uit. Doet niets bij reduced motion: dan staat de tekst er
  // gewoon meteen.
  const titel = document.querySelector<HTMLElement>('.hero-titel');
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (titel && !rustig) {
    const volledig = titel.textContent ?? '';
    titel.textContent = '';
    titel.classList.add('typt');
    let i = 0;
    const stap = () => {
      titel.textContent = volledig.slice(0, i);
      i++;
      if (i <= volledig.length) window.setTimeout(stap, 45);
      else titel.classList.remove('typt');
    };
    stap();
  }
</script>

<style is:global>
  :root[data-kickass='terminal'] {
    --kickass-laag: 'terminal';

    --bg-page: #050806;
    --bg-canvas: #050806;
    --section-alt: #070B08;
    --card: #080D09;
    --card-alt: #0A1109;
    --border: #1C3A24;

    --ink: #7CFFA8;
    --ink-soft: #5FD98A;
    --muted: #3E8E5C;

    --green: #7CFFA8;
    --green-hover: #C6FFDA;
    --green-light: #7CFFA8;
    --on-green: #041008;

    --dark: #0A1109;
    --dark-text: #7CFFA8;
    --dark-dim: #3E8E5C;
    --dark-border: #1C3A24;
    --dark-bright: #D6FFE6;

    --radius: 0;
    --radius-sm: 0;
    --font-serif: 'JetBrains Mono', monospace;
    --font-sans: 'JetBrains Mono', monospace;
  }

  :root[data-kickass='terminal'] body {
    text-shadow: 0 0 6px rgba(124, 255, 168, 0.35);
  }

  /* De scanlijnen liggen over alles heen maar vangen geen klikken. */
  :root[data-kickass='terminal'] .scanlijnen {
    position: fixed;
    inset: 0;
    z-index: 500;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0px,
      rgba(0, 0, 0, 0) 2px,
      rgba(0, 0, 0, 0.28) 3px,
      rgba(0, 0, 0, 0.28) 4px
    );
    animation: terminal-rol 8s linear infinite;
  }

  @keyframes terminal-rol {
    from { background-position: 0 0; }
    to { background-position: 0 200px; }
  }

  :root[data-kickass='terminal'] h1,
  :root[data-kickass='terminal'] h2,
  :root[data-kickass='terminal'] h3 {
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  :root[data-kickass='terminal'] h1 { font-size: 52px; }

  /* De knipperende cursor hangt aan de titel zolang die aan het typen is. */
  :root[data-kickass='terminal'] .hero-titel.typt::after,
  :root[data-kickass='terminal'] .hero-titel:not(.typt)::after {
    content: '_';
    animation: terminal-knipper 1s steps(1) infinite;
  }

  @keyframes terminal-knipper {
    50% { opacity: 0; }
  }

  /* Een prompt voor elke sectiekop. */
  :root[data-kickass='terminal'] .ladder-head h2::before,
  :root[data-kickass='terminal'] .services-inner h2::before {
    content: '$ ';
    color: var(--muted);
  }

  /* Kaarten worden vensters met een titelbalk. */
  :root[data-kickass='terminal'] .service-card {
    position: relative;
    padding-top: 40px;
  }

  :root[data-kickass='terminal'] .service-card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 24px;
    border-bottom: 1px solid var(--border);
    background: rgba(124, 255, 168, 0.06);
  }

  :root[data-kickass='terminal'] .service-card h3 {
    font-size: 17px;
  }

  :root[data-kickass='terminal'] .ladder-row {
    border-left: 3px solid var(--green);
  }

  :root[data-kickass='terminal'] .btn {
    border: 1px solid var(--green);
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='terminal'] .scanlijnen { animation: none; }
    :root[data-kickass='terminal'] .hero-titel::after { animation: none; }
  }
</style>
```

- [ ] **Step 2: Schrijf het paginabestand**

Maak `src/pages/kickass/terminal.astro`:

```astro
---
import DemoShell from '../../components/kickass/DemoShell.astro';
import DemoHero from '../../components/kickass/DemoHero.astro';
import DemoLadder from '../../components/kickass/DemoLadder.astro';
import DemoServices from '../../components/kickass/DemoServices.astro';
import Laag from '../../components/kickass/layers/Terminal.astro';
import { variantBySlug } from '../../kickass/variants';

const variant = variantBySlug('terminal');
---
<DemoShell variant={variant}>
  <Laag>
    <DemoHero slot="hero" />
    <Fragment slot="rest">
      <DemoLadder />
      <DemoServices />
    </Fragment>
  </Laag>
</DemoShell>
```

- [ ] **Step 3: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

Verwacht: `ok    terminal: pagina in orde en geïsoleerd`, en negen resterende `ontbreekt`-fouten voor de andere varianten.

- [ ] **Step 4: Bekijk hem**

Start `npm run preview` en open `/kickass/terminal/`. Controleer: de titel typt zich uit, de cursor knippert, de scanlijnen rollen traag, de sectiekoppen hebben een `$`, de kaarten hebben een titelbalk, en de tekst is leesbaar. Maak een screenshot voor de vergelijking later.

- [ ] **Step 5: Commit**

```bash
git add src/components/kickass/layers/Terminal.astro src/pages/kickass/terminal.astro
git commit -F - <<'EOF'
feat: variant Terminal

Eerste laag, en meteen het patroon voor de negen andere: alle CSS onder
:root[data-kickass='<slug>'], een --kickass-laag als vingerafdruk voor de
isolatiecontrole, en een hero- en rest-slot.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 4: Variant 2, Maanlicht

**Files:**
- Create: `src/components/kickass/layers/Maanlicht.astro`
- Create: `src/pages/kickass/maanlicht.astro`

**Interfaces:**
- Consumes: `/media/superpowers/monkai.webp` en `/media/superpowers/monkai-640.webp` uit taak 1, plus het laagpatroon uit taak 3.

- [ ] **Step 1: Schrijf de laag**

Maak `src/components/kickass/layers/Maanlicht.astro`:

```astro
---
// Variant 2: de avondscene vult het scherm achter de hero. Het beeld zoomt heel
// traag in, een maan komt op en er trekt een lichtwaas overheen.
//
// Het oorspronkelijke idee was een videoloop. Het aangeleverde beeld toont exact
// dezelfde scene voor een fractie van het gewicht, dus dat is het geworden. Komt
// er later toch een echte loop, dan vervangt een <video> hier de <img> en blijft
// de rest van de laag staan.
---

<div class="maan-achtergrond" aria-hidden="true">
  <img
    class="maan-beeld"
    src="/media/superpowers/monkai.webp"
    srcset="/media/superpowers/monkai-640.webp 640w, /media/superpowers/monkai.webp 1254w"
    sizes="100vw"
    alt=""
    width="1254"
    height="1254"
    fetchpriority="high"
  />
  <div class="maan-schijf"></div>
  <div class="maan-waas"></div>
  <div class="maan-sluier"></div>
</div>

<slot name="hero" />
<slot name="rest" />

<style is:global>
  :root[data-kickass='maanlicht'] {
    --kickass-laag: 'maanlicht';

    --bg-page: #080D18;
    --bg-canvas: #0B1220;
    --section-alt: #0A101C;
    --card: #111A2B;
    --card-alt: #16223A;
    --border: #24314B;

    --ink: #EAF1FF;
    --ink-soft: #C4D2EC;
    --muted: #8FA2C4;

    --green: #8FB6FF;
    --green-hover: #B4CEFF;
    --green-light: #8FB6FF;
    --on-green: #08101F;

    --dark: #16223A;
    --dark-text: #EAF1FF;
    --dark-dim: #9FB0CE;
    --dark-border: #2C3A57;
    --dark-bright: #FFFFFF;

    --radius: 14px;
    --radius-sm: 10px;
    --shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
  }

  /* De achtergrond hangt achter de hero en schuift mee weg zodra je voorbij de
     eerste schermhoogte scrolt. Vandaar absoluut en niet fixed. */
  :root[data-kickass='maanlicht'] .maan-achtergrond {
    position: absolute;
    inset: 0 0 auto 0;
    height: 100vh;
    overflow: hidden;
    z-index: 0;
  }

  :root[data-kickass='maanlicht'] body {
    position: relative;
  }

  :root[data-kickass='maanlicht'] .maan-beeld {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 40%;
    animation: maan-zoom 40s ease-in-out infinite alternate;
  }

  @keyframes maan-zoom {
    from { transform: scale(1.05); }
    to { transform: scale(1.18); }
  }

  /* De maan komt op vanachter de onderrand van het beeld. */
  :root[data-kickass='maanlicht'] .maan-schijf {
    position: absolute;
    top: 16%;
    right: 12%;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 34%, #FFFDF2, #D8E2F5 58%, #A8B8D6);
    box-shadow: 0 0 90px 30px rgba(180, 205, 255, 0.35);
    animation: maan-op 26s ease-out infinite alternate;
  }

  @keyframes maan-op {
    from { transform: translateY(60px); opacity: 0.75; }
    to { transform: translateY(-10px); opacity: 1; }
  }

  /* Lichtwaas die traag over het beeld trekt. */
  :root[data-kickass='maanlicht'] .maan-waas {
    position: absolute;
    inset: -20% -40%;
    background: linear-gradient(
      104deg,
      rgba(143, 182, 255, 0) 42%,
      rgba(143, 182, 255, 0.16) 50%,
      rgba(143, 182, 255, 0) 58%
    );
    animation: maan-trek 18s linear infinite;
  }

  @keyframes maan-trek {
    from { transform: translateX(-30%); }
    to { transform: translateX(30%); }
  }

  /* Sluier zodat de tekst leesbaar blijft op elk deel van het beeld. */
  :root[data-kickass='maanlicht'] .maan-sluier {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(8, 13, 24, 0.55) 0%,
      rgba(8, 13, 24, 0.72) 55%,
      rgba(8, 13, 24, 1) 100%
    );
  }

  :root[data-kickass='maanlicht'] .hero {
    min-height: 100vh;
    justify-content: center;
  }

  /* De hero-inhoud als glaskaart boven het beeld. */
  :root[data-kickass='maanlicht'] .hero-inner {
    padding: 48px 56px;
    border-radius: 20px;
    background: rgba(11, 18, 32, 0.42);
    border: 1px solid rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(14px);
    box-shadow: var(--shadow);
  }

  :root[data-kickass='maanlicht'] .service-card,
  :root[data-kickass='maanlicht'] .ladder-row {
    backdrop-filter: blur(8px);
  }

  @media (max-width: 768px) {
    :root[data-kickass='maanlicht'] .hero-inner { padding: 30px 22px; }
    :root[data-kickass='maanlicht'] .maan-schijf { width: 74px; height: 74px; right: 8%; }
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='maanlicht'] .maan-beeld,
    :root[data-kickass='maanlicht'] .maan-schijf,
    :root[data-kickass='maanlicht'] .maan-waas {
      animation: none;
    }
    :root[data-kickass='maanlicht'] .maan-beeld { transform: scale(1.05); }
  }
</style>
```

- [ ] **Step 2: Schrijf het paginabestand**

Maak `src/pages/kickass/maanlicht.astro`, identiek aan het terminal-bestand op twee regels na:

```astro
---
import DemoShell from '../../components/kickass/DemoShell.astro';
import DemoHero from '../../components/kickass/DemoHero.astro';
import DemoLadder from '../../components/kickass/DemoLadder.astro';
import DemoServices from '../../components/kickass/DemoServices.astro';
import Laag from '../../components/kickass/layers/Maanlicht.astro';
import { variantBySlug } from '../../kickass/variants';

const variant = variantBySlug('maanlicht');
---
<DemoShell variant={variant}>
  <Laag>
    <DemoHero slot="hero" />
    <Fragment slot="rest">
      <DemoLadder />
      <DemoServices />
    </Fragment>
  </Laag>
</DemoShell>
```

- [ ] **Step 3: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

Verwacht: `ok    maanlicht: pagina in orde en geïsoleerd`.

- [ ] **Step 4: Bekijk hem**

Open `/kickass/maanlicht/` in de preview. Controleer: het beeld vult het scherm, de maan staat rechtsboven en beweegt traag, de hero-tekst staat leesbaar op de glaskaart, en bij het scrollen komt de rest van de pagina in donkerblauw. Controleer ook dat de titel leesbaar blijft op het lichtste deel van het beeld; is dat niet zo, verhoog de sluier naar `0.65 / 0.8`.

- [ ] **Step 5: Commit**

```bash
git add src/components/kickass/layers/Maanlicht.astro src/pages/kickass/maanlicht.astro
git commit -F - <<'EOF'
feat: variant Maanlicht

De avondscene vult het scherm achter de hero, met een opkomende maan, een
trage inzoom en een lichtwaas. Het aangeleverde beeld vervangt de videoloop
uit het oorspronkelijke idee: dezelfde scene, een twintigste van het gewicht.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 5: Variant 5, Aurora

**Files:**
- Create: `src/components/kickass/layers/Aurora.astro`
- Create: `src/pages/kickass/aurora.astro`

**Interfaces:**
- Consumes: het laagpatroon uit taak 3.

- [ ] **Step 1: Schrijf de laag**

Maak `src/components/kickass/layers/Aurora.astro`:

```astro
---
// Variant 5: een traag bewegend kleurverloop achter matglazen kaarten. Geen
// canvas en geen script: vier zwaar geblurde vlakken die langs elkaar schuiven
// doen het werk.
---

<div class="aurora" aria-hidden="true">
  <span class="vlek vlek-1"></span>
  <span class="vlek vlek-2"></span>
  <span class="vlek vlek-3"></span>
  <span class="vlek vlek-4"></span>
</div>

<slot name="hero" />
<slot name="rest" />

<style is:global>
  :root[data-kickass='aurora'] {
    --kickass-laag: 'aurora';

    --bg-page: #07060E;
    --bg-canvas: #0A0913;
    --section-alt: #09080F;
    --card: rgba(255, 255, 255, 0.05);
    --card-alt: rgba(255, 255, 255, 0.08);
    --border: rgba(255, 255, 255, 0.12);

    --ink: #F4F1FF;
    --ink-soft: #D5CFF0;
    --muted: #9C94C0;

    --green: #6BF2C4;
    --green-hover: #9BFFDC;
    --green-light: #6BF2C4;
    --on-green: #04120D;

    --dark: rgba(255, 255, 255, 0.09);
    --dark-text: #F4F1FF;
    --dark-dim: #B4ADD6;
    --dark-border: rgba(255, 255, 255, 0.16);
    --dark-bright: #FFFFFF;

    --radius: 18px;
    --radius-sm: 12px;
    --shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
  }

  :root[data-kickass='aurora'] .aurora {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    filter: blur(90px);
  }

  :root[data-kickass='aurora'] .vlek {
    position: absolute;
    width: 46vw;
    height: 46vw;
    border-radius: 50%;
    opacity: 0.55;
  }

  :root[data-kickass='aurora'] .vlek-1 {
    background: #4C5F3B;
    top: -10%;
    left: -6%;
    animation: aurora-drijf-a 26s ease-in-out infinite alternate;
  }

  :root[data-kickass='aurora'] .vlek-2 {
    background: #1F8A7A;
    top: 20%;
    right: -12%;
    animation: aurora-drijf-b 32s ease-in-out infinite alternate;
  }

  :root[data-kickass='aurora'] .vlek-3 {
    background: #5B3FA8;
    bottom: -14%;
    left: 18%;
    animation: aurora-drijf-c 38s ease-in-out infinite alternate;
  }

  :root[data-kickass='aurora'] .vlek-4 {
    background: #6BF2C4;
    top: 44%;
    left: 40%;
    width: 26vw;
    height: 26vw;
    opacity: 0.3;
    animation: aurora-drijf-b 22s ease-in-out infinite alternate-reverse;
  }

  @keyframes aurora-drijf-a {
    to { transform: translate3d(14vw, 10vh, 0) scale(1.25); }
  }
  @keyframes aurora-drijf-b {
    to { transform: translate3d(-16vw, 14vh, 0) scale(0.85); }
  }
  @keyframes aurora-drijf-c {
    to { transform: translate3d(10vw, -12vh, 0) scale(1.15); }
  }

  /* De secties moeten doorschijnend zijn, anders zie je het verloop niet meer. */
  :root[data-kickass='aurora'] .section { border-top-color: rgba(255, 255, 255, 0.08); }
  :root[data-kickass='aurora'] .services { background: transparent; }

  :root[data-kickass='aurora'] .service-card,
  :root[data-kickass='aurora'] .ladder-row {
    backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }

  :root[data-kickass='aurora'] h1 {
    font-size: 84px;
    letter-spacing: -0.03em;
    background: linear-gradient(120deg, #FFFFFF 20%, #6BF2C4 60%, #B79BFF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  :root[data-kickass='aurora'] h2 { font-size: 48px; letter-spacing: -0.02em; }

  @media (max-width: 768px) {
    :root[data-kickass='aurora'] h1 { font-size: 44px; }
    :root[data-kickass='aurora'] h2 { font-size: 32px; }
    :root[data-kickass='aurora'] .vlek { width: 80vw; height: 80vw; }
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='aurora'] .vlek { animation: none; }
  }
</style>
```

- [ ] **Step 2: Schrijf het paginabestand**

Maak `src/pages/kickass/aurora.astro`, hetzelfde patroon als bij Terminal, met `import Laag from '../../components/kickass/layers/Aurora.astro';` en `variantBySlug('aurora')`.

- [ ] **Step 3: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

Verwacht: `ok    aurora: pagina in orde en geïsoleerd`.

- [ ] **Step 4: Bekijk hem**

Open `/kickass/aurora/`. Let op één ding in het bijzonder: de titel is een kleurverloop in de tekst, en dat mag niet onleesbaar worden op het lichtste punt van de achtergrond. Controleer ook dat de matglazen kaarten niet troebel worden waar twee vlekken elkaar overlappen.

- [ ] **Step 5: Commit**

```bash
git add src/components/kickass/layers/Aurora.astro src/pages/kickass/aurora.astro
git commit -F - <<'EOF'
feat: variant Aurora

Vier zwaar geblurde vlakken die traag langs elkaar schuiven, met matglazen
kaarten erboven en een titel in kleurverloop. Geen canvas, geen script.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 6: Variant 6, Spotlight

**Files:**
- Create: `src/components/kickass/layers/Spotlight.astro`
- Create: `src/pages/kickass/spotlight.astro`

**Interfaces:**
- Consumes: het laagpatroon uit taak 3.
- Produces: het patroon voor een muisvolgende CSS-variabele, dat variant 10 hergebruikt.

- [ ] **Step 1: Schrijf de laag**

Maak `src/components/kickass/layers/Spotlight.astro`:

```astro
---
// Variant 6: een lichtbundel rond de cursor onthult de pagina. De positie loopt
// via twee CSS-variabelen op <html>, bijgewerkt met requestAnimationFrame zodat
// er hooguit één update per frame is - hetzelfde patroon als BackToTop.astro.
---

<div class="bundel" aria-hidden="true"></div>

<slot name="hero" />
<slot name="rest" />

<script>
  const root = document.documentElement;
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fijneAanwijzer = window.matchMedia('(pointer: fine)').matches;

  if (!rustig && fijneAanwijzer) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let gepland = false;

    const schrijf = () => {
      gepland = false;
      root.style.setProperty('--sx', `${x}px`);
      root.style.setProperty('--sy', `${y}px`);
    };

    window.addEventListener('pointermove', (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!gepland) {
        gepland = true;
        window.requestAnimationFrame(schrijf);
      }
    });

    schrijf();
    root.setAttribute('data-spotlight', 'aan');
  }
</script>

<style is:global>
  :root[data-kickass='spotlight'] {
    --kickass-laag: 'spotlight';

    /* Middelpunt tot het script iets anders zegt. Zonder deze twee valt de
       bundel terug op het midden van het scherm, wat precies is wat we willen
       op een aanraakscherm. */
    --sx: 50vw;
    --sy: 45vh;

    --bg-page: #060607;
    --bg-canvas: #0A0A0B;
    --section-alt: #08080A;
    --card: #101012;
    --card-alt: #16161A;
    --border: #26262B;

    --ink: #F3F2EE;
    --ink-soft: #B9B8B2;
    --muted: #7C7B76;

    --green: #9CB382;
    --green-hover: #C0D3A8;
    --green-light: #9CB382;
    --on-green: #10130B;

    --dark: #16161A;
    --dark-text: #F3F2EE;
    --dark-dim: #96958F;
    --dark-border: #2E2E34;
    --dark-bright: #FFFFFF;

    --radius: 10px;
    --radius-sm: 6px;
  }

  /* De bundel ligt bovenop en dempt alles buiten de cirkel. Klikken gaat er
     gewoon doorheen. */
  :root[data-kickass='spotlight'] .bundel {
    position: fixed;
    inset: 0;
    z-index: 400;
    pointer-events: none;
    background: radial-gradient(
      circle 320px at var(--sx) var(--sy),
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.22) 55%,
      rgba(0, 0, 0, 0.62) 100%
    );
  }

  /* Een tweede, warmere gloed onder de inhoud, zodat het licht op de pagina
     valt in plaats van er alleen overheen te liggen. */
  :root[data-kickass='spotlight'] body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: radial-gradient(
      circle 420px at var(--sx) var(--sy),
      rgba(156, 179, 130, 0.14) 0%,
      rgba(156, 179, 130, 0) 70%
    );
  }

  :root[data-kickass='spotlight'] .section { position: relative; z-index: 1; }

  /* Kaarten krijgen een rand die naar het licht wijst. */
  :root[data-kickass='spotlight'] .service-card,
  :root[data-kickass='spotlight'] .ladder-row {
    position: relative;
  }

  :root[data-kickass='spotlight'] .service-card::after,
  :root[data-kickass='spotlight'] .ladder-row::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: radial-gradient(
      circle 380px at var(--sx) var(--sy),
      rgba(156, 179, 130, 0.9),
      rgba(156, 179, 130, 0) 100%
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  :root[data-kickass='spotlight'] h1 { font-size: 76px; letter-spacing: -0.03em; }

  @media (max-width: 768px) {
    :root[data-kickass='spotlight'] h1 { font-size: 40px; }
    :root[data-kickass='spotlight'] .bundel {
      background: radial-gradient(circle 220px at 50vw 40vh, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='spotlight'] .bundel { display: none; }
  }
</style>
```

- [ ] **Step 2: Schrijf het paginabestand**

Maak `src/pages/kickass/spotlight.astro`, patroon van Terminal, met `layers/Spotlight.astro` en `variantBySlug('spotlight')`.

- [ ] **Step 3: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

- [ ] **Step 4: Bekijk hem**

Open `/kickass/spotlight/` en beweeg de muis. Controleer: de bundel volgt vloeiend, de tekst buiten de bundel blijft nog leesbaar (niet volledig zwart), en de kaartranden lichten op aan de kant van de cursor. Controleer met de devtools-emulatie voor aanraakschermen dat de bundel dan in het midden blijft staan.

- [ ] **Step 5: Commit**

```bash
git add src/components/kickass/layers/Spotlight.astro src/pages/kickass/spotlight.astro
git commit -F - <<'EOF'
feat: variant Spotlight

Een lichtbundel rond de cursor onthult de pagina, met kaartranden die naar het
licht wijzen. De positie loopt via twee CSS-variabelen, afgeknepen tot een
update per frame. Op een aanraakscherm staat de bundel vast in het midden.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 7: Variant 8, Brutalist

**Files:**
- Create: `src/components/kickass/layers/Brutalist.astro`
- Create: `src/pages/kickass/brutalist.astro`

**Interfaces:**
- Consumes: `/media/superpowers/monkai-640.webp` uit taak 1, plus het laagpatroon uit taak 3.

- [ ] **Step 1: Schrijf de laag**

Maak `src/components/kickass/layers/Brutalist.astro`:

```astro
---
// Variant 8: harde vlakken, geen afronding, harde verschoven schaduwen, letters
// tot tegen de rand. Een schuivende tekstband tussen de hero en de rest.
---

<slot name="hero" />

<div class="band" aria-hidden="true">
  <div class="band-spoor">
    <span>AI ZONDER APENSTREKEN</span><span>*</span><span>KLEIN BEGINNEN</span><span>*</span><span>HERHALEN</span><span>*</span><span>BEHEERSEN</span><span>*</span>
    <span>AI ZONDER APENSTREKEN</span><span>*</span><span>KLEIN BEGINNEN</span><span>*</span><span>HERHALEN</span><span>*</span><span>BEHEERSEN</span><span>*</span>
  </div>
</div>

<slot name="rest" />

<style is:global>
  :root[data-kickass='brutalist'] {
    --kickass-laag: 'brutalist';

    --bg-page: #F2EFE2;
    --bg-canvas: #F2EFE2;
    --section-alt: #E4DFCB;
    --card: #FFFFFF;
    --card-alt: #E4DFCB;
    --border: #0B0B0B;

    --ink: #0B0B0B;
    --ink-soft: #0B0B0B;
    --muted: #3A3A38;

    --green: #2F5E1E;
    --green-hover: #1C3E10;
    --green-light: #2F5E1E;
    --on-green: #F2EFE2;

    --dark: #0B0B0B;
    --dark-text: #F2EFE2;
    --dark-dim: #B9B7AE;
    --dark-border: #F2EFE2;
    --dark-bright: #FFFFFF;

    --radius: 0;
    --radius-sm: 0;
    --shadow: 8px 8px 0 #0B0B0B;
  }

  :root[data-kickass='brutalist'] .section {
    border-top: 4px solid #0B0B0B;
  }

  :root[data-kickass='brutalist'] h1 {
    font-size: clamp(56px, 13vw, 172px);
    font-weight: 600;
    line-height: 0.88;
    letter-spacing: -0.045em;
    text-transform: uppercase;
  }

  :root[data-kickass='brutalist'] .hero {
    padding-left: 24px;
    padding-right: 24px;
    align-items: flex-start;
    text-align: left;
  }

  :root[data-kickass='brutalist'] .hero-inner {
    max-width: none;
    width: 100%;
    align-items: flex-start;
  }

  /* Het aapje staat groot en hard uitgesneden naast de titel. */
  :root[data-kickass='brutalist'] .hero::after {
    content: '';
    position: absolute;
    right: 24px;
    bottom: 0;
    width: 260px;
    height: 260px;
    background: url('/media/superpowers/monkai-640.webp') center/cover;
    border: 4px solid #0B0B0B;
    box-shadow: var(--shadow);
    filter: grayscale(1) contrast(1.35);
  }

  :root[data-kickass='brutalist'] h2 {
    font-size: 60px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: -0.03em;
  }

  :root[data-kickass='brutalist'] .service-card {
    border: 4px solid #0B0B0B;
    box-shadow: var(--shadow);
  }

  :root[data-kickass='brutalist'] .service-card h3 {
    text-transform: uppercase;
    font-size: 19px;
    letter-spacing: -0.01em;
  }

  :root[data-kickass='brutalist'] .ladder-row {
    border: 4px solid #0B0B0B;
    box-shadow: var(--shadow);
  }

  :root[data-kickass='brutalist'] .btn {
    border: 4px solid #0B0B0B;
    box-shadow: var(--shadow);
    text-transform: uppercase;
  }

  :root[data-kickass='brutalist'] .link-underline {
    border-bottom-width: 4px;
    text-transform: uppercase;
  }

  /* De schuivende band. Het spoor staat er twee keer in, dus een verschuiving
     van precies de helft loopt naadloos rond. */
  :root[data-kickass='brutalist'] .band {
    background: #0B0B0B;
    color: #F2EFE2;
    overflow: hidden;
    padding: 14px 0;
    border-top: 4px solid #0B0B0B;
  }

  :root[data-kickass='brutalist'] .band-spoor {
    display: flex;
    gap: 24px;
    width: max-content;
    font-family: var(--font-mono);
    font-size: 22px;
    letter-spacing: 0.08em;
    animation: brutalist-schuif 26s linear infinite;
  }

  @keyframes brutalist-schuif {
    to { transform: translateX(-50%); }
  }

  @media (max-width: 768px) {
    :root[data-kickass='brutalist'] .hero::after { width: 120px; height: 120px; right: 12px; }
    :root[data-kickass='brutalist'] h2 { font-size: 34px; }
    :root[data-kickass='brutalist'] .band-spoor { font-size: 16px; }
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='brutalist'] .band-spoor { animation: none; }
  }
</style>
```

- [ ] **Step 2: Schrijf het paginabestand**

Maak `src/pages/kickass/brutalist.astro`, patroon van Terminal, met `layers/Brutalist.astro` en `variantBySlug('brutalist')`.

- [ ] **Step 3: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

- [ ] **Step 4: Bekijk hem**

Open `/kickass/brutalist/`. Dit is de enige lichte variant, dus controleer of de demobalk bovenaan er niet raar bij staat. Controleer ook dat de titel op 1440 px niet over het aapje heen loopt; loopt hij eroverheen, geef `.hero-inner` dan `max-width: calc(100% - 320px)`.

- [ ] **Step 5: Commit**

```bash
git add src/components/kickass/layers/Brutalist.astro src/pages/kickass/brutalist.astro
git commit -F - <<'EOF'
feat: variant Brutalist

Harde vlakken, geen afronding, verschoven zwarte schaduwen, een titel die tot
tegen de rand loopt en een schuivende tekstband. De enige lichte variant.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 8: Variant 9, Neuraal netwerk

**Files:**
- Create: `src/components/kickass/layers/Netwerk.astro`
- Create: `src/pages/kickass/netwerk.astro`

**Interfaces:**
- Consumes: het laagpatroon uit taak 3.

- [ ] **Step 1: Schrijf de laag**

Maak `src/components/kickass/layers/Netwerk.astro`:

```astro
---
// Variant 9: een puntennetwerk achter de hero dat op de muis reageert. In het
// begin trekken de punten samen tot de omtrek van een apenkop en vallen daarna
// uiteen naar hun vrije baan.
//
// Canvas 2D, eigen code, geen library. Staat uit onder 768 px en bij reduced
// motion, en de lus stopt zodra het canvas uit beeld is.
---

<canvas class="netwerk" aria-hidden="true"></canvas>

<slot name="hero" />
<slot name="rest" />

<script>
  const canvas = document.querySelector<HTMLCanvasElement>('.netwerk');
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const klein = window.matchMedia('(max-width: 768px)').matches;

  if (canvas && !rustig && !klein) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      type Punt = { x: number; y: number; vx: number; vy: number; dx: number; dy: number };

      const AANTAL = 90;
      const punten: Punt[] = [];
      let b = 0;
      let h = 0;
      let muisX = -9999;
      let muisY = -9999;
      let draait = false;
      let start = 0;

      // De doelvorm: de omtrek van een apenkop, als hoeken op twee cirkels plus
      // twee oren. Genormaliseerd naar een vierkant van -1 tot 1.
      function doelVoor(i: number): { x: number; y: number } {
        const n = AANTAL;
        if (i < n * 0.62) {
          // De kop zelf.
          const t = (i / (n * 0.62)) * Math.PI * 2;
          return { x: Math.cos(t) * 0.42, y: Math.sin(t) * 0.46 };
        }
        if (i < n * 0.81) {
          // Linkeroor.
          const t = ((i - n * 0.62) / (n * 0.19)) * Math.PI * 2;
          return { x: -0.5 + Math.cos(t) * 0.16, y: -0.16 + Math.sin(t) * 0.18 };
        }
        // Rechteroor.
        const t = ((i - n * 0.81) / (n * 0.19)) * Math.PI * 2;
        return { x: 0.5 + Math.cos(t) * 0.16, y: -0.16 + Math.sin(t) * 0.18 };
      }

      function meten() {
        const r = canvas.getBoundingClientRect();
        b = r.width;
        h = r.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(b * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function vullen() {
        punten.length = 0;
        for (let i = 0; i < AANTAL; i++) {
          const d = doelVoor(i);
          const schaal = Math.min(b, h) * 0.62;
          punten.push({
            x: b / 2 + d.x * schaal,
            y: h / 2 + d.y * schaal,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            dx: b / 2 + d.x * schaal,
            dy: h / 2 + d.y * schaal,
          });
        }
      }

      function teken(nu: number) {
        if (!draait) return;
        if (!start) start = nu;
        const verlopen = (nu - start) / 1000;
        // De eerste drie seconden houdt de vorm, daarna laat ze los.
        const vast = Math.max(0, Math.min(1, (3.2 - verlopen) / 1.2));

        ctx.clearRect(0, 0, b, h);

        for (const p of punten) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > b) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          // Terugtrekken naar de doelvorm zolang die nog geldt.
          if (vast > 0) {
            p.x += (p.dx - p.x) * 0.05 * vast;
            p.y += (p.dy - p.y) * 0.05 * vast;
          }

          // Wegduwen van de muis.
          const mx = p.x - muisX;
          const my = p.y - muisY;
          const afstand = Math.hypot(mx, my);
          if (afstand < 140 && afstand > 0.001) {
            const kracht = (140 - afstand) / 140;
            p.x += (mx / afstand) * kracht * 3;
            p.y += (my / afstand) * kracht * 3;
          }
        }

        // Lijnen tussen punten die dicht genoeg bij elkaar liggen.
        for (let i = 0; i < punten.length; i++) {
          for (let j = i + 1; j < punten.length; j++) {
            const dx = punten[i].x - punten[j].x;
            const dy = punten[i].y - punten[j].y;
            const d = Math.hypot(dx, dy);
            if (d < 130) {
              ctx.strokeStyle = `rgba(156, 179, 130, ${(1 - d / 130) * 0.45})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(punten[i].x, punten[i].y);
              ctx.lineTo(punten[j].x, punten[j].y);
              ctx.stroke();
            }
          }
        }

        ctx.fillStyle = 'rgba(196, 214, 174, 0.9)';
        for (const p of punten) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.9, 0, Math.PI * 2);
          ctx.fill();
        }

        window.requestAnimationFrame(teken);
      }

      window.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        muisX = e.clientX - r.left;
        muisY = e.clientY - r.top;
      });

      window.addEventListener('resize', () => {
        meten();
        vullen();
      });

      // Alleen tekenen zolang het canvas in beeld is.
      const kijker = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !draait) {
            draait = true;
            window.requestAnimationFrame(teken);
          } else if (!entry.isIntersecting) {
            draait = false;
          }
        }
      });

      meten();
      vullen();
      kijker.observe(canvas);
    }
  }
</script>

<style is:global>
  :root[data-kickass='netwerk'] {
    --kickass-laag: 'netwerk';

    --bg-page: #0C0F0B;
    --bg-canvas: #101410;
    --section-alt: #0E120D;
    --card: #151A13;
    --card-alt: #1B2118;
    --border: #2A3226;

    --ink: #E9EFE2;
    --ink-soft: #C3CDB9;
    --muted: #8B9682;

    --green: #9CB382;
    --green-hover: #C4D6AE;
    --green-light: #9CB382;
    --on-green: #0C0F0B;

    --dark: #1B2118;
    --dark-text: #E9EFE2;
    --dark-dim: #A0AB96;
    --dark-border: #333B2D;
    --dark-bright: #FFFFFF;

    --radius: 8px;
    --radius-sm: 5px;
  }

  /* Het canvas hangt achter de hero en beslaat precies die sectie. */
  :root[data-kickass='netwerk'] .netwerk {
    position: absolute;
    inset: 0 0 auto 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
    display: block;
  }

  :root[data-kickass='netwerk'] body { position: relative; }

  :root[data-kickass='netwerk'] .hero {
    min-height: 100vh;
    justify-content: center;
  }

  :root[data-kickass='netwerk'] h1 {
    font-size: 74px;
    letter-spacing: -0.03em;
  }

  :root[data-kickass='netwerk'] .service-card:hover {
    border-color: var(--green);
  }

  @media (max-width: 768px) {
    :root[data-kickass='netwerk'] .netwerk { display: none; }
    :root[data-kickass='netwerk'] h1 { font-size: 40px; }
    :root[data-kickass='netwerk'] .hero { min-height: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='netwerk'] .netwerk { display: none; }
  }
</style>
```

- [ ] **Step 2: Schrijf het paginabestand**

Maak `src/pages/kickass/netwerk.astro`, patroon van Terminal, met `layers/Netwerk.astro` en `variantBySlug('netwerk')`.

- [ ] **Step 3: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

- [ ] **Step 4: Bekijk hem**

Open `/kickass/netwerk/`. Controleer in de eerste drie seconden of de apenkop herkenbaar is (twee oren, een ronde kop); is hij dat niet, verhoog `AANTAL` naar 120 en de terugtrekfactor van `0.05` naar `0.09`. Controleer daarna of de punten vrij bewegen en of ze wegduiken voor de muis. Kijk in de console: die moet leeg zijn. Scroll naar beneden en terug: de lus moet stoppen en weer starten.

- [ ] **Step 5: Commit**

```bash
git add src/components/kickass/layers/Netwerk.astro src/pages/kickass/netwerk.astro
git commit -F - <<'EOF'
feat: variant Neuraal netwerk

Een puntennetwerk achter de hero dat de eerste seconden de omtrek van een
apenkop vormt en daarna vrij beweegt, met punten die wegduiken voor de muis.
Canvas 2D zonder library, uit onder 768 px en bij reduced motion.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 9: Variant 7, De klimmende aap

**Files:**
- Create: `src/components/kickass/layers/Klimmen.astro`
- Create: `src/pages/kickass/klimmen.astro`

**Interfaces:**
- Consumes: het laagpatroon uit taak 3.

- [ ] **Step 1: Schrijf de laag**

Maak `src/components/kickass/layers/Klimmen.astro`:

```astro
---
// Variant 7: de ladder wordt het verhaal. De sectie wordt plakkerig en een
// aapje klimt van trede naar trede terwijl je scrolt.
//
// De klim loopt op scroll-gestuurde CSS (animation-timeline: view()). Waar dat
// niet werkt blijft de sectie gewoon plakkerig en staat het aapje stil: de
// inhoud is dan nog altijd volledig leesbaar.
---

<slot name="hero" />

<div class="klim-wrap">
  <div class="klim-baan" aria-hidden="true">
    <div class="klim-touw"></div>
    <svg class="klim-aap" viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
      <circle cx="24" cy="18" r="11" fill="currentColor" />
      <circle cx="11" cy="13" r="5.5" fill="currentColor" />
      <circle cx="37" cy="13" r="5.5" fill="currentColor" />
      <path d="M17 19c0-4 3.2-6.6 7-6.6S31 15 31 19s-3.2 7-7 7-7-3-7-7Z" fill="var(--bg-page)" />
      <circle cx="20.4" cy="17.4" r="1.5" fill="currentColor" />
      <circle cx="27.6" cy="17.4" r="1.5" fill="currentColor" />
      <path d="M18 30h12l-2 14H20Z" fill="currentColor" />
    </svg>
  </div>
  <slot name="rest" />
</div>

<style is:global>
  :root[data-kickass='klimmen'] {
    --kickass-laag: 'klimmen';

    --bg-page: #14170F;
    --bg-canvas: #1A1E14;
    --section-alt: #171B11;
    --card: #1E2318;
    --card-alt: #262C1E;
    --border: #333A28;

    --ink: #ECEFE2;
    --ink-soft: #C8CEB7;
    --muted: #929B80;

    --green: #A8C486;
    --green-hover: #C6DCA9;
    --green-light: #A8C486;
    --on-green: #141709;

    --dark: #262C1E;
    --dark-text: #ECEFE2;
    --dark-dim: #A6AF93;
    --dark-border: #3D4531;
    --dark-bright: #FFFFFF;

    --radius: 10px;
    --radius-sm: 6px;
  }

  :root[data-kickass='klimmen'] .klim-wrap { position: relative; }

  /* De baan loopt langs de linkerkant van de ladder en de diensten mee. */
  :root[data-kickass='klimmen'] .klim-baan {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 24px;
    width: 48px;
    color: var(--green);
    pointer-events: none;
  }

  :root[data-kickass='klimmen'] .klim-touw {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 23px;
    width: 2px;
    background: repeating-linear-gradient(
      to bottom,
      var(--border) 0 10px,
      transparent 10px 18px
    );
  }

  :root[data-kickass='klimmen'] .klim-aap {
    position: sticky;
    top: 46vh;
    display: block;
    animation: klim-op linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }

  /* Klimmen is heen en weer zwaaien terwijl de sectie langskomt. De verticale
     verplaatsing doet position:sticky al; dit is het zwaaien en draaien. */
  @keyframes klim-op {
    0% { transform: translateX(-6px) rotate(-8deg) scale(0.9); }
    25% { transform: translateX(8px) rotate(9deg) scale(1); }
    50% { transform: translateX(-8px) rotate(-9deg) scale(1); }
    75% { transform: translateX(8px) rotate(9deg) scale(1); }
    100% { transform: translateX(-4px) rotate(-4deg) scale(0.95); }
  }

  :root[data-kickass='klimmen'] .ladder,
  :root[data-kickass='klimmen'] .services {
    padding-left: 110px;
  }

  /* Elke trede komt binnen terwijl je hem nadert. */
  :root[data-kickass='klimmen'] .ladder-row {
    animation: klim-binnen linear both;
    animation-timeline: view();
    animation-range: entry 10% entry 70%;
  }

  @keyframes klim-binnen {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: none; }
  }

  /* Een merkteken per trede, op de baan. */
  :root[data-kickass='klimmen'] .ladder-row::before {
    content: '';
    position: absolute;
    left: -70px;
    top: 42px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 0 5px var(--bg-page);
  }

  :root[data-kickass='klimmen'] .ladder-row { position: relative; }

  :root[data-kickass='klimmen'] h1 { font-size: 72px; letter-spacing: -0.03em; }

  @media (max-width: 768px) {
    :root[data-kickass='klimmen'] .klim-baan { display: none; }
    :root[data-kickass='klimmen'] .ladder,
    :root[data-kickass='klimmen'] .services { padding-left: 22px; }
    :root[data-kickass='klimmen'] .ladder-row::before { display: none; }
    :root[data-kickass='klimmen'] h1 { font-size: 40px; }
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='klimmen'] .klim-aap,
    :root[data-kickass='klimmen'] .ladder-row {
      animation: none;
    }
    :root[data-kickass='klimmen'] .ladder-row { opacity: 1; transform: none; }
  }
</style>
```

- [ ] **Step 2: Schrijf het paginabestand**

Maak `src/pages/kickass/klimmen.astro`, patroon van Terminal, met `layers/Klimmen.astro` en `variantBySlug('klimmen')`.

- [ ] **Step 3: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

- [ ] **Step 4: Bekijk hem**

Open `/kickass/klimmen/` en scroll traag. Controleer: het aapje blijft op ongeveer de helft van het scherm staan en zwaait heen en weer terwijl de secties langskomen, de treden komen één voor één binnen, en de merktekens staan op de stippellijn. Controleer met de devtools of `animation-timeline: view()` ondersteund wordt; is dat niet zo, dan staat het aapje stil maar blijft de pagina bruikbaar - dat is de bedoelde terugval en geen fout.

- [ ] **Step 5: Commit**

```bash
git add src/components/kickass/layers/Klimmen.astro src/pages/kickass/klimmen.astro
git commit -F - <<'EOF'
feat: variant De klimmende aap

De ladder wordt het verhaal: een plakkerig aapje klimt langs een stippellijn
terwijl de treden een voor een binnenkomen. Scroll-gestuurde CSS, met stilstand
als terugval waar de browser die tijdlijn niet kent.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 10: Variant 10, Vloeibaar

**Files:**
- Create: `src/components/kickass/layers/Vloeibaar.astro`
- Create: `src/pages/kickass/vloeibaar.astro`

**Interfaces:**
- Consumes: het muisvolgende variabelenpatroon uit taak 6 en het laagpatroon uit taak 3.

- [ ] **Step 1: Schrijf de laag**

Maak `src/components/kickass/layers/Vloeibaar.astro`:

```astro
---
// Variant 10: de titel golft als water. Gedaan met SVG-filters (feTurbulence
// plus feDisplacementMap) en niet met WebGL: hetzelfde effect, geen GPU-context
// nodig, en een browser die het filter niet kent toont gewoon de gewone titel.
//
// De sterkte van de vervorming volgt de muis, zodat het voelt alsof je met je
// hand door het water gaat.
---

<svg class="vloeibaar-filters" aria-hidden="true" focusable="false">
  <defs>
    <filter id="vloeibaar-golf">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.008 0.016"
        numOctaves="2"
        seed="7"
        result="ruis"
      >
        <animate
          attributeName="baseFrequency"
          dur="14s"
          values="0.008 0.016; 0.014 0.008; 0.008 0.016"
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feDisplacementMap
        in="SourceGraphic"
        in2="ruis"
        scale="18"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>

    <filter id="vloeibaar-korrel">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
  </defs>
</svg>

<div class="korrel" aria-hidden="true"></div>

<slot name="hero" />
<slot name="rest" />

<script>
  // De vervorming wordt sterker naarmate de muis dichter bij de titel komt.
  const titel = document.querySelector<HTMLElement>('.hero-titel');
  const verplaatsing = document.querySelector<SVGFEDisplacementMapElement>('#vloeibaar-golf feDisplacementMap');
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fijneAanwijzer = window.matchMedia('(pointer: fine)').matches;

  if (titel && verplaatsing && !rustig && fijneAanwijzer) {
    let doel = 8;
    let huidig = 8;
    let gepland = false;

    const teken = () => {
      gepland = false;
      huidig += (doel - huidig) * 0.12;
      verplaatsing.setAttribute('scale', huidig.toFixed(2));
      if (Math.abs(doel - huidig) > 0.1) plan();
    };

    const plan = () => {
      if (gepland) return;
      gepland = true;
      window.requestAnimationFrame(teken);
    };

    window.addEventListener('pointermove', (e) => {
      const r = titel.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      const afstand = Math.hypot(dx, dy);
      // Vlakbij fors vervormen, ver weg bijna stil.
      doel = 8 + Math.max(0, 1 - afstand / 320) * 26;
      plan();
    });
  }
</script>

<style is:global>
  :root[data-kickass='vloeibaar'] {
    --kickass-laag: 'vloeibaar';

    --bg-page: #070A12;
    --bg-canvas: #0B0F1A;
    --section-alt: #090D16;
    --card: #101625;
    --card-alt: #161D30;
    --border: #232C42;

    --ink: #E8EEFB;
    --ink-soft: #C0CBE2;
    --muted: #8794AE;

    --green: #63E0D0;
    --green-hover: #92F1E4;
    --green-light: #63E0D0;
    --on-green: #04140F;

    --dark: #161D30;
    --dark-text: #E8EEFB;
    --dark-dim: #97A3BC;
    --dark-border: #2C3550;
    --dark-bright: #FFFFFF;

    --radius: 16px;
    --radius-sm: 10px;
  }

  /* De filterdefinities mogen niets innemen. */
  :root[data-kickass='vloeibaar'] .vloeibaar-filters {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  :root[data-kickass='vloeibaar'] .hero-titel {
    filter: url('#vloeibaar-golf');
    will-change: filter;
  }

  :root[data-kickass='vloeibaar'] h1 {
    font-size: 82px;
    letter-spacing: -0.035em;
    color: var(--green);
  }

  /* Korrel over de hele pagina. */
  :root[data-kickass='vloeibaar'] .korrel {
    position: fixed;
    inset: 0;
    z-index: 300;
    pointer-events: none;
    opacity: 0.13;
    filter: url('#vloeibaar-korrel');
    background: #FFFFFF;
    mix-blend-mode: overlay;
  }

  :root[data-kickass='vloeibaar'] .service-card,
  :root[data-kickass='vloeibaar'] .ladder-row {
    background-image: linear-gradient(160deg, rgba(99, 224, 208, 0.07), transparent 60%);
  }

  @media (max-width: 768px) {
    :root[data-kickass='vloeibaar'] h1 { font-size: 40px; }
    /* Op een klein scherm is de vervorming vooral hinderlijk bij het lezen. */
    :root[data-kickass='vloeibaar'] .hero-titel { filter: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='vloeibaar'] .hero-titel { filter: none; }
    :root[data-kickass='vloeibaar'] .korrel { display: none; }
  }
</style>
```

- [ ] **Step 2: Schrijf het paginabestand**

Maak `src/pages/kickass/vloeibaar.astro`, patroon van Terminal, met `layers/Vloeibaar.astro` en `variantBySlug('vloeibaar')`.

- [ ] **Step 3: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

- [ ] **Step 4: Bekijk hem**

Open `/kickass/vloeibaar/` en beweeg de muis naar de titel toe. Controleer: de titel golft continu een beetje en gaat fors bewegen als je er dichtbij komt. Belangrijk: de titel moet **leesbaar** blijven op zijn sterkst; is dat niet zo, verlaag de bovengrens van `8 + ... * 26` naar `8 + ... * 16`. Controleer of de korrel niet zo sterk staat dat de tekst eronder korrelig wordt.

- [ ] **Step 5: Commit**

```bash
git add src/components/kickass/layers/Vloeibaar.astro src/pages/kickass/vloeibaar.astro
git commit -F - <<'EOF'
feat: variant Vloeibaar

De titel golft als water, sterker naarmate de muis dichterbij komt, met korrel
over de pagina. Met SVG-filters in plaats van WebGL: hetzelfde effect, geen
GPU-context nodig, en gewone tekst als de browser het filter niet kent.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 11: Variant 1, Neon Jungle

De eerste variant met three.js. Deze taak voegt de afhankelijkheid toe.

**Files:**
- Create: `src/components/kickass/layers/NeonJungle.astro`
- Create: `src/pages/kickass/neon-jungle.astro`
- Create: `src/kickass/aapje3d.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `/media/superpowers/monkai-web.glb` uit taak 1, plus het laagpatroon uit taak 3.
- Produces: `startAapje(canvas: HTMLCanvasElement, opties: { modelPad: string; kleur: number }): () => void` uit `src/kickass/aapje3d.ts`. De teruggegeven functie ruimt de scene weer op. Variant 3 (taak 12) gebruikt exact deze functie.

- [ ] **Step 1: Installeer three.js**

```bash
npm i three
node -e "console.log(require('./package.json').dependencies)"
```

Verwacht: `three` staat in `dependencies`. Het pakket wordt door Astro gebundeld, dus het valt onder `script-src 'self'` in de CSP.

- [ ] **Step 2: Schrijf de 3D-module**

Maak `src/kickass/aapje3d.ts`:

```ts
// De 3D-scene met het aapje, gedeeld door variant 1 en variant 3.
//
// Bewust een aparte module en geen inline script: twee varianten gebruiken hem,
// en zo staat de three.js-code op één plek. Astro bundelt hem per pagina, dus
// een pagina die deze module niet importeert draagt three.js ook niet.

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export type AapjeOpties = {
  modelPad: string;
  /** Kleur van het randlicht, als 0xRRGGBB. */
  kleur: number;
};

/**
 * Zet een draaiend aapje in het canvas. Geeft een opruimfunctie terug.
 *
 * De renderlus draait alleen zolang het canvas in beeld is en het tabblad
 * zichtbaar. Het model laadt pas bij het eerste zichtbaar worden, zodat een
 * bezoeker die nooit scrollt de 3 MB nooit binnenhaalt.
 */
export function startAapje(canvas: HTMLCanvasElement, opties: AapjeOpties): () => void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 3.2);

  // Randlicht van achter, zodat de omtrek oplicht in de merkkleur.
  const rand = new THREE.DirectionalLight(opties.kleur, 6);
  rand.position.set(-2, 1.4, -2.6);
  scene.add(rand);

  const vul = new THREE.DirectionalLight(0xffffff, 1.1);
  vul.position.set(2, 1.5, 2.5);
  scene.add(vul);

  scene.add(new THREE.AmbientLight(0x223018, 1.4));

  const groep = new THREE.Group();
  scene.add(groep);

  // Terugval zolang het model niet geladen is (of als het laden mislukt): een
  // apenkop uit primitieven. Zo staat er nooit een leeg gat.
  const noodMateriaal = new THREE.MeshStandardMaterial({
    color: 0x6c7f58,
    roughness: 0.55,
    metalness: 0.1,
  });
  const nood = new THREE.Group();
  const kop = new THREE.Mesh(new THREE.SphereGeometry(0.62, 48, 48), noodMateriaal);
  nood.add(kop);
  for (const kant of [-1, 1]) {
    const oor = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 32), noodMateriaal);
    oor.position.set(kant * 0.62, 0.12, 0);
    nood.add(oor);
  }
  const snuit = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 32), noodMateriaal);
  snuit.position.set(0, -0.14, 0.42);
  snuit.scale.set(1, 0.72, 0.6);
  nood.add(snuit);
  groep.add(nood);

  let muisX = 0;
  let muisY = 0;
  let draait = false;
  let vernietigd = false;

  function meten() {
    const b = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(b, h, false);
    camera.aspect = b / h;
    camera.updateProjectionMatrix();
  }

  function lus() {
    if (!draait || vernietigd) return;
    groep.rotation.y += 0.0035;
    // Kantelen naar de muis, met een trage inhaalbeweging.
    groep.rotation.x += (muisY * 0.28 - groep.rotation.x) * 0.05;
    groep.position.x += (muisX * 0.18 - groep.position.x) * 0.05;
    renderer.render(scene, camera);
    window.requestAnimationFrame(lus);
  }

  function opMuis(e: PointerEvent) {
    muisX = (e.clientX / window.innerWidth) * 2 - 1;
    muisY = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function opMaat() {
    meten();
  }

  window.addEventListener('pointermove', opMuis);
  window.addEventListener('resize', opMaat);

  let geladen = false;
  function laadModel() {
    if (geladen) return;
    geladen = true;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      opties.modelPad,
      (gltf) => {
        if (vernietigd) return;
        const model = gltf.scene;
        // Het model op een voorspelbare maat en midden zetten, ongeacht hoe het
        // uit Blender kwam.
        const doos = new THREE.Box3().setFromObject(model);
        const maat = doos.getSize(new THREE.Vector3());
        const midden = doos.getCenter(new THREE.Vector3());
        const schaal = 1.7 / Math.max(maat.x, maat.y, maat.z);
        model.position.sub(midden);
        model.scale.setScalar(schaal);
        model.position.multiplyScalar(schaal);
        groep.remove(nood);
        groep.add(model);
      },
      undefined,
      (fout) => {
        // Laden mislukt: de noodkop blijft staan. Geen lege hero.
        console.warn('3D-model niet geladen, terugval op de eenvoudige kop', fout);
      },
    );
  }

  const kijker = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        laadModel();
        if (!draait) {
          draait = true;
          window.requestAnimationFrame(lus);
        }
      } else {
        draait = false;
      }
    }
  });
  kijker.observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      draait = false;
    } else if (!vernietigd) {
      draait = true;
      window.requestAnimationFrame(lus);
    }
  });

  meten();

  return () => {
    vernietigd = true;
    draait = false;
    kijker.disconnect();
    window.removeEventListener('pointermove', opMuis);
    window.removeEventListener('resize', opMaat);
    renderer.dispose();
  };
}
```

- [ ] **Step 3: Schrijf de laag**

Maak `src/components/kickass/layers/NeonJungle.astro`:

```astro
---
// Variant 1: het aapje draait in 3D achter de titel, met felgroen randlicht op
// bijna zwart. Het model laadt pas als het canvas in beeld komt.
---

<div class="jungle-canvas-wrap" aria-hidden="true">
  <canvas class="jungle-canvas"></canvas>
  <div class="jungle-gloed"></div>
</div>

<slot name="hero" />
<slot name="rest" />

<script>
  import { startAapje } from '../../../kickass/aapje3d';

  const canvas = document.querySelector<HTMLCanvasElement>('.jungle-canvas');
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const klein = window.matchMedia('(max-width: 768px)').matches;

  if (canvas && !rustig && !klein) {
    startAapje(canvas, { modelPad: '/media/superpowers/monkai-web.glb', kleur: 0x8dff6a });
  }
</script>

<style is:global>
  :root[data-kickass='neon-jungle'] {
    --kickass-laag: 'neon-jungle';

    --bg-page: #05070A;
    --bg-canvas: #080B10;
    --section-alt: #06090D;
    --card: #0C1116;
    --card-alt: #111820;
    --border: #1E2A22;

    --ink: #E6F5E4;
    --ink-soft: #B9D6B6;
    --muted: #7C9B7C;

    --green: #8DFF6A;
    --green-hover: #B8FF9C;
    --green-light: #8DFF6A;
    --on-green: #04140A;

    --dark: #111820;
    --dark-text: #E6F5E4;
    --dark-dim: #90AE90;
    --dark-border: #24332A;
    --dark-bright: #FFFFFF;

    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 0 60px rgba(141, 255, 106, 0.14);
  }

  :root[data-kickass='neon-jungle'] body { position: relative; }

  :root[data-kickass='neon-jungle'] .jungle-canvas-wrap {
    position: absolute;
    inset: 0 0 auto 0;
    height: 100vh;
    z-index: 0;
    overflow: hidden;
  }

  :root[data-kickass='neon-jungle'] .jungle-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Groene gloed achter het model, zodat het niet in het zwart zweeft. */
  :root[data-kickass='neon-jungle'] .jungle-gloed {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at 50% 46%, rgba(141, 255, 106, 0.16), transparent 58%);
  }

  :root[data-kickass='neon-jungle'] .hero {
    min-height: 100vh;
    justify-content: center;
  }

  /* De tekst staat vóór het model, met een lichte sluier zodat ze leesbaar
     blijft waar het model erachter langs draait. */
  :root[data-kickass='neon-jungle'] .hero-inner {
    text-shadow: 0 2px 22px rgba(5, 7, 10, 0.9);
  }

  :root[data-kickass='neon-jungle'] h1 {
    font-size: 78px;
    letter-spacing: -0.03em;
  }

  :root[data-kickass='neon-jungle'] .btn {
    box-shadow: 0 0 24px rgba(141, 255, 106, 0.35);
  }

  :root[data-kickass='neon-jungle'] .service-card:hover {
    border-color: var(--green);
    box-shadow: var(--shadow);
  }

  @media (max-width: 768px) {
    :root[data-kickass='neon-jungle'] .jungle-canvas-wrap { display: none; }
    :root[data-kickass='neon-jungle'] .hero { min-height: 0; }
    :root[data-kickass='neon-jungle'] h1 { font-size: 40px; }
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='neon-jungle'] .jungle-canvas { display: none; }
  }
</style>
```

- [ ] **Step 4: Schrijf het paginabestand**

Maak `src/pages/kickass/neon-jungle.astro`, patroon van Terminal, met `layers/NeonJungle.astro` en `variantBySlug('neon-jungle')`.

- [ ] **Step 5: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

Controleer daarnaast met de hand dat three.js niet op de andere variantpagina's terechtkwam:

```bash
node -e "
const fs=require('fs');
for (const slug of ['terminal','maanlicht','aurora','spotlight','brutalist','netwerk','klimmen','vloeibaar']) {
  const html = fs.readFileSync('dist/kickass/'+slug+'/index.html','utf8');
  const scripts = [...html.matchAll(/<script[^>]+src=\"([^\"]+)\"/g)].map(m=>m[1]);
  let bytes = 0;
  for (const s of scripts) { try { bytes += fs.statSync('dist'+s).size; } catch(e){} }
  console.log(slug, scripts.length + ' script(s)', (bytes/1024).toFixed(0)+' kB');
}
"
```

Verwacht: geen van die acht pagina's boven 30 kB aan scripts. Zit er één op honderden kB, dan lekt three.js en moet je uitzoeken welke import dat veroorzaakt.

- [ ] **Step 6: Bekijk hem**

Open `/kickass/neon-jungle/`. Controleer: er staat eerst even de eenvoudige kop, dan verschijnt het model; het draait traag en kantelt naar de muis; de titel blijft leesbaar terwijl het model erachter langs komt. Kijk in het netwerkpaneel of `monkai-web.glb` pas geladen wordt en hoe groot hij is. Kijk in de console: leeg.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/kickass/aapje3d.ts src/components/kickass/layers/NeonJungle.astro src/pages/kickass/neon-jungle.astro
git commit -F - <<'EOF'
feat: variant Neon Jungle met het 3D-aapje

three.js als afhankelijkheid, gebundeld en dus binnen de CSP. De scene zit in
een eigen module zodat variant 3 hem hergebruikt. Het model laadt pas bij het
in beeld komen, en tot dan staat er een eenvoudige kop uit primitieven.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 12: Variant 3, Bento-cockpit

De enige variant die de hero vervangt.

**Files:**
- Create: `src/components/kickass/layers/Bento.astro`
- Create: `src/pages/kickass/bento.astro`

**Interfaces:**
- Consumes: `startAapje` uit `src/kickass/aapje3d.ts` (taak 11), `/media/superpowers/monkai.webp` (taak 1), het laagpatroon uit taak 3.
- Deze laag rendert `<slot name="hero" />` **niet**. De hero-inhoud die de pagina meegeeft wordt daardoor niet gerenderd, en de laag zet er zijn eigen raster voor in de plaats.

- [ ] **Step 1: Schrijf de laag**

Maak `src/components/kickass/layers/Bento.astro`:

```astro
---
// Variant 3: de hero wordt een raster van tegels die elk iets doen. Dit is de
// enige laag die <slot name="hero" /> niet rendert: het raster vervangt de hero.
---

<section class="bento">
  <div class="bento-grid">
    <div class="tegel tegel-titel">
      <h1 class="hero-titel">AI zonder apenstreken<span style="color:var(--green)">.</span></h1>
      <p>Ik help Vlaamse KMO's rustig en veilig starten met AI. Klein beginnen, herhalen, beheersen.</p>
      <a class="btn" href="#aanpak">Laten we praten</a>
    </div>

    <div class="tegel tegel-3d">
      <canvas class="bento-canvas" aria-hidden="true"></canvas>
      <span class="tegel-label">het aapje</span>
    </div>

    <div class="tegel tegel-prompt">
      <span class="tegel-label">een prompt</span>
      <code class="bento-typer" aria-live="off"></code>
    </div>

    <div class="tegel tegel-beeld">
      <img src="/media/superpowers/monkai.webp" alt="" width="1254" height="1254" loading="lazy" />
    </div>

    <div class="tegel tegel-cijfer">
      <span class="tegel-label">deelnemers per sessie</span>
      <strong class="bento-teller" data-tot="10">0</strong>
    </div>

    <div class="tegel tegel-treden">
      <span class="tegel-label">drie niveaus</span>
      <ol>
        <li>Automatiseren</li>
        <li>Onthouden</li>
        <li>Versnellen</li>
      </ol>
    </div>
  </div>
</section>

<slot name="rest" />

<script>
  import { startAapje } from '../../../kickass/aapje3d';

  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const klein = window.matchMedia('(max-width: 768px)').matches;

  // Het 3D-aapje in zijn tegel.
  const canvas = document.querySelector<HTMLCanvasElement>('.bento-canvas');
  if (canvas && !rustig && !klein) {
    startAapje(canvas, { modelPad: '/media/superpowers/monkai-web.glb', kleur: 0x9cff7a });
  }

  // De tegel die een prompt uittypt, en daarna opnieuw begint.
  const typer = document.querySelector<HTMLElement>('.bento-typer');
  const regels = [
    'Vat dit verslag samen in vijf punten.',
    'Hernoem deze facturen en zet ze in de juiste map.',
    'Wat weten we al over deze klant?',
  ];
  if (typer) {
    if (rustig) {
      typer.textContent = regels[0];
    } else {
      let r = 0;
      let i = 0;
      let terug = false;
      const stap = () => {
        const tekst = regels[r];
        typer.textContent = tekst.slice(0, i);
        if (!terug) {
          i++;
          if (i > tekst.length) {
            terug = true;
            window.setTimeout(stap, 1600);
            return;
          }
        } else {
          i--;
          if (i === 0) {
            terug = false;
            r = (r + 1) % regels.length;
          }
        }
        window.setTimeout(stap, terug ? 18 : 42);
      };
      stap();
    }
  }

  // De tegel die naar tien telt, pas wanneer ze in beeld komt.
  const teller = document.querySelector<HTMLElement>('.bento-teller');
  if (teller) {
    const tot = Number(teller.dataset.tot ?? '10');
    if (rustig) {
      teller.textContent = String(tot);
    } else {
      const kijker = new IntersectionObserver((entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          obs.disconnect();
          let n = 0;
          const stap = () => {
            n++;
            teller.textContent = String(n);
            if (n < tot) window.setTimeout(stap, 90);
          };
          stap();
        }
      });
      kijker.observe(teller);
    }
  }
</script>

<style is:global>
  :root[data-kickass='bento'] {
    --kickass-laag: 'bento';

    --bg-page: #0A0C0F;
    --bg-canvas: #0E1114;
    --section-alt: #0C0F12;
    --card: #14181D;
    --card-alt: #1A1F26;
    --border: #262D36;

    --ink: #EDF1F5;
    --ink-soft: #C3CBD5;
    --muted: #8B95A2;

    --green: #9CFF7A;
    --green-hover: #C3FFAB;
    --green-light: #9CFF7A;
    --on-green: #06140A;

    --dark: #1A1F26;
    --dark-text: #EDF1F5;
    --dark-dim: #98A2AF;
    --dark-border: #313945;
    --dark-bright: #FFFFFF;

    --radius: 18px;
    --radius-sm: 12px;
  }

  :root[data-kickass='bento'] .bento {
    padding: 56px 64px 90px;
  }

  :root[data-kickass='bento'] .bento-grid {
    max-width: var(--maxw);
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 150px;
    gap: 16px;
  }

  :root[data-kickass='bento'] .tegel {
    position: relative;
    overflow: hidden;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    opacity: 0;
    animation: bento-in 0.5s ease-out forwards;
  }

  /* De tegels komen na elkaar in beeld. */
  :root[data-kickass='bento'] .tegel:nth-child(1) { animation-delay: 0.05s; }
  :root[data-kickass='bento'] .tegel:nth-child(2) { animation-delay: 0.12s; }
  :root[data-kickass='bento'] .tegel:nth-child(3) { animation-delay: 0.19s; }
  :root[data-kickass='bento'] .tegel:nth-child(4) { animation-delay: 0.26s; }
  :root[data-kickass='bento'] .tegel:nth-child(5) { animation-delay: 0.33s; }
  :root[data-kickass='bento'] .tegel:nth-child(6) { animation-delay: 0.40s; }

  @keyframes bento-in {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: none; }
  }

  :root[data-kickass='bento'] .tegel-titel { grid-column: span 2; grid-row: span 2; justify-content: center; }
  :root[data-kickass='bento'] .tegel-3d { grid-column: span 2; grid-row: span 2; padding: 0; }
  :root[data-kickass='bento'] .tegel-prompt { grid-column: span 2; }
  :root[data-kickass='bento'] .tegel-beeld { grid-column: span 1; padding: 0; }
  :root[data-kickass='bento'] .tegel-cijfer { grid-column: span 1; justify-content: center; }
  :root[data-kickass='bento'] .tegel-treden { grid-column: span 4; }

  :root[data-kickass='bento'] .tegel-titel h1 {
    font-size: 52px;
    line-height: 1.05;
    letter-spacing: -0.03em;
  }

  :root[data-kickass='bento'] .tegel-titel p {
    margin: 0;
    color: var(--muted);
    font-size: 17px;
    line-height: 1.6;
  }

  :root[data-kickass='bento'] .tegel-titel .btn { align-self: flex-start; }

  :root[data-kickass='bento'] .bento-canvas { width: 100%; height: 100%; display: block; }

  :root[data-kickass='bento'] .tegel-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }

  :root[data-kickass='bento'] .tegel-3d .tegel-label {
    position: absolute;
    left: 20px;
    bottom: 16px;
  }

  :root[data-kickass='bento'] .bento-typer {
    font-family: var(--font-mono);
    font-size: 18px;
    color: var(--green);
    line-height: 1.5;
  }

  :root[data-kickass='bento'] .bento-typer::after {
    content: '|';
    animation: bento-knipper 1s steps(1) infinite;
  }

  @keyframes bento-knipper { 50% { opacity: 0; } }

  :root[data-kickass='bento'] .tegel-beeld img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :root[data-kickass='bento'] .bento-teller {
    font-family: var(--font-serif);
    font-size: 64px;
    font-weight: 600;
    line-height: 1;
    color: var(--green);
  }

  :root[data-kickass='bento'] .tegel-treden ol {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  :root[data-kickass='bento'] .tegel-treden li {
    padding: 8px 16px;
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 15px;
    color: var(--ink-soft);
  }

  @media (max-width: 768px) {
    :root[data-kickass='bento'] .bento { padding: 30px 22px 56px; }
    :root[data-kickass='bento'] .bento-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 130px; }
    :root[data-kickass='bento'] .tegel-titel { grid-column: span 2; }
    :root[data-kickass='bento'] .tegel-3d { display: none; }
    :root[data-kickass='bento'] .tegel-prompt { grid-column: span 2; }
    :root[data-kickass='bento'] .tegel-treden { grid-column: span 2; }
    :root[data-kickass='bento'] .tegel-titel h1 { font-size: 34px; }
  }

  @media (prefers-reduced-motion: reduce) {
    :root[data-kickass='bento'] .tegel { animation: none; opacity: 1; }
    :root[data-kickass='bento'] .bento-typer::after { animation: none; }
  }
</style>
```

- [ ] **Step 2: Schrijf het paginabestand**

Maak `src/pages/kickass/bento.astro`. Let op: de `hero`-slot wordt hier wel meegegeven maar niet gerenderd door de laag; dat is bedoeld en houdt alle paginabestanden gelijkvormig.

```astro
---
import DemoShell from '../../components/kickass/DemoShell.astro';
import DemoHero from '../../components/kickass/DemoHero.astro';
import DemoLadder from '../../components/kickass/DemoLadder.astro';
import DemoServices from '../../components/kickass/DemoServices.astro';
import Laag from '../../components/kickass/layers/Bento.astro';
import { variantBySlug } from '../../kickass/variants';

const variant = variantBySlug('bento');
---
<DemoShell variant={variant}>
  <Laag>
    <DemoHero slot="hero" />
    <Fragment slot="rest">
      <DemoLadder />
      <DemoServices />
    </Fragment>
  </Laag>
</DemoShell>
```

- [ ] **Step 3: Bouw en controleer**

```bash
npm run build && node scripts/check-kickass.mjs
```

Verwacht: alle tien varianten `ok`, geen fouten meer, en `Alles in orde.` aan het einde.

- [ ] **Step 4: Controleer dat de gewone hero echt niet gerenderd is**

```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync('dist/kickass/bento/index.html','utf8');
const secties=(html.match(/class=\"section hero\"/g)||[]).length;
console.log('hero-secties op de bento-pagina:', secties);
if (secties !== 0) { console.error('FOUT: de gewone hero staat er nog in'); process.exit(1); }
"
```

Verwacht: `0`. Rendert Astro de niet-gebruikte slot toch, verwijder dan `<DemoHero slot="hero" />` uit `bento.astro`.

- [ ] **Step 5: Bekijk hem**

Open `/kickass/bento/`. Controleer: de tegels komen na elkaar in beeld, de prompt typt zichzelf en begint opnieuw, het aapje draait in zijn tegel, de teller loopt naar 10, en het raster valt op 768 px netjes naar twee kolommen.

- [ ] **Step 6: Commit**

```bash
git add src/components/kickass/layers/Bento.astro src/pages/kickass/bento.astro
git commit -F - <<'EOF'
feat: variant Bento-cockpit

De hero wordt een raster van tegels die elk iets doen: typen, tellen, draaien,
tonen. De enige laag die de gewone hero vervangt, en de enige die het beeld en
het 3D-model samenbrengt.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

---

## Task 13: De sweep en de vergelijking

**Files:**
- Modify: alle tien lagen, waar de controle iets aan het licht brengt
- Create: `docs/superpowers/kickass-vergelijking.md`

**Interfaces:**
- Consumes: alle voorgaande taken.

- [ ] **Step 1: Draai de volledige controle**

```bash
npm run build && node scripts/check-kickass.mjs
```

Verwacht: `Alles in orde.` en exit 0.

- [ ] **Step 2: Meet het gewicht per pagina**

```bash
node -e "
const fs=require('fs');
const slugs=['neon-jungle','maanlicht','bento','terminal','aurora','spotlight','klimmen','brutalist','netwerk','vloeibaar'];
for (const slug of slugs) {
  const p='dist/kickass/'+slug+'/index.html';
  const html=fs.readFileSync(p,'utf8');
  let bytes=fs.statSync(p).size;
  for (const m of html.matchAll(/(?:src|href)=\"(\/(?:_astro|media)[^\"]+)\"/g)) {
    try { bytes+=fs.statSync('dist'+m[1]).size; } catch(e){}
  }
  console.log(slug.padEnd(14), (bytes/1024).toFixed(0).padStart(6)+' kB');
}
const g=fs.statSync('dist/kickass/index.html').size;
console.log('galerij'.padEnd(14), (g/1024).toFixed(0).padStart(6)+' kB');
"
```

Verwacht: de galerij onder 400 kB, geen variant boven 3.500 kB. Zit er één erboven, noteer welke en waarom (dat zal het 3D-model zijn) en meld het.

- [ ] **Step 3: Bekijk alle tien in de browser op 1440 px**

Start `npm run preview`. Loop de tien varianten door via de pijlen in de demobalk. Voor elke variant:

- Console leeg (geen 404, geen scriptfout).
- De hero-titel leesbaar.
- De ladder en de services leesbaar, geen tekst die wegvalt in de achtergrond.
- Maak een screenshot en bewaar die in de scratchpad onder `<slug>-1440.png`.

- [ ] **Step 4: Bekijk alle tien op 390 px**

Zet in de devtools de viewport op 390 px breed. Controleer per variant dat de zware effecten weg zijn (3D-canvas, deeltjes, de vloeibare titel) en dat de pagina niet horizontaal scrollt:

```js
// In de console van elke variant:
document.documentElement.scrollWidth <= window.innerWidth
```

Verwacht: `true`. Is het `false`, zoek het element dat uitsteekt en beperk het.

- [ ] **Step 5: Bekijk alle tien met reduced motion**

Zet in de devtools onder Rendering de emulatie `prefers-reduced-motion: reduce` aan en loop de tien opnieuw door. Verwacht per variant: niets beweegt, en de inhoud staat er volledig (geen tegel die op `opacity: 0` blijft hangen, geen titel die leeg blijft omdat het typescript niet draaide).

- [ ] **Step 6: Reken het contrast na**

Draai in de console van elke variant:

```js
(() => {
  const lum = (c) => {
    const [r, g, b] = c.match(/\d+/g).slice(0, 3).map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const doelen = ['h1', '.lede', '.ladder-row p', '.service-card p', '.hero-meta'];
  for (const sel of doelen) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const s = getComputedStyle(el);
    let achter = el;
    let bg = 'rgba(0, 0, 0, 0)';
    while (achter && bg === 'rgba(0, 0, 0, 0)') {
      bg = getComputedStyle(achter).backgroundColor;
      achter = achter.parentElement;
    }
    console.log(sel, ratio(s.color, bg).toFixed(2));
  }
})();
```

Verwacht: minstens 4,5 voor alle tekstregels, en minstens 3,0 voor `h1` (grote tekst). Haalt een variant het niet, maak `--muted` of `--ink-soft` daar lichter tot het wel lukt. Let op: bij Aurora en Maanlicht staat de tekst op een half doorzichtige laag, dus dit script leest de achtergrond eronder; beoordeel die twee met het oog en noteer wat je ziet.

- [ ] **Step 7: Schrijf de vergelijking**

Maak `docs/superpowers/kickass-vergelijking.md` met per variant: de naam, wat er goed werkt, wat eraan schort, het gemeten gewicht en of hij ook zonder JavaScript overeind blijft. Sluit af met een eigen top drie en de reden. Dit is het document waarmee Stijn kiest, dus schrijf het als een advies en niet als een verslag.

- [ ] **Step 8: Commit**

```bash
git add docs/superpowers/kickass-vergelijking.md src/components/kickass
git commit -F - <<'EOF'
fix: sweep over de tien varianten, plus de vergelijking

Contrast nagerekend, mobiel en reduced motion nagelopen, gewicht per pagina
gemeten. De vergelijking staat in docs/superpowers/kickass-vergelijking.md.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 9: Meld op**

Geef Stijn de link naar `/kickass/`, de top drie uit de vergelijking, en de twee dingen die hij moet weten voor hij kiest: welke variant hoeveel weegt, en welke er zonder JavaScript nog uitziet zoals bedoeld.

---

## Zelfcontrole van dit plan

Nagelopen tegen de spec:

- Verborgen galerij met tien varianten: taak 2 (galerij, sitemapfilter, noindex) en taken 3 tot 12 (de varianten).
- `data-kickass` naast `data-theme`: taak 2, `DemoShell`.
- Alleen de gekozen laag laadt: opgelost met tien paginabestanden, gecontroleerd door `--kickass-laag` in `scripts/check-kickass.mjs` (taak 2) en de scriptgroottemeting in taak 11.
- Elke variant werkt zonder de media: de noodkop in `aapje3d.ts` (taak 11); `Maanlicht` en `Bento` verwijzen naar bestanden die taak 1 aanmaakt, en taak 1 gaat vooraf.
- Media-optimalisatie met budgetten: taak 1, gecontroleerd in taak 2 en gemeten in taak 13.
- `prefers-reduced-motion` in elke variant: een eigen blok in elke laag, nagelopen in taak 13 stap 5.
- Contrast minstens 4,5:1: taak 13 stap 6.
- Onder 768 px vallen de zware effecten weg: media-query in elke laag, nagelopen in taak 13 stap 4.
- Gewichtsbudget: taak 13 stap 2.
- De echte site blijft ongemoeid: alleen `astro.config.mjs` wijzigt, en dat staat in de globale randvoorwaarden.

Namen die over taken heen lopen, en die dus gelijk moeten blijven: `VARIANTS`, `variantBySlug`, `buren`, `Variant`, de prop `variant` op `DemoShell`, de slots `hero` en `rest`, `startAapje(canvas, { modelPad, kleur })`, de CSS-variabele `--kickass-laag`, en de klasse `.hero-titel` (waar Terminal, Vloeibaar en Bento op mikken).
