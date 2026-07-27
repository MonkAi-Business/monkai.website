# Media voor de superpowers-varianten

Deze bestanden zijn afgeleid van wat Stijn aanleverde in `public/media/`. De
originelen blijven daar staan en worden niet gebruikt op een pagina: ze zijn
samen 32 MB.

| Bestand | Bron | Hoe gemaakt |
|---|---|---|
| `monkai.webp` | `monkai.png` | `node scripts/media-webp.mjs` (sharp, kwaliteit 82) |
| `monkai-640.webp` | `monkai.png` | idem, 640 px breed |
| `monkai-web.glb` | `monkai.glb` | `npx @gltf-transform/cli optimize` (zie het plan, taak 1) |

Vervangt Stijn een origineel, draai die twee opdrachten opnieuw. De paden in de
componenten wijzen naar deze map, dus er hoeft geen code te wijzigen.

## Gemeten resultaten (2026-07-27)

- `monkai.webp`: 113.202 bytes (~110,5 kB), kwaliteit 82 was meteen scherp genoeg. Geen aanpassing nodig.
- `monkai-640.webp`: 39.738 bytes (~38,8 kB), kwaliteit 80, 640 px breed.
- `monkai-web.glb`: 296.896 bytes (~0,28 MB), 8.312 driehoeken (bron: 499.758), ruim onder de budgetten.

Exacte opdracht voor het model:

```bash
npx --yes @gltf-transform/cli@4 optimize public/media/monkai.glb public/media/superpowers/monkai-web.glb --compress meshopt --texture-compress webp --texture-size 2048 --simplify true --simplify-error 0.01
```

`--simplify true` werkte gewoon met de geïnstalleerde versie (@gltf-transform/cli 4.x); de fallback-varianten uit het plan waren niet nodig.

Extensies in `monkai-web.glb`: `EXT_meshopt_compression`, `EXT_texture_webp`,
`KHR_materials_specular`, `KHR_mesh_quantization`. **`EXT_meshopt_compression`
staat er wél bij** - een latere taak die de meshopt-decoder inhangt (bv. voor
`<model-viewer>` of three.js) moet dat dus gewoon doen, dat is niet overbodig.
