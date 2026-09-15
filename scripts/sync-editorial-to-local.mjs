import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const statePath = path.join(root, 'forge-data', 'active-site-content.json');
const backupPath = path.join(root, 'forge-data', 'active-site-content.before-pdf-revisions.json');
const editorialPath = path.join(root, 'pages-content', 'editorial-overrides.json');
if (!existsSync(statePath) || !existsSync(editorialPath)) throw new Error('CMS state or editorial revisions missing.');
if (!existsSync(backupPath)) copyFileSync(statePath, backupPath);

const state = JSON.parse(readFileSync(statePath, 'utf8'));
const editorial = JSON.parse(readFileSync(editorialPath, 'utf8'));
state.drInfo = { ...state.drInfo, ...editorial.drInfo };
state.treatmentCategories = editorial.treatmentCategories;
const sourceClinics = new Map(state.clinics.map((clinic) => [clinic.id, clinic]));
state.clinics = editorial.clinics.map((clinic) => ({
  ...clinic,
  images: (sourceClinics.get(clinic.id)?.images ?? []).filter((url) => url.startsWith('data:image/')),
}));

const byId = new Map(state.treatments.map((treatment) => [treatment.id, treatment]));
for (const treatment of editorial.treatments) {
  if (treatment.hidden) {
    byId.delete(treatment.id);
  } else {
    byId.set(treatment.id, { ...byId.get(treatment.id), ...treatment });
  }
}
state.treatments = Array.from(byId.values());
state.mediaSections = editorial.mediaSections;
// Uploaded local media remain in the private CMS. Public media are curated separately.
state.testimonials = editorial.testimonials;
state.siteSettings = {
  ...state.siteSettings,
  ...editorial.siteSettings,
  contactForm: { ...state.siteSettings.contactForm, ...editorial.siteSettings.contactForm },
  footer: { ...state.siteSettings.footer, ...editorial.siteSettings.footer },
};
state.customTexts = editorial.customTexts;
state.meta = { ...state.meta, editorialRevision: 'pdf-2026-09-15' };
writeFileSync(statePath, `${JSON.stringify(state)}\n`, 'utf8');
console.log(`Editor locale aggiornato: ${state.treatments.length} schede, ${state.clinics.length} sedi. Copia precedente conservata in forge-data.`);
