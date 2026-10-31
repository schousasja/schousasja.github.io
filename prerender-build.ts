/**
 * Build-time Pre-rendering Script for Univue Consultants ApS
 *
 * Automatically crawls and pre-renders all live static routes and dynamic
 * city microsites into dist/ semantic HTML files. Also updates sitemap.xml
 * automatically from the live registry.
 */

import fs from 'fs';
import path from 'path';
import { getPrerenderedPage } from './prerender';
import { cities } from './src/constants/cities';

// 1. Automatically construct all routes from the live data
const coreRoutes = [
  '/',
  '/about',
  '/services',
  '/uae',
  '/india',
  '/southeast-asia',
  '/market-catalog',
  '/properties',
  '/catalog',
  '/book',
  '/questionnaire'
];

// All dynamic city microsite routes derived automatically from live cities registry
const cityRoutes = cities.map(c => `/markets/${c.id}`);
if (!cityRoutes.includes('/markets/ras-al-khaimah')) {
  cityRoutes.push('/markets/ras-al-khaimah');
}

const allRoutes: string[] = Array.from(new Set([...coreRoutes, ...cityRoutes]));

async function prerenderBuild() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html not found! Ensure "vite build" ran successfully first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(templatePath, 'utf-8');

  console.log(`\n======================================================`);
  console.log(`⚡ Auto Pre-rendering ${allRoutes.length} live routes for AI crawlers & SEO...`);
  console.log(`======================================================`);

  for (const route of allRoutes) {
    const renderedHtml = getPrerenderedPage(route, baseTemplate);

    if (route === '/') {
      fs.writeFileSync(templatePath, renderedHtml, 'utf-8');
      console.log(`✓ [200 OK] / -> dist/index.html (${(renderedHtml.length / 1024).toFixed(1)} kB)`);
    } else {
      const cleanRoute = route.replace(/^\//, '');
      const routeDir = path.join(distDir, cleanRoute);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      const routeFilePath = path.join(routeDir, 'index.html');
      fs.writeFileSync(routeFilePath, renderedHtml, 'utf-8');

      // Also generate flat .html file for hosts resolving clean URLs
      const flatHtmlPath = path.join(distDir, `${cleanRoute.replace(/\//g, '_')}.html`);
      fs.writeFileSync(flatHtmlPath, renderedHtml, 'utf-8');

      console.log(`✓ [200 OK] ${route} -> dist/${cleanRoute}/index.html (${(renderedHtml.length / 1024).toFixed(1)} kB)`);
    }
  }

  // Generate automated up-to-date sitemap.xml
  const today = new Date().toISOString().split('T')[0];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allRoutes.map(route => {
  const priority = route === '/' ? '1.0' : route.startsWith('/markets/') ? '0.85' : '0.9';
  const changefreq = route === '/' || route.includes('catalog') || route.includes('properties') ? 'daily' : 'weekly';
  return `  <url>
    <loc>https://univueconsultants.com${route === '/' ? '' : route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.resolve(process.cwd(), 'public', 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`✓ Updated sitemap.xml with ${allRoutes.length} live routes (${today})`);

  console.log(`======================================================`);
  console.log(`✨ All ${allRoutes.length} pages successfully pre-rendered into dist/`);
  console.log(`======================================================\n`);
}

prerenderBuild().catch((err) => {
  console.error('FATAL: Pre-render build failed:', err);
  process.exit(1);
});
