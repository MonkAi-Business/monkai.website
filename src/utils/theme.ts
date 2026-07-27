// Eén bron van waarheid voor de themalaag.
//
// Gebruikt door BaseLayout.astro (het inline scriptje in de head, dat de waarden
// via define:vars binnenkrijgt) en door ThemeToggle.astro (de knoppen).
//
// De logica van het head-scriptje staat hier bewust niet in: dat script moet
// inline en blokkerend zijn en kan dus niet importeren. Wat hier staat zijn de
// waarden, zodat de sleutelnaam en de lijst met standen niet op twee plaatsen
// kunnen gaan uiteenlopen.

export const THEMES = ['light', 'dark', 'superpowers'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'light';

export const STORAGE_KEY = 'monkai_theme';

// Deel 2 zet dit op true; dan verschijnt de derde knop in de schakelaar.
// De stand zelf werkt nu al: ?theme=superpowers in de URL zet en bewaart ze.
// Het type staat expliciet op boolean, anders versmalt TypeScript het naar de
// letterlijke waarde false en klaagt hij over de tak hieronder.
export const SUPERPOWERS_ENABLED: boolean = false;

const ALL_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Licht' },
  { value: 'dark', label: 'Donker' },
  { value: 'superpowers', label: 'Superpowers' },
];

export const TOGGLE_OPTIONS = ALL_OPTIONS.filter(
  (option) => option.value !== 'superpowers' || SUPERPOWERS_ENABLED,
);
