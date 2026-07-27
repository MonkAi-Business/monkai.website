# Superpowers-stand: tien varianten om uit te kiezen

Datum: 2026-07-27
Branch: `feature/kickass`
Volgt op: `2026-07-27-dark-mode-en-themaschakelaar-design.md` (deel 1, de themalaag)

## Doel

Deel 1 legde de themalaag aan en reserveerde een derde stand, `superpowers`, achter de vlag
`SUPERPOWERS_ENABLED`. Die stand deelt vandaag de kleuren van dark mode en heeft nog geen eigen
gezicht. Dit document beschrijft niet die eindstand, maar de **keuzeronde ervoor**: tien uitgewerkte
varianten op een verborgen galerij, zodat Stijn kan kijken en kiezen in plaats van beslissen op basis
van een beschrijving.

De winnaar wordt daarna in een aparte ronde netjes gebouwd en aan de themaschakelaar gehangen. Dit
document gaat daar niet over.

## Afbakening

In scope:

- Een verborgen galerij `/kickass` met tien varianten op `/kickass/<slug>`.
- Elke variant toont dezelfde drie secties: de hero, de Ladder en de Services-kaarten.
- Een eenmalige weboptimalisatie van de aangeleverde media.

Buiten scope, expliciet:

- De echte homepage, de navigatie, de footer en de blog blijven ongemoeid.
- `SUPERPOWERS_ENABLED` blijft `false`. De derde knop verschijnt niet.
- De varianten worden niet geoptimaliseerd tot productiekwaliteit. Dit zijn demo's; negen ervan
  gooien we weg.
- Geen wachtwoord op de galerij. Zelfde afweging als `/inspiratie`: wie de URL heeft mag kijken, en
  er staat niets gevoeligs op.

## Beslissingen

1. **Een variant is een set token-overrides plus één laag.** Niet tien herbouwde pagina's. De
   bestaande componenten draaien volledig op de tokens uit `tokens.css`, dus wie `--bg-page`,
   `--ink`, `--green`, `--font-serif` en `--radius` herdefinieert kantelt de hele pagina mee. Het
   eigene van elke variant zit in één extra laagcomponent met eigen markup, CSS en script.
2. **De schakel is `data-kickass` op `<html>`, naast `data-theme`.** De varianten erven de
   superpowers-stand (die vandaag gelijk is aan dark) en overschrijven wat ze nodig hebben. Zo blijft
   er precies één plek waar een kleur vandaan komt.
3. **Alleen de gekozen laag laadt.** De dynamische route rendert één laagcomponent, dus de CSS en het
   script van de negen andere varianten komen nooit op de pagina.
4. **Elke variant werkt zonder de media.** Ontbreekt een bestand, dan valt de variant terug op iets
   dat in code is opgebouwd. De aanwezigheid wordt bij het builden gecontroleerd, niet in de browser.
5. **De aangeleverde media worden niet rechtstreeks gebruikt.** Het origineel blijft staan; er komen
   geoptimaliseerde webversies naast (zie Media).
6. **Beweging is optioneel.** Bij `prefers-reduced-motion: reduce` blijft van elke variant alleen de
   kleur en de typografie over. Geen autoplay, geen deeltjes, geen shader, geen 3D-lus.

## Architectuur

```
src/pages/kickass/index.astro       galerij: tien tegels met naam, pitch en gewicht
src/pages/kickass/[slug].astro      één variant, getStaticPaths uit het manifest
src/kickass/variants.ts             het manifest: slug, naam, pitch, techniek, gewichtsklasse
src/components/kickass/
  DemoShell.astro                   pagina-omhulsel: head, noindex, balk met terugknop
  DemoHero.astro                    gedeelde hero-inhoud
  DemoLadder.astro                  gedeelde ladder-inhoud
  DemoServices.astro                gedeelde services-inhoud
  layers/*.astro                    tien lagen, één per variant
public/media/superpowers/           de geoptimaliseerde webversies van de media
```

### Het manifest

`src/kickass/variants.ts` exporteert een array met per variant: `slug`, `naam`, `pitch` (één zin),
`techniek` (wat het gebruikt), `gewicht` (licht, middel, zwaar) en of de variant de hero vervangt.
De galerij en de dynamische route lezen allebei uit dit bestand, zodat een variant toevoegen of
schrappen op één plek gebeurt.

### DemoShell

Een eigen omhulsel in plaats van `BaseLayout`, want de demo's hebben geen navigatie, geen footer,
geen consent-banner en geen analytics nodig, en ze mogen de sitewide JSON-LD niet meesturen.
`DemoShell` zet `data-theme="superpowers"` en `data-kickass="<slug>"` rechtstreeks op `<html>` bij het
renderen, plus `<meta name="robots" content="noindex, follow">`. Het blokkerende themascript uit
`BaseLayout` is hier niet nodig en komt er dus ook niet in: de stand van een demopagina ligt vast en
volgt niet de voorkeur van de bezoeker.

Bovenaan elke variantpagina staat een smalle balk: de naam van de variant, een pijl terug naar de
galerij en pijlen naar de vorige en de volgende variant. Doorklikken moet snel gaan.

### De gedeelde secties

`DemoHero`, `DemoLadder` en `DemoServices` nemen de markup en de inhoud over van `Hero.astro`,
`Ladder.astro` en `Services.astro`. Ze zijn kopieën, geen hergebruik: de echte componenten mogen
niet wijzigen voor een demo, en de kopieën moeten vrij aanpasbaar zijn. Dat is bewuste duplicatie met
een houdbaarheidsdatum van deze keuzeronde.

Inhoudelijk: de hero met "AI zonder apenstreken", de drie treden van de Ladder (Automatiseren,
Onthouden, Versnellen) en de negen Services-kaarten inclusief de donkere kaart Raad van advies. Drie
secties omdat ze samen een kop, een lijst en een raster dekken; daarop zie je of een stijl standhoudt.

### De lagen

Elke laag is één `.astro`-bestand met daarin de extra markup, een `<style is:global>` die alles
onder `:root[data-kickass='<slug>']` hangt, en optioneel een script. De token-overrides van de
variant staan in datzelfde bestand, niet in `tokens.css`: `tokens.css` beschrijft de echte site en
mag niet volgroeien met tien wegwerpvarianten.

Een laag kan zich achter de inhoud plaatsen (achtergrondeffecten), erboven (spotlight, korrel), of
de hero vervangen (variant 3).

## De tien varianten

| # | Slug | Naam | Laag | Techniek | Gewicht |
|---|---|---|---|---|---|
| 1 | `neon-jungle` | Neon Jungle | 3D-canvas achter de hero | three.js + GLB | zwaar |
| 2 | `maanlicht` | Maanlicht | filmische beeldhero | CSS-animatie op de PNG | licht |
| 3 | `bento` | Bento-cockpit | vervangt de hero | grid + 3D + beeld | zwaar |
| 4 | `terminal` | Terminal | scanlines en typemachine | CSS + 30 regels JS | licht |
| 5 | `aurora` | Aurora | bewegend kleurverloop | CSS blur-animatie | licht |
| 6 | `spotlight` | Spotlight | lichtbundel op de cursor | CSS-variabele + JS | licht |
| 7 | `klimmen` | De klimmende aap | plakkerige Ladder | scroll-gestuurde CSS | middel |
| 8 | `brutalist` | Brutalist | schuivende tekstband | pure CSS | licht |
| 9 | `netwerk` | Neuraal netwerk | deeltjescanvas | canvas 2D, eigen code | middel |
| 10 | `vloeibaar` | Vloeibaar | vervormende titel | WebGL-shader, eigen code | middel |

### 1. Neon Jungle

Bijna zwart canvas, felgroene randbelichting. Achter de hero draait het 3D-aapje traag rond en
kantelt het naar de muis. Kleinere apenkoppen drijven tussen de secties door op verschillende
dieptes.

Techniek: `three.js` als afhankelijkheid, self-hosted zodat de CSP hem doorlaat, met `GLTFLoader` en
`MeshoptDecoder`. Het model laadt pas als het canvas in beeld komt (`IntersectionObserver`) en de
renderlus stopt zodra het canvas uit beeld is of het tabblad naar de achtergrond gaat.

Terugval zonder GLB: een apenkop opgebouwd uit primitieven in code. Terugval bij reduced motion of
zonder WebGL: het stilstaande beeld.

### 2. Maanlicht

De aangeleverde PNG vult het scherm: het aapje met koptelefoon aan de laptop, blauw avondlicht,
schermen met code erachter. Daarover een traag inzoomend kader, een maan die langzaam opkomt, een
lichtwaas die over het beeld trekt en een halftransparante glaskaart met de hero-tekst.

Techniek: puur CSS met `@keyframes`, geen script. Het originele idee was een videoloop; die is
vervangen door dit beeld omdat het dezelfde scène toont voor een twintigste van het gewicht. In de
markup blijft een `<video>`-slot staan die gebruikt wordt zodra `maanlicht.mp4` bestaat, zodat een
echte loop later niets hoeft te breken.

### 3. Bento-cockpit

De enige variant die de hero herbouwt. Een raster van tegels van ongelijke grootte: een grote tegel
met de hero-tekst, een tegel waarin een prompt zich uittypt, een tegel met het 3D-aapje, een tegel
met het maanlichtbeeld, een tegel met een oplopend getal en een tegel met de drie treden als
miniatuur. De tegels komen na elkaar in beeld.

Dit is de enige variant die 1 en 2 combineert. Ook de duurste: hij draagt three.js én het beeld.

### 4. Terminal

Mono-font over de hele pagina, fosforgroen op zwart, een fijne scanline-waas, een zachte gloed rond
de letters. De h1 typt zich uit met een knipperende cursor. Sectiekoppen krijgen een `$`-prompt, de
Ladder wordt een lijst met uitvoerregels, de Services-kaarten worden vensters met een titelbalk.

Techniek: alles CSS behalve het typemachine-effect. Nul externe bestanden.

### 5. Aurora

Traag bewegend kleurverloop over de achtergrond, van brandgroen naar teal naar violet, met zware
blur. Kaarten in matglas met een dunne lichtrand. Grotere displaytypografie dan de rest.

Techniek: drie tot vier absoluut geplaatste vlakken met `filter: blur()` en een lange
`@keyframes`-lus. Geen canvas.

### 6. Spotlight

Zwarte pagina. Een lichtbundel rond de cursor onthult de inhoud; wat buiten de bundel valt blijft
gedempt maar leesbaar. Kaarten krijgen een randverloop dat naar de cursor wijst.

Techniek: twee CSS-variabelen die met de muis meebewegen, afgeknepen tot één update per frame met
`requestAnimationFrame`, zoals de scrollknop in `BackToTop.astro`. Op een aanraakscherm wordt de
bundel een vaste gloed rond het midden van het scherm.

### 7. De klimmende aap

De Ladder-sectie wordt plakkerig: terwijl je scrolt klimt een aapje van trede naar trede en wisselt
de tekst per trede. De hero blijft rustig, want dit is een scrollverhaal en geen openingstruc.

Techniek: scroll-gestuurde animaties in CSS (`animation-timeline: view()`), met `position: sticky`
als basis zodat de sectie ook zonder die ondersteuning bruikbaar blijft. Het aapje is de silhouetvorm
uit het logo, in code getekend.

### 8. Brutalist

Enorme letters die tot tegen de rand lopen en mogen afsnijden, harde vlakken in groen, zwart en
crème, geen afronding, harde verschoven schaduwen, dikke zwarte kaders. Een tekstband die horizontaal
langsschuift tussen de secties. Het aapje staat er groot en hard uitgesneden bij.

Techniek: pure CSS. `--radius` gaat op nul, `--shadow` wordt een harde offset zonder blur.

### 9. Neuraal netwerk

Een puntennetwerk op de achtergrond dat op muis en scroll reageert. In de hero trekken de punten
even samen tot de vorm van een apenkop en vallen daarna weer uiteen.

Techniek: canvas 2D, eigen code, ongeveer 4 kB. Het aantal punten schaalt met de schermbreedte en
staat uit onder 768 px.

### 10. Vloeibaar

Een shader die de hero-titel en het logo vervormt als water waar je met de muis doorheen gaat, met
korrel over de hele pagina.

Techniek: WebGL rechtstreeks, geen three.js. Eén full-screen quad met een fragment shader die een
tekstuur van de titel verschuift. Zonder WebGL blijft de gewone titel staan.

## Media

De aangeleverde bestanden:

| Bestand | Wat het is |
|---|---|
| `public/media/monkai.png` | 1254x1254, 2,0 MB. Aapje met koptelefoon aan een laptop, blauw avondlicht, schermen met code. |
| `public/media/monkai.glb` | 30,6 MB. Eén mesh, 499.758 driehoeken, één PNG-textuur van 14,5 MB, geen animatie. Blender-export op volle resolutie. |

Beide blijven staan zoals ze zijn. Er komen geoptimaliseerde webversies naast in
`public/media/superpowers/`:

| Doelbestand | Bron | Bewerking | Budget |
|---|---|---|---|
| `monkai.webp` | `monkai.png` | sharp, kwaliteit 82 | onder 250 kB |
| `monkai-640.webp` | `monkai.png` | sharp, 640 px breed | onder 80 kB |
| `monkai-web.glb` | `monkai.glb` | gltf-transform | onder 3 MB |

De GLB gaat door `gltf-transform optimize` met vereenvoudiging naar ongeveer 50.000 driehoeken, de
textuur naar WebP op maximaal 2048 px, en meshopt-compressie. De precieze vlaggen worden ingesteld
tot het budget gehaald is zonder dat het model op hero-afstand zichtbaar slechter oogt; dat is een
visuele controle, geen getal.

Beide gereedschappen draaien via `npx`, eenmalig, buiten de build. De uitvoerbestanden worden
gecommit. De build hangt dus niet af van sharp of gltf-transform.

Nieuwe afhankelijkheid in `package.json`: `three`, alleen voor variant 1 en 3. Als geen van beide de
keuze wint, gaat die er weer uit.

### Gewichtsbudget

- De galerij `/kickass` blijft onder 400 kB.
- Geen enkele variantpagina komt boven 3,5 MB totaal.
- Het zware werk (3D-model, groot beeld) laadt pas bij het in beeld komen, nooit blokkerend.

## Toegankelijkheid en terugval

- `prefers-reduced-motion: reduce` schakelt in elke variant alle beweging uit. Wat overblijft is de
  kleur, de typografie en de stilstaande beelden.
- Geen enkele variant mag de tekst onleesbaar maken. Contrast van bodytekst en koppen wordt
  nagerekend zoals bij dark mode, met dezelfde ondergrens van 4,5:1.
- Onder 768 px vallen het 3D-canvas, de deeltjes en de shader weg. De stijl blijft, het theater niet.
- Zonder WebGL of zonder JavaScript blijft elke pagina leesbaar: de lagen zijn versiering, de inhoud
  staat in de HTML.
- De spotlight en de vloeibare variant hangen aan een muis. Op een aanraakscherm krijgen ze een vaste
  in plaats van een volgende positie.

## Verborgen houden

- `<meta name="robots" content="noindex, follow">` op de galerij en op elke variant.
- Het sitemapfilter in `astro.config.mjs` sluit `/kickass` uit.
- Geen link vanuit de site. `robots.txt` wordt bewust niet aangepast: een `Disallow: /kickass` zou het
  pad juist bekendmaken (zelfde redenering als bij `/inspiratie`).

## Testplan

1. `npm run build` slaagt en levert elf nieuwe pagina's op (de galerij plus tien varianten).
2. De gebouwde HTML van elke variant bevat `data-kickass` met de juiste slug en de noindex-meta.
3. De gebouwde HTML van een variant bevat geen CSS of script van een andere variant.
4. `/kickass` staat niet in `dist/sitemap-0.xml`.
5. Elke variant wordt in de browser bekeken op 1440 px en op 390 px, en gescreenshot voor de
   vergelijking.
6. Elke variant wordt bekeken met `prefers-reduced-motion: reduce` aan.
7. De consolelog van elke variant is leeg: geen 404 op media, geen scriptfout.
8. De bestandsgroottes van de geoptimaliseerde media worden gemeten tegen de budgetten hierboven.

## Open punten

- Welke variant wint. Dat is de hele bedoeling van deze ronde.
- Of de winnaar de hele homepage overneemt of alleen de hero. Pas te beslissen als er een winnaar is.
- Of er later toch een echte videoloop komt voor Maanlicht. Het slot blijft ervoor open.
- Wat er met de galerij gebeurt na de keuze: laten staan als naslag of verwijderen.
