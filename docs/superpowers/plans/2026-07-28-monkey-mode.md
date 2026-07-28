# Desktop Monkey Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a desktop-only Monkey theme that replaces the ordinary homepage with one complete scroll-controlled film experience while Light and Dark retain the current homepage.

**Architecture:** The theme layer gains `monkey` as its third persisted value and emits a browser event whenever the user switches modes. The homepage renders a standard variant and a Monkey variant; CSS and small lifecycle scripts expose only the active one. The Monkey variant owns one lazily loaded silent masterfilm, fourteen semantic HTML chapters and reusable FAQ/contact elements sourced from the same content data as the standard homepage.

**Tech Stack:** Astro 5, TypeScript, CSS, native browser video APIs, Node contract checks, PowerShell and FFmpeg.

## Global Constraints

- Valid themes are exactly `light`, `dark` and `monkey`.
- Monkey mode uses the dark color tokens.
- The Monkey switch segment uses `/favicon.svg`.
- Monkey mode is available only above 768 pixels.
- A stored Monkey mode falls back to Dark at 768 pixels or below.
- Mobile must never request the Monkey poster, MP4 or WebM.
- Light and Dark retain the existing ordinary homepage.
- Monkey mode covers all fourteen homepage chapters from the approved specification.
- The masterfilm remains one silent video assembled from separate Veo 3.1 clips.
- Generated video contains no readable text.
- Do not add an animation library.
- Do not use em dashes or en dashes in code, copy, comments, documentation or commits.

---

### Task 1: Add the Monkey theme contract

**Files:**

- Create: `scripts/check-monkey-mode.mjs`
- Modify: `package.json`
- Modify: `src/utils/theme.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/ThemeToggle.astro`
- Modify: `src/styles/tokens.css`

**Interfaces:**

- Produces: `Theme = 'light' | 'dark' | 'monkey'`
- Produces: browser event `monkai-theme-change` with `detail: { theme: Theme }`
- Produces: desktop button `[data-theme-set="monkey"]`

- [ ] **Step 1: Write the failing theme contract**

Create `scripts/check-monkey-mode.mjs` with:

```js
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
expect(toggle.includes("monkai-theme-change"), 'De thema-event ontbreekt.');
expect(toggle.includes('@media (max-width: 768px)'), 'De mobiele verberging ontbreekt.');
expect(layout.includes("chosen === 'monkey'"), 'De mobiele Monkey-fallback ontbreekt.');
expect(tokens.includes(":root[data-theme='monkey']"), 'Monkey gebruikt de dark tokens niet.');

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Monkey-themecontract geslaagd.');
```

Add to `package.json`:

```json
"check:monkey": "node scripts/check-monkey-mode.mjs"
```

- [ ] **Step 2: Run the contract and verify the red state**

Run: `npm.cmd run check:monkey`

Expected: FAIL for the missing Monkey theme, icon and event.

- [ ] **Step 3: Replace the dormant third theme**

Change `src/utils/theme.ts` to:

```ts
export const THEMES = ['light', 'dark', 'monkey'] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = 'light';
export const STORAGE_KEY = 'monkai_theme';

export const TOGGLE_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Licht' },
  { value: 'dark', label: 'Donker' },
  { value: 'monkey', label: 'Monkey mode' },
];
```

- [ ] **Step 4: Add the icon and desktop-only switch behavior**

In `ThemeToggle.astro`, render the Monkey icon as:

```astro
{option.value === 'monkey' ? (
  <img src="/favicon.svg" width="17" height="17" alt="" aria-hidden="true" />
) : (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    set:html={icons[option.value]}
  />
)}
```

Keep the current literal icon paths in `icons` for `light` and `dark`:

```ts
const icons = {
  light: `<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M21.4 12h-2.2M4.8 12H2.6M18.6 5.4 17 7M7 17l-1.6 1.6M18.6 18.6 17 17M7 7 5.4 5.4"/>`,
  dark: `<path d="M20.5 14.4A8.6 8.6 0 0 1 9.6 3.5a8.6 8.6 0 1 0 10.9 10.9Z"/>`,
} as const;
```

After applying a theme, emit:

```ts
window.dispatchEvent(new CustomEvent('monkai-theme-change', {
  detail: { theme: thema },
}));
```

Add:

```css
@media (max-width: 768px) {
  .theme-toggle button[data-theme-set='monkey'] {
    display: none;
  }
}
```

On a media-query change to mobile while Monkey is active, call `pasToe('dark')`.

- [ ] **Step 5: Apply the mobile fallback before first paint**

In the blocking head script in `BaseLayout.astro`, after resolving `chosen`, add:

```js
if (chosen === 'monkey' && window.matchMedia('(max-width: 768px)').matches) {
  chosen = 'dark';
  try {
    window.localStorage.setItem(key, chosen);
  } catch (e) {
    // The selected theme still applies for this page.
  }
}
```

- [ ] **Step 6: Give Monkey the dark token set**

Change the selector in `tokens.css` to:

```css
:root[data-theme='dark'],
:root[data-theme='monkey'] {
```

Remove comments and branches that describe the dormant superpowers mode.

- [ ] **Step 7: Verify and commit Task 1**

Run:

```text
npm.cmd run check:monkey
npm.cmd run build
```

Expected: both commands exit 0.

Commit:

```text
git add package.json scripts/check-monkey-mode.mjs src/utils/theme.ts src/layouts/BaseLayout.astro src/components/ThemeToggle.astro src/styles/tokens.css
git commit -m "feat: add desktop monkey theme"
```

---

### Task 2: Centralize shared homepage content

**Files:**

- Create: `src/data/home.ts`
- Modify: `src/components/Problem.astro`
- Modify: `src/components/Ladder.astro`
- Modify: `src/components/Approach.astro`
- Modify: `src/components/Services.astro`
- Modify: `src/components/BeyondChat.astro`
- Modify: `src/components/Agreement.astro`
- Modify: `src/components/Faq.astro`
- Modify: `scripts/check-monkey-mode.mjs`

**Interfaces:**

- Produces: `problemCards`, `ladderLevels`, `approachSteps`, `services`, `beyondChatRows`, `agreement`, `faqs`
- Consumers: ordinary homepage components and `ScrollStory.astro`

- [ ] **Step 1: Extend the failing contract**

Add these checks to `scripts/check-monkey-mode.mjs`:

```js
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
```

Run: `npm.cmd run check:monkey`

Expected: FAIL because `src/data/home.ts` does not exist.

- [ ] **Step 2: Define the shared types and exports**

Create `src/data/home.ts` with these public shapes:

```ts
export type TitledText = { title: string; text: string };
export type NumberedStep = TitledText & { num: string };
export type Faq = { q: string; a: string };

export const problemCards: TitledText[] = [
  {
    title: 'Kopiëren en plakken',
    text: 'Bestellingen uit mails overtypen in het ERP. Gegevens van het ene systeem naar het andere slepen. Elke dag opnieuw.',
  },
  {
    title: 'Kennis in mailboxen',
    text: 'De beste antwoorden zitten in de mailbox van één collega. Valt die persoon uit, dan valt de kennis uit.',
  },
  {
    title: 'Stiekem experimenteren',
    text: 'Medewerkers proberen al AI, vaak met bedrijfsdata in een privé-account. Dat is geen probleem, dat is brandstof. Het heeft alleen een veilig kader nodig.',
  },
];

export const ladderLevels: TitledText[] = [
  {
    title: 'Automatiseren',
    text: 'Repetitieve back-office taken wegnemen met AI-automatisaties in n8n, Make of vergelijkbare tools. Bijvoorbeeld: bonnetjes en facturen automatisch laten lezen, hernoemen, taggen, in de juiste map zetten en doorsturen naar de boekhouding.',
  },
  {
    title: 'Onthouden',
    text: 'Een second brain voor jezelf, een collective brain voor het bedrijf: één gedeeld bedrijfsgeheugen waar kennis niet langer alleen in hoofden zit. Kennis zo structureren dat je in minuten een eerste versie hebt in plaats van in dagen. Het fundament is een eenvoudige data-architectuur: kennis op één plek, met duidelijke afspraken over wie wat ziet.',
  },
  {
    title: 'Versnellen',
    text: 'Accelerated coding: ontwikkelteams die met AI sneller en met betere kwaliteit werken, met behoud van controle en security.',
  },
];

export const approachSteps: NumberedStep[] = [
  {
    num: '01',
    title: 'Inspireren',
    text: 'Een sessie van twee uur die toont wat AI vandaag kan, met voorbeelden uit jouw sector.',
  },
  {
    num: '02',
    title: 'Kiezen',
    text: 'Samen de use cases selecteren met de beste verhouding tussen impact en moeite.',
  },
  {
    num: '03',
    title: 'Experimenteren',
    text: 'Klein en veilig proberen, met echte data in een afgesproken kader. Wat werkt blijft.',
  },
  {
    num: '04',
    title: 'Verankeren',
    text: 'Afspraken, begeleiding en overdracht. Jouw mensen nemen het over, ik stap terug.',
  },
];

export const services: TitledText[] = [
  {
    title: 'AI-inspiratiesessie',
    text: 'Twee uur, max 10 deelnemers, bij jou op locatie. Het vertrekpunt van elk traject.',
  },
  {
    title: 'Use case workshop',
    text: 'Ideeën verzamelen en wegen op een impact/effort-matrix. Je vertrekt met drie haalbare cases.',
  },
  {
    title: 'AI-geletterdheid en AI-maturiteit',
    text: 'Waar staat je team vandaag? We werken op maat van elk niveau, van sceptisch tot gevorderd.',
  },
  {
    title: 'AI-governance en EU AI Act',
    text: 'Duidelijke afspraken over data, tools en verantwoordelijkheid. Klaar voor de wet, zonder juristentaal.',
  },
  {
    title: 'Claude voor kenniswerkers',
    text: 'In kleine groepen leren kenniswerkers veilig en slim werken met Claude, op hun eigen taken.',
  },
  {
    title: 'Claude voor developers',
    text: 'Accelerated coding: sneller ontwikkelen met Claude als assistent, met behoud van controle en kwaliteit. In kleine groepen, op jullie eigen code.',
  },
  {
    title: 'Microsoft 365 Copilot veilig inzetten',
    text: 'Copilot staat vaak al aan. Ik help je het veilig en zinvol gebruiken.',
  },
  {
    title: 'Het juiste model kiezen',
    text: 'Niet gebonden aan één leverancier. Ook ChatGPT, Gemini en Chinese modellen zoals Z.Ai en KIMI komen op tafel als ze beter passen.',
  },
];

export const beyondChatRows: TitledText[] = [
  { title: 'Augmented reality', text: 'instructies op de plek waar je werkt' },
  { title: 'Smart glasses', text: 'handen vrij, informatie in beeld' },
  { title: 'Computer vision', text: "camera's die controleren en tellen" },
  { title: 'Connected worker', text: 'de werkvloer verbonden met de systemen' },
];

export const agreement = {
  monkai: [
    'Heldere uitleg, zonder jargon en zonder hype.',
    'Een aanpak die overdraagt in plaats van bindt.',
    "Ervaring met processen van Vlaamse KMO's.",
    'Eerlijk advies, ook als AI niet het antwoord is.',
  ],
  customer: [
    'Minstens één persoon die dit intern mee draagt. Dit is de belangrijkste voorwaarde.',
    'Tijd om te experimenteren tussen de sessies door.',
    'Toegang tot echte processen en voorbeelden.',
    'De wil om klein te beginnen.',
  ],
} as const;

export const faqs: Faq[] = [
  {
    q: 'In welke regio geef je AI-training en AI-adoptiecoaching?',
    a: "Ik werk op locatie bij KMO's in heel Oost-Vlaanderen en West-Vlaanderen. Vanuit Oudenaarde, in de Vlaamse Ardennen, ben ik snel in Gent, Kortrijk en alles daartussen. Voor bedrijven net buiten die regio bekijken we het per geval.",
  },
  {
    q: 'Wat is AI-adoptie precies?',
    a: 'AI-adoptie is het proces waarbij een organisatie AI niet alleen aankoopt, maar ook echt gebruikt in het dagelijkse werk. Het draait om mensen en gewoontes, niet om technologie: klein beginnen met concrete taken, herhalen tot het vanzelf gaat, en de kennis in huis houden.',
  },
  {
    q: 'Doe je Claude-training voor bedrijven?',
    a: 'Ik werk met inspiratiesessies en sparringsessies in kleine groepen, waarin je team leert om veilig en slim met Claude te werken op de eigen taken. Zoek je een uitgebreide, formele opleiding? Dan verwijs ik je gericht door naar de juiste partner. Zo krijg je altijd de aanpak die bij je vraag past.',
  },
  {
    q: 'Wat is het verschil tussen een second brain en een collective brain?',
    a: 'Een second brain is een persoonlijk kennissysteem: je legt vast wat je leert zodat je het later terugvindt. Een collective brain tilt dat naar bedrijfsniveau: één gedeeld bedrijfsgeheugen waar kennis niet langer alleen in hoofden zit, maar op één plek staat en met AI bevraagbaar is.',
  },
  {
    q: 'Voor wie is MonkAi Business bedoeld?',
    a: "Voor Vlaamse KMO's die met AI aan de slag willen zonder erin te verdrinken. Je werkt rechtstreeks met Stijn De Ketelaere, zonder tussenlagen, van de eerste sessie tot het moment dat je team het zelf kan.",
  },
  {
    q: 'Hoe start een traject?',
    a: 'Elk traject begint met een AI-inspiratiesessie: twee uur, tot tien deelnemers, bij jou op locatie. Daarna kiezen we samen enkele haalbare use cases en bouwen we stap voor stap op. Je verbindt je nergens toe op voorhand.',
  },
];
```

- [ ] **Step 3: Make ordinary components consume the shared values**

Replace each local array with an import. Example:

```astro
---
import { problemCards } from '../data/home';
---
```

Render the imported values without changing visible copy or CSS. Keep the `FAQPage` schema derived from imported `faqs`.

- [ ] **Step 4: Verify and commit Task 2**

Run:

```text
npm.cmd run check:monkey
npm.cmd run build
```

Expected: both commands exit 0 and the ordinary homepage copy remains unchanged.

Commit:

```text
git add scripts/check-monkey-mode.mjs src/data/home.ts src/components/Problem.astro src/components/Ladder.astro src/components/Approach.astro src/components/Services.astro src/components/BeyondChat.astro src/components/Agreement.astro src/components/Faq.astro
git commit -m "refactor: share homepage content"
```

---

### Task 3: Extract reusable FAQ and contact interfaces

**Files:**

- Create: `src/components/FaqList.astro`
- Create: `src/components/ContactForm.astro`
- Modify: `src/components/Faq.astro`
- Modify: `src/components/Contact.astro`
- Modify: `scripts/check-monkey-mode.mjs`

**Interfaces:**

- Produces: `<FaqList compact={boolean} />`
- Produces: `<ContactForm compact={boolean} idPrefix={string} />`
- Consumers: standard FAQ/contact sections and Monkey chapters

- [ ] **Step 1: Add failing reuse checks**

Add:

```js
for (const file of ['FaqList.astro', 'ContactForm.astro']) {
  expect(existsSync(join(root, 'src', 'components', file)), `${file} ontbreekt.`);
}

const faqSection = read('src', 'components', 'Faq.astro');
const contactSection = read('src', 'components', 'Contact.astro');
expect(faqSection.includes('<FaqList'), 'Faq gebruikt FaqList niet.');
expect(contactSection.includes('<ContactForm'), 'Contact gebruikt ContactForm niet.');
```

Run: `npm.cmd run check:monkey`

Expected: FAIL for both missing reusable components.

- [ ] **Step 2: Extract the FAQ list**

`FaqList.astro` imports `faqs`, accepts `compact = false`, renders the existing `<details>` list and retains the `faq_expanded` event. Use a modifier class when compact:

```astro
---
import { faqs } from '../data/home';
const { compact = false } = Astro.props;
---
<div class:list={['faq-list', { 'faq-list-compact': compact }]}>
  {faqs.map((faq) => (
    <details class="faq-item">
      <summary>{faq.q}</summary>
      <p>{faq.a}</p>
    </details>
  ))}
</div>
```

Keep the `FAQPage` JSON-LD in `Faq.astro`, where it remains emitted once.

- [ ] **Step 3: Extract the contact form**

Move the existing form markup, subject-building script and form-field CSS into `ContactForm.astro`. Accept `compact = false` and `idPrefix = 'standard'`. Add `contact-form-compact` when compact is true. Prefix every input id and matching label `for` value:

```astro
---
const { compact = false, idPrefix = 'standard' } = Astro.props;
const fieldId = (name: string) => `${idPrefix}-${name}`;
---
<label for={fieldId('naam')}>Naam</label>
<input id={fieldId('naam')} name="naam" />
```

The form script must scope every query to its own form element so both rendered variants cannot update each other.

The component must keep:

```astro
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/bedankt">
```

It must also keep `form-name`, `subject`, `bot-field`, all five user fields, consent checkbox and submit button exactly once per active homepage variant.

- [ ] **Step 4: Recompose the standard sections**

`Faq.astro` retains its heading, lede and JSON-LD, then renders `<FaqList />`.

`Contact.astro` retains its heading and introductory paragraph, then renders `<ContactForm idPrefix="standard" />`.

- [ ] **Step 5: Verify and commit Task 3**

Run:

```text
npm.cmd run check:monkey
npm.cmd run build
```

Expected: both commands exit 0 and Netlify form markup remains in `dist/index.html`.

Commit:

```text
git add scripts/check-monkey-mode.mjs src/components/FaqList.astro src/components/ContactForm.astro src/components/Faq.astro src/components/Contact.astro
git commit -m "refactor: reuse faq and contact"
```

---

### Task 4: Build the complete Monkey homepage structure

**Files:**

- Modify: `src/pages/index.astro`
- Replace: `src/components/ScrollStory.astro`
- Modify: `scripts/check-monkey-mode.mjs`

**Interfaces:**

- Produces: `[data-standard-home]`
- Produces: `[data-monkey-home]`
- Produces: fourteen `[data-monkey-chapter]` elements
- Consumes: shared homepage data, blog collection, use-case collection, `FaqList`, `ContactForm`

- [ ] **Step 1: Add failing chapter checks**

Add:

```js
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
  expect(story.includes('<ContactForm compact={true} idPrefix="monkey"'), 'Compact contactformulier ontbreekt.');
}

const index = read('src', 'pages', 'index.astro');
expect(index.includes('data-standard-home'), 'De standaardhomepage-wrapper ontbreekt.');
expect(index.includes('data-monkey-home'), 'De Monkey-homepage-wrapper ontbreekt.');
```

Run: `npm.cmd run check:monkey`

Expected: FAIL for the wrappers and missing chapters.

- [ ] **Step 2: Restore the ordinary homepage**

In `index.astro`, import `Hero` again. Wrap the current ordinary sequence:

```astro
<div data-standard-home>
  <Hero />
  <Problem />
  <Statement />
  <Ladder />
  <Approach />
  <UseCases />
  <Services />
  <BeyondChat />
  <AiAct />
  <Agreement />
  <BlogTeaser />
  <Team />
  <Faq />
  <Contact />
</div>
```

Render the Monkey variant after it:

```astro
<div data-monkey-home hidden>
  <ScrollStory />
</div>
```

- [ ] **Step 3: Define the fourteen chapter records**

In the Astro frontmatter of `ScrollStory.astro`, import the shared arrays, `getCollection`, `FaqList` and `ContactForm`. Create chapter data with exact ids:

```ts
const chapters = [
  { id: 'hero', timeStart: 0.0, timeEnd: 7.82, footage: 'ready' },
  { id: 'problemen', timeStart: 7.82, timeEnd: 15.64, footage: 'ready' },
  { id: 'overdracht', timeStart: 15.64, timeEnd: 32.98, footage: 'ready' },
  { id: 'team', timeStart: 32.98, timeEnd: 50.04, footage: 'ready' },
  { id: 'aanpak', timeStart: 50.04, timeEnd: 58.04, footage: 'ready' },
  { id: 'niveaus', timeStart: 58.04, timeEnd: 58.04, footage: 'pending' },
  { id: 'use-cases', timeStart: 58.04, timeEnd: 58.04, footage: 'pending' },
  { id: 'diensten', timeStart: 58.04, timeEnd: 58.04, footage: 'pending' },
  { id: 'breder-dan-chat', timeStart: 58.04, timeEnd: 58.04, footage: 'pending' },
  { id: 'ai-act', timeStart: 58.04, timeEnd: 58.04, footage: 'pending' },
  { id: 'afspraak', timeStart: 58.04, timeEnd: 58.04, footage: 'pending' },
  { id: 'blog', timeStart: 58.04, timeEnd: 58.04, footage: 'pending' },
  { id: 'faq', timeStart: 58.04, timeEnd: 58.04, footage: 'pending' },
  { id: 'contact', timeStart: 58.04, timeEnd: 58.04, footage: 'pending' },
] as const;
```

The chapter order follows the existing visual journey first: desk, laptop, door and jungle, swing and team platform, then the approach objects. The nine new topic clips are appended after that sequence. Until they arrive, their chapters hold the final available frame at 58.04 seconds. Their HTML is complete now; only their matching footage is pending.

- [ ] **Step 4: Render semantic chapter panels**

Use this outer structure:

```astro
<section class="monkey-story" data-scroll-story>
  <div class="monkey-stage">
    <video muted playsinline preload="none" aria-hidden="true" tabindex="-1" data-story-video>
      <source data-src="/media/scroll-story/monkai-scroll-story.webm" type="video/webm" />
      <source data-src="/media/scroll-story/monkai-scroll-story.mp4" type="video/mp4" />
    </video>
    <div class="monkey-shade" aria-hidden="true"></div>
  </div>
  <div class="monkey-chapters">
    <section data-monkey-chapter data-chapter="hero"><h1>AI zonder apenstreken</h1></section>
    <section data-monkey-chapter data-chapter="problemen"><h2>Van losse experimenten naar echte impact</h2></section>
    <section data-monkey-chapter data-chapter="overdracht"><h2>Werk slimmer. Niet afhankelijker.</h2></section>
    <section data-monkey-chapter data-chapter="team"><h2>Klein team. Korte lijnen.</h2></section>
    <section data-monkey-chapter data-chapter="aanpak"><h2>Zo pakken we het aan</h2></section>
    <section data-monkey-chapter data-chapter="niveaus"><h2>Drie niveaus. Eén groeipad.</h2></section>
    <section data-monkey-chapter data-chapter="use-cases"><h2>Van idee naar werkende oplossing</h2></section>
    <section data-monkey-chapter data-chapter="diensten"><h2>Wat we voor je bouwen</h2></section>
    <section data-monkey-chapter data-chapter="breder-dan-chat"><h2>AI is meer dan een chatbot</h2></section>
    <section data-monkey-chapter data-chapter="ai-act"><h2>AI Act klaar, zonder rem op innovatie</h2></section>
    <section data-monkey-chapter data-chapter="afspraak"><h2>Een heldere afspraak</h2></section>
    <section data-monkey-chapter data-chapter="blog"><h2>Praktische AI-inzichten</h2></section>
    <section data-monkey-chapter data-chapter="faq"><h2>Veelgestelde vragen</h2></section>
    <section data-monkey-chapter data-chapter="contact"><h2>Klaar om iets slim te bouwen?</h2></section>
  </div>
</section>
```

Each chapter is at least `100svh`. Use the literal approved headings and shared arrays. Services render all nine items, use cases render all six current collection entries, FAQ renders `<FaqList compact={true} />` and contact renders `<ContactForm compact={true} idPrefix="monkey" />`.

- [ ] **Step 5: Add active-variant CSS**

In `index.astro`:

```css
[data-monkey-home] {
  display: none;
}

:global(:root[data-theme='monkey']) [data-standard-home] {
  display: none;
}

:global(:root[data-theme='monkey']) [data-monkey-home] {
  display: block;
}

@media (max-width: 768px) {
  [data-monkey-home] {
    display: none !important;
  }

  [data-standard-home] {
    display: block !important;
  }
}
```

The script in Task 5 synchronizes `hidden` and `aria-hidden`; CSS prevents a visible flash.

- [ ] **Step 6: Verify and commit Task 4**

Run:

```text
npm.cmd run check:monkey
npm.cmd run build
```

Expected: both commands exit 0 and all fourteen chapters exist in `dist/index.html`.

Commit:

```text
git add scripts/check-monkey-mode.mjs src/pages/index.astro src/components/ScrollStory.astro
git commit -m "feat: add complete monkey homepage"
```

---

### Task 5: Add mode lifecycle, scrubbing and chapter navigation

**Files:**

- Modify: `src/components/ScrollStory.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Nav.astro`
- Modify: `scripts/check-monkey-mode.mjs`

**Interfaces:**

- Consumes: `monkai-theme-change`
- Produces: lazy source attachment only while Monkey is active on desktop
- Produces: `scrollToMonkeyChapter(id: string): void`

- [ ] **Step 1: Add failing lifecycle checks**

Add:

```js
const story = read('src', 'components', 'ScrollStory.astro');
expect(story.includes("monkai-theme-change"), 'ScrollStory luistert niet naar themawissels.');
expect(story.includes("source.dataset.src"), 'Lazy videobronnen ontbreken.');
expect(story.includes("removeAttribute('src')"), 'Videobronnen worden niet vrijgegeven.');
expect(story.includes('IntersectionObserver'), 'Hoofdstukobservatie ontbreekt.');
expect(story.includes('requestAnimationFrame'), 'De scrubber gebruikt geen animation frame.');
expect(story.includes('scrollToMonkeyChapter'), 'Monkey-hoofdstuknavigatie ontbreekt.');
```

Run: `npm.cmd run check:monkey`

Expected: FAIL for the missing lifecycle.

- [ ] **Step 2: Synchronize the homepage variants**

In `index.astro`, define:

```ts
function syncHomepageVariant() {
  const isDesktop = window.matchMedia('(min-width: 769px)').matches;
  const monkey = document.documentElement.dataset.theme === 'monkey' && isDesktop;
  const standard = document.querySelector<HTMLElement>('[data-standard-home]');
  const story = document.querySelector<HTMLElement>('[data-monkey-home]');

  if (standard) {
    standard.hidden = monkey;
    standard.setAttribute('aria-hidden', String(monkey));
  }
  if (story) {
    story.hidden = !monkey;
    story.setAttribute('aria-hidden', String(!monkey));
  }
}
```

Call it on load, `monkai-theme-change` and breakpoint changes.

- [ ] **Step 3: Attach and release media sources**

In `ScrollStory.astro`:

```ts
function loadVideo() {
  sources.forEach((source) => {
    if (!source.src && source.dataset.src) source.src = source.dataset.src;
  });
  video.load();
}

function releaseVideo() {
  video.pause();
  sources.forEach((source) => source.removeAttribute('src'));
  video.removeAttribute('src');
  video.load();
}
```

Call `loadVideo()` only when the current theme is Monkey, the viewport is desktop and reduced motion is not requested. Call `releaseVideo()` when leaving Monkey, crossing to mobile or enabling reduced motion.

- [ ] **Step 4: Implement the reduced-motion path**

Use both media queries as live inputs:

```ts
const desktop = window.matchMedia('(min-width: 769px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function canScrub() {
  return document.documentElement.dataset.theme === 'monkey'
    && desktop.matches
    && !reducedMotion.matches;
}
```

When reduced motion is active, set `data-reduced="true"` on the story, release the film and expose every chapter as ordinary static dark content:

```css
.monkey-story[data-reduced='true'] .monkey-stage {
  display: none;
}

.monkey-story[data-reduced='true'] .monkey-chapter {
  min-height: auto;
  padding-block: 4.5rem;
  opacity: 1;
  transform: none;
}
```

- [ ] **Step 5: Map scroll to time with reading holds**

Calculate overall progress from the story rectangle. Use a piecewise mapping:

```ts
type ChapterTiming = {
  timeStart: number;
  timeEnd: number;
};

function progressToTime(progress: number, timings: readonly ChapterTiming[]) {
  const chapterPosition = Math.min(
    Math.max(progress, 0) * timings.length,
    timings.length - Number.EPSILON,
  );
  const chapterIndex = Math.min(Math.floor(chapterPosition), timings.length - 1);
  const local = chapterPosition - chapterIndex;
  const move = local < 0.42 ? local / 0.42 : 1;
  const chapter = timings[chapterIndex];
  return chapter.timeStart + (chapter.timeEnd - chapter.timeStart) * move;
}
```

This advances the video during the first 42 percent of a chapter and holds its frame for the reading zone. Pending chapters have identical start and end times, so they hold the current final frame until their source clips are delivered. Clamp the returned time to `video.duration - 0.04` before seeking.

Seek at most once every 42 milliseconds in `requestAnimationFrame`. Keep the current 6-second jump shortcut for large scroll jumps.

- [ ] **Step 6: Observe and activate chapters**

Use `IntersectionObserver` with `rootMargin: '-42% 0px -42% 0px'`. Set exactly one chapter to `data-active="true"` and `aria-current="step"`.

Expose:

```ts
window.scrollToMonkeyChapter = (id: string) => {
  document.querySelector<HTMLElement>(`[data-chapter="${id}"]`)
    ?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
};
```

- [ ] **Step 7: Route navigation links**

Map:

```ts
const monkeyTargets: Record<string, string> = {
  aanpak: 'aanpak',
  diensten: 'diensten',
  over: 'team',
  contact: 'contact',
};
```

In `Nav.astro`, when Monkey mode is active on desktop and a homepage fragment link is clicked, prevent default and call `window.scrollToMonkeyChapter(monkeyTargets[fragment])`. Ordinary Light/Dark navigation remains unchanged.

- [ ] **Step 8: Verify and commit Task 5**

Run:

```text
npm.cmd run check:monkey
npm.cmd run check:scroll-story
npm.cmd run build
```

Expected: all commands exit 0.

Commit:

```text
git add scripts/check-monkey-mode.mjs src/components/ScrollStory.astro src/pages/index.astro src/components/Nav.astro
git commit -m "feat: control monkey film by scroll"
```

---

### Task 6: Make the masterfilm pipeline extensible

**Files:**

- Create: `scripts/monkey-scenes.json`
- Modify: `scripts/build-scroll-story.ps1`
- Modify: `scripts/check-monkey-mode.mjs`
- Regenerate: `public/media/scroll-story/monkai-scroll-story.mp4`
- Regenerate: `public/media/scroll-story/monkai-scroll-story.webm`
- Regenerate: `public/media/scroll-story/monkai-scroll-story-poster.jpg`

**Interfaces:**

- Produces: scene manifest entries `{ id, file, duration, transition }`
- Consumes: source files in the supplied `SourceDirectory`

- [ ] **Step 1: Add the seven current scene records**

Create `scripts/monkey-scenes.json`:

```json
[
  { "id": "desk", "file": "Clip_1_-_Monkey_working_202607281057.mp4", "duration": 8.0, "transition": 0.0 },
  { "id": "laptop", "file": "Monkey_looks_at_laptop_screen_202607281058.mp4", "duration": 8.0, "transition": 0.18 },
  { "id": "door", "file": "Monkey_opens_door_to_jungle_202607281058.mp4", "duration": 8.0, "transition": 0.18 },
  { "id": "view", "file": "Monkey_admiring_jungle_view_202607281058.mp4", "duration": 10.01, "transition": 0.45 },
  { "id": "vine", "file": "Monkey_swings_on_vine_202607281058.mp4", "duration": 9.5, "transition": 0.22 },
  { "id": "team", "file": "Monkey_jumps_to_second_platform_202607281058.mp4", "duration": 8.0, "transition": 0.22 },
  { "id": "approach", "file": "Monkey_crosses_rope_bridge_to_202607281058.mp4", "duration": 8.0, "transition": 0.22 }
]
```

- [ ] **Step 2: Add failing manifest checks**

Add:

```js
const manifestPath = join(root, 'scripts', 'monkey-scenes.json');
expect(existsSync(manifestPath), 'Het filmscènemanifest ontbreekt.');
if (existsSync(manifestPath)) {
  const scenes = JSON.parse(readFileSync(manifestPath, 'utf8'));
  expect(scenes.length === 7, 'Het manifest moet nu de zeven bestaande clips bevatten.');
  expect(scenes.every((scene) => scene.id && scene.file && scene.duration), 'Een filmscène is onvolledig.');
}
```

Run: `npm.cmd run check:monkey`

Expected: PASS once the manifest exists.

- [ ] **Step 3: Generate the FFmpeg graph from JSON**

Replace the hardcoded source names and filter string in `build-scroll-story.ps1` with:

```powershell
$manifestPath = Join-Path $PSScriptRoot 'monkey-scenes.json'
$scenes = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
$culture = [System.Globalization.CultureInfo]::InvariantCulture
$filterParts = @()

for ($index = 0; $index -lt $scenes.Count; $index += 1) {
  $duration = [double]$scenes[$index].duration
  $durationText = $duration.ToString('0.##', $culture)
  $filterParts += "[$index`:v]trim=duration=$durationText,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v$index]"
}

$currentLabel = 'v0'
$timeline = [double]$scenes[0].duration
for ($index = 1; $index -lt $scenes.Count; $index += 1) {
  $fade = [double]$scenes[$index].transition
  $offset = $timeline - $fade
  $nextLabel = "x$index"
  $filterParts += "[$currentLabel][v$index]xfade=transition=fade:duration=$($fade.ToString('0.##', $culture)):offset=$($offset.ToString('0.##', $culture))[$nextLabel]"
  $timeline = $timeline + [double]$scenes[$index].duration - $fade
  $currentLabel = $nextLabel
}

$filterParts += "[$currentLabel]format=yuv420p[story]"
$filter = $filterParts -join ';'
```

Resolve every `$scene.file` under `SourceDirectory` and retain the current MP4, WebM and poster encoding settings.

- [ ] **Step 4: Rebuild and inspect the current master**

Run:

```text
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\build-scroll-story.ps1
```

Inspect both outputs with FFmpeg. Expected:

- duration approximately 58.08 seconds;
- 1280 by 720;
- 24 fps;
- H.264 MP4 and VP9 WebM;
- no `Audio:` stream.

- [ ] **Step 5: Verify and commit Task 6**

Run:

```text
npm.cmd run check:monkey
npm.cmd run check:scroll-story
```

Expected: both commands exit 0.

Commit:

```text
git add scripts/monkey-scenes.json scripts/build-scroll-story.ps1 scripts/check-monkey-mode.mjs public/media/scroll-story
git commit -m "build: make monkey film extensible"
```

---

### Task 7: Verify desktop, mobile, reduced motion and documentation

**Files:**

- Modify: `CLAUDE.md`
- Modify if required by QA: `src/components/ScrollStory.astro`
- Modify if required by QA: `src/components/ThemeToggle.astro`
- Modify if required by QA: `src/pages/index.astro`

**Interfaces:**

- Verifies all contracts produced by Tasks 1 through 6.

- [ ] **Step 1: Run the complete automated checks**

Run:

```text
npm.cmd run check:monkey
npm.cmd run check:scroll-story
npm.cmd run build
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 2: Verify desktop Light and Dark**

Open the production preview at 1440 by 900.

For both Light and Dark verify:

- the third switch segment shows the MonkAi favicon;
- the ordinary homepage is visible;
- the Monkey film sources have no `src`;
- all original sections, FAQ and contact form are present.

- [ ] **Step 3: Verify desktop Monkey mode**

Select the favicon segment and verify:

- dark tokens apply;
- the ordinary homepage becomes hidden and inaccessible;
- the Monkey homepage becomes visible;
- WebM or MP4 loads only now;
- scrolling seeks the video;
- all fourteen chapter headings appear;
- Aanpak, Diensten, Team and Contact navigation links land in their Monkey chapters;
- FAQ items open while the background frame holds;
- contact fields accept input while the final frame holds;
- no native video controls or sound exist.

- [ ] **Step 4: Verify mobile**

Set the viewport to 390 by 844 and reload.

Verify:

- only Light and Dark appear;
- a stored Monkey value becomes Dark;
- the ordinary homepage renders;
- all video source `src` attributes remain absent;
- no Monkey poster request is made.

- [ ] **Step 5: Verify reduced motion**

At desktop width with reduced motion enabled, select Monkey mode.

Verify:

- the chapter sequence remains readable;
- the video does not scrub;
- chapter content and links remain usable.

- [ ] **Step 6: Document the integration and pending footage**

Append a lesson to `CLAUDE.md` covering:

- desktop-only Monkey theme;
- mobile fallback to Dark;
- theme-change event;
- lazy media attachment and release;
- one manifest-driven masterfilm;
- nine pending Veo scenes from the approved design spec.

- [ ] **Step 7: Final verification and commit**

Run again:

```text
npm.cmd run check:monkey
npm.cmd run check:scroll-story
npm.cmd run build
git diff --check
```

Expected: every command exits 0.

Commit:

```text
git add CLAUDE.md src/components/ScrollStory.astro src/components/ThemeToggle.astro src/pages/index.astro
git commit -m "docs: record monkey mode workflow"
```
