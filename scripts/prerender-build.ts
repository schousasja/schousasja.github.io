import fs from 'fs';
import path from 'path';
import { getPrerenderedPage } from '../prerender';
import { cities } from '../src/constants/cities';

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

const cityRoutes = cities.map(c => `/markets/${c.id}`);
if (!cityRoutes.includes('/markets/ras-al-khaimah')) {
  cityRoutes.push('/markets/ras-al-khaimah');
}

const allRoutes: string[] = Array.from(new Set([...coreRoutes, ...cityRoutes]));

async function prerenderBuild() {
  console.log(`⚡ Starting static build-time pre-rendering for all ${allRoutes.length} routes...`);
  const distDir = path.resolve(process.cwd(), 'dist');
  const baseHtmlPath = path.resolve(distDir, 'index.html');

  if (!fs.existsSync(baseHtmlPath)) {
    console.error(`Error: Base template ${baseHtmlPath} does not exist. Run vite build first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

  for (const route of allRoutes) {
    const renderedHtml = getPrerenderedPage(route, baseHtml);

    if (route === '/') {
      fs.writeFileSync(baseHtmlPath, renderedHtml, 'utf-8');
      console.log(`  ✓ Baked static pre-render for / -> dist/index.html (${renderedHtml.length} bytes)`);
    } else {
      const cleanRoute = route.replace(/^\//, '');
      const routeDir = path.resolve(distDir, cleanRoute);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }

      const routeIndexPath = path.resolve(routeDir, 'index.html');
      fs.writeFileSync(routeIndexPath, renderedHtml, 'utf-8');

      console.log(`  ✓ Baked static pre-render for ${route} -> dist/${cleanRoute}/index.html`);
    }
  }

  // Ensure llms.txt and llms-full.txt exist in dist
  const publicDir = path.resolve(process.cwd(), 'public');
  if (fs.existsSync(path.resolve(publicDir, 'llms.txt'))) {
    fs.copyFileSync(path.resolve(publicDir, 'llms.txt'), path.resolve(distDir, 'llms.txt'));
  }
  if (fs.existsSync(path.resolve(publicDir, 'llms-full.txt'))) {
    fs.copyFileSync(path.resolve(publicDir, 'llms-full.txt'), path.resolve(distDir, 'llms-full.txt'));
  }

  console.log('✅ Static build-time pre-rendering complete!');
}

prerenderBuild().catch((err) => {
  console.error('Pre-rendering build error:', err);
  process.exit(1);
});
