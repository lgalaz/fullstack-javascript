import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.argv.includes('--prod');
const port = Number(process.env.PORT) || 5173;
const base = process.env.BASE || '/';

const staticDir = path.join(__dirname, 'dist/client');

const mimeTypes = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.map': 'application/json',
  '.txt': 'text/plain',
};

async function tryServeStatic(url, res) {
  const cleanUrl = url.split('?')[0];
  const relativePath = cleanUrl.startsWith(base)
    ? cleanUrl.slice(base.length)
    : cleanUrl.slice(1);

  const filePath = path.join(staticDir, relativePath);

  if (!filePath.startsWith(staticDir)) {
    return false;
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.statusCode = 200;
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

async function createServer() {
  let vite;
  let template;
  let render;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      root: __dirname,
      base,
      server: { middlewareMode: true },
      appType: 'custom',
    });
  } else {
    template = await fs.readFile(
      path.join(__dirname, 'dist/client/index.html'),
      'utf-8'
    );
    const entry = await import('./dist/server/entry-server.js');
    render = entry.render;
  }

  return async function handler(req, res) {
    try {
      const url = req.url || '/';

      if (isProd && (await tryServeStatic(url, res))) {
        return;
      }

      let html;
      let appHtml;

      if (!isProd) {
        const rawTemplate = await fs.readFile(
          path.join(__dirname, 'index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(url, rawTemplate);
        const entry = await vite.ssrLoadModule('/src/entry-server.jsx');
        appHtml = await entry.render(url);
      } else {
        appHtml = await render(url);
      }

      html = template.replace('<!--app-html-->', appHtml);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
    } catch (error) {
      if (vite) {
        vite.ssrFixStacktrace(error);
      }
      res.statusCode = 500;
      res.end(error instanceof Error ? error.stack : String(error));
    }
  };
}

const server = await createServer();
const { createServer: createHttpServer } = await import('node:http');

createHttpServer(server).listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}${base}`);
});
