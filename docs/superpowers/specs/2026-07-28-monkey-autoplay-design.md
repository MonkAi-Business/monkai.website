# Monkey Autoplay Design

## Doel

Monkey mode krijgt een compacte play- en pauzeknop waarmee een bezoeker de
volledige scrollstory automatisch en op een rustig tempo kan bekijken. De
gewone handmatige scrollbediening blijft volledig beschikbaar.

## Gekozen gedrag

- De knop staat onderaan in het midden van de vaste Monkey-stage.
- De eerste klik start vanaf de huidige positie in de scrollstory.
- Tijdens de tour verandert de knop naar een pauzestand.
- Een volgende klik pauzeert de tour op de huidige positie.
- Als de bezoeker al aan het einde staat, begint Play opnieuw bij het begin.
- De tour besteedt ongeveer acht seconden aan elk hoofdstuk.
- De beweging is continu. De tour springt niet van hoofdstuk naar hoofdstuk.
- De bestaande 85/15-verhouding voor video en leesrust blijft ongewijzigd.

## Handmatige overname

De bezoeker behoudt altijd de controle. Deze acties pauzeren een actieve tour:

- draaien aan het muiswiel;
- een aanraking op een touchapparaat;
- klikken of drukken buiten de tourknop;
- navigeren met scrolltoetsen zoals pijltjes, Page Up, Page Down, Home, End en
  spatie;
- wisselen naar een ander thema;
- verkleinen naar het mobiele breakpoint;
- activeren van reduced motion;
- het browservenster of tabblad verlaten.

Programmatic scrollbewegingen van de tour zelf mogen de tour niet pauzeren.

## Toegankelijkheid

- De knop is een echte `button` met een duidelijk toegankelijk label.
- Het label wisselt tussen `Monkey-tour afspelen` en `Monkey-tour pauzeren`.
- De visuele toestand gebruikt herkenbare play- en pauzesymbolen.
- De knop is alleen beschikbaar in Monkey mode op desktop.
- Bij `prefers-reduced-motion: reduce` wordt de knop niet aangeboden.
- De focusstijl blijft duidelijk zichtbaar.

## Architectuur

De bestaande `ScrollStory.astro` blijft verantwoordelijk voor DOM-events,
themawissels en de daadwerkelijke `window.scrollTo`-aanroepen.

Een kleine pure module berekent de volgende scrollpositie op basis van:

- huidige positie;
- verstreken tijd sinds het vorige animatieframe;
- begin en einde van de story;
- het aantal hoofdstukken;
- acht seconden per hoofdstuk.

Hierdoor kan tempo, begrenzing en het bereiken van het einde rechtstreeks
worden getest zonder een browser na te bootsen. De bestaande videotimingmodule
blijft ongewijzigd.

## Status en foutafhandeling

Autoplay kent twee toestanden: `playing` en `paused`. Er kan maximaal één
animatieframe-lus actief zijn. Stoppen annuleert het geplande frame, zet de knop
terug naar Play en laat de huidige scrollpositie ongemoeid.

Als de story geen bruikbare scrollafstand heeft, start autoplay niet. Wanneer
het einde bereikt wordt, stopt de tour automatisch en blijft de contactscene
zichtbaar. Omdat die scene nog geen eigen filmclip heeft, blijft daar zoals nu
het laatste FAQ-frame staan.

## Teststrategie

De testgestuurde implementatie dekt minstens:

- een volgende positie op basis van acht seconden per hoofdstuk;
- begrenzing aan het story-einde;
- opnieuw beginnen wanneer Play aan het einde wordt gestart;
- markup en toegankelijke labels van de knop;
- de bestaande Monkey-contractchecks en productiebuild;
- browsercontrole op 1920x1080 voor start, pauze, hervatten, handmatige
  overname en automatisch stoppen.

## Buiten scope

- Geen wijziging aan de masterfilm of clips.
- Geen autoplay op mobiel.
- Geen automatische audioweergave.
- Geen snelheidsregelaar.
- Geen opslag van de afspeelstatus tussen bezoeken.
