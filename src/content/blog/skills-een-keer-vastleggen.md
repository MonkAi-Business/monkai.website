---
title: "Skills: leg het werk één keer vast, gebruik het overal"
date: 2026-10-09
description: "Een prompt gebruik je één keer. Een skill leg je één keer vast en hergebruik je overal - en het is geen Claude-truc: ChatGPT en Copilot hebben het intussen ook."
tags: ["agents", "automatisatie", "claude", "chatgpt", "copilot"]
image: "/media/blog/skills.svg"
imageAlt: "Een centraal skill-blok dat vanuit meerdere kanten wordt opgeroepen en hergebruikt"
draft: true
---

Elke ochtend dezelfde klus. Een stapel PDF's die binnenkomt - facturen, offertes, attesten - en telkens hetzelfde ritueel: openen, kijken wat het juist is, en hernoemen volgens je eigen logica. Leverancier, datum, type, in de volgorde die je ooit met jezelf hebt afgesproken. Het is geen moeilijk werk. Het is gewoon werk dat elke dag terugkomt, altijd op dezelfde manier.

Dat soort werk is precies waar een skill voor bestaat.

## Wat een skill wél is (en niet)

Een skill is een afgebakend stukje werk dat je één keer beschrijft - hoe het hoort te gaan - en dat je AI daarna telkens identiek uitvoert. Voor die PDF's leg je één keer vast: kijk in het document wat het is, haal de leverancier en de datum eruit, en hernoem het bestand volgens dit patroon. Vanaf dan roep je die skill op wanneer je hem nodig hebt, en krijg je elke keer hetzelfde resultaat. Van overal, zonder het werk opnieuw uit te leggen.

Belangrijk is vooral wat een skill níet is. Het is geen prompt die je één keer intikt en daarna kwijt bent. Het is ook niet je prompt-bibliotheek - een lijst met teksten die je nog altijd zelf moet kopiëren en aanpassen. En het is geen custom agent of chatbot met een karakter. Dat laatste verschil onthou je het makkelijkst zo: een [expert-collega](/blog/expert-collega-je-eigen-ai-agent) is een *wie* - een AI die je inricht met een rol, een toon en wat vaste kennis. Een skill is een *hoe* - één taak, één manier van werken. Een expert-collega kan skills gebruiken, zoals een goede medewerker een handeling beheerst, maar de skill zelf is kleiner en staat op zichzelf: klaar om overal opgeroepen te worden.

Waarom is dit dan AI, en niet gewoon een macro of een scriptje? Omdat de PDF zelf elke dag anders is. De ene factuur ziet er niet uit als de andere, de datum staat niet altijd op dezelfde plaats, de ene leverancier noemt het een creditnota en de andere een terugbetaling. Een klassiek script breekt daarop. De AI leest het document, begrijpt wat er staat, en past jouw afspraak toe - ook op een bestand dat hij nog nooit exact zo gezien heeft. Je legt de manier van werken vast, niet elke uitzondering apart.

Dat is meteen de scheidslijn met gewone automatisatie. Het ophalen, verplaatsen en wegschrijven van die bestanden is logistiek en hoort thuis in een automatiseringsplatform. Het beoordelen is werk voor een model. Hoe je die twee aan elkaar knoopt, en hoe ze elkaar zelfs kunnen oproepen, staat in [n8n: laat je automatisatie en je AI met elkaar praten](/blog/n8n-automatisatie-en-ai).

## Je hoeft niet te kunnen programmeren

Een skill maken is geen ontwikkelwerk. In de kern is het opschrijven hoe een taak hoort te verlopen, in gewone taal, alsof je een nieuwe collega inwerkt. Wie kan uitleggen hoe iets moet gebeuren, kan een skill maken.

Het kan zelfs zonder tikwerk. Bij Claude kan je een skill opnemen in [Cowork](/blog/chat-cowork-code-welke-claude-wanneer): je doet de taak één keer voor terwijl je scherm meeloopt, je vertelt er ondertussen bij waarom je bepaalde keuzes maakt, en de AI stelt op basis daarvan een skill voor die je nog kan nakijken en bijsturen. Die opname-functie is nog nieuw en werkt voorlopig alleen op Mac. Op Windows beschrijf je de skill gewoon zelf, wat evengoed werkt.

## Niet één tool: skills worden een standaard

Skills zijn geen Claude-truc. In 2026 hebben de drie grote AI-assistenten er allemaal een versie van. Anthropic bracht Skills uit voor Claude. OpenAI lanceerde Skills in ChatGPT, uitdrukkelijk als opvolger van de custom GPT's. En Microsoft bouwde ze in Copilot Cowork, met net hetzelfde mapformaat als Claude - een mapje dat je in OneDrive zet en dat je AI voortaan kent.

Dat maakt dit meer dan een functie van één product. De manier waarop je een terugkerende taak vastlegt, begint op elkaar te lijken over de tools heen. Wat je bij de ene leert, neem je mee naar de andere. De precieze beschikbaarheid verschilt wel per tool en per abonnement, dus kijk even na wat jouw versie ondersteunt. Voor een Belgisch bedrijf zit er bij Copilot nog een addertje onder het gras: Copilot Cowork draait op Claude-modellen buiten de EU Data Boundary en staat voor Europese tenants standaard uit, dus daar komt het er niet vanzelf bij. Over dat prijs- en beschikbaarheidsverhaal schreef ik apart, in [Copilot Cowork: handig, maar geen fan van pay-as-you-go](/blog/copilot-cowork-pay-as-you-go).

## Advanced: skills die je aan elkaar koppelt

De echte kracht komt wanneer je skills aan elkaar rijgt. Elke skill blijft dan één duidelijk stukje werk, maar de uitkomst van de ene wordt de invoer van de volgende.

Neem een consultancy die een business-analyse doet. Dat is niet één taak, het zijn er verschillende na elkaar. De intake - vragen stellen, context verzamelen - is een skill. Bepalen wat er moet gebeuren en dat in een [plan](/blog/plan-mode-eerst-denken-dan-doen) gieten is een tweede skill. Een derde skill, de orchestrator, neemt dat plan en verdeelt het werk over meerdere subagents. En elke subagent heeft zijn eigen specialiteit: de ene kijkt naar de cijfers, de andere naar de processen, een derde naar de risico's. Elk met zijn eigen skill.

<img src="/media/blog/skills-orchestrator.svg" alt="Een keten van skills: intake gaat naar plan, plan naar de orchestrator, en de orchestrator verdeelt het werk over drie subagents met elk hun specialiteit: cijfers, processen en risico's" style="width:100%;height:auto;margin:8px 0 28px;" />

Zo bouw je met kleine, begrijpelijke onderdelen een werkwijze die anders in het hoofd van één ervaren consultant zou zitten. Je ziet bij elke stap wat er gebeurt, je kan elk onderdeel apart verbeteren, en je krijgt elke keer dezelfde grondige aanpak - niet een resultaat dat afhangt van wie er die dag toevallig aan werkt.

## Begin met één taak

Je hoeft niet meteen een keten van skills te bouwen. Begin met dat ene klusje dat elke dag terugkomt en altijd hetzelfde verloopt: de PDF's, een vast soort verslag, een offerte volgens jouw structuur. Leg het één keer goed vast, en laat het werk voortaan op dezelfde manier gebeuren.

Zo bekeken is een skill een stuk van je [collective brain](/blog/collective-brain-bedrijfsgeheugen): kennis die niet langer in één hoofd zit, maar vastligt op een plek waar ze hergebruikt kan worden. Wie al begon met vastleggen in een [second brain](/blog/second-brain-een-map), zet met skills de volgende stap. Het verschil is dat de AI die kennis niet alleen bewaart of leest - hij voert ze uit.
