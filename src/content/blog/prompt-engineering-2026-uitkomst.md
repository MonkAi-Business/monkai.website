---
title: "Prompt engineering in 2026: zeg wat je wil bereiken"
date: 2026-07-26
description: "De trucs zijn minder belangrijk geworden. Wat telt is dat het doel vooraf duidelijk is, en dat je de AI expliciet toelating geeft om te vragen wat ze niet weet."
tags: ["productiviteit", "ai-adoptie"]
image: "/media/blog/prompt-engineering-2026.svg"
imageAlt: "Een vraag die naar een doelwit gaat, met een vraag die eerst terugkomt"
draft: true
---

Prompt engineering is minder belangrijk geworden. Niet omdat het niet uitmaakt wat je typt, maar omdat het gewicht verschoven is: van hoe je het vraagt naar wat je wil bereiken. Wie dat scherp heeft, heeft geen trucs meer nodig.

## De trucs zijn ingehaald

Dat is geen aanvoelen, het staat in de handleidingen van de makers zelf. OpenAI schrijft voor zijn reasoning-modellen letterlijk dat je de prompts eenvoudig en direct moet houden, dat "denk stap per stap" onnodig is omdat het model dat intern al doet, en dat je best eerst zonder voorbeelden probeert. Anthropic waarschuwt in zijn richtlijnen dat je bij de nieuwste modellen je taal juist moet afzwakken: waar je vroeger "CRITICAL: je MOET dit gebruiken" schreef om iets gedaan te krijgen, volstaat nu "gebruik dit wanneer", want anders slaat het model door de andere kant uit.

Ook het woord zelf is verhuisd. In juni 2025 stelde Shopify-CEO Tobi Lütke voor om te spreken van context engineering in plaats van prompt engineering, en Andrej Karpathy pikte dat op: niet de formulering is het werk, maar het contextvenster vullen met precies de juiste informatie voor de volgende stap. Simon Willison vatte samen waarom die naamsverandering ertoe deed: prompt engineering was in de volksmond verworden tot slimme trucjes in een chatvenster typen.

## Wat wel telt: de uitkomst

Zet de twee handleidingen naast elkaar en ze zeggen hetzelfde. OpenAI: wees heel specifiek over je einddoel en geef de parameters van een geslaagd antwoord. Anthropic: wees specifiek over de gewenste uitvoer, en leg uit waarom je iets vraagt, want dat helpt het model je doel begrijpen. In hun onderzoeksrichtlijnen staat het nog directer: bepaal vooraf wat een geslaagd antwoord is.

Dat is een andere oefening dan een prompt schrijven. Vergelijk "schrijf een professionele mail naar deze klant" met: deze klant wacht al twee weken op een antwoord, hij moet weten dat we het opnemen zonder dat we een datum beloven, hij leest weinig dus maximaal tien regels, en het mag niet klinken als een standaardmail. Dat tweede is niet beter geformuleerd. Het is beter gedacht.

De ontnuchterende kant daarvan: als je zelf niet kan zeggen wanneer het resultaat goed is, gaat geen enkele prompt dat oplossen. Dan is het model niet je probleem.

## Wie, wat, hoe, en vooral het resultaat

Een houvast helpt wel. Ik gebruik zelf nog altijd wie, wat, hoe. Wie ben je en voor wie is dit. Wat moet er gebeuren. Hoe moet het eruitzien: lengte, vorm, toon, wat er niet in mag. Maar het zwaarste blok is dat vierde: welk resultaat wil ik zien, en waaraan meet ik dat het klopt.

Gebruik dat als checklist, niet als ritueel. Anthropic geeft er een goede test bij: laat je prompt lezen door een collega die de opdracht niet kent. Als die het niet snapt, snapt de AI het ook niet. Dat is een nuchtere maatstaf, en hij heeft niets met formuleertrucs te maken.

## De regel die het meeste oplevert

Onderaan elke opdracht zet ik één zin: stel mij vragen als je niet zeker bent. Dat is de goedkoopste verbetering die er bestaat.

Zonder die zin gokt het model. Het vult je ontbrekende context zelf in, meestal plausibel, soms volledig verkeerd, en je merkt het pas als je het resultaat leest. Met die zin krijg je twee vragen terug, geef je in tien seconden antwoord, en zit de rest wel juist. Dat gedrag is stuurbaar: in Anthropics eigen richtlijnen staan voorbeeldinstructies om een model juist terughoudend te maken en bij een dubbelzinnige vraag eerst uit te zoeken en aan te raden in plaats van te doen. Jij bepaalt aan welke kant het staat.

Voor wat langer duurt, ga je een stap verder en [laat je eerst een plan maken](/blog/plan-mode-eerst-denken-dan-doen) dat je goedkeurt. Voor wat terugkeert leg je het één keer vast als een [skill](/blog/skills-een-keer-vastleggen) of een [expert-collega](/blog/expert-collega-je-eigen-ai-agent), zodat het doel en de eisen er al in zitten en je ze niet elke keer opnieuw moet uitleggen.

Je moet dus geen prompt engineer worden. Je moet kunnen zeggen wat je wil bereiken, en toelaten dat er iets gevraagd wordt. De rest is de laatste twee jaar in het model gekropen.
