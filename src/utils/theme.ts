export const THEMES = ['light', 'dark', 'monkey'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'monkey';

// Monkey mode werkt alleen op desktop. Wie zelf Monkey koos en op een smal
// scherm komt, valt terug op Dark: die keuze zei "donker". Wie niets koos valt
// terug op Light, zodat een eerste mobiele bezoeker de klassieke lichte site
// ziet en niet ongevraagd een donkere.
export const MOBILE_FALLBACK_THEME: Theme = 'dark';
export const MOBILE_DEFAULT_THEME: Theme = 'light';

// Wat er op <html> staat voor het head-scriptje draait. Monkey mode is een
// scrollgestuurde film en heeft JavaScript nodig, dus wie dat uit heeft staan
// hoort de klassieke lichte pagina te krijgen, niet een stilstaand filmpje.
export const NO_JS_THEME: Theme = 'light';

export const STORAGE_KEY = 'monkai_theme';

export const TOGGLE_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Licht' },
  { value: 'dark', label: 'Donker' },
  { value: 'monkey', label: 'Monkey mode' },
];
