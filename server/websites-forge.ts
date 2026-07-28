import express from 'express';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_SITE_CONTENT } from '../src/siteContent';
import type { SiteContent } from '../src/siteContent';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'forge-data');
const templatesDir = path.join(dataDir, 'templates');
const exportsDir = path.join(rootDir, 'exports');
const publicDir = path.join(rootDir, 'public');
const exportAssetsDir = path.join(publicDir, 'website-assets');
const localEnvDir = path.join(rootDir, '.websites-forge-venv');
const activeContentPath = path.join(dataDir, 'active-site-content.json');
const publicContentPath = path.join(publicDir, 'site-content.json');
const editorPath = path.join(rootDir, 'server', 'websites-forge-editor.html');

const forgePort = Number(process.env.FORGE_PORT ?? 4177);
const sitePort = Number(process.env.SITE_PORT ?? 3000);
const maxExportFileSize = 25 * 1024 * 1024;
const allowedExportExtensions = new Set([
  '.html',
  '.css',
  '.js',
  '.json',
  '.txt',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.map',
]);

function ensureDirs() {
  [
    dataDir,
    templatesDir,
    exportsDir,
    publicDir,
    localEnvDir,
    path.join(localEnvDir, 'npm-cache'),
    path.join(localEnvDir, 'npm-global'),
    path.join(localEnvDir, 'tmp'),
  ].forEach((dir) => mkdirSync(dir, { recursive: true }));
}

function localNpmEnv() {
  return {
    ...process.env,
    FORCE_COLOR: '1',
    npm_config_cache: path.join(localEnvDir, 'npm-cache'),
    npm_config_prefix: path.join(localEnvDir, 'npm-global'),
    npm_config_tmp: path.join(localEnvDir, 'tmp'),
    npm_config_update_notifier: 'false',
    npm_config_audit: 'false',
    npm_config_fund: 'false',
  };
}

function localBinScript(...segments: string[]) {
  return path.join(rootDir, 'node_modules', ...segments);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80) || 'template';
}

function isSafeUrl(value: string, options: { allowRelative?: boolean; allowImageData?: boolean } = {}) {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed) return true;
  if (trimmed.startsWith('#')) return true;
  if (trimmed.startsWith('//')) return true;
  if (options.allowImageData && /^data:image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,[a-z0-9+/=\s]+$/i.test(trimmed)) {
    return true;
  }
  if (/^(?:javascript|vbscript):/i.test(trimmed)) return false;

  try {
    const parsed = new URL(trimmed, 'http://websites-forge.local');
    if (parsed.origin === 'http://websites-forge.local') return options.allowRelative !== false;
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return options.allowRelative !== false && !/[\u0000-\u001f]/.test(trimmed);
  }
}

function sanitizeStyleValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const normalized = value.trim();
  if (!normalized) return normalized;
  if (/(?:expression\s*\(|javascript:|vbscript:|@import|-moz-binding|behavior\s*:)/i.test(normalized)) {
    return '';
  }

  const urls = Array.from(normalized.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi));
  if (urls.some((match) => !isSafeUrl(match[2] ?? '', { allowImageData: true }))) {
    return '';
  }

  return value;
}

function sanitizeStyleMap(styles: SiteContent['customStyles']): SiteContent['customStyles'] {
  const sanitized: NonNullable<SiteContent['customStyles']> = {};

  Object.entries(styles ?? {}).forEach(([forgeId, style]) => {
    const safeStyle: Record<string, unknown> = {};
    Object.entries(style ?? {}).forEach(([property, value]) => {
      const safeValue = sanitizeStyleValue(value);
      if (safeValue !== '') {
        safeStyle[property] = safeValue;
      }
    });
    sanitized[forgeId] = safeStyle as NonNullable<SiteContent['customStyles']>[string];
  });

  return sanitized;
}

function sanitizeStyleAttribute(value: string) {
  return value
    .split(';')
    .map((rule) => {
      const splitAt = rule.indexOf(':');
      if (splitAt === -1) return '';
      const property = rule.slice(0, splitAt).trim();
      const rawValue = rule.slice(splitAt + 1).trim();
      const safeValue = sanitizeStyleValue(rawValue);
      if (!property || !safeValue || /^(?:behavior|-moz-binding)$/i.test(property)) return '';
      return `${property}: ${safeValue}`;
    })
    .filter(Boolean)
    .join('; ');
}

function sanitizeHtml(value: string) {
  return value
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|base)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*\/?\s*(script|style|iframe|object|embed|link|meta|base)\b[^>]*>/gi, '')
    .replace(/\s+on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(href|src|action|formaction|poster|xlink:href)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi, (_match, attr, raw, doubleQuoted, singleQuoted, unquoted) => {
      const url = String(doubleQuoted ?? singleQuoted ?? unquoted ?? '');
      return isSafeUrl(url, { allowImageData: true }) ? ` ${attr}=${raw}` : '';
    })
    .replace(/\s+style\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi, (_match, raw, doubleQuoted, singleQuoted, unquoted) => {
      const clean = sanitizeStyleAttribute(String(doubleQuoted ?? singleQuoted ?? unquoted ?? ''));
      return clean ? ` style="${clean.replace(/"/g, '&quot;')}"` : '';
    });
}

function sanitizeInserts(inserts: SiteContent['customInserts']) {
  return (inserts ?? []).map((insert) => ({
    ...insert,
    html: sanitizeHtml(String(insert.html ?? '')),
  }));
}

function sanitizeHtmlMap(values: SiteContent['customHtmls']) {
  return Object.fromEntries(
    Object.entries(values ?? {}).map(([forgeId, html]) => [forgeId, sanitizeHtml(String(html ?? ''))]),
  );
}

function sanitizeMediaMap(values: SiteContent['customMedia']): SiteContent['customMedia'] {
  return Object.fromEntries(
    Object.entries(values ?? {}).map(([forgeId, value]) => {
      const media = String(value ?? '');
      return [forgeId, isSafeUrl(media, { allowImageData: true }) ? media : ''];
    }),
  );
}

function sanitizeActions(actions: SiteContent['customActions']): SiteContent['customActions'] {
  return Object.fromEntries(
    Object.entries(actions ?? {}).map(([forgeId, action]) => {
      const type = action?.type || 'none';
      const destination = String(action?.destination ?? '');
      const safeDestination = type === 'external' && !isSafeUrl(destination, { allowRelative: false }) ? '' : destination;
      return [forgeId, {
        type,
        destination: safeDestination,
        transition: action?.transition || 'fade',
      }];
    }),
  ) as SiteContent['customActions'];
}

function treatmentPageForId(treatments: SiteContent['treatments'], categories: SiteContent['treatmentCategories'], treatmentId: string) {
  const treatment = treatments.find((item) => item.id === treatmentId);
  const category = categories.find((item) => item.id === treatment?.category);
  return category?.page === 'medicina' ? 'medicina' : 'chirurgia';
}

function normalizeNavItems(items: SiteContent['navItems'], treatments: SiteContent['treatments'], categories: SiteContent['treatmentCategories']): SiteContent['navItems'] {
  return (items ?? []).map((item) => {
    const destinationType = item.destinationType || 'page';
    const rawDestination = item.destination || item.tab || 'home';
    const destination = item.id === 'contatti' && destinationType === 'page' && rawDestination === 'home'
      ? 'contatti'
      : rawDestination;

    return {
      ...item,
      tab: destinationType === 'page'
        ? destination
        : destinationType === 'page-section'
          ? destination.split('#')[0] || item.tab || 'home'
          : destinationType === 'treatment'
            ? treatmentPageForId(treatments, categories, destination)
          : item.tab || 'home',
      destinationType,
      destination,
      children: Array.isArray(item.children) ? normalizeNavItems(item.children, treatments, categories) : [],
    };
  });
}

function sanitizeContent(content: SiteContent): SiteContent {
  return {
    ...content,
    customStyles: sanitizeStyleMap(content.customStyles),
    customMedia: sanitizeMediaMap(content.customMedia),
    customHtmls: sanitizeHtmlMap(content.customHtmls),
    customActions: sanitizeActions(content.customActions),
    customInserts: sanitizeInserts(content.customInserts),
  };
}

function publicContent(content: SiteContent): SiteContent {
  return {
    ...content,
    siteSettings: {
      ...content.siteSettings,
      hosting: {
        ...content.siteSettings.hosting,
        ftpHost: '',
        ftpUser: '',
        publicPath: '',
      },
    },
  };
}

function normalizeContent(content: SiteContent): SiteContent {
  const treatmentCategories: SiteContent['treatmentCategories'] = Array.isArray(content.treatmentCategories) && content.treatmentCategories.length > 0
    ? content.treatmentCategories.map((category, index) => ({
        id: category.id || `categoria-${index + 1}`,
        label: category.label || category.id || `Categoria ${index + 1}`,
        page: category.page === 'medicina' ? 'medicina' : 'chirurgia',
      }))
    : DEFAULT_SITE_CONTENT.treatmentCategories;
  const treatments = content.treatments ?? DEFAULT_SITE_CONTENT.treatments;
  const normalized: SiteContent = {
    ...DEFAULT_SITE_CONTENT,
    ...content,
    meta: {
      ...DEFAULT_SITE_CONTENT.meta,
      ...content.meta,
      savedAt: new Date().toISOString(),
    },
    drInfo: {
      ...DEFAULT_SITE_CONTENT.drInfo,
      ...content.drInfo,
    },
    navItems: normalizeNavItems(content.navItems ?? DEFAULT_SITE_CONTENT.navItems, treatments, treatmentCategories),
    clinics: content.clinics ?? DEFAULT_SITE_CONTENT.clinics,
    treatmentCategories,
    treatments,
    mediaSections: Array.isArray(content.mediaSections) && content.mediaSections.length > 0
      ? content.mediaSections
      : DEFAULT_SITE_CONTENT.mediaSections,
    media: Array.isArray(content.media) ? content.media : DEFAULT_SITE_CONTENT.media,
    assetLibrary: Array.isArray(content.assetLibrary) ? content.assetLibrary : DEFAULT_SITE_CONTENT.assetLibrary,
    testimonials: content.testimonials ?? DEFAULT_SITE_CONTENT.testimonials,
    siteSettings: {
      ...DEFAULT_SITE_CONTENT.siteSettings,
      ...content.siteSettings,
      layout: {
        ...DEFAULT_SITE_CONTENT.siteSettings.layout,
        ...content.siteSettings?.layout,
      },
      sections: {
        ...DEFAULT_SITE_CONTENT.siteSettings.sections,
        ...content.siteSettings?.sections,
      },
      contactForm: {
        ...DEFAULT_SITE_CONTENT.siteSettings.contactForm,
        ...content.siteSettings?.contactForm,
      },
      hosting: {
        ...DEFAULT_SITE_CONTENT.siteSettings.hosting,
        ...content.siteSettings?.hosting,
      },
    },
    customStyles: content.customStyles ?? DEFAULT_SITE_CONTENT.customStyles,
    customMedia: content.customMedia ?? DEFAULT_SITE_CONTENT.customMedia,
    customTexts: content.customTexts ?? DEFAULT_SITE_CONTENT.customTexts,
    customHtmls: content.customHtmls ?? DEFAULT_SITE_CONTENT.customHtmls,
    customLabels: content.customLabels ?? DEFAULT_SITE_CONTENT.customLabels,
    customBehaviors: content.customBehaviors ?? DEFAULT_SITE_CONTENT.customBehaviors,
    customActions: content.customActions ?? DEFAULT_SITE_CONTENT.customActions,
    customInserts: content.customInserts ?? DEFAULT_SITE_CONTENT.customInserts,
  };

  return sanitizeContent(normalized);
}

function readJson<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) return fallback;
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

function writeContent(content: SiteContent, options: { publish?: boolean } = {}) {
  const normalized = normalizeContent(content);
  const payload = JSON.stringify(normalized, null, 2);
  writeFileSync(activeContentPath, payload);
  if (options.publish) {
    writeFileSync(publicContentPath, JSON.stringify(publicContent(normalized), null, 2));
  }
  return normalized;
}

function activeContent() {
  return normalizeContent(readJson<SiteContent>(activeContentPath, DEFAULT_SITE_CONTENT));
}

function templatePath(id: string) {
  return path.join(templatesDir, `${slugify(id)}.json`);
}

function listTemplates() {
  return readdirSync(templatesDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const content = readJson<SiteContent>(path.join(templatesDir, file), DEFAULT_SITE_CONTENT);
      return {
        id: file.replace(/\.json$/, ''),
        name: content.meta.templateName,
        savedAt: content.meta.savedAt,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function seedDefaultTemplate() {
  if (!existsSync(activeContentPath)) {
    writeContent(DEFAULT_SITE_CONTENT);
  }
  writeFileSync(publicContentPath, JSON.stringify(publicContent(activeContent()), null, 2));

  const defaultPath = templatePath('default-mazzarella');
  if (!existsSync(defaultPath)) {
    writeFileSync(defaultPath, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2));
  }
}

function isPortOpen(port: number) {
  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection(port, '127.0.0.1');
    socket.once('connect', () => {
      socket.end();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
    socket.setTimeout(600, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function startViteIfNeeded() {
  if (await isPortOpen(sitePort)) return;

  const viteCli = localBinScript('vite', 'bin', 'vite.js');
  if (!existsSync(viteCli)) {
    console.log('Vite non trovato. Avvia il launcher per installare le dipendenze locali.');
    return;
  }

  const child = spawn(process.execPath, [viteCli, '--port', String(sitePort), '--host', '127.0.0.1'], {
    cwd: rootDir,
    env: localNpmEnv(),
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    if (code) {
      console.log(`Vite si e' chiuso con codice ${code}.`);
    }
  });
}

function crc32(buffer: Buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function dosDateTime(date = new Date()) {
  const time = ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | (Math.floor(date.getSeconds() / 2) & 0x1f);
  const dosDate = (((date.getFullYear() - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0xf) << 5) | (date.getDate() & 0x1f);
  return { time, date: dosDate };
}

function collectFiles(dir: string, base = dir): Array<{ absolute: string; relative: string }> {
  return readdirSync(dir).flatMap((entry) => {
    const absolute = path.join(dir, entry);
    const relative = path.relative(base, absolute).replace(/\\/g, '/');
    return statSync(absolute).isDirectory() ? collectFiles(absolute, base) : [{ absolute, relative }];
  });
}

function auditExportFiles(sourceDir: string) {
  const files = collectFiles(sourceDir);
  for (const file of files) {
    const extension = path.extname(file.relative).toLowerCase();
    const size = statSync(file.absolute).size;
    if (!allowedExportExtensions.has(extension)) {
      throw new Error(`Export bloccato: estensione non consentita (${file.relative}).`);
    }
    if (size > maxExportFileSize) {
      throw new Error(`Export bloccato: file troppo grande (${file.relative}).`);
    }
    if (file.relative.includes('..') || path.isAbsolute(file.relative)) {
      throw new Error(`Export bloccato: percorso non valido (${file.relative}).`);
    }
  }
}

function writeExportSecurityReport(sourceDir: string) {
  const files = collectFiles(sourceDir);
  const report = {
    generatedAt: new Date().toISOString(),
    generatedBy: 'Websites Forge local backend',
    checks: [
      'HTML inserito dal builder sanitizzato server-side',
      'Stili custom filtrati da CSS/URL pericolosi',
      'Credenziali FTP/hosting rimosse dal contenuto pubblico',
      'Estensioni e dimensioni file validate prima dello ZIP',
      'Hash SHA-256 calcolato sugli asset esportati',
    ],
    files: files.map((file) => {
      const data = readFileSync(file.absolute);
      return {
        path: file.relative,
        size: data.length,
        sha256: createHash('sha256').update(data).digest('hex'),
      };
    }),
  };

  writeFileSync(path.join(sourceDir, 'websites-forge-security-report.json'), JSON.stringify(report, null, 2));
}

function writeZip(sourceDir: string, zipPath: string) {
  return new Promise<void>((resolve, reject) => {
    const files = collectFiles(sourceDir);
    const output = createWriteStream(zipPath);
    const centralDirectory: Buffer[] = [];
    let offset = 0;
    const now = dosDateTime();

    output.on('finish', resolve);
    output.on('error', reject);

    for (const file of files) {
      const data = readFileSync(file.absolute);
      const name = Buffer.from(file.relative);
      const crc = crc32(data);
      const local = Buffer.alloc(30);
      local.writeUInt32LE(0x04034b50, 0);
      local.writeUInt16LE(20, 4);
      local.writeUInt16LE(0, 6);
      local.writeUInt16LE(0, 8);
      local.writeUInt16LE(now.time, 10);
      local.writeUInt16LE(now.date, 12);
      local.writeUInt32LE(crc, 14);
      local.writeUInt32LE(data.length, 18);
      local.writeUInt32LE(data.length, 22);
      local.writeUInt16LE(name.length, 26);
      local.writeUInt16LE(0, 28);

      output.write(local);
      output.write(name);
      output.write(data);

      const central = Buffer.alloc(46);
      central.writeUInt32LE(0x02014b50, 0);
      central.writeUInt16LE(20, 4);
      central.writeUInt16LE(20, 6);
      central.writeUInt16LE(0, 8);
      central.writeUInt16LE(0, 10);
      central.writeUInt16LE(now.time, 12);
      central.writeUInt16LE(now.date, 14);
      central.writeUInt32LE(crc, 16);
      central.writeUInt32LE(data.length, 20);
      central.writeUInt32LE(data.length, 24);
      central.writeUInt16LE(name.length, 28);
      central.writeUInt16LE(0, 30);
      central.writeUInt16LE(0, 32);
      central.writeUInt16LE(0, 34);
      central.writeUInt16LE(0, 36);
      central.writeUInt32LE(0, 38);
      central.writeUInt32LE(offset, 42);
      centralDirectory.push(Buffer.concat([central, name]));

      offset += local.length + name.length + data.length;
    }

    const centralStart = offset;
    for (const central of centralDirectory) {
      output.write(central);
      offset += central.length;
    }

    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(0, 4);
    end.writeUInt16LE(0, 6);
    end.writeUInt16LE(files.length, 8);
    end.writeUInt16LE(files.length, 10);
    end.writeUInt32LE(offset - centralStart, 12);
    end.writeUInt32LE(centralStart, 16);
    end.writeUInt16LE(0, 20);
    output.write(end);
    output.end();
  });
}

function normalizePublicPath(value: string) {
  const segments = String(value || '/')
    .replace(/\\/g, '/')
    .split(/[?#]/, 1)[0]
    .split('/')
    .filter((segment) => segment && segment !== '.' && segment !== '..')
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    });
  return segments.length > 0 ? `/${segments.join('/')}/` : '/';
}

function externalizeDataImages(value: unknown, publicPath: string, files = new Set<string>()): unknown {
  if (typeof value === 'string') {
    return value.replace(
      /data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,([a-z0-9+/=\s]+)/gi,
      (source, rawExtension: string, rawData: string) => {
        const data = Buffer.from(rawData.replace(/\s/g, ''), 'base64');
        const normalizedExtension = rawExtension.toLowerCase();
        const extension = normalizedExtension === 'jpeg'
          ? 'jpg'
          : normalizedExtension === 'svg+xml' ? 'svg' : normalizedExtension;
        if (extension === 'svg') {
          const svg = data.toString('utf8');
          if (/<\s*(?:script|foreignObject|iframe|object|embed)\b|\son[a-z]+\s*=|(?:href|xlink:href)\s*=\s*["']\s*(?:javascript:|https?:|\/\/)/i.test(svg)) {
            return '';
          }
        }
        const digest = createHash('sha256').update(data).digest('hex').slice(0, 20);
        const filename = `image-${digest}.${extension}`;
        if (!files.has(filename)) {
          writeFileSync(path.join(exportAssetsDir, filename), data);
          files.add(filename);
        }
        return `${publicPath}website-assets/${filename}`;
      },
    );
  }
  if (Array.isArray(value)) {
    return value.map((item) => externalizeDataImages(item, publicPath, files));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, externalizeDataImages(item, publicPath, files)]),
    );
  }
  return value;
}

function writeFtpInstructions(outputDir: string, publicPath: string) {
  const location = publicPath === '/'
    ? 'la cartella pubblica principale del dominio'
    : `la sottocartella ${publicPath}`;
  const instructions = [
    'EXPORT PRONTO PER FTP',
    '',
    `Carica via FTP tutto il contenuto di questo archivio in ${location}.`,
    'Il file index.html deve restare allo stesso livello della cartella assets.',
    'Non caricare la cartella contenitore dello ZIP: carica i file che trovi al suo interno.',
    '',
    'Contenuto generato automaticamente da Websites Forge.',
  ].join('\r\n');
  writeFileSync(path.join(outputDir, 'ISTRUZIONI-FTP.txt'), instructions);
}

function buildStaticSite(publicPath: string) {
  return new Promise<void>((resolve, reject) => {
    const viteCli = localBinScript('vite', 'bin', 'vite.js');
    if (!existsSync(viteCli)) {
      reject(new Error('Vite non trovato. Avvia il launcher per installare le dipendenze locali.'));
      return;
    }

    const child = spawn(process.execPath, [viteCli, 'build'], {
      cwd: rootDir,
      env: { ...localNpmEnv(), VITE_BASE_PATH: publicPath },
      stdio: 'inherit',
    });
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Build fallita con codice ${code}`)));
  });
}

async function createExport() {
  const normalized = writeContent(activeContent());
  const publicPath = normalizePublicPath(normalized.siteSettings.hosting.publicPath);
  const previewPayload = JSON.stringify(publicContent(normalized), null, 2);

  rmSync(exportAssetsDir, { recursive: true, force: true });
  mkdirSync(exportAssetsDir, { recursive: true });

  try {
    const exportContent = externalizeDataImages(publicContent(normalized), publicPath) as SiteContent;
    writeFileSync(publicContentPath, JSON.stringify(exportContent, null, 2));
    await buildStaticSite(publicPath);

    const outputDir = path.join(rootDir, 'dist');
    if (!existsSync(path.join(outputDir, 'index.html'))) {
      throw new Error('Export non riuscito: index.html non e stato generato.');
    }
    writeFtpInstructions(outputDir, publicPath);
    writeExportSecurityReport(outputDir);
    auditExportFiles(outputDir);

    const filename = `sito-pronto-ftp-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
    const zipPath = path.join(exportsDir, filename);
    await writeZip(outputDir, zipPath);
    return { filename, path: zipPath };
  } finally {
    writeFileSync(publicContentPath, previewPayload);
    rmSync(exportAssetsDir, { recursive: true, force: true });
  }
}

ensureDirs();
seedDefaultTemplate();
startViteIfNeeded();

const app = express();
app.use(express.json({ limit: '80mb' }));
app.use((req, res, next) => {
  const allowedOrigins = new Set([
    `http://127.0.0.1:${forgePort}`,
    `http://localhost:${forgePort}`,
    `http://127.0.0.1:${sitePort}`,
    `http://localhost:${sitePort}`,
  ]);
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin ?? `http://127.0.0.1:${forgePort}`);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();
});

app.options('*', (_req, res) => res.sendStatus(204));

app.get('/', (_req, res) => res.sendFile(editorPath));

app.get('/api/state', (_req, res) => {
  res.json({
    content: activeContent(),
    templates: listTemplates(),
    previewUrl: `http://127.0.0.1:${sitePort}`,
  });
});

app.put('/api/content', (req, res) => {
  res.json({ content: writeContent(req.body as SiteContent), templates: listTemplates() });
});

app.post('/api/templates', (req, res) => {
  const name = String(req.body.name ?? 'Nuovo template');
  const content = normalizeContent({ ...activeContent(), meta: { ...activeContent().meta, templateName: name } });
  writeFileSync(templatePath(name), JSON.stringify(content, null, 2));
  res.json({ templates: listTemplates(), content });
});

app.get('/api/templates/:id', (req, res) => {
  const filePath = templatePath(req.params.id);
  if (!existsSync(filePath)) return res.status(404).json({ error: 'Template non trovato' });
  const content = readJson<SiteContent>(filePath, DEFAULT_SITE_CONTENT);
  res.json({ content: writeContent(content), templates: listTemplates() });
});

app.put('/api/templates/:id', (req, res) => {
  const oldPath = templatePath(req.params.id);
  const name = String(req.body.name ?? req.params.id);
  const content = normalizeContent({ ...activeContent(), meta: { ...activeContent().meta, templateName: name } });
  if (existsSync(oldPath) && oldPath !== templatePath(name)) {
    writeFileSync(templatePath(name), JSON.stringify(content, null, 2));
    unlinkSync(oldPath);
  } else {
    writeFileSync(oldPath, JSON.stringify(content, null, 2));
  }
  res.json({ templates: listTemplates(), content });
});

app.delete('/api/templates/:id', (req, res) => {
  const filePath = templatePath(req.params.id);
  if (existsSync(filePath) && req.params.id !== 'default-mazzarella') {
    unlinkSync(filePath);
  }
  res.json({ templates: listTemplates() });
});

app.post('/api/export', async (_req, res) => {
  try {
    const result = await createExport();
    res.json({ url: `/exports/${result.filename}`, filename: result.filename });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Export non riuscito' });
  }
});

app.use('/exports', express.static(exportsDir));

const server = createServer(app);

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Websites Forge e' gia' in esecuzione: http://127.0.0.1:${forgePort}`);
    console.log('Chiudi la finestra PowerShell del server precedente se vuoi riavviarlo da zero.');
    process.exit(0);
  }
  throw error;
});

server.listen(forgePort, '127.0.0.1', () => {
  console.log(`Websites Forge pronto: http://127.0.0.1:${forgePort}`);
  console.log(`Anteprima sito: http://127.0.0.1:${sitePort}`);
});
