---
title: "Ik draaide alles op het zwaarste model. Vier op de vijf vragen hadden dat niet nodig."
date: 2026-10-16
description: "Ik liet een klein beslissingsmodel bij elke vraag kiezen welke Claude erop moest. Het koos bijna altijd het lichtste model, en mijn verbruik halveerde."
tags: ["claude", "productiviteit", "ai-adoptie"]
image: "/media/blog/zwaarste-model-niet-nodig.svg"
imageAlt: "Een stroom vragen die via een klein groen knooppunt verdeeld wordt over drie blokken van verschillende grootte, waarvan het kleinste de meeste vragen krijgt"
draft: true
---

Ik heb mijn Claude-verbruik gehalveerd. Niet door minder te vragen, maar door bij elke vraag eerst te laten beslissen welk model erop moest.

Ik draai standaard op Opus 5.5, het zwaarste model dat ik dagelijks gebruik. Dat leek me de veilige keuze: als het grootste model het doet, zit het goed. Toen ik het per vraag liet kiezen, kwam er iets anders uit. Vier op de vijf vragen waren genoeg voor Haiku, een model dat ik nochtans bijna nooit aanraakte.

## Je laat die knop gewoon staan

In Claude kies je een model: Haiku, Sonnet, Opus of Fable. Maar eerlijk, je kiest dat één keer en laat het daarna staan. Voor een mail van drie regels net zo goed als voor een contract van veertig pagina's. Ik deed niets anders.

Dat kost meer dan je denkt. Via de API is Haiku veertig keer goedkoper dan Opus. In een abonnement betaal je niet per vraag, maar je merkt het wel aan hoe snel je tegen je limiet loopt. Anthropic schrijft het zelf in zijn documentatie: Haiku voor eenvoudige taken, Sonnet voor het meeste werk, Opus voor het zwaarste denkwerk. Alleen doet bijna niemand dat, omdat je er bij elke vraag aan moet denken.

## Een portier voor je grote brein

Dus liet ik iets anders eraan denken. Jev is een klein beslissingsmodel dat ik via OpenRouter aanroep, een dienst die je met één account bij een heleboel verschillende modellen laat. Ik maakte een skill die bij elke vraag eerst Jev raadpleegt. Jev leest de vraag en zegt: dit is iets voor Haiku, dit voor Sonnet, dit voor Opus. Daarna gaat de vraag naar dat model.

Die extra aanroep kost me een paar cent en spaart duizenden tokens uit. Vertraging heb ik niet gemerkt. Het verschil zit tussen "ik zet alles op het grootste model, dan ben ik zeker" en "het juiste model voor de juiste vraag". Ik doe nu meer en loop niet meer tegen mijn limieten aan.

Ik geloof sterk in zulke kleine beslissingsmodellen. Je laat niet alles door één groot brein lopen, je zet er een slimme portier voor.

Eén ding moet je wel weten. Jev leest je vraag, dus die vraag gaat ook naar OpenRouter en naar wie het model achter Jev draait. Voor klantdata is dat een bewuste keuze. OpenRouter bewaart je prompts standaard niet, en je kan instellen dat je enkel naar aanbieders gaat die niets bijhouden. Dat alles binnen de EU blijft, kan alleen in hun Business- en Enterprise-abonnement.

## Wat je maandag doet

Je hebt geen Jev nodig om te beginnen. Vraag je bij je volgende tien vragen telkens eerst af of dit echt het zwaarste model nodig heeft. Zet de eenvoudige op Haiku en vergelijk het antwoord. Grote kans dat je geen verschil ziet, en dat je net als ik veel te lang met een vrachtwagen naar de bakker reed.

Dat beslissingsmodel zit intussen ook in mijn MCP-gateway. Maar dat is voor een volgende post.
