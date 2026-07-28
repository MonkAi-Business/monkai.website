# MonkAi scrollstory design

## Doel

De homepage opent met een fotorealistische junglewereld die de bezoeker met de scroll bestuurt. De film toont niet alleen sfeer, maar brengt de bestaande boodschap van MonkAi Business in een herkenbaar verhaal: rustig starten, begrijpen wat er gebeurt, samen experimenteren en een aanpak kiezen die blijft werken.

## Gekozen verhaal

De zeven geselecteerde clips vormen een doorlopende reis:

1. Het aapje werkt geconcentreerd aan zijn laptop.
2. De camera toont het visuele netwerk op het laptopscherm.
3. Het aapje klapt de laptop dicht en opent de deur.
4. De werkplek blijkt een boomhut boven de jungle.
5. Het aapje slingert naar een volgend platform.
6. Het landt bij een tafel met lege stoelen, als verwijzing naar samenwerking en een groeiend team.
7. Het steekt de touwbrug over en komt uit bij vier voorwerpen die de aanpak verbeelden.

De film bevat geen gegenereerde tekst. Alle leesbare inhoud blijft echte HTML boven op de video.

## Inhoudelijke stops

- Start: "AI zonder apenstreken." met de bestaande intro en CTA's.
- Laptop: "Van losse ideeën naar een werkbare flow."
- Deur: "Klein beginnen. Herhalen. Beheersen."
- Jungle: "AI is breder dan chat."
- Platform: "Je hoeft dit niet alleen uit te zoeken."
- Brug: "Een aanpak die blijft staan." met de vier stappen Inspireren, Kiezen, Experimenteren en Verankeren.

De overlays verschijnen geleidelijk rond herkenbare rustpunten, maar de film blijft tijdens het scrubben het hoofdbeeld.

## Interactie

- Op desktop staat de video in een sticky vlak terwijl de pagina over ongeveer zeven schermhoogtes scrolt.
- Scrollpositie wordt met `requestAnimationFrame` omgezet naar `video.currentTime`.
- De scrubber gebruikt een korte interpolatie zodat traag scrollen niet schokkerig voelt.
- De film is altijd gedempt, speelt niet automatisch met geluid en toont geen native videobediening.
- Onder de scrollstory loopt de bestaande homepage verder.

## Media

- De bronclips worden samengevoegd tot één master zonder audiotrack.
- Clip 5 wordt licht ingekort om het mondartefact op het einde te verwijderen.
- Overgangen blijven kort. Alleen de overgang van binnen naar buiten krijgt een iets langere blend omdat het felle zonlicht daar als natuurlijke wipe werkt.
- De MP4 krijgt `faststart` en regelmatige keyframes voor snel zoeken.
- Een WebM-versie dient als efficiënte eerste bron voor browsers die ze ondersteunen.
- Een posterbeeld voorkomt een leeg vlak voor de video klaar is.

## Responsiviteit en toegankelijkheid

- Onder 769 pixels valt de component terug op de gewone statische hero. De zware video wordt daar niet als bron aangeboden.
- Bij `prefers-reduced-motion: reduce` wordt dezelfde statische hero getoond en verdwijnt de lange scrollruimte.
- De video is decoratief en daarom verborgen voor schermlezers.
- Alle teksten en links blijven in de documentstructuur aanwezig.
- De CTA's houden hun bestaande analytics-event.

## Afbakening

- Geen nieuwe animatiebibliotheek.
- Geen wijziging aan de secties na de hero.
- Geen serverlogica of externe videohosting.
- Geen automatische muziek of geluidseffecten.
