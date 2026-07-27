# Tone of voice voor de blog, leestijd en LinkedIn-posts

Datum: 27 juli 2026
Status: goedgekeurd door Stijn

## Waarom

De blogposts lezen als degelijke uitleg, maar niet als Stijn. Ze openen met een
definitie of een stelling, niet met een verhaal, en er staat meer onderzoek in dan
de lezer nodig heeft. Doel: elke post herkenbaar maken als van hem, korter houden,
en er telkens een LinkedIn-post bij leveren.

## Beslissingen

| Onderwerp | Keuze |
|---|---|
| Titel | Prikkelend maar waarmakend. Geen schreeuwerige clickbait, geen brave onderwerpstitel. |
| Opening | Persoonlijke anekdote in de ik-vorm, 1 tot 2 alinea's. |
| Herkomst anekdote | Stijn levert ze. De skill dwingt af dat er eerst naar gevraagd wordt. |
| Lengte | 600 tot 800 woorden, ca. 4 minuten. |
| Structuur | Vast: haak, herkenning, wat het kost, hoe AI het oplost, wat je maandag doet. |
| Perspectief | Ik vertel, jij spreekt de lezer aan. Geen wij-vorm. |
| Onderzoek | Hooguit één ankerpunt per post, in gewone taal. Verifiëren blijft verplicht, alleen minder bewijs in de tekst. |
| Leestijd | Automatisch berekend, getoond op de detailpagina en in de lijst op /blog. |
| LinkedIn | `content/linkedin/<slug>.md`, buiten `src/`, dus niet gebouwd. 150 tot 250 woorden, `#AI` vast, de rest per onderwerp. |
| Bestaande drafts | Niet in bulk herschrijven. Elke draft wordt herschreven op de vrijdag dat hij vrijkomt, als deel van de wekelijkse routine. |

## Onderdelen

### 1. Skill `.claude/skills/blogpost/`

`SKILL.md` met twee werkwijzen:

- **Nieuwe post.** Onderwerp bepalen, anekdote vragen, feiten verifiëren, schrijven,
  cover maken, LinkedIn-post maken, in het publicatieplan zetten.
- **Vrijdagroutine.** Een bestaande draft nalezen, anekdote vragen, herschrijven naar
  deze stijl, `draft: false` en de datum op die vrijdag, interne links checken tegen
  wat al live staat, LinkedIn-post maken, commit en push.

`references/voorbeelden.md` toont zwak versus sterk voor titels, openingen en slot,
plus een volledig uitgewerkte voorbeeldpost. Beschrijven volstaat niet, tonen wel.

### 2. Leestijd

`src/utils/readingTime.ts` berekent uit de ruwe markdownbody: markdownsyntax eruit,
woorden tellen, delen door 200, naar boven afronden, minimaal 1. Geen frontmatter-veld,
dus het kan niet verouderen en bestaande posts hoeven niet aangepast.

Getoond in `src/pages/blog/[slug].astro` (metaregel naast datum en auteur) en in
`src/pages/blog/index.astro` (metaregel van elke kaart). `BlogTeaser.astro` op de
homepage blijft ongewijzigd.

### 3. LinkedIn-posts

`content/linkedin/<slug>.md` in de repo-root, buiten `src/`, zodat Astro er nooit iets
mee bouwt. Frontmatter met slug, titel, url en publicatiedatum; body is de tekst die
Stijn letterlijk kopieert. `content/linkedin/README.md` legt de vorm uit.

### 4. Documentatie

`docs/blog-publicatieplan.md` krijgt de herschrijfstap en de LinkedIn-stap in de
vrijdagprocedure. `CLAUDE.md` verwijst onder "How to add a blog post" naar de skill.

## Buiten scope

Geen consent-, schema- of layoutwijzigingen. Geen frontmatterveld erbij. De 15 bestaande
drafts worden nu niet herschreven.
