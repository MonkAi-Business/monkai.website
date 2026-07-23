# Google Business Profile — setup-pakket voor MonkAi Business

Een Google Business Profile (GBP) is de sterkste hefboom voor **lokale vindbaarheid** (Google Maps, "AI-coach KMO in de buurt") én voor **AI-antwoorden** over lokale diensten. Dit document bevat alles voorgekauwd zodat je het alleen nog moet overnemen.

> **Waarom Claude dit niet zelf kan aanmaken:** een GBP vereist jouw Google-account en een verificatiestap (per post, telefoon of video). Dat moet je zelf doen. Hieronder staat elk veld al ingevuld.

---

## Stap 1 — Aanmaken

1. Ga naar **business.google.com** en log in met het Google-account dat je voor de zaak wil gebruiken.
2. Klik **"Bedrijf toevoegen" → "Bedrijf beheren"**.
3. Kies bij bedrijfstype: **Dienstverlener (service-area business)** — je hebt geen winkel/kantoor waar klanten langskomen, je gaat naar hen. Verberg daarom je adres en toon in plaats daarvan je **servicegebieden** (zie stap 3).

---

## Stap 2 — Basisgegevens (exact zo overnemen)

| Veld | Waarde |
|---|---|
| **Bedrijfsnaam** | `MonkAi Business` |
| **Primaire categorie** | `Bedrijfsadviseur` (Engels: *Business management consultant*) |
| **Secundaire categorieën** | `Computeropleidingen` (*Computer training school*) · `Adviesbureau` (*Consultant*) |
| **Telefoon** | *(je zakelijk nummer)* |
| **Website** | `https://monkai.business` |
| **Adres (verborgen)** | Robert De Preesterstraat 55, 9700 Oudenaarde |
| **Openingsuren** | Op afspraak (of je vaste kantooruren) |

> **Belangrijk:** stop géén zoekwoorden in de bedrijfsnaam (bv. niet "MonkAi Business AI-coaching Gent"). Dat is tegen de Google-richtlijnen en kan tot schorsing leiden. De naam is `MonkAi Business`, meer niet. De rest van je zichtbaarheid komt uit categorieën, servicegebieden, diensten en beschrijving.

---

## Stap 3 — Servicegebieden

Voeg deze toe (Google staat er tot ~20 toe). Combineer steden en regio's:

```
Oudenaarde, Gent, Kortrijk, Aalst, Deinze, Zottegem, Ronse, Wetteren,
Waregem, Oosterzele, Vlaamse Ardennen, Oost-Vlaanderen, West-Vlaanderen
```

Dit dekt exact de doelregio's die ook in de website-schema (`areaServed`) en copy staan — die consistentie versterkt het signaal.

---

## Stap 4 — Bedrijfsbeschrijving (≤ 750 tekens, klaar om te plakken)

```
MonkAi Business helpt Vlaamse KMO's rustig en veilig starten met AI. Je werkt
rechtstreeks met Stijn De Ketelaere, AI-adoptiecoach — geen bureau, geen
tussenlagen. We beginnen klein met een AI-inspiratiesessie op locatie en bouwen
stap voor stap op: repetitief werk automatiseren, kennis structureren met een
second brain en collective brain, en teams versnellen met Claude-training voor
kenniswerkers en developers. Ook AI-geletterdheid, AI-governance en de EU AI Act
komen aan bod, in gewone taal. Werkgebied: Oost- en West-Vlaanderen, van Gent
tot de Vlaamse Ardennen. Innovatie telt pas als ze gebruikt wordt.
```

---

## Stap 5 — Diensten toevoegen

Voeg onder "Diensten" deze items toe (naam + korte omschrijving). Ze komen overeen met de website:

- **AI-inspiratiesessie** — Twee uur, tien deelnemers, bij jou op locatie. Het vertrekpunt van elk traject.
- **Use case workshop** — Ideeën wegen op een impact/effort-matrix. Je vertrekt met drie haalbare cases.
- **AI-geletterdheid en AI-maturiteit** — Opleiding op maat van elk niveau, van sceptisch tot gevorderd.
- **AI-governance en EU AI Act** — Duidelijke afspraken over data, tools en verantwoordelijkheid, zonder juristentaal.
- **Claude-training voor kenniswerkers** — Veilig en slim werken met Claude op je eigen taken.
- **Claude-training voor developers** — Accelerated coding met behoud van controle en kwaliteit.
- **Microsoft 365 Copilot veilig inzetten** — Copilot staat vaak al aan; leer het veilig en zinvol gebruiken.
- **Second brain en collective brain** — Kennis structureren zodat ze niet in hoofden blijft zitten.

---

## Stap 6 — Foto's

- **Logo** — je MonkAi-logo (vierkant).
- **Omslagfoto** — kan de merkafbeelding zijn (`public/og-image.png`, 1200×630) of een foto van jou aan het werk.
- **Foto's** — enkele professionele foto's van Stijn en/of van een sessie. Profielen met echte foto's krijgen aanzienlijk meer weergaven en vertrouwen.

---

## Stap 7 — Na verificatie

1. **Verifieer** het profiel (post/telefoon/video — Google kiest de methode). Zonder verificatie ben je niet zichtbaar.
2. **Vraag reviews.** Dit is cruciaal: reviews wegen zwaar door in wie AI-zoekmachines *aanbevelen* (niet enkel citeren). Vraag je eerste tevreden klanten om een korte review met vermelding van de regio en het type traject.
3. **Plaats af en toe een update** ("Post") — bv. een nieuwe blogpost of use case. Houdt het profiel actief.
4. **Consistentie (NAP):** naam, adres en telefoon moeten overal identiek zijn — op de site (footer + schema), op je facturen, en op andere vermeldingen. Inconsistente gegevens verzwakken je lokale ranking.

---

## Waarom dit werkt met de rest van de site

De website levert nu al de gestructureerde signalen (`ProfessionalService`-schema met `areaServed`, `Person` voor Stijn, `hallo@monkai.business`, adres in Oudenaarde). Een geverifieerd GBP met dezelfde gegevens bevestigt die entiteit voor Google én voor AI-zoekmachines. Samen maken ze je vindbaar op combinaties als *"AI-adoptiecoach Oost-Vlaanderen"*, *"Claude-training Gent"* of *"AI-coach Vlaamse Ardennen"*.
