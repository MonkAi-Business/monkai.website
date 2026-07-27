---
name: blogpost
description: Gebruik dit bij elke blogpost voor monkai.business - een nieuwe post schrijven, een bestaande draft vrijgeven op vrijdag, een post herschrijven naar de huisstijl, of de LinkedIn-post erbij maken. Legt Stijns tone of voice, de vaste structuur en de vrijdagroutine vast.
---

# Een blogpost schrijven voor MonkAi

Deze blog is van één persoon: Stijn De Ketelaere. Dat moet je kunnen horen. Elke post
begint met iets wat hij zelf heeft meegemaakt, en eindigt met iets wat de lezer maandag
kan doen. Daartussen zit geen essay en geen productcatalogus.

## Eerst dit: welke van de twee doe je?

**A. Een nieuwe post schrijven** → volg "Nieuwe post" hieronder.

**B. Een bestaande draft vrijgeven (de vrijdagroutine)** → volg "Vrijdagroutine" hieronder.
Er staan 15 posts op `draft: true` die één per vrijdag vrijkomen. Ze zijn geschreven
vóór deze stijl bestond, dus vrijgeven betekent altijd óók herschrijven.

Weet je niet welke van de twee? Vraag het.

## De harde regel: geen post zonder anekdote

<EXTREMELY-IMPORTANT>
Begin NOOIT met schrijven voor je Stijn om zijn anekdote hebt gevraagd. Niet
"ik schrijf alvast iets en jij past aan". Vragen, wachten, dan pas schrijven.
</EXTREMELY-IMPORTANT>

Stel de vraag concreet, niet open. Niet "heb je hier een verhaal bij?" maar:

> Voor de opening van deze post heb ik een moment van jou nodig. Kan je me iets vertellen
> over een keer dat je dit zag misgaan? Waar was je, wie zat er tegenover je, en wat zei
> die persoon? Drie zinnen volstaat, ik maak er de rest van.

Vraag door tot je drie dingen hebt: **een plaats, een mens, en een zin of een detail dat
blijft plakken**. Zonder die drie wordt de opening algemeen en dan valt de hele post terug
in de oude stijl.

Levert hij niets, dan schrijf je liever een post over een ander onderwerp dan een post met
een verzonnen opening. Verzin geen klantverhalen.

## De structuur

600 tot 800 woorden. Dat is ongeveer 4 minuten lezen. Drie tot vier `##`-koppen, nooit een
kop boven de openingsalinea's.

1. **Haak** (1 tot 2 alinea's, ik-vorm). Het moment zelf. Plaats, mens, wat er misging of
   opviel. Meteen erin, geen aanloop. De eerste zin mag kort en concreet zijn.
2. **Herkenning** (1 alinea, je-vorm). Waarom dit bij de lezer ook speelt. Hier draai je
   van "ik" naar "jij". Eén alinea, niet meer.
3. **Wat het echt kost** (1 tot 2 alinea's). Waar de pijn zit, in gewone woorden. Tijd,
   geld, risico, of iemand die vertrekt met alle kennis in zijn hoofd.
4. **Hoe AI dit oplost** (2 tot 3 alinea's). Concreet. Tool bij naam als het relevant is,
   maar geen opsomming van vijf producten. Wat je erin stopt, wat eruit komt.
5. **Wat je maandag doet** (1 alinea, geen kop nodig als het kort is). Eén eerste stap die
   in een halfuur past. Geen stappenplan van zeven punten.

Sluit af met de mogelijkheid om te reageren of te mailen als dat natuurlijk past. Forceer
geen call to action.

## De toon

**Ik vertel, jij wordt aangesproken.** Ik-vorm voor het verhaal, je-vorm voor de lezer.
Nooit "wij zien bij klanten": dat klinkt als een bureau met dertig man.

**Titel: prikkelend maar waarmakend.** De titel kondigt een spanning aan die de post ook
echt oplost. Wat wel en niet werkt staat in `references/voorbeelden.md` - lees dat bestand
voor je een titel bedenkt.

**Onderzoek: hooguit één ankerpunt.** De fact-check-regel uit `CLAUDE.md` blijft
onverkort gelden: je verifieert alles wat je beweert bij primaire bronnen. Maar je zet
niet al dat bewijs in de tekst. Eén ankerpunt per post, in gewone taal:

- Goed: "Onderzoekers lieten ervaren developers met en zonder AI werken. Met AI waren ze
  trager, terwijl ze zelf dachten dat ze sneller gingen."
- Fout: "Uit METR-onderzoek (juli 2025) bleek dat 16 developers over 246 taken 19% trager
  werkten, terwijl ze vooraf 24% winst verwachtten."

De cijfers en bronnen zet je onderaan in het gesprek, niet in de post. Vraagt iemand
ernaar, dan heb je ze.

**Huisstijl uit `CLAUDE.md` blijft gelden.** Geen em-dash of en-dash, altijd een gewone
hyphen. Geen "in het huidige landschap", geen "bovendien" om de zin op gang te trekken,
geen rijtjes van drie omdat drie lekker klinkt. Nederlands, Vlaams register, direct.

**Zinsbouw.** Wissel lang en kort af. Een korte zin na een lange doet het werk van een
uitroepteken. Gebruik geen uitroeptekens.

## De frontmatter

```yaml
---
title: "De prikkelende titel"
date: 2026-08-07
description: "Eén of twee zinnen. Dit staat in de lijst en in de zoekresultaten, dus laat het de haak herhalen, niet de conclusie verklappen."
tags: ["ai-adoptie", "kennis"]
image: "/media/blog/<slug>.svg"
imageAlt: "Korte beschrijving van het beeld"
draft: true
---
```

Tags komen uit de vaste set van tien, altijd kleine letters: `ai-adoptie`, `governance`,
`productiviteit`, `kennis`, `agents`, `automatisatie`, `claude`, `chatgpt`, `copilot`,
`gemini`. Twee tot drie voor een themapost. Een tooltag alleen als de post echt iets
uitlegt wat je in dát product doet. Voeg geen nieuwe tag toe zonder het te vragen: elke
tag is een extra knop op `/blog`.

Geen veld voor de leestijd. Die wordt berekend uit de tekst
(`src/utils/readingTime.ts`) en verschijnt vanzelf op de detailpagina en in de lijst.

## De cover

Hand-getekende SVG in `public/media/blog/<slug>.svg`, 1200x800 (3:2). Het motief hoort in
de centrale band, want de afbeelding wordt bijgesneden naar 2:1 op de detailpagina en 16:9
in de lijst.

Brandkleuren hardcoderen in de SVG, want een via `<img>` geladen SVG leest `tokens.css`
niet: achtergrond `#F4F2EC`, kaart `#FBFAF6`, rand `#D9DACE`, inkt `#24261F`, groen
`#4C5F3B`, lichtgroen `#8FA478`, gedempt `#656A5C`. Gebruik een web-veilige font-stack
(`system-ui, 'Segoe UI', Arial, sans-serif`), want webfonts erven ook niet.

Controleer hem visueel: raster de SVG met `sharp` naar PNG in de scratchpad en lees die
terug als afbeelding. Dat gaat sneller dan een browsersessie.

Zet nooit een inline `<svg>` in de markdown van een post. Remark leest die ingesprongen
regels als een codeblok en de tekst lekt als platte tekst. Wil je een diagram in de post,
maak er een los `.svg`-bestand van en verwijs met `<img style="width:100%;height:auto">`.

## De LinkedIn-post

Elke post krijgt er een. Schrijf hem in `content/linkedin/<slug>.md`. Die map staat
bewust buiten `src/`, dus Astro bouwt er niets mee.

```markdown
---
slug: <slug>
title: "De titel van het artikel"
url: https://monkai.business/blog/<slug>
date: 2026-08-07
---

De tekst zelf.
```

Vorm:

- 150 tot 250 woorden.
- **De eerste twee zinnen dragen alles.** LinkedIn kapt af na ongeveer drie regels, en wat
  daarna komt ziet alleen wie op "meer" klikt. Zet daar dus de haak, niet de aankondiging.
  Nooit openen met "Nieuwe blogpost online!".
- Zelfde verhaal als de blog, iets persoonlijker. Het is geen samenvatting van het artikel,
  het is dezelfde anekdote met een andere landing.
- Korte regels, veel witruimte, één gedachte per regel of per paar regels.
- Afsluiten met een vraag aan de lezer, dan de link.
- Hashtags: `#AI` staat altijd. Daarnaast wat bij het onderwerp past, aantal vrij.
  Bijvoorbeeld `#KMO`, `#governance`, `#automatisatie`, `#inspecties`.

## Nieuwe post

1. Lees `src/content/blog/` opnieuw. **Vlak voor je begint**, niet uit het geheugen. Er
   draaien vaak parallelle sessies en er zijn al posts dubbel geschreven.
2. Check of het onderwerp niet al ergens in staat. Overlapt het deels, link er dan naar in
   plaats van het te herhalen.
3. Vraag Stijn zijn anekdote. Wacht.
4. Verifieer elke feitelijke claim bij een primaire bron (vendor docs, wettekst, de site
   van het product zelf). Geen cijfers uit het geheugen, geen SEO-blogs als bron.
5. Schrijf de post volgens de structuur hierboven.
6. Maak de cover en controleer hem visueel.
7. Schrijf de LinkedIn-post.
8. `npm run build` en lees de output. Een `[glob-loader] Duplicate id`-waarschuwing net na
   een nieuwe post is een stale cache, geen echt duplicaat.
9. Lees `src/content/blog/` **nog eens** en check of er intussen iets bijkwam waar je naar
   moet linken.
10. Zet de post in de tabel van `docs/blog-publicatieplan.md`, op de eerstvolgende vrije
    vrijdag of tussenin waar hij past.

Nieuwe posts staan standaard op `draft: true`. Ze gaan pas live via de vrijdagroutine.

## Vrijdagroutine

Dit is wat er elke vrijdag gebeurt om één draft vrij te geven. De volgorde en de datums
staan in `docs/blog-publicatieplan.md`. Lees dat bestand eerst.

1. **Lees de post die aan de beurt is** en toon Stijn kort waar hij over gaat.
2. **Vraag zijn anekdote** voor de opening. Wacht op zijn antwoord.
3. **Herschrijf de post** naar de structuur en de toon hierboven. Concreet betekent dat
   meestal:
   - Nieuwe titel, prikkelend in plaats van beschrijvend.
   - Nieuwe opening: het verhaal ervoor, de definitie eruit.
   - Cijfers en onderzoeksdetails terugbrengen tot hooguit één ankerpunt.
   - Inkorten tot 600 à 800 woorden.
   - Een slot dat zegt wat je maandag doet.
   - De `description` herschrijven zodat ze bij de nieuwe titel past.
4. **Check de feiten opnieuw.** Deze posts zijn geschreven in juli 2026. Producten,
   prijzen en wetgeving schuiven op. Verifieer alles wat gedateerd kan zijn voor het live
   gaat.
5. **Check de interne links.** Een link naar een post die nog op `draft: true` staat, geeft
   een 404, want `getStaticPaths` filtert drafts weg. Draai
   `grep -o '(/blog/[a-z0-9-]*)' src/content/blog/<slug>.md` en vergelijk met wat al live
   staat. Wijst er een link vooruit, haal dan de linkopmaak weg en laat de zin staan.
6. **Zet `draft: false` en `date` op de vrijdag van publicatie.** Vergeet de datum niet,
   anders zakt de post tussen de oudere stukken.
7. **Schrijf de LinkedIn-post** in `content/linkedin/<slug>.md`.
8. **`npm run build`** en controleer dat de post gebouwd wordt en de leestijd klopt.
9. **Commit en push naar `main`.** Netlify herbouwt automatisch. Push alleen als Stijn het
   gelezen heeft.
10. **Werk `docs/blog-publicatieplan.md` bij**: zet de post op live en noteer de datum.

## Nalezen voor je oplevert

Loop dit af en zeg per punt wat je vond. Niet "ziet er goed uit".

- [ ] Staat er in de eerste twee zinnen een plaats of een mens, geen definitie?
- [ ] Is het verhaal in de opening echt van Stijn, en niet door mij verzonnen?
- [ ] Slaat de tekst ergens om van "ik" naar "jij", en blijft dat daarna consequent?
- [ ] Tussen 600 en 800 woorden?
- [ ] Hooguit één onderzoeksankerpunt, en staat dat in gewone taal?
- [ ] Eindigt de post met één ding dat je maandag kan doen?
- [ ] Maakt de titel waar wat hij belooft?
- [ ] Geen enkele em-dash of en-dash in de tekst?
- [ ] Is elke feitelijke claim bij een primaire bron gecheckt?
- [ ] Wijst geen enkele interne link naar een post die nog op draft staat?
- [ ] Is er een LinkedIn-post, en dragen de eerste twee zinnen daarvan?
