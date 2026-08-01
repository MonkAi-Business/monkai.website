---
title: "AI-tokens worden niet eeuwig gesponsord"
date: 2026-11-13
description: "Je betaalt vandaag 20 tot 30 dollar per gebruiker per maand voor AI die veel meer kost om te draaien. Wat gebeurt er met je factuur als die rekening wél doorgerekend wordt, en hoe zorg je dat je kan wisselen?"
tags: ["ai-adoptie", "governance"]
image: "/media/blog/ai-tokens-niet-eeuwig-gesponsord.svg"
imageAlt: "Een vlakke prijslijn die plots omhoog springt, met een tweede pad dat vlak blijft doorlopen"
draft: true
---

Vraag een zaakvoerder wat AI zijn bedrijf kost en je krijgt een licentieprijs terug. Twintig dollar per gebruiker voor ChatGPT of Claude, dertig voor Microsoft 365 Copilot. Overzichtelijk, voorspelbaar, en makkelijk te verdedigen tegenover de boekhouder. Precies daarom is het een gevaarlijk getal om je planning op te bouwen. Die prijs zegt vandaag weinig over wat je gebruik werkelijk kost om te draaien.

## Wat je betaalt en wat het kost

SemiAnalysis kocht in juni 2026 alle abonnementen van OpenAI en Anthropic op en gebruikte ze een maand lang zo hard mogelijk: lange agent-taken, non-stop code. Daarna rekenden ze uit wat diezelfde belasting via de API zou gekost hebben. Een volledig uitgemolken ChatGPT Pro-abonnement van 200 dollar kwam uit op ongeveer 14.000 dollar aan compute per maand. Claude Max zat rond de 8.000. Voor de gewone abonnementen van 20 dollar liep de schatting in de honderden.

Zo hard gebruikt bijna niemand zijn abonnement, en dat is net het punt: het model werkt omdat de meeste mensen ver onder hun limiet blijven. De zware gebruikers worden betaald door de lichte, en het verschil dat overblijft wordt voorlopig door de aanbieders zelf gedragen. OpenAI koerst dit jaar af op miljardenverliezen. Anthropic boekte in het tweede kwartaal van 2026 naar verluidt zijn eerste operationele winst, vooral doordat draaien efficiënter werd, niet doordat de prijzen stegen.

Dat laatste is belangrijke nuance. Dit is geen verhaal over een sector die morgen instort en zijn prijzen verdubbelt. Het is een verhaal over een prijsmodel dat aan het kantelen is van "een vast bedrag per stoel" naar "je betaalt wat je verbruikt". En dat kantelen is al bezig.

## Het is al aan het gebeuren

Sinds 1 juni 2026 zitten alle GitHub Copilot-abonnementen op verbruiksfacturatie. Elk plan bevat nog een maandelijkse hoeveelheid tegoed, maar wat je daarboven verbruikt wordt afgerekend per token, aan de tarieven van het model dat je aanspreekt. Eén AI-credit is één dollarcent. Verschillende andere codeertools gingen in de twaalf maanden daarvoor dezelfde weg op, soms zo abrupt dat er publiek excuses en terugbetalingen aan te pas kwamen.

Bij Microsoft zie je hetzelfde patroon naast de licentie staan. Microsoft 365 Copilot blijft 30 dollar per gebruiker per maand, maar zodra je met agents begint te werken in Copilot Studio, ga je over op verbruik: Copilot Credits, aan een cent per credit als je pas achteraf betaalt, of 200 dollar voor een pak van 25.000 credits per maand. Wat één taak kost, hangt af van het model, hoeveel bedrijfscontext hij ophaalt, hoeveel tools hij aanroept en hoe lang hij draait.

Google koos een derde weg: Gemini werd in de Workspace-abonnementen ingebouwd en de basisprijs ging omhoog, van 12 naar 14 dollar voor Business Standard. Wie voordien de losse AI-module nam, werd goedkoper af. Ook dat is een manier om de rekening te spreiden.

## Waarom dat snel over duizenden gaat

Zolang AI betekent "iemand stelt een vraag in een chatvenster", valt het verbruik best mee. Een gesprek is een paar duizend tokens. Het kantelpunt is de agent: een opdracht die zelfstandig documenten inleest, tools aanroept, tussenstappen zet en pas na een paar minuten terugkomt met resultaat. Dan gaan er geen duizenden tokens door, maar honderdduizenden.

Een rekenvoorbeeld met echte lijstprijzen. Neem een agent die per opdracht 200.000 tokens aan documenten en instructies inleest en 15.000 tokens antwoord teruggeeft. Op een middenmodel als Claude Sonnet 5, dat vanaf september 2026 op 3 dollar per miljoen invoertokens en 15 dollar per miljoen uitvoertokens staat, kost dat ongeveer 0,83 dollar. Eén opdracht. Laat tien medewerkers zoiets vier keer per dag doen, twintig werkdagen lang, en je zit aan 800 opdrachten en zo'n 660 dollar per maand. Zet hetzelfde op het zwaarste model, aan 5 en 25 dollar per miljoen, en het wordt ruim 1.100 dollar. Bij vijfentwintig mensen, of bij zwaardere dossiers, praat je over enkele duizenden per maand.

Diezelfde tien mensen kosten je vandaag 300 dollar aan Copilot-licenties, ongeacht hoe hard ze het gebruiken. Dat is het gat waar je op moet letten. Niet omdat iemand je morgen een factuur van 3.000 dollar stuurt, maar omdat de rem die vandaag in je licentie zit, in het verbruiksmodel bij jou komt te liggen.

## En toch wordt het per token goedkoper

Er is een tegenbeweging die je niet mag negeren. Onderzoek van Epoch AI laat zien dat de prijs voor eenzelfde prestatieniveau spectaculair daalt: afhankelijk van de taak met een factor negen tot een factor negenhonderd per jaar. Wat vorig jaar het topmodel nodig had, draait vandaag op een klein model aan een fractie van de prijs.

Je factuur daalt daar alleen niet van, want ondertussen groeit het verbruik per taak nog sneller. Redeneermodellen denken langer na, agents lezen meer context in, en werk dat vorig jaar één vraag was, is dit jaar een keten van twintig stappen. De eenheidsprijs zakt, het volume stijgt harder. Wie enkel op de eerste beweging rekent, komt bedrogen uit.

## Wat je nu al kan doen

Vier dingen, van makkelijk naar structureel.

**Meet voor je moet.** Je kan vandaag al zien wie wat verbruikt, in de admincentra van Microsoft, Google of GitHub, en in de consoles van de AI-aanbieders zelf. Zet uitgavenlimieten waar het kan. Een verbruiksmodel zonder plafond is de klassieke manier om verrast te worden.

**Zet niet alles op het zwaarste model.** Het verschil tussen een klein en een groot model is bij Anthropic een factor vijf, en voor routinewerk zoals samenvatten, herformuleren of classificeren merkt je medewerker het verschil niet. Wie zelf bouwt, haalt daarbovenop nog veel weg met caching van vaste context en met batchverwerking voor werk dat niet dringend is.

**Hou de waarde aan jouw kant.** Het duurzame bezit is niet je abonnement, het zijn je prompts, je procesbeschrijvingen, je documenten en de manier waarop je mensen werken. Bewaar dat in je eigen omgeving, niet enkel in de geschiedenis van één chatvenster. Dan is van model wisselen een technische ingreep en geen herstart.

**Zorg dat wisselen kan.** Voor wie zelf ontwikkelt: veel aanbieders spreken dezelfde API-taal, en er bestaan tussenlagen die het model achter je toepassing verwisselbaar maken. Voor koppelingen met je eigen systemen is MCP ondertussen een open standaard die door meerdere aanbieders ondersteund wordt. En er zijn open modellen als achtervang: Mistral publiceert een deel van zijn modellen met open gewichten, naast Llama en Qwen. Kijk wel per model naar de licentie, want die verschilt en niet elke open publicatie mag zomaar commercieel gedraaid worden. Zelf draaien is niet gratis - je ruilt een factuur per token voor hardware en beheer - maar de prijs ligt vast en kan niet eenzijdig verdubbeld worden.

Je hoeft daarvoor geen tweede leverancier in productie te zetten. Het volstaat dat je weet welk werk je waar draait, wat het per maand kost, en welk alternatief je zou nemen als de prijs morgen anders ligt. Dat is een namiddag denkwerk, geen migratieproject.

De vraag is niet of het prijsmodel verandert. Dat is al bezig. De vraag is of jouw bedrijf op dat moment een keuze heeft, of gewoon de nieuwe factuur krijgt.
