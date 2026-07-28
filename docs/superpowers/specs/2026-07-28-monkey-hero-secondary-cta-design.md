# Monkey hero secondary CTA design

## Probleem

De link `Bekijk de aanpak` staat naast de groene hoofdactie in het eerste
Monkey Mode-paneel. De losse onderstreping en afwijkende hoogte maken de
actierij visueel onrustig.

## Gekozen ontwerp

- `Laten we praten` blijft de groene hoofdactie.
- `Bekijk de aanpak` wordt een transparante outline-knop.
- Beide acties krijgen dezelfde hoogte en verticale uitlijning.
- De secundaire knop gebruikt een subtiele lichtgroene rand en transparante
  achtergrond.
- De secundaire knop heeft geen onderstreping.
- Hover versterkt de rand en voegt een lichte transparante achtergrond toe.
- Toetsenbordfocus blijft duidelijk zichtbaar.
- Beide acties gebruiken een handcursor.

## Implementatie

De bestaande link en bestemming blijven behouden. Alleen de hero-specifieke
presentatie binnen `.monkey-actions` verandert. Andere `.monkey-link`-links in
de scrollstory behouden hun huidige tekstlinkstijl.

## Controle

- Een contracttest controleert de hero-specifieke klasse.
- Een desktopbrowsercontrole vergelijkt hoogte en verticale positie van beide
  acties.
- De focusstijl, hoverstijl en handcursor worden visueel en via de berekende
  CSS gecontroleerd.

## Buiten scope

- Geen wijziging aan de tekst of bestemming.
- Geen wijziging aan andere links in de scrollstory.
- Geen wijziging aan de groene hoofdknop.
