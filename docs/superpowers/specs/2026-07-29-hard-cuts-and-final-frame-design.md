# Harde knippen en definitief eindframe

## Doel

De scrollfilm moet exact dezelfde overgangen tonen als de lokale montagetool. Het laatste beeld moet de aap met open ogen en het contactkaartje tonen, terwijl het contactformulier links gecentreerd blijft staan.

## Gekozen montage

- Alle vijftien scèneovergangen worden harde knippen.
- De opgeslagen `trimStart`- en `trimEnd`-waarden blijven de enige knippunten.
- De builder legt geen crossfade of andere overlap meer over die punten.
- De contactclip eindigt op bronpositie `7.60` seconden. Op dit stabiele frame zijn het kaartje en beide open ogen duidelijk zichtbaar.

## Scrollpositie

Het bestaande automatische eindpunt blijft de bovenkant van het contacthoofdstuk. Daar vult het contacthoofdstuk precies één viewport en staat het paneel links verticaal gecentreerd. Het laatste videoframe wordt aan dezelfde maximale scrollpositie gekoppeld en blijft daardoor staan.

## Technische aanpassing

De masterbuilder concateneert de reeds getrimde videodelen zonder tijdsoverlap. De hoofdstuktijden worden opnieuw afgeleid van de effectieve cliplengtes en lopen aaneensluitend tot het nieuwe filmeinde. MP4 en WebM worden opnieuw opgebouwd zonder audio.

## Controle

- Het buildplan bevat alle zestien clips en geen `xfade`.
- De overgangstool blijft alle vijftien harde knippen aanbieden.
- De uiteindelijke MP4 en WebM hebben dezelfde duur en 24 fps.
- Steekproefframes rond meerdere grenzen bevatten geen dubbelbeeld.
- Het laatste frame toont de aap met open ogen en het kaartje.
- De contactsectie staat op de bestaande gecentreerde eindpositie.
- De scrollstorycontroles, montagetests en Astro-productiebuild slagen.

## Buiten scope

De inhoud en positie van andere HTML-panelen veranderen niet. Er worden geen extra overgangstypes aan de montagetool toegevoegd.
