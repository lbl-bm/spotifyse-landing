'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const destination = path.join(root, '_site');
const files = [
  'index.html',
  'ASSET-LICENSES.md',
  'MOTIONSITES-LICENSE.txt',
  'assets/favicon.svg',
  'assets/manrope.woff2',
  'assets/noto-sans-sc.woff2',
  'assets/terrain-night-960.webp',
  'assets/terrain-night-1920.webp',
  'assets/terrain-roam-960.webp',
  'assets/terrain-roam-1920.webp',
  'assets/Manrope-OFL.txt',
  'assets/NotoSansSC-OFL.txt',
];
if (JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).name !== 'spotifyse-landing') {
  throw new Error('This builder must run from the standalone Spotifyse landing project.');
}
function inspectStaging(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(destination, absolute).replaceAll(path.sep, '/');
    if (entry.isSymbolicLink() || (!entry.isDirectory() && !files.includes(relative)) || (entry.isDirectory() && relative !== 'assets')) {
      throw new Error('Unexpected item in publish staging; inspect it before rebuilding: ' + relative);
    }
    if (entry.isDirectory()) inspectStaging(absolute);
  }
}
if (fs.existsSync(destination)) {
  if (fs.lstatSync(destination).isSymbolicLink()) throw new Error('Publish directory must not be a link.');
  inspectStaging(destination);
}
for (const relative of files) {
  const source = path.join(root, relative);
  const target = path.join(destination, relative);
  if (!fs.lstatSync(source).isFile() || fs.lstatSync(source).isSymbolicLink()) throw new Error('Expected regular publication file: ' + relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) throw new Error('Publish target must not be a link: ' + relative);
  fs.copyFileSync(source, target);
}
const digest = relative => crypto.createHash('sha256').update(fs.readFileSync(path.join(destination, relative))).digest('hex');
console.log(JSON.stringify({ directory: '_site', files: files.map(file => ({ file, bytes: fs.statSync(path.join(destination, file)).size, sha256: digest(file) })) }, null, 2));
