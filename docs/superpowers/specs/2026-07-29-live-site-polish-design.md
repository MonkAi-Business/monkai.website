# Live site polish

## Doel

Vier bevindingen uit de live validatie oplossen zonder de opbouw, timing of media van Monkey Mode te veranderen.

## Wijzigingen

1. De dode link “Lees meer over AI-geletterdheid” verwijst naar het bestaande artikel `/blog/eu-ai-act-kmo`.
2. De foutieve zin “thuis prutst ik” wordt vervangen door “thuis experimenteer ik nog altijd met Raspberry Pi's en IoT.”
3. Het dienstenpaneel in Monkey Mode blijft links over de vrije videoruimte staan, maar wordt compacter en verticaal gecentreerd zodat de negen diensten bij directe navigatie op een gangbaar desktopvenster volledig leesbaar zijn.
4. De cookiemelding blijft juridisch gelijkwaardig en toegankelijk, maar wordt smaller, compacter en iets transparanter zodat ze minder van het openingsbeeld bedekt.

## Randvoorwaarden

- Geen wijzigingen aan de scrolltiming, videobestanden of mobiele Monkey Mode-fallback.
- Weigeren en accepteren blijven even prominent en even makkelijk.
- De twee bestaande, ongetrackte mediabestanden blijven onaangeroerd.
- Alle bestaande controles en de Astro-productiebouw moeten slagen.

## Verificatie

- De statische Monkey Mode-controle bewaakt link, tekst en dienstenlayout.
- Een aanvullende controle bewaakt de compacte cookiemelding.
- De volledige testsuite en productiebuild worden uitgevoerd.
- De homepage wordt lokaal visueel gecontroleerd op desktopformaat.
