# Monkey mode scroll timing

## Probleem

Elke videoclip speelt momenteel volledig af tijdens de eerste 42 procent van het bijbehorende scrollhoofdstuk. Het laatste frame blijft daarna 58 procent van het hoofdstuk staan. Daardoor voelt de overgang traag, hoewel de gemonteerde crossfades zelf maar 0,18 tot 0,45 seconde duren.

## Gekozen gedrag

- De videoclip gebruikt de eerste 85 procent van elk hoofdstuk om van `timeStart` naar `timeEnd` te bewegen.
- De laatste 15 procent houdt het eindframe kort vast zodat de bezoeker de HTML-inhoud kan aflezen.
- De bestaande crossfades in de masterfilm veranderen niet.
- De bestaande paneelanimaties veranderen niet.
- De hoofdstuktimings en de lengte van de masterfilm veranderen niet.
- Contact blijft het laatste FAQ-frame vasthouden zolang de contactclip ontbreekt.

## Implementatie

De functie `progressToTime` in `src/components/ScrollStory.astro` blijft verantwoordelijk voor de vertaling van lokale hoofdstukvoortgang naar videotijd. Alleen de grens voor bewegende voortgang verandert van `0.42` naar `0.85`.

## Controle

- Een contracttest controleert dat 42 procent lokale voortgang nog niet het einde van de clip bereikt.
- De test controleert dat 85 procent en 100 procent beide het eindframe opleveren.
- De bestaande Monkey mode contracttests en Astro-build moeten slagen.
- In een desktopbrowser wordt gecontroleerd dat de video tijdens het grootste deel van ieder hoofdstuk blijft bewegen en alleen aan het einde kort rust.

## Buiten scope

- De bronclips opnieuw monteren.
- De duur van de crossfades aanpassen.
- De hoeveelheid scrollruimte per hoofdstuk wijzigen.
- Paneelposities, transparantie of inhoud wijzigen.
