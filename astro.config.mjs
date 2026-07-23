import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://monkai.business',
  integrations: [
    sitemap({
      // /bedankt is noindex — hoort niet in de sitemap
      filter: (page) => !page.includes('/bedankt'),
    }),
  ],
});
