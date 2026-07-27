// Controle op de gebouwde site. Draai na `npm run build`:
//
//   node scripts/check-kickass.mjs
//
// Geen afhankelijkheden, alleen Node. Controleert vier dingen die je met het
// blote oog niet ziet: dat elke pagina er staat en noindex is, dat de CSS van
// variant A niet meelift op de pagina van variant B, dat /kickass uit de
// sitemap blijft, en dat de media binnen hun budget vallen.
import { readFileSync, existsSync, statSync } from 'node:fs';

const VERWACHT = [
  'neon-jungle', 'maanlicht', 'bento', 'terminal', 'aurora',
  'spotlight', 'klimmen', 'brutalist', 'netwerk', 'vloeibaar',
];

const BUDGET = {
  'public/media/superpowers/monkai.webp': 350 * 1024,
  'public/media/superpowers/monkai-640.webp': 80 * 1024,
  'public/media/superpowers/monkai-web.glb': 3 * 1024 * 1024,
};

let fouten = 0;
function fout(bericht) {
  console.error('FOUT  ' + bericht);
  fouten++;
}
function ok(bericht) {
  console.log('ok    ' + bericht);
}

// Alle CSS die een pagina binnenhaalt, plus zijn inline stijlen.
function stijlenVan(html) {
  let alles = '';
  for (const m of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) {
    const pad = 'dist' + m[1];
    if (existsSync(pad)) alles += readFileSync(pad, 'utf8');
    else fout(`stylesheet ontbreekt in dist: ${m[1]}`);
  }
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) alles += m[1];
  return alles;
}

// De galerij.
if (!existsSync('dist/kickass/index.html')) {
  fout('dist/kickass/index.html ontbreekt');
} else {
  const html = readFileSync('dist/kickass/index.html', 'utf8');
  if (!html.includes('noindex')) fout('de galerij mist de noindex-meta');
  for (const slug of VERWACHT) {
    if (!html.includes(`/kickass/${slug}/`)) fout(`de galerij linkt niet naar ${slug}`);
  }
  ok('galerij aanwezig, noindex, tien links');
}

// De tien varianten.
for (const slug of VERWACHT) {
  const pad = `dist/kickass/${slug}/index.html`;
  if (!existsSync(pad)) {
    fout(`${pad} ontbreekt`);
    continue;
  }
  const html = readFileSync(pad, 'utf8');

  if (!html.includes(`data-kickass="${slug}"`)) fout(`${slug}: data-kickass ontbreekt of klopt niet`);
  if (!html.includes('data-theme="superpowers"')) fout(`${slug}: data-theme staat niet op superpowers`);
  if (!html.includes('noindex')) fout(`${slug}: noindex-meta ontbreekt`);

  // Isolatie. Elke laag zet --kickass-laag met zijn eigen slug. Komt er meer dan
  // één voor, dan lift de CSS van een andere variant mee.
  const css = stijlenVan(html);
  const gevonden = [...css.matchAll(/--kickass-laag:\s*['"]([a-z-]+)['"]/g)].map((m) => m[1]);
  const uniek = [...new Set(gevonden)];
  if (uniek.length === 0) fout(`${slug}: geen --kickass-laag gevonden, laadt de laag wel?`);
  else if (uniek.length > 1) fout(`${slug}: CSS van meerdere varianten op één pagina: ${uniek.join(', ')}`);
  else if (uniek[0] !== slug) fout(`${slug}: draagt de laag van ${uniek[0]}`);
  else ok(`${slug}: pagina in orde en geïsoleerd`);
}

// De sitemap.
const sitemaps = ['dist/sitemap-0.xml', 'dist/sitemap-index.xml'];
for (const pad of sitemaps) {
  if (existsSync(pad) && readFileSync(pad, 'utf8').includes('/kickass')) {
    fout(`${pad} bevat /kickass`);
  }
}
ok('sitemap bevat geen /kickass');

// De mediabudgetten.
for (const [pad, max] of Object.entries(BUDGET)) {
  if (!existsSync(pad)) {
    console.log(`over   ${pad} bestaat nog niet, overgeslagen`);
    continue;
  }
  const grootte = statSync(pad).size;
  if (grootte > max) fout(`${pad} is ${(grootte / 1024).toFixed(0)} kB, budget is ${(max / 1024).toFixed(0)} kB`);
  else ok(`${pad}: ${(grootte / 1024).toFixed(0)} kB`);
}

if (fouten > 0) {
  console.error(`\n${fouten} fout(en).`);
  process.exit(1);
}
console.log('\nAlles in orde.');
