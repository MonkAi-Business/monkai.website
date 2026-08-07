---
title: "Governance schrijf je niet op papier, je zet het in je prompts"
date: 2026-11-13
description: "Een AI-beleid van vier pagina's kent niemand na week één. Een gedeelde prompt of agent past de afspraak elke keer opnieuw toe."
tags: ["governance", "agents", "claude", "chatgpt", "gemini", "copilot"]
image: "/media/blog/governance-zit-in-je-prompts.svg"
imageAlt: "Eén sjabloonkaart die drie keer herhaald wordt, binnen een begrensd kader"
draft: true
---

Bij een KMO waar ik langskwam lag er een AI-beleid klaar. Vier pagina's, netjes opgesteld, toegelicht op een teamvergadering. Drie maanden later vroeg ik een paar mensen wat erin stond. Niemand wist het nog. Het document was niet fout. Het stond alleen op de verkeerde plaats: naast het werk in plaats van erin.

## Het beleid dat niemand opent

Een beleidsdocument werkt via geheugen. Iemand moet zich op het juiste moment herinneren dat er ergens een regel staat over klantengegevens, die regel terugvinden, en ze dan ook nog correct toepassen. Dat lukt de week na de toelichting. Daarna zakt het weg. Niet uit onwil: mensen zijn bezig met hun werk, niet met het beleid over hun werk.

Ondertussen gebeurt het echte werk in een chatvenster. Wie een offerte moet maken, plakt er een oude offerte in en typt "maak hier iets van". Wat er wel of niet in die prompt terechtkomt, beslist die persoon op dat moment, in zijn eentje, zonder dat iemand meekijkt.

## Een prompt is een afspraak die uitgevoerd wordt

De ommekeer is klein: zet dezelfde afspraken in de prompt zelf. Een offerte-prompt kan er bijvoorbeeld zo uitzien:

> Je stelt offertes op volgens ons vaste stramien. Gebruik alleen de prijzen uit het document "Tarieven 2026". Zet nooit namen van andere klanten in de tekst als referentie. Twijfel je over een bedrag, vul dan niets in en schrijf `[NA TE KIJKEN]`. Sluit af met onze standaardvoorwaarden.

Daar zitten vier afspraken in: welke bron telt, wat er niet in mag, wat er gebeurt bij twijfel, en waar een mens naar moet kijken. Niemand hoeft ze te onthouden, want ze worden elke keer toegepast. Dat is het verschil tussen een regel die je kent en een regel die draait.

## Van losse prompt naar gedeelde bibliotheek

Zo'n prompt op de laptop van één iemand is nog niets waard. Hij begint pas te tellen wanneer je hem deelt. Een Claude-project, een custom GPT, een Gem of een Copilot-agent maak je in de eerste plaats voor jezelf, maar in de zakelijke abonnementen zit er een deellaag omheen die vaak over het hoofd wordt gezien. En net daar zit de governance.

Gedeelde Projects in Claude bestaan op de Team- en Enterprise-abonnementen, met per persoon het onderscheid tussen het project mogen gebruiken en de instructies ook mogen aanpassen. Beheerders kunnen daarbovenop richtlijnen zetten die over de hele organisatie gelden. In ChatGPT bepaalt de beheerder hoe breed een custom GPT gedeeld mag worden: enkel binnen de werkruimte, of ook daarbuiten. En het delen van Gems staat of valt met één schakelaar in de Google Admin console.

De techniek is dus het probleem niet. Het onderhoud wel: een bibliotheek waar iedereen in dumpt en niemand eigenaar van is, wordt binnen het jaar een rommelbak. Kies een handvol prompts die er echt toe doen, zet er een naam bij van wie ze bijhoudt, en gooi de rest weg.

## Agents: de afspraak wordt de standaardweg

Een agent is de volgende stap: instructies, kennis en grenzen samen in één ding dat je uitdeelt. De medewerker kiest niet meer welke prompt hij neemt. Hij opent "Offertes" en begint. De afspraak is niet langer iets wat je erbij moet doen, ze is de kortste weg geworden.

Twee dingen zitten daar goed. Agents die je in Copilot bouwt, krijgen geen extra rechten: wie zonder agent niet bij een SharePoint-site, Teams-kanaal of mailbox kan, ziet daar via de agent evenmin iets van. Je bestaande rechtenstructuur blijft je governance dus dragen. Keerzijde: staat een map veel te breed open, dan komt dat via een agent sneller aan het licht. En beheerders kunnen op tenantniveau regelen wie agents mag maken, delen en publiceren. In Claude werkt dat gelijkaardig voor skills, herbruikbare werkwijzen die een beheerder in één keer aan iedereen kan uitdelen, met wie wat deelt in het auditlogboek.

Er zit ook een valkuil in. Gems worden bewaard en gedeeld via Google Drive, dus je Drive-instellingen gelden ook voor je Gems: mag je organisatie documenten buiten het bedrijf delen, dan geldt dat evengoed voor een Gem. Zet je het delen van Gems later uit, dan blijven de eerder gedeelde exemplaren gewoon bereikbaar via Drive. Wie dit uitrolt, kijkt dus eerst naar de instellingen eronder.

## Wat je dan nog wel op papier zet

Niet alles past in een prompt. De AI Act vraagt een paar dingen die geen agent van je overneemt: weten welke AI-tools er in je organisatie draaien, zorgen dat wie ermee werkt er genoeg van begrijpt, en kunnen uitleggen waar AI mee beslist. Daar heb je nog altijd een document voor nodig.

Maar dat document mag kort zijn. Eén pagina die klopt, plus tien prompts die mensen echt gebruiken, geeft je meer grip dan tien pagina's die niemand opent. Het verschil zit niet in hoeveel je opschrijft. Het zit in waar je het opschrijft.
