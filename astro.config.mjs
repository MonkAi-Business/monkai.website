import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { createLastmodLookup } from './src/utils/lastmod.mjs';

const lastmodFor = createLastmodLookup();
const NOINDEX_SECTIONS = ['bedankt', 'data', 'inspiratie', 'kickass', 'prep', 'prompt', 'prompts'];

export default defineConfig({
  site: 'https://monkai.business',
  // Kortere URL om tijdens een sessie hardop te noemen. In een statische build
  // wordt dit een pagina die meteen doorstuurt; op Netlify vangt netlify.toml
  // hem al eerder af met een echte 301.
  redirects: {
    '/prompts': '/inspiratie',
    '/prompt': '/inspiratie',
  },
  integrations: [
    sitemap({
      // Deze paden zijn noindex en horen niet in de sitemap. Vergelijk op het
      // eerste padsegment, niet met includes(): dat gooide ook een blogpost
      // weg waarvan de slug met 'prompt' begon.
      filter: (page) =>
        !NOINDEX_SECTIONS.includes(new URL(page).pathname.split('/')[1]),
      serialize: (item) => {
        const lastmod = lastmodFor(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
