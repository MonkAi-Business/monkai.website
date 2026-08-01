---
title: "n8n: laat je automatisatie en je AI met elkaar praten"
date: 2026-11-20
description: "Automatisatie doet wat je afspreekt, AI beoordeelt wat niet vastligt. Interessant wordt het pas wanneer die twee elkaar kunnen oproepen - in beide richtingen."
tags: ["automatisatie", "agents", "ai-adoptie"]
image: "/media/blog/n8n-automatisatie-en-ai.svg"
imageAlt: "Links een vaste keten van automatisatiestappen, rechts een AI-cirkel, met een pijl in beide richtingen ertussen"
draft: true
---

De eerste trede van mijn aanpak heet niet toevallig automatiseren. Voor de meeste KMO's zit de snelste winst niet in een slimme chatbot, maar in het wegnemen van werk dat elke week terugkomt: een bestand dat van de ene map naar de andere moet, een mail die een lijn in een spreadsheet wordt, een bestelling die in drie systemen moet landen. Saai werk, en precies daarom lonend om weg te nemen.

Dat bouw ik meestal in **n8n**. Het is een automatisatieplatform waar je een proces samenstelt uit blokken die je aan elkaar hangt: een trigger die het startschot geeft, en daarna stappen die data ophalen, omvormen en ergens afleveren. Er zijn honderden kant-en-klare koppelingen naar de systemen die je al gebruikt, en voor de rest is er altijd nog een gewone API-oproep. Je ziet de flow liggen, en bij een fout zie je meteen bij welke stap het misging.

Twee praktische zaken die tellen voor een Belgisch bedrijf. Je kan n8n **zelf hosten**: de code is beschikbaar en de Sustainable Use License laat toe dat je hem gratis gebruikt voor je eigen interne bedrijfsvoering. Wat niet mag, is n8n zelf als dienst doorverkopen. Het is dus geen klassieke open source, maar voor een KMO die zijn eigen processen automatiseert is de beperking geen probleem. Wil je het niet zelf beheren, dan is er de cloudversie, waarvan de gegevens in de EU staan (Frankfurt), vanaf ongeveer 20 euro per maand voor het instapplan. Handig detail in dat prijsmodel: één uitvoering is één volledige doorloop van je workflow, hoeveel stappen daar ook in zitten. Je wordt niet afgestraft voor een grondig proces.

## Waar de klassieke automatisatie stopt

Zo'n keten van stappen doet exact wat je hebt afgesproken. Dat is de kracht, en meteen ook de grens. Zodra er in het midden van het proces een oordeel nodig is, breekt het.

Het voorbeeld dat ik het vaakst tegenkom: binnenkomende documenten. De workflow kan de mail perfect openen en de bijlage wegschrijven. Maar *wat* er in dat document staat, of het een factuur is dan wel een creditnota, welke leverancier het is, of dit bij dossier A of B hoort - dat ligt niet vast. Elke leverancier doet het net iets anders. Op die stap loopt een gewoon script vast, en daar zit precies de reden waarom het werk nog altijd bij een mens ligt.

Die stap is het scharnier. Alles ervoor en erna is logistiek, en dat is werk voor automatisatie. Het beoordelen zelf is werk voor AI.

## Richting één: AI in je automatisatie

In n8n zet je daarvoor een AI-stap midden in de flow. Er is een AI Agent-blok waar je een taalmodel aan hangt plus een of meer gereedschappen, en het model beslist zelf welk gereedschap het nodig heeft om de taak af te maken. Het document lezen, het type bepalen, de leverancier opzoeken in je eigen database, en het resultaat teruggeven aan de volgende stap in de keten.

Wat je daarmee wint, is dat het proces niet meer stukloopt op variatie. De omkadering blijft strak - vaste trigger, vaste bestemming, alles gelogd - maar het stukje waar denkwerk nodig is, wordt aan het model overgelaten. Dat is dezelfde redenering als bij een [skill](/blog/skills-een-keer-vastleggen): je legt de manier van werken vast, niet elke uitzondering apart.

## Richting twee: je automatisatie in je AI

De omgekeerde richting is minder bekend en vaak leuker. n8n kan zich namelijk voordoen als een MCP-server. Concreet: je hangt een MCP Server Trigger voor een aantal van je workflows, n8n publiceert die achter één adres, en een AI-cliënt zoals Claude of ChatGPT kan die lijst opvragen en er eentje oproepen.

Daarmee draait de verhouding om. Niet je workflow die het model raadpleegt, maar jij die in een gesprek vraagt "zet die offerte klaar voor deze klant" en de AI die daarvoor jouw eigen automatisatie aanroept. Het model verzint niets, het duwt op een knop die jij hebt gebouwd, met jouw stappen en jouw controles erin. Je AI krijgt handen.

Dat werkt ook naar buiten toe: omgekeerd kan een agent in n8n gereedschap gebruiken dat elders als MCP-server draait. En n8n heeft er intussen zelf een ingebouwd waarmee je vanuit je AI-tool in gewone taal een workflow laat bouwen en testen in je eigen omgeving, in plaats van hem stap voor stap te klikken.

## Nuchter blijven

Twee kanttekeningen. Niet elke stap hoeft AI te zijn - een model inzetten op werk dat een simpele regel ook aankan, is geld uitgeven aan traagheid, en elke AI-stap in een workflow is een oproep die je [betaalt per gebruik](/blog/ai-tokens-niet-eeuwig-gesponsord). En zodra een AI je workflows kan oproepen, wordt het belangrijk welke workflows dat zijn en wie erbij kan. Publiceer niet je hele lijst omdat het kan. Dat is [governance die in het artefact zelf zit](/blog/governance-zit-in-je-prompts), niet in een document.

Begin dus niet bij de tool maar bij één proces dat elke week terugkomt en waar iemand telkens hetzelfde beslist. Bouw de logistiek eromheen vast, laat de beoordeling aan het model, en kijk daarna pas of je die flow ook vanuit een gesprek wil kunnen oproepen.
