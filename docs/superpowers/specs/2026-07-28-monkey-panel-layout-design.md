# Monkey mode panel layout

## Doel

De HTML-panelen moeten de inhoud leesbaar houden zonder het aapje of de belangrijkste handeling in de film te bedekken. De indeling blijft uitsluitend voor Monkey mode op desktop. Alle bestaande onderwerpen en links blijven aanwezig.

## Ontwerpkeuze

Elke scène krijgt een expliciete veilige positie in plaats van de huidige eenvoudige afwisseling tussen links en rechts. De positionering bestaat uit drie onafhankelijke eigenschappen:

- horizontale zijde: links of rechts;
- verticale positie: boven, midden of onder;
- formaat: compact, normaal of breed.

De donkere videolaag volgt de zijde van het actieve paneel. Daardoor blijft de tekst leesbaar zonder de volledige film donkerder te maken.

## Visuele stijl

- De paneelachtergrond gaat van `rgba(3, 13, 19, 0.78)` naar ongeveer `rgba(3, 13, 19, 0.64)`.
- De achtergrondvervaging wordt iets sterker zodat tekst leesbaar blijft ondanks de hogere transparantie.
- De rand en schaduw worden subtieler.
- Grote panelen worden smaller waar dat zonder inhoudsverlies kan.
- De hero wordt merkbaar smaller zodat het aapje en de laptop zichtbaar blijven.
- De aanpak behoudt de vier stappen, maar gebruikt een compactere 2x2-indeling met kleinere tussenruimte en typografie.

## Scène-indeling

| Hoofdstuk | Positie | Formaat | Reden |
| --- | --- | --- | --- |
| Hero | links, midden | normaal | Het aapje blijft rechts zichtbaar. |
| Het vertrekpunt | links, midden | normaal | Het gezicht en de koptelefoon staan rechts. |
| Overdracht | links, midden | compact | Het aapje beweegt rechts van de deur naar het balkon. |
| Het team | links, midden | compact | De lege junglezone bevindt zich links en het hoofd blijft ook aan het begin van de scène vrij. |
| De aanpak | rechts, midden | compact | Het paneel bedekt bewust het minder geslaagde deel van de animatie terwijl de voortgangsbalk vrij blijft. |
| Drie niveaus | rechts, midden | compact | Het klimtraject en het aapje blijven centraal en links zichtbaar. |
| Use cases | links, onder | compact | Het aapje en de werkbank blijven rechts en centraal zichtbaar. |
| Diensten | links, onder | breed | De keuzehandeling rechts blijft vrij en alle negen diensten passen binnen het beeld. |
| Breder dan chat | rechts, onder | compact | De apparatuur links en het hoofd van het aapje blijven zichtbaar. |
| AI Act | links, onder | compact | Het controlepunt en de beweging blijven grotendeels vrij. |
| Onze afspraak | links, boven | compact | De handdruk en de tafel blijven centraal zichtbaar. |
| Blog | links, onder | compact | Het schrijvende aapje rechts blijft vrij. |
| FAQ | links, boven | compact | De groep apen en de visuele luikjes blijven centraal zichtbaar. |
| Contact | te bepalen bij de laatste clip | compact | De veilige zone hangt af van het uiteindelijke contactbeeld. |

## Gedrag

- De bestaande scroll-scrubbing en hoofdstuktiming veranderen niet.
- Alleen het actieve hoofdstuk bepaalt de paneelpositie en de richting van de donkere videolaag.
- De bestaande desktopgrens voor Monkey mode blijft behouden.
- Bij smallere desktopvensters worden panelen automatisch smaller en schuiven ze niet over de voortgangsindicator.
- De reduced-motion-weergave behoudt dezelfde paneelposities zonder animatie.

## Controle

- De contracttests controleren dat elk gereed hoofdstuk een expliciete positie en formaat heeft.
- De Astro-build moet slagen.
- Elk hoofdstuk wordt in de browser op een desktopviewport gecontroleerd.
- Bij de visuele controle moeten het gezicht, de koptelefoon en de kernhandeling van de scène herkenbaar blijven.
- Tekst, links, focusstijlen en contrast blijven bruikbaar.

## Buiten scope

- De film zelf opnieuw genereren of monteren.
- Monkey mode op mobiel activeren.
- Inhoud verwijderen om panelen kleiner te maken.
- De nog ontbrekende contactclip ontwerpen.
