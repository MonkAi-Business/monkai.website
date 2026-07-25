# Consent-banner voor PostHog - ontwerp

Datum: 2026-07-25
Status: goedgekeurd, klaar om te bouwen

## Waarom

De meting op deze site bewaart sinds 2026-07-25 een herkenningsnummer op het toestel
van de bezoeker (`persistence: 'localStorage+cookie'`), omdat identiteit anders geen
paginanavigatie overleeft. Zie lesson #16 in `CLAUDE.md`.

Daarmee valt de meting onder de toestemmingsplicht. De Belgische GBA is daar expliciet
over: op de vraag of publieksmetingcookies toestemming nodig hebben antwoordt hun FAQ
"Ja", met als motivering dat er in de huidige wetgeving geen vrijstelling bestaat. Dat
geldt ook voor first-party cookies en voor geaggregeerde statistieken. Frankrijk en
Nederland laten onder strikte voorwaarden meer toe; België heeft die lijn niet
overgenomen.

De Digital Omnibus (voorstel van 19 november 2025) zou een vrijstelling invoeren voor
geaggregeerde publieksmeting, maar dat deel is niet aangenomen: de cookiebepalingen zijn
uit de compromistekst van de Raad van juni 2026 geschrapt en het dossier lag begin juli
2026 nog open. Er is dus vandaag geen vrijstelling om op te leunen, en zelfs als die er
komt is het niet zeker dat deze opzet eronder valt (PostHog bewaart een individuele
gebeurtenissenstroom, niet enkel aggregaten).

## Wat we bouwen

Een echte opt-in-banner. Zolang de bezoeker niets gekozen heeft, wordt PostHog niet
geladen: geen script, geen netwerkoproep, geen cookie.

### Gedrag

| Toestand | Wat de bezoeker ziet | Wat er gebeurt |
|---|---|---|
| Geen keuze | Kaartje links onderaan, site volledig bruikbaar | Niets gemeten. Kaartje blijft terugkomen tot er gekozen is. |
| Weigeren | Kaartje verdwijnt | Niets gemeten. Zes maanden niet opnieuw vragen. |
| Accepteren | Kaartje verdwijnt | Meting start in dezelfde pageload, keuze blijft bewaard. |
| Do Not Track aan | Geen kaartje | Behandeld als weigering. Wie in zijn browser al nee zei, vragen we niet opnieuw. |

Twee knoppen, gelijke grootte en gelijk visueel gewicht, één klik elk. Weigeren mag niet
weggemoffeld worden, anders is de toestemming niet vrij gegeven en dus ongeldig.

De banner blokkeert de pagina niet. Geen cookiewall.

### Componenten en grens

Twee bestanden, één interface ertussen:

- **`src/components/ConsentBanner.astro`** - weet of er een keuze is en welke. Zet
  `window.__monkaiConsent` met `get()`, `set(choice)` en `reset()`.
- **`src/components/Analytics.astro`** - weet hoe PostHog start. Zet
  `window.__monkaiAnalytics.start()` en roept die zelf aan wanneer de opgeslagen keuze al
  "granted" is. De bestaande poorten blijven eromheen staan: alleen bij
  `import.meta.env.PROD` en alleen wanneer `location.hostname` gelijk is aan de host uit
  `astro.config.mjs`.

`ConsentBanner` wordt in `BaseLayout.astro` na de `<slot />` gerenderd, dus op elke
pagina. Hij kent PostHog niet; hij roept alleen `start()` aan. `Analytics` kent de banner
niet; hij leest alleen de opgeslagen keuze.

### Opslag van de keuze

`localStorage`, sleutel `monkai_consent`, waarde `{"v":1,"choice":"granted"|"denied","ts":<epoch ms>}`.

Het onthouden van een keuze (ook van een weigering) is zelf strikt noodzakelijk om het
verzoek van de bezoeker uit te voeren, dus dat mag zonder toestemming. Geen cookie nodig:
de server hoeft de waarde niet te zien. Eén origin, want www stuurt met een 301 naar de
apex.

`v` staat er zodat een toekomstige wijziging van de betekenis oude keuzes kan negeren
in plaats van verkeerd te interpreteren.

### Herroepen

Eén knop op `/cookies`: "Wijzig je keuze". Die wist de opgeslagen keuze, zet PostHog uit
en wist zijn opslag wanneer het al liep (`opt_out_capturing()` + `reset(true)`), en
herlaadt de pagina zodat het kaartje opnieuw verschijnt. Eén control die beide richtingen
dekt in plaats van drie knoppen voor drie gevallen.

### Vormgeving

Kaartje vast links onderaan, maximaal 360px breed. Op schermen tot 768px een balk
onderaan met marge aan beide zijden. Volledig op de tokens uit `src/styles/tokens.css`
(`--card`, `--border`, `--radius`, `--ink`, `--muted`, `--green`, `--green-hover`,
`--font-sans`), geen nieuwe hex-waarden. Fade-in respecteert
`prefers-reduced-motion`. Geen dependencies.

Toegankelijkheid: `<aside role="region" aria-label="...">` in plaats van `role="dialog"`,
want het is niet modaal en de focus wordt niet gevangen. Echte `<button>`-elementen, dus
toetsenbordbediening werkt zonder extra werk.

### Valkuil om te respecteren

Het kaartje staat met het `hidden`-attribuut in de HTML en wordt alleen door JS zichtbaar
gemaakt, zodat wie al gekozen heeft geen flits ziet. Daarvoor is
`[hidden] { display: none !important; }` nodig binnen de component-stijl, anders wint de
eigen `display: flex` van het attribuut. Dat is exact lesson #11 in `CLAUDE.md`.

## Copy die mee moet

- `/privacy`: de grondslag voor de statistieken verschuift van **gerechtvaardigd belang**
  naar **toestemming**, want dat is nu letterlijk wat er gebeurt. Ook vermelden dat de
  toestemming op elk moment ingetrokken kan worden en hoe.
- `/cookies`: nieuwe korte sectie "Je keuze" met de herroepknop. De sectie "Hoe weiger of
  verwijder je dit?" wordt korter, want weigeren gaat nu via de banner.

Alle zichtbare tekst blijft Nederlands. Geen em-dashes, conform de huisstijlregel.

## Wat dit kost

Van een volledige meting van iedereen naar een zuivere meting van wie ja zegt. Reken op
ergens tussen 30 en 60 procent dekking. `contact_submitted` blijft werken maar wordt een
steekproef; voor het echte aantal aanvragen blijft de Netlify Forms-inbox de waarheid.

## Buiten scope

- Geen categorieën of granulaire toggles. Er is precies één niet-noodzakelijk doel
  (statistiek), dus twee knoppen zijn genoeg.
- Geen consent-log op de server. De site is volledig statisch en er is geen verwerking die
  een bewijslast per bezoeker rechtvaardigt.
- Geen Google Fonts-consent. Die laadt geen cookies; het IP-adres gaat wel naar Google.
  Zelf hosten lost dat beter op dan een extra vraag in de banner, en staat al als open punt
  in lesson #8.

## Verificatie

1. Verse browser op de productiesite: kaartje verschijnt, geen `ph_`-cookie, geen
   netwerkoproep naar `eu.i.posthog.com`.
2. Weigeren: kaartje weg, nog steeds geen cookie en geen oproep. Navigeren naar een andere
   pagina brengt het kaartje niet terug.
3. Accepteren: `ph_..._posthog` cookie verschijnt, oproep naar `eu.i.posthog.com` gaat uit.
   Doorklikken naar een tweede pagina: `posthog.get_session_id()` blijft gelijk.
4. `/cookies`, "Wijzig je keuze": cookie weg, kaartje terug.
5. Met DNT aan: geen kaartje, geen meting.
