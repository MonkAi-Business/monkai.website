// Het manifest van de keuzeronde. De galerij en de tien paginabestanden lezen
// hieruit, zodat een naam of een pitch op één plek staat.
//
// De slug is ook de waarde van data-kickass op <html> en de prefix van elke
// CSS-regel van de bijbehorende laag. Wijzig een slug dus niet los.

export type Gewicht = 'licht' | 'middel' | 'zwaar';

export type Variant = {
  slug: string;
  nummer: number;
  naam: string;
  pitch: string;
  techniek: string;
  gewicht: Gewicht;
};

export const VARIANTS: Variant[] = [
  {
    slug: 'neon-jungle',
    nummer: 1,
    naam: 'Neon Jungle',
    pitch: 'Het aapje draait in 3D achter de titel, met felgroen randlicht op bijna zwart.',
    techniek: 'three.js met het geoptimaliseerde model',
    gewicht: 'zwaar',
  },
  {
    slug: 'maanlicht',
    nummer: 2,
    naam: 'Maanlicht',
    pitch: 'De avondscene vult het scherm, de maan komt op en het licht trekt traag over het beeld.',
    techniek: 'CSS-animatie op het beeld',
    gewicht: 'licht',
  },
  {
    slug: 'bento',
    nummer: 3,
    naam: 'Bento-cockpit',
    pitch: 'De hero wordt een raster van tegels die elk iets doen: typen, tellen, draaien, spelen.',
    techniek: 'raster plus 3D plus beeld',
    gewicht: 'zwaar',
  },
  {
    slug: 'terminal',
    nummer: 4,
    naam: 'Terminal',
    pitch: 'Fosforgroen op zwart, scanlijnen, en een titel die zich uittypt achter een knipperende cursor.',
    techniek: 'CSS met een kort script',
    gewicht: 'licht',
  },
  {
    slug: 'aurora',
    nummer: 5,
    naam: 'Aurora',
    pitch: 'Een traag bewegend kleurverloop achter matglazen kaarten.',
    techniek: 'CSS, geen script',
    gewicht: 'licht',
  },
  {
    slug: 'spotlight',
    nummer: 6,
    naam: 'Spotlight',
    pitch: 'Een lichtbundel rond je cursor onthult de pagina, kaarten lichten op waar je kijkt.',
    techniek: 'twee CSS-variabelen die de muis volgen',
    gewicht: 'licht',
  },
  {
    slug: 'klimmen',
    nummer: 7,
    naam: 'De klimmende aap',
    pitch: 'De ladder wordt plakkerig en het aapje klimt van trede naar trede terwijl je scrolt.',
    techniek: 'scroll-gestuurde CSS',
    gewicht: 'middel',
  },
  {
    slug: 'brutalist',
    nummer: 8,
    naam: 'Brutalist',
    pitch: 'Letters tot tegen de rand, harde vlakken, harde schaduwen, geen enkele afronding.',
    techniek: 'CSS, geen script',
    gewicht: 'licht',
  },
  {
    slug: 'netwerk',
    nummer: 9,
    naam: 'Neuraal netwerk',
    pitch: 'Een puntennetwerk dat op je muis reageert en in de hero even een apenkop vormt.',
    techniek: 'canvas 2D, eigen code',
    gewicht: 'middel',
  },
  {
    slug: 'vloeibaar',
    nummer: 10,
    naam: 'Vloeibaar',
    pitch: 'De titel golft als water waar je met de muis doorheen gaat, met korrel over de pagina.',
    techniek: 'SVG-filters',
    gewicht: 'middel',
  },
];

export function variantBySlug(slug: string): Variant {
  const gevonden = VARIANTS.find((v) => v.slug === slug);
  if (!gevonden) throw new Error(`Onbekende variant: ${slug}`);
  return gevonden;
}

export function buren(slug: string): { vorige: Variant; volgende: Variant } {
  const i = VARIANTS.findIndex((v) => v.slug === slug);
  return {
    vorige: VARIANTS[(i - 1 + VARIANTS.length) % VARIANTS.length],
    volgende: VARIANTS[(i + 1) % VARIANTS.length],
  };
}
