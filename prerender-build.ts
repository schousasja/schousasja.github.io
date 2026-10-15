/**
 * Build-time Pre-rendering Script for Univue Consultants ApS
 *
 * Saves a complete, semantic HTML file for each route into the dist/ directory.
 * When deployed to ANY hosting platform (Cloud Run, Vercel, Netlify, Cloudflare Pages,
 * Firebase Hosting, GitHub Pages, or S3/Nginx), search engines, AI agents (Claude,
 * ChatGPT, Perplexity), and web crawlers immediately receive complete HTML with full
 * body text, metadata, OpenGraph cards, and Schema.org structured data without
 * executing client-side JavaScript.
 */

import fs from 'fs';
import path from 'path';
import { getPrerenderedPage } from './prerender';

const routes: string[] = [
  '/',
  '/about',
  '/services',
  '/uae',
  '/india',
  '/southeast-asia',
  '/insights',
  '/market-catalog',
  '/properties',
  '/catalog',
  '/book',
  '/questionnaire',
  '/markets/dubai',
  '/markets/abu-dhabi',
  '/markets/ras-al-khaimah',
  '/markets/bangalore',
  '/markets/gurgaon',
  '/markets/mumbai',
  '/markets/singapore',
  '/markets/bangkok',
];

async function prerenderBuild() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html not found! Ensure "vite build" ran successfully first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(templatePath, 'utf-8');

  console.log(`\n======================================================`);
  console.log(`⚡ Pre-rendering ${routes.length} static routes for AI crawlers & SEO...`);
  console.log(`======================================================`);

  for (const route of routes) {
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
      console.log(`✓ [200 OK] ${route} -> dist/${cleanRoute}/index.html (${(renderedHtml.length / 1024).toFixed(1)} kB)`);
    }
  }

  console.log(`======================================================`);
  console.log(`✨ All ${routes.length} pages successfully pre-rendered into dist/`);
  console.log(`======================================================\n`);
}

prerenderBuild().catch((err) => {
  console.error('FATAL: Pre-render build failed:', err);
  process.exit(1);
});
