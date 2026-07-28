import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];
const read = (...parts) => readFileSync(join(root, ...parts), 'utf8');
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const theme = read('src', 'utils', 'theme.ts');
const toggle = read('src', 'components', 'ThemeToggle.astro');
const layout = read('src', 'layouts', 'BaseLayout.astro');
const tokens = read('src', 'styles', 'tokens.css');

expect(theme.includes("['light', 'dark', 'monkey']"), 'Monkey ontbreekt in THEMES.');
expect(!theme.includes('superpowers'), 'De oude superpowers-stand bestaat nog.');
expect(toggle.includes('src="/favicon.svg"'), 'Het favicon ontbreekt in de Monkey-knop.');
expect(toggle.includes('monkai-theme-change'), 'De thema-event ontbreekt.');
expect(toggle.includes('@media (max-width: 768px)'), 'De mobiele verberging ontbreekt.');
expect(layout.includes("chosen === 'monkey'"), 'De mobiele Monkey-fallback ontbreekt.');
expect(tokens.includes(":root[data-theme='monkey']"), 'Monkey gebruikt de dark tokens niet.');

const homeDataPath = join(root, 'src', 'data', 'home.ts');
expect(existsSync(homeDataPath), 'De gedeelde homepagegegevens ontbreken.');

if (existsSync(homeDataPath)) {
  const homeData = read('src', 'data', 'home.ts');
  for (const exportName of [
    'problemCards',
    'ladderLevels',
    'approachSteps',
    'services',
    'beyondChatRows',
    'agreement',
    'faqs',
  ]) {
    expect(homeData.includes(`export const ${exportName}`), `${exportName} ontbreekt.`);
  }
}

for (const file of ['FaqList.astro', 'ContactForm.astro']) {
  expect(existsSync(join(root, 'src', 'components', file)), `${file} ontbreekt.`);
}

const faqSection = read('src', 'components', 'Faq.astro');
const contactSection = read('src', 'components', 'Contact.astro');
expect(faqSection.includes('<FaqList'), 'Faq gebruikt FaqList niet.');
expect(contactSection.includes('<ContactForm'), 'Contact gebruikt ContactForm niet.');

const storyPath = join(root, 'src', 'components', 'ScrollStory.astro');
expect(existsSync(storyPath), 'ScrollStory ontbreekt.');

if (existsSync(storyPath)) {
  const story = read('src', 'components', 'ScrollStory.astro');
  const chapterIds = [
    'hero',
    'problemen',
    'overdracht',
    'team',
    'aanpak',
    'niveaus',
    'use-cases',
    'diensten',
    'breder-dan-chat',
    'ai-act',
    'afspraak',
    'blog',
    'faq',
    'contact',
  ];
  for (const id of chapterIds) {
    expect(story.includes(`data-chapter="${id}"`), `Hoofdstuk ${id} ontbreekt.`);
  }
  expect(story.includes('<FaqList compact={true}'), 'Compacte FAQ ontbreekt.');
  expect(
    story.includes('<ContactForm compact={true} idPrefix="monkey"'),
    'Compact contactformulier ontbreekt.',
  );
}

const index = read('src', 'pages', 'index.astro');
expect(index.includes('data-standard-home'), 'De standaardhomepage-wrapper ontbreekt.');
expect(index.includes('data-monkey-home'), 'De Monkey-homepage-wrapper ontbreekt.');

const story = read('src', 'components', 'ScrollStory.astro');
expect(story.includes('monkai-theme-change'), 'ScrollStory luistert niet naar themawissels.');
expect(story.includes('source.dataset.src'), 'Lazy videobronnen ontbreken.');
expect(story.includes("removeAttribute('src')"), 'Videobronnen worden niet vrijgegeven.');
expect(story.includes('IntersectionObserver'), 'Hoofdstukobservatie ontbreekt.');
expect(story.includes('requestAnimationFrame'), 'De scrubber gebruikt geen animation frame.');
expect(story.includes('scrollToMonkeyChapter'), 'Monkey-hoofdstuknavigatie ontbreekt.');
expect(story.includes('prefers-reduced-motion: reduce'), 'Reduced-motiondetectie ontbreekt.');
expect(story.includes("dataset.reduced = 'true'"), 'De statische reduced-motionstand ontbreekt.');

const nav = read('src', 'components', 'Nav.astro');
expect(nav.includes('monkeyTargets'), 'De Monkey-navigatiemapping ontbreekt.');
expect(nav.includes('scrollToMonkeyChapter'), 'De navigatie roept Monkey-hoofdstukken niet aan.');

const manifestPath = join(root, 'scripts', 'monkey-scenes.json');
expect(existsSync(manifestPath), 'Het filmscènemanifest ontbreekt.');
if (existsSync(manifestPath)) {
  const scenes = JSON.parse(readFileSync(manifestPath, 'utf8'));
  expect(scenes.length === 15, 'Het manifest moet de vijftien beschikbare clips bevatten.');
  expect(
    scenes.every((scene) => scene.id && scene.file && scene.duration),
    'Een filmscène is onvolledig.',
  );
}

const filmBuilder = read('scripts', 'build-scroll-story.ps1');
expect(filmBuilder.includes('monkey-scenes.json'), 'De filmbouwer leest het manifest niet.');
expect(filmBuilder.includes('ConvertFrom-Json'), 'De filmbouwer verwerkt het JSON-manifest niet.');
expect(!filmBuilder.includes('$sourceNames'), 'De filmbouwer bevat nog een harde bronlijst.');

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Monkey-themecontract geslaagd.');
