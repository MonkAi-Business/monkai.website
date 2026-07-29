# Monkey theme icon design

## Probleem

De Monkey Mode-knop gebruikt `favicon.svg` als afbeelding. Dat bestand bevat
een afgeronde lichte achtergrondtegel. In de donkere themaschakelaar oogt die
tegel als een los wit vlak en wijkt het icoon af van het aapje in het
MonkAi-logo.

## Gekozen ontwerp

- Het aapje uit `Logo.astro` wordt een herbruikbare SVG-component.
- `Logo.astro` en `ThemeToggle.astro` gebruiken exact dezelfde component.
- De themaschakelaar toont alleen het aapje, zonder achtergrondtegel.
- De kleuren volgen de huidige tekst-, achtergrond- en accentkleuren.
- Het icoon blijft decoratief omdat de knop al een toegankelijke naam heeft.
- De afmetingen blijven compact en verstoren de bestaande knopgroep niet.

## Implementatie

Een nieuwe `MonkeyMark.astro` bevat alleen de SVG-markering. De component
aanvaardt afmetingen en drie kleurwaarden voor de buitenvorm, ooraccenten en
uitsparingen. `Logo.astro` levert dezelfde bestaande merkkleuren door.
`ThemeToggle.astro` gebruikt `currentColor` voor de vorm, het groene accent
voor de oren en de knopachtergrond voor de uitsparingen.

De externe favicon blijft ongewijzigd voor browsertabbladen en bookmarks.

## Controle

- Een contracttest controleert dat de themaschakelaar geen faviconafbeelding
  meer rendert.
- Een contracttest controleert dat logo en themaschakelaar `MonkeyMark`
  gebruiken.
- De desktopbrowsercontrole bekijkt de drie themastanden en de actieve
  Monkey Mode-knop.

## Buiten scope

- Geen nieuw favicon.
- Geen wijziging aan de vorm van het MonkAi-aapje.
- Geen wijziging aan de mobiele themaschakelaar.
