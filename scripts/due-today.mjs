// Kijkt of er een goedgekeurde blogpost is waarvan de publicatiedag net
// aangebroken is. Draait in de nachtelijke GitHub Action, zodat we de Netlify
// build hook alleen aanroepen wanneer er echt iets te publiceren valt.
//
// Venster van twee dagen: als een nachtelijke run overgeslagen werd (GitHub
// stelt cronjobs soms uit, of de runner lag eruit), wordt de post de nacht
// erna alsnog opgepikt.
import { readdir, readFile } from 'node:fs/promises';
import { appendFile } from 'node:fs/promises';
import path from 'node:path';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const WINDOW_DAYS = 2;

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Brussels' });
const oldest = new Date(Date.parse(`${today}T00:00:00Z`) - (WINDOW_DAYS - 1) * 86400000)
  .toISOString()
  .slice(0, 10);

const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.md'));
const due = [];

for (const file of files) {
  const raw = await readFile(path.join(BLOG_DIR, file), 'utf8');
  const frontmatter = raw.split(/^---\s*$/m)[1] ?? '';
  const date = frontmatter.match(/^date:\s*"?(\d{4}-\d{2}-\d{2})"?/m)?.[1];
  const isDraft = /^draft:\s*true\s*$/m.test(frontmatter);
  if (!date || isDraft) continue;
  if (date >= oldest && date <= today) due.push(`${file} (${date})`);
}

console.log(`Vandaag in Brussel: ${today}`);
console.log(due.length ? `Te publiceren: ${due.join(', ')}` : 'Niets te publiceren.');

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `due=${due.length > 0}\n`);
}
