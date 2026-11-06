// Zet de site live op Hetzner: bouwt, pakt dist/ in en wisselt de map op de
// server in één keer om. Geen argumenten: de bestemming staat hier vast, zodat
// `npm run deploy` niets anders kan dan precies dit (zie les 60 in CLAUDE.md).
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const HOST = 'sdkdev';
const TARGET = '/srv/static/monkai';
const SITE = 'https://monkai.business/';

const build = spawnSync('npm run build', { stdio: 'inherit', shell: true });
if (build.status !== 0) {
  console.error('Build mislukt, er is niets online gezet.');
  process.exit(1);
}
if (!existsSync('dist/index.html')) {
  console.error('dist/index.html ontbreekt, er is niets online gezet.');
  process.exit(1);
}

// Uitpakken in een nieuwe map en pas daarna omwisselen, zodat de site nooit half
// gekopieerd online staat.
const remote = [
  'set -e',
  `rm -rf ${TARGET}.new`,
  `mkdir ${TARGET}.new`,
  `tar xzf - -C ${TARGET}.new`,
  `test -f ${TARGET}.new/index.html`,
  `rm -rf ${TARGET}.old`,
  `mv ${TARGET} ${TARGET}.old`,
  `mv ${TARGET}.new ${TARGET}`,
  `rm -rf ${TARGET}.old`,
].join('; ');

await new Promise((resolve, reject) => {
  const tar = spawn('tar', ['czf', '-', '-C', 'dist', '.'], { stdio: ['ignore', 'pipe', 'inherit'] });
  const ssh = spawn('ssh', ['-o', 'BatchMode=yes', HOST, remote], { stdio: ['pipe', 'inherit', 'inherit'] });
  tar.stdout.pipe(ssh.stdin);
  tar.on('error', reject);
  ssh.on('error', reject);
  tar.on('close', (code) => code !== 0 && reject(new Error(`tar stopte met code ${code}`)));
  ssh.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ssh stopte met code ${code}`))));
}).catch((error) => {
  console.error(`Deploy mislukt: ${error.message}`);
  process.exit(1);
});

const response = await fetch(`${SITE}?v=${Date.now()}`);
console.log(`Online gezet op ${HOST}:${TARGET}. ${SITE} geeft ${response.status}.`);
if (!response.ok) process.exit(1);
