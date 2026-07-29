import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/**
 * Een blogpost staat live wanneer twee dingen kloppen:
 *
 *   1. `draft: false` in de frontmatter. Dat is de goedkeuring.
 *   2. De `date` uit de frontmatter is aangebroken in Brusselse tijd.
 *
 * Zo kan je een goedgekeurde post vooruit plannen: hij zit al in `main`, maar
 * verschijnt pas bij de eerste build op of na die dag. Die build komt van de
 * nachtelijke cron in `.github/workflows/publish-scheduled.yml`.
 *
 * Zolang een post nog niet live is, is hij te bekijken op /prep.
 */

/** Vandaag in Brussel als YYYY-MM-DD. Netlify bouwt in UTC, dus expliciet zetten. */
export function todayInBrussels(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Brussels' });
}

/** De publicatiedag uit de frontmatter als YYYY-MM-DD. */
export function publishDay(post: Post): string {
  return post.data.date.toISOString().slice(0, 10);
}

export function isPublished(post: Post, today = todayInBrussels()): boolean {
  return !post.data.draft && publishDay(post) <= today;
}

/** Goedgekeurd, maar de dag is nog niet aangebroken. */
export function isScheduled(post: Post, today = todayInBrussels()): boolean {
  return !post.data.draft && publishDay(post) > today;
}

/** Alles wat live staat, nieuwste eerst. */
export async function getPublishedPosts(): Promise<Post[]> {
  const today = todayInBrussels();
  return (await getCollection('blog'))
    .filter((post) => isPublished(post, today))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Alles wat nog niet live staat, eerstvolgende publicatiedag eerst. */
export async function getUpcomingPosts(): Promise<Post[]> {
  const today = todayInBrussels();
  return (await getCollection('blog'))
    .filter((post) => !isPublished(post, today))
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
}
