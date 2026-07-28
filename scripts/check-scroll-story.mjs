import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const componentPath = join(root, 'src', 'components', 'ScrollStory.astro');
const pagePath = join(root, 'src', 'pages', 'index.astro');
const mediaDirectory = join(root, 'public', 'media', 'scroll-story');
const manifestPath = join(root, 'scripts', 'monkey-scenes.json');

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
    /data-src="\/media\/scroll-story\/monkai-scroll-story\.webm"/.test(component)
      && /data-src="\/media\/scroll-story\/monkai-scroll-story\.mp4"/.test(component),
    'De videobronnen moeten lazy via data-src aangeboden worden.',
  );
  expect(!/\bposter=/.test(videoTag), 'De Monkey-video mag op mobiel geen poster aanvragen.');

  const requiredCopy = [
    'AI zonder apenstreken',
    'Van losse experimenten naar echte impact',
    'Werk slimmer. Niet afhankelijker.',
    'Klein team. Korte lijnen.',
    'Zo pakken we het aan',
    'Drie niveaus. Eén tempo.',
    'Van idee naar werkende oplossing',
    'Wat we voor je bouwen',
    'AI is meer dan een chatbot',
    'AI Act klaar, zonder rem op innovatie',
    'Een heldere afspraak',
    'Praktische AI-inzichten',
    'Veelgestelde vragen',
    'Klaar om iets slim te bouwen?',
  ];

  for (const copy of requiredCopy) {
    expect(component.includes(copy), `Storytekst ontbreekt: "${copy}"`);
  }

  expect(
    component.includes('prefers-reduced-motion: reduce'),
    'De reduced-motionstand ontbreekt.',
  );
  expect(component.includes('data-scroll-story'), 'De scrollstory-hook ontbreekt.');
  expect(component.includes("removeAttribute('src')"), 'De videobronnen worden niet vrijgegeven.');

  expect(
    (component.match(/footage: 'ready'/g) ?? []).length === 12,
    'Precies twaalf storyhoofdstukken moeten eigen beeldmateriaal hebben.',
  );
  expect(
    (component.match(/footage: 'pending'/g) ?? []).length === 2,
    'Alleen FAQ en contact mogen nog op beeldmateriaal wachten.',
  );
  expect(
    component.includes("{ id: 'faq', timeStart: 112.78, timeEnd: 112.78, footage: 'pending' }")
      && component.includes("{ id: 'contact', timeStart: 112.78, timeEnd: 112.78, footage: 'pending' }"),
    'FAQ en contact moeten het laatste blogframe op 112,78 seconden vasthouden.',
  );
}

expect(existsSync(pagePath), 'De homepage ontbreekt.');

if (existsSync(pagePath)) {
  const page = readFileSync(pagePath, 'utf8');
  expect(page.includes("import ScrollStory from '../components/ScrollStory.astro'"), 'De homepage importeert ScrollStory niet.');
  expect(page.includes('<ScrollStory />'), 'De homepage rendert ScrollStory niet.');
  expect(page.includes('<Hero />'), 'De gewone homepage mist de klassieke Hero.');
  expect(page.includes('data-standard-home'), 'De standaardhomepage-wrapper ontbreekt.');
  expect(page.includes('data-monkey-home'), 'De Monkey-homepage-wrapper ontbreekt.');
}

for (const file of [
  'monkai-scroll-story.mp4',
  'monkai-scroll-story.webm',
  'monkai-scroll-story-poster.jpg',
]) {
  expect(existsSync(join(mediaDirectory, file)), `Media ontbreekt: ${file}`);
}

expect(existsSync(manifestPath), 'Het filmscènemanifest ontbreekt.');

if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const expectedSceneIds = [
    'desk',
    'laptop',
    'door',
    'view',
    'vine',
    'team',
    'approach',
    'levels',
    'use-cases',
    'services',
    'beyond-chat',
    'ai-act',
    'agreement',
    'blog',
  ];

  expect(
    manifest.map((scene) => scene.id).join(',') === expectedSceneIds.join(','),
    'Het manifest moet de veertien filmscènes in de verhaallijnvolgorde bevatten.',
  );

  const expectedNewFiles = {
    levels: 'Monkey_climbs_three_platforms_202607281816.mp4',
    'use-cases': 'Create_this_clip_with_Veo_202607281830.mp4',
    services: 'Monkey_selects_tools_from_wall_202607281830.mp4',
    'beyond-chat': 'Monkey_puts_on_smart_glasses_202607281833.mp4',
    'ai-act': 'Monkey_passes_safety_checkpoint_202607281857.mp4',
    agreement: 'Two_monkeys_handshake_at_table_202607281857.mp4',
    blog: 'Monkey_writing_on_page_202607281858.mp4',
  };

  for (const [id, file] of Object.entries(expectedNewFiles)) {
    expect(
      manifest.some((scene) => scene.id === id && scene.file === file),
      `De bronvideo voor "${id}" ontbreekt of wijst naar het verkeerde bestand.`,
    );
  }
}

if (failures.length > 0) {
  console.error('Scrollstory-check mislukt:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Scrollstory-check geslaagd.');
