# Monkey buffer loader

## Doel

Monkey Mode krijgt een rustige laadervaring die zichtbaar maakt dat de videomaster wordt gebufferd, zonder bezoekers te laten wachten tot de volledige film van ongeveer 80 MB binnen is.

## Gedrag

- De loader verschijnt alleen op desktop en alleen wanneer Monkey Mode actief wordt.
- Een gestileerde, opkrullende apenstaart toont de echte gebufferde voortgang van de video.
- Het percentage wordt berekend uit het verste gebufferde videopunt ten opzichte van de totale speelduur.
- De openingsscène blijft zichtbaar als poster terwijl de eerste seconden worden geladen.
- Zodra voldoende van de eerste scène beschikbaar is en de browser de video kan afspelen, verdwijnt de loader vloeiend.
- De rest van de videomaster blijft daarna op de achtergrond laden.
- De autoplayknop is tijdens de eerste laadfase uitgeschakeld en wordt daarna beschikbaar.
- Bij een laadfout verdwijnt de loader met een korte, begrijpelijke melding; de gewone website blijft bruikbaar.
- Bij `prefers-reduced-motion` vult de staart zonder draaiende of pulserende animatie.

## Vormgeving

De loader is een kleine transparante badge boven het openingsbeeld, in de bestaande donkergroene Monkey Mode-stijl. Een eenvoudige SVG-lijn vormt een krullende staart. De zichtbare lijnlengte groeit mee met de buffer en wordt aangevuld met een klein percentage. De loader domineert de pagina niet en verdwijnt zodra de eerste scène veilig kan starten.

## Techniek

Een afzonderlijke bufferfunctie leest `video.buffered`, `video.duration`, `readyState`, `progress`, `canplay` en foutstatus. De UI krijgt uitsluitend afgeleide statuswaarden. De bestaande lazy-loading blijft behouden: buiten Monkey Mode worden geen videobestanden geladen.

De eerste scène geldt als klaar wanneer de buffer minimaal de eerste acht seconden omvat en de video ten minste `HAVE_FUTURE_DATA` rapporteert. Dit voorkomt dat alleen metadata de loader al laat verdwijnen.

## Verificatie

- Contracttest voor de loader-markup, foutstatus en uitgeschakelde autoplayknop.
- Unittest voor bufferpercentage en de grens van acht seconden.
- Productiebuild en bestaande Monkey Mode-tests.
- Browsercontrole dat de loader verschijnt, echte voortgang toont, verdwijnt bij een speelbare eerste scène en autoplay daarna normaal werkt.
