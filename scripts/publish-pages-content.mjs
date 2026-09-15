import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const activePath = path.join(rootDir, 'forge-data', 'active-site-content.json');
const legacyPath = path.join(rootDir, 'projects', 'default-mazzarella_v4.json');
const outputDir = path.join(rootDir, 'pages-content');
const editorialPath = path.join(outputDir, 'editorial-overrides.json');
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
const editorialSynced = active.meta?.editorialRevision === 'pdf-2026-09-15';
const legacy = existsSync(legacyPath) ? readJson(legacyPath) : {};
const editorial = existsSync(editorialPath) ? readJson(editorialPath) : {};
const merged = {
  ...active,
  mediaSections: editorialSynced ? active.mediaSections : mergeMissing(active.mediaSections, legacy.mediaSections),
  media: editorialSynced
    ? active.media.filter((item) => item.title && !/\bTitolo\b|^Foto$/i.test(item.title))
    : mergeMissing(active.media, legacy.media),
  assetLibrary: editorialSynced ? active.assetLibrary : mergeMissing(active.assetLibrary, legacy.assetLibrary),
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

// Clinician-approved public copy stays versioned separately from local CMS snapshots.
// Regenerating Pages assets must never restore superseded placeholder information.
if (!editorialSynced) {
  if (editorial.drInfo) merged.drInfo = { ...merged.drInfo, ...editorial.drInfo };
  if (editorial.clinics) merged.clinics = editorial.clinics;
  if (editorial.treatmentCategories) merged.treatmentCategories = editorial.treatmentCategories;
  if (editorial.treatments) {
    const byId = new Map(merged.treatments.map((item) => [item.id, item]));
    for (const item of editorial.treatments) {
      if (item.hidden) {
        byId.delete(item.id);
      } else {
        byId.set(item.id, { ...byId.get(item.id), ...item });
      }
    }
    merged.treatments = Array.from(byId.values());
  }
  if (editorial.mediaSections) merged.mediaSections = editorial.mediaSections;
  if (editorial.media) merged.media = editorial.media;
  if (editorial.testimonials) merged.testimonials = editorial.testimonials;
  if (editorial.siteSettings) {
    merged.siteSettings = {
      ...merged.siteSettings,
      ...editorial.siteSettings,
      footer: { ...merged.siteSettings.footer, ...editorial.siteSettings.footer },
      contactForm: { ...merged.siteSettings.contactForm, ...editorial.siteSettings.contactForm },
    };
  }
  if (editorial.customTexts) merged.customTexts = editorial.customTexts;
}
if (editorialSynced && !active.meta?.publicClinicPhotosVerified) {
  merged.clinics = merged.clinics.map((clinic) => ({ ...clinic, images: [] }));
}

mkdirSync(assetsDir, { recursive: true });
const published = externalizeImages(merged);
writeFileSync(path.join(outputDir, 'site-content.json'), `${JSON.stringify(published, null, 2)}\n`, 'utf8');

console.log(`Snapshot Pages aggiornato: ${published.media.length} media, ${published.assetLibrary.length} risorse.`);
