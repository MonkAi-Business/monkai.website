export const THEMES = ['light', 'dark', 'monkey'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'light';

export const STORAGE_KEY = 'monkai_theme';

export const TOGGLE_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Licht' },
  { value: 'dark', label: 'Donker' },
  { value: 'monkey', label: 'Monkey mode' },
];
