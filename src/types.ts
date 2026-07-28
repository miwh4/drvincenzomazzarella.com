export interface Treatment {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  anesthesia: string;
  duration: string;
  hospitalization: string; // e.g. "Day Hospital", "1 notte"
  recoveryTime: string; // convalescenza
  benefits: string[];
  imageUrl: string;
}

export interface Clinic {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl?: string; // standard visual placeholder of high fidelity map
  images: string[]; // gallery shown in the Studio carousel
  description?: string; // long editorial description shown on "Lo studio"
  equipment?: string[]; // technologies / medical equipment bullet list
  lat?: number; // map latitude (Contatti interactive map)
  lng?: number; // map longitude (Contatti interactive map)
}

export interface Testimonial {
  id: string;
  author: string;
  age?: number;
  treatmentName: string;
  rating: number;
  content: string;
  date: string;
}

export interface AssetLibraryItem {
  id: string;
  url: string; // data URL or remote URL
  name: string;
  kind: 'image' | 'video';
}

export interface MediaSection {
  id: string; // anchor slug used as section id, e.g. "video" -> #media-video
  title: string;
  subtitle?: string;
  layout: 'video-grid' | 'press-grid' | 'image-carousel';
}

export interface MediaItem {
  id: string;
  sectionId: string; // references MediaSection.id
  kind: 'video' | 'image' | 'article';
  title: string;
  excerpt: string;
  source?: string;
  category?: string; // badge label, e.g. "Intervista"
  date?: string;
  duration?: string; // shown on video cards
  thumbnail?: string; // card image
  linkMode: 'internal' | 'external'; // open detail page or jump to external URL
  externalUrl?: string; // external link (article/video source)
  videoUrl?: string; // embeddable URL (YouTube/Vimeo/etc.)
  videoFile?: string; // uploaded/hosted video file src
  images?: string[]; // gallery for image kind and inline article images
  body?: string; // article paragraphs, one per line
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  preferredClinic: string;
  preferredDate: string;
  treatmentCategory: string;
  message: string;
  privacyAccepted: boolean;
}
