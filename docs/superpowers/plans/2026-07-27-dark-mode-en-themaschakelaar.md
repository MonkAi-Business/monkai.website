# Dark mode en themaschakelaar - implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De site krijgt een donkere variant en een schakelaar in de navigatiebalk, met de superpowers-stand al werkend maar de knop nog verborgen.

**Architecture:** Eén attribuut `data-theme` op `<html>` stuurt alles. `tokens.css` blijft de enige bron van kleuren: `:root` is light, een tweede blok overschrijft dezelfde tokennamen voor dark. Een blokkerend inline scriptje in de `<head>` zet het attribuut vóór de eerste verf zodat er geen lichte flits is. De schakelaar is een aparte component die twee keer gerenderd wordt en zichzelf synchroon houdt.

**Tech Stack:** Astro 5, gewone CSS met custom properties, geen nieuwe afhankelijkheden. Verificatie met `npm run build`, een wegwerpharnas in de scratchpad dat het gebouwde script uit `dist/` draait (patroon uit les 26) en de browser.

**Spec:** `docs/superpowers/specs/2026-07-27-dark-mode-en-themaschakelaar-design.md`

## Global Constraints

Deze gelden bij elke taak hieronder.

- **Geen em-dash of en-dash (— –) in welke tekst dan ook**, ook niet in commit messages of commentaar. Gebruik een gewone hyphen `-`. Harde huisregel uit `CLAUDE.md`.
- Alle zichtbare tekst en alle codecommentaar in het **Nederlands**, nuchter en zonder marketingtaal.
- **Geen hardcoded kleur, radius of fontstack in een component** waar een token voor bestaat. Bestaat er geen, voeg er een toe aan `tokens.css`.
- **Raak `netlify.toml` en de CSP niet aan.** `script-src` staat al op `'self' 'unsafe-inline'`, dus zowel het inline head-scriptje als het gebundelde script van de schakelaar mogen.
- **Raak `astro.config.mjs` niet aan.**
- **Commit alleen je eigen paden, expliciet, met een pathspec.** Nooit `git add -A` of `git add .`. Er draaien parallelle sessies in deze repo en de git-index is gedeelde staat; les 30 in `CLAUDE.md` beschrijft hoe dat een keer een niet-bouwende HEAD opleverde. Werkwijze: `git add -- <pad>` en daarna `git commit -m "..." -- <pad>`.
- **Niet pushen.** Pushen naar `main` betekent in deze repo deployen naar productie. Dat beslist Stijn.
- Standaardthema is **altijd light**. Er komt geen `prefers-color-scheme`-detectie in, ook niet "als extraatje".
- **Geen `transition` op de themawissel.** De omschakeling is instant. Een kleurovergang over een pagina van vijftien secties geeft een zichtbare golf en kost onnodig schilderwerk. Alleen de schakelaar zelf mag een hoverovergang hebben.

---

## Bestandsoverzicht

| Bestand | Wat het doet |
|---|---|
| `src/utils/theme.ts` | Nieuw. De enige plaats waar de geldige standen, de opslagsleutel, de standaard en de vlag `SUPERPOWERS_ENABLED` staan. |
| `src/components/ThemeToggle.astro` | Nieuw. De segmentschakelaar plus het script dat klikken afhandelt en alle instanties synchroon houdt. |
| `src/styles/tokens.css` | Vier nieuwe tokens in `:root`, plus het blok met de dark-overrides. |
| `src/styles/global.css` | `.btn` op `--on-green`, nieuwe `.sr-only`-klasse, dempingsregel voor blogcovers. |
| `src/layouts/BaseLayout.astro` | `data-theme="light"` op `<html>` en het inline scriptje in de `<head>`. |
| `src/components/Nav.astro` | De schakelaar twee keer: in de balk en in het mobiele menu. Twee `#fff` weg. |
| `src/components/Footer.astro` | Eén hardcoded randkleur weg. |
| `src/components/ConsentBanner.astro` | Hardcoded slagschaduw weg. |
| `src/pages/blog/index.astro` | Eén `#fff` en één `rgba(255,255,255,0.7)` weg. |
| `src/pages/data/index.astro` | Twee `#fff`, één foutkleur en één `rgba(255,255,255,0.2)` weg. |
| `src/pages/inspiratie/index.astro` | Vier `#fff` en één `rgba(255,255,255,0.2)` weg. |
| `src/pages/cookies.astro`, `src/pages/privacy.astro` | Eén alinea over de themavoorkeur. |
| `CLAUDE.md` | Tokentabel bijwerken, les toevoegen. |

---

## Task 1: De nieuwe tokens en de opruiming

Doel van deze taak: alle hardcoded kleuren buiten `tokens.css` verdwijnen, en de site ziet er daarna **exact hetzelfde uit**. Dat is meteen de test. Er komt in deze taak nog geen dark mode.

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Modify: `src/components/Nav.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/ConsentBanner.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/data/index.astro`
- Modify: `src/pages/inspiratie/index.astro`

**Interfaces:**
- Consumes: niets.
- Produces: de tokens `--on-green`, `--danger`, `--dark-border` en `--shadow` in `:root`. Taak 3 geeft ze een dark-waarde.

- [ ] **Step 1: Voeg de vier nieuwe tokens toe aan `src/styles/tokens.css`**

Zet ze in het bestaande `:root`-blok, na `--placeholder`, met dit commentaar erbij:

```css
  /* Tekst op een groen vlak (knoppen, actieve chips en tabs). Bestaat als token
     omdat het groen in dark mode lichter wordt: daar leest witte tekst niet meer
     en moet de tekst juist donker zijn. */
  --on-green: #FFFFFF;

  /* Foutmelding, vandaag alleen op /data. */
  --danger: #9A3B2F;

  /* Scheidingslijn *op* een contrastvlak (de footer). Los van --border, want die
     is afgestemd op de lichte pagina en verdwijnt op een donker vlak. */
  --dark-border: #3A3D33;

  /* Slagschaduw. Op een donkere achtergrond moet die zwarter en sterker. */
  --shadow: 0 6px 24px rgba(36, 38, 31, 0.14);
```

- [ ] **Step 2: Vervang de hardcoded waarden, bestand per bestand**

`src/styles/global.css`, de twee `.btn`-regels:

```css
.btn { display: inline-block; background: var(--green); color: var(--on-green); font-weight: 600; padding: 15px 28px; border-radius: var(--radius-sm); }
.btn:hover { color: var(--on-green); background: var(--green-hover); }
```

`src/components/Nav.astro`, twee keer `color: #fff` (in `.nav-links a.nav-cta` en in `.nav-mobile a.nav-cta-mobile`) wordt `color: var(--on-green);`.

`src/components/Footer.astro`, de regel met het commentaar erboven wordt:

```css
    /* Hairline op het contrastvlak; los van --border, dat op de lichte pagina is afgestemd. */
    border-top: 1px solid var(--dark-border);
```

`src/components/ConsentBanner.astro`:

```css
    box-shadow: var(--shadow);
```

`src/pages/blog/index.astro`:

```css
  .chip[aria-pressed='true'] { background: var(--green); border-color: var(--green); color: var(--on-green); }
  .chip[aria-pressed='true'] .n { color: color-mix(in srgb, var(--on-green) 70%, transparent); }
```

`src/pages/data/index.astro`:

```css
  .err { color: var(--danger); font-size: 14px; margin: 4px 0 0; }
  .tool[aria-selected='true'] { background: var(--green); border-color: var(--green); color: var(--on-green); }
  .tool[aria-selected='true'] .count { background: color-mix(in srgb, var(--on-green) 20%, transparent); color: var(--on-green); }
```

`src/pages/inspiratie/index.astro`:

```css
  .tab[aria-selected='true'] { background: var(--green); border-color: var(--green); color: var(--on-green); }
  .tab[aria-selected='true'] .count { background: color-mix(in srgb, var(--on-green) 20%, transparent); color: var(--on-green); }
  .btn-sm { flex-shrink: 0; background: var(--green); border: 1px solid var(--green); border-radius: var(--radius-sm); padding: 9px 15px; font: inherit; font-size: 14px; font-weight: 600; color: var(--on-green); cursor: pointer; text-align: center; }
  .btn-sm:hover { background: var(--green-hover); border-color: var(--green-hover); color: var(--on-green); }
```

- [ ] **Step 3: Controleer dat er niets is blijven staan**

Run:

```bash
cd "C:/Development/MonkAi/monkai.website" && git grep -nE "#fff|#FFF|#[0-9a-fA-F]{6}|rgba\(255" -- src/ ':!src/styles/tokens.css'
```

Verwacht: geen enkele treffer. Vindt de grep er toch een, dan is die vergeten of hij hoort er bewust te staan; in dat tweede geval zet je een regel commentaar erboven waarom.

- [ ] **Step 4: Bouwen**

Run: `npm run build`
Verwacht: slaagt, geen nieuwe waarschuwingen. Draait er een `npm run dev` naast, herstart die daarna (les 22: een build naast een dev-server geeft een `UnknownFilesystemError` uit de content-layer-cache, dat is geen echte fout).

- [ ] **Step 5: Kijk in de browser dat er niets veranderd is**

Run: `npm run preview`, en bekijk `/`, `/blog`, `/inspiratie` en `/data` (ontgrendeld met `monkai` / `business`).
Verwacht: identiek aan voorheen. Let specifiek op de knoptekst op groene knoppen, de actieve tagknop op `/blog`, de actieve tab op `/inspiratie` inclusief het telnummer, de scheidingslijn onderaan de footer en de schaduw onder de consent-banner.

- [ ] **Step 6: Commit**

```bash
git add -- src/styles/tokens.css src/styles/global.css src/components/Nav.astro src/components/Footer.astro src/components/ConsentBanner.astro src/pages/blog/index.astro src/pages/data/index.astro src/pages/inspiratie/index.astro
git commit -m "refactor: kleuren buiten tokens.css naar tokens getild

Vier nieuwe tokens (--on-green, --danger, --dark-border, --shadow) vervangen de
dertien hexes en vier rgba-waarden die nog los in componenten stonden. Geen
zichtbare wijziging; dit is de voorbereiding op dark mode, waar deze waarden
moeten kantelen.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" -- src/styles/tokens.css src/styles/global.css src/components/Nav.astro src/components/Footer.astro src/components/ConsentBanner.astro src/pages/blog/index.astro src/pages/data/index.astro src/pages/inspiratie/index.astro
```

---

## Task 2: Het themattribuut en het scriptje tegen de flits

Na deze taak staat er een `data-theme` op `<html>`, blijft een keuze bewaard en werkt `?theme=dark`. Er is nog geen donkere CSS, dus je ziet nog niets veranderen. Dat is de bedoeling: de machinerie wordt hier apart getest.

**Files:**
- Create: `src/utils/theme.ts`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: niets.
- Produces:
  - `THEMES: readonly ['light', 'dark', 'superpowers']`
  - `type Theme = 'light' | 'dark' | 'superpowers'`
  - `DEFAULT_THEME: Theme` (waarde `'light'`)
  - `STORAGE_KEY: string` (waarde `'monkai_theme'`)
  - `SUPERPOWERS_ENABLED: boolean` (waarde `false`)
  - `TOGGLE_OPTIONS: { value: Theme; label: string }[]` - de standen die als knop renderen
  - Op `<html>` staat na het laden altijd een geldige `data-theme`.

- [ ] **Step 1: Maak `src/utils/theme.ts`**

```ts
// Eén bron van waarheid voor de themalaag.
//
// Gebruikt door BaseLayout.astro (het inline scriptje in de head, dat de waarden
// via define:vars binnenkrijgt) en door ThemeToggle.astro (de knoppen).
//
// De logica van het head-scriptje staat hier bewust niet in: dat script moet
// inline en blokkerend zijn en kan dus niet importeren. Wat hier staat zijn de
// waarden, zodat de sleutelnaam en de lijst met standen niet op twee plaatsen
// kunnen gaan uiteenlopen.

export const THEMES = ['light', 'dark', 'superpowers'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'light';

export const STORAGE_KEY = 'monkai_theme';

// Deel 2 zet dit op true; dan verschijnt de derde knop in de schakelaar.
// De stand zelf werkt nu al: ?theme=superpowers in de URL zet en bewaart ze.
// Het type staat expliciet op boolean, anders versmalt TypeScript het naar de
// letterlijke waarde false en klaagt hij over de tak hieronder.
export const SUPERPOWERS_ENABLED: boolean = false;

const ALL_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Licht' },
  { value: 'dark', label: 'Donker' },
  { value: 'superpowers', label: 'Superpowers' },
];

export const TOGGLE_OPTIONS = ALL_OPTIONS.filter(
  (option) => option.value !== 'superpowers' || SUPERPOWERS_ENABLED,
);
```

- [ ] **Step 2: Zet het attribuut en het scriptje in `src/layouts/BaseLayout.astro`**

Bovenaan in het frontmatter-blok, bij de andere imports:

```ts
import { THEMES, DEFAULT_THEME, STORAGE_KEY } from '../utils/theme';
```

De openingstag van het document wordt:

```astro
<html lang="nl" data-theme="light">
```

En direct na de `<meta name="viewport" ...>` regel in de `<head>`, dus vóór de stylesheet en vóór alles wat kan verven:

```astro
    <!-- Zet het thema vóór de eerste verf. Zonder dit ziet wie donker koos eerst
         een lichte pagina en dan een sprong. Moet inline en blokkerend, dus dit
         script kan niet importeren; de waarden komen via define:vars uit
         src/utils/theme.ts. -->
    <script is:inline define:vars={{ themes: THEMES, key: STORAGE_KEY, fallback: DEFAULT_THEME }}>
      (function () {
        var chosen = null;
        try {
          // ?theme= in de URL wint en wordt bewaard. Dat is de achterdeur waarmee
          // een stand te bekijken is waarvan de knop nog niet rendert.
          var fromUrl = new URLSearchParams(window.location.search).get('theme');
          if (fromUrl && themes.indexOf(fromUrl) !== -1) {
            chosen = fromUrl;
            window.localStorage.setItem(key, fromUrl);
          }
          if (!chosen) {
            var stored = window.localStorage.getItem(key);
            if (stored && themes.indexOf(stored) !== -1) chosen = stored;
          }
        } catch (e) {
          // localStorage gooit in sommige privacystanden. Dan gewoon de standaard.
        }
        document.documentElement.setAttribute('data-theme', chosen || fallback);
      })();
    </script>
```

- [ ] **Step 3: Bouwen**

Run: `npm run build`
Verwacht: slaagt. Controleer dat het scriptje echt in de uitvoer staat:

```bash
grep -c "data-theme" dist/index.html
```

Verwacht: minstens 2 (het attribuut op `<html>` en de `setAttribute` in het script).

- [ ] **Step 4: Schrijf het testharnas**

De logica moet echt uitgevoerd worden, niet beredeneerd. Zelfde aanpak als les 26 in `CLAUDE.md`: het **gebouwde** script uit `dist/` halen en draaien met nagebootste `window` en `document`. Zo test je wat er echt uitgeleverd wordt, inclusief wat `define:vars` ervan gemaakt heeft, en niet een kopie die kan gaan afwijken.

Het script raakt alleen `window.location.search`, `window.localStorage` en `document.documentElement`, dus een volledige DOM is hier niet nodig. Geen extra afhankelijkheid installeren.

Maak in de scratchpad `theme-test.mjs`:

```js
import { readFileSync } from 'node:fs';

const DIST = 'C:/Development/MonkAi/monkai.website/dist/index.html';
const html = readFileSync(DIST, 'utf8');

// Het themascriptje is het enige script in de uitvoer dat data-theme op
// documentElement zet.
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const code = scripts.find((s) => s.includes('data-theme') && s.includes('documentElement'));
if (!code) throw new Error('Themascript niet gevonden in dist/index.html');

function run({ search = '', stored = null, broken = false } = {}) {
  const store = new Map();
  if (stored !== null) store.set('monkai_theme', stored);

  const localStorage = broken
    ? { getItem() { throw new Error('geblokkeerd'); }, setItem() { throw new Error('geblokkeerd'); } }
    : {
        getItem: (k) => (store.has(k) ? store.get(k) : null),
        setItem: (k, v) => store.set(k, v),
      };

  const root = { attrs: {}, setAttribute(k, v) { this.attrs[k] = v; } };
  const win = { location: { search }, localStorage };
  const doc = { documentElement: root };

  new Function('window', 'document', 'URLSearchParams', code)(win, doc, URLSearchParams);

  return { theme: root.attrs['data-theme'], stored: store.get('monkai_theme') ?? null };
}

const cases = [
  ['niets bewaard, geen url', run(), { theme: 'light', stored: null }],
  ['dark bewaard', run({ stored: 'dark' }), { theme: 'dark', stored: 'dark' }],
  ['ongeldige waarde bewaard', run({ stored: 'paars' }), { theme: 'light', stored: 'paars' }],
  ['?theme=dark', run({ search: '?theme=dark' }), { theme: 'dark', stored: 'dark' }],
  ['?theme=superpowers werkt al', run({ search: '?theme=superpowers' }), { theme: 'superpowers', stored: 'superpowers' }],
  ['ongeldige url wint niet van opslag', run({ search: '?theme=hack', stored: 'dark' }), { theme: 'dark', stored: 'dark' }],
  ['localStorage gooit', run({ broken: true }), { theme: 'light', stored: null }],
];

let failed = 0;
for (const [naam, got, want] of cases) {
  const ok = got.theme === want.theme && got.stored === want.stored;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FOUT'} ${naam} -> ${JSON.stringify(got)}${ok ? '' : ' , verwacht ' + JSON.stringify(want)}`);
}
process.exit(failed ? 1 : 0);
```

- [ ] **Step 5: Draai het harnas en zorg dat alles slaagt**

Run: `node "$SCRATCH/theme-test.mjs"`
Verwacht: zeven regels die met `ok` beginnen, afsluitcode 0.

Faalt de eerste regel omdat het script niet gevonden wordt, kijk dan hoe Astro de `define:vars` precies heeft uitgeschreven in `dist/index.html` en pas de zoekopdracht aan. Het gaat om het echte gebouwde script, niet om een gekopieerde versie.

- [ ] **Step 6: Commit**

```bash
git add -- src/utils/theme.ts src/layouts/BaseLayout.astro
git commit -m "feat: themattribuut op html en het scriptje tegen de flits

data-theme wordt gezet voor de eerste verf, uit localStorage of uit ?theme= in
de URL, met light als terugvaloptie. src/utils/theme.ts is de enige plaats waar
de geldige standen en de opslagsleutel staan. Nog geen donkere CSS.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" -- src/utils/theme.ts src/layouts/BaseLayout.astro
```

Let op: `src/utils/` is nog niet gevolgd door git en er ligt al een `readingTime.ts` van een andere sessie in. De pathspec hierboven noemt alleen `src/utils/theme.ts`, dus die andere blijft ongemoeid. Controleer dat met `git show --stat HEAD` na de commit.

---

## Task 3: De dark-set

Na deze taak is `?theme=dark` een echte donkere site.

**Files:**
- Modify: `src/styles/tokens.css`

**Interfaces:**
- Consumes: de vier tokens uit taak 1, het attribuut uit taak 2.
- Produces: een werkende dark-set. Taak 5 stelt bij waar het contrast zakt.

- [ ] **Step 1: Voeg het dark-blok toe onderaan `src/styles/tokens.css`**

```css
/* Dark mode.
 *
 * Twee dingen die tegenintuïtief zijn en die je niet moet "verbeteren":
 *
 * 1. --green wordt hier *lichter* dan in light mode. Het brandgroen #4C5F3B haalt
 *    op een bijna zwarte achtergrond geen leesbaar contrast. Daardoor draait de
 *    knop om: lichtgroen vlak met donkere tekst. Daarvoor bestaat --on-green.
 *
 * 2. --dark / --dark-text / --dark-dim betekent "contrastvlak", niet letterlijk
 *    "donker". In light mode is dat een donker vlak op een lichte pagina (de
 *    footer, de kaart Raad van advies in Services, de trede Versnellen in Ladder,
 *    de kopieerblokken op /inspiratie). In dark mode moet zo'n vlak juist lichter
 *    zijn dan de pagina, anders verdwijnt het. Vandaar --dark: #2C2F26, boven
 *    --bg-page. De namen blijven zoals ze zijn: ze zitten in 14 bestanden.
 *
 * De superpowers-stand deelt voorlopig deze waarden, zodat een voorbeeldweergave
 * iets samenhangends toont. Deel 2 vervangt dat door een eigen blok.
 */
:root[data-theme='dark'],
:root[data-theme='superpowers'] {
  color-scheme: dark;

  --bg-page: #191B15;
  --bg-canvas: #202219;
  --section-alt: #1D1F18;
  --card: #232620;
  --card-alt: #2A2D24;
  --border: #34372C;

  --ink: #E9E7DF;
  --ink-soft: #C4C7B8;
  --muted: #95988A;

  --green: #9CB382;
  --green-hover: #B4C89C;
  --green-light: #A8BE8F;
  --on-green: #16180F;

  --dark: #2C2F26;
  --dark-text: #E9E7DF;
  --dark-dim: #A2A597;
  --dark-border: #43463A;

  --input-bg: #14160F;
  --placeholder: #7B7E71;

  --danger: #E58C7E;
  --shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
}
```

Zet ook `color-scheme: light;` in het bestaande `:root`-blok, zodat browserknoppen, schuifbalken en de invulhulp van het formulier in beide standen kloppen.

- [ ] **Step 2: Bouwen**

Run: `npm run build`
Verwacht: slaagt.

- [ ] **Step 3: Loop de pagina's af in de browser, in beide standen**

Run: `npm run preview`. Bekijk elke pagina eerst normaal en daarna met `?theme=dark` erachter.

Pagina's: `/`, `/blog`, een blogdetailpagina, `/use-cases`, een use-case-detailpagina, `/data` (zowel het inlogscherm als ontgrendeld), `/inspiratie`, `/privacy`, `/cookies`, `/bedankt`.

Plekken waar het typisch fout gaat, expliciet nakijken:

- Het contactformulier: invoervelden, placeholdertekst, het vinkje (`accent-color: var(--green)` met een lichtgroen vinkje kan een flets vinkje geven), de verzendknop.
- De footer en de dark-variant van het logo daarin.
- De kaart "Raad van advies" in `Services` en de trede Versnellen in `Ladder`. Dat zijn samen met de footer, de kopieerblokken op `/inspiratie` en het logo de enige plekken die het `--dark`-drietal gebruiken.
- De actieve tagknoppen op `/blog` en de actieve tabs op `/data` en `/inspiratie`, inclusief het telnummer in het bolletje.
- De kopieerblokken op `/inspiratie`.
- De consent-banner. Die zou moeten kloppen zonder wijziging, want de knoptekst staat er al op `var(--card)` en die kantelt mee. Bevestigen, niet aannemen.
- De placeholderkaart "Jouw naam hier" in `Team`, die op een stippellijn staat.
- De foutmelding bij een verkeerd wachtwoord op `/data`.

Noteer wat er misstaat. Kleine correcties (een token dat net verkeerd zit) mag je hier meteen doorvoeren; de systematische contrastronde komt in taak 5.

- [ ] **Step 4: Commit**

```bash
git add -- src/styles/tokens.css
git commit -m "feat: donkere kleurenset in tokens.css

Warme olijftinten afgeleid van --ink, geen generiek blauwgrijs. Het groen wordt
lichter en de knoptekst donker, want het brandgroen haalt op een donkere
achtergrond geen leesbaar contrast. Het --dark-drietal betekent nu contrastvlak
en wordt lichter dan de pagina in plaats van donkerder.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" -- src/styles/tokens.css
```

---

## Task 4: De schakelaar

**Files:**
- Create: `src/components/ThemeToggle.astro`
- Modify: `src/styles/global.css`
- Modify: `src/components/Nav.astro`

**Interfaces:**
- Consumes: `TOGGLE_OPTIONS`, `DEFAULT_THEME`, `STORAGE_KEY`, `THEMES` uit `src/utils/theme.ts`.
- Produces: `<ThemeToggle />`, zonder props, veilig om meer dan één keer te renderen.

- [ ] **Step 1: Voeg `.sr-only` toe aan `src/styles/global.css`**

Er is nog geen hulpklasse voor tekst die alleen een schermlezer hoort te krijgen.

```css
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
```

- [ ] **Step 2: Maak `src/components/ThemeToggle.astro`**

```astro
---
// De themaschakelaar. Wordt twee keer gerenderd (navigatiebalk en mobiel menu),
// dus geen id's: alles loopt via [data-theme-set] en querySelectorAll, en bij een
// klik worden alle instanties bijgewerkt.
//
// Toegankelijkheid via aria-pressed op elke knop, precies één op true. Een
// radiogroup met aria-checked zou strikter zijn maar vraagt eigen afhandeling van
// de pijltjestoetsen voor twee of drie knoppen. Bewuste keuze voor de eenvoud.
import { TOGGLE_OPTIONS, DEFAULT_THEME } from '../utils/theme';

const icons: Record<string, string> = {
  light: `<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M21.4 12h-2.2M4.8 12H2.6M18.6 5.4 17 7M7 17l-1.6 1.6M18.6 18.6 17 17M7 7 5.4 5.4"/>`,
  dark: `<path d="M20.5 14.4A8.6 8.6 0 0 1 9.6 3.5a8.6 8.6 0 1 0 10.9 10.9Z"/>`,
  superpowers: `<path d="M13.2 2.5 4.8 13.4h5.6l-.6 8.1 8.4-10.9h-5.6z"/>`,
};
---

<div class="theme-toggle" role="group" aria-label="Thema">
  {TOGGLE_OPTIONS.map((option) => (
    <button
      type="button"
      data-theme-set={option.value}
      aria-pressed={option.value === DEFAULT_THEME ? 'true' : 'false'}
      title={option.label}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        set:html={icons[option.value]}
      />
      <span class="sr-only">{option.label}</span>
    </button>
  ))}
</div>

<script>
  import { STORAGE_KEY, THEMES, DEFAULT_THEME } from '../utils/theme';

  const root = document.documentElement;
  const valid: readonly string[] = THEMES;

  function huidig(): string {
    const attr = root.getAttribute('data-theme');
    return attr && valid.includes(attr) ? attr : DEFAULT_THEME;
  }

  function synchroniseer(thema: string) {
    document.querySelectorAll<HTMLButtonElement>('[data-theme-set]').forEach((knop) => {
      knop.setAttribute('aria-pressed', String(knop.dataset.themeSet === thema));
    });
  }

  function pasToe(thema: string) {
    if (!valid.includes(thema)) return;
    root.setAttribute('data-theme', thema);
    try {
      window.localStorage.setItem(STORAGE_KEY, thema);
    } catch (e) {
      // localStorage kan gooien in privacystanden. De stand geldt dan voor deze
      // pagina en is na een navigatie weg. Beter dan een fout.
    }
    synchroniseer(thema);
  }

  document.querySelectorAll<HTMLButtonElement>('[data-theme-set]').forEach((knop) => {
    knop.addEventListener('click', () => {
      const gekozen = knop.dataset.themeSet;
      if (gekozen) pasToe(gekozen);
    });
  });

  // De server rendert light als actief. Zet het bij het laden gelijk met wat het
  // head-scriptje al op <html> heeft gezet.
  synchroniseer(huidig());
</script>

<style>
  .theme-toggle {
    display: inline-flex;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--card);
    flex-shrink: 0;
  }

  .theme-toggle button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 30px;
    padding: 0;
    border: none;
    background: none;
    color: var(--muted);
    cursor: pointer;
  }

  .theme-toggle button + button {
    border-left: 1px solid var(--border);
  }

  .theme-toggle button:hover {
    color: var(--ink);
  }

  .theme-toggle button[aria-pressed='true'] {
    background: var(--green);
    color: var(--on-green);
  }

  .theme-toggle button:focus-visible {
    outline: 2px solid var(--green);
    outline-offset: 2px;
  }
</style>
```

- [ ] **Step 3: Zet de schakelaar in `src/components/Nav.astro`**

Import erbij:

```ts
import ThemeToggle from './ThemeToggle.astro';
```

In `.nav-links`, tussen de linklijst en de knop:

```astro
      <ThemeToggle />
      <a href="/#contact" class="btn nav-cta">Laten we praten</a>
```

Onderaan in `.nav-mobile`, na de knop:

```astro
    <a href="/#contact" class="btn nav-cta-mobile">Laten we praten</a>
    <div class="nav-theme"><ThemeToggle /></div>
```

En in het `<style>`-blok:

```css
  /* Op mobiel staat de schakelaar in het uitklapmenu, niet naast de hamburger:
     daar is bij 390 pixels geen ruimte voor. */
  .nav-theme {
    display: flex;
    justify-content: center;
    padding-top: 18px;
    border-top: 1px solid var(--border);
  }
```

- [ ] **Step 4: Bouwen**

Run: `npm run build`
Verwacht: slaagt. Controleer dat er twee schakelaars in de uitvoer staan en dat de derde knop er niet is:

```bash
grep -o "data-theme-set=\"[a-z]*\"" dist/index.html | sort | uniq -c
```

Verwacht: `light` twee keer, `dark` twee keer, `superpowers` nul keer.

- [ ] **Step 5: Test het gedrag in de browser**

Run: `npm run preview`, en loop dit af:

1. Klik op donker. De pagina wordt meteen donker, zonder herladen.
2. Herlaad. Nog steeds donker, geen lichte flits.
3. Ga naar `/blog`. Nog steeds donker, en de knop daar staat ook op donker.
4. Klik terug op licht. Herlaad. Licht.
5. Open het mobiele menu (venster smaller dan 768 pixels of de apparaatweergave van de browser). De schakelaar staat onderaan, werkt, en de schakelaar in de balk verspringt mee zodra je het venster weer breed maakt.
6. Tab naar de schakelaar en bedien hem met enter en met spatie. De focusrand is zichtbaar.
7. `?theme=superpowers` in de URL: de pagina neemt de stand aan en onthoudt ze, ook al staat er geen derde knop. Zet daarna terug op licht.
8. Zet JavaScript uit en herlaad. De site rendert licht, de schakelaar is zichtbaar en doet niets. Zet JavaScript weer aan.

Let op bij het testen: gesimuleerde muisklikken vlak na een navigatie komen soms niet aan (les 20). Werkt een klik niet, gebruik dan `element.click()` via de JS-tool om de logica te testen.

- [ ] **Step 6: Commit**

```bash
git add -- src/components/ThemeToggle.astro src/components/Nav.astro src/styles/global.css
git commit -m "feat: themaschakelaar in de navigatiebalk

Segmentknop met licht en donker, in de balk en onderaan het mobiele menu. Beide
instanties blijven synchroon. De superpowers-knop zit in de component maar
rendert niet zolang SUPERPOWERS_ENABLED op false staat.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" -- src/components/ThemeToggle.astro src/components/Nav.astro src/styles/global.css
```

---

## Task 5: Blogcovers dempen en de contrastronde

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/tokens.css` (alleen als het contrast ergens zakt)

**Interfaces:**
- Consumes: de dark-set uit taak 3.
- Produces: een dark-set die WCAG AA haalt.

- [ ] **Step 1: Voeg de dempingsregel toe aan `src/styles/global.css`**

```css
/* De blogcovers zijn hand-getekende SVG's met de merkkleuren hard in het bestand;
   een via <img> geladen SVG erft geen CSS-variabelen, dus ze blijven licht. Op een
   donkere pagina brandt zo'n crèmekleurig vlak. De selector werkt op het pad, dus
   elke cover die er later bijkomt doet automatisch mee. De foto van Stijn staat in
   /media/ en niet in /media/blog/, dus die blijft ongemoeid. */
:root[data-theme='dark'] img[src^='/media/blog/'] { filter: brightness(0.88) saturate(0.9); }
```

- [ ] **Step 2: Bekijk het resultaat**

Run: `npm run build && npm run preview`, en bekijk `/blog?theme=dark`, de homepage in donker (de sectie Uit de blog) en een blogdetailpagina in donker.
Verwacht: de covers ogen ingetogen maar herkenbaar, niet vaal en niet verbleekt. Staat het te dof of te fel, stel `brightness` bij in stappen van 0,04.

De rand rond de covers is al in orde en vraagt geen werk: de thumbnails op `/blog` (`.thumb`), de kaarten in `BlogTeaser` (`.thumb`) en de cover op de detailpagina (`.cover`) hebben alle drie al een `1px solid var(--border)`, en die kantelt mee met het thema. Bevestig dat visueel, voeg niets toe.

- [ ] **Step 3: Reken het contrast na**

Ga elke combinatie uit de dark-set af met een contrastberekening (WCAG 2.1, verhouding van relatieve luminantie). Minimaal 4,5:1 voor gewone tekst, 3:1 voor tekst van 24 pixels of groter en voor randen en iconen die betekenis dragen.

Te controleren paren:

| Voorgrond | Achtergrond | Waar |
|---|---|---|
| `--ink` | `--bg-page` | body-tekst |
| `--ink-soft` | `--bg-page` | secundaire tekst |
| `--muted` | `--bg-page` | datums, samenvattingen, `.eyebrow` |
| `--muted` | `--card` | kaarttekst |
| `--green` | `--bg-page` | links |
| `--on-green` | `--green` | knoptekst |
| `--on-green` | `--green-hover` | knoptekst bij hover |
| `--dark-text` | `--dark` | footer en contrastvlakken |
| `--dark-dim` | `--dark` | footerlabels en de onderste regel |
| `--ink` | `--input-bg` | ingevulde formuliervelden |
| `--placeholder` | `--input-bg` | placeholdertekst |
| `--danger` | `--card` | foutmelding op /data |
| `--border` | `--bg-page` | randen, minimaal 3:1 |

Doe dit met een rekenscriptje in de scratchpad of met de contrastweergave van de browser-inspecteur, niet op het oog.

- [ ] **Step 4: Stel bij wat zakt**

Zakt een paar onder de norm, pas dan de token in het dark-blok aan en reken opnieuw. Verander bij voorkeur de lichtere van de twee, zodat het warme karakter blijft. Noteer bij elke aanpassing in het commit-bericht welk paar het was.

- [ ] **Step 5: Commit**

```bash
git add -- src/styles/global.css src/styles/tokens.css
git commit -m "feat: blogcovers gedempt in dark mode, contrast nagerekend

Covers uit /media/blog/ krijgen in donker iets minder helderheid en verzadiging;
de selector werkt op het pad zodat nieuwe covers meedoen. Alle kleurparen uit de
dark-set nagerekend op WCAG AA.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" -- src/styles/global.css src/styles/tokens.css
```

---

## Task 6: De documentatie bijwerken

**Files:**
- Modify: `src/pages/cookies.astro`
- Modify: `src/pages/privacy.astro`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: alles hierboven.
- Produces: niets voor de code.

- [ ] **Step 1: Lees eerst hoe `/cookies` en `/privacy` nu geschreven zijn**

Deze twee pagina's zijn al twee keer herschreven om exact te kloppen met wat er op het toestel komt (les 16 en les 20). Schrijf in dezelfde toon en op dezelfde plek in de opbouw, niet als een losse bijlage onderaan.

- [ ] **Step 2: Voeg één alinea toe over de themavoorkeur**

Inhoud die erin moet, in gewone taal:

- Kies je licht of donker, dan bewaart de site die keuze op je toestel onder de naam `monkai_theme`.
- Daar is geen toestemming voor nodig, want het is een voorkeur die je zelf instelt en zonder die opslag zou de site je keuze bij elke pagina vergeten.
- Er staat niets in wat naar jou herleidbaar is, en ze wordt nergens naartoe gestuurd.
- Je wist ze door de opslag van deze site in je browser leeg te maken.

Belangrijk: raak de bestaande uitleg over de meting en de toestemming **niet** aan. De grens tussen "functioneel, geen toestemming" en "meting, wel toestemming" moet duidelijk blijven staan.

- [ ] **Step 3: Werk de tokentabel in `CLAUDE.md` bij**

Voeg `--on-green`, `--danger`, `--dark-border` en `--shadow` toe aan de tabel onder "Design tokens", met hun light-waarde en waar ze voor dienen. Zet onder de tabel een korte alinea dat er sinds nu een dark-set bestaat in hetzelfde bestand, dat `--green` daar lichter wordt en de knoptekst donker, en dat het `--dark`-drietal "contrastvlak" betekent en niet letterlijk "donker".

- [ ] **Step 4: Voeg een les toe onderaan "Lessons learned"**

Nummer hem door op wat er dan staat (er zijn parallelle sessies, dus controleer het hoogste nummer op het moment zelf). Inhoud die erin hoort:

- Wat er gebouwd is en waar het staat: `data-theme` op `<html>`, `src/utils/theme.ts` als enige bron van de standen, de dark-set in `tokens.css`, `ThemeToggle.astro` in de nav.
- Standaard is bewust altijd light, er is geen `prefers-color-scheme`. Draai dat niet terug.
- Het inline scriptje in de head moet blokkerend blijven, anders komt de lichte flits terug.
- De themavoorkeur gaat bewust niet door de consent-banner: functioneel, door de bezoeker zelf gevraagd.
- `?theme=superpowers` werkt al; `SUPERPOWERS_ENABLED` in `src/utils/theme.ts` is de ene vlag die deel 2 omzet.
- De twee tegenintuïtieve dingen aan de dark-set (lichter groen met donkere knoptekst, en `--dark` dat lichter wordt dan de pagina).
- Verwijs naar de spec en naar dit plan.

- [ ] **Step 5: Bouwen en nakijken**

Run: `npm run build && npm run preview`, bekijk `/cookies` en `/privacy` in beide standen.
Verwacht: de nieuwe alinea leest als de rest, en er staat geen em-dash in.

Run: `git grep -n "—\|–" -- src/pages/cookies.astro src/pages/privacy.astro CLAUDE.md`
Verwacht: alleen treffers die er al stonden vóór deze taak.

- [ ] **Step 6: Commit**

```bash
git add -- src/pages/cookies.astro src/pages/privacy.astro CLAUDE.md
git commit -m "docs: themavoorkeur beschreven op /cookies en /privacy, CLAUDE.md bijgewerkt

De keuze licht of donker wordt op het toestel bewaard. Dat is functioneel en
gaat bewust niet door de consent-banner; die grens staat nu expliciet op beide
pagina's. Tokentabel aangevuld en een les toegevoegd.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" -- src/pages/cookies.astro src/pages/privacy.astro CLAUDE.md
```

Let op: `CLAUDE.md` staat al als gewijzigd in de working tree door een andere sessie. Kijk met `git diff CLAUDE.md` wat daar al in zit vóór je begint, en commit alleen als je eigen wijziging erbij staat zonder die van de ander stuk te maken. Bij twijfel: laat `CLAUDE.md` uit de commit en meld het.

---

## Afronding

Na taak 6 is deel 1 klaar. Niet pushen; dat beslist Stijn.

Wat er open blijft voor deel 2, en wat dus geen bug is:

- De superpowers-stand deelt de kleuren van dark. Dat is een tijdelijke invulling.
- `SUPERPOWERS_ENABLED` staat op `false`, dus er zijn twee knoppen in plaats van drie.
- Er is geen 3D en geen beweging.
- Er is niets geregeld voor `prefers-reduced-motion`, want er beweegt nog niets buiten de bestaande animatie van de consent-banner.
