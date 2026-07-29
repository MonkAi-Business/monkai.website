# Vloeiende Monkey-scrollstory

## Probleem

De live pagina zelf blijft responsief, maar de huidige WebM-master heeft slechts om de 24 frames een sleutelbeeld. Tijdens scroll-scrubbing blijft het zichtbare videoframe daardoor geregeld staan en springt het daarna 0,4 tot 1,2 seconde vooruit. De huidige autoplay versterkt dit: hij scrolt de pagina, waarna dezelfde seek-logica de video telkens opnieuw moet positioneren.

## Gekozen oplossing

We combineren twee gerichte verbeteringen:

1. **Autoplay gebruikt normale videoweergave.** Tijdens de Monkey-tour speelt de video sequentieel af. De huidige videotijd wordt naar scrollpositie vertaald, zodat tekstpanelen en pagina de vloeiende video volgen. Autoplay veroorzaakt daardoor geen herhaalde seeks meer.
2. **Handmatig scrollen gebruikt een scrubvriendelijke master.** MP4/H.264 wordt de voorkeursbron en beide masters krijgen maximaal drie frames tussen sleutelbeelden. Bij 24 fps ligt er daardoor hoogstens 125 ms tussen twee sleutelbeelden, tegenover één seconde vandaag.

## Gedrag

- Handmatig scrollen pauzeert normale videoweergave en gebruikt de bestaande scroll-naar-tijdmapping.
- De playknop start vanaf de huidige positie, behalve aan het einde; daar herstart de tour aan het begin.
- Tijdens autoplay bepaalt de video de voortgang. De pagina scrollt naar de omgekeerde tijdmapping zonder zelf nieuwe videoseeks te veroorzaken.
- Handmatig wiel-, touch-, pointer- of toetsenbordgebruik stopt autoplay onmiddellijk en laat de video op het huidige frame staan.
- Aan het einde stopt autoplay exact op het bestaande contacteindpunt.
- Reduced motion en de mobiele fallback blijven ongewijzigd.

## Componenten

- `src/utils/scrollStoryTiming.mjs`: krijgt de inverse mapping `timeToProgress`.
- `src/utils/scrollStoryAutoplay.mjs`: blijft verantwoordelijk voor knopstatus en het herkennen van gebruikersinteracties; de bestaande afstandsgedreven autoplayberekening vervalt.
- `src/components/ScrollStory.astro`: schakelt tijdens autoplay tussen sequentiële playback en handmatige seek-scrubbing.
- `scripts/build-scroll-story.ps1`: encodeert MP4 en WebM met een GOP van drie frames.
- `src/components/ScrollStory.astro`: biedt MP4 vóór WebM aan.

## Laden en fouten

- De video blijft alleen op desktop en alleen in Monkey Mode geladen worden.
- Als `video.play()` wordt geweigerd of mislukt, stopt autoplay netjes en blijft handmatig scrubben beschikbaar.
- Bronwissel of metadata mag geen tijdelijke terugkeer naar een ouder frame veroorzaken.

## Verificatie

- Unit tests bewaken de heen- en terugmapping tussen scrollprogressie en videotijd.
- Statische controles bewaken MP4 als eerste bron en GOP 3 voor beide encoders.
- Een autoplay-regressietest bewaakt dat de autoplayroute normale playback gebruikt en de seekroute tijdens autoplay overslaat.
- Alle bestaande transitie-, Monkey Mode- en scrollstorytests blijven slagen.
- De productiebuild wordt lokaal gecontroleerd.
- In de browser worden handmatig scrollen en autoplay afzonderlijk gemeten; autoplay mag geen voortdurende seeks meer produceren en handmatige videosprongen moeten duidelijk kleiner zijn dan bij de huidige GOP 24-master.

## Buiten scope

- Geen wijzigingen aan knippunten, hoofdstukcopy, paneelposities of de mobiele ervaring.
- Geen beeldsequentie, canvasrenderer of opgesplitste cliparchitectuur.
