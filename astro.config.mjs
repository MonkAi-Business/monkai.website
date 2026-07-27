import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://monkai.business',
  // Kortere URL om tijdens een sessie hardop te noemen. In een statische build
  // wordt dit een pagina die meteen doorstuurt; op Netlify vangt netlify.toml
  // hem al eerder af met een echte 301.
  redirects: {
    '/prompts': '/inspiratie',
  },
  integrations: [
    sitemap({
      // /bedankt, /data, /inspiratie en /prompts zijn noindex, die horen niet in de sitemap
      filter: (page) =>
        !page.includes('/bedankt') &&
        !page.includes('/data') &&
        !page.includes('/inspiratie') &&
        !page.includes('/prompts'),
    }),
  ],
});
