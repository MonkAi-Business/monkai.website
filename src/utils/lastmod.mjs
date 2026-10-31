import { readdirSync, readFileSync } from 'node:fs';

/**
 * Laatste inhoudelijke wijziging per pagina, voor `lastmod` in de sitemap en
 * `dateModified` in de JSON-LD. Dit bestand wordt ook door astro.config.mjs
 * geladen, dus `astro:content` kan hier niet.
 *
 * Bewust geen builddatum en geen git-datum: een datum die bij elke build
 * meeschuift is niets waard, en de blogreeks kreeg meermaals een massale
 * datumverschuiving die in git als wijziging telt.
 *
 * Pas de datum hieronder aan wanneer de tekst van zo'n pagina echt verandert.
 * Een tikfout of een opmaakwijziging telt niet.
 */
export const PAGE_DATES = {
  '/contact/': '2026-10-31',
  '/cookies/': '2026-07-27',
  '/privacy/': '2026-07-27',
  '/stijn-de-ketelaere/': '2026-08-09',
  '/use-cases/': '2026-07-23',
};

const BLOG_DIR = new URL('../content/blog/', import.meta.url);

function readBlogPosts() {
  return readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const source = readFileSync(new URL(file, BLOG_DIR), 'utf8');
      const field = (name) => source.match(new RegExp(`^${name}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1]?.trim();
      return {
        slug: file.replace(/\.md$/, ''),
        date: field('date'),
        updated: field('updated'),
        draft: field('draft') === 'true',
      };
    });
}

/**
 * De datum van de nieuwste live post, als YYYY-MM-DD. Zelfde regel als
 * isPublished() in posts.ts, die hier niet te importeren is.
 */
function newestPostDate(posts) {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Brussels' });
  return posts
    .filter((post) => !post.draft && post.date <= today)
    .map((post) => post.date)
    .sort()
    .at(-1);
}

/** Geeft de functie terug die bij een sitemap-URL de wijzigingsdatum zoekt. */
export function createLastmodLookup() {
  const posts = readBlogPosts();
  const newest = newestPostDate(posts);

  return (pathname) => {
    // De homepage en /blog tonen de nieuwste posts en veranderen dus met elke post mee.
    if (pathname === '/' || pathname === '/blog/') return newest;

    const post = pathname.match(/^\/blog\/([^/]+)\/$/);
    if (post) {
      const entry = posts.find(({ slug }) => slug === post[1]);
      return entry?.updated ?? entry?.date;
    }

    if (pathname.startsWith('/use-cases/')) return PAGE_DATES['/use-cases/'];
    return PAGE_DATES[pathname];
  };
}
