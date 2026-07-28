# Monkey mode scroll timing

## Probleem

Elke videoclip speelt momenteel volledig af tijdens de eerste 85 procent van het bijbehorende scrollhoofdstuk. Het laatste frame blijft daarna nog 15 procent van het hoofdstuk staan. In combinatie met de korte crossfade voelt dit als een stilstand of een kleine herhaling.

## Gekozen gedrag

- De videoclip gebruikt 100 procent van elk hoofdstuk om van `timeStart` naar `timeEnd` te bewegen.
- Er is geen afzonderlijke stilstand op het eindframe.
- De videotijd blijft strikt oplopend wanneer een hoofdstukgrens wordt gepasseerd.
- De bestaande crossfades in de masterfilm veranderen niet.
- De bestaande paneelanimaties veranderen niet.
- De hoofdstuktimings en de lengte van de masterfilm veranderen niet.
- Contact blijft het laatste FAQ-frame vasthouden zolang de contactclip ontbreekt.

## Implementatie

De pure functie `progressToTime` in `src/utils/scrollStoryTiming.mjs` vertaalt de volledige lokale hoofdstukvoortgang rechtstreeks naar videotijd. De eerdere bewegingsgrens van `0.85` verdwijnt.

## Controle

- Een contracttest controleert de videotijd bij 42, 85 en 100 procent lokale voortgang.
- De test controleert dat de videotijd aan een hoofdstukgrens nooit terugloopt.
- De bestaande Monkey mode contracttests en Astro-build moeten slagen.
- In een desktopbrowser wordt gecontroleerd dat de video tijdens het volledige hoofdstuk blijft bewegen.

## Buiten scope

- De bronclips opnieuw monteren.
- De duur van de crossfades aanpassen.
- De hoeveelheid scrollruimte per hoofdstuk wijzigen.
- Paneelposities, transparantie of inhoud wijzigen.
