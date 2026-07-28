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

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Monkey-themecontract geslaagd.');
