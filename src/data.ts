import publishedSiteContent from '../pages-content/site-content.json';
import type { Clinic, MediaItem, MediaSection, Testimonial, Treatment } from './types';

// Public defaults follow the versioned Pages snapshot. The private editor state
// can still replace these at runtime, but old placeholder claims never flash.
export const DR_INFO = publishedSiteContent.drInfo;
export const CLINICS = publishedSiteContent.clinics as unknown as Clinic[];
export const TREATMENTS = publishedSiteContent.treatments as unknown as Treatment[];
export const MEDIA_SECTIONS = publishedSiteContent.mediaSections as unknown as MediaSection[];
export const MEDIA_ITEMS = publishedSiteContent.media as MediaItem[];
export const TESTIMONIALS = publishedSiteContent.testimonials as Testimonial[];
