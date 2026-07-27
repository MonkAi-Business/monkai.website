# LinkedIn-posts

Bij elke blogpost hoort een LinkedIn-tekst. Die staan hier, één bestand per artikel,
met dezelfde slug als de blogpost.

Deze map staat bewust **buiten `src/`**. Astro kent alleen de collecties uit
`src/content.config.ts`, dus hier wordt niets van gebouwd of gepubliceerd. Het is
werkmateriaal dat mee in de repo zit zodat het niet verloren gaat.

## Vorm

```markdown
---
slug: naam-van-de-blogpost
title: "De titel van het artikel"
url: https://monkai.business/blog/naam-van-de-blogpost
date: 2026-08-07
---

De tekst die je letterlijk op LinkedIn plakt.
```

- 150 tot 250 woorden.
- De eerste twee zinnen dragen alles. LinkedIn kapt af na ongeveer drie regels.
  Begin dus met de anekdote, niet met "nieuwe blogpost online".
- Korte regels, veel witruimte.
- Afsluiten met een vraag, dan de link.
- `#AI` staat altijd onderaan, de rest volgt het onderwerp.

De volledige richtlijn staat in `.claude/skills/blogpost/SKILL.md`.

## Status

Een tekst hier betekent niet dat hij al gepost is. Het is een klaargezette tekst,
geen archief van wat online staat.
