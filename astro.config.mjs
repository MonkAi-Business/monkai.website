import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://monkai.business',
  integrations: [
    sitemap({
      // /bedankt en /data zijn noindex — horen niet in de sitemap
      filter: (page) => !page.includes('/bedankt') && !page.includes('/data'),
    }),
  ],
});
