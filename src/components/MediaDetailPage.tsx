import { ArrowLeft, ArrowUpRight, Calendar, Film, Newspaper, Tag } from 'lucide-react';
import type { MediaItem } from '../types';
import { useSiteContent } from '../siteContent';

interface MediaDetailPageProps {
  media: MediaItem;
  onBack: () => void;
}

// Convert common video page URLs into an embeddable form.
function toEmbedUrl(rawUrl: string): string | null {
  const url = (rawUrl || '').trim();
  if (!url) return null;
  try {
    const parsed = new URL(url, 'https://placeholder.local');
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.endsWith('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) return url;
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.endsWith('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    // Fallback: assume the URL is already directly embeddable.
    return url;
  } catch {
    return null;
  }
}

export default function MediaDetailPage({ media, onBack }: MediaDetailPageProps) {
  const { media: allMedia, mediaSections } = useSiteContent();
  const index = allMedia.findIndex((item) => item.id === media.id);
  const section = mediaSections.find((item) => item.id === media.sectionId);
  const paragraphs = (media.body || '').split('\n').map((line) => line.trim()).filter(Boolean);
  const gallery = (media.images || []).filter(Boolean);
  const embedUrl = media.kind === 'video' ? toEmbedUrl(media.videoUrl || '') : null;

  const KindIcon = media.kind === 'video' ? Film : Newspaper;
  const kindLabel = media.kind === 'video' ? 'Video' : media.kind === 'image' ? 'Galleria immagini' : 'Articolo';

  return (
    <article className="bg-[#f4f5f8] min-h-screen pt-32 pb-24 font-sans text-brand-deep">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-brand-deep/60 hover:text-brand-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Torna a Media</span>
        </button>

        {/* Header */}
        <header className="space-y-5 mb-10">
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold">
            <span className="inline-flex items-center gap-1.5 text-brand-accent">
              <KindIcon className="w-3.5 h-3.5" />
              {kindLabel}
            </span>
            {section && <span className="text-brand-deep/40">{section.title}</span>}
          </div>
          <h1 data-forge-path={index >= 0 ? `media.${index}.title` : undefined} className="font-serif text-3xl md:text-5xl tracking-tight text-brand-deep leading-tight font-bold">
            {media.title}
          </h1>
          {media.excerpt && (
            <p data-forge-path={index >= 0 ? `media.${index}.excerpt` : undefined} className="font-sans text-sm md:text-base text-brand-deep/75 font-light leading-relaxed max-w-3xl">
              {media.excerpt}
            </p>
          )}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-brand-deep/50 font-sans pt-1">
            {media.source && (
              <span className="inline-flex items-center gap-1.5 font-bold text-brand-deep">{media.source}</span>
            )}
            {media.category && (
              <span className="inline-flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-brand-accent" />{media.category}</span>
            )}
            {media.date && (
              <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-accent" />{media.date}</span>
            )}
          </div>
        </header>

        {/* Primary media block */}
        {media.kind === 'video' && (
          <div className="mb-10 space-y-4">
            {embedUrl ? (
              <div className="relative aspect-video bg-brand-deep border border-stone-200 overflow-hidden">
                <iframe
                  src={embedUrl}
                  title={media.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : media.videoFile ? (
              <video
                src={media.videoFile}
                controls
                poster={media.thumbnail || undefined}
                className="w-full aspect-video bg-brand-deep border border-stone-200 object-cover"
              />
            ) : media.thumbnail ? (
              <img src={media.thumbnail} alt={media.title} className="w-full aspect-video object-cover border border-stone-200" referrerPolicy="no-referrer" />
            ) : (
              <div className="aspect-video grid place-items-center bg-white border border-stone-200 text-brand-deep/40 text-sm">
                Nessuna sorgente video impostata
              </div>
            )}
          </div>
        )}

        {media.kind === 'image' && (
          <div className="mb-10">
            {gallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gallery.map((src, galleryIndex) => (
                  <img
                    key={`${src}-${galleryIndex}`}
                    src={src}
                    alt={`${media.title} — ${galleryIndex + 1}`}
                    className="w-full aspect-[4/3] object-cover border border-stone-200 bg-white"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            ) : media.thumbnail ? (
              <img src={media.thumbnail} alt={media.title} className="w-full object-cover border border-stone-200 bg-white" referrerPolicy="no-referrer" />
            ) : null}
          </div>
        )}

        {media.kind === 'article' && media.thumbnail && (
          <div className="mb-10">
            <img
              src={media.thumbnail}
              data-forge-image-path={index >= 0 ? `media.${index}.thumbnail` : undefined}
              alt={media.title}
              className="w-full aspect-[16/9] object-cover border border-stone-200 bg-white"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Body */}
        {paragraphs.length > 0 && (
          <div className="prose-none max-w-3xl space-y-5 bg-white border border-stone-200 p-6 md:p-10">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className="font-sans text-sm md:text-base text-brand-deep/80 font-light leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Inline gallery for articles */}
        {media.kind === 'article' && gallery.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {gallery.map((src, galleryIndex) => (
              <img
                key={`${src}-${galleryIndex}`}
                src={src}
                alt={`${media.title} — ${galleryIndex + 1}`}
                className="w-full aspect-[4/3] object-cover border border-stone-200 bg-white"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        )}

        {/* External source link */}
        {media.externalUrl && (
          <div className="mt-10">
            <a
              href={media.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-deep text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-brand-accent hover:text-brand-deep transition-colors border border-brand-deep hover:border-brand-accent"
            >
              <span>{media.kind === 'video' ? 'Guarda alla sorgente' : 'Leggi alla fonte'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        )}

        <div className="mt-10">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-white text-brand-deep text-xs font-bold uppercase tracking-[0.18em] hover:text-brand-accent transition-colors border border-stone-200"
          >
            Vedi altri contenuti
          </button>
        </div>
      </div>
    </article>
  );
}
