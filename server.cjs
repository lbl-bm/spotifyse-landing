'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 4175);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end('Method not allowed');
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); return response.end('Bad request'); }
  if (pathname === '/') pathname = '/index.html';
  if (pathname !== '/index.html' && !/^\/assets\/[a-z0-9-]+\.(webp|svg|woff2)$/i.test(pathname)) {
    response.writeHead(404);
    return response.end('Not found');
  }
  const target = path.resolve(root, '.' + pathname);
  if (!target.startsWith(root + path.sep)) {
    response.writeHead(403);
    return response.end('Forbidden');
  }
  fs.stat(target, (error, stat) => {
    if (error || !stat.isFile()) { response.writeHead(404); return response.end('Not found'); }
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(target)] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': pathname.endsWith('.html') ? 'no-store' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    });
    if (request.method === 'HEAD') return response.end();
    const stream = fs.createReadStream(target);
    stream.on('error', () => response.destroy());
    stream.pipe(response);
  });
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Spotifyse landing: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
