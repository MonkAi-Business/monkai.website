import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const componentPath = join(root, 'src', 'components', 'ScrollStory.astro');
const pagePath = join(root, 'src', 'pages', 'index.astro');
const mediaDirectory = join(root, 'public', 'media', 'scroll-story');

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

expect(existsSync(componentPath), 'ScrollStory.astro ontbreekt.');

if (existsSync(componentPath)) {
  const component = readFileSync(componentPath, 'utf8');
  const videoTag = component.match(/<video\b[\s\S]*?>/i)?.[0] ?? '';

  expect(/\bmuted\b/i.test(videoTag), 'De storyvideo moet muted zijn.');
  expect(/\bplaysinline\b/i.test(videoTag), 'De storyvideo moet playsinline zijn.');
  expect(!/\bcontrols\b/i.test(videoTag), 'De storyvideo mag geen native controls hebben.');
  expect(
    /monkai-scroll-story\.webm/.test(component) && /monkai-scroll-story\.mp4/.test(component),
    'De MP4- en WebM-bronnen ontbreken.',
  );
  expect(
    /media="\(min-width: 769px\)"/.test(component),
    'De videobronnen moeten alleen op grotere schermen aangeboden worden.',
  );

  const requiredCopy = [
    'AI zonder apenstreken.',
    'Van losse ideeën naar een werkbare flow.',
    'Klein beginnen. Herhalen. Beheersen.',
    'AI is breder dan chat.',
    'Je hoeft dit niet alleen uit te zoeken.',
    'Een aanpak die blijft staan.',
  ];

  for (const copy of requiredCopy) {
    expect(component.includes(copy), `Storytekst ontbreekt: "${copy}"`);
  }

  expect(
    component.includes('prefers-reduced-motion: reduce'),
    'De reduced-motion fallback ontbreekt.',
  );
  expect(component.includes('@media (max-width: 768px)'), 'De mobiele fallback ontbreekt.');
  expect(component.includes('data-scroll-story'), 'De scrollstory-hook ontbreekt.');
}

expect(existsSync(pagePath), 'De homepage ontbreekt.');

if (existsSync(pagePath)) {
  const page = readFileSync(pagePath, 'utf8');
  expect(page.includes("import ScrollStory from '../components/ScrollStory.astro'"), 'De homepage importeert ScrollStory niet.');
  expect(page.includes('<ScrollStory />'), 'De homepage rendert ScrollStory niet.');
  expect(!page.includes('<Hero />'), 'De oude Hero wordt nog gerenderd.');
}

for (const file of [
  'monkai-scroll-story.mp4',
  'monkai-scroll-story.webm',
  'monkai-scroll-story-poster.jpg',
]) {
  expect(existsSync(join(mediaDirectory, file)), `Media ontbreekt: ${file}`);
}

if (failures.length > 0) {
  console.error('Scrollstory-check mislukt:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Scrollstory-check geslaagd.');
