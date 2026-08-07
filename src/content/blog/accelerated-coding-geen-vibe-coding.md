---
title: "Accelerated coding: geen vibe coding, wel veel sneller"
date: 2026-10-30
description: "Vibe coding is code laten schrijven zonder er nog naar te kijken. Accelerated coding is hetzelfde werk als altijd, veel sneller en met minder fouten, en je kijkt er wel naar."
tags: ["productiviteit", "ai-adoptie"]
image: "/media/blog/accelerated-coding.svg"
imageAlt: "Links code die niemand meer bekijkt, rechts dezelfde code met snelheidslijnen en een vinkje"
draft: true
---

Ik noem het accelerated coding en niet vibe coding, en dat is geen woordspel. De twee betekenen echt iets anders, en dat verschil bepaalt of je er als developer iets aan hebt.

Andrej Karpathy muntte "vibe coding" in februari 2025: je geeft je over aan de vibes en vergeet dat de code zelfs bestaat. Hij las de diffs niet meer, plakte foutmeldingen terug zonder ze te begrijpen, en zei er in dezelfde post bij dat dat prima werkt voor een weggooiproject van een weekend. Collins koos het in november 2025 tot woord van het jaar, met een neutrale definitie: AI die via gewone taal code schrijft. In het dagelijks gebruik is vooral het eerste blijven hangen - code die niemand nog bekijkt.

Accelerated coding is iets anders. Het is wat je anders zelf zou geschreven hebben, veel sneller en met minder fouten. Je kijkt er wel naar. Je begrijpt wat er staat. Je zet het pas verder als je het aan een collega kan uitleggen.

## Het misverstand

Veel developers zetten "AI schrijft code" gelijk aan vibe coding, en dus aan prutswerk waar je geen echt systeem mee bouwt. Het is net omgekeerd: juist met een technische achtergrond ga je hier het snelst vooruit. Je ziet binnen tien seconden of een voorstel klopt. Je weet welke vraag je moet stellen. Je merkt meteen dat er een index ontbreekt, dat een edge case niet gedekt is, of dat de aanpak wel werkt maar over zes maanden niet meer te onderhouden valt. Dat beoordelen is het schaarse deel geworden, niet het typen.

DORA noemt AI in zijn rapport over 2025 een versterker: sterke teams worden er beter van, en bij zwakke teams komen de bestaande problemen scherper bloot te liggen. Je vakkennis wordt dus niet minder waard, ze wordt de hefboom.

## Wat er gebeurt als je niet kijkt

De cijfers uit 2025 zijn ontnuchterend, maar ze zeggen niet wat je denkt. In de Stack Overflow-enquête van 2025 gebruikt 84% van de developers AI of is het van plan, maar vertrouwt 46% de juistheid van de output níet, tegen 33% die dat wel doet. De grootste frustratie, bij 66%, is code die "bijna juist is, maar net niet"; 45% zegt dat het debuggen van AI-code meer tijd kost dan het uitspaart.

METR liet zestien ervaren open-source developers 246 echte taken doen in codebases die ze al jaren kenden. Met AI deden ze er 19% langer over, terwijl ze vooraf 24% tijdwinst verwachtten en achteraf nog dachten dat ze 20% sneller waren geweest. Belangrijke nuance: dat was met de tools van begin 2025 (Cursor Pro met Claude 3.5 en 3.7 Sonnet), en de onderzoekers waarschuwen zelf dat je dit niet mag doortrekken naar alle softwarewerk.

Het punt is niet dat AI niet werkt. Het punt is dat "bijna juist" het duurste resultaat is dat bestaat, en dat een gevoel van snelheid geen snelheid is. De controle is niet de overhead bovenop het werk. De controle ís het werk.

## Waar de winst dan wel zit

Niet in "bouw mijn applicatie". Wel in de kleine dingen die elke dag tijd en humeur kosten. De zoveelste boilerplate. Testdata verzinnen. Een regex die je elke keer opnieuw moet opzoeken. Het configuratiebestand van een tool die je twee keer per jaar aanraakt. Een migratiescript. Een stack trace uitpluizen. Een wegwerpscript dat je één keer nodig hebt en nooit meer. De eerste dag in een codebase die je niet kent.

Dat kostte allemaal een half uur of een namiddag, en nu vaak minuten. Het echte verschil zit niet in wat je plots kan, maar in hoeveel lager de drempel ligt om iets goed te doen. De test die je vroeger "later" zou schrijven, het scriptje dat je vroeger manueel deed, de opkuis die je bleef uitstellen: dat gebeurt nu wel. Die dagelijkse frustraties zien er echt anders uit.

## Snel gaan zonder blind te worden

Vier gewoonten volstaan. Lees elke diff voor je hem aanvaardt, ook de saaie. Werk in kleine stappen, zodat een fout klein blijft en je nog weet waar hij vandaan komt. Laat tests, typechecks en je linter het vangnet zijn, want die schrijft de AI trouwens ook graag. En [vraag eerst een plan](/blog/plan-mode-eerst-denken-dan-doen) in plaats van meteen code: beslissen vooraf is goedkoper dan terugdraaien achteraf.

Werk dat terugkeert leg je één keer vast als een [skill](/blog/skills-een-keer-vastleggen), zodat je stijl, je conventies en je checks er elke keer opnieuw in zitten. En hou de regel van Simon Willison aan: commit niets wat je niet aan iemand anders zou kunnen uitleggen. Dat is precies de lijn tussen accelerated coding en vibe coding.

Dus ja: omarm het als developer. Dat klinkt klef, maar wie de code kan lezen, haalt hier meer uit dan wie dan ook. De vraag is niet of de AI het beter kan dan jij, maar hoeveel van je dag nu nog naar werk gaat dat niemand zal missen.
