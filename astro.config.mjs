import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://monkai.business',
  integrations: [
    sitemap({
      // /bedankt, /data en /inspiratie zijn noindex, die horen niet in de sitemap
      filter: (page) =>
        !page.includes('/bedankt') && !page.includes('/data') && !page.includes('/inspiratie'),
    }),
  ],
});
