import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const activePath = path.join(rootDir, 'forge-data', 'active-site-content.json');
const legacyPath = path.join(rootDir, 'projects', 'default-mazzarella_v4.json');
const outputDir = path.join(rootDir, 'pages-content');
const assetsDir = path.join(outputDir, 'website-assets');
const publicBase = '/drvincenzomazzarella.com/';

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function itemKey(item) {
  if (item?.id) return `id:${item.id}`;
  if (item?.name) return `name:${item.name}`;
  return `data:${createHash('sha256').update(JSON.stringify(item)).digest('hex')}`;
}

function mergeMissing(current = [], previous = []) {
  const keys = new Set(current.map(itemKey));
  return [
    ...current,
    ...previous.filter((item) => {
      const key = itemKey(item);
      if (keys.has(key)) return false;
      keys.add(key);
      return true;
    }),
  ];
}

function safeSvg(data) {
  const svg = data.toString('utf8');
  return !/<\s*(?:script|foreignObject|iframe|object|embed)\b|\son[a-z]+\s*=|(?:href|xlink:href)\s*=\s*["']\s*(?:javascript:|https?:|\/\/)/i.test(svg);
}

function externalizeImages(value, files = new Set()) {
  if (typeof value === 'string') {
    return value.replace(
      /data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,([a-z0-9+/=\s]+)/gi,
      (_source, rawExtension, rawData) => {
        const data = Buffer.from(rawData.replace(/\s/g, ''), 'base64');
        const normalizedExtension = rawExtension.toLowerCase();
        const extension = normalizedExtension === 'jpeg'
          ? 'jpg'
          : normalizedExtension === 'svg+xml' ? 'svg' : normalizedExtension;
        if (extension === 'svg' && !safeSvg(data)) return '';

        const digest = createHash('sha256').update(data).digest('hex').slice(0, 20);
        const filename = `image-${digest}.${extension}`;
        if (!files.has(filename)) {
          writeFileSync(path.join(assetsDir, filename), data);
          files.add(filename);
        }
        return `${publicBase}website-assets/${filename}`;
      },
    );
  }
  if (Array.isArray(value)) return value.map((item) => externalizeImages(item, files));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, externalizeImages(item, files)]),
    );
  }
  return value;
}

if (!existsSync(activePath)) {
  throw new Error('Contenuto CMS attivo non trovato. Avvia e salva Websites Forge prima della pubblicazione.');
}

const active = readJson(activePath);
const legacy = existsSync(legacyPath) ? readJson(legacyPath) : {};
const merged = {
  ...active,
  mediaSections: mergeMissing(active.mediaSections, legacy.mediaSections),
  media: mergeMissing(active.media, legacy.media),
  assetLibrary: mergeMissing(active.assetLibrary, legacy.assetLibrary),
  siteSettings: {
    ...active.siteSettings,
    hosting: {
      ...active.siteSettings?.hosting,
      ftpHost: '',
      ftpUser: '',
      publicPath: publicBase,
    },
  },
};

rmSync(assetsDir, { recursive: true, force: true });
mkdirSync(assetsDir, { recursive: true });
const published = externalizeImages(merged);
writeFileSync(path.join(outputDir, 'site-content.json'), `${JSON.stringify(published, null, 2)}\n`, 'utf8');

console.log(`Snapshot Pages aggiornato: ${published.media.length} media, ${published.assetLibrary.length} risorse.`);
