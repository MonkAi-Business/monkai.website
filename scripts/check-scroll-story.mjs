import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  AUTO_SCROLL_CHAPTER_MS,
  advanceAutoScroll,
  autoplayButtonState,
  isAutoplayScrollKey,
  resolveAutoScrollStart,
} from '../src/utils/scrollStoryAutoplay.mjs';
import { progressToTime } from '../src/utils/scrollStoryTiming.mjs';

const root = process.cwd();
const componentPath = join(root, 'src', 'components', 'ScrollStory.astro');
const pagePath = join(root, 'src', 'pages', 'index.astro');
const mediaDirectory = join(root, 'public', 'media', 'scroll-story');
const manifestPath = join(root, 'scripts', 'monkey-scenes.json');

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const sampleTimings = [{ timeStart: 10, timeEnd: 18 }];
const approximately = (actual, expected) => Math.abs(actual - expected) < 0.001;

expect(
  approximately(progressToTime(0.42, sampleTimings), 13.36),
  'Bij 42 procent moet de clip 42 procent gevorderd zijn.',
);
expect(
  approximately(progressToTime(0.85, sampleTimings), 16.8),
  'Bij 85 procent moet de clip nog bewegen.',
);
expect(
  approximately(progressToTime(1, sampleTimings), 18),
  'Bij 100 procent moet de clip het eindframe bereiken.',
);

const boundaryTimings = [
  { timeStart: 0, timeEnd: 8 },
  { timeStart: 8, timeEnd: 16 },
];
const beforeBoundary = progressToTime(0.499999, boundaryTimings);
const atBoundary = progressToTime(0.5, boundaryTimings);

expect(
  beforeBoundary < 8 && atBoundary === 8 && atBoundary > beforeBoundary,
  'De videotijd mag aan een hoofdstukgrens niet teruglopen.',
);

const autoplayStep = advanceAutoScroll({
  position: 100,
  elapsedMs: 3750,
  start: 0,
  end: 800,
  chapterCount: 1,
});

expect(AUTO_SCROLL_CHAPTER_MS === 7500, 'Autoplay moet 7,5 seconden per hoofdstuk gebruiken.');
expect(
  approximately(autoplayStep.position, 500) && autoplayStep.done === false,
  'Autoplay moet met een constant hoofdstuktempo vooruitgaan.',
);

const autoplayEnd = advanceAutoScroll({
  position: 750,
  elapsedMs: 1000,
  start: 0,
  end: 800,
  chapterCount: 1,
});

expect(
  autoplayEnd.position === 800 && autoplayEnd.done === true,
  'Autoplay moet exact aan het contacteindpunt stoppen.',
);
expect(
  resolveAutoScrollStart(800, 0, 800) === 0,
  'Play aan het einde moet opnieuw aan het begin starten.',
);
expect(
  resolveAutoScrollStart(320, 0, 800) === 320,
  'Play binnen de story moet vanaf de huidige positie hervatten.',
);

const stoppedButton = autoplayButtonState(false);
const playingButton = autoplayButtonState(true);

expect(
  stoppedButton.ariaLabel === 'Monkey-tour afspelen'
    && stoppedButton.ariaPressed === 'false'
    && stoppedButton.playing === 'false',
  'De gestopte autoplayknop moet een toegankelijke Play-status geven.',
);
expect(
  playingButton.ariaLabel === 'Monkey-tour pauzeren'
    && playingButton.ariaPressed === 'true'
    && playingButton.playing === 'true',
  'De actieve autoplayknop moet een toegankelijke Pauze-status geven.',
);
expect(
  isAutoplayScrollKey('PageDown') && !isAutoplayScrollKey('Enter'),
  'Alleen toetsen die de pagina scrollen mogen autoplay stoppen.',
);

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
    component.includes('class="monkey-link monkey-link-outline" href="#monkey-aanpak"'),
    'De hero-link naar de aanpak mist de outline-stijl.',
  );
  expect(
    /\.monkey-actions \.btn\s*\{[\s\S]*height:\s*50px;[\s\S]*cursor:\s*pointer;/.test(component)
      && /\.monkey-link-outline\s*\{[\s\S]*height:\s*50px;[\s\S]*cursor:\s*pointer;/.test(component),
    'De hero-acties moeten exact even hoog zijn en een handcursor gebruiken.',
  );
  expect(
    /class="monkey-progress-cluster"[\s\S]*class="monkey-progress"[\s\S]*data-story-autoplay/.test(component),
    'De autoplayknop moet direct onder de voortgangsindicator gegroepeerd zijn.',
  );
  expect(
    /<\/div>\s*<div class="monkey-progress-anchor">[\s\S]*class="monkey-progress-cluster"[\s\S]*<div class="monkey-chapters">/.test(component),
    'De voortgangsbediening moet als klikbare laag tussen de stage en hoofdstukken staan.',
  );
  expect(
    /\.monkey-autoplay\s*\{[\s\S]*width:\s*34px;[\s\S]*height:\s*34px;[\s\S]*opacity:\s*0\.68;/.test(component),
    'De autoplayknop moet compact en visueel subtiel zijn.',
  );

  expect(
    (component.match(/footage: 'ready'/g) ?? []).length === 13,
    'Precies dertien storyhoofdstukken moeten eigen beeldmateriaal hebben.',
  );
  expect(
    (component.match(/footage: 'pending'/g) ?? []).length === 1,
    'Alleen contact mag nog op beeldmateriaal wachten.',
  );
  expect(
    component.includes("{ id: 'faq', timeStart: 112.78, timeEnd: 120.6, footage: 'ready' }")
      && component.includes("{ id: 'contact', timeStart: 120.6, timeEnd: 120.6, footage: 'pending' }"),
    'FAQ moet eigen beeld hebben en contact moet het laatste FAQ-frame op 120,60 seconden vasthouden.',
  );

  const expectedPanelLayouts = {
    hero: ['left', 'middle', 'normal'],
    problemen: ['left', 'middle', 'normal'],
    overdracht: ['left', 'middle', 'compact'],
    team: ['left', 'middle', 'compact'],
    aanpak: ['right', 'middle', 'compact'],
    niveaus: ['right', 'middle', 'compact'],
    'use-cases': ['left', 'bottom', 'compact'],
    diensten: ['left', 'bottom', 'wide'],
    'breder-dan-chat': ['right', 'bottom', 'compact'],
    'ai-act': ['left', 'bottom', 'compact'],
    afspraak: ['left', 'top', 'compact'],
    blog: ['left', 'bottom', 'compact'],
    faq: ['left', 'top', 'compact'],
    contact: ['left', 'middle', 'compact'],
  };
  const chapterTags = [...component.matchAll(/<section\b[^>]*\bdata-monkey-chapter\b[^>]*>/g)]
    .map((match) => match[0]);
  const attribute = (tag, name) => tag.match(new RegExp(`${name}="([^"]+)"`))?.[1];

  for (const [id, [side, vertical, size]] of Object.entries(expectedPanelLayouts)) {
    const tag = chapterTags.find((candidate) => attribute(candidate, 'data-chapter') === id) ?? '';
    expect(attribute(tag, 'data-panel-side') === side, `${id} heeft de verkeerde paneelzijde.`);
    expect(
      attribute(tag, 'data-panel-vertical') === vertical,
      `${id} heeft de verkeerde verticale paneelpositie.`,
    );
    expect(attribute(tag, 'data-panel-size') === size, `${id} heeft het verkeerde paneelformaat.`);
  }

  expect(
    component.includes('story.dataset.activePanelSide'),
    'De videolaag volgt de actieve paneelzijde niet.',
  );
  expect(
    component.includes('background: rgba(3, 13, 19, 0.64);'),
    'Het paneel is niet transparant genoeg.',
  );
  expect(
    component.includes('backdrop-filter: blur(16px);'),
    'De transparantere panelen missen extra vervaging.',
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
    'faq',
  ];

  expect(
    manifest.map((scene) => scene.id).join(',') === expectedSceneIds.join(','),
    'Het manifest moet de vijftien filmscènes in de verhaallijnvolgorde bevatten.',
  );

  const expectedNewFiles = {
    levels: 'Monkey_climbs_three_platforms_202607281816.mp4',
    'use-cases': 'Create_this_clip_with_Veo_202607281830.mp4',
    services: 'Monkey_selects_tools_from_wall_202607281830.mp4',
    'beyond-chat': 'Monkey_puts_on_smart_glasses_202607281833.mp4',
    'ai-act': 'Monkey_passes_safety_checkpoint_202607281857.mp4',
    agreement: 'Two_monkeys_handshake_at_table_202607281857.mp4',
    blog: 'Monkey_writing_on_page_202607281858.mp4',
    faq: 'Monkeys_open_hatches_with_vines_202607281906.mp4',
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
