import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { CLINICS, DR_INFO, MEDIA_ITEMS, MEDIA_SECTIONS, TESTIMONIALS, TREATMENTS } from './data';
import type { AssetLibraryItem, Clinic, MediaItem, MediaSection, Testimonial, Treatment } from './types';

export interface SiteInfo {
  name: string;
  title: string;
  shortBio: string;
  philosophy: string;
  portraitUrl?: string;
  credentials: Array<{
    year: string;
    title: string;
    institution: string;
  }>;
}

export interface NavItem {
  id: string;
  label: string;
  tab: string;
  destinationType?: 'section' | 'page' | 'page-section' | 'treatment' | 'external' | 'action';
  destination?: string;
  transition?: 'fade' | 'slide' | 'instant';
  children?: NavItem[];
}

export interface TreatmentCategory {
  id: string;
  label: string;
  page: 'chirurgia' | 'medicina';
}

type AdaptiveSource = 'auto' | 'page' | 'section' | 'element' | 'header';
type ActionDestinationType = 'none' | 'page' | 'section' | 'page-section' | 'treatment' | 'external' | 'action';
type ForgeInsertPosition = 'afterend' | 'beforeend' | 'beforebegin';
type ForgeInsertMode = 'above' | 'below' | 'inside' | 'left' | 'right';

export interface SiteSettings {
  layout: {
    siteWidth: 'contained' | 'full';
    menuWidth: 'contained' | 'full';
  };
  sections: {
    footerVisible: boolean;
    contactFormVisible: boolean;
    floatingActionsVisible: boolean;
  };
  contactForm: {
    submitMode: 'demo' | 'mailto';
    recipientEmail: string;
    subjectPrefix: string;
    successMessage: string;
  };
  contact: {
    mode: 'form' | 'miodottore' | 'custom' | 'none';
    showMap: boolean;
    showSedi: boolean;
    miodottore: {
      integration: 'widget' | 'embed';
      profileUrl: string; // e.g. https://www.miodottore.it/nome-cognome
      embedCode: string; // raw HTML/embed snippet from MioDottore
    };
    customHtml: string; // used when mode === 'custom'
  };
  footer: {
    brandTitle: string;
    brandSubtitle: string;
    brandBlurb: string;
    complianceBadge: string;
    quickLinksTitle: string;
    sediTitle: string;
    showSedi: boolean; // sedi column auto-populated from clinics
    metaLines: string[]; // small right-aligned meta (ref code, VAT number)
    legalText: string;
    copyrightName: string;
    policyLinks: Array<{ label: string; url: string }>;
    // per-page override keyed by page/tab id: 'default' | 'hidden' | 'custom'
    perPage: Record<string, 'default' | 'hidden' | 'custom'>;
    customHtml: Record<string, string>; // per-page custom footer html when perPage === 'custom'
  };
  hosting: {
    domainName: string;
    provider: string;
    ftpHost: string;
    ftpUser: string;
    publicPath: string;
  };
}

export interface SiteContent {
  isContentLoaded?: boolean;
  meta: {
    templateName: string;
    savedAt: string;
  };
  drInfo: SiteInfo;
  navItems: NavItem[];
  clinics: Clinic[];
  treatmentCategories: TreatmentCategory[];
  treatments: Treatment[];
  mediaSections: MediaSection[];
  media: MediaItem[];
  assetLibrary: AssetLibraryItem[];
  testimonials: Testimonial[];
  siteSettings: SiteSettings;
  customStyles?: Record<string, CSSProperties>;
  customMedia?: Record<string, string>;
  customTexts?: Record<string, string>;
  customHtmls?: Record<string, string>;
  customLabels?: Record<string, string>;
  customBehaviors?: Record<string, {
    adaptiveText?: boolean;
    adaptiveSource?: AdaptiveSource;
  }>;
  customActions?: Record<string, {
    type: ActionDestinationType;
    destination: string;
    transition?: 'fade' | 'slide' | 'instant';
  }>;
  customInserts?: Array<{
    id: string;
    targetId: string;
    position: ForgeInsertPosition;
    html: string;
  }>;
}

type ForgeBehavior = NonNullable<SiteContent['customBehaviors']>[string];
type ForgeBehaviorPatch = { forgeId: string; behaviors: Partial<ForgeBehavior> };
type ForgeStylePatch = { forgeId: string; styles: CSSProperties };
type ForgeAction = NonNullable<SiteContent['customActions']>[string];

export const DEFAULT_TREATMENT_CATEGORIES: TreatmentCategory[] = [
  { id: 'seno', label: 'Chirurgia del Seno', page: 'chirurgia' },
  { id: 'viso', label: 'Chirurgia del Viso', page: 'chirurgia' },
  { id: 'corpo', label: 'Chirurgia del Corpo', page: 'chirurgia' },
  { id: 'medicina_estetica', label: 'Medicina Estetica', page: 'medicina' },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  meta: {
    templateName: 'Default Mazzarella',
    savedAt: new Date().toISOString(),
  },
  drInfo: DR_INFO,
  navItems: [
    { id: 'home', label: 'Home', tab: 'home', destinationType: 'page', destination: 'home', transition: 'fade' },
    { id: 'chi-sono', label: 'Chi sono', tab: 'chi-sono', destinationType: 'page', destination: 'chi-sono', transition: 'fade' },
    { id: 'chirurgia', label: 'Chirurgia Plastica', tab: 'chirurgia', destinationType: 'page', destination: 'chirurgia', transition: 'fade' },
    { id: 'medicina', label: 'Medicina Estetica', tab: 'medicina', destinationType: 'page', destination: 'medicina', transition: 'fade' },
    { id: 'media', label: 'Media', tab: 'media', destinationType: 'page', destination: 'media', transition: 'fade' },
    { id: 'studio', label: 'Lo studio', tab: 'studio', destinationType: 'page', destination: 'studio', transition: 'fade' },
    { id: 'contatti', label: 'Contatti', tab: 'contatti', destinationType: 'page', destination: 'contatti', transition: 'fade' },
  ],
  clinics: CLINICS,
  treatmentCategories: DEFAULT_TREATMENT_CATEGORIES,
  treatments: TREATMENTS,
  mediaSections: MEDIA_SECTIONS,
  media: MEDIA_ITEMS,
  assetLibrary: [],
  testimonials: TESTIMONIALS,
  siteSettings: {
    layout: {
      siteWidth: 'contained',
      menuWidth: 'contained',
    },
    sections: {
      footerVisible: true,
      contactFormVisible: true,
      floatingActionsVisible: true,
    },
    contactForm: {
      submitMode: 'demo',
      recipientEmail: 'info@drvincenzomazzarella.it',
      subjectPrefix: 'Richiesta consulenza dal sito',
      successMessage: 'Richiesta ricevuta. La segreteria ti contattera entro 24 ore lavorative.',
    },
    contact: {
      mode: 'form',
      showMap: true,
      showSedi: true,
      miodottore: {
        integration: 'widget',
        profileUrl: '',
        embedCode: '',
      },
      customHtml: '',
    },
    footer: {
      brandTitle: 'Dr. Vincenzo Mazzarella',
      brandSubtitle: 'Specialista in Chirurgia Plastica, Ricostruttiva ed Estetica',
      brandBlurb: "Un percorso improntato sull'eccellenza clinica, la naturalezza del risultato e il rispetto rigoroso dell'identità corporea e facciale di ogni paziente. Napoli, Roma, Milano.",
      complianceBadge: 'Sito Informativo Sanitario Conforme',
      quickLinksTitle: 'Sezioni Principali',
      sediTitle: 'Sedi Principali',
      showSedi: true,
      metaLines: ['Cod. Ref. MAZ-2026', 'P.IVA IT08901234567'],
      legalText: "Informativa Legale Sanitaria: Sito web conforme alle linee guida approvate dalla Federazione Nazionale degli Ordini dei Medici Chirurghi e degli Odontoiatri (FNOMCeO) sulla pubblicità sanitaria e l'informazione medica (Art. 55-56-57 del Codice di Deontologia Medica). Dr. Vincenzo Mazzarella, iscritto all'Ordine dei Medici e Chirurghi di Napoli n. 12345. Specialista in Chirurgia Plastica Ricostruttiva ed Estetica.",
      copyrightName: 'Dr. Vincenzo Mazzarella. Tutti i diritti riservati.',
      policyLinks: [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Cookie Policy', url: '#' },
        { label: 'Termini di Utilizzo', url: '#' },
      ],
      perPage: {},
      customHtml: {},
    },
    hosting: {
      domainName: 'drvincenzomazzarella.it',
      provider: 'Aruba',
      ftpHost: '',
      ftpUser: '',
      publicPath: '/',
    },
  },
  customStyles: {},
  customMedia: {},
  customTexts: {},
  customHtmls: {},
  customLabels: {},
  customBehaviors: {},
  customActions: {},
  customInserts: [],
};

function setByPath(target: any, path: string, value: unknown) {
  const parts = path.split('.');
  const last = parts.pop();
  if (!last) return;
  const parent = parts.reduce((acc, part) => acc?.[part], target);
  if (parent) {
    parent[last] = value;
  }
}

function normalizeTreatmentCategories(categories?: TreatmentCategory[]): TreatmentCategory[] {
  const source = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_TREATMENT_CATEGORIES;
  return source.map((category, index) => ({
    id: category.id || `categoria-${index + 1}`,
    label: category.label || category.id || `Categoria ${index + 1}`,
    page: category.page === 'medicina' ? 'medicina' : 'chirurgia',
  }));
}

function treatmentCategoryLabel(categoryId: string, categories: TreatmentCategory[]) {
  return categories.find((category) => category.id === categoryId)?.label || categoryId.replace(/_/g, ' ');
}

export function treatmentPageForCategory(categoryId: string, categories: TreatmentCategory[]) {
  return categories.find((category) => category.id === categoryId)?.page === 'medicina' ? 'medicina' : 'chirurgia';
}

function treatmentPageForId(treatments: Treatment[], categories: TreatmentCategory[], treatmentId: string) {
  const treatment = treatments.find((item) => item.id === treatmentId);
  return treatment ? treatmentPageForCategory(treatment.category, categories) : 'chirurgia';
}

function normalizeNavItems(items: NavItem[], treatments: Treatment[], categories: TreatmentCategory[]): NavItem[] {
  return items.map((item) => {
    const destinationType = item.destinationType || 'page';
    const repairedDestination = item.id === 'contatti' && destinationType === 'page' && (item.destination || item.tab) === 'home'
      ? 'contatti'
      : item.destination || item.tab || 'home';

    return {
      ...item,
      tab: destinationType === 'page'
        ? repairedDestination
        : destinationType === 'page-section'
          ? repairedDestination.split('#')[0] || item.tab || 'home'
          : destinationType === 'treatment'
            ? treatmentPageForId(treatments, categories, repairedDestination)
          : item.tab || 'home',
      destinationType,
      destination: repairedDestination,
      children: item.children ? normalizeNavItems(item.children, treatments, categories) : [],
    };
  });
}

function autoForgePath(element: HTMLElement) {
  const parts: string[] = [];
  let cursor: HTMLElement | null = element;
  while (cursor && cursor !== document.body) {
    const tagName = cursor.tagName.toLowerCase();
    let index = 1;
    let sibling = cursor.previousElementSibling;
    while (sibling) {
      if (sibling.tagName.toLowerCase() === tagName) index += 1;
      sibling = sibling.previousElementSibling;
    }
    parts.unshift(`${tagName}:nth-of-type(${index})`);
    cursor = cursor.parentElement;
  }
  return `auto:${parts.join('>')}`;
}

function assignAutoForgeIds() {
  document.body.querySelectorAll<HTMLElement>('*').forEach((element) => {
    if (element.closest('#websites-forge-live-overlay')) return;
    if (!element.dataset.forgeId && !element.dataset.forgeAutoId) {
      element.dataset.forgeAutoId = autoForgePath(element);
    }
  });
}

const MANAGED_STYLE_KEYS = [
  'margin', 'padding', 'width', 'height', 'fontSize', 'fontWeight', 'textAlign', 'lineHeight',
  'letterSpacing', 'color', 'backgroundColor', 'borderRadius', 'transform', 'marginLeft',
  'marginRight', 'display', 'backgroundImage', 'maxWidth', 'minHeight',
  'objectFit', 'objectPosition', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
  'aspectRatio', 'opacity',
  'fontStyle', 'textTransform', 'fontFamily', 'flexWrap', 'gridTemplateColumns',
  'flexDirection', 'gap', 'alignItems', 'justifyContent',
] as const;

const PAGE_SECTION_OPTIONS = [
  ['chirurgia#seno', 'Chirurgia Plastica / Seno'],
  ['chirurgia#viso', 'Chirurgia Plastica / Viso'],
  ['chirurgia#corpo', 'Chirurgia Plastica / Corpo'],
  ['medicina#medicina-trattamenti', 'Medicina Estetica / Trattamenti'],
  ['studio#studio-sedi', 'Lo studio / Sedi'],
  ['media#media-video', 'Media / Video'],
  ['media#media-press', 'Media / Rassegna stampa'],
  ['contatti#contatti-mappa', 'Contatti / Mappa'],
  ['contatti#contatti-form', 'Contatti / Form contatto'],
] as const;

const pageSectionOptions = (categories: TreatmentCategory[], mediaSections: MediaSection[] = []) => {
  const seen = new Set<string>();
  return [
    ...categories.map((category) => [
      `${category.page === 'medicina' ? 'medicina' : 'chirurgia'}#${category.id}`,
      `${category.page === 'medicina' ? 'Medicina Estetica' : 'Chirurgia Plastica'} / ${category.label}`,
    ] as const),
    ...mediaSections.map((section) => [
      `media#media-${section.id}`,
      `Media / ${section.title}`,
    ] as const),
    ...PAGE_SECTION_OPTIONS,
  ].filter(([value]) => {
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

const treatmentGroupLabel = (category: Treatment['category'], categories: TreatmentCategory[]) => treatmentCategoryLabel(category, categories);

const basePageOptions = [
  ['home', 'Home'],
  ['chi-sono', 'Chi sono'],
  ['chirurgia', 'Chirurgia Plastica'],
  ['medicina', 'Medicina Estetica'],
  ['media', 'Media'],
  ['studio', 'Lo studio'],
  ['contatti', 'Contatti'],
] as const;

const pageDestinationOptions = (treatments: Treatment[], categories: TreatmentCategory[]) => [
  ...basePageOptions,
  ...treatments.map((treatment) => [`treatment:${treatment.id}`, `${treatmentGroupLabel(treatment.category, categories)} / ${treatment.title}`] as const),
];

const SiteContentContext = createContext<SiteContent>(DEFAULT_SITE_CONTENT);
const runtimeMediaOriginals = new Map<string, string>();

const mediaSelector = (forgeId: string) => `[data-forge-id="${forgeId}"], [data-forge-auto-id="${forgeId}"], [data-forge-insert-id="${forgeId}"]`;
const forgeIdentityOf = (element: HTMLElement) => element.dataset.forgeId || element.dataset.forgeInsertId || element.dataset.forgeAutoId || '';

const imageUrlFromCssBackground = (value: unknown) => {
  const background = String(value || '').trim();
  if (!background || background === 'none') return '';
  return background.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
};

const mediaClassWithoutFixedSize = (value: string) =>
  value
    .split(/\s+/)
    .filter((token) => token && !/^w-/.test(token) && !/^h-/.test(token))
    .join(' ');

const mediaReplacementBounds = (forgeId: string, rect: DOMRect) => {
  if (forgeId.includes('footer-logo')) return { maxWidth: '140px', maxHeight: '38px' };
  if (forgeId.includes('mobile') && forgeId.includes('logo')) return { maxWidth: '92px', maxHeight: '30px' };
  if (forgeId.includes('logo')) return { maxWidth: '96px', maxHeight: '34px' };
  return {
    maxWidth: rect.width ? `${Math.round(rect.width)}px` : '100%',
    maxHeight: rect.height ? `${Math.round(rect.height)}px` : '100%',
  };
};

const isInlineVectorElement = (element: HTMLElement) => element.tagName.toLowerCase() === 'svg' || Boolean(element.querySelector('svg'));

const mediaImageTarget = (element: HTMLElement) => element instanceof HTMLImageElement ? element : element.querySelector<HTMLImageElement>('img:not([data-forge-media-replacement])');

const ensureVectorMediaReplacement = (forgeId: string, element: HTMLElement) => {
  const isRootSvg = element.tagName.toLowerCase() === 'svg';
  const host = isRootSvg ? element.parentElement : element;
  if (!host) return null;
  let replacement = host.querySelector<HTMLImageElement>(`img[data-forge-media-replacement-for="${forgeId}"]`);
  if (!replacement) {
    const rect = element.getBoundingClientRect();
    const bounds = mediaReplacementBounds(forgeId, rect);
    replacement = document.createElement('img');
    replacement.dataset.forgeMediaReplacement = 'true';
    replacement.dataset.forgeMediaReplacementFor = forgeId;
    replacement.dataset.forgeAutoId = forgeId;
    replacement.alt = element.getAttribute('aria-label') || element.getAttribute('title') || 'Logo';
    replacement.decoding = 'sync';
    replacement.loading = 'eager';
    replacement.className = mediaClassWithoutFixedSize(element.getAttribute('class') || '');
    replacement.style.width = 'auto';
    replacement.style.height = 'auto';
    replacement.style.maxWidth = bounds.maxWidth;
    replacement.style.maxHeight = bounds.maxHeight;
    replacement.style.flexShrink = '0';
    replacement.style.objectFit = 'contain';
    replacement.style.display = 'block';
    if (isRootSvg) element.insertAdjacentElement('afterend', replacement);
    else host.appendChild(replacement);
  }
  if (isRootSvg) element.style.display = 'none';
  else Array.from(element.children).forEach((child) => {
    if (child !== replacement) (child as HTMLElement).style.display = 'none';
  });
  return replacement;
};

const clearVectorMediaReplacement = (element: HTMLElement) => {
  const isRootSvg = element.tagName.toLowerCase() === 'svg';
  const host = isRootSvg ? element.parentElement : element;
  host?.querySelector<HTMLImageElement>('img[data-forge-media-replacement="true"]')?.remove();
  if (isRootSvg) element.style.display = '';
  Array.from(element.children).forEach((child) => {
    (child as HTMLElement).style.display = '';
  });
};

const rememberOriginalMedia = (forgeId: string, element: HTMLElement, image?: HTMLImageElement | null) => {
  if (runtimeMediaOriginals.has(forgeId)) return;
  const original = image
    ? image.getAttribute('src') ?? ''
    : element.style.backgroundImage || '';
  runtimeMediaOriginals.set(forgeId, original);
};

const restoreOriginalMedia = (forgeId: string) => {
  if (!runtimeMediaOriginals.has(forgeId)) return;
  const original = runtimeMediaOriginals.get(forgeId) ?? '';
  document.querySelectorAll<HTMLElement>(mediaSelector(forgeId)).forEach((element) => {
    const image = element instanceof HTMLImageElement ? element : element.querySelector<HTMLImageElement>('img');
    if (image) {
      if (original) image.src = original;
      else image.removeAttribute('src');
    } else {
      element.style.backgroundImage = original;
      if (!original) {
        element.style.backgroundSize = '';
        element.style.backgroundPosition = '';
        element.style.backgroundRepeat = '';
      }
    }
    element.removeAttribute('data-forge-managed-media');
    element.removeAttribute('data-forge-original-src');
  });
  runtimeMediaOriginals.delete(forgeId);
};

function normalizeMediaSections(sections?: MediaSection[]): MediaSection[] {
  const source = Array.isArray(sections) && sections.length > 0 ? sections : DEFAULT_SITE_CONTENT.mediaSections;
  const validLayouts: MediaSection['layout'][] = ['video-grid', 'press-grid', 'image-carousel'];
  return source.map((section, index) => ({
    id: section.id || `sezione-${index + 1}`,
    title: section.title || section.id || `Sezione ${index + 1}`,
    subtitle: section.subtitle || '',
    layout: validLayouts.includes(section.layout) ? section.layout : 'press-grid',
  }));
}

function normalizeMedia(items?: MediaItem[]): MediaItem[] {
  if (!Array.isArray(items)) return DEFAULT_SITE_CONTENT.media;
  const validKinds: MediaItem['kind'][] = ['video', 'image', 'article'];
  return items.map((item, index) => ({
    id: item.id || `media-${index + 1}`,
    sectionId: item.sectionId || '',
    kind: validKinds.includes(item.kind) ? item.kind : 'article',
    title: item.title || '',
    excerpt: item.excerpt || '',
    source: item.source || '',
    category: item.category || '',
    date: item.date || '',
    duration: item.duration || '',
    thumbnail: item.thumbnail || '',
    linkMode: item.linkMode === 'external' ? 'external' : 'internal',
    externalUrl: item.externalUrl || '',
    videoUrl: item.videoUrl || '',
    videoFile: item.videoFile || '',
    images: Array.isArray(item.images) ? item.images.filter(Boolean) : [],
    body: item.body || '',
  }));
}

function normalizeClinics(clinics?: Clinic[]): Clinic[] {
  const source = Array.isArray(clinics) && clinics.length > 0 ? clinics : DEFAULT_SITE_CONTENT.clinics;
  return source.map((clinic, index) => ({
    id: clinic.id || `sede-${index + 1}`,
    city: clinic.city || clinic.name || `Sede ${index + 1}`,
    name: clinic.name || clinic.city || `Sede ${index + 1}`,
    address: clinic.address || '',
    phone: clinic.phone || '',
    email: clinic.email || '',
    hours: clinic.hours || '',
    mapEmbedUrl: clinic.mapEmbedUrl || '',
    images: Array.isArray(clinic.images) ? clinic.images.filter(Boolean) : [],
    description: clinic.description || '',
    equipment: Array.isArray(clinic.equipment) ? clinic.equipment.filter(Boolean) : [],
    lat: typeof clinic.lat === 'number' ? clinic.lat : undefined,
    lng: typeof clinic.lng === 'number' ? clinic.lng : undefined,
  }));
}

function mergeContent(content: Partial<SiteContent>): SiteContent {
  const treatmentCategories = normalizeTreatmentCategories(content.treatmentCategories ?? DEFAULT_SITE_CONTENT.treatmentCategories);
  const treatments = content.treatments ?? DEFAULT_SITE_CONTENT.treatments;
  return {
    meta: { ...DEFAULT_SITE_CONTENT.meta, ...content.meta },
    drInfo: { ...DEFAULT_SITE_CONTENT.drInfo, ...content.drInfo },
    navItems: normalizeNavItems(content.navItems ?? DEFAULT_SITE_CONTENT.navItems, treatments, treatmentCategories),
    clinics: normalizeClinics(content.clinics),
    treatmentCategories,
    treatments,
    mediaSections: normalizeMediaSections(content.mediaSections),
    media: normalizeMedia(content.media),
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
      contact: {
        ...DEFAULT_SITE_CONTENT.siteSettings.contact,
        ...content.siteSettings?.contact,
        miodottore: {
          ...DEFAULT_SITE_CONTENT.siteSettings.contact.miodottore,
          ...content.siteSettings?.contact?.miodottore,
        },
      },
      footer: {
        ...DEFAULT_SITE_CONTENT.siteSettings.footer,
        ...content.siteSettings?.footer,
        metaLines: Array.isArray(content.siteSettings?.footer?.metaLines)
          ? content.siteSettings!.footer!.metaLines
          : DEFAULT_SITE_CONTENT.siteSettings.footer.metaLines,
        policyLinks: Array.isArray(content.siteSettings?.footer?.policyLinks)
          ? content.siteSettings!.footer!.policyLinks
          : DEFAULT_SITE_CONTENT.siteSettings.footer.policyLinks,
        perPage: {
          ...content.siteSettings?.footer?.perPage,
        },
        customHtml: {
          ...content.siteSettings?.footer?.customHtml,
        },
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
    isContentLoaded: content.isContentLoaded ?? false,
  };
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    let cancelled = false;

    const applyContent = (nextContent: Partial<SiteContent>) => {
      if (!cancelled) {
        setContent(mergeContent({ ...nextContent, isContentLoaded: true }));
      }
    };

    const loadContent = async () => {
      try {
        const isLocalPreview = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
        if (isLocalPreview) {
          const forgeResponse = await fetch(`http://127.0.0.1:4177/api/state?t=${Date.now()}`, { cache: 'no-store' });
          if (forgeResponse.ok) {
            const forgeState = await forgeResponse.json();
            if (forgeState.content) {
              applyContent(forgeState.content);
              return;
            }
          }
        }

        const response = await fetch(`${import.meta.env.BASE_URL}site-content.json?t=${Date.now()}`, { cache: 'no-store' });
        if (response.ok) {
          applyContent(await response.json());
        }
      } catch {
        applyContent(DEFAULT_SITE_CONTENT);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'WEBSITES_FORGE_CONTENT') {
        applyContent(event.data.content);
      }
      if (event.data?.type === 'WEBSITES_FORGE_CONTENT_FIELD_PATCH') {
        setContent((current) => {
          const next = structuredClone(current);
          setByPath(next, event.data.path, event.data.value);
          return mergeContent(next);
        });
      }
      if (event.data?.type === 'WEBSITES_FORGE_LIVE_EDIT') {
        document.documentElement.toggleAttribute('data-forge-live-edit', Boolean(event.data.enabled));
        document.querySelectorAll<HTMLElement>('[data-forge-path]').forEach((element) => {
          element.contentEditable = String(Boolean(event.data.enabled));
          element.spellcheck = Boolean(event.data.enabled);
        });
      }
      if (event.data?.type === 'WEBSITES_FORGE_STYLE_UPDATE') {
        const { forgeId, styles } = event.data;
        setContent((current) => mergeContent({
          ...current,
          customStyles: {
            ...current.customStyles,
            [forgeId]: {
              ...(current.customStyles?.[forgeId] ?? {}),
              ...styles,
            },
          },
        }));
      }
      if (event.data?.type === 'WEBSITES_FORGE_BEHAVIOR_UPDATE') {
        const { forgeId, behaviors } = event.data;
        setContent((current) => mergeContent({
          ...current,
          customBehaviors: {
            ...current.customBehaviors,
            [forgeId]: {
              ...(current.customBehaviors?.[forgeId] ?? {}),
              ...behaviors,
            },
          },
        }));
      }
      if (event.data?.type === 'WEBSITES_FORGE_LABEL_UPDATE') {
        const { forgeId, label } = event.data;
        setContent((current) => mergeContent({
          ...current,
          customLabels: {
            ...current.customLabels,
            [forgeId]: label,
          },
        }));
      }
      if (event.data?.type === 'WEBSITES_FORGE_ACTION_UPDATE') {
        const { forgeId, action } = event.data;
        setContent((current) => mergeContent({
          ...current,
          customActions: {
            ...current.customActions,
            [forgeId]: action,
          },
        }));
      }
    };

    loadContent();
    window.addEventListener('message', handleMessage);
    return () => {
      cancelled = true;
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const parseRgb = (value: string) => {
      const parts = value.match(/\d+(\.\d+)?/g)?.map(Number);
      if (!parts || parts.length < 3) return null;
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: parts.length > 3 ? parts[3] : 1,
      };
    };

    const isLightColor = (value: string) => {
      const color = parseRgb(value);
      if (!color || color.a === 0) return false;
      return ((0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255) > 0.58;
    };

    const backgroundToneFromClass = (element: HTMLElement) => {
      const className = String(element.getAttribute('class') || '');
      if (/\bbg-(brand-deep|brand-dark|stone-950|stone-900|navy-950|navy-900)\b/.test(className)) return 'dark';
      if (/\bbg-(white|stone-50|stone-100|stone-200|gold-50|navy-50)\b/.test(className)) return 'light';
      if (className.includes('bg-[#f4f5f8]') || className.includes('bg-[#FAF9F6]')) return 'light';
      if (className.includes('from-brand-deep') || className.includes('from-brand-dark')) return 'dark';
      return null;
    };

    const visibleBackgroundIsLight = (fromElement: HTMLElement | null) => {
      let current = fromElement;
      while (current && current !== document.documentElement) {
        const tone = backgroundToneFromClass(current);
        if (tone) return tone === 'light';
        const background = window.getComputedStyle(current).backgroundColor;
        const color = parseRgb(background);
        if (color && color.a > 0.05) return isLightColor(background);
        current = current.parentElement;
      }

      return isLightColor(window.getComputedStyle(document.body).backgroundColor);
    };

    const visibleBackgroundAtPointIsLight = (x: number, y: number, ignoredAncestor?: HTMLElement | null) => {
      const elements = document.elementsFromPoint(x, y) as HTMLElement[];
      const candidate = elements.find((item) => {
        if (item.closest('#websites-forge-live-overlay')) return false;
        if (ignoredAncestor && (item === ignoredAncestor || ignoredAncestor.contains(item))) return false;
        return item !== document.documentElement && item !== document.body;
      });
      return visibleBackgroundIsLight(candidate ?? document.body);
    };

    const adaptiveTextShouldUseContrast = (element: HTMLElement) => {
      const source = element.dataset.forgeAdaptiveSource || 'auto';
      const header = element.closest<HTMLElement>('[data-header-tone]');
      if (source === 'header' && header) return header.dataset.headerTone === 'light';
      if (source === 'section') return visibleBackgroundIsLight(element.closest<HTMLElement>('section, main, footer, header') ?? element.parentElement);
      if (source === 'element') return visibleBackgroundIsLight(element.parentElement);
      if (source === 'page' || (source === 'auto' && header)) {
        const rect = element.getBoundingClientRect();
        const sampleX = Math.min(Math.max(rect.left + rect.width / 2, 1), window.innerWidth - 1);
        const sampleY = Math.min(Math.max(rect.top + rect.height / 2, 1), window.innerHeight - 1);
        return visibleBackgroundAtPointIsLight(sampleX, sampleY, header);
      }
      if (header) {
        const elementRect = element.getBoundingClientRect();
        const sampleX = Math.min(Math.max(elementRect.left + elementRect.width / 2, 1), window.innerWidth - 1);
        const sampleY = Math.min(Math.max(elementRect.top + elementRect.height / 2, 1), window.innerHeight - 1);
        return visibleBackgroundAtPointIsLight(sampleX, sampleY, header);
      }

      return visibleBackgroundIsLight(element.parentElement);
    };

    const updateAdaptiveTextColors = () => {
      document.querySelectorAll<HTMLElement>('[data-forge-adaptive-text="true"]').forEach((element) => {
        const useDark = adaptiveTextShouldUseContrast(element);
        const nextColor = useDark ? '#090C16' : '#ffffff';
        element.style.setProperty('color', nextColor, 'important');
        const image = element instanceof HTMLImageElement
          ? element
          : element.querySelector<HTMLImageElement>('img:not([data-forge-media-replacement]), img[data-forge-media-replacement="true"]')
            ?? (forgeIdentityOf(element) ? element.parentElement?.querySelector<HTMLImageElement>(`img[data-forge-media-replacement-for="${forgeIdentityOf(element)}"]`) ?? null : null);
        if (image) {
          image.dataset.forgeAdaptiveMedia = 'true';
          image.style.filter = useDark ? 'brightness(0) saturate(100%)' : 'brightness(0) invert(1)';
        }
      });
    };

    const applyRuntimeCustomizations = () => {
      assignAutoForgeIds();
      const activeInsertIds = new Set((content.customInserts ?? []).map((insert) => insert.id));
      document.querySelectorAll<HTMLElement>('[data-forge-insert-id]').forEach((element) => {
        const insertId = element.dataset.forgeInsertId;
        if (insertId && !activeInsertIds.has(insertId)) {
          element.remove();
        }
      });
      (content.customInserts ?? []).forEach((insert) => {
        if (document.querySelector(`[data-forge-insert-id="${insert.id}"]`)) return;
        const target = document.querySelector<HTMLElement>(`[data-forge-id="${insert.targetId}"], [data-forge-auto-id="${insert.targetId}"]`);
        if (!target) return;
        if (target.closest('header, nav, .nav-submenu') && /Nuovo contenitore/.test(insert.html)) return;
        target.insertAdjacentHTML(insert.position, insert.html);
      });
      assignAutoForgeIds();
      document.querySelectorAll<HTMLElement>('[data-forge-managed-style]').forEach((element) => {
        MANAGED_STYLE_KEYS.forEach((key) => {
          (element.style as any)[key] = '';
        });
        element.removeAttribute('data-forge-managed-style');
      });
      const activeMediaIds = new Set(Object.keys(content.customMedia ?? {}));
      document.querySelectorAll<HTMLElement>('[data-forge-managed-media]').forEach((element) => {
        const managedMediaId = element.dataset.forgeManagedMediaId;
        if (managedMediaId && activeMediaIds.has(managedMediaId)) return;
        const image = element instanceof HTMLImageElement ? element : element.querySelector<HTMLImageElement>('img');
        if (image && element.dataset.forgeOriginalSrc !== undefined) {
          if (element.dataset.forgeOriginalSrc) image.src = element.dataset.forgeOriginalSrc;
          else image.removeAttribute('src');
        }
        if (isInlineVectorElement(element)) clearVectorMediaReplacement(element);
        element.removeAttribute('data-forge-managed-media');
        element.removeAttribute('data-forge-managed-media-id');
        element.removeAttribute('data-forge-original-src');
      });
      Array.from(runtimeMediaOriginals.keys()).forEach((forgeId) => {
        if (!activeMediaIds.has(forgeId)) restoreOriginalMedia(forgeId);
      });
      document.querySelectorAll<HTMLElement>('[data-forge-adaptive-media="true"]').forEach((element) => {
        element.style.filter = '';
        element.removeAttribute('data-forge-adaptive-media');
      });
      document.querySelectorAll<HTMLElement>('[data-forge-adaptive-text]').forEach((element) => {
        element.removeAttribute('data-forge-adaptive-text');
        element.removeAttribute('data-forge-adaptive-source');
      });
      document.documentElement.dataset.forgeSiteWidth = content.siteSettings.layout.siteWidth;
      document.documentElement.dataset.forgeMenuWidth = content.siteSettings.layout.menuWidth;
      Object.entries(content.customStyles ?? {}).forEach(([forgeId, styles]) => {
        document.querySelectorAll<HTMLElement>(`[data-forge-id="${forgeId}"], [data-forge-auto-id="${forgeId}"], [data-forge-insert-id="${forgeId}"]`).forEach((element) => {
          const image = element instanceof HTMLImageElement ? element : null;
          const legacyBackgroundImage = image ? imageUrlFromCssBackground(styles.backgroundImage) : '';
          if (image && legacyBackgroundImage) {
            image.src = legacyBackgroundImage;
            const { backgroundImage, backgroundSize, backgroundPosition, backgroundRepeat, color, ...stylePatch } = styles as Record<string, unknown>;
            Object.assign(element.style, stylePatch);
            element.style.backgroundImage = 'none';
            element.style.backgroundSize = '';
            element.style.backgroundPosition = '';
            element.style.backgroundRepeat = '';
            element.style.color = '';
          } else {
            Object.assign(element.style, styles);
          }
          element.dataset.forgeManagedStyle = 'true';
        });
      });
      Object.entries(content.customMedia ?? {}).forEach(([forgeId, value]) => {
        document.querySelectorAll<HTMLElement>(mediaSelector(forgeId)).forEach((element) => {
          if (element.dataset.forgeMediaReplacement === 'true') return;
          if (isInlineVectorElement(element)) {
            rememberOriginalMedia(forgeId, element);
            const replacement = value ? ensureVectorMediaReplacement(forgeId, element) : null;
            if (replacement) replacement.src = value;
            else clearVectorMediaReplacement(element);
            element.dataset.forgeManagedMedia = 'true';
            element.dataset.forgeManagedMediaId = forgeId;
            return;
          }
          const image = element instanceof HTMLImageElement ? element : element.querySelector<HTMLImageElement>('img');
          if (image) {
            rememberOriginalMedia(forgeId, element, image);
            element.dataset.forgeOriginalSrc = runtimeMediaOriginals.get(forgeId) ?? image.getAttribute('src') ?? '';
            if (value) image.src = value;
            else image.removeAttribute('src');
            element.dataset.forgeManagedMedia = 'true';
            element.dataset.forgeManagedMediaId = forgeId;
            return;
          }
          element.style.backgroundImage = value ? `url("${value}")` : '';
          element.style.backgroundSize = value ? 'cover' : '';
          element.style.backgroundPosition = value ? 'center' : '';
          element.dataset.forgeManagedStyle = 'true';
        });
      });
      Object.entries(content.customBehaviors ?? {}).forEach(([forgeId, behaviors]) => {
        document.querySelectorAll<HTMLElement>(`[data-forge-id="${forgeId}"], [data-forge-auto-id="${forgeId}"], [data-forge-insert-id="${forgeId}"]`).forEach((element) => {
          if (behaviors.adaptiveText) {
            element.dataset.forgeAdaptiveText = 'true';
            element.dataset.forgeAdaptiveSource = behaviors.adaptiveSource || 'auto';
            element.style.color = '';
          }
        });
      });
      Object.entries(content.customLabels ?? {}).forEach(([forgeId, label]) => {
        document.querySelectorAll<HTMLElement>(`[data-forge-id="${forgeId}"], [data-forge-auto-id="${forgeId}"], [data-forge-insert-id="${forgeId}"]`).forEach((element) => {
          element.dataset.forgeLayerLabel = label;
        });
      });
      Object.entries(content.customActions ?? {}).forEach(([forgeId, action]) => {
        document.querySelectorAll<HTMLElement>(`[data-forge-id="${forgeId}"], [data-forge-auto-id="${forgeId}"], [data-forge-insert-id="${forgeId}"]`).forEach((element) => {
          if (!action || action.type === 'none') return;
          element.dataset.forgeActionType = action.type;
          element.dataset.forgeActionDestination = action.destination;
          element.dataset.forgeActionTransition = action.transition || 'fade';
          element.style.cursor = 'pointer';
          element.onclick = (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            window.dispatchEvent(new CustomEvent('websites-forge-navigate', { detail: action }));
          };
        });
      });
      Object.entries(content.customTexts ?? {}).forEach(([forgeId, text]) => {
        document.querySelectorAll<HTMLElement>(`[data-forge-auto-id="${forgeId}"], [data-forge-insert-id="${forgeId}"]`).forEach((element) => {
          if (element.dataset.forgePath) return;
          if (element.childElementCount === 0 && element.textContent !== text) {
            element.textContent = text;
          }
        });
      });
      Object.entries(content.customHtmls ?? {}).forEach(([forgeId, html]) => {
        document.querySelectorAll<HTMLElement>(`[data-forge-auto-id="${forgeId}"], [data-forge-insert-id="${forgeId}"], [data-forge-id="${forgeId}"]`).forEach((element) => {
          if (element.dataset.forgePath) return;
          if (element.innerHTML !== html) {
            element.innerHTML = html;
          }
        });
      });
      updateAdaptiveTextColors();
    };

    const isForgeOverlayNode = (node: Node | null) => {
      if (!node) return false;
      const element = node instanceof Element
        ? node
        : node.parentNode instanceof Element
          ? node.parentNode
          : null;
      return Boolean(element?.closest('#websites-forge-live-overlay'));
    };

    const scheduleRuntimeApply = (event?: Event) => {
      if (event && isForgeOverlayNode(event.target as Node | null)) return;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        applyRuntimeCustomizations();
      });
    };

    applyRuntimeCustomizations();
    const observer = new MutationObserver((mutations) => {
      const hasSiteMutation = mutations.some((mutation) => {
        if (isForgeOverlayNode(mutation.target)) return false;
        const nodes = [...Array.from(mutation.addedNodes), ...Array.from(mutation.removedNodes)];
        return nodes.length === 0 || nodes.some((node) => !isForgeOverlayNode(node));
      });
      if (hasSiteMutation) scheduleRuntimeApply();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', scheduleRuntimeApply, true);
    window.addEventListener('resize', scheduleRuntimeApply);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleRuntimeApply, true);
      window.removeEventListener('resize', scheduleRuntimeApply);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [content.siteSettings, content.customStyles, content.customMedia, content.customTexts, content.customHtmls, content.customLabels, content.customBehaviors, content.customActions, content.customInserts]);

  useEffect(() => {
    const editableSelector = '[data-forge-id], [data-forge-auto-id], [data-forge-insert-id], [data-forge-path], [data-forge-image-path]';
    const overlayRoot = document.createElement('div');
    overlayRoot.id = 'websites-forge-live-overlay';
    overlayRoot.innerHTML = `
      <div class="wf-hover-box" hidden><span data-wf-hover-label></span></div>
      <div class="wf-spacing-box wf-margin-box" hidden><span>margin</span></div>
      <div class="wf-spacing-box wf-padding-box" hidden><span>padding</span></div>
      <div class="wf-spacing-box wf-content-box" hidden><span>content</span></div>
      <div class="wf-box"></div>
      <div class="wf-context-box" hidden></div>
      <div class="wf-element-handles" hidden>
        <button type="button" class="wf-element-move" data-wf-element-drag title="Sposta elemento">Sposta</button>
        <button type="button" class="wf-insert-plus wf-insert-before" data-wf-insert-plus="beforebegin" data-wf-insert-mode="above" title="Aggiungi sopra">+</button>
        <button type="button" class="wf-insert-plus wf-insert-left" data-wf-insert-plus="beforebegin" data-wf-insert-mode="left" title="Aggiungi a sinistra">+</button>
        <button type="button" class="wf-insert-plus wf-insert-right" data-wf-insert-plus="afterend" data-wf-insert-mode="right" title="Aggiungi a destra">+</button>
        <button type="button" class="wf-insert-plus wf-insert-after" data-wf-insert-plus="afterend" data-wf-insert-mode="below" title="Aggiungi sotto">+</button>
        <button type="button" class="wf-resize-handle wf-resize-n" data-wf-resize="n" title="Ridimensiona alto"></button>
        <button type="button" class="wf-resize-handle wf-resize-e" data-wf-resize="e" title="Ridimensiona destra"></button>
        <button type="button" class="wf-resize-handle wf-resize-s" data-wf-resize="s" title="Ridimensiona basso"></button>
        <button type="button" class="wf-resize-handle wf-resize-w" data-wf-resize="w" title="Ridimensiona sinistra"></button>
        <button type="button" class="wf-resize-handle wf-resize-ne" data-wf-resize="ne" title="Ridimensiona angolo"></button>
        <button type="button" class="wf-resize-handle wf-resize-se" data-wf-resize="se" title="Ridimensiona angolo"></button>
        <button type="button" class="wf-resize-handle wf-resize-sw" data-wf-resize="sw" title="Ridimensiona angolo"></button>
        <button type="button" class="wf-resize-handle wf-resize-nw" data-wf-resize="nw" title="Ridimensiona angolo"></button>
      </div>
      <div class="wf-layers" hidden>
        <div class="wf-layers-head" data-wf-layers-drag>
          <div>
            <strong>Livelli</strong>
            <small>Struttura pagina</small>
          </div>
          <button type="button" data-wf-layers-expand title="Comprimi livelli">&gt;</button>
        </div>
        <div class="wf-layers-list"></div>
      </div>
      <div class="wf-inspector" hidden>
        <div class="wf-inspector-head" data-wf-inspector-drag>
          <div class="wf-inspector-heading">
            <strong data-wf-inspector-title>Full edit</strong>
            <small data-wf-inspector-subtitle>Seleziona un elemento</small>
          </div>
          <button type="button" data-wf-inspector-close title="Chiudi">x</button>
        </div>
        <div class="wf-inspector-tabs" data-wf-inspector-tabs></div>
        <div class="wf-inspector-body"></div>
      </div>
      <input type="file" accept="image/*" data-wf-media-file hidden />
      <div class="wf-toolbar" hidden>
        <button class="wf-drag-handle" type="button" title="Trascina la toolbar">Sposta</button>
        <span class="wf-mode" data-wf-mode-label>Elemento selezionato</span>
        <button data-wf-action="open-inspector" type="button" title="Apri pannello Full edit">Full edit</button>
        <button data-wf-action="toggle-layers" type="button" title="Mostra o nascondi livelli">Livelli</button>
        <div class="wf-text-tools" aria-label="Strumenti testo rapidi">
          <button data-wf-quick="bold" type="button" title="Grassetto">B</button>
          <button data-wf-quick="italic" type="button" title="Corsivo">I</button>
          <button data-wf-quick="uppercase" type="button" title="Maiuscolo">MAIUSC</button>
          <button data-wf-quick="lowercase" type="button" title="Minuscolo">minus</button>
        <button data-wf-quick="align-left" type="button" title="Allinea a sinistra">←</button>
        <button data-wf-quick="align-center" type="button" title="Allinea al centro">↔</button>
        <button data-wf-quick="align-right" type="button" title="Allinea a destra">→</button>
        <button data-wf-quick="font-smaller" type="button" title="Riduci dimensione">A-</button>
        <button data-wf-quick="font-larger" type="button" title="Aumenta dimensione">A+</button>
        <label>Tipo rapido
          <select data-wf-inspector-quick>
            <option value="">Scegli</option>
            <option value="preset-title">Titolo</option>
            <option value="preset-subtitle">Sottotitolo</option>
            <option value="preset-body">Testo semplice</option>
            <option value="preset-quote">Citazione</option>
          </select>
        </label>
        <label>Font
          <select data-wf-text-style="fontFamily">
            <option value="">Auto</option>
            <option value="Inter, system-ui, sans-serif">Sans</option>
            <option value="Georgia, 'Times New Roman', serif">Serif</option>
            <option value="'Courier New', monospace">Mono</option>
          </select>
        </label>
        <label>Dimensione
          <select data-wf-text-style="fontSize">
            <option value="">Auto</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="20px">20</option>
            <option value="24px">24</option>
            <option value="32px">32</option>
            <option value="36px">36</option>
            <option value="44px">44</option>
          </select>
        </label>
        <label>Peso
          <select data-wf-text-style="fontWeight">
            <option value="">Auto</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
          </select>
        </label>
        <label>Stile
          <select data-wf-text-style="fontStyle">
            <option value="">Normale</option>
            <option value="italic">Corsivo</option>
          </select>
        </label>
        <label>Maiuscole
          <select data-wf-text-style="textTransform">
            <option value="">Auto</option>
            <option value="uppercase">Maiuscole</option>
            <option value="lowercase">Minuscole</option>
            <option value="none">Normale</option>
          </select>
        </label>
        <label>Allinea
          <select data-wf-text-style="textAlign">
            <option value="">Auto</option>
            <option value="left">Sinistra</option>
            <option value="center">Centro</option>
            <option value="right">Destra</option>
          </select>
        </label>
        <label>Interlinea
          <input data-wf-text-style="lineHeight" value="" placeholder="1.4" />
        </label>
        <label>Spaziatura
          <input data-wf-text-style="letterSpacing" value="" placeholder="0px" />
        </label>
        <label>Colore testo
          <input type="color" data-wf-custom-color value="#090C16" />
        </label>
          <div class="wf-color-row">
            <span>Colori testo</span>
            <span class="wf-swatches">
              <button type="button" data-wf-color="#090C16" title="Testo scuro" style="--swatch:#090C16;"></button>
              <button type="button" data-wf-color="#ffffff" title="Testo bianco" style="--swatch:#ffffff;"></button>
              <button type="button" data-wf-color="#72c3bf" title="Testo brand" style="--swatch:#72c3bf;"></button>
              <button type="button" data-wf-color="transparent" class="wf-transparent" title="Testo trasparente" data-wf-transparent style="--swatch:transparent;"></button>
            </span>
          </div>
        <button data-wf-color="transparent" type="button" class="wf-color-reset">Trasparente testo</button>
        <label>Colore sfondo
          <input type="color" data-wf-custom-bg value="#ffffff" />
        </label>
          <div class="wf-color-row">
            <span>Sfondo</span>
            <span class="wf-swatches">
              <button type="button" data-wf-bg="#ffffff" title="Sfondo bianco" style="--swatch:#ffffff;"></button>
              <button type="button" data-wf-bg="#f1f5f9" title="Sfondo grigio chiaro" style="--swatch:#f1f5f9;"></button>
              <button type="button" data-wf-bg="#090C16" title="Sfondo scuro" style="--swatch:#090C16;"></button>
              <button type="button" data-wf-bg="transparent" class="wf-transparent" title="Sfondo trasparente" data-wf-transparent style="--swatch:transparent;"></button>
            </span>
          </div>
        <button data-wf-bg="transparent" type="button" class="wf-color-reset">Sfondo trasparente</button>
          <button data-wf-toggle-advanced type="button">Avanzate</button>
          <div class="wf-advanced" hidden>
        <button data-wf-behavior="adaptiveText" type="button">Testo adattivo</button>
          </div>
            </div>
        </div>
        <div class="wf-group" aria-label="Sposta elemento">
          <button data-wf-action="select-parent" title="Seleziona contenitore padre">Padre</button>
          <button data-wf-action="move-up" title="Sposta su">↑</button>
          <button data-wf-action="move-down" title="Sposta giu">↓</button>
          <button data-wf-action="move-left" title="Sposta a sinistra">←</button>
          <button data-wf-action="move-right" title="Sposta a destra">→</button>
        </div>
      </div>
      <div class="wf-menu" hidden>
        <div class="wf-menu-head">
          <strong data-wf-context-title>Elemento</strong>
          <small data-wf-context-subtitle>Opzioni tasto destro</small>
        </div>
        <div class="wf-menu-insert-note" data-wf-insert-position-label>Inserisci sotto</div>
        <details class="wf-menu-section" open>
          <summary>Elementi base</summary>
          <div class="wf-menu-grid">
            <button data-wf-insert-block="text">Testo</button>
            <button data-wf-insert-block="title">Titolo</button>
            <button data-wf-insert-block="button">Pulsante</button>
            <button data-wf-insert-block="image">Immagine</button>
            <button data-wf-insert-block="list">Lista</button>
            <button data-wf-insert-block="separator">Separatore</button>
            <button data-wf-insert-block="container">Contenitore</button>
            <button data-wf-insert-block="form">Form</button>
          </div>
        </details>
        <details class="wf-menu-section">
          <summary>Blocchi pronti</summary>
          <div class="wf-menu-grid">
            <button data-wf-insert-block="two-columns">2 colonne</button>
            <button data-wf-insert-block="content-card">Card testo</button>
            <button data-wf-insert-block="treatment-card">Card trattamento</button>
            <button data-wf-insert-block="gallery-row">Gallery</button>
            <button data-wf-insert-block="testimonial-band">Recensione</button>
            <button data-wf-insert-block="cta-section">CTA</button>
            <button data-wf-insert-block="hero-section">Hero</button>
            <button data-wf-insert-block="feature-grid">Griglia info</button>
          </div>
        </details>
        <div class="wf-menu-divider"></div>
        <button data-wf-context="edit-text">Modifica testo</button>
        <button data-wf-context="replace-image">Sostituisci immagine</button>
        <button data-wf-context="add-text">Aggiungi testo</button>
        <button data-wf-context="add-title">Aggiungi titolo</button>
        <button data-wf-context="add-button">Aggiungi pulsante</button>
        <button data-wf-context="add-image">Aggiungi immagine</button>
        <button data-wf-context="add-separator">Aggiungi separatore</button>
        <button data-wf-context="add-box">Aggiungi contenitore</button>
        <button data-wf-context="add-section">Aggiungi sezione</button>
        <button data-wf-context="add-form">Aggiungi form base</button>
        <button data-wf-context="duplicate">Duplica elemento</button>
        <button data-wf-context="duplicate-parent">Duplica contenitore padre</button>
        <button data-wf-context="select-parent">Seleziona contenitore padre</button>
        <button data-wf-context="center">Centra</button>
        <button data-wf-context="text-on-dark">Testo chiaro</button>
        <button data-wf-context="text-on-light">Testo scuro</button>
        <button data-wf-context="reset">Reset stile</button>
        <button data-wf-context="delete">Elimina</button>
      </div>
    `;
    document.body.appendChild(overlayRoot);

    const style = document.createElement('style');
    style.textContent = `
      #websites-forge-live-overlay { position: fixed; inset: 0; z-index: 2147483640; pointer-events: none; font-family: Inter, system-ui, sans-serif; }
      #websites-forge-live-overlay .wf-hover-box { position: fixed; border: 1px solid rgba(114,195,191,.95); background: rgba(114,195,191,.06); box-shadow: 0 0 0 1px rgba(16,20,40,.08), 0 10px 28px rgba(16,20,40,.10); pointer-events: none; transition: left .08s ease, top .08s ease, width .08s ease, height .08s ease; }
      #websites-forge-live-overlay .wf-hover-box[hidden] { display: none; }
      #websites-forge-live-overlay .wf-hover-box span { position: absolute; left: -1px; top: -22px; max-width: 220px; padding: 4px 7px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: 5px 5px 5px 0; background: #101428; color: #bff1ee; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; box-shadow: 0 8px 22px rgba(16,20,40,.18); }
      #websites-forge-live-overlay .wf-spacing-box { position: fixed; pointer-events: none; box-sizing: border-box; transition: left .08s ease, top .08s ease, width .08s ease, height .08s ease, border-width .08s ease; }
      #websites-forge-live-overlay .wf-spacing-box[hidden] { display: none; }
      #websites-forge-live-overlay .wf-spacing-box span { position: absolute; left: 4px; top: 4px; padding: 2px 5px; border-radius: 3px; font-size: 9px; line-height: 1; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; opacity: .72; }
      #websites-forge-live-overlay .wf-margin-box { border-style: solid; border-color: rgba(59,130,246,.18); background: rgba(59,130,246,.035); }
      #websites-forge-live-overlay .wf-margin-box span { background: rgba(30,64,175,.62); color: #eff6ff; }
      #websites-forge-live-overlay .wf-padding-box { border-style: solid; border-color: rgba(245,158,11,.42); background: rgba(245,158,11,.12); }
      #websites-forge-live-overlay .wf-padding-box span { background: rgba(245,158,11,.72); color: #3a2300; }
      #websites-forge-live-overlay .wf-content-box { border: 1px solid rgba(114,195,191,.28); background: rgba(114,195,191,.035); opacity: .55; }
      #websites-forge-live-overlay .wf-content-box span { background: rgba(6,32,31,.92); color: #bff1ee; }
      #websites-forge-live-overlay .wf-box { position: fixed; border: 2px solid #2bbfba; box-shadow: 0 0 0 9999px rgba(16,20,40,.05); pointer-events: none; display: none; }
      #websites-forge-live-overlay .wf-context-box { position: fixed; border: 2px solid #f59e0b; background: rgba(245,158,11,.08); box-shadow: 0 0 0 3px rgba(245,158,11,.2); pointer-events: none; }
      #websites-forge-live-overlay .wf-context-box[hidden] { display: none; }
      #websites-forge-live-overlay .wf-element-handles { position: fixed; pointer-events: none; display: none; }
      #websites-forge-live-overlay .wf-element-handles:not([hidden]) { display: block; }
      #websites-forge-live-overlay .wf-element-move { position: absolute; left: 50%; top: -32px; transform: translateX(-50%); min-width: 56px; height: 24px; padding: 0 8px; pointer-events: auto; background: #72C3BF; color: #06201f; font-weight: 900; cursor: grab; }
      #websites-forge-live-overlay .wf-element-move:active { cursor: grabbing; }
      #websites-forge-live-overlay .wf-insert-plus { position: absolute; width: 26px; min-width: 26px; height: 26px; padding: 0; display: grid; place-items: center; pointer-events: auto; border-radius: 50%; background: #101428; border: 2px solid #72C3BF; color: #bff1ee; font-size: 16px; font-weight: 900; box-shadow: 0 8px 22px rgba(0,0,0,.24); }
      #websites-forge-live-overlay .wf-insert-plus:hover { background: #72C3BF; color: #06201f; }
      #websites-forge-live-overlay .wf-insert-before { left: 50%; top: -14px; transform: translate(-50%, -100%); }
      #websites-forge-live-overlay .wf-insert-left { left: -14px; top: 50%; transform: translate(-100%, -50%); }
      #websites-forge-live-overlay .wf-insert-right { right: -14px; top: 50%; transform: translate(100%, -50%); }
      #websites-forge-live-overlay .wf-insert-after { left: 50%; bottom: -14px; transform: translate(-50%, 100%); }
      #websites-forge-live-overlay .wf-resize-handle { position: absolute; width: 10px; min-width: 10px; height: 10px; padding: 0; border-radius: 50%; background: #ffffff; border: 2px solid #2bbfba; pointer-events: auto; }
      #websites-forge-live-overlay .wf-resize-n { left: 50%; top: -5px; transform: translateX(-50%); cursor: ns-resize; }
      #websites-forge-live-overlay .wf-resize-e { right: -5px; top: 50%; transform: translateY(-50%); cursor: ew-resize; }
      #websites-forge-live-overlay .wf-resize-s { left: 50%; bottom: -5px; transform: translateX(-50%); cursor: ns-resize; }
      #websites-forge-live-overlay .wf-resize-w { left: -5px; top: 50%; transform: translateY(-50%); cursor: ew-resize; }
      #websites-forge-live-overlay .wf-resize-ne { right: -5px; top: -5px; cursor: nesw-resize; }
      #websites-forge-live-overlay .wf-resize-se { right: -5px; bottom: -5px; cursor: nwse-resize; }
      #websites-forge-live-overlay .wf-resize-sw { left: -5px; bottom: -5px; cursor: nesw-resize; }
      #websites-forge-live-overlay .wf-resize-nw { left: -5px; top: -5px; cursor: nwse-resize; }
      #websites-forge-live-overlay .wf-multi-box { position: fixed; border: 1px solid rgba(114,195,191,.95); background: rgba(114,195,191,.08); pointer-events: none; }
      #websites-forge-live-overlay .wf-layers { position: fixed; right: 0; top: 0; width: min(360px, calc(100vw - 18px)); height: 100vh; overflow: hidden; display: grid; grid-template-rows: auto minmax(0, 1fr); padding: 0; background: #101428; color: white; border-left: 1px solid rgba(255,255,255,.16); box-shadow: -18px 0 45px rgba(0,0,0,.22); pointer-events: auto; border-radius: 0; }
      #websites-forge-live-overlay .wf-layers.wf-expanded { width: 46px; }
      #websites-forge-live-overlay .wf-layers[hidden], #websites-forge-live-overlay .wf-inspector[hidden] { display: none; }
      #websites-forge-live-overlay .wf-layers-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px; user-select: none; border-bottom: 1px solid rgba(255,255,255,.12); }
      #websites-forge-live-overlay .wf-layers-head strong { display: block; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #bff1ee; }
      #websites-forge-live-overlay .wf-layers-head small { display: block; color: #8fa3bf; font-size: 9px; margin-top: 1px; }
      #websites-forge-live-overlay .wf-layers.wf-expanded .wf-layers-head div, #websites-forge-live-overlay .wf-layers.wf-expanded .wf-layers-list { display: none; }
      #websites-forge-live-overlay .wf-layers-list { display: grid; align-content: start; gap: 2px; overflow: auto; padding: 8px; }
      #websites-forge-live-overlay .wf-layer-row { display: grid; grid-template-columns: minmax(0, 1fr) 34px 34px 30px 30px; gap: 3px; align-items: stretch; border-left: 1px solid rgba(255,255,255,.08); }
      #websites-forge-live-overlay .wf-layer-item { height: auto; min-height: 28px; width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 8px; text-align: left; padding: 4px 6px; border-radius: 5px; border: 1px solid transparent; background: rgba(255,255,255,.035); }
      #websites-forge-live-overlay .wf-layer-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      #websites-forge-live-overlay .wf-layer-item small { color: #8fa3bf; font-size: 9px; }
      #websites-forge-live-overlay .wf-layer-item.wf-active { background: #72C3BF; color: #06201f; }
      #websites-forge-live-overlay .wf-layer-item.wf-active small { color: #06201f; }
      #websites-forge-live-overlay .wf-layer-edit, #websites-forge-live-overlay .wf-layer-rename, #websites-forge-live-overlay .wf-layer-duplicate, #websites-forge-live-overlay .wf-layer-add { height: 28px; min-width: 0; padding: 0 3px; color: #dbe7f5; font-size: 9px; font-weight: 900; }
      #websites-forge-live-overlay .wf-inspector { position: fixed; right: 14px; top: 76px; width: min(420px, calc(100vw - 28px)); height: min(620px, calc(100vh - 92px)); min-width: 320px; min-height: 360px; overflow: auto; resize: both; padding: 0; background: #101428; color: white; border: 1px solid rgba(255,255,255,.16); box-shadow: 0 18px 45px rgba(0,0,0,.28); pointer-events: auto; border-radius: 8px; }
      #websites-forge-live-overlay .wf-inspector-head { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px; background: #101428; border-bottom: 1px solid rgba(255,255,255,.12); cursor: move; user-select: none; }
      #websites-forge-live-overlay .wf-inspector-heading { min-width: 0; display: grid; gap: 2px; }
      #websites-forge-live-overlay .wf-inspector-head strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #bff1ee; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
      #websites-forge-live-overlay .wf-inspector-head small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #9fb0c8; font-size: 10px; }
      #websites-forge-live-overlay .wf-inspector-tabs { position: sticky; top: 39px; z-index: 2; display: flex; gap: 4px; padding: 6px 8px; overflow-x: auto; background: #101428; border-bottom: 1px solid rgba(255,255,255,.12); }
      #websites-forge-live-overlay .wf-inspector-tabs button { flex: 0 0 auto; padding: 0 8px; font-weight: 800; color: #dbe7f5; }
      #websites-forge-live-overlay .wf-inspector-tabs button.wf-active { color: #06201f; }
      #websites-forge-live-overlay .wf-subtabs { display: flex; flex-wrap: wrap; gap: 4px; padding: 2px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.05); border-radius: 6px; }
      #websites-forge-live-overlay .wf-subtabs button { height: 24px; padding: 0 8px; font-weight: 800; }
      #websites-forge-live-overlay .wf-inspector-body { display: grid; gap: 8px; padding: 8px; }
      #websites-forge-live-overlay .wf-inspector-section { display: grid; gap: 6px; padding: 7px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.05); border-radius: 7px; }
      #websites-forge-live-overlay .wf-inspector-section h4 { margin: 0; color: white; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
      #websites-forge-live-overlay .wf-inspector-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5px; }
      #websites-forge-live-overlay .wf-inspector .wf-wide { grid-column: 1 / -1; }
      #websites-forge-live-overlay .wf-control-row { display: grid; grid-template-columns: minmax(0, 1fr) 54px; gap: 5px; align-items: center; }
      #websites-forge-live-overlay .wf-control-row input[type="range"] { width: 100%; height: 20px; padding: 0; }
      #websites-forge-live-overlay .wf-control-row input[type="text"] { width: 54px; min-width: 54px; text-align: center; }
      #websites-forge-live-overlay .wf-inspector textarea { width: 100%; min-height: 84px; resize: vertical; line-height: 1.35; padding: 6px; }
      #websites-forge-live-overlay .wf-inspector input, #websites-forge-live-overlay .wf-inspector select, #websites-forge-live-overlay .wf-inspector textarea { height: auto; min-height: 26px; width: 100%; border: 1px solid rgba(255,255,255,.18); border-radius: 5px; background: #fff; color: #111827; font-size: 11px; }
      #websites-forge-live-overlay .wf-inspector label { align-items: stretch; flex-direction: column; gap: 3px; text-transform: none; letter-spacing: 0; color: #dbe7f5; font-size: 10px; }
      #websites-forge-live-overlay .wf-inspector-note { color: #9fb0c8; font-size: 10px; line-height: 1.35; }
      #websites-forge-live-overlay .wf-image-preview { margin-bottom: 4px; border: 1px solid rgba(255,255,255,.12); border-radius: 6px; padding: 5px; background: rgba(255,255,255,.08); }
      #websites-forge-live-overlay .wf-image-preview img { width: 100%; max-height: 160px; object-fit: cover; border-radius: 4px; display: block; }
      #websites-forge-live-overlay .wf-children-list { display: grid; gap: 3px; }
      #websites-forge-live-overlay .wf-child-chip { display: flex; justify-content: space-between; gap: 6px; padding: 4px 6px; border-radius: 5px; background: rgba(255,255,255,.08); color: #dbe7f5; font-size: 10px; }
      #websites-forge-live-overlay .wf-toolbar { position: fixed; display: flex; flex-wrap: wrap; align-items: center; gap: 5px; width: min(980px, calc(100vw - 16px)); max-width: min(980px, calc(100vw - 16px)); padding: 6px; background: #101428; color: white; border: 1px solid rgba(255,255,255,.16); box-shadow: 0 18px 45px rgba(0,0,0,.25); pointer-events: auto; border-radius: 8px; box-sizing: border-box; overflow: auto; max-height: min(260px, calc(100vh - 120px)); }
      #websites-forge-live-overlay .wf-toolbar[hidden], #websites-forge-live-overlay .wf-menu[hidden] { display: none; }
      #websites-forge-live-overlay button { border: 1px solid rgba(255,255,255,.18); background: #171d31; color: white; height: 24px; min-width: 24px; border-radius: 5px; cursor: pointer; font-size: 10px; line-height: 1; }
      #websites-forge-live-overlay .wf-mode { height: 24px; max-width: 180px; display: inline-flex; align-items: center; padding: 0 7px; border-radius: 999px; background: rgba(114,195,191,.18); color: #bff1ee; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      #websites-forge-live-overlay .wf-group { display: inline-flex; align-items: center; gap: 2px; padding: 2px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.05); border-radius: 6px; min-width: 0; }
      #websites-forge-live-overlay .wf-group button { font-size: 10px; font-weight: 800; padding: 0 6px; }
      #websites-forge-live-overlay .wf-text-tools { display: none; }
      #websites-forge-live-overlay .wf-toolbar[data-wf-text-mode="true"] .wf-text-tools { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; width: 100%; max-width: calc(100vw - 14px); min-width: 0; }
      #websites-forge-live-overlay .wf-toolbar > * { min-width: 0; }
      #websites-forge-live-overlay .wf-text-tools > button,
      #websites-forge-live-overlay .wf-text-tools > label,
      #websites-forge-live-overlay .wf-text-tools > select,
      #websites-forge-live-overlay .wf-text-tools > input { min-width: 0; max-width: 95px; }
      #websites-forge-live-overlay .wf-text-tools .wf-color-reset { padding: 0 4px; font-size: 9px; }
      #websites-forge-live-overlay .wf-text-tools button { flex: 0 0 auto; min-width: 0; max-width: 95px; padding: 0 6px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #websites-forge-live-overlay .wf-text-tools label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; align-items: center; }
      #websites-forge-live-overlay .wf-text-tools label > select,
      #websites-forge-live-overlay .wf-text-tools label > input,
      #websites-forge-live-overlay .wf-advanced label > select,
      #websites-forge-live-overlay .wf-advanced label > input { width: 100%; max-width: 95px; }
      #websites-forge-live-overlay .wf-text-tools .wf-advanced { display: inline-flex; grid-column: 1 / -1; flex-wrap: wrap; gap: 5px; align-items: center; width: 100%; margin-top: 2px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,.12); }
      #websites-forge-live-overlay .wf-text-tools .wf-advanced[hidden] { display: none; }
      #websites-forge-live-overlay button.wf-active { background: #72C3BF; border-color: #72C3BF; color: #06201f; box-shadow: 0 0 0 1px rgba(114,195,191,.35); }
      #websites-forge-live-overlay .wf-swatches button { position: relative; width: 20px; min-width: 20px; padding: 0; background: var(--swatch); box-shadow: inset 0 0 0 1px rgba(0,0,0,.22); }
      #websites-forge-live-overlay .wf-swatches button:hover { transform: translateY(-1px); }
      #websites-forge-live-overlay .wf-color-picker { height: 24px; display: inline-flex; align-items: center; gap: 4px; padding: 0 4px; border-radius: 5px; background: #171d31; border: 1px solid rgba(255,255,255,.18); }
      #websites-forge-live-overlay .wf-color-picker span { font-size: 9px; font-weight: 800; color: white; }
      #websites-forge-live-overlay .wf-color-picker input { width: 22px; min-width: 22px; height: 18px; padding: 0; border: 0; background: transparent; cursor: pointer; }
      #websites-forge-live-overlay .wf-transparent { background: linear-gradient(135deg, #fff 0 45%, #ef4444 45% 55%, #fff 55% 100%) !important; }
      #websites-forge-live-overlay .wf-color-row { display: inline-flex; align-items: center; gap: 4px; min-width: 0; }
      #websites-forge-live-overlay .wf-color-row > span:first-child { font-size: 9px; font-weight: 800; color: #dbe7f5; opacity: .86; text-transform: uppercase; letter-spacing: .05em; }
      #websites-forge-live-overlay .wf-color-row .wf-swatches { display: inline-flex; gap: 4px; align-items: center; }
      #websites-forge-live-overlay .wf-advanced { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 5px; padding: 5px; border-top: 1px solid rgba(255,255,255,.12); width: 100%; }
      #websites-forge-live-overlay .wf-advanced[hidden] { display: none; }
      #websites-forge-live-overlay .wf-drag-handle { cursor: grab; background: #2bbfba; color: #06201f; font-weight: 800; padding: 0 8px; }
      #websites-forge-live-overlay .wf-drag-handle:active { cursor: grabbing; }
      #websites-forge-live-overlay label { display: inline-flex; align-items: center; gap: 3px; font-size: 9px; text-transform: uppercase; letter-spacing: .04em; }
      #websites-forge-live-overlay input, #websites-forge-live-overlay select { width: 62px; height: 24px; border: 1px solid rgba(255,255,255,.18); border-radius: 5px; background: #fff; color: #111827; padding: 0 5px; font-size: 11px; }
      #websites-forge-live-overlay .wf-menu { position: fixed; min-width: 260px; max-width: 340px; max-height: min(620px, calc(100vh - 20px)); overflow: auto; padding: 6px; background: white; border: 1px solid #d8dee9; box-shadow: 0 18px 45px rgba(0,0,0,.22); pointer-events: auto; border-radius: 7px; }
      #websites-forge-live-overlay .wf-menu-head { display: grid; gap: 2px; padding: 7px 8px 8px; margin-bottom: 4px; border-radius: 5px; background: #fff7ed; border: 1px solid #fed7aa; color: #7c2d12; }
      #websites-forge-live-overlay .wf-menu-head strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
      #websites-forge-live-overlay .wf-menu-head small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10px; color: #9a3412; }
      #websites-forge-live-overlay .wf-menu-insert-note { margin: 4px 0; padding: 6px 8px; border-radius: 5px; background: #ecfeff; color: #155e75; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
      #websites-forge-live-overlay .wf-menu-section { margin: 4px 0; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
      #websites-forge-live-overlay .wf-menu-section summary { padding: 7px 8px; cursor: pointer; color: #111827; background: #f8fafc; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .05em; }
      #websites-forge-live-overlay .wf-menu-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; padding: 5px; }
      #websites-forge-live-overlay .wf-menu-divider { height: 1px; margin: 6px 0; background: #e5e7eb; }
      #websites-forge-live-overlay .wf-menu button { display: block; width: 100%; text-align: left; background: white; color: #111827; border: 0; border-radius: 4px; padding: 8px 10px; height: auto; }
      #websites-forge-live-overlay .wf-menu-grid button { min-height: 30px; padding: 7px 8px; background: #ffffff; border: 1px solid #e5e7eb; font-weight: 800; }
      #websites-forge-live-overlay .wf-menu button:hover { background: #f4f7fb; color: #2bbfba; }
    `;
    document.head.appendChild(style);

    let selectedElement: HTMLElement | null = null;
    let selectedId = '';
    let manualToolbarPosition: { x: number; y: number } | null = null;
    let draggingToolbar: { dx: number; dy: number } | null = null;
    let manualLayersPosition: { x: number; y: number } | null = null;
    let draggingLayers: { dx: number; dy: number } | null = null;
    let manualInspectorPosition: { x: number; y: number } | null = null;
    let draggingInspector: { dx: number; dy: number } | null = null;
    let elementInteraction: {
      type: 'move' | 'resize';
      handle?: string;
      element: HTMLElement;
      startX: number;
      startY: number;
      startRect: DOMRect;
      parentRect: DOMRect;
      startTranslateX: number;
      startTranslateY: number;
      nextStyles: CSSProperties;
    } | null = null;
    let activeInspectorTab = 'general';
    let activeInspectorSubtab = 'text';
    let layerElements: HTMLElement[] = [];
    let selectedElements: HTMLElement[] = [];
    let layersUserOpen = false;
    let lastSelectionClick: { signature: string; index: number; at: number } | null = null;
    let hoveredElement: HTMLElement | null = null;
    let hoverFrame = 0;
    let hoverPoint: { x: number; y: number; target: HTMLElement } | null = null;
    let hoverPickFrame = 0;
    const hoverBox = overlayRoot.querySelector<HTMLElement>('.wf-hover-box')!;
    const hoverLabel = overlayRoot.querySelector<HTMLElement>('[data-wf-hover-label]')!;
    const marginBox = overlayRoot.querySelector<HTMLElement>('.wf-margin-box')!;
    const paddingBox = overlayRoot.querySelector<HTMLElement>('.wf-padding-box')!;
    const contentBox = overlayRoot.querySelector<HTMLElement>('.wf-content-box')!;
    const box = overlayRoot.querySelector<HTMLElement>('.wf-box')!;
    const contextBox = overlayRoot.querySelector<HTMLElement>('.wf-context-box')!;
    const layers = overlayRoot.querySelector<HTMLElement>('.wf-layers')!;
    const layersList = overlayRoot.querySelector<HTMLElement>('.wf-layers-list')!;
    const inspector = overlayRoot.querySelector<HTMLElement>('.wf-inspector')!;
    const inspectorTitle = overlayRoot.querySelector<HTMLElement>('[data-wf-inspector-title]')!;
    const inspectorSubtitle = overlayRoot.querySelector<HTMLElement>('[data-wf-inspector-subtitle]')!;
    const inspectorTabs = overlayRoot.querySelector<HTMLElement>('[data-wf-inspector-tabs]')!;
    const inspectorBody = overlayRoot.querySelector<HTMLElement>('.wf-inspector-body')!;
    const toolbar = overlayRoot.querySelector<HTMLElement>('.wf-toolbar')!;
    const menu = overlayRoot.querySelector<HTMLElement>('.wf-menu')!;
    const contextTitle = overlayRoot.querySelector<HTMLElement>('[data-wf-context-title]')!;
    const contextSubtitle = overlayRoot.querySelector<HTMLElement>('[data-wf-context-subtitle]')!;
    const elementHandles = overlayRoot.querySelector<HTMLElement>('.wf-element-handles')!;
    const insertPositionLabel = overlayRoot.querySelector<HTMLElement>('[data-wf-insert-position-label]')!;
    let contextElement: HTMLElement | null = null;

    const ensureAutoIds = assignAutoForgeIds;
    const elementId = (element: HTMLElement) => element.dataset.forgeId || element.dataset.forgeInsertId || element.dataset.forgeAutoId || autoForgePath(element);
    const liveEditEnabled = () => document.documentElement.hasAttribute('data-forge-live-edit');
    let quickToolbarGlobalEnabled = true;
    const quickToolbarOverrides = new Map<string, boolean>();

    const quickToolbarScopeFor = (element: HTMLElement) => (quickToolbarOverrides.has(elementId(element)) ? 'selected' : 'all') as 'selected' | 'all';
    const quickToolbarEnabledFor = (element: HTMLElement | null) => {
      if (!element) return false;
      const id = elementId(element);
      return quickToolbarOverrides.has(id) ? Boolean(quickToolbarOverrides.get(id)) : quickToolbarGlobalEnabled;
    };
    const setQuickToolbarState = (element: HTMLElement, scope: 'all' | 'selected', enabled: boolean) => {
      const id = elementId(element);
      if (scope === 'all') {
        quickToolbarGlobalEnabled = enabled;
        if (quickToolbarOverrides.has(id)) {
          quickToolbarOverrides.delete(id);
        }
      } else {
        quickToolbarOverrides.set(id, enabled);
      }
      toolbar.hidden = !quickToolbarEnabledFor(element);
    };

    const ensureElementId = (element: HTMLElement) => {
      if (!element.dataset.forgeId && !element.dataset.forgeInsertId && !element.dataset.forgeAutoId) {
        element.dataset.forgeAutoId = autoForgePath(element);
      }
      return elementId(element);
    };

    const selectedTargets = () => selectedElements.length > 0 ? selectedElements : (selectedElement ? [selectedElement] : []);

    const clearSelection = () => {
      document.querySelectorAll('[data-forge-selected], [data-forge-multi-selected]').forEach((item) => {
        item.removeAttribute('data-forge-selected');
        item.removeAttribute('data-forge-multi-selected');
      });
      overlayRoot.querySelectorAll('.wf-multi-box').forEach((item) => item.remove());
      selectedElements = [];
    };

    const paintMultiBoxes = () => {
      overlayRoot.querySelectorAll('.wf-multi-box').forEach((item) => item.remove());
      if (selectedElements.length <= 1) return;
      selectedElements.forEach((element) => {
        if (element === selectedElement) return;
        const rect = element.getBoundingClientRect();
        const ghost = document.createElement('div');
        ghost.className = 'wf-multi-box';
        ghost.style.left = `${rect.left}px`;
        ghost.style.top = `${rect.top}px`;
        ghost.style.width = `${rect.width}px`;
        ghost.style.height = `${rect.height}px`;
        overlayRoot.appendChild(ghost);
      });
    };

    const numericCssValue = (value: string) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const setFixedBox = (element: HTMLElement, rect: { left: number; top: number; width: number; height: number }) => {
      element.style.left = `${rect.left}px`;
      element.style.top = `${rect.top}px`;
      element.style.width = `${Math.max(0, rect.width)}px`;
      element.style.height = `${Math.max(0, rect.height)}px`;
    };

    const hideSpacingGuides = () => {
      marginBox.hidden = true;
      paddingBox.hidden = true;
      contentBox.hidden = true;
    };

    const paintSpacingGuides = (element: HTMLElement, rect: DOMRect) => {
      const style = window.getComputedStyle(element);
      const margin = {
        top: numericCssValue(style.marginTop),
        right: numericCssValue(style.marginRight),
        bottom: numericCssValue(style.marginBottom),
        left: numericCssValue(style.marginLeft),
      };
      const padding = {
        top: numericCssValue(style.paddingTop),
        right: numericCssValue(style.paddingRight),
        bottom: numericCssValue(style.paddingBottom),
        left: numericCssValue(style.paddingLeft),
      };
      const hasMargin = margin.top + margin.right + margin.bottom + margin.left > 0;
      const hasPadding = padding.top + padding.right + padding.bottom + padding.left > 0;
      marginBox.hidden = !hasMargin;
      paddingBox.hidden = !hasPadding;
      contentBox.hidden = false;
      if (hasMargin) {
        setFixedBox(marginBox, {
          left: rect.left - margin.left,
          top: rect.top - margin.top,
          width: rect.width + margin.left + margin.right,
          height: rect.height + margin.top + margin.bottom,
        });
        marginBox.style.borderTopWidth = `${margin.top}px`;
        marginBox.style.borderRightWidth = `${margin.right}px`;
        marginBox.style.borderBottomWidth = `${margin.bottom}px`;
        marginBox.style.borderLeftWidth = `${margin.left}px`;
      }
      if (hasPadding) {
        setFixedBox(paddingBox, rect);
        paddingBox.style.borderTopWidth = `${padding.top}px`;
        paddingBox.style.borderRightWidth = `${padding.right}px`;
        paddingBox.style.borderBottomWidth = `${padding.bottom}px`;
        paddingBox.style.borderLeftWidth = `${padding.left}px`;
      }
      setFixedBox(contentBox, {
        left: rect.left + padding.left,
        top: rect.top + padding.top,
        width: rect.width - padding.left - padding.right,
        height: rect.height - padding.top - padding.bottom,
      });
    };

    const paintHoverBox = () => {
      hoverFrame = 0;
      if (!hoveredElement || !hoveredElement.isConnected || hoveredElement === selectedElement || !liveEditEnabled()) {
        hoverBox.hidden = true;
        return;
      }
      const rect = hoveredElement.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) {
        hoverBox.hidden = true;
        return;
      }
      hoverBox.hidden = false;
      hoverBox.style.left = `${rect.left}px`;
      hoverBox.style.top = `${rect.top}px`;
      hoverBox.style.width = `${rect.width}px`;
      hoverBox.style.height = `${rect.height}px`;
      hoverLabel.style.top = rect.top < 28 ? '-1px' : '-22px';
      hoverLabel.style.borderRadius = rect.top < 28 ? '0 0 5px 0' : '5px 5px 5px 0';
      hoverLabel.textContent = layerDisplayName(hoveredElement);
    };

    const scheduleHoverBox = () => {
      if (hoverFrame) return;
      hoverFrame = window.requestAnimationFrame(paintHoverBox);
    };

    const clearHoverBox = () => {
      hoveredElement = null;
      hoverBox.hidden = true;
      if (hoverFrame) {
        window.cancelAnimationFrame(hoverFrame);
        hoverFrame = 0;
      }
    };

    const paintContextBox = () => {
      if (!contextElement || menu.hidden || !liveEditEnabled()) {
        contextBox.hidden = true;
        return;
      }
      const rect = contextElement.getBoundingClientRect();
      contextBox.hidden = false;
      contextBox.style.left = `${rect.left}px`;
      contextBox.style.top = `${rect.top}px`;
      contextBox.style.width = `${rect.width}px`;
      contextBox.style.height = `${rect.height}px`;
    };

    const insertPositionText = (mode: ForgeInsertMode) => ({
      above: 'Inserisci sopra',
      below: 'Inserisci sotto',
      inside: 'Inserisci dentro',
      left: 'Inserisci a sinistra',
      right: 'Inserisci a destra',
    }[mode]);

    const showInsertMenu = (element: HTMLElement, position: ForgeInsertPosition, mode: ForgeInsertMode, x: number, y: number) => {
      contextElement = element;
      menu.dataset.wfInsertPosition = position;
      menu.dataset.wfInsertMode = mode;
      contextTitle.textContent = layerDisplayName(element);
      contextSubtitle.textContent = `${element.tagName.toLowerCase()} - ${elementId(element)}`;
      insertPositionLabel.textContent = insertPositionText(mode);
      menu.hidden = false;
      paintContextBox();
      const menuWidth = menu.offsetWidth || 300;
      const menuHeight = menu.offsetHeight || 420;
      const padding = 10;
      const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
      menu.style.left = `${clamp(x, padding, window.innerWidth - menuWidth - padding)}px`;
      menu.style.top = `${clamp(y, padding, window.innerHeight - menuHeight - padding)}px`;
    };

    const hideContextMenu = () => {
      menu.hidden = true;
      menu.dataset.wfInsertPosition = 'afterend';
      menu.dataset.wfInsertMode = 'below';
      contextElement = null;
      contextBox.hidden = true;
    };

    const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char] ?? char));

    const editableElementFrom = (element: HTMLElement) => {
      const svgElement = element.closest<HTMLElement>('svg[data-forge-id], svg[data-forge-auto-id], svg[data-forge-insert-id]');
      if (svgElement && !svgElement.closest('#websites-forge-live-overlay')) return svgElement;
      const menuControl = element.closest<HTMLElement>('.nav-menu-item button, [data-forge-id^="header-menu-"], nav button');
      const menuLabel = menuControl?.querySelector<HTMLElement>('[data-forge-path^="navItems."][data-forge-path$=".label"]');
      if (menuLabel && !menuLabel.closest('#websites-forge-live-overlay')) return menuLabel;
      const stableElement = element.closest<HTMLElement>('[data-forge-id], [data-forge-insert-id], [data-forge-path], [data-forge-image-path]');
      if (stableElement && !stableElement.closest('#websites-forge-live-overlay')) return stableElement;
      const autoElement = element.closest<HTMLElement>('[data-forge-auto-id]');
      if (autoElement && !autoElement.closest('#websites-forge-live-overlay')) return autoElement;
      return null;
    };

    const isBuilderContainer = (element: HTMLElement) => {
      const tag = element.tagName.toLowerCase();
      if (['section', 'article', 'aside', 'main', 'header', 'footer', 'nav', 'form', 'ul', 'ol'].includes(tag)) return true;
      if (!['div', 'li'].includes(tag)) return false;
      const className = String(element.getAttribute('class') || '');
      const style = window.getComputedStyle(element);
      return element.childElementCount > 0 ||
        className.includes('grid') ||
        className.includes('flex') ||
        style.display.includes('grid') ||
        style.display.includes('flex') ||
        style.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
        style.backgroundImage !== 'none' ||
        Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom) + Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight) > 0;
    };

    const ensureCandidateId = (element: HTMLElement) => {
      if (!element.dataset.forgeId && !element.dataset.forgeInsertId && !element.dataset.forgeAutoId && !element.dataset.forgePath && !element.dataset.forgeImagePath) {
        element.dataset.forgeAutoId = autoForgePath(element);
      }
      return element;
    };

    const editableElementAtPoint = (x: number, y: number, source: HTMLElement) => {
      const candidates: HTMLElement[] = [];
      const add = (element: HTMLElement | null) => {
        if (!element || element === document.body || element === document.documentElement || element.closest('#websites-forge-live-overlay')) return;
        if (!candidates.includes(element)) candidates.push(ensureCandidateId(element));
      };

      document.elementsFromPoint(x, y).forEach((item) => {
        const element = item as HTMLElement;
        add(editableElementFrom(element));
        add(element);
        let parent = element.parentElement;
        while (parent && parent !== document.body && candidates.length < 18) {
          if (isBuilderContainer(parent)) add(parent);
          parent = parent.parentElement;
        }
      });
      add(editableElementFrom(source));

      const visibleCandidates = candidates.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 2 && rect.height > 2;
      });
      if (visibleCandidates.length === 0) return null;
      return visibleCandidates
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const area = rect.width * rect.height;
          const order = visibleCandidates.indexOf(element);
          const isStable = Boolean(element.dataset.forgeId || element.dataset.forgeInsertId || element.dataset.forgePath || element.dataset.forgeImagePath);
          const isContainer = isBuilderContainer(element);
          const isSource = element === source;
          const containsPoint = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
          const score = (containsPoint ? 100000 : 0) +
            (isStable ? 15000 : 0) +
            (isSource ? 9000 : 0) +
            (isContainer ? 6000 : 0) -
            (order * 250) -
            (Math.min(area, 900000) / 900);
          return { element, score };
        })
        .sort((a, b) => b.score - a.score)[0]?.element ?? null;
    };

    const humanLayerName = (element: HTMLElement) => {
      const id = element.dataset.forgeId || '';
      const tag = element.tagName.toLowerCase();
      const text = element.textContent?.trim().replace(/\s+/g, ' ') || '';
      const classes = String(element.getAttribute('class') || '');

      if (element.dataset.forgePath?.startsWith('navItems.') && element.dataset.forgePath.endsWith('.label')) return text ? `Voce menu: ${text.slice(0, 22)}` : 'Voce menu';
      if (id.startsWith('header-menu-')) return 'Voce menu';
      if (id === 'header-menu') return 'Menu sito';
      if (id === 'site-header') return 'Barra superiore';
      if (id === 'header-brand') return 'Logo / nome sito';
      if (id.includes('hero')) return 'Blocco hero';
      if (element.dataset.forgeImagePath || tag === 'img') return 'Immagine';
      if (element.dataset.forgePath) return text.length > 80 ? 'Testo modificabile' : 'Campo testo';
      if (/^h[1-6]$/.test(tag) || classes.includes('font-serif') || classes.includes('text-4xl') || classes.includes('text-5xl')) return 'Titolo';
      if (tag === 'p') return 'Paragrafo';
      if (tag === 'a' || tag === 'button') return text ? `Pulsante: ${text.slice(0, 22)}` : 'Pulsante';
      if (tag === 'section') return 'Sezione';
      if (tag === 'nav') return 'Navigazione';
      if (tag === 'ul' || tag === 'ol') return 'Lista';
      if (tag === 'li') return 'Voce lista';
      if (text && element.childElementCount === 0) return `Testo: ${text.slice(0, 28)}`;
      if (classes.includes('grid')) return 'Griglia';
      if (classes.includes('flex')) return 'Gruppo';
      return 'Contenitore';
    };

    const layerDetail = (element: HTMLElement) => {
      const stableId = element.dataset.forgeId || element.dataset.forgeInsertId || element.dataset.forgePath;
      if (stableId) return stableId.replace(/^header-menu-/, 'menu: ');
      return element.tagName.toLowerCase();
    };

    const layerDisplayName = (element: HTMLElement) => element.dataset.forgeLayerLabel || humanLayerName(element);

    const isImageElement = (element: HTMLElement) => {
      const tag = element.tagName.toLowerCase();
      return element instanceof HTMLImageElement ||
        tag === 'svg' ||
        Boolean(element.dataset.forgeImagePath) ||
        Boolean(element.querySelector('img, svg')) ||
        Boolean(content.customStyles?.[elementId(element)]?.backgroundImage) ||
        window.getComputedStyle(element).backgroundImage !== 'none';
    };

    const mediaDropTargetFrom = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      const pointImage = document.elementsFromPoint(event.clientX, event.clientY)
        .map((item) => item as HTMLElement)
        .find((item) => !item.closest('#websites-forge-live-overlay') && (item instanceof HTMLImageElement || Boolean(item.dataset.forgeImagePath) || Boolean(item.querySelector?.('img[data-forge-image-path], img'))));
      if (pointImage) {
        const nestedImage = pointImage instanceof HTMLImageElement ? pointImage : pointImage.querySelector<HTMLElement>('img[data-forge-image-path], img');
        if (nestedImage) return nestedImage;
        return pointImage;
      }

      const directImage = target.closest<HTMLElement>('img, [data-forge-image-path]');
      if (directImage && !directImage.closest('#websites-forge-live-overlay')) return directImage;
      const editable = editableElementFrom(target);
      if (editable && isImageElement(editable)) return editable;
      let imageContainer: HTMLElement | null = target;
      while (imageContainer && imageContainer !== document.body) {
        if (!imageContainer.closest('#websites-forge-live-overlay') && isImageElement(imageContainer)) return imageContainer;
        imageContainer = imageContainer.parentElement;
      }
      if (selectedElement && isImageElement(selectedElement)) return selectedElement;
      return null;
    };

    const markHistoryBeforeMediaChange = () => {
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_HISTORY_MARK', label: 'immagine' }, '*');
    };

    const isTextElement = (element: HTMLElement) => {
      const tag = element.tagName.toLowerCase();
      const hasOwnText = Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      return Boolean(element.dataset.forgePath || hasOwnText || element.childElementCount === 0 || /^h[1-6]$/.test(tag) || tag === 'p' || tag === 'a' || tag === 'button' || tag === 'span');
    };

    const readableElementSummary = (element: HTMLElement) => {
      if (isImageElement(element)) return 'Immagine, logo o icona';
      if (isTextElement(element)) return element.childElementCount > 0 ? 'Testo con elementi interni' : 'Testo semplice';
      return element.childElementCount > 0 ? `Contiene ${element.childElementCount} elementi` : 'Elemento vuoto';
    };

    const sanitizeInsertedClone = (element: HTMLElement) => {
      element.removeAttribute('data-forge-id');
      element.removeAttribute('data-forge-auto-id');
      element.removeAttribute('data-forge-selected');
      element.removeAttribute('data-forge-multi-selected');
      element.setAttribute('data-forge-insert-id', '');
      element.querySelectorAll<HTMLElement>('[data-forge-id], [data-forge-auto-id], [data-forge-selected], [data-forge-multi-selected]').forEach((child) => {
        child.removeAttribute('data-forge-id');
        child.removeAttribute('data-forge-auto-id');
        child.removeAttribute('data-forge-selected');
        child.removeAttribute('data-forge-multi-selected');
      });
      return element;
    };

    const duplicateHtmlFor = (element: HTMLElement) => {
      const clone = element.cloneNode(true) as HTMLElement;
      sanitizeInsertedClone(clone);
      return clone.outerHTML;
    };

    const htmlForNewElementLike = (element: HTMLElement) => {
      const tag = element.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) return `<${tag} data-forge-insert-id="" style="margin:18px 0 10px;font-size:32px;line-height:1.15;">Nuovo titolo</${tag}>`;
      if (tag === 'p' || tag === 'span') return '<p data-forge-insert-id="" style="margin:14px 0;font-size:16px;line-height:1.6;">Nuovo testo modificabile</p>';
      if (tag === 'img') return '<img data-forge-insert-id="" src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=900" alt="Nuova immagine" style="display:block;width:100%;max-width:720px;height:auto;object-fit:cover;" />';
      if (tag === 'a' || tag === 'button') return '<button data-forge-insert-id="" style="display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border:1px solid #090C16;background:#090C16;color:#ffffff;">Nuovo pulsante</button>';
      if (tag === 'hr') return '<hr data-forge-insert-id="" style="margin:24px 0;border:0;border-top:1px solid #d8dee9;" />';
      if (tag === 'section') return '<section data-forge-insert-id="" style="padding:64px 24px;background:#ffffff;"><div style="max-width:1120px;margin:0 auto;"><h2 style="font-size:36px;line-height:1.15;margin:0 0 12px;">Nuova sezione</h2><p style="font-size:16px;line-height:1.6;margin:0;">Testo della sezione.</p></div></section>';
      if (tag === 'form') return '<form data-forge-insert-id="" style="display:grid;gap:12px;padding:24px;border:1px solid #d8dee9;background:#ffffff;"><input placeholder="Nome" style="padding:12px;border:1px solid #d8dee9;" /><input placeholder="Email" style="padding:12px;border:1px solid #d8dee9;" /><textarea placeholder="Messaggio" style="padding:12px;border:1px solid #d8dee9;min-height:100px;"></textarea><button type="button" style="padding:12px 18px;background:#090C16;color:#fff;border:0;">Invia</button></form>';
      return '<div data-forge-insert-id="" style="padding:24px;border:1px solid #d8dee9;background:#ffffff;">Nuovo contenitore</div>';
    };

    const htmlForBlock = (blockId: string) => {
      const imageUrl = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=900';
      const blocks: Record<string, string> = {
        text: '<p data-forge-insert-id="" style="margin:14px 0;font-size:16px;line-height:1.6;">Nuovo testo modificabile</p>',
        title: '<h2 data-forge-insert-id="" style="margin:20px 0 10px;font-size:36px;line-height:1.15;">Nuovo titolo</h2>',
        button: '<button data-forge-insert-id="" style="display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border:1px solid #090C16;background:#090C16;color:#ffffff;">Nuovo pulsante</button>',
        image: `<img data-forge-insert-id="" src="${imageUrl}" alt="Nuova immagine" style="display:block;width:100%;max-width:720px;height:auto;object-fit:cover;" />`,
        list: '<ul data-forge-insert-id="" style="display:grid;gap:8px;margin:16px 0;padding-left:22px;font-size:16px;line-height:1.5;"><li>Primo punto modificabile</li><li>Secondo punto modificabile</li><li>Terzo punto modificabile</li></ul>',
        separator: '<hr data-forge-insert-id="" style="margin:24px 0;border:0;border-top:1px solid #d8dee9;" />',
        container: '<div data-forge-insert-id="" style="padding:24px;border:1px solid #d8dee9;background:#ffffff;"><h3 style="margin:0 0 8px;font-size:24px;line-height:1.2;">Nuovo contenitore</h3><p style="margin:0;font-size:16px;line-height:1.6;">Testo modificabile.</p></div>',
        form: '<form data-forge-insert-id="" style="display:grid;gap:12px;padding:24px;border:1px solid #d8dee9;background:#ffffff;"><input placeholder="Nome" style="padding:12px;border:1px solid #d8dee9;" /><input placeholder="Email" style="padding:12px;border:1px solid #d8dee9;" /><textarea placeholder="Messaggio" style="padding:12px;border:1px solid #d8dee9;min-height:100px;"></textarea><button type="button" style="padding:12px 18px;background:#090C16;color:#fff;border:0;">Invia</button></form>',
        'two-columns': '<div data-forge-insert-id="" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;padding:28px;border:1px solid #d8dee9;background:#ffffff;"><div><h3 style="margin:0 0 10px;font-size:26px;line-height:1.2;">Colonna sinistra</h3><p style="margin:0;font-size:15px;line-height:1.6;">Contenuto modificabile.</p></div><div><h3 style="margin:0 0 10px;font-size:26px;line-height:1.2;">Colonna destra</h3><p style="margin:0;font-size:15px;line-height:1.6;">Contenuto modificabile.</p></div></div>',
        'content-card': '<article data-forge-insert-id="" style="padding:26px;border:1px solid #d8dee9;background:#ffffff;display:grid;gap:10px;"><span style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#2bbfba;font-weight:800;">Etichetta</span><h3 style="margin:0;font-size:28px;line-height:1.15;">Card contenuto</h3><p style="margin:0;font-size:15px;line-height:1.6;">Descrizione breve modificabile per costruire rapidamente una sezione.</p></article>',
        'treatment-card': `<article data-forge-insert-id="" style="display:grid;grid-template-columns:160px 1fr;gap:18px;align-items:center;padding:18px;border:1px solid #d8dee9;background:#ffffff;"><img src="${imageUrl}" alt="Trattamento" style="width:100%;aspect-ratio:4/3;object-fit:cover;" /><div><h3 style="margin:0 0 8px;font-size:24px;line-height:1.2;">Nome trattamento</h3><p style="margin:0 0 12px;font-size:14px;line-height:1.55;">Sintesi del trattamento modificabile.</p><button type="button" style="padding:10px 14px;background:#090C16;color:#fff;border:0;">Scopri di piu</button></div></article>`,
        'gallery-row': `<div data-forge-insert-id="" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;"><img src="${imageUrl}" alt="Gallery 1" style="width:100%;aspect-ratio:1/1;object-fit:cover;" /><img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900" alt="Gallery 2" style="width:100%;aspect-ratio:1/1;object-fit:cover;" /><img src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=900" alt="Gallery 3" style="width:100%;aspect-ratio:1/1;object-fit:cover;" /></div>`,
        'testimonial-band': '<blockquote data-forge-insert-id="" style="padding:28px;border-left:4px solid #2bbfba;background:#f4f7fb;margin:0;"><p style="margin:0 0 12px;font-size:20px;line-height:1.45;font-family:Georgia,serif;">Testimonianza modificabile del paziente o testo evidenziato.</p><footer style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#6b7280;font-weight:800;">Nome paziente</footer></blockquote>',
        'cta-section': '<section data-forge-insert-id="" style="padding:48px 28px;background:#090C16;color:#ffffff;text-align:center;"><h2 style="margin:0 0 12px;font-size:38px;line-height:1.12;">Call to action</h2><p style="margin:0 auto 20px;max-width:680px;font-size:16px;line-height:1.6;">Testo persuasivo modificabile per guidare l’utente verso una prenotazione o contatto.</p><button type="button" style="padding:13px 20px;background:#72C3BF;color:#06201f;border:0;font-weight:800;">Prenota ora</button></section>',
        'hero-section': `<section data-forge-insert-id="" style="min-height:420px;display:grid;align-items:end;padding:48px 28px;background:linear-gradient(rgba(9,12,22,.35),rgba(9,12,22,.72)),url('${imageUrl}') center/cover;color:#ffffff;"><div style="max-width:760px;"><span style="font-size:12px;text-transform:uppercase;letter-spacing:.16em;font-weight:800;color:#72C3BF;">Nuova sezione</span><h1 style="margin:10px 0 12px;font-size:54px;line-height:1.02;">Titolo hero</h1><p style="margin:0;font-size:18px;line-height:1.55;">Testo introduttivo modificabile.</p></div></section>`,
        'feature-grid': '<div data-forge-insert-id="" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;"><div style="padding:20px;border:1px solid #d8dee9;background:#ffffff;"><h3 style="margin:0 0 8px;font-size:20px;">Punto uno</h3><p style="margin:0;font-size:14px;line-height:1.5;">Descrizione.</p></div><div style="padding:20px;border:1px solid #d8dee9;background:#ffffff;"><h3 style="margin:0 0 8px;font-size:20px;">Punto due</h3><p style="margin:0;font-size:14px;line-height:1.5;">Descrizione.</p></div><div style="padding:20px;border:1px solid #d8dee9;background:#ffffff;"><h3 style="margin:0 0 8px;font-size:20px;">Punto tre</h3><p style="margin:0;font-size:14px;line-height:1.5;">Descrizione.</p></div></div>',
      };
      return blocks[blockId] || blocks.container;
    };

    const fieldValue = (element: HTMLElement, property: keyof CSSProperties) => {
      const id = elementId(element);
      const saved = content.customStyles?.[id]?.[property];
      if (saved !== undefined) return String(saved);
      const inline = (element.style as unknown as Record<string, string>)[String(property)];
      if (inline) return inline;
      return '';
    };

    const computedOrSavedValue = (element: HTMLElement, property: keyof CSSProperties) => {
      const saved = fieldValue(element, property);
      if (saved) return saved;
      const computed = window.getComputedStyle(element) as unknown as Record<string, string>;
      return String(computed[String(property)] ?? '');
    };

    const isLayerVisible = (element: HTMLElement) => {
      if (element.closest('#websites-forge-live-overlay')) return false;
      const tag = element.tagName.toLowerCase();
      if (['script', 'style', 'link', 'meta', 'title', 'noscript'].includes(tag)) return false;
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 2 && rect.height > 2 && style.display !== 'none' && style.visibility !== 'hidden';
    };

    const isUsefulLayer = (element: HTMLElement) => {
      const tag = element.tagName.toLowerCase();
      if (['header', 'main', 'footer', 'nav', 'section', 'article', 'aside', 'form', 'ul', 'ol', 'li'].includes(tag)) return true;
      if (['img', 'picture', 'video', 'button', 'a', 'h1', 'h2', 'h3', 'h4', 'p'].includes(tag)) return true;
      if (element.dataset.forgeId || element.dataset.forgeInsertId || element.dataset.forgeAutoId || element.dataset.forgePath || element.dataset.forgeImagePath) return true;
      return isBuilderContainer(element);
    };

    const buildLayerStack = (_source: HTMLElement, current: HTMLElement | null) => {
      const rows: { element: HTMLElement; depth: number }[] = [];
      const visit = (element: HTMLElement, depth: number) => {
        if (rows.length > 220 || !isLayerVisible(element)) return;
        const include = isUsefulLayer(element);
        const nextDepth = include ? depth + 1 : depth;
        if (include) {
          ensureCandidateId(element);
          rows.push({ element, depth });
        }
        Array.from(element.children).forEach((child) => visit(child as HTMLElement, nextDepth));
      };

      const roots = Array.from(document.body.children)
        .filter((child) => child.id !== 'websites-forge-live-overlay')
        .filter((child) => !['SCRIPT', 'STYLE'].includes(child.tagName)) as HTMLElement[];
      roots.forEach((root) => visit(root, 0));
      layerElements = rows.map((row) => row.element);
      layersList.innerHTML = rows.map(({ element, depth }, index) => `
        <div class="wf-layer-row" style="padding-left:${Math.min(depth, 9) * 12}px">
          <button class="wf-layer-item ${element === current ? 'wf-active' : ''}" data-wf-layer="${index}" type="button">
            <span>${escapeHtml(layerDisplayName(element))}</span>
            <small>${escapeHtml(layerDetail(element))}</small>
          </button>
          <button class="wf-layer-edit" data-wf-layer-edit="${index}" type="button" title="Apri Full edit">Edit</button>
          <button class="wf-layer-duplicate" data-wf-layer-duplicate="${index}" type="button" title="Duplica livello">Dup</button>
          <button class="wf-layer-add" data-wf-layer-add-like="${index}" type="button" title="Aggiungi simile">+</button>
          <button class="wf-layer-rename" data-wf-layer-rename="${index}" type="button" title="Rinomina livello">Aa</button>
        </div>
      `).join('');
    };

    const selectExactElement = (forgeElement: HTMLElement, sourceElement = forgeElement, additive = false) => {
      if (forgeElement.closest('#websites-forge-live-overlay')) return null;

      if (!additive) clearSelection();
      if (additive && selectedElements.includes(forgeElement)) {
        forgeElement.removeAttribute('data-forge-selected');
        forgeElement.removeAttribute('data-forge-multi-selected');
        selectedElements = selectedElements.filter((item) => item !== forgeElement);
        selectedElement = selectedElements[selectedElements.length - 1] ?? null;
        selectedId = selectedElement ? elementId(selectedElement) : '';
        if (selectedElement) {
          selectedElement.removeAttribute('data-forge-multi-selected');
          selectedElement.setAttribute('data-forge-selected', 'true');
        }
        const modeLabel = toolbar.querySelector<HTMLElement>('[data-wf-mode-label]');
        if (modeLabel) modeLabel.textContent = selectedElements.length > 1 ? `${selectedElements.length} elementi` : (selectedElement ? humanLayerName(selectedElement) : 'Nessun elemento');
        if (selectedElement && layersUserOpen) buildLayerStack(sourceElement, selectedElement);
        paintMultiBoxes();
        positionOverlay();
        return forgeElement;
      }
      forgeElement.setAttribute('data-forge-selected', 'true');
      selectedElements.forEach((element) => {
        if (element !== forgeElement) {
          element.removeAttribute('data-forge-selected');
          element.setAttribute('data-forge-multi-selected', 'true');
        }
      });
      if (!selectedElements.includes(forgeElement)) selectedElements.push(forgeElement);
      selectedElement = forgeElement;
      selectedId = elementId(forgeElement);
      forgeElement.dataset.forgeAutoId = selectedId;
      const hasText = Boolean(forgeElement.textContent?.trim());
      toolbar.dataset.wfTextMode = String(hasText || forgeElement.isContentEditable);
      const modeLabel = toolbar.querySelector<HTMLElement>('[data-wf-mode-label]');
      if (modeLabel) modeLabel.textContent = selectedElements.length > 1 ? `${selectedElements.length} elementi` : humanLayerName(forgeElement);
      if (layersUserOpen) buildLayerStack(sourceElement, forgeElement);
      syncToolbar();
      positionOverlay();
      paintMultiBoxes();
      hideContextMenu();

      window.parent?.postMessage({
        type: 'WEBSITES_FORGE_ELEMENT_SELECTED',
        forgeId: selectedId,
        selectedIds: selectedElements.map(elementId),
        path: forgeElement.dataset.forgePath,
        imagePath: forgeElement.dataset.forgeImagePath,
        text: forgeElement.textContent?.trim() ?? '',
        tagName: forgeElement.tagName.toLowerCase(),
        styles: content.customStyles?.[selectedId] ?? {},
      }, '*');

      return forgeElement;
    };

    const publishStyle = (forgeId: string, styles: CSSProperties) => {
      setContent((current) => mergeContent({
        ...current,
        customStyles: {
          ...current.customStyles,
          [forgeId]: {
            ...(current.customStyles?.[forgeId] ?? {}),
            ...styles,
          },
        },
      }));
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_STYLE_PATCH', forgeId, styles }, '*');
    };

    const publishMedia = (forgeId: string, value: string) => {
      setContent((current) => mergeContent({
        ...current,
        customMedia: {
          ...current.customMedia,
          [forgeId]: value,
        },
      }));
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_MEDIA_PATCH', forgeId, value }, '*');
    };

    const clearMediaOverride = (element: HTMLElement) => {
      const imageTarget = mediaImageTarget(element);
      const forgeId = ensureElementId(imageTarget instanceof HTMLImageElement ? imageTarget : element);
      markHistoryBeforeMediaChange();
      if (isInlineVectorElement(element)) clearVectorMediaReplacement(element);
      restoreOriginalMedia(forgeId);
      setContent((current) => {
        const nextMedia = { ...(current.customMedia ?? {}) };
        delete nextMedia[forgeId];
        return mergeContent({
          ...current,
          customMedia: nextMedia,
        });
      });
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_MEDIA_PATCH', forgeId, remove: true }, '*');
    };

    const publishStyleBatch = (patches: ForgeStylePatch[]) => {
      if (patches.length === 0) return;
      setContent((current) => {
        const nextStyles = { ...(current.customStyles ?? {}) };
        patches.forEach(({ forgeId, styles }) => {
          nextStyles[forgeId] = {
            ...(nextStyles[forgeId] ?? {}),
            ...styles,
          };
        });
        return mergeContent({
          ...current,
          customStyles: nextStyles,
        });
      });
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_STYLE_BATCH_PATCH', patches }, '*');
    };

    const applyManagedStyles = (styles: CSSProperties) => {
      const targets = selectedTargets();
      if (targets.length === 0) return;
      const patches: ForgeStylePatch[] = targets.map((element) => {
        Object.assign(element.style, styles);
        element.dataset.forgeManagedStyle = 'true';
        return { forgeId: elementId(element), styles };
      });
      const firstPatch = patches[0];
      if (patches.length === 1 && firstPatch) publishStyle(firstPatch.forgeId, firstPatch.styles);
      else publishStyleBatch(patches);
      syncToolbar();
      positionOverlay();
      paintMultiBoxes();
    };

    type ManagedStylePatch = Record<string, string | number>;

    const applyLayoutPreset = (preset: string) => {
      const presets: Record<string, ManagedStylePatch> = {
        stack: {
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
          alignItems: 'stretch',
          justifyContent: '',
          flexDirection: '',
          flexWrap: '',
        },
        inline: {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          gridTemplateColumns: '',
        },
        'grid-2': {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '18px',
          alignItems: 'stretch',
          justifyContent: '',
          flexDirection: '',
          flexWrap: '',
        },
        'grid-3': {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '18px',
          alignItems: 'stretch',
          justifyContent: '',
          flexDirection: '',
          flexWrap: '',
        },
        'grid-4': {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '14px',
          alignItems: 'stretch',
          justifyContent: '',
          flexDirection: '',
          flexWrap: '',
        },
        centered: {
          display: 'grid',
          gridTemplateColumns: 'minmax(0, min(760px, 100%))',
          gap: '18px',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: '',
          flexWrap: '',
        },
      };
      const styles = presets[preset];
      if (!styles) return;
      applyManagedStyles(styles as CSSProperties);
      if (selectedElement && !inspector.hidden) renderInspector(selectedElement);
    };

    const publishText = (forgeId: string, text: string) => {
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_TEXT_PATCH', forgeId, text }, '*');
    };

    const publishHtml = (forgeId: string, html: string) => {
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_HTML_PATCH', forgeId, html }, '*');
    };

    const publishLayerLabel = (forgeId: string, label: string, element?: HTMLElement) => {
      const cleaned = label.trim();
      setContent((current) => {
        const nextLabels = { ...(current.customLabels ?? {}) };
        if (cleaned) nextLabels[forgeId] = cleaned;
        else delete nextLabels[forgeId];
        return mergeContent({
          ...current,
          customLabels: nextLabels,
        });
      });
      const targetElement = element ?? selectedElement;
      if (targetElement) {
        if (cleaned) targetElement.dataset.forgeLayerLabel = cleaned;
        else targetElement.removeAttribute('data-forge-layer-label');
      }
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_LABEL_PATCH', forgeId, label: cleaned }, '*');
    };

    const publishBehavior = (forgeId: string, behaviors: Partial<ForgeBehavior>) => {
      setContent((current) => mergeContent({
        ...current,
        customBehaviors: {
          ...current.customBehaviors,
          [forgeId]: {
            ...(current.customBehaviors?.[forgeId] ?? {}),
            ...behaviors,
          },
        },
      }));
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_BEHAVIOR_PATCH', forgeId, behaviors }, '*');
    };

    const publishBehaviorBatch = (patches: ForgeBehaviorPatch[]) => {
      if (patches.length === 0) return;
      setContent((current) => {
        const nextBehaviors = { ...(current.customBehaviors ?? {}) };
        patches.forEach(({ forgeId, behaviors }) => {
          nextBehaviors[forgeId] = {
            ...(nextBehaviors[forgeId] ?? {}),
            ...behaviors,
          };
        });
        return mergeContent({
          ...current,
          customBehaviors: nextBehaviors,
        });
      });
      window.parent?.postMessage({ type: 'WEBSITES_FORGE_BEHAVIOR_BATCH_PATCH', patches }, '*');
    };

    const normalizeColor = (() => {
      const colorCache = new Map<string, string>();
      const probe = document.createElement('span');
      probe.style.position = 'fixed';
      probe.style.left = '-9999px';
      probe.style.top = '-9999px';
      document.body.appendChild(probe);
      return (value: string) => {
        const trimmed = value.trim().toLowerCase();
        const cached = colorCache.get(trimmed);
        if (cached) return cached;

        if (!trimmed) {
          colorCache.set(trimmed, '#ffffff');
          return '#ffffff';
        }

        if (trimmed === 'transparent' || trimmed === 'rgba(0, 0, 0, 0)' || trimmed === 'rgba(0,0,0,0)') {
          return '#ffffff';
        }

        const hex = trimmed.match(/^#([0-9a-f]{3,8})$/i)?.[1];
        if (hex) {
          const full = hex.length === 3
            ? hex.split('').map((char) => char + char).join('')
            : hex.length === 4
              ? `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
              : hex.length === 8
                ? hex.slice(0, 6)
                : hex;
          const normalized = `#${full.slice(0, 6).padEnd(6, 'f')}`;
          colorCache.set(trimmed, normalized);
          return normalized;
        }

        const rgbMatch = trimmed.match(/^rgba?\(([^)]+)\)$/);
        if (rgbMatch) {
          const parts = rgbMatch[1].split(',').map((part) => part.trim()).map((part) => part.replace('%', ''));
          const [r, g, b] = parts.slice(0, 3).map((value) => {
            const num = Number(value);
            if (Number.isFinite(num)) return num;
            return 0;
          });
          if ([r, g, b].every((part) => Number.isFinite(part))) {
            const normalized = `#${[r, g, b].map((part) => Math.max(0, Math.min(255, Math.round(part))).toString(16).padStart(2, '0')).join('')}`;
            colorCache.set(trimmed, normalized);
            return normalized;
          }
        }

        probe.style.color = value;
        const color = window.getComputedStyle(probe).color;
        const match = color.match(/\d+(\.\d+)?/g);
        if (!match || match.length < 3) {
          colorCache.set(trimmed, '#ffffff');
          return '#ffffff';
        }
        const [r, g, b] = match.slice(0, 3).map((part) => Math.round(Number(part)));
        const normalized = `#${[r, g, b].map((part) => part.toString(16).padStart(2, '0')).join('')}`;
        colorCache.set(trimmed, normalized);
        return normalized;
      };
    })();
    

    const colorInputValue = (value: string, fallback: string) => {
      const normalized = value.trim().toLowerCase();
      if (!normalized || normalized === 'transparent' || normalized === 'rgba(0, 0, 0, 0)' || normalized === 'rgba(0,0,0,0)') return fallback;
      return normalizeColor(value);
    };

    const hasRichInlineFormatting = (element: HTMLElement) => Boolean(element.querySelector('[style], b, strong, i, em, u, span'));

    const selectionInsideSelected = () => {
      if (!selectedElement) return null;
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
      const range = selection.getRangeAt(0);
      if (!selectedElement.contains(range.commonAncestorContainer)) return null;
      return { selection, range };
    };

    const styleToInline = (styles: CSSProperties) => Object.entries(styles)
      .filter(([, value]) => value !== '')
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value}`)
      .join(';');

    const applyTextStyles = (styles: CSSProperties) => {
      const activeSelection = selectionInsideSelected();
      if (selectedElements.length > 1) {
        applyManagedStyles(styles);
        return;
      }
      if (!selectedElement || !activeSelection) {
        applyManagedStyles(styles);
        return;
      }

      const span = document.createElement('span');
      span.setAttribute('style', styleToInline(styles));
      const content = activeSelection.range.extractContents();
      span.appendChild(content);
      activeSelection.range.insertNode(span);
      activeSelection.selection.removeAllRanges();
      const nextRange = document.createRange();
      nextRange.selectNodeContents(span);
      activeSelection.selection.addRange(nextRange);
      publishHtml(selectedId, selectedElement.innerHTML);
      positionOverlay();
    };

    const disableAdaptiveText = () => {
      const targets = selectedTargets().filter((element) => element.dataset.forgeAdaptiveText === 'true');
      if (targets.length === 0) return;
      targets.forEach((element) => {
        element.removeAttribute('data-forge-adaptive-text');
        element.removeAttribute('data-forge-adaptive-source');
      });
      toolbar.querySelector<HTMLElement>('[data-wf-behavior="adaptiveText"]')?.classList.remove('wf-active');
      const patches: ForgeBehaviorPatch[] = targets.map((element) => ({ forgeId: elementId(element), behaviors: { adaptiveText: false } }));
      const firstPatch = patches[0];
      if (patches.length === 1 && firstPatch) publishBehavior(firstPatch.forgeId, firstPatch.behaviors);
      else publishBehaviorBatch(patches);
    };

    const setAdaptiveText = (enabled: boolean, source: AdaptiveSource = (selectedElement?.dataset.forgeAdaptiveSource as AdaptiveSource) || 'auto') => {
      const targets = selectedTargets();
      if (targets.length === 0) return;
      const stylePatches: ForgeStylePatch[] = [];
      const behaviorPatches: ForgeBehaviorPatch[] = targets.map((element) => {
        if (enabled) {
          element.dataset.forgeAdaptiveText = 'true';
          element.dataset.forgeAdaptiveSource = source;
        } else {
          element.removeAttribute('data-forge-adaptive-text');
          element.removeAttribute('data-forge-adaptive-source');
        }
        element.style.color = '';
        stylePatches.push({ forgeId: elementId(element), styles: { color: '' } as CSSProperties });
        return { forgeId: elementId(element), behaviors: { adaptiveText: enabled, adaptiveSource: source } };
      });
      toolbar.querySelector<HTMLElement>('[data-wf-behavior="adaptiveText"]')?.classList.toggle('wf-active', enabled);
      const firstStylePatch = stylePatches[0];
      if (stylePatches.length === 1 && firstStylePatch) publishStyle(firstStylePatch.forgeId, firstStylePatch.styles);
      else publishStyleBatch(stylePatches);
      const firstBehaviorPatch = behaviorPatches[0];
      if (behaviorPatches.length === 1 && firstBehaviorPatch) publishBehavior(firstBehaviorPatch.forgeId, firstBehaviorPatch.behaviors);
      else publishBehaviorBatch(behaviorPatches);
      positionOverlay();
      paintMultiBoxes();
    };

    const deleteSelectedElement = () => {
      const targets = selectedTargets();
      if (targets.length === 0) return;
      const hiddenPatches: ForgeStylePatch[] = [];
      const deletedInsertIds: string[] = [];
      targets.forEach((element) => {
        if (element.dataset.forgeInsertId) {
          deletedInsertIds.push(element.dataset.forgeInsertId);
          element.remove();
        } else {
          const styles = { display: 'none' } as CSSProperties;
          Object.assign(element.style, styles);
          element.dataset.forgeManagedStyle = 'true';
          hiddenPatches.push({ forgeId: elementId(element), styles });
        }
      });
      setContent((current) => {
        const nextStyles = { ...(current.customStyles ?? {}) };
        hiddenPatches.forEach(({ forgeId, styles }) => {
          nextStyles[forgeId] = {
            ...(nextStyles[forgeId] ?? {}),
            ...styles,
          };
        });
        return mergeContent({
          ...current,
          customStyles: nextStyles,
        });
      });
      window.parent?.postMessage({
        type: 'WEBSITES_FORGE_MULTI_DELETE_PATCH',
        stylePatches: hiddenPatches,
        insertIds: deletedInsertIds,
      }, '*');
      selectedElement = null;
      layerElements = [];
      selectedElements = [];
      box.style.display = 'none';
      hideSpacingGuides();
      overlayRoot.querySelectorAll('.wf-multi-box').forEach((item) => item.remove());
      toolbar.hidden = true;
      layers.hidden = true;
      inspector.hidden = true;
      hideContextMenu();
    };

    const layoutDisplayOf = (element: HTMLElement | null) => element ? window.getComputedStyle(element).display : '';

    const prepareInsertedHtml = (html: string, target: HTMLElement, position: ForgeInsertPosition, mode: ForgeInsertMode) => {
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      const element = template.content.firstElementChild as HTMLElement | null;
      if (!element) return { html };

      const layoutParent = position === 'beforeend' ? target : target.parentElement;
      const parentDisplay = layoutDisplayOf(layoutParent);
      let parentStylePatch: ForgeStylePatch | undefined;
      if (mode === 'above' || mode === 'below') {
        element.style.width = element.style.width || '100%';
        element.style.maxWidth = element.style.maxWidth || '100%';
        if (parentDisplay.includes('grid')) {
          element.style.gridColumn = '1 / -1';
        }
        if (parentDisplay.includes('flex')) {
          element.style.flex = element.style.flex || '0 0 100%';
          element.style.alignSelf = element.style.alignSelf || 'stretch';
          if (layoutParent && window.getComputedStyle(layoutParent).flexWrap === 'nowrap') {
            layoutParent.style.flexWrap = 'wrap';
            layoutParent.dataset.forgeManagedStyle = 'true';
            parentStylePatch = { forgeId: elementId(layoutParent), styles: { flexWrap: 'wrap' } as CSSProperties };
          }
        }
      }
      if (mode === 'left' || mode === 'right') {
        element.style.minWidth = element.style.minWidth || 'min(260px, 100%)';
      }
      return { html: element.outerHTML, parentStylePatch };
    };

    const insertCustomElement = (html: string, position: ForgeInsertPosition, mode: ForgeInsertMode = position === 'beforeend' ? 'inside' : position === 'beforebegin' ? 'above' : 'below') => {
      if (!selectedElement) return null;
      const id = `insert-${Date.now()}`;
      const preparedInsert = prepareInsertedHtml(html, selectedElement, position, mode);
      const taggedHtml = preparedInsert.html.replace('data-forge-insert-id=""', `data-forge-insert-id="${id}"`);
      selectedElement.insertAdjacentHTML(position, taggedHtml);
      const insertedElement = document.querySelector<HTMLElement>(`[data-forge-insert-id="${id}"]`);
      window.parent?.postMessage({
        type: 'WEBSITES_FORGE_INSERT_PATCH',
        insert: {
          id,
          targetId: selectedId,
          position,
          html: taggedHtml,
        },
        parentStylePatch: preparedInsert.parentStylePatch,
      }, '*');
      assignAutoForgeIds();
      if (insertedElement) {
        selectExactElement(insertedElement, insertedElement);
        if (!inspector.hidden) renderInspector(insertedElement);
      }
      positionOverlay();
      return insertedElement;
    };

    const canContainInsertedChildren = (element: HTMLElement) => ![
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
    ].includes(element.tagName.toLowerCase());

    const insertNearElement = (target: HTMLElement, html: string, position: ForgeInsertPosition = 'afterend', mode: ForgeInsertMode = position === 'beforeend' ? 'inside' : position === 'beforebegin' ? 'above' : 'below') => {
      const previousElement = selectedElement;
      const previousId = selectedId;
      const safePosition = position === 'beforeend' && !canContainInsertedChildren(target) ? 'afterend' : position;
      const safeMode = position === 'beforeend' && safePosition === 'afterend' ? 'below' : mode;
      if (!target.dataset.forgeId && !target.dataset.forgeAutoId && !target.dataset.forgeInsertId) {
        target.dataset.forgeAutoId = autoForgePath(target);
      }
      selectedElement = target;
      selectedId = elementId(target);
      const insertedElement = insertCustomElement(html, safePosition, safeMode);
      if (!insertedElement) {
        selectedElement = previousElement;
        selectedId = previousId;
      }
      if (!insertedElement && previousElement) {
        renderInspector(previousElement);
        positionOverlay();
      }
    };

    const duplicateElement = (element: HTMLElement) => {
      insertNearElement(element, duplicateHtmlFor(element), 'afterend');
    };

    const addElementLike = (element: HTMLElement) => {
      insertNearElement(element, htmlForNewElementLike(element), 'afterend');
    };

    const insertBlock = (blockId: string, position: ForgeInsertPosition = 'afterend', mode: ForgeInsertMode = position === 'beforeend' ? 'inside' : position === 'beforebegin' ? 'above' : 'below') => {
      const target = contextElement || selectedElement;
      if (!target) return;
      const safePosition = position === 'beforeend' && !canContainInsertedChildren(target) ? 'afterend' : position;
      const safeMode = position === 'beforeend' && safePosition === 'afterend' ? 'below' : mode;
      insertNearElement(target, htmlForBlock(blockId), safePosition, safeMode);
      hideContextMenu();
    };

    const syncToolbar = () => {
      if (!selectedElement) return;
      toolbar.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-wf-style], [data-wf-text-style]').forEach((control) => {
        const key = control.dataset.wfStyle as keyof CSSProperties;
        const keyFromTextStyle = control.dataset.wfTextStyle as keyof CSSProperties;
        control.value = fieldValue(selectedElement!, key || keyFromTextStyle);
      });
      const quickTextColor = toolbar.querySelector<HTMLInputElement>('[data-wf-custom-color]');
      if (quickTextColor) {
        const nextColor = colorInputValue(computedOrSavedValue(selectedElement, 'color'), '#090C16');
        if (quickTextColor.value !== nextColor) quickTextColor.value = nextColor;
      }
      const quickTextBg = toolbar.querySelector<HTMLInputElement>('[data-wf-custom-bg]');
      if (quickTextBg) {
        const nextBg = colorInputValue(computedOrSavedValue(selectedElement, 'backgroundColor'), '#ffffff');
        if (quickTextBg.value !== nextBg) quickTextBg.value = nextBg;
      }
      toolbar.querySelector<HTMLElement>('[data-wf-behavior="adaptiveText"]')
        ?.classList.toggle('wf-active', selectedElement.dataset.forgeAdaptiveText === 'true');
    };

    const renderSubtabs = (items: Array<{ id: string; label: string }>) => {
      if (items.length <= 1) return '';
      if (!items.some((item) => item.id === activeInspectorSubtab)) activeInspectorSubtab = items[0].id;
      return `
        <div class="wf-subtabs">
          ${items.map((item) => `<button type="button" class="${activeInspectorSubtab === item.id ? 'wf-active' : ''}" data-wf-inspector-subtab="${item.id}">${item.label}</button>`).join('')}
        </div>
      `;
    };

    const renderGeneralPanel = (element: HTMLElement) => {
      const quickEnabled = selectedElement ? quickToolbarEnabledFor(selectedElement) : false;
      const quickScope = selectedElement ? quickToolbarScopeFor(selectedElement) : 'all';

      return `
        <div class="wf-inspector-section">
          <h4>Quick overlay</h4>
          <div class="wf-inspector-grid">
            <label>Quick overlay attivo
              <select data-wf-quick-overlay-scope>
                <option value="all" ${quickScope === 'all' ? 'selected' : ''}>Tutti gli elementi</option>
                <option value="selected" ${quickScope === 'selected' ? 'selected' : ''}>Solo elemento selezionato</option>
              </select>
            </label>
            <label class="wf-wide">Mostra quick overlay
              <input data-wf-quick-overlay-visible type="checkbox" ${quickEnabled ? 'checked' : ''} />
            </label>
          </div>
          <div class="wf-inspector-note">Scegli se nascondere o mostrare la barra quick overlay (anche con estensione rapida). L’impostazione dipende dal campo scelta.</div>
        </div>
        <div class="wf-inspector-section">
          <h4>Struttura elemento</h4>
          <div class="wf-inspector-grid">
            <label>Nome elemento
              <input data-wf-layer-label value="${escapeHtml(element.dataset.forgeLayerLabel || '')}" placeholder="${escapeHtml(humanLayerName(element))}" />
            </label>
            <label class="wf-wide">Dettagli
              <div class="wf-inspector-note">
                ID: ${escapeHtml(elementId(element))}<br />
                Tag: ${escapeHtml(element.tagName.toLowerCase())}
              </div>
            </label>
          </div>
        </div>
      `;
    };

    const renderQuickTextPanel = (element: HTMLElement) => `
      <div class="wf-inspector-section">
        <h4>Quick text</h4>
        <div class="wf-inspector-grid">
          <button type="button" data-wf-quick="bold">Grassetto</button>
          <button type="button" data-wf-quick="italic">Corsivo</button>
          <button type="button" data-wf-quick="uppercase">MAIUSCOLO</button>
          <button type="button" data-wf-quick="lowercase">minuscolo</button>
          <button type="button" data-wf-quick="align-left">Allinea a sinistra</button>
          <button type="button" data-wf-quick="align-center">Allinea al centro</button>
          <button type="button" data-wf-quick="align-right">Allinea a destra</button>
          <button type="button" data-wf-quick="font-smaller">Dimensione -</button>
          <button type="button" data-wf-quick="font-larger">Dimensione +</button>
          <label>Tipo rapido
            <select data-wf-inspector-quick>
              <option value="">Scegli</option>
              <option value="preset-title">Titolo</option>
              <option value="preset-subtitle">Sottotitolo</option>
              <option value="preset-body">Testo semplice</option>
              <option value="preset-quote">Citazione</option>
            </select>
          </label>
          <label>Font
            <select data-wf-text-style="fontFamily">
              <option value="">Auto</option>
              <option value="Inter, system-ui, sans-serif" ${fieldValue(element, 'fontFamily') === 'Inter, system-ui, sans-serif' ? 'selected' : ''}>Sans</option>
              <option value="Georgia, 'Times New Roman', serif" ${fieldValue(element, 'fontFamily').includes('Georgia') ? 'selected' : ''}>Serif</option>
              <option value="'Courier New', monospace" ${fieldValue(element, 'fontFamily').includes('Courier') ? 'selected' : ''}>Mono</option>
            </select>
          </label>
          <label>Dimensione
            <input data-wf-text-style="fontSize" value="${escapeHtml(fieldValue(element, 'fontSize'))}" placeholder="${escapeHtml(computedOrSavedValue(element, 'fontSize'))}" />
          </label>
          <label>Peso
            <select data-wf-text-style="fontWeight">
              <option value="">Auto</option>
              <option value="300" ${fieldValue(element, 'fontWeight') === '300' ? 'selected' : ''}>300</option>
              <option value="400" ${fieldValue(element, 'fontWeight') === '400' ? 'selected' : ''}>400</option>
              <option value="500" ${fieldValue(element, 'fontWeight') === '500' ? 'selected' : ''}>500</option>
              <option value="600" ${fieldValue(element, 'fontWeight') === '600' ? 'selected' : ''}>600</option>
              <option value="700" ${fieldValue(element, 'fontWeight') === '700' ? 'selected' : ''}>700</option>
            </select>
          </label>
          <label>Stile
            <select data-wf-text-style="fontStyle">
              <option value="">Normale</option>
              <option value="italic" ${fieldValue(element, 'fontStyle') === 'italic' ? 'selected' : ''}>Corsivo</option>
            </select>
          </label>
          <label>Maiuscole
            <select data-wf-text-style="textTransform">
              <option value="">Auto</option>
              <option value="uppercase" ${fieldValue(element, 'textTransform') === 'uppercase' ? 'selected' : ''}>Maiuscolo</option>
              <option value="lowercase" ${fieldValue(element, 'textTransform') === 'lowercase' ? 'selected' : ''}>Minuscolo</option>
              <option value="none" ${fieldValue(element, 'textTransform') === 'none' ? 'selected' : ''}>Normale</option>
            </select>
          </label>
          <label>Allinea
            <select data-wf-text-style="textAlign">
              <option value="">Auto</option>
              <option value="left" ${fieldValue(element, 'textAlign') === 'left' ? 'selected' : ''}>Sinistra</option>
              <option value="center" ${fieldValue(element, 'textAlign') === 'center' ? 'selected' : ''}>Centro</option>
              <option value="right" ${fieldValue(element, 'textAlign') === 'right' ? 'selected' : ''}>Destra</option>
            </select>
          </label>
          <label>Interlinea <input data-wf-text-style="lineHeight" value="${escapeHtml(fieldValue(element, 'lineHeight'))}" placeholder="${escapeHtml(computedOrSavedValue(element, 'lineHeight'))}" /></label>
          <label>Spaziatura <input data-wf-text-style="letterSpacing" value="${escapeHtml(fieldValue(element, 'letterSpacing'))}" placeholder="0px" /></label>
          <label>Colore testo <input type="color" data-wf-custom-color value="${escapeHtml(colorInputValue(computedOrSavedValue(element, 'color'), '#090C16'))}" /></label>
          <label>Sfondo <input type="color" data-wf-custom-bg value="${escapeHtml(colorInputValue(computedOrSavedValue(element, 'backgroundColor'), '#ffffff'))}" /></label>
          <button type="button" data-wf-color="transparent">Trasparente testo</button>
          <button type="button" data-wf-bg="transparent">Sfondo trasparente</button>
          <button type="button" data-wf-color="#090C16">Reset colore</button>
          <button type="button" data-wf-bg="#ffffff">Reset sfondo</button>
          <button type="button" data-wf-behavior="adaptiveText">Testo adattivo</button>
        </div>
      </div>
    `;

    const renderTextPanel = (element: HTMLElement, id: string) => `
      <div class="wf-inspector-section">
        <h4>Contenuto testo</h4>
        <label class="wf-wide">Testo
          <textarea data-wf-inspector-text="${escapeHtml(id)}">${escapeHtml(element.textContent ?? '')}</textarea>
        </label>
      </div>
      ${renderQuickTextPanel(element)}
      <div class="wf-inspector-section">
        <h4>Tipografia</h4>
        <div class="wf-inspector-grid">
          <label>Font
            <select data-wf-inspector-style="fontFamily">
              <option value="">Auto</option>
              <option value="Inter, system-ui, sans-serif" ${fieldValue(element, 'fontFamily') === 'Inter, system-ui, sans-serif' ? 'selected' : ''}>Sans</option>
              <option value="Georgia, 'Times New Roman', serif" ${fieldValue(element, 'fontFamily').includes('Georgia') ? 'selected' : ''}>Serif</option>
              <option value="'Courier New', monospace" ${fieldValue(element, 'fontFamily').includes('Courier') ? 'selected' : ''}>Mono</option>
            </select>
          </label>
          <label>Dimensione <input data-wf-inspector-style="fontSize" value="${escapeHtml(fieldValue(element, 'fontSize'))}" placeholder="${escapeHtml(computedOrSavedValue(element, 'fontSize'))}" /></label>
          <label>Peso
            <select data-wf-inspector-style="fontWeight">
              <option value="">Auto</option>
              <option value="300" ${fieldValue(element, 'fontWeight') === '300' ? 'selected' : ''}>300</option>
              <option value="400" ${fieldValue(element, 'fontWeight') === '400' ? 'selected' : ''}>400</option>
              <option value="600" ${fieldValue(element, 'fontWeight') === '600' ? 'selected' : ''}>600</option>
              <option value="700" ${fieldValue(element, 'fontWeight') === '700' ? 'selected' : ''}>700</option>
            </select>
          </label>
          <label>Stile
            <select data-wf-inspector-style="fontStyle">
              <option value="">Normale</option>
              <option value="italic" ${fieldValue(element, 'fontStyle') === 'italic' ? 'selected' : ''}>Corsivo</option>
            </select>
          </label>
          <label>Maiuscole
            <select data-wf-inspector-style="textTransform">
              <option value="">Auto</option>
              <option value="uppercase" ${fieldValue(element, 'textTransform') === 'uppercase' ? 'selected' : ''}>Maiuscolo</option>
              <option value="lowercase" ${fieldValue(element, 'textTransform') === 'lowercase' ? 'selected' : ''}>Minuscolo</option>
              <option value="none" ${fieldValue(element, 'textTransform') === 'none' ? 'selected' : ''}>Normale</option>
            </select>
          </label>
          <label>Allinea
            <select data-wf-inspector-style="textAlign">
              <option value="">Auto</option>
              <option value="left" ${fieldValue(element, 'textAlign') === 'left' ? 'selected' : ''}>Sinistra</option>
              <option value="center" ${fieldValue(element, 'textAlign') === 'center' ? 'selected' : ''}>Centro</option>
              <option value="right" ${fieldValue(element, 'textAlign') === 'right' ? 'selected' : ''}>Destra</option>
            </select>
          </label>
          <label>Interlinea <input data-wf-inspector-style="lineHeight" value="${escapeHtml(fieldValue(element, 'lineHeight'))}" placeholder="${escapeHtml(computedOrSavedValue(element, 'lineHeight'))}" /></label>
          <label>Spaziatura <input data-wf-inspector-style="letterSpacing" value="${escapeHtml(fieldValue(element, 'letterSpacing'))}" placeholder="0px" /></label>
        </div>
      </div>
      ${renderColorPanel(element)}
    `;

    const renderImagePanel = (element: HTMLElement) => {
      const nestedImage = element instanceof HTMLImageElement ? element : element.querySelector<HTMLImageElement>('img');
      const nestedSvg = element.tagName.toLowerCase() === 'svg' ? element : element.querySelector<SVGElement>('svg');
      const imageValue = nestedImage ? nestedImage.getAttribute('src') ?? '' : String(content.customStyles?.[elementId(element)]?.backgroundImage || '').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
      const isVector = Boolean(nestedSvg);
      const previewValue = nestedImage ? nestedImage.getAttribute('src') ?? '' : imageValue;
      return `
        <div class="wf-inspector-section">
          <h4>Media / logo / icona</h4>
          <button type="button" class="wf-wide" data-wf-media-action="choose-file">Scegli immagine dal PC</button>
          ${previewValue ? `<div class="wf-image-preview"><img alt="Anteprima elemento" src="${escapeHtml(previewValue)}" /></div>` : ''}
          <label class="wf-wide">URL immagine o sostituzione visuale
            <input data-wf-inspector-image value="${escapeHtml(imageValue)}" placeholder="https://..." />
          </label>
          <label class="wf-wide">Alt / descrizione
            <input data-wf-inspector-attr="alt" value="${escapeHtml(nestedImage ? nestedImage.alt : '')}" />
          </label>
          <div class="wf-inspector-grid">
            <label>Larghezza <input data-wf-inspector-style="width" value="${escapeHtml(fieldValue(element, 'width'))}" placeholder="auto" /></label>
            <label>Altezza <input data-wf-inspector-style="height" value="${escapeHtml(fieldValue(element, 'height'))}" placeholder="auto" /></label>
            <label class="wf-wide">Larghezza guidata
              <span class="wf-control-row">
                <input type="range" min="5" max="100" step="1" data-wf-range-style="width" data-wf-range-suffix="%" value="${Number.parseFloat(fieldValue(element, 'width')) || 100}" />
                <input type="text" data-wf-range-value readonly value="${Number.parseFloat(fieldValue(element, 'width')) || 100}%" />
              </span>
            </label>
            <label class="wf-wide">Altezza minima guidata
              <span class="wf-control-row">
                <input type="range" min="16" max="900" step="4" data-wf-range-style="minHeight" data-wf-range-suffix="px" value="${Number.parseFloat(fieldValue(element, 'minHeight')) || Math.round(element.getBoundingClientRect().height || 80)}" />
                <input type="text" data-wf-range-value readonly value="${Number.parseFloat(fieldValue(element, 'minHeight')) || Math.round(element.getBoundingClientRect().height || 80)}px" />
              </span>
            </label>
            <label>Fit immagine
              <select data-wf-inspector-style="${nestedImage ? 'objectFit' : 'backgroundSize'}">
                <option value="">Auto</option>
                <option value="${nestedImage ? 'contain' : 'contain'}" ${(nestedImage ? fieldValue(element, 'objectFit') : fieldValue(element, 'backgroundSize')) === 'contain' ? 'selected' : ''}>Contieni</option>
                <option value="${nestedImage ? 'cover' : 'cover'}" ${(nestedImage ? fieldValue(element, 'objectFit') : fieldValue(element, 'backgroundSize')) === 'cover' ? 'selected' : ''}>Riempi</option>
                <option value="${nestedImage ? 'fill' : '100% 100%'}" ${(nestedImage ? fieldValue(element, 'objectFit') : fieldValue(element, 'backgroundSize')) === (nestedImage ? 'fill' : '100% 100%') ? 'selected' : ''}>Stira</option>
              </select>
            </label>
            <label>Posizione
              <select data-wf-inspector-style="${nestedImage ? 'objectPosition' : 'backgroundPosition'}">
                <option value="">Auto</option>
                <option value="center" ${(nestedImage ? fieldValue(element, 'objectPosition') : fieldValue(element, 'backgroundPosition')) === 'center' ? 'selected' : ''}>Centro</option>
                <option value="top" ${(nestedImage ? fieldValue(element, 'objectPosition') : fieldValue(element, 'backgroundPosition')) === 'top' ? 'selected' : ''}>Alto</option>
                <option value="bottom" ${(nestedImage ? fieldValue(element, 'objectPosition') : fieldValue(element, 'backgroundPosition')) === 'bottom' ? 'selected' : ''}>Basso</option>
                <option value="left" ${(nestedImage ? fieldValue(element, 'objectPosition') : fieldValue(element, 'backgroundPosition')) === 'left' ? 'selected' : ''}>Sinistra</option>
                <option value="right" ${(nestedImage ? fieldValue(element, 'objectPosition') : fieldValue(element, 'backgroundPosition')) === 'right' ? 'selected' : ''}>Destra</option>
              </select>
            </label>
            <label>Rapporto <input data-wf-inspector-style="aspectRatio" value="${escapeHtml(fieldValue(element, 'aspectRatio'))}" placeholder="es. 16 / 9" /></label>
            <label>Opacita <input data-wf-inspector-style="opacity" value="${escapeHtml(fieldValue(element, 'opacity'))}" placeholder="1" /></label>
            <label class="wf-wide">Opacita guidata
              <span class="wf-control-row">
                <input type="range" min="0" max="1" step="0.05" data-wf-range-style="opacity" value="${Number.parseFloat(fieldValue(element, 'opacity')) || 1}" />
                <input type="text" data-wf-range-value readonly value="${Number.parseFloat(fieldValue(element, 'opacity')) || 1}" />
              </span>
            </label>
            <label class="wf-wide">Raggio guidato
              <span class="wf-control-row">
                <input type="range" min="0" max="120" step="1" data-wf-range-style="borderRadius" data-wf-range-suffix="px" value="${Number.parseFloat(fieldValue(element, 'borderRadius')) || 0}" />
                <input type="text" data-wf-range-value readonly value="${Number.parseFloat(fieldValue(element, 'borderRadius')) || 0}px" />
              </span>
            </label>
            <label>Colore logo/icona <input type="color" data-wf-inspector-icon-color value="${escapeHtml(colorInputValue(computedOrSavedValue(element, 'color'), '#090C16'))}" /></label>
            <button type="button" data-wf-media-action="clear-image">Rimuovi sostituzione</button>
          </div>
          ${isVector ? '<div class="wf-inspector-note">Logo/icona vettoriale: il colore usa il colore testo, perche il simbolo segue currentColor.</div>' : ''}
          ${element.dataset.forgeImagePath ? '' : '<div class="wf-inspector-note">Se non e un campo immagine del template, la sostituzione viene salvata come stile visuale dell elemento selezionato.</div>'}
        </div>
      `;
    };

    const renderColorPanel = (element: HTMLElement) => `
      <div class="wf-inspector-section">
        <h4>Colori</h4>
        <div class="wf-inspector-grid">
          <label>Testo <input type="color" data-wf-inspector-color value="${escapeHtml(colorInputValue(computedOrSavedValue(element, 'color'), '#090C16'))}" /></label>
          <label>Sfondo <input type="color" data-wf-inspector-bg value="${escapeHtml(colorInputValue(computedOrSavedValue(element, 'backgroundColor'), '#ffffff'))}" /></label>
          <button type="button" data-wf-color="transparent">Colore testo trasparente</button>
          <button type="button" data-wf-bg="transparent">Sfondo trasparente</button>
          <label>Auto chiaro/scuro
            <select data-wf-inspector-adaptive>
              <option value="false" ${element.dataset.forgeAdaptiveText === 'true' ? '' : 'selected'}>Spento</option>
              <option value="true" ${element.dataset.forgeAdaptiveText === 'true' ? 'selected' : ''}>Attivo</option>
            </select>
          </label>
          <label>Sorgente contrasto
            <select data-wf-inspector-adaptive-source>
              <option value="auto" ${(element.dataset.forgeAdaptiveSource || 'auto') === 'auto' ? 'selected' : ''}>Auto intelligente</option>
              <option value="page" ${element.dataset.forgeAdaptiveSource === 'page' ? 'selected' : ''}>Pagina sotto</option>
              <option value="section" ${element.dataset.forgeAdaptiveSource === 'section' ? 'selected' : ''}>Sezione</option>
              <option value="element" ${element.dataset.forgeAdaptiveSource === 'element' ? 'selected' : ''}>Contenitore</option>
              <option value="header" ${element.dataset.forgeAdaptiveSource === 'header' ? 'selected' : ''}>Header chiaro/scuro</option>
            </select>
          </label>
        </div>
      </div>
    `;

    const renderLayoutPanel = (element: HTMLElement) => `
      <div class="wf-inspector-section">
        <h4>Tipologia container</h4>
        <div class="wf-inspector-grid">
          <button type="button" data-wf-layout-preset="stack">Stack verticale</button>
          <button type="button" data-wf-layout-preset="inline">Riga flessibile</button>
          <button type="button" data-wf-layout-preset="grid-2">Griglia 2 colonne</button>
          <button type="button" data-wf-layout-preset="grid-3">Griglia 3 colonne</button>
          <button type="button" data-wf-layout-preset="grid-4">Griglia 4 colonne</button>
          <button type="button" data-wf-layout-preset="centered">Centrato</button>
        </div>
        <div class="wf-inspector-note">Questi preset cambiano come il container dispone gli elementi interni aggiunti con il builder.</div>
      </div>
      <div class="wf-inspector-section">
        <h4>Dimensioni e spazi</h4>
        <div class="wf-inspector-grid">
          <label>Margine <input data-wf-inspector-style="margin" value="${escapeHtml(fieldValue(element, 'margin'))}" placeholder="0px" /></label>
          <label>Padding <input data-wf-inspector-style="padding" value="${escapeHtml(fieldValue(element, 'padding'))}" placeholder="0px" /></label>
          <label>Larghezza <input data-wf-inspector-style="width" value="${escapeHtml(fieldValue(element, 'width'))}" placeholder="auto" /></label>
          <label>Altezza <input data-wf-inspector-style="height" value="${escapeHtml(fieldValue(element, 'height'))}" placeholder="auto" /></label>
          <label>Raggio <input data-wf-inspector-style="borderRadius" value="${escapeHtml(fieldValue(element, 'borderRadius'))}" placeholder="0px" /></label>
          <label>Gap <input data-wf-inspector-style="gap" value="${escapeHtml(fieldValue(element, 'gap'))}" placeholder="auto" /></label>
          <label class="wf-wide">Larghezza %
            <span class="wf-control-row">
              <input type="range" min="5" max="100" step="1" data-wf-range-style="width" data-wf-range-suffix="%" value="${Number.parseFloat(fieldValue(element, 'width')) || 100}" />
              <input type="text" data-wf-range-value readonly value="${Number.parseFloat(fieldValue(element, 'width')) || 100}%" />
            </span>
          </label>
          <label class="wf-wide">Altezza minima
            <span class="wf-control-row">
              <input type="range" min="0" max="1000" step="4" data-wf-range-style="minHeight" data-wf-range-suffix="px" value="${Number.parseFloat(fieldValue(element, 'minHeight')) || 0}" />
              <input type="text" data-wf-range-value readonly value="${Number.parseFloat(fieldValue(element, 'minHeight')) || 0}px" />
            </span>
          </label>
          <label class="wf-wide">Padding
            <span class="wf-control-row">
              <input type="range" min="0" max="160" step="2" data-wf-range-style="padding" data-wf-range-suffix="px" value="${Number.parseFloat(fieldValue(element, 'padding')) || 0}" />
              <input type="text" data-wf-range-value readonly value="${Number.parseFloat(fieldValue(element, 'padding')) || 0}px" />
            </span>
          </label>
          <label class="wf-wide">Margine
            <span class="wf-control-row">
              <input type="range" min="0" max="160" step="2" data-wf-range-style="margin" data-wf-range-suffix="px" value="${Number.parseFloat(fieldValue(element, 'margin')) || 0}" />
              <input type="text" data-wf-range-value readonly value="${Number.parseFloat(fieldValue(element, 'margin')) || 0}px" />
            </span>
          </label>
          <label class="wf-wide">Raggio
            <span class="wf-control-row">
              <input type="range" min="0" max="120" step="1" data-wf-range-style="borderRadius" data-wf-range-suffix="px" value="${Number.parseFloat(fieldValue(element, 'borderRadius')) || 0}" />
              <input type="text" data-wf-range-value readonly value="${Number.parseFloat(fieldValue(element, 'borderRadius')) || 0}px" />
            </span>
          </label>
        </div>
      </div>
      <div class="wf-inspector-section">
        <h4>Posizione</h4>
        <div class="wf-inspector-grid">
          <button type="button" data-wf-action="move-up">Su</button>
          <button type="button" data-wf-action="move-down">Giu</button>
          <button type="button" data-wf-action="move-left">Sinistra</button>
          <button type="button" data-wf-action="move-right">Destra</button>
        </div>
      </div>
    `;

    const applyMediaUrl = (element: HTMLElement, value: string) => {
      ensureElementId(element);
      const imageTarget = mediaImageTarget(element);
      if (imageTarget) ensureElementId(imageTarget);
      const isVector = element.tagName.toLowerCase() === 'svg' || Boolean(element.querySelector('svg'));
      const imagePath = element.dataset.forgeImagePath || imageTarget?.dataset.forgeImagePath;
      if (imageTarget && imagePath) {
        markHistoryBeforeMediaChange();
        if (value) imageTarget.src = value;
        else imageTarget.removeAttribute('src');
        window.parent?.postMessage({ type: 'WEBSITES_FORGE_CONTENT_PATCH', path: imagePath, value }, '*');
        return;
      }
      if (imageTarget) {
        const forgeId = imageTarget === element ? ensureElementId(imageTarget) : ensureElementId(element);
        markHistoryBeforeMediaChange();
        rememberOriginalMedia(forgeId, element, imageTarget);
        element.dataset.forgeOriginalSrc = runtimeMediaOriginals.get(forgeId) ?? imageTarget.getAttribute('src') ?? '';
        element.dataset.forgeManagedMedia = 'true';
        element.dataset.forgeManagedMediaId = forgeId;
        if (value) imageTarget.src = value;
        else imageTarget.removeAttribute('src');
        publishMedia(forgeId, value);
        return;
      }
      if (isVector) {
        const forgeId = ensureElementId(element);
        markHistoryBeforeMediaChange();
        rememberOriginalMedia(forgeId, element);
        const replacement = value ? ensureVectorMediaReplacement(forgeId, element) : null;
        if (replacement) replacement.src = value;
        else clearVectorMediaReplacement(element);
        element.dataset.forgeManagedMedia = 'true';
        element.dataset.forgeManagedMediaId = forgeId;
        publishMedia(forgeId, value);
        return;
      }
      const styles = {
        backgroundImage: value ? `url("${value}")` : '',
        backgroundSize: value ? 'contain' : '',
        backgroundPosition: value ? 'center' : '',
        backgroundRepeat: value ? 'no-repeat' : '',
        color: value && isVector ? 'transparent' : undefined,
      } as CSSProperties;
      if (!styles.color) delete (styles as Record<string, unknown>).color;
      markHistoryBeforeMediaChange();
      Object.assign(element.style, styles);
      element.dataset.forgeManagedStyle = 'true';
      publishStyle(elementId(element), styles);
    };

    const renderStructurePanel = (element: HTMLElement) => {
      const children = Array.from(element.children);
      const childRows = children.slice(0, 12).map((child, index) => `
        <div class="wf-layer-row">
          <button class="wf-layer-item" data-wf-child-select="${index}" type="button">
            <span>${escapeHtml(layerDisplayName(child as HTMLElement))}</span>
            <small>${escapeHtml((child as HTMLElement).tagName.toLowerCase())}</small>
          </button>
          <button class="wf-layer-edit" data-wf-child-edit="${index}" type="button">Edit</button>
          <button class="wf-layer-duplicate" data-wf-child-duplicate="${index}" type="button" title="Duplica">Dup</button>
          <button class="wf-layer-add" data-wf-child-add-like="${index}" type="button" title="Aggiungi elemento simile">+Sim</button>
          <button class="wf-layer-rename" data-wf-child-rename="${index}" type="button">Nome</button>
        </div>
      `).join('');
      return `
        <div class="wf-inspector-section">
          <h4>Struttura interna</h4>
          <div class="wf-inspector-note">${children.length ? `Contiene ${children.length} elementi.` : 'Non contiene altri elementi.'}</div>
          <div class="wf-children-list">${childRows || '<div class="wf-inspector-note">Nessun livello interno diretto.</div>'}</div>
          <div class="wf-inspector-grid">
            <button type="button" data-wf-structure-action="duplicate-selected">Duplica selezionato</button>
            <button type="button" data-wf-structure-action="add-like-selected">Aggiungi simile</button>
            <button type="button" data-wf-structure-action="add-text-inside">Testo dentro</button>
            <button type="button" data-wf-structure-action="add-box-inside">Contenitore dentro</button>
            <button type="button" data-wf-structure-action="add-section-after">Sezione sotto</button>
            <button type="button" data-wf-structure-action="add-form-after">Form sotto</button>
          </div>
        </div>
      `;
    };

    const actionForElement = (element: HTMLElement): ForgeAction => content.customActions?.[elementId(element)] ?? { type: 'none', destination: '', transition: 'fade' };

    const renderActionDestinationControl = (action: ForgeAction) => {
      if (action.type === 'external') {
        return `<label class="wf-wide">URL esterno <input data-wf-inspector-action="destination" value="${escapeHtml(action.destination || 'https://')}" placeholder="https://..." /></label>`;
      }
      const options = action.type === 'section'
        ? [
            ['hero', 'Hero / apertura'],
            ['filosofia', 'Filosofia'],
            ['trattamenti', 'Trattamenti'],
            ['biografia', 'Biografia'],
            ['cliniche', 'Sedi'],
            ['recensioni', 'Review'],
            ['contatto', 'Form contatto'],
          ]
        : action.type === 'page-section'
          ? pageSectionOptions(content.treatmentCategories, content.mediaSections)
        : action.type === 'treatment'
          ? content.treatments.map((treatment) => [treatment.id, `${treatmentGroupLabel(treatment.category, content.treatmentCategories)} / ${treatment.title}`])
        : action.type === 'action'
          ? [
              ['booking', 'Apri prenotazione'],
              ['phone', 'Chiama telefono'],
              ['email', 'Apri email'],
            ]
          : pageDestinationOptions(content.treatments, content.treatmentCategories);
      return `<label class="wf-wide">Destinazione
        <select data-wf-inspector-action="destination">
          ${options.map(([value, label]) => `<option value="${value}" ${action.destination === value ? 'selected' : ''}>${label}</option>`).join('')}
        </select>
      </label>`;
    };

    const renderActionsPanel = (element: HTMLElement) => {
      const action = actionForElement(element);
      return `
      <div class="wf-inspector-section">
        <h4>Collegamento elemento</h4>
        <div class="wf-inspector-grid">
          <label>Tipo
            <select data-wf-inspector-action="type">
              <option value="none" ${action.type === 'none' ? 'selected' : ''}>Nessuna azione</option>
              <option value="page" ${action.type === 'page' ? 'selected' : ''}>Pagina interna</option>
              <option value="section" ${action.type === 'section' ? 'selected' : ''}>Sezione home</option>
              <option value="page-section" ${action.type === 'page-section' ? 'selected' : ''}>Sezione di pagina</option>
              <option value="treatment" ${action.type === 'treatment' ? 'selected' : ''}>Pagina trattamento</option>
              <option value="external" ${action.type === 'external' ? 'selected' : ''}>Link esterno</option>
              <option value="action" ${action.type === 'action' ? 'selected' : ''}>Azione sito</option>
            </select>
          </label>
          <label>Transizione
            <select data-wf-inspector-action="transition">
              <option value="fade" ${action.transition === 'fade' ? 'selected' : ''}>Dissolvenza</option>
              <option value="slide" ${action.transition === 'slide' ? 'selected' : ''}>Scorrimento</option>
              <option value="instant" ${action.transition === 'instant' ? 'selected' : ''}>Istantanea</option>
            </select>
          </label>
          ${action.type === 'none' ? '<div class="wf-inspector-note wf-wide">Attiva un tipo per trasformare questo elemento in pulsante/link gestito dal builder.</div>' : renderActionDestinationControl(action)}
        </div>
      </div>
      <div class="wf-inspector-section">
        <h4>Azioni rapide struttura</h4>
        <div class="wf-inspector-grid">
          <button type="button" data-wf-context="edit-text">Modifica testo</button>
          <button type="button" data-wf-context="replace-image">Sostituisci immagine</button>
          <button type="button" data-wf-context="add-text">Aggiungi testo</button>
          <button type="button" data-wf-context="add-title">Aggiungi titolo</button>
          <button type="button" data-wf-context="add-button">Aggiungi pulsante</button>
          <button type="button" data-wf-context="add-image">Aggiungi immagine</button>
          <button type="button" data-wf-context="add-separator">Separatore</button>
          <button type="button" data-wf-context="add-box">Contenitore</button>
          <button type="button" data-wf-context="add-section">Sezione sotto</button>
          <button type="button" data-wf-context="add-form">Form sotto</button>
          <button type="button" data-wf-context="duplicate">Duplica</button>
          <button type="button" data-wf-context="duplicate-parent">Duplica padre</button>
          <button type="button" data-wf-context="select-parent">Padre</button>
          <button type="button" data-wf-context="text-on-dark">Testo chiaro</button>
          <button type="button" data-wf-context="text-on-light">Testo scuro</button>
          <button type="button" data-wf-context="center">Centra</button>
          <button type="button" data-wf-context="reset">Reset stile</button>
          <button type="button" data-wf-context="delete">Elimina</button>
        </div>
      </div>
    `;
    };

    const renderEffectsPanel = (element: HTMLElement) => `
      <div class="wf-inspector-section">
        <h4>Comportamenti</h4>
        <div class="wf-inspector-grid">
          <label>Testo adattivo
            <select data-wf-inspector-adaptive>
              <option value="false" ${element.dataset.forgeAdaptiveText === 'true' ? '' : 'selected'}>Spento</option>
              <option value="true" ${element.dataset.forgeAdaptiveText === 'true' ? 'selected' : ''}>Attivo</option>
            </select>
          </label>
          <label>Sorgente contrasto
            <select data-wf-inspector-adaptive-source>
              <option value="auto" ${(element.dataset.forgeAdaptiveSource || 'auto') === 'auto' ? 'selected' : ''}>Auto intelligente</option>
              <option value="page" ${element.dataset.forgeAdaptiveSource === 'page' ? 'selected' : ''}>Pagina sotto</option>
              <option value="section" ${element.dataset.forgeAdaptiveSource === 'section' ? 'selected' : ''}>Sezione</option>
              <option value="element" ${element.dataset.forgeAdaptiveSource === 'element' ? 'selected' : ''}>Contenitore</option>
              <option value="header" ${element.dataset.forgeAdaptiveSource === 'header' ? 'selected' : ''}>Header chiaro/scuro</option>
            </select>
          </label>
          <label>Trasformazione <input data-wf-inspector-style="transform" value="${escapeHtml(fieldValue(element, 'transform'))}" placeholder="translate(0px, 0px)" /></label>
        </div>
        <div class="wf-inspector-note">Qui confluiscono i comportamenti dinamici: testo chiaro/scuro automatico, micro-posizionamenti e prossime animazioni del template.</div>
      </div>
    `;

    const renderInspector = (element: HTMLElement) => {
      const label = layerDisplayName(element);
      const id = elementId(element);
      const hasTextControls = isTextElement(element);
      const hasImageControls = isImageElement(element);
      const tabs = [
        { id: 'general', label: 'Generale' },
        { id: 'content', label: 'Contenuto' },
        { id: 'design', label: 'Design' },
        { id: 'layout', label: 'Layout' },
        { id: 'effects', label: 'Effetti' },
        { id: 'structure', label: 'Struttura' },
        { id: 'actions', label: 'Azioni' },
      ];
      if (!tabs.some((tab) => tab.id === activeInspectorTab)) activeInspectorTab = 'general';
      inspectorTitle.textContent = `Elemento: ${label}`;
      inspectorSubtitle.textContent = `${readableElementSummary(element)} - ${layerDetail(element)}`;
      inspectorTabs.innerHTML = tabs.map((tab) => `<button type="button" class="${activeInspectorTab === tab.id ? 'wf-active' : ''}" data-wf-inspector-tab="${tab.id}">${tab.label}</button>`).join('');

      const contentSubtabs = [
        ...(hasTextControls ? [{ id: 'text', label: 'Testo' }] : []),
        ...(hasImageControls ? [{ id: 'image', label: 'Immagine' }] : []),
        { id: 'identity', label: 'Info' },
      ];
      const designSubtabs = [
        ...(hasTextControls ? [{ id: 'text', label: 'Testo' }] : []),
        { id: 'colors', label: 'Colori' },
      ];

      if (activeInspectorTab === 'general') inspectorBody.innerHTML = renderGeneralPanel(element);
      if (activeInspectorTab === 'content') {
        const subtabs = renderSubtabs(contentSubtabs);
        const panel = activeInspectorSubtab === 'image' && hasImageControls
          ? renderImagePanel(element)
          : activeInspectorSubtab === 'text' && hasTextControls
            ? renderTextPanel(element, id)
            : `<div class="wf-inspector-section">
                <h4>Info elemento</h4>
                <label class="wf-wide">Nome livello
                  <input data-wf-layer-label value="${escapeHtml(element.dataset.forgeLayerLabel || '')}" placeholder="${escapeHtml(humanLayerName(element))}" />
                </label>
                <div class="wf-inspector-note">${escapeHtml(readableElementSummary(element))}<br />Nome originale: ${escapeHtml(humanLayerName(element))}<br />ID: ${escapeHtml(id)}<br />Tag: ${escapeHtml(element.tagName.toLowerCase())}</div>
              </div>`;
        inspectorBody.innerHTML = `${subtabs}${panel}`;
        return;
      }

      if (activeInspectorTab === 'design') {
        const subtabs = renderSubtabs(designSubtabs);
        const panel = activeInspectorSubtab === 'text' && hasTextControls
          ? renderTextPanel(element, id)
          : hasTextControls
            ? `${renderQuickTextPanel(element)}${renderColorPanel(element)}`
            : renderColorPanel(element);
        inspectorBody.innerHTML = `${subtabs}${panel}`;
        return;
      }

      if (activeInspectorTab === 'layout') inspectorBody.innerHTML = renderLayoutPanel(element);
      if (activeInspectorTab === 'effects') inspectorBody.innerHTML = renderEffectsPanel(element);
      if (activeInspectorTab === 'structure') inspectorBody.innerHTML = renderStructurePanel(element);
      if (activeInspectorTab === 'actions') inspectorBody.innerHTML = renderActionsPanel(element);
    };

    const openInspector = (element = selectedElement) => {
      if (!element) return;
      if (element !== selectedElement) selectExactElement(element, layerElements[0] || element);
      renderInspector(element);
      inspector.hidden = false;
      if (manualInspectorPosition) {
        inspector.style.left = `${manualInspectorPosition.x}px`;
        inspector.style.top = `${manualInspectorPosition.y}px`;
        inspector.style.right = 'auto';
      }
    };

    const positionOverlay = () => {
      if (selectedElement && !selectedElement.isConnected) {
        selectedElement = null;
        selectedId = '';
        layerElements = [];
        selectedElements = [];
      }
      if (!selectedElement || !liveEditEnabled()) {
        box.style.display = 'none';
        contextBox.hidden = true;
        elementHandles.hidden = true;
        toolbar.hidden = true;
        hideSpacingGuides();
        if (liveEditEnabled() && layersUserOpen) {
          if (layerElements.length === 0) buildLayerStack(document.body, null);
          layers.hidden = false;
        } else {
          layers.hidden = true;
        }
        inspector.hidden = true;
        return;
      }
      const rect = selectedElement.getBoundingClientRect();
      box.style.display = 'block';
      box.style.left = `${rect.left}px`;
      box.style.top = `${rect.top}px`;
      box.style.width = `${rect.width}px`;
      box.style.height = `${rect.height}px`;
      paintSpacingGuides(selectedElement, rect);
      elementHandles.hidden = false;
      elementHandles.style.left = `${rect.left}px`;
      elementHandles.style.top = `${rect.top}px`;
      elementHandles.style.width = `${rect.width}px`;
      elementHandles.style.height = `${rect.height}px`;
      paintMultiBoxes();
      paintContextBox();
      toolbar.hidden = !quickToolbarEnabledFor(selectedElement);
      layers.hidden = !layersUserOpen || layerElements.length === 0;
      const toolbarWidth = toolbar.offsetWidth || 360;
      const toolbarHeight = toolbar.offsetHeight || 44;
      const padding = 12;
      const gap = 22;
      const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

      if (manualToolbarPosition) {
        toolbar.style.left = `${clamp(manualToolbarPosition.x, padding, window.innerWidth - toolbarWidth - padding)}px`;
        toolbar.style.top = `${clamp(manualToolbarPosition.y, padding, window.innerHeight - toolbarHeight - padding)}px`;
        return;
      }

      const candidates = [
        {
          x: clamp(rect.left, padding, window.innerWidth - toolbarWidth - padding),
          y: rect.bottom + gap,
          fits: rect.bottom + gap + toolbarHeight < window.innerHeight - padding,
        },
        {
          x: clamp(rect.left, padding, window.innerWidth - toolbarWidth - padding),
          y: rect.top - toolbarHeight - gap,
          fits: rect.top - toolbarHeight - gap > padding,
        },
        {
          x: rect.right + gap,
          y: clamp(rect.top, padding, window.innerHeight - toolbarHeight - padding),
          fits: rect.right + gap + toolbarWidth < window.innerWidth - padding,
        },
        {
          x: rect.left - toolbarWidth - gap,
          y: clamp(rect.top, padding, window.innerHeight - toolbarHeight - padding),
          fits: rect.left - toolbarWidth - gap > padding,
        },
      ];
      const next = candidates.find((candidate) => candidate.fits) ?? candidates[0];
      toolbar.style.left = `${clamp(next.x, padding, window.innerWidth - toolbarWidth - padding)}px`;
      toolbar.style.top = `${clamp(next.y, padding, window.innerHeight - toolbarHeight - padding)}px`;
      scheduleHoverBox();
    };

    const selectElement = (element: HTMLElement, additive = false) => {
      const forgeElement = editableElementFrom(element);
      if (!forgeElement) return null;
      return selectExactElement(forgeElement, element, additive);
    };

    const htmlElementFromTarget = (target: EventTarget | null) => (
      target instanceof Element ? target as unknown as HTMLElement : null
    );

    const selectableStackFrom = (source: HTMLElement, x?: number, y?: number) => {
      const stack: HTMLElement[] = [];
      const addCandidate = (candidate: HTMLElement | null) => {
        if (!candidate || candidate.closest('#websites-forge-live-overlay') || candidate === document.body) return;
        if (!candidate.dataset.forgeId && !candidate.dataset.forgeInsertId && !candidate.dataset.forgeAutoId) {
          candidate.dataset.forgeAutoId = autoForgePath(candidate);
        }
        if (!stack.includes(candidate)) stack.push(candidate);
      };

      if (typeof x === 'number' && typeof y === 'number') {
        addCandidate(editableElementAtPoint(x, y, source));
      }
      addCandidate(editableElementFrom(source));
      let node: HTMLElement | null = source;
      while (node && node !== document.body && stack.length < 18) {
        addCandidate(node);
        node = node.parentElement;
      }
      return stack;
    };

    const selectableParentOf = (element: HTMLElement | null) => {
      let parent = element?.parentElement ?? null;
      while (parent && parent !== document.body) {
        if (!parent.closest('#websites-forge-live-overlay')) {
          if (!parent.dataset.forgeId && !parent.dataset.forgeInsertId && !parent.dataset.forgeAutoId) {
            parent.dataset.forgeAutoId = autoForgePath(parent);
          }
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const selectParentElement = () => {
      if (!selectedElement) return null;
      const parent = selectableParentOf(selectedElement);
      if (!parent) return null;
      selectExactElement(parent, selectedElement);
      return parent;
    };

    const handleClick = (event: MouseEvent) => {
      if (!liveEditEnabled()) return;
      ensureAutoIds();
      const source = htmlElementFromTarget(event.target);
      if (!source || source.closest('#websites-forge-live-overlay')) return;
      const additive = event.ctrlKey || event.metaKey;
      const candidates = selectableStackFrom(source, event.clientX, event.clientY);
      if (candidates.length === 0) return;
      const signature = candidates.map(elementId).join('|');
      const now = window.performance.now();
      const index = !additive && lastSelectionClick?.signature === signature && now - lastSelectionClick.at < 900
        ? (lastSelectionClick.index + 1) % candidates.length
        : 0;
      lastSelectionClick = { signature, index, at: now };
      const selected = selectExactElement(candidates[index], source, additive);
      if (!selected) return;
      if (inspector.hidden) {
        openInspector(selected);
      } else if (selectedElement) {
        renderInspector(selectedElement);
      }
      if (!layersUserOpen) {
        layersUserOpen = true;
        buildLayerStack(document.body, selected);
        positionOverlay();
      }
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDoubleClick = (event: MouseEvent) => {
      if (!liveEditEnabled()) return;
      ensureAutoIds();
      const source = htmlElementFromTarget(event.target);
      if (!source || source.closest('#websites-forge-live-overlay')) return;
      const element = selectElement(source);
      if (!element) return;
      if (element.childElementCount > 0 && !element.dataset.forgePath) return;
      element.contentEditable = 'true';
      element.spellcheck = true;
      toolbar.dataset.wfTextMode = 'true';
      const modeLabel = toolbar.querySelector<HTMLElement>('[data-wf-mode-label]');
      if (modeLabel) modeLabel.textContent = `Testo: ${humanLayerName(element)}`;
      element.focus();
      document.execCommand('selectAll', false);
      event.preventDefault();
      event.stopPropagation();
    };

    const handleInput = (event: Event) => {
      if (!liveEditEnabled()) return;
      const element = (event.target as HTMLElement).closest<HTMLElement>('[data-forge-path], [data-forge-auto-id]');
      if (!element) return;

      if (element.dataset.forgePath) {
        const path = element.dataset.forgePath;
        window.parent?.postMessage({ type: 'WEBSITES_FORGE_CONTENT_PATCH', path, value: element.textContent ?? '' }, '*');
        if (hasRichInlineFormatting(element)) publishHtml(elementId(element), element.innerHTML);
      } else if (element.childElementCount === 0) {
        publishText(elementId(element), element.textContent ?? '');
        if (hasRichInlineFormatting(element)) publishHtml(elementId(element), element.innerHTML);
      } else if (element.isContentEditable && hasRichInlineFormatting(element)) {
        publishHtml(elementId(element), element.innerHTML);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (!liveEditEnabled()) return;
      ensureAutoIds();
      const target = event.target as HTMLElement;
      const element = editableElementAtPoint(event.clientX, event.clientY, target);
      if (!element) return;
      event.preventDefault();
      selectElement(element, event.ctrlKey || event.metaKey);
      showInsertMenu(element, 'afterend', 'below', event.clientX, event.clientY);
    };

    const pickHoverElement = () => {
      hoverPickFrame = 0;
      if (!hoverPoint || !liveEditEnabled()) {
        clearHoverBox();
        return;
      }
      const { x, y, target } = hoverPoint;
      if (target.closest('#websites-forge-live-overlay')) return;
      const element = editableElementAtPoint(x, y, target);
      if (!element) {
        clearHoverBox();
        return;
      }
      hoveredElement = element;
      scheduleHoverBox();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!liveEditEnabled()) {
        clearHoverBox();
        return;
      }
      const target = event.target as HTMLElement;
      if (target.closest('#websites-forge-live-overlay')) return;
      hoverPoint = { x: event.clientX, y: event.clientY, target };
      if (!hoverPickFrame) hoverPickFrame = window.requestAnimationFrame(pickHoverElement);
    };

    const handleMouseLeave = () => {
      clearHoverBox();
    };

    const handleDragOver = (event: DragEvent) => {
      if (!liveEditEnabled()) return;
      ensureAutoIds();
      const hasMediaPayload = Array.from(event.dataTransfer?.items ?? []).some((item) => item.kind === 'file' || item.type.startsWith('image/') || item.type === 'text/uri-list' || item.type === 'text/plain');
      const element = mediaDropTargetFrom(event);
      if (element && hasMediaPayload) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'copy';
      }
    };

    const handleDrop = (event: DragEvent) => {
      if (!liveEditEnabled()) return;
      ensureAutoIds();
      const element = mediaDropTargetFrom(event);
      const file = event.dataTransfer?.files?.[0];
      const url = event.dataTransfer?.getData('text/uri-list') || event.dataTransfer?.getData('text/plain');
      if (!element || (!file && !url)) return;
      event.preventDefault();
      event.stopPropagation();

      const applyImage = (value: string) => {
        applyMediaUrl(element, value);
        selectExactElement(element, element);
        if (!inspector.hidden) renderInspector(element);
      };

      if (file?.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => applyImage(String(reader.result));
        reader.readAsDataURL(file);
      } else if (url) {
        applyImage(url);
      }
    };

    const updateEditableState = () => {
      const enabled = liveEditEnabled();
      if (enabled) ensureAutoIds();
      document.querySelectorAll<HTMLElement>('[data-forge-path]').forEach((element) => {
        element.contentEditable = 'false';
        element.spellcheck = enabled;
      });
      positionOverlay();
    };

    const handleOverlayInput = (event: Event) => {
      const layerLabelInput = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-layer-label]');
      if (layerLabelInput && selectedElement) {
        publishLayerLabel(selectedId, layerLabelInput.value, selectedElement);
        if (layersUserOpen) buildLayerStack(layerElements[0] || selectedElement, selectedElement);
        inspectorTitle.textContent = `Elemento: ${layerLabelInput.value.trim() || humanLayerName(selectedElement)}`;
        return;
      }

      const inspectorText = (event.target as HTMLElement).closest<HTMLTextAreaElement>('[data-wf-inspector-text]');
      if (inspectorText && selectedElement) {
        selectedElement.textContent = inspectorText.value;
        if (selectedElement.dataset.forgePath) {
          window.parent?.postMessage({ type: 'WEBSITES_FORGE_CONTENT_PATCH', path: selectedElement.dataset.forgePath, value: inspectorText.value }, '*');
        } else {
          publishText(selectedId, inspectorText.value);
        }
        positionOverlay();
        return;
      }

      const quickScope = (event.target as HTMLElement).closest<HTMLSelectElement>('[data-wf-quick-overlay-scope]');
      if (quickScope && selectedElement) {
        const scope = quickScope.value === 'selected' ? 'selected' : 'all';
        setQuickToolbarState(selectedElement, scope, quickToolbarEnabledFor(selectedElement));
        renderInspector(selectedElement);
        return;
      }

      const quickVisible = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-quick-overlay-visible]');
      if (quickVisible && selectedElement) {
        const scope = quickToolbarScopeFor(selectedElement);
        setQuickToolbarState(selectedElement, scope, quickVisible.checked);
        renderInspector(selectedElement);
        return;
      }

      const inspectorImage = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-inspector-image]');
      if (inspectorImage && selectedElement) {
        applyMediaUrl(selectedElement, inspectorImage.value);
        positionOverlay();
        return;
      }

      const inspectorAttr = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-inspector-attr]');
      if (inspectorAttr && selectedElement) {
        const attr = inspectorAttr.dataset.wfInspectorAttr;
        if (attr) selectedElement.setAttribute(attr, inspectorAttr.value);
        return;
      }

      const inspectorStyle = (event.target as HTMLElement).closest<HTMLInputElement | HTMLSelectElement>('[data-wf-inspector-style]');
      if (inspectorStyle && selectedElement) {
        const styles = { [inspectorStyle.dataset.wfInspectorStyle!]: inspectorStyle.value } as CSSProperties;
        applyManagedStyles(styles);
        return;
      }

      const rangeStyle = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-range-style]');
      if (rangeStyle && selectedElement) {
        const suffix = rangeStyle.dataset.wfRangeSuffix || '';
        const value = `${rangeStyle.value}${suffix}`;
        const valueDisplay = rangeStyle.parentElement?.querySelector<HTMLInputElement>('[data-wf-range-value]');
        if (valueDisplay) valueDisplay.value = value;
        const styles = { [rangeStyle.dataset.wfRangeStyle!]: value } as CSSProperties;
        applyManagedStyles(styles);
        return;
      }

      const mediaFile = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-media-file]');
      if (mediaFile?.files?.[0] && selectedElement) {
        const file = mediaFile.files[0];
        if (!file.type.startsWith('image/')) {
          window.parent?.postMessage({ type: 'WEBSITES_FORGE_TOAST', message: 'Seleziona un file immagine valido.' }, '*');
          mediaFile.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (!selectedElement) return;
          applyMediaUrl(selectedElement, String(reader.result));
          renderInspector(selectedElement);
          positionOverlay();
        };
        reader.readAsDataURL(file);
        mediaFile.value = '';
        return;
      }

      const inspectorQuick = (event.target as HTMLElement).closest<HTMLSelectElement>('[data-wf-inspector-quick]');
      if (inspectorQuick?.value && selectedElement) {
        handleQuickAction(inspectorQuick.value);
        renderInspector(selectedElement);
        inspectorQuick.value = '';
        return;
      }

      const inspectorColor = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-inspector-color]');
      if (inspectorColor && selectedElement) {
        disableAdaptiveText();
        applyManagedStyles({ color: inspectorColor.value });
        return;
      }

      const inspectorBackground = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-inspector-bg]');
      if (inspectorBackground && selectedElement) {
        applyManagedStyles({ backgroundColor: inspectorBackground.value });
        return;
      }

      const inspectorIconColor = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-inspector-icon-color]');
      if (inspectorIconColor && selectedElement) {
        applyManagedStyles({ color: inspectorIconColor.value });
        return;
      }

      const inspectorAdaptive = (event.target as HTMLElement).closest<HTMLSelectElement>('[data-wf-inspector-adaptive]');
      if (inspectorAdaptive && selectedElement) {
        const source = (inspector.querySelector<HTMLSelectElement>('[data-wf-inspector-adaptive-source]')?.value || selectedElement.dataset.forgeAdaptiveSource || 'auto') as AdaptiveSource;
        setAdaptiveText(inspectorAdaptive.value === 'true', source);
        return;
      }

      const inspectorAdaptiveSource = (event.target as HTMLElement).closest<HTMLSelectElement>('[data-wf-inspector-adaptive-source]');
      if (inspectorAdaptiveSource && selectedElement) {
        setAdaptiveText(selectedElement.dataset.forgeAdaptiveText === 'true', inspectorAdaptiveSource.value as AdaptiveSource);
        return;
      }

      const inspectorAction = (event.target as HTMLElement).closest<HTMLInputElement | HTMLSelectElement>('[data-wf-inspector-action]');
      if (inspectorAction && selectedElement) {
        const selectedId = elementId(selectedElement);
        const currentAction: ForgeAction = content.customActions?.[selectedId] ?? { type: 'none', destination: '', transition: 'fade' };
        const key = inspectorAction.dataset.wfInspectorAction as 'type' | 'destination' | 'transition';
        const value = inspectorAction.value;
        const nextAction: ForgeAction = {
          ...currentAction,
          [key]: key === 'type'
            ? value as ActionDestinationType
            : key === 'transition'
              ? value as ForgeAction['transition']
              : value,
        };
        if (key === 'type') {
          nextAction.destination = value === 'section'
            ? 'hero'
            : value === 'page-section'
              ? pageSectionOptions(content.treatmentCategories)[0]?.[0] || 'chirurgia#seno'
            : value === 'treatment'
              ? content.treatments[0]?.id || ''
            : value === 'external'
              ? 'https://'
              : value === 'action'
                ? 'booking'
                : value === 'page'
                  ? 'home'
                  : '';
        }
        setContent((current) => mergeContent({
          ...current,
          customActions: {
            ...current.customActions,
            [selectedId]: nextAction,
          },
        }));
        window.parent?.postMessage({ type: 'WEBSITES_FORGE_ACTION_PATCH', forgeId: selectedId, action: nextAction }, '*');
        renderInspector(selectedElement);
        return;
      }

      const customColor = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-custom-color]');
      if (customColor && selectedElement) {
        if (!selectionInsideSelected()) disableAdaptiveText();
        applyManagedStyles({ color: customColor.value });
        return;
      }

      const customBackground = (event.target as HTMLElement).closest<HTMLInputElement>('[data-wf-custom-bg]');
      if (customBackground && selectedElement) {
        applyManagedStyles({ backgroundColor: customBackground.value });
        return;
      }

      const textControl = (event.target as HTMLElement).closest<HTMLInputElement | HTMLSelectElement>('[data-wf-text-style]');
      if (textControl && selectedElement) {
        const styles = { [textControl.dataset.wfTextStyle!]: textControl.value } as CSSProperties;
        if (selectedElement.isContentEditable || selectedElement.childElementCount === 0 || !selectionInsideSelected()) {
          applyManagedStyles(styles);
        } else {
          applyTextStyles(styles);
        }
        return;
      }

      const control = (event.target as HTMLElement).closest<HTMLInputElement | HTMLSelectElement>('[data-wf-style]');
      if (!control || !selectedElement) return;
      const styles = { [control.dataset.wfStyle!]: control.value } as CSSProperties;
      applyManagedStyles(styles);
    };

    const nudge = (x: number, y: number) => {
      const targets = selectedTargets();
      if (targets.length === 0) return;
      const patches = targets.map((element) => {
        const currentTransform = element.style.transform || window.getComputedStyle(element).transform;
        const match = String(currentTransform).match(/translate\((-?\d+)px,\s*(-?\d+)px\)/);
        const nextX = (match ? Number(match[1]) : 0) + x;
        const nextY = (match ? Number(match[2]) : 0) + y;
        const styles = { transform: `translate(${nextX}px, ${nextY}px)` } as CSSProperties;
        Object.assign(element.style, styles);
        element.dataset.forgeManagedStyle = 'true';
        return { forgeId: elementId(element), styles };
      });
      const firstPatch = patches[0];
      if (patches.length === 1 && firstPatch) publishStyle(firstPatch.forgeId, firstPatch.styles);
      else publishStyleBatch(patches);
      positionOverlay();
      paintMultiBoxes();
    };

    const readTranslate = (element: HTMLElement) => {
      const transform = element.style.transform || window.getComputedStyle(element).transform;
      const translate = String(transform).match(/translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/);
      if (translate) {
        return { x: Number(translate[1]), y: Number(translate[2]) };
      }
      const matrix = String(transform).match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const parts = matrix[1].split(',').map((part) => Number(part.trim()));
        return { x: parts[4] || 0, y: parts[5] || 0 };
      }
      return { x: 0, y: 0 };
    };

    const startElementInteraction = (event: PointerEvent, type: 'move' | 'resize', handle?: string) => {
      if (!selectedElement || selectedElements.length > 1) return;
      const rect = selectedElement.getBoundingClientRect();
      const parentRect = (selectedElement.parentElement ?? document.body).getBoundingClientRect();
      const translate = readTranslate(selectedElement);
      elementInteraction = {
        type,
        handle,
        element: selectedElement,
        startX: event.clientX,
        startY: event.clientY,
        startRect: rect,
        parentRect,
        startTranslateX: translate.x,
        startTranslateY: translate.y,
        nextStyles: {},
      };
      elementHandles.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const updateElementInteraction = (event: PointerEvent) => {
      if (!elementInteraction) return;
      const { element, startRect, parentRect, handle, type } = elementInteraction;
      const dx = event.clientX - elementInteraction.startX;
      const dy = event.clientY - elementInteraction.startY;
      const parentWidth = Math.max(parentRect.width, 1);
      const parentHeight = Math.max(parentRect.height, 1);

      if (type === 'move') {
        const minX = parentRect.left - startRect.left + elementInteraction.startTranslateX;
        const maxX = parentRect.right - startRect.right + elementInteraction.startTranslateX;
        const minY = parentRect.top - startRect.top + elementInteraction.startTranslateY;
        const maxY = parentRect.bottom - startRect.bottom + elementInteraction.startTranslateY;
        const nextX = Math.min(Math.max(elementInteraction.startTranslateX + dx, minX), maxX);
        const nextY = Math.min(Math.max(elementInteraction.startTranslateY + dy, minY), maxY);
        const styles = { transform: `translate(${Math.round(nextX)}px, ${Math.round(nextY)}px)` } as CSSProperties;
        Object.assign(element.style, styles);
        elementInteraction.nextStyles = styles;
      } else {
        const affectsEast = handle?.includes('e');
        const affectsWest = handle?.includes('w');
        const affectsSouth = handle?.includes('s');
        const affectsNorth = handle?.includes('n');
        const rawWidth = startRect.width + (affectsEast ? dx : 0) - (affectsWest ? dx : 0);
        const rawHeight = startRect.height + (affectsSouth ? dy : 0) - (affectsNorth ? dy : 0);
        const nextWidth = Math.min(Math.max(rawWidth, 24), parentWidth);
        const nextHeight = Math.min(Math.max(rawHeight, 18), Math.max(parentHeight, startRect.height));
        const styles: CSSProperties = {};
        if (affectsEast || affectsWest) {
          styles.width = `${Math.round((nextWidth / parentWidth) * 1000) / 10}%`;
          styles.maxWidth = '100%';
        }
        if (affectsSouth || affectsNorth) {
          styles.minHeight = `${Math.round(nextHeight)}px`;
        }
        Object.assign(element.style, styles);
        elementInteraction.nextStyles = styles;
      }
      element.dataset.forgeManagedStyle = 'true';
      positionOverlay();
    };

    const finishElementInteraction = (event: PointerEvent) => {
      if (!elementInteraction) return;
      const { element, nextStyles } = elementInteraction;
      elementInteraction = null;
      if (elementHandles.hasPointerCapture(event.pointerId)) {
        elementHandles.releasePointerCapture(event.pointerId);
      }
      if (Object.keys(nextStyles).length > 0) {
        publishStyle(elementId(element), nextStyles);
      }
      positionOverlay();
    };

    const numericStyle = (property: keyof CSSStyleDeclaration, fallback: number) => {
      if (!selectedElement) return fallback;
      const inlineStyles = selectedElement.style as unknown as Record<string, string>;
      const computedStyles = window.getComputedStyle(selectedElement) as unknown as Record<string, string>;
      const value = inlineStyles[String(property)] || computedStyles[String(property)];
      const parsed = Number.parseFloat(String(value));
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const spacingValue = (property: keyof CSSStyleDeclaration, delta: number) => {
      const current = numericStyle(property, 0);
      return `${Math.max(0, current + delta)}px`;
    };

    const handleQuickAction = (quick: string) => {
      if (!selectedElement) return;
      const computed = window.getComputedStyle(selectedElement);
      const currentWeight = Number.parseInt(selectedElement.style.fontWeight || computed.fontWeight, 10);
      const currentSize = numericStyle('fontSize', 16);
      const currentTextTransform = selectedElement.style.textTransform || computed.textTransform;
      const stylesByAction: Record<string, CSSProperties> = {
        bold: { fontWeight: currentWeight >= 600 ? '' : '700' },
        italic: { fontStyle: computed.fontStyle === 'italic' ? '' : 'italic' },
        uppercase: { textTransform: currentTextTransform === 'uppercase' ? '' : 'uppercase' },
        lowercase: { textTransform: currentTextTransform === 'lowercase' ? '' : 'lowercase' },
        'font-smaller': { fontSize: `${Math.max(10, currentSize - 2)}px` },
        'font-larger': { fontSize: `${Math.min(96, currentSize + 2)}px` },
        'align-left': { textAlign: 'left' },
        'align-center': { textAlign: 'center' },
        'align-right': { textAlign: 'right' },
        'preset-title': {
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '44px',
          fontWeight: '400',
          lineHeight: '1.05',
          letterSpacing: '0px',
        },
        'preset-subtitle': {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '20px',
          fontWeight: '500',
          lineHeight: '1.35',
          letterSpacing: '0.04em',
        },
        'preset-body': {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '1.65',
          letterSpacing: '0px',
        },
        'preset-quote': {
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '24px',
          fontWeight: '400',
          fontStyle: 'italic',
          lineHeight: '1.45',
          letterSpacing: '0px',
        },
        'padding-less': { padding: spacingValue('paddingTop', -4) },
        'padding-more': { padding: spacingValue('paddingTop', 4) },
        'margin-less': { margin: spacingValue('marginTop', -4) },
        'margin-more': { margin: spacingValue('marginTop', 4) },
      };
      const styles = stylesByAction[quick];
      if (styles) applyManagedStyles(styles);
    };

    const handleOverlayClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const inspectorTab = target.closest<HTMLElement>('[data-wf-inspector-tab]')?.dataset.wfInspectorTab;
      const inspectorSubtab = target.closest<HTMLElement>('[data-wf-inspector-subtab]')?.dataset.wfInspectorSubtab;
      const childSelectIndex = target.closest<HTMLElement>('[data-wf-child-select]')?.dataset.wfChildSelect;
      const childEditIndex = target.closest<HTMLElement>('[data-wf-child-edit]')?.dataset.wfChildEdit;
      const childDuplicateIndex = target.closest<HTMLElement>('[data-wf-child-duplicate]')?.dataset.wfChildDuplicate;
      const childAddLikeIndex = target.closest<HTMLElement>('[data-wf-child-add-like]')?.dataset.wfChildAddLike;
      const childRenameIndex = target.closest<HTMLElement>('[data-wf-child-rename]')?.dataset.wfChildRename;
      const layerEditIndex = target.closest<HTMLElement>('[data-wf-layer-edit]')?.dataset.wfLayerEdit;
      const layerDuplicateIndex = target.closest<HTMLElement>('[data-wf-layer-duplicate]')?.dataset.wfLayerDuplicate;
      const layerAddLikeIndex = target.closest<HTMLElement>('[data-wf-layer-add-like]')?.dataset.wfLayerAddLike;
      const layerRenameIndex = target.closest<HTMLElement>('[data-wf-layer-rename]')?.dataset.wfLayerRename;
      const layerIndex = target.closest<HTMLElement>('[data-wf-layer]')?.dataset.wfLayer;
      const action = target.closest<HTMLElement>('[data-wf-action]')?.dataset.wfAction;
      const quick = target.closest<HTMLElement>('[data-wf-quick]')?.dataset.wfQuick;
      const color = target.closest<HTMLElement>('[data-wf-color]')?.dataset.wfColor;
      const backgroundColor = target.closest<HTMLElement>('[data-wf-bg]')?.dataset.wfBg;
      const behavior = target.closest<HTMLElement>('[data-wf-behavior]')?.dataset.wfBehavior;
      const toggleAdvanced = target.closest<HTMLElement>('[data-wf-toggle-advanced]');
      const structureAction = target.closest<HTMLElement>('[data-wf-structure-action]')?.dataset.wfStructureAction;
      const mediaAction = target.closest<HTMLElement>('[data-wf-media-action]')?.dataset.wfMediaAction;
      const layoutPreset = target.closest<HTMLElement>('[data-wf-layout-preset]')?.dataset.wfLayoutPreset;
      const insertPlus = target.closest<HTMLElement>('[data-wf-insert-plus]')?.dataset.wfInsertPlus as ForgeInsertPosition | undefined;
      const insertMode = target.closest<HTMLElement>('[data-wf-insert-mode]')?.dataset.wfInsertMode as ForgeInsertMode | undefined;
      const insertBlockId = target.closest<HTMLElement>('[data-wf-insert-block]')?.dataset.wfInsertBlock;
      const context = (event.target as HTMLElement).closest<HTMLElement>('[data-wf-context]')?.dataset.wfContext;

      if (insertPlus && selectedElement) {
        const rect = (target.closest<HTMLElement>('[data-wf-insert-plus]') || target).getBoundingClientRect();
        showInsertMenu(selectedElement, insertPlus, insertMode || (insertPlus === 'beforeend' ? 'inside' : insertPlus === 'beforebegin' ? 'above' : 'below'), rect.right + 8, rect.top);
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (insertBlockId) {
        const position = (menu.dataset.wfInsertPosition || 'afterend') as ForgeInsertPosition;
        const mode = (menu.dataset.wfInsertMode || 'below') as ForgeInsertMode;
        insertBlock(insertBlockId, position, mode);
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (target.closest('[data-wf-inspector-close]')) {
        inspector.hidden = true;
        return;
      }

      if (action === 'open-inspector') {
        if (selectedElement) openInspector(selectedElement);
        return;
      }

      if (action === 'toggle-layers') {
        layersUserOpen = !layersUserOpen;
        if (layersUserOpen) {
          buildLayerStack(document.body, selectedElement);
          layers.classList.remove('wf-expanded');
        }
        layers.hidden = !layersUserOpen || layerElements.length === 0;
        positionOverlay();
        return;
      }

      if (target.closest('[data-wf-layers-expand]')) {
        if (layers.classList.contains('wf-expanded')) {
          layers.classList.remove('wf-expanded');
        } else {
          layers.classList.add('wf-expanded');
        }
        layers.hidden = !layersUserOpen || layerElements.length === 0;
        positionOverlay();
        return;
      }

      if (layoutPreset) {
        applyLayoutPreset(layoutPreset);
        return;
      }

      if (layerRenameIndex !== undefined || layerDuplicateIndex !== undefined || layerAddLikeIndex !== undefined) {
        const nextElement = layerElements[Number(layerRenameIndex ?? layerDuplicateIndex ?? layerAddLikeIndex)];
        if (nextElement) {
          if (layerDuplicateIndex !== undefined) {
            duplicateElement(nextElement);
          } else if (layerAddLikeIndex !== undefined) {
            addElementLike(nextElement);
          } else {
            const nextLabel = window.prompt('Nome personalizzato del livello', nextElement.dataset.forgeLayerLabel || humanLayerName(nextElement));
            if (nextLabel !== null) {
              const id = elementId(nextElement);
              publishLayerLabel(id, nextLabel, nextElement);
              buildLayerStack(layerElements[0] || nextElement, selectedElement || nextElement);
              if (selectedElement === nextElement) renderInspector(nextElement);
            }
          }
        }
        return;
      }

      if (inspectorTab && selectedElement) {
        activeInspectorTab = inspectorTab;
        activeInspectorSubtab = inspectorTab === 'design' ? 'colors' : 'text';
        renderInspector(selectedElement);
        return;
      }

      if (inspectorSubtab && selectedElement) {
        activeInspectorSubtab = inspectorSubtab;
        renderInspector(selectedElement);
        return;
      }

      if ((childSelectIndex !== undefined || childEditIndex !== undefined || childDuplicateIndex !== undefined || childAddLikeIndex !== undefined || childRenameIndex !== undefined) && selectedElement) {
        const index = Number(childEditIndex ?? childDuplicateIndex ?? childAddLikeIndex ?? childSelectIndex ?? childRenameIndex);
        const child = selectedElement.children[index] as HTMLElement | undefined;
        if (child) {
          if (!child.dataset.forgeId && !child.dataset.forgeAutoId) child.dataset.forgeAutoId = autoForgePath(child);
          if (childDuplicateIndex !== undefined) {
            duplicateElement(child);
            renderInspector(selectedElement);
          } else if (childAddLikeIndex !== undefined) {
            addElementLike(child);
            renderInspector(selectedElement);
          } else if (childRenameIndex !== undefined) {
            const nextLabel = window.prompt('Nome personalizzato del sotto-livello', child.dataset.forgeLayerLabel || humanLayerName(child));
            if (nextLabel !== null) {
              publishLayerLabel(elementId(child), nextLabel, child);
              renderInspector(selectedElement);
            }
          } else if (childEditIndex !== undefined) openInspector(child);
          else {
            selectExactElement(child, child);
            renderInspector(child);
          }
        }
        return;
      }

      if (structureAction && selectedElement) {
        if (structureAction === 'duplicate-selected') duplicateElement(selectedElement);
        if (structureAction === 'add-like-selected') addElementLike(selectedElement);
        if (structureAction === 'add-text-inside') insertCustomElement('<p data-forge-insert-id="" style="margin:14px 0;font-size:16px;line-height:1.6;">Nuovo testo modificabile</p>', 'beforeend');
        if (structureAction === 'add-box-inside') insertCustomElement('<div data-forge-insert-id="" style="padding:24px;border:1px solid #d8dee9;background:#ffffff;">Nuovo contenitore</div>', 'beforeend');
        if (structureAction === 'add-section-after') insertCustomElement('<section data-forge-insert-id="" style="padding:64px 24px;background:#ffffff;"><div style="max-width:1120px;margin:0 auto;"><h2 style="font-size:36px;line-height:1.15;margin:0 0 12px;">Nuova sezione</h2><p style="font-size:16px;line-height:1.6;margin:0;">Testo della sezione.</p></div></section>', 'afterend');
        if (structureAction === 'add-form-after') insertCustomElement('<form data-forge-insert-id="" style="display:grid;gap:12px;padding:24px;border:1px solid #d8dee9;background:#ffffff;"><input placeholder="Nome" style="padding:12px;border:1px solid #d8dee9;" /><input placeholder="Email" style="padding:12px;border:1px solid #d8dee9;" /><textarea placeholder="Messaggio" style="padding:12px;border:1px solid #d8dee9;min-height:100px;"></textarea><button type="button" style="padding:12px 18px;background:#090C16;color:#fff;border:0;">Invia</button></form>', 'afterend');
        renderInspector(selectedElement);
        return;
      }

      if (mediaAction && selectedElement) {
        if (mediaAction === 'choose-file') {
          overlayRoot.querySelector<HTMLInputElement>('[data-wf-media-file]')?.click();
          return;
        }
        if (mediaAction === 'clear-image') {
          clearMediaOverride(selectedElement);
          applyManagedStyles({
            backgroundImage: '',
            backgroundSize: '',
            backgroundPosition: '',
            backgroundRepeat: '',
            color: '',
          } as CSSProperties);
          renderInspector(selectedElement);
        }
        return;
      }

      if (layerEditIndex !== undefined) {
        const nextElement = layerElements[Number(layerEditIndex)];
        if (nextElement) openInspector(nextElement);
        return;
      }

      if (layerIndex !== undefined) {
        const nextElement = layerElements[Number(layerIndex)];
        if (nextElement) {
          const additive = event.ctrlKey || event.metaKey;
          selectExactElement(nextElement, layerElements[0] || nextElement, additive);
          if (!inspector.hidden && selectedElement) renderInspector(selectedElement);
        }
        return;
      }

      if (action === 'select-parent') {
        selectParentElement();
        return;
      }
      if (action === 'move-up') nudge(0, -1);
      if (action === 'move-down') nudge(0, 1);
      if (action === 'move-left') nudge(-1, 0);
      if (action === 'move-right') nudge(1, 0);
      if (quick) handleQuickAction(quick);
      if (color) {
        if (!selectionInsideSelected()) disableAdaptiveText();
        const colorPicker = toolbar.querySelector<HTMLInputElement>('[data-wf-custom-color]');
        if (colorPicker && color !== 'transparent') colorPicker.value = normalizeColor(color);
        applyTextStyles({ color });
      }
      if (backgroundColor) {
        const bgPicker = toolbar.querySelector<HTMLInputElement>('[data-wf-custom-bg]');
        if (bgPicker && backgroundColor !== 'transparent') bgPicker.value = normalizeColor(backgroundColor);
        applyManagedStyles({ backgroundColor });
      }
      if (behavior === 'adaptiveText' && selectedElement) {
        setAdaptiveText(selectedElement.dataset.forgeAdaptiveText !== 'true');
      }
      if (toggleAdvanced) {
        const advanced = toolbar.querySelector<HTMLElement>('.wf-advanced');
        if (advanced) {
          advanced.hidden = !advanced.hidden;
          positionOverlay();
        }
      }

      if (!selectedElement || !context) return;
      const activeInsertPosition = (menu.dataset.wfInsertPosition || 'afterend') as ForgeInsertPosition;
      const activeInsertMode = (menu.dataset.wfInsertMode || 'below') as ForgeInsertMode;
      if (context === 'edit-text' && selectedElement.childElementCount === 0) {
        selectedElement.contentEditable = 'true';
        toolbar.dataset.wfTextMode = 'true';
        const modeLabel = toolbar.querySelector<HTMLElement>('[data-wf-mode-label]');
        if (modeLabel) modeLabel.textContent = `Testo: ${humanLayerName(selectedElement)}`;
        selectedElement.focus();
        document.execCommand('selectAll', false);
      }
      if (context === 'replace-image') {
        if (isImageElement(selectedElement)) {
          const value = window.prompt('Incolla URL immagine o asset da usare per questo media/logo.');
          if (value !== null) applyMediaUrl(selectedElement, value);
        } else if (selectedElement.dataset.forgeImagePath) {
          window.parent?.postMessage({ type: 'WEBSITES_FORGE_IMAGE_REPLACE_REQUEST', path: selectedElement.dataset.forgeImagePath }, '*');
        } else {
          window.parent?.postMessage({ type: 'WEBSITES_FORGE_TOAST', message: 'Seleziona un immagine, logo, SVG o icona per sostituirla.' }, '*');
        }
      }
      if (context === 'add-text') {
        insertBlock('text', activeInsertPosition, activeInsertMode);
      }
      if (context === 'add-title') {
        insertBlock('title', activeInsertPosition, activeInsertMode);
      }
      if (context === 'add-button') {
        insertBlock('button', activeInsertPosition, activeInsertMode);
      }
      if (context === 'add-image') {
        insertBlock('image', activeInsertPosition, activeInsertMode);
      }
      if (context === 'add-separator') {
        insertBlock('separator', activeInsertPosition, activeInsertMode);
      }
      if (context === 'add-box') {
        insertBlock('container', activeInsertPosition, activeInsertMode);
      }
      if (context === 'add-section') {
        insertBlock('cta-section', activeInsertPosition, activeInsertMode);
      }
      if (context === 'add-form') {
        insertBlock('form', activeInsertPosition, activeInsertMode);
      }
      if (context === 'duplicate') {
        duplicateElement(selectedElement);
      }
      if (context === 'duplicate-parent') {
        const parent = selectableParentOf(selectedElement);
        if (parent) duplicateElement(parent);
      }
      if (context === 'select-parent') {
        selectParentElement();
      }
      if (context === 'center') {
        const styles = { marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' } as CSSProperties;
        applyManagedStyles(styles);
      }
      if (context === 'text-on-dark') {
        const styles = { color: '#ffffff' } as CSSProperties;
        applyTextStyles(styles);
      }
      if (context === 'text-on-light') {
        const styles = { color: '#090C16' } as CSSProperties;
        applyTextStyles(styles);
      }
      if (context === 'delete') {
        deleteSelectedElement();
        return;
      }
      if (context === 'reset') {
        selectedElement.removeAttribute('style');
        const resetStyles = {} as CSSProperties;
        MANAGED_STYLE_KEYS.forEach((key) => {
          (resetStyles as Record<string, string>)[key] = '';
        });
        publishStyle(selectedId, resetStyles);
      }
      hideContextMenu();
      positionOverlay();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!liveEditEnabled()) return;
      const active = document.activeElement as HTMLElement | null;
      const isTextInput = active?.matches('input, textarea, select, [contenteditable="true"]');
      if (event.key === 'Escape' && !menu.hidden) {
        event.preventDefault();
        hideContextMenu();
        return;
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedElement && !isTextInput) {
        event.preventDefault();
        deleteSelectedElement();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        window.parent?.postMessage({ type: event.shiftKey ? 'WEBSITES_FORGE_REDO' : 'WEBSITES_FORGE_UNDO' }, '*');
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        window.parent?.postMessage({ type: 'WEBSITES_FORGE_REDO' }, '*');
      }
    };

    const handleLiveEditMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'WEBSITES_FORGE_LIVE_EDIT') return;
      const enabled = Boolean(event.data.enabled);
      layersUserOpen = false;
      layers.hidden = true;
      layers.classList.remove('wf-expanded');
      if (!enabled) {
        clearSelection();
        selectedElement = null;
        selectedId = '';
        layerElements = [];
        selectedElements = [];
        box.style.display = 'none';
        contextBox.hidden = true;
        hoverBox.hidden = true;
        hideSpacingGuides();
        elementHandles.hidden = true;
        overlayRoot.querySelectorAll('.wf-multi-box').forEach((item) => item.remove());
        toolbar.hidden = true;
        inspector.hidden = true;
        hideContextMenu();
      }
    };

    const handleElementHandlesPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      const insertButton = target.closest<HTMLElement>('[data-wf-insert-plus]');
      if (insertButton && selectedElement) {
        const insertPlus = insertButton.dataset.wfInsertPlus as ForgeInsertPosition | undefined;
        const insertMode = insertButton.dataset.wfInsertMode as ForgeInsertMode | undefined;
        if (insertPlus) {
          const rect = insertButton.getBoundingClientRect();
          showInsertMenu(selectedElement, insertPlus, insertMode || (insertPlus === 'beforeend' ? 'inside' : insertPlus === 'beforebegin' ? 'above' : 'below'), rect.right + 8, rect.top);
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
      const resizeHandle = target.closest<HTMLElement>('[data-wf-resize]')?.dataset.wfResize;
      if (resizeHandle) {
        startElementInteraction(event, 'resize', resizeHandle);
        return;
      }
      if (target.closest('[data-wf-element-drag]')) {
        startElementInteraction(event, 'move');
      }
    };

    const handleElementHandlesPointerMove = (event: PointerEvent) => {
      updateElementInteraction(event);
    };

    const handleElementHandlesPointerUp = (event: PointerEvent) => {
      finishElementInteraction(event);
    };

    const handleToolbarPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('input, select, textarea, .wf-drag-handle')) {
        event.preventDefault();
      }
      const handle = (event.target as HTMLElement).closest('.wf-drag-handle');
      if (!handle) return;
      draggingToolbar = {
        dx: event.clientX - toolbar.getBoundingClientRect().left,
        dy: event.clientY - toolbar.getBoundingClientRect().top,
      };
      toolbar.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const handleToolbarPointerMove = (event: PointerEvent) => {
      if (!draggingToolbar) return;
      manualToolbarPosition = {
        x: event.clientX - draggingToolbar.dx,
        y: event.clientY - draggingToolbar.dy,
      };
      positionOverlay();
    };

    const handleToolbarPointerUp = (event: PointerEvent) => {
      if (!draggingToolbar) return;
      draggingToolbar = null;
      if (toolbar.hasPointerCapture(event.pointerId)) {
        toolbar.releasePointerCapture(event.pointerId);
      }
    };

    const handleLayersPointerDown = (event: PointerEvent) => {
      void event;
    };

    const handleLayersPointerMove = (event: PointerEvent) => {
      if (!draggingLayers) return;
      const padding = 8;
      const width = layers.offsetWidth || 270;
      const height = layers.offsetHeight || 170;
      const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
      manualLayersPosition = {
        x: clamp(event.clientX - draggingLayers.dx, padding, window.innerWidth - width - padding),
        y: clamp(event.clientY - draggingLayers.dy, padding, window.innerHeight - height - padding),
      };
      layers.style.left = `${manualLayersPosition.x}px`;
      layers.style.top = `${manualLayersPosition.y}px`;
    };

    const handleLayersPointerUp = (event: PointerEvent) => {
      if (!draggingLayers) return;
      draggingLayers = null;
      if (layers.hasPointerCapture(event.pointerId)) {
        layers.releasePointerCapture(event.pointerId);
      }
    };

    const handleInspectorPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-wf-inspector-drag]') || target.closest('button, input, select, textarea')) return;
      const rect = inspector.getBoundingClientRect();
      draggingInspector = {
        dx: event.clientX - rect.left,
        dy: event.clientY - rect.top,
      };
      inspector.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const handleInspectorPointerMove = (event: PointerEvent) => {
      if (!draggingInspector) return;
      const padding = 8;
      const width = inspector.offsetWidth || 360;
      const height = inspector.offsetHeight || 420;
      const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
      manualInspectorPosition = {
        x: clamp(event.clientX - draggingInspector.dx, padding, window.innerWidth - width - padding),
        y: clamp(event.clientY - draggingInspector.dy, padding, window.innerHeight - height - padding),
      };
      inspector.style.left = `${manualInspectorPosition.x}px`;
      inspector.style.top = `${manualInspectorPosition.y}px`;
      inspector.style.right = 'auto';
    };

    const handleInspectorPointerUp = (event: PointerEvent) => {
      if (!draggingInspector) return;
      draggingInspector = null;
      if (inspector.hasPointerCapture(event.pointerId)) {
        inspector.releasePointerCapture(event.pointerId);
      }
    };

    const updateTextModeFromSelection = () => {
      if (!selectedElement || toolbar.hidden) return;
      const hasSelection = Boolean(selectionInsideSelected());
      const textMode = selectedElement.isContentEditable || selectedElement.childElementCount === 0 || hasSelection;
      toolbar.dataset.wfTextMode = String(textMode);
      const modeLabel = toolbar.querySelector<HTMLElement>('[data-wf-mode-label]');
      if (modeLabel) {
        const label = humanLayerName(selectedElement);
        modeLabel.textContent = hasSelection ? `Selezione: ${label}` : label;
      }
    };

    updateEditableState();
      document.addEventListener('click', handleClick, true);
      document.addEventListener('dblclick', handleDoubleClick, true);
      document.addEventListener('mousemove', handleMouseMove, true);
      document.addEventListener('mouseleave', handleMouseLeave, true);
      document.addEventListener('input', handleInput, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragover', handleDragOver, true);
    document.addEventListener('drop', handleDrop, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('selectionchange', updateTextModeFromSelection);
    window.addEventListener('message', handleLiveEditMessage);
    window.addEventListener('scroll', positionOverlay, true);
    window.addEventListener('resize', positionOverlay);
    overlayRoot.addEventListener('input', handleOverlayInput);
    overlayRoot.addEventListener('change', handleOverlayInput);
    overlayRoot.addEventListener('click', handleOverlayClick);
    elementHandles.addEventListener('pointerdown', handleElementHandlesPointerDown);
    elementHandles.addEventListener('pointermove', handleElementHandlesPointerMove);
    elementHandles.addEventListener('pointerup', handleElementHandlesPointerUp);
    elementHandles.addEventListener('pointercancel', handleElementHandlesPointerUp);
    toolbar.addEventListener('pointerdown', handleToolbarPointerDown);
    toolbar.addEventListener('pointermove', handleToolbarPointerMove);
    toolbar.addEventListener('pointerup', handleToolbarPointerUp);
    toolbar.addEventListener('pointercancel', handleToolbarPointerUp);
    layers.addEventListener('pointerdown', handleLayersPointerDown);
    layers.addEventListener('pointermove', handleLayersPointerMove);
    layers.addEventListener('pointerup', handleLayersPointerUp);
    layers.addEventListener('pointercancel', handleLayersPointerUp);
    inspector.addEventListener('pointerdown', handleInspectorPointerDown);
    inspector.addEventListener('pointermove', handleInspectorPointerMove);
    inspector.addEventListener('pointerup', handleInspectorPointerUp);
    inspector.addEventListener('pointercancel', handleInspectorPointerUp);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('dblclick', handleDoubleClick, true);
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragover', handleDragOver, true);
      document.removeEventListener('drop', handleDrop, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('selectionchange', updateTextModeFromSelection);
      window.removeEventListener('message', handleLiveEditMessage);
      window.removeEventListener('scroll', positionOverlay, true);
      window.removeEventListener('resize', positionOverlay);
      toolbar.removeEventListener('pointerdown', handleToolbarPointerDown);
      toolbar.removeEventListener('pointermove', handleToolbarPointerMove);
      toolbar.removeEventListener('pointerup', handleToolbarPointerUp);
      toolbar.removeEventListener('pointercancel', handleToolbarPointerUp);
      layers.removeEventListener('pointerdown', handleLayersPointerDown);
      layers.removeEventListener('pointermove', handleLayersPointerMove);
      layers.removeEventListener('pointerup', handleLayersPointerUp);
      layers.removeEventListener('pointercancel', handleLayersPointerUp);
      inspector.removeEventListener('pointerdown', handleInspectorPointerDown);
      inspector.removeEventListener('pointermove', handleInspectorPointerMove);
      inspector.removeEventListener('pointerup', handleInspectorPointerUp);
      inspector.removeEventListener('pointercancel', handleInspectorPointerUp);
      overlayRoot.removeEventListener('input', handleOverlayInput);
      overlayRoot.removeEventListener('change', handleOverlayInput);
      overlayRoot.removeEventListener('click', handleOverlayClick);
      elementHandles.removeEventListener('pointerdown', handleElementHandlesPointerDown);
      elementHandles.removeEventListener('pointermove', handleElementHandlesPointerMove);
      elementHandles.removeEventListener('pointerup', handleElementHandlesPointerUp);
      elementHandles.removeEventListener('pointercancel', handleElementHandlesPointerUp);
      if (hoverPickFrame) window.cancelAnimationFrame(hoverPickFrame);
      if (hoverFrame) window.cancelAnimationFrame(hoverFrame);
      overlayRoot.remove();
      style.remove();
    };
  }, []);

  const value = useMemo(() => content, [content]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
