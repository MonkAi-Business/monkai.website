# Lokale transition editor

## Doel

De Monkey Mode-masterfilm bestaat uit losse Veo-clips. Aan sommige
scènegrenzen herhalen bewegingen zich of ontstaan zichtbare sprongen. De lokale
transition editor maakt het mogelijk om per grens het eindpunt van de eerste
clip en het startpunt van de tweede clip visueel te kiezen en onmiddellijk als
doorlopende knip te beoordelen.

De editor is uitsluitend een ontwikkelhulpmiddel in de repository. Hij wordt
niet opgenomen in de publieke Astro-build.

## Gebruikerservaring

De editor start via één npm-commando en opent als lokale webpagina.

De pagina bevat:

- een keuzelijst met alle opeenvolgende scènegrenzen uit
  `scripts/monkey-scenes.json`;
- een videospeler voor clip 1 met een instelbaar eindpunt;
- een videospeler voor clip 2 met een instelbaar startpunt;
- frameknoppen om de actieve speler één videoframe vooruit of achteruit te
  bewegen;
- een grote preview die de laatste seconden van clip 1 en de eerste seconden
  van clip 2 zonder overlap na elkaar afspeelt;
- een herhaalstand zodat dezelfde overgang automatisch opnieuw begint;
- knoppen voor `Opslaan` en `Reset`.

De gekozen tijden worden duidelijk in seconden weergegeven. De originele
videobestanden blijven altijd ongewijzigd.

## Opslagmodel

Elke scène in `scripts/monkey-scenes.json` kan twee optionele velden krijgen:

- `trimStart`: het eerste bruikbare tijdstip van de scène, standaard `0`;
- `trimEnd`: het laatste bruikbare tijdstip van de scène, standaard de bestaande
  `duration`.

Bij een grens tussen scène A en scène B bewaart de editor het gekozen eindpunt
als `trimEnd` van A en het gekozen beginpunt als `trimStart` van B. `Reset`
verwijdert de expliciete waarden voor de geselecteerde grens en herstelt de
standaarden.

Opslaan gebeurt alleen na een expliciete gebruikersactie. De server valideert
dat:

- alle waarden eindige, niet-negatieve getallen zijn;
- `trimStart` kleiner is dan `trimEnd`;
- de tijden binnen de beschikbare duur van de betreffende scène vallen;
- alleen scènes uit het bestaande manifest gewijzigd worden.

## Lokale architectuur

Een klein Node-script in `scripts/` levert de editor en de bronvideo’s lokaal
aan. Het script leest het manifest en gebruikt standaard
`C:\Users\stijn\Downloads` als bronmap, gelijk aan de bestaande
masterfilm-builder. Een optionele commandoregelparameter kan een andere bronmap
instellen.

De browserinterface staat als statische bestanden in een aparte
ontwikkelmap. Een minimale lokale API levert:

- de lijst met scènes en hun effectieve knippunten;
- de geselecteerde videobestanden;
- een gecontroleerde schrijfoperatie voor de knippunten.

De server bindt alleen aan `127.0.0.1`. Paden buiten de ingestelde bronmap en
schrijfoperaties buiten `scripts/monkey-scenes.json` worden geweigerd.

## Integratie met de masterfilm

`scripts/build-scroll-story.ps1` gebruikt de effectieve knippunten bij het
FFmpeg-`trim`-filter. De bruikbare duur van een scène wordt
`trimEnd - trimStart`.

De bestaande overgangsduur blijft voorlopig apart beheerd. De editor beoordeelt
eerst een harde, niet-overlappende knip; zo kunnen herhaalde bewegingen worden
verwijderd zonder dat een crossfade dubbele beelden maskeert. Het uiteindelijke
overgangstype wordt in een volgende, afzonderlijke stap per scènegrens gekozen.

Na het opslaan bouwt de editor de masterfilm niet automatisch opnieuw. Dit
voorkomt onverwacht lange encodes. De pagina toont wel het bestaande
buildcommando dat daarna uitgevoerd kan worden.

## Foutafhandeling

De editor toont een duidelijke melding wanneer:

- een bronclip ontbreekt;
- een manifestwaarde ongeldig is;
- opslaan mislukt;
- een browser de gekozen video niet kan afspelen.

Een mislukte schrijfoperatie laat het oorspronkelijke manifest intact. Schrijven
gebeurt via een tijdelijk bestand dat pas na succesvolle validatie het manifest
vervangt.

## Teststrategie

Geautomatiseerde tests controleren:

- berekening van effectieve begin-, eind- en speelduur;
- validatie van geldige en ongeldige knippunten;
- veilige mapping van scène-id naar bronbestand;
- aanpassing van uitsluitend de geselecteerde manifestvelden;
- gebruik van `trimStart` en `trimEnd` door de masterfilm-builder;
- aanwezigheid van het lokale npm-commando zonder opname van de editor in de
  publieke Astro-routes.

Daarnaast wordt de tool lokaal getest met minstens de overgang van `desk` naar
`laptop`, omdat daar de dubbele hoofdpositie zichtbaar was.

## Buiten scope

Deze eerste versie bevat geen volledige montagetijdlijn, effectenbibliotheek,
audio-editor, uploadfunctie of automatische AI-analyse. De editor publiceert
niets en wijzigt geen originele video.
