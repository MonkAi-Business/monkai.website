# Dark mode en themaschakelaar - ontwerp

Datum: 2026-07-27
Status: goedgekeurd, klaar voor implementatieplan
Deel 1 van 2. Deel 2 (de superpowers-versie met beweging en 3D) krijgt een eigen spec.

## Doel

De site krijgt een donkere variant en een schakelaar bovenaan waarmee de bezoeker kiest.
De schakelaar is voorbereid op een derde stand, `superpowers`, maar die knop rendert nog niet.

## Beslissingen van Stijn

Deze staan vast en zijn niet opnieuw ter discussie tijdens de implementatie:

1. **Twee delen.** Deel 1 is de themalaag. De superpowers-versie wordt apart ontworpen.
2. **Standaard is altijd light.** De site volgt bewust *niet* de systeeminstelling van de bezoeker.
   Dark krijg je enkel door te klikken.
3. **De superpowers-knop wordt uiteindelijk publiek**, als derde knop in dezelfde schakelaar.
   Maar hij verschijnt pas wanneer deel 2 af is.
4. **Segmentvorm** voor de schakelaar: de standen naast elkaar in een omlijning, de actieve ingevuld.
   Niet een knop die doorschakelt, niet een uitklaplijstje.
5. **Blogcovers worden getemperd met CSS** in dark mode, er komen geen donkere varianten van de SVG's.

## Architectuur

### Het themattribuut

Eén attribuut op het `<html>`-element stuurt alles aan:

```html
<html lang="nl" data-theme="light">
```

Geldige waarden: `light`, `dark`, `superpowers`. Staat het attribuut er niet, dan geldt de
light-set uit `:root`, dus een pagina zonder JavaScript rendert correct in light.

### Tokens

`src/styles/tokens.css` blijft de enige bron van waarheid. `:root` blijft de light-set en verandert
inhoudelijk niet, op vier nieuwe tokens na (zie hieronder). Daaronder komt één blok met de
dark-overrides.

**Vier nieuwe tokens in `:root`**, nodig omdat er vandaag hexes en rgba-waarden buiten `tokens.css`
staan die in dark mode moeten kantelen:

| Token | Light | Waarvoor |
|---|---|---|
| `--on-green` | `#FFFFFF` | Tekst op een groen vlak (knoppen, actieve chips en tabs) |
| `--danger` | `#9A3B2F` | Foutmelding, vandaag hardcoded in `/data` |
| `--dark-border` | `#3A3D33` | Scheidingslijn *op* een contrastvlak, vandaag hardcoded in de footer |
| `--shadow` | `0 6px 24px rgba(36, 38, 31, 0.14)` | Slagschaduw, vandaag hardcoded in de consent-banner |

De doorzichtige varianten van `--on-green` worden afgeleid met `color-mix` in plaats van extra
tokens: `color-mix(in srgb, var(--on-green) 70%, transparent)` voor het gedimde telnummer,
`color-mix(in srgb, var(--on-green) 20%, transparent)` voor het badge-achtergrondje.

**De dark-set.** Warm en olijfkleurig, afgeleid van `--ink` (`#24261F`), niet het generieke blauwgrijs
dat elke dark mode heeft. Voorgestelde waarden:

```css
:root[data-theme='dark'] {
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

Deze waarden zijn een vertrekpunt, geen eindpunt. Tijdens de implementatie wordt elke
tekst-op-achtergrondcombinatie op contrast nagerekend (WCAG AA, dus 4,5:1 voor gewone tekst en
3:1 voor grote tekst en randen). Wat zakt, wordt bijgesteld. Niet op het oog kiezen.

**Twee dingen aan die set die tegenintuïtief zijn en dus commentaar krijgen in `tokens.css`:**

- `--green` wordt in dark mode *lichter* dan in light mode. Het brandgroen `#4C5F3B` op een bijna
  zwarte achtergrond haalt geen leesbaar contrast. Daardoor draait de knop om: lichtgroen vlak met
  donkere tekst in plaats van donkergroen vlak met witte tekst. Dat is precies waarvoor `--on-green`
  bestaat.
- Het drietal `--dark` / `--dark-text` / `--dark-dim` betekent vandaag "donker vlak op een lichte
  pagina" (de footer, de Raad-van-advies-kaart, de trede Versnellen in `Ladder.astro`, de
  kopieerblokken op `/inspiratie`). In dark mode moet zo'n vlak juist *lichter* zijn dan de pagina,
  anders verdwijnt het. `--dark` wordt daarom `#2C2F26`, boven `--bg-page`. De namen blijven zoals
  ze zijn, want ze zitten in 14 bestanden en hernoemen is hier scope creep. In `tokens.css` komt de
  uitleg dat de betekenis "contrastvlak" is en niet letterlijk "donker".

**De superpowers-stand in deel 1.** Krijgt voorlopig dezelfde overrides als dark, door het blok te
selecteren met `:root[data-theme='dark'], :root[data-theme='superpowers']`. Zo krijg je bij een
voorbeeldweergave iets samenhangends in plaats van iets kapots. Deel 2 vervangt dit door een eigen
blok.

### Geen flits bij het laden

De keuze staat in `localStorage`, dus de server weet ze niet en de HTML komt binnen zonder attribuut.
Wie dark koos, zou eerst een lichte pagina zien en dan een sprong.

Oplossing: een blokkerend inline scriptje bovenaan de `<head>` van `BaseLayout.astro`, vóór de
eerste verf. Waarden komen via `define:vars` binnen zodat de sleutelnaam en de lijst met standen niet
op twee plaatsen staan (dat is het patroon dat `Analytics.astro` en `ConsentBanner.astro` al volgen).

Het scriptje doet drie dingen, in deze volgorde:

1. Kijkt of er een `?theme=` in de URL staat met een geldige waarde. Zo ja: gebruik die en bewaar ze.
   Dit is de achterdeur waarmee Stijn tijdens deel 2 `?theme=superpowers` kan bekijken zonder dat de
   knop publiek staat.
2. Anders: leest de bewaarde keuze.
3. Anders: `light`.

Alles in een `try`/`catch`, want `localStorage` gooit in sommige privacystanden. Faalt het, dan is het
resultaat light, en dat is de gewenste standaard.

De CSP uit `netlify.toml` staat op `'unsafe-inline'` voor `script-src`, dus dit werkt zonder de CSP aan
te raken. Wel meenemen in de verificatie.

### De overgang zelf

Instant, geen `transition`. Een kleurovergang over een pagina van vijftien secties geeft een
zichtbare golf en kost onnodig veel schilderwerk. Enkel de schakelaar zelf mag een korte
hoverovergang hebben.

### Opslag en de juridische kant

Sleutel: `localStorage['monkai_theme']`, waarde is de naam van de stand. Geen vervaldatum.

Dit gaat **niet** door de consent-banner. Een voorkeur die de bezoeker zelf instelt door op een knop
te duwen is functioneel en valt onder de uitzondering op de toestemmingsplicht: de opslag is strikt
noodzakelijk voor een dienst die de gebruiker uitdrukkelijk heeft gevraagd. De meting valt daar niet
onder, want die vraagt niemand. Die grens blijft zoals ze is.

Wel te doen, want `/cookies` en `/privacy` beschrijven vandaag exact wat er op het toestel komt en dat
moet blijven kloppen: één alinea toevoegen dat er sinds nu ook een themavoorkeur bewaard wordt,
zonder toestemming, functioneel, te wissen door de opslag van de site leeg te maken.

## Componenten

### `src/utils/theme.ts` (nieuw)

Klein en zonder afhankelijkheden. Bevat:

- `THEMES`: de drie geldige waarden.
- `DEFAULT_THEME`: `'light'`.
- `STORAGE_KEY`: `'monkai_theme'`.
- `SUPERPOWERS_ENABLED`: `false`. De ene vlag die deel 2 op `true` zet.
- `VISIBLE_THEMES`: de standen die als knop renderen, afgeleid van de vlag.

Wordt gebruikt door `BaseLayout.astro` (voor het head-scriptje) en `ThemeToggle.astro`.

### `src/components/ThemeToggle.astro` (nieuw)

Rendert de segmentschakelaar:

```html
<div class="theme-toggle" role="group" aria-label="Thema">
  <button type="button" data-theme-set="light" aria-pressed="true" title="Licht">
    <svg aria-hidden="true">…</svg><span class="sr-only">Licht</span>
  </button>
  <button type="button" data-theme-set="dark" aria-pressed="false" title="Donker">…</button>
</div>
```

Punten die tellen:

- **Hij wordt twee keer gerenderd** (desktopbalk en mobiel uitklapmenu), dus geen `id`'s. Alles via
  `querySelectorAll` op `[data-theme-set]`, en bij een klik worden *alle* instanties bijgewerkt.
- **Toegankelijkheid** via `aria-pressed` op elke knop, precies één op `true`. Een `radiogroup` met
  `aria-checked` zou semantisch strikter zijn, maar vraagt eigen pijltjestoetsafhandeling voor iets
  wat maar twee of drie knoppen telt. Bewuste keuze voor de eenvoudigere variant. Elke knop heeft een
  zichtbare naam voor schermlezers via `.sr-only`, want het icoon alleen is niets waard.
- **De actieve knop** krijgt `background: var(--green)` en `color: var(--on-green)`, dus hij volgt het
  thema mee.
- **Bij het laden** leest het script het attribuut op `<html>` en zet `aria-pressed` juist. De
  serverzijde rendert `light` als actief, want dat is de standaard.
- Geen focusval, gewoon tabben en enter of spatie.

### `src/components/Nav.astro` (wijzigen)

`<ThemeToggle />` komt twee keer: in `.nav-links` net vóór de knop "Laten we praten", en onderaan in
`.nav-mobile` onder de CTA, met een scheidingslijn erboven. Op mobiel staat hij niet naast de
hamburger, daar is bij 390 pixels geen ruimte.

### `src/layouts/BaseLayout.astro` (wijzigen)

Het head-scriptje erbij, zo vroeg mogelijk in `<head>`.

### `src/styles/global.css` (wijzigen)

- `.btn` gebruikt `var(--on-green)` in plaats van `#fff`, twee plaatsen.
- Nieuwe `.sr-only`-hulpklasse (die bestaat nog niet).
- De dempingsregel voor blogcovers.

## De hardcoded waarden opruimen

Dertien hexes en vier rgba-waarden staan vandaag buiten `tokens.css`. Elk daarvan wordt bekeken.
Volledige lijst zodat er niets vergeten wordt:

| Bestand | Regel | Vandaag | Wordt |
|---|---|---|---|
| `styles/global.css` | 12, 13 | `color: #fff` | `var(--on-green)` |
| `components/Nav.astro` | 109, 148 | `color: #fff` | `var(--on-green)` |
| `components/Footer.astro` | 111 | `border-top: 1px solid #3A3D33` | `var(--dark-border)` |
| `pages/blog/index.astro` | 174 | `color: #fff` op actieve chip | `var(--on-green)` |
| `pages/blog/index.astro` | 175 | `rgba(255,255,255,0.7)` | `color-mix(… --on-green 70% …)` |
| `pages/data/index.astro` | 102 | `color: #9a3b2f` | `var(--danger)` |
| `pages/data/index.astro` | 114 | `color: #fff` | `var(--on-green)` |
| `pages/data/index.astro` | 116 | `rgba(255,255,255,0.2)` + `#fff` | `color-mix(… 20% …)` + `var(--on-green)` |
| `pages/inspiratie/index.astro` | 155 | `color: #fff` | `var(--on-green)` |
| `pages/inspiratie/index.astro` | 157 | `rgba(255,255,255,0.2)` + `#fff` | `color-mix(… 20% …)` + `var(--on-green)` |
| `pages/inspiratie/index.astro` | 190, 191 | `color: #fff` | `var(--on-green)` |
| `components/ConsentBanner.astro` | 193 | `box-shadow: 0 6px 24px rgba(36,38,31,0.14)` | `var(--shadow)` |

Regelnummers zijn van 2026-07-27 en kunnen schuiven. Zoek op de waarde, niet op het nummer.

## Blogcovers in dark mode

Eén regel in `global.css`, met een attribuutselector op het pad zodat elke cover die er later
bijkomt automatisch meedoet:

```css
:root[data-theme='dark'] img[src^='/media/blog/'] {
  filter: brightness(0.88) saturate(0.9);
}
```

Dit raakt de covers op `/blog`, op de detailpagina's, in `BlogTeaser` op de homepage en het
diagram `skills-orchestrator.svg` in de body van een post. Het raakt de foto van Stijn
(`/media/stijn.jpg`) bewust niet, want een portret hoort niet gedempt te worden.

De zachte rand: de thumbnails op `/blog` hebben al een `1px solid var(--border)` aan de zijkant, dus
die kantelt automatisch mee. De cover op de detailpagina en de kaarten in `BlogTeaser` worden tijdens
de implementatie nagekeken en krijgen er in dark mode een als ze er geen hebben.

## Wat er niet in zit

- Geen `prefers-color-scheme`. Bewuste keuze: standaard is altijd light.
- Geen donkere og-image of favicon. Die leven buiten de pagina.
- Geen donkere varianten van de blogcover-SVG's.
- Geen 3D en geen beweging. Dat is deel 2.
- Geen hernoeming van het `--dark`-drietal.
- Geen aanpassing aan `netlify.toml` of de CSP.

## Verificatie

Er is geen testframework in dit project, dus verificatie gebeurt met de bouw en de browser. Dit is de
lijst die afgevinkt moet worden voor er "klaar" gezegd wordt:

**Bouwen**

- `npm run build` slaagt zonder nieuwe waarschuwingen.
- Grep op `#fff`, `#FFF` en `rgba(255` in `src/` levert enkel bewust achtergelaten treffers op.

**Beide standen, per pagina**

Homepage (alle vijftien secties), `/blog`, een blogdetailpagina, `/use-cases`, een use-case-detail,
`/data` (zowel het inlogscherm als de ontgrendelde staat), `/inspiratie`, `/privacy`, `/cookies`,
`/bedankt`.

**Plekken waar het typisch fout gaat, expliciet nakijken**

- Het contactformulier: invoervelden, placeholdertekst, de verzendknop.
- De footer en de logo-variant `dark` daarin.
- De donkere kaart "Raad van advies" in `Services` en de trede Versnellen in `Ladder`. Dat zijn
  samen met de footer, de kopieerblokken op `/inspiratie` en de dark-variant van het logo de enige
  plekken die het `--dark`-drietal gebruiken.
- De actieve tagknoppen op `/blog` en de actieve tabs op `/data` en `/inspiratie`, inclusief het
  telnummer erin.
- De kopieerblokken op `/inspiratie` (`pre` op `--dark`).
- De consent-banner zelf, in beide standen.
- De placeholderkaart "Jouw naam hier" in `Team`, die op een stippellijn staat.

**Gedrag**

- Klikken op donker verandert de pagina meteen, zonder herladen.
- Herladen behoudt de keuze, ook op een andere pagina van de site.
- Geen lichte flits bij het herladen in dark mode.
- Met JavaScript uit rendert de site in light en is de schakelaar zichtbaar maar zonder effect.
- `?theme=superpowers` in de URL zet de stand en onthoudt ze, ook al staat de knop er niet.
- De schakelaar in het mobiele menu werkt en houdt gelijke tred met die in de balk.
- Tabben en enter bedienen de schakelaar.
- Geen CSP-overtredingen in de console, met het testserverscriptje uit les 31 als de headers
  meegenomen moeten worden.

**Contrast**

Elke tekst-op-achtergrondcombinatie in de dark-set nagerekend op WCAG AA. Wat zakt, bijstellen.

## Openstaand voor deel 2

- Hoe de superpowers-versie eruitziet, welke techniek (three.js of iets lichters), wat het kost aan
  laadtijd, en wat er gebeurt bij `prefers-reduced-motion`.
- De vlag `SUPERPOWERS_ENABLED` op `true` zetten en het derde icoon toevoegen.
- Of de superpowers-versie dezelfde inhoud toont of een eigen opbouw krijgt.
