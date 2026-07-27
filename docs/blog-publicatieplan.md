# Blog-publicatieplan

Alle bestaande blogposts staan op `draft: true` en zijn dus niet zichtbaar op de site.
Ze komen één per week vrij, telkens op vrijdag, zodat Stijn ze eerst kan nalezen en
de reeks opbouwt van basis naar diep.

Live sinds 27 juli 2026: **Elke vrijdag een nieuw artikel** (`elke-vrijdag-een-artikel.md`),
de aankondiging van de reeks.

## Hoe geef je een post vrij

Gebruik hiervoor de skill `blogpost` (`.claude/skills/blogpost/SKILL.md`), onderdeel
"Vrijdagroutine". Die bevat de volledige tone of voice en een checklist.

Alle posts hieronder zijn geschreven vóór de huisstijl van 27 juli 2026 vastlag.
**Vrijgeven betekent dus altijd ook herschrijven**: prikkelende titel, opening met een
echte anekdote van Stijn, onderzoeksdetails terugbrengen tot één ankerpunt, inkorten tot
600 à 800 woorden, en een slot dat zegt wat je maandag doet.

Op de vrijdag zelf, per post:

1. Lees de post na. Stijn levert de anekdote voor de opening.
2. Herschrijf de post naar de huisstijl. Pas ook de `description` aan.
3. Check de feiten opnieuw. Deze teksten dateren van juli 2026; producten, prijzen en
   wetgeving schuiven op.
4. Check de interne links tegen wat al live staat (zie "Let op: interne links").
5. Zet in de frontmatter `draft: true` → `draft: false`.
6. Zet `date` op de vrijdag van publicatie (zie de kolom hieronder). Zo leest de blog
   als een wekelijkse reeks en staat de nieuwste bovenaan.
7. Schrijf de LinkedIn-post in `content/linkedin/<slug>.md`.
8. `npm run build` en controleer dat de post gebouwd wordt.
9. Commit en push naar `main`. Netlify herbouwt automatisch, de post staat binnen enkele
   minuten online op `/blog/<slug>`.

Vergeet stap 6 niet: zonder aangepaste datum zakt de post meteen tussen de oudere stukken
en oogt de volgorde op `/blog` willekeurig.

De leestijd hoef je nergens in te vullen. Die wordt berekend uit de tekst
(`src/utils/readingTime.ts`) en verschijnt vanzelf op de detailpagina en in de lijst.

## De volgorde

Opbouwend: eerst wat je maandagochtend al kan gebruiken, dan de werkgewoontes, dan
agents en skills, en tot slot governance, wetgeving en kosten.

| # | Vrijdag | Slug | Waarom hier |
|---|---|---|---|
| 1 | 31 jul 2026 | `second-brain-een-map` | Laagste drempel: begin met één map. Goede eerste stap voor wie nog niets doet. |
| 2 | 7 aug 2026 | `shadow-ai-verbieden-werkt-niet` | Herkenbaar probleem bij elke zaakvoerder, en het zet meteen de toon: meedoen in plaats van verbieden. |
| 3 | 14 aug 2026 | `copilot-data-die-je-al-hebt` | Je zit al op bruikbare data. Geen investering nodig om te starten. |
| 4 | 21 aug 2026 | `plan-mode-eerst-denken-dan-doen` | Eerste echte werkgewoonte: eerst een plan, dan uitvoeren. |
| 5 | 28 aug 2026 | `expert-collega-je-eigen-ai-agent` | Van losse vragen naar een AI die je één keer inwerkt. |
| 6 | 4 sep 2026 | `collective-brain-bedrijfsgeheugen` | Tilt het second brain van week 1 naar bedrijfsniveau. |
| 7 | 11 sep 2026 | `copilot-cowork-pay-as-you-go` | Introduceert Cowork en meteen de prijsvraag die eraan hangt. |
| 8 | 18 sep 2026 | `chat-cowork-code-welke-claude-wanneer` | Overzicht van de werkvormen, nu de lezer Cowork kent. |
| 9 | 25 sep 2026 | `skills-een-keer-vastleggen` | Bindt agents, werkvormen en herhaalwerk samen. Kan pas als die stukken online staan. |
| 10 | 2 okt 2026 | `prompt-engineering-2026-uitkomst` | "De trucs zijn ingehaald" landt beter zodra plan mode, agents en skills bekend zijn. |
| 11 | 9 okt 2026 | `accelerated-coding-geen-vibe-coding` | Technischer stuk, gericht op developers. |
| 12 | 16 okt 2026 | `eu-ai-act-kmo` | Start van het governanceblok. |
| 13 | 23 okt 2026 | `governance-zit-in-je-prompts` | Governance in de praktijk, bovenop de wetgeving van week 12. |
| 14 | 30 okt 2026 | `ai-tokens-niet-eeuwig-gesponsord` | De kostenkant, nu duidelijk is wat je allemaal draait. |
| 15 | 6 nov 2026 | `n8n-automatisatie-en-ai` | Zet automatisatie, skills, governance en kosten samen. Sluit de reeks. |
| 16 | 13 nov 2026 | `duizend-inspecties-later` | PinPoint Inspections: waarom inspectiedata in pdf's onbruikbaar is en wat AI ermee kan zodra ze gestructureerd is. Al in de huisstijl geschreven. |

## Let op: interne links

Een link naar een post die nog op `draft: true` staat, geeft een 404. Draft-posts krijgen
geen pagina (`getStaticPaths` in `src/pages/blog/[slug].astro` filtert ze weg). De volgorde
hierboven houdt daar al rekening mee: elke post verschijnt pas nadat de posts waar hij naar
linkt online staan.

Wie de volgorde wil wijzigen, checkt eerst de links:

```
grep -o '(/blog/[a-z0-9-]*)' src/content/blog/*.md
```

De afhankelijkheden vandaag:

- `collective-brain-bedrijfsgeheugen` → `second-brain-een-map`
- `chat-cowork-code-welke-claude-wanneer` → `copilot-cowork-pay-as-you-go`
- `expert-collega-je-eigen-ai-agent` → `n8n-automatisatie-en-ai`
- `skills-een-keer-vastleggen` → `second-brain-een-map`, `collective-brain-bedrijfsgeheugen`, `expert-collega-je-eigen-ai-agent`, `plan-mode-eerst-denken-dan-doen`, `copilot-cowork-pay-as-you-go`, `chat-cowork-code-welke-claude-wanneer`, `n8n-automatisatie-en-ai`
- `prompt-engineering-2026-uitkomst` → `expert-collega-je-eigen-ai-agent`, `plan-mode-eerst-denken-dan-doen`, `skills-een-keer-vastleggen`
- `accelerated-coding-geen-vibe-coding` → `plan-mode-eerst-denken-dan-doen`, `skills-een-keer-vastleggen`
- `n8n-automatisatie-en-ai` → `skills-een-keer-vastleggen`, `ai-tokens-niet-eeuwig-gesponsord`, `governance-zit-in-je-prompts`

`skills-een-keer-vastleggen` en `n8n-automatisatie-en-ai` linken naar elkaar. Die kring valt
met geen enkele volgorde op te lossen: welke van de twee je ook eerst zet, één link wijst
naar een post die nog verborgen is.

### Twee vooruitwijzingen naar week 15

`expert-collega-je-eigen-ai-agent` (week 5) en `skills-een-keer-vastleggen` (week 9) sluiten
allebei af met een alinea die naar `n8n-automatisatie-en-ai` (week 15) linkt. Dat is de enige
plek in de reeks waar een post vooruitwijst in plaats van terug. Tussen 28 augustus en
6 november geeft die link dus een 404.

Kies er één van bij het vrijgeven:

- Haal de linkopmaak weg en laat de zin staan: `[n8n: laat je automatisatie en je AI met
  elkaar praten](/blog/n8n-automatisatie-en-ai)` wordt gewoon `n8n`. De alinea blijft
  kloppen, er is geen dode link, en op 6 november zet je de link terug.
- Of laat de hele slotalinea weg tot 6 november. Ze staat in beide posts als laatste
  alinea, dus knippen en later terugplakken is triviaal.
- Of schuif `n8n-automatisatie-en-ai` naar voren, vóór week 5. Dan moet je wel de drie
  links in die post zelf weghalen, want die wijzen naar skills, tokens en governance.

De eerste optie is de minste moeite en houdt de opbouw van de reeks intact.

## Nieuwe posts

Schrijf je tussendoor een nieuwe post, dan hoort die gewoon op de eerstvolgende vrije
vrijdag achteraan, of tussenin als hij beter past. Werk deze tabel dan bij, en let op
dat hij niet naar nog verborgen posts linkt.
