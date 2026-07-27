// Eenmalige omzetting van het aangeleverde beeld naar webformaat.
//
// Draait buiten de build. sharp staat bewust niet in package.json: het is een
// zwaar binair pakket dat we één keer nodig hebben. Installeer het tijdelijk:
//
//   npm i --no-save sharp
//   node scripts/media-webp.mjs
//   npm remove --no-save sharp   (of gewoon node_modules laten staan)
//
// De uitvoer wordt gecommit, dus de build heeft sharp nooit nodig.
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const bron = 'public/media/monkai.png';
const doel = 'public/media/superpowers';

mkdirSync(doel, { recursive: true });

await sharp(bron).webp({ quality: 82 }).toFile(`${doel}/monkai.webp`);
await sharp(bron).resize(640).webp({ quality: 80 }).toFile(`${doel}/monkai-640.webp`);

console.log('klaar');
