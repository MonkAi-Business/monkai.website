# MonkAi Monkey mode design

## Doel

De homepage krijgt naast Licht en Donker een derde desktopstand: Monkey mode. In die stand wordt de volledige homepage één scrollgestuurde, fotorealistische filmervaring. Alle huidige onderwerpen blijven inhoudelijk aanwezig, maar verschijnen als echte HTML boven op de film.

Licht en Donker houden de bestaande gewone homepage. Monkey mode gebruikt de kleuren van dark mode en vervangt alleen op de homepage de gewone secties door de filmervaring.

## Themastand

- De geldige standen worden `light`, `dark` en `monkey`.
- De Monkey-knop gebruikt het bestaande MonkAi-favicon als pictogram.
- De keuze wordt bewaard in `localStorage`, zoals Licht en Donker vandaag.
- Op andere pagina's gebruikt Monkey mode de dark-modekleuren zonder speciale filmweergave.
- Op schermen tot en met 768 pixels wordt de Monkey-knop niet getoond.
- Een eerder bewaarde Monkey-keuze valt op mobiel terug op Donker.
- Mobiel laadt geen poster, MP4 of WebM van de film.
- `prefers-reduced-motion: reduce` laat de Monkey-knop staan op desktop, maar toont na selectie een statische dark-modeversie met alle hoofdstukken zonder scrollscrubbing.

## Eén masterfilm uit losse scènes

De website gebruikt één stille masterfilm. Die wordt reproduceerbaar samengesteld uit afzonderlijke Veo 3.1-clips. Elke scène kan daardoor apart opnieuw gegenereerd, ingekort of vervangen worden zonder de rest opnieuw te maken.

De masterfilm:

- bevat geen audiotrack;
- bevat geen gegenereerde tekst;
- gebruikt korte, gecontroleerde overgangen;
- krijgt regelmatige keyframes voor snel vooruit en achteruit scrubben;
- wordt geleverd als MP4 en WebM;
- wordt pas geladen wanneer Monkey mode op desktop actief is.

## Hoofdstukken en inhoud

Monkey mode dekt alle inhoudelijke secties van de gewone homepage.

1. **Hero**
   - AI zonder apenstreken.
   - Rustig en veilig starten met AI.
   - Inspiratiesessie, sparring in kleine groepen en begeleiding op locatie.

2. **Waar zit de monkey business?**
   - Kopiëren en plakken.
   - Kennis in mailboxen.
   - Stiekem experimenteren.

3. **Overdracht als doel**
   - Mijn doel is dat je mij niet meer nodig hebt.
   - Ik geef een kickstart, draag over en blijf niet plakken.

4. **Drie niveaus**
   - Automatiseren.
   - Onthouden met een second brain en collective brain.
   - Versnellen met accelerated coding.

5. **De aanpak**
   - Inspireren.
   - Kiezen.
   - Experimenteren.
   - Verankeren.

6. **Use cases uit de praktijk**
   - Offertes.
   - Facturen.
   - Interne kennis.
   - Klantmails.
   - Rapporten.
   - Onboarding.

7. **Diensten**
   - AI-inspiratiesessie.
   - Use case workshop.
   - AI-geletterdheid en AI-maturiteit.
   - AI-governance en EU AI Act.
   - Claude voor kenniswerkers.
   - Claude voor developers.
   - Microsoft 365 Copilot.
   - Het juiste model kiezen.
   - Raad van advies.

8. **AI is breder dan chat**
   - Augmented reality.
   - Smart glasses.
   - Computer vision.
   - Connected worker.

9. **AI-geletterdheid en EU AI Act**
   - De verplichting voor KMO's.
   - Begrijpen wat AI doet.
   - Een plan per rol en verantwoordelijkheid.

10. **Onze afspraak**
    - Wat MonkAi meebrengt.
    - Wat de klant meebrengt.
    - Minstens één interne trekker.

11. **Blog**
    - Praktijkinzichten.
    - De nieuwste artikels.
    - Link naar het volledige blogoverzicht.

12. **Het team**
    - Stijn als AI-adoptiecoach.
    - Rechtstreeks samenwerken.
    - Het team groeit.

13. **Veelgestelde vragen**
    - Alle huidige vragen en antwoorden blijven als echte uitklapbare HTML beschikbaar.

14. **Contact**
    - De grappige botsing tegen de boom.
    - Het aapje toont een contactkaartje.
    - Het echte Netlify-contactformulier blijft volledig bruikbaar.

## Bestaande clips

De zeven huidige clips blijven bruikbaar:

1. Aapje werkt aan de laptop.
2. Aapje bekijkt de visuele flow op de laptop.
3. Aapje sluit de laptop en opent de deur.
4. Aapje kijkt uit over de jungle.
5. Aapje slingert aan een liaan.
6. Aapje komt bij een platform met tafel en stoelen.
7. Aapje steekt de touwbrug over en bereikt de symbolen van de aanpak.

Deze clips dragen de hero, het vertrekpunt, de overdracht, de overgang naar de bredere wereld, het team en de aanpak.

## Nog te genereren clips

Er zijn negen bijkomende scènes nodig. Elke scène wordt als aparte Veo 3.1-clip gemaakt en later in de masterfilm gemonteerd.

1. **Drie niveaus**
   - Het aapje klimt via drie steeds hogere houten platformen.
   - Elk platform heeft een ander herkenbaar object: tandwiel, kennisboek en code-interface.

2. **Use cases**
   - Een junglewerkplaats met zes compacte stations voor offerte, factuur, kennis, e-mail, rapport en onboarding.

3. **Diensten**
   - Een grote modulaire gereedschapswand in een boomhut.
   - Het aapje kiest doelbewust verschillende instrumenten voor verschillende opdrachten.

4. **Breder dan chat**
   - Het aapje gebruikt smart glasses.
   - Een camera controleert objecten.
   - Een transparante interface verschijnt bij een machine.
   - Verbonden apparatuur geeft visuele signalen.

5. **AI Act**
   - Een veilig junglecheckpoint met relingen, controlesymbolen en duidelijke verantwoordelijkheden.
   - Geen leesbare tekst in beeld.

6. **Onze afspraak**
   - Twee apen leggen elk hun eigen gereedschap op tafel.
   - Ze bekijken samen een plan en geven elkaar een hand.

7. **Blog**
   - Het aapje schrijft aan een houten bureau.
   - Afgewerkte pagina's worden ordelijk aan een kennisboom gehangen.

8. **FAQ**
   - Nieuwsgierige apen verzamelen rond vraagtekenvormige lianen en openen houten informatiekleppen.

9. **Contact**
   - Het aapje slingert iets te enthousiast weg, botst zacht tegen een boom, herpakt zich en toont met een glimlach een blanco contactkaartje.
   - De kaart blijft blanco omdat alle tekst in HTML wordt geplaatst.

## Scroll- en leesgedrag

- Elke inhoudelijke sectie wordt een hoofdstuk met een eigen scrollbereik.
- De film beweegt tijdens de overgang naar het hoofdstuk.
- Rond belangrijke eindframes wordt de videotijd tijdelijk vastgehouden, zodat de bezoeker de HTML rustig kan lezen.
- Diensten en use cases krijgen meerdere tekststops binnen hun scène.
- De FAQ-scène bevriest terwijl de echte `<details>`-elementen gebruikt worden.
- De contactscène eindigt op het kaartje. Dat frame blijft staan terwijl het formulier wordt ingevuld.
- Navigatielinks zoals Aanpak, Diensten, Team en Contact springen in Monkey mode naar het overeenkomstige filmhoofdstuk.

## Gedeelde inhoud

De inhoud van Licht, Donker en Monkey mode mag niet uit elkaar groeien. Herbruikbare lijsten zoals diensten, aanpakstappen, use cases en FAQ's worden naar gedeelde gegevensbestanden verplaatst. De gewone componenten en Monkey mode lezen dezelfde gegevens.

## Toegankelijkheid en SEO

- De gewone homepage blijft de standaard gerenderde inhoud voor Licht en Donker.
- Alleen de actieve homepagevariant is zichtbaar en bereikbaar voor toetsenbord en schermlezer.
- Monkey-overlays gebruiken semantische koppen, paragrafen, links, lijsten, FAQ's en het echte contactformulier.
- De film is decoratief en verborgen voor schermlezers.
- De film heeft geen native controls en is altijd gedempt.
- Zonder JavaScript blijft de gewone homepage zichtbaar.

## Testcriteria

- De switch toont op desktop Licht, Donker en het MonkAi-favicon.
- De switch toont op mobiel alleen Licht en Donker.
- Monkey mode gebruikt de dark-modekleuren.
- Monkey mode wordt bewaard en hersteld op desktop.
- Een bewaarde Monkey-keuze wordt op mobiel Donker.
- De film wordt niet aangevraagd in Licht, Donker of op mobiel.
- Elk van de veertien hoofdstukken is aanwezig.
- Alle huidige use cases, diensten, aanpakstappen en FAQ's zijn aanwezig.
- De navigatielinks landen in het juiste hoofdstuk.
- Het FAQ-gedeelte en contactformulier blijven bruikbaar.
- MP4 en WebM bevatten geen audio.
- De volledige Astro-productiebuild slaagt.
