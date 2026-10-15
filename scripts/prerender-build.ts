import fs from 'fs';
import path from 'path';
import { getPrerenderedPage } from '../prerender';

const routes = [
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
  '/questionnaire'
];

async function prerenderBuild() {
  console.log('⚡ Starting static build-time pre-rendering for all routes...');
  const distDir = path.resolve(process.cwd(), 'dist');
  const baseHtmlPath = path.resolve(distDir, 'index.html');

  if (!fs.existsSync(baseHtmlPath)) {
    console.error(`Error: Base template ${baseHtmlPath} does not exist. Run vite build first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

  for (const route of routes) {
    const renderedHtml = getPrerenderedPage(route, baseHtml);

    if (route === '/') {
      // Overwrite dist/index.html with pre-rendered homepage
      fs.writeFileSync(baseHtmlPath, renderedHtml, 'utf-8');
      console.log(`  ✓ Baked static pre-render for / -> dist/index.html (${renderedHtml.length} bytes)`);
    } else {
      const cleanRoute = route.replace(/^\//, '');
      const routeDir = path.resolve(distDir, cleanRoute);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }

      // Write dist/${route}/index.html (standard for clean URLs on all static hosts and servers)
      const routeIndexPath = path.resolve(routeDir, 'index.html');
      fs.writeFileSync(routeIndexPath, renderedHtml, 'utf-8');

      // Also write dist/${route}.html (for hosts that resolve clean URLs without directory)
      const routeHtmlPath = path.resolve(distDir, `${cleanRoute}.html`);
      fs.writeFileSync(routeHtmlPath, renderedHtml, 'utf-8');

      console.log(`  ✓ Baked static pre-render for ${route} -> dist/${cleanRoute}/index.html & dist/${cleanRoute}.html`);
    }
  }

  // Ensure llms.txt and llms-full.txt exist in dist
  const publicDir = path.resolve(process.cwd(), 'public');
  if (fs.existsSync(path.resolve(publicDir, 'llms.txt'))) {
    fs.copyFileSync(path.resolve(publicDir, 'llms.txt'), path.resolve(distDir, 'llms.txt'));
    console.log('  ✓ Synced llms.txt to dist/llms.txt');
  }
  if (fs.existsSync(path.resolve(publicDir, 'llms-full.txt'))) {
    fs.copyFileSync(path.resolve(publicDir, 'llms-full.txt'), path.resolve(distDir, 'llms-full.txt'));
    console.log('  ✓ Synced llms-full.txt to dist/llms-full.txt');
  }

  console.log('✅ Static build-time pre-rendering complete!');
}

prerenderBuild().catch((err) => {
  console.error('Pre-rendering build error:', err);
  process.exit(1);
});
