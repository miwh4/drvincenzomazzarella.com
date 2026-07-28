import { useMemo, useState } from 'react';
import { Play, FileText, ArrowUpRight, Image as ImageIcon, Newspaper, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { MediaItem } from '../types';
import { useSiteContent } from '../siteContent';

interface MediaPageProps {
  onOpenMedia: (mediaId: string) => void;
}

const kindBadge = (kind: MediaItem['kind']) =>
  kind === 'video' ? 'Video' : kind === 'image' ? 'Galleria' : 'Articolo';

export default function MediaPage({ onOpenMedia }: MediaPageProps) {
  const { media, mediaSections } = useSiteContent();
  const [activeSection, setActiveSection] = useState<string>('all');

  const itemsBySection = useMemo(() => {
    const map = new Map<string, Array<{ item: MediaItem; index: number }>>();
    media.forEach((item, index) => {
      const list = map.get(item.sectionId) ?? [];
      list.push({ item, index });
      map.set(item.sectionId, list);
    });
    return map;
  }, [media]);

  const visibleSections = mediaSections.filter(
    (section) => activeSection === 'all' || activeSection === section.id,
  );

  return (
    <div className="bg-[#f4f5f8] min-h-screen pt-32 pb-24 font-sans text-brand-deep">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
            Media e Divulgazione Scientifica
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-brand-deep leading-tight font-bold uppercase">
            Rassegna Stampa &amp; Interviste
          </h1>
          <div className="h-0.5 w-12 bg-brand-accent mx-auto mt-4" />
          <p className="font-sans text-xs md:text-sm text-brand-deep/70 font-light leading-relaxed">
            Consulenze, apparizioni televisive, pubblicazioni e interviste del Dr. Vincenzo Mazzarella. Segui i suoi contributi informativi volti ad illustrare i dettagli e la filosofia della moderna chirurgia estetica.
          </p>
        </div>

        {/* Tab Filters (dynamic per section) */}
        {mediaSections.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12 border-b border-stone-200 pb-6 max-w-2xl mx-auto">
            {[{ id: 'all', title: 'Tutto' }, ...mediaSections].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-1.5 font-sans text-[10px] uppercase tracking-wider font-bold transition-all duration-300 rounded-full cursor-pointer border ${
                  activeSection === section.id
                    ? 'bg-brand-deep text-white border-brand-deep'
                    : 'text-brand-deep/50 hover:text-brand-deep bg-white border-stone-200'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Media Sections */}
        <div className="space-y-16">
          {visibleSections.map((section) => {
            const entries = itemsBySection.get(section.id) ?? [];
            if (entries.length === 0) return null;
            return (
              <section key={section.id} id={`media-${section.id}`} className="scroll-mt-28 space-y-8 text-left">
                <div className="space-y-2 border-b border-stone-200 pb-3">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-deep">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="font-sans text-xs md:text-sm text-brand-deep/60 font-light leading-relaxed max-w-3xl">
                      {section.subtitle}
                    </p>
                  )}
                </div>

                {section.layout === 'image-carousel' ? (
                  <div className="flex gap-6 overflow-x-auto pb-4 -mx-1 px-1 snap-x">
                    {entries.map(({ item, index }) => (
                      <ImageCard key={item.id} item={item} index={index} onOpen={() => onOpenMedia(item.id)} />
                    ))}
                  </div>
                ) : section.layout === 'video-grid' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {entries.map(({ item, index }) => (
                      <VideoCard key={item.id} item={item} index={index} onOpen={() => onOpenMedia(item.id)} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {entries.map(({ item, index }) => (
                      <ArticleCard key={item.id} item={item} index={index} onOpen={() => onOpenMedia(item.id)} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Scientific Publications Disclosure banner */}
        <div className="mt-16 bg-white border border-stone-200 p-8 max-w-4xl mx-auto rounded-none text-left space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-brand-accent" />
            <h3 className="font-serif text-lg text-brand-deep font-bold">Pubblicazioni Scientifiche Recenti</h3>
          </div>
          <p className="font-sans text-xs text-brand-deep/70 font-light leading-relaxed">
            Il Dr. Vincenzo Mazzarella è un attivo ricercatore e contributore di importanti riviste di settore. Le sue pubblicazioni coprono argomenti di rilievo come la profilassi antibiotica in chirurgia plastica, l'utilizzo di scaffold biocompatibili nella mastoplastica secondaria e l'analisi volumetrica dei filler labbra a rilascio controllato. Tutte le pubblicazioni complete sono indicizzate ed accessibili su PubMed.
          </p>
        </div>

        {/* Closing text */}
        <p className="text-xs text-brand-deep/40 font-light text-center mt-12">
          © {new Date().getFullYear()} Dr. Vincenzo Mazzarella • Specialista in Chirurgia Plastica, Ricostruttiva ed Estetica
        </p>

      </div>
    </div>
  );
}

function CardShell({ children, onOpen }: { children: React.ReactNode; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      className="group bg-white border border-stone-200 rounded-none overflow-hidden flex flex-col justify-between hover:border-brand-accent transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
    >
      {children}
    </motion.div>
  );
}

function VideoCard({ item, index, onOpen }: { item: MediaItem; index: number; onOpen: () => void }) {
  return (
    <CardShell onOpen={onOpen}>
      <div>
        <div className="relative aspect-video bg-brand-deep overflow-hidden">
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              data-forge-image-path={`media.${index}.thumbnail`}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-90"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-brand-deep/20 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-12 h-12 rounded-none bg-white/95 text-brand-deep flex items-center justify-center shadow-lg group-hover:bg-brand-accent group-hover:text-brand-deep transition-all duration-300">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </span>
          </div>
          {item.duration && (
            <span className="absolute bottom-3 right-3 bg-brand-deep/95 text-white font-mono text-[9px] px-2 py-1 rounded-none">
              {item.duration}
            </span>
          )}
        </div>

        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-sans font-bold text-brand-accent uppercase tracking-widest">
            <span data-forge-path={`media.${index}.source`}>{item.source}</span>
            <span data-forge-path={`media.${index}.date`} className="text-brand-deep/40 font-light lowercase font-sans">{item.date}</span>
          </div>
          <h3 data-forge-path={`media.${index}.title`} className="font-serif text-lg text-brand-deep font-bold leading-snug group-hover:text-brand-accent transition-colors duration-300 line-clamp-2">
            {item.title}
          </h3>
          <p data-forge-path={`media.${index}.excerpt`} className="font-sans text-xs text-brand-deep/70 font-light leading-relaxed line-clamp-3">
            {item.excerpt}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0">
        <span className="w-full font-sans text-[10px] uppercase tracking-widest font-bold py-3 border border-stone-200 group-hover:border-brand-deep group-hover:bg-[#f4f5f8] text-brand-deep/70 group-hover:text-brand-deep transition-colors flex items-center justify-center space-x-1.5 rounded-none">
          <span>Riproduci Video</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </CardShell>
  );
}

function ArticleCard({ item, index, onOpen }: { item: MediaItem; index: number; onOpen: () => void }) {
  const isExternal = item.linkMode === 'external';
  return (
    <CardShell onOpen={onOpen}>
      <div className="space-y-4 p-6 md:p-8">
        <div className="flex justify-between items-start">
          <span className="p-2.5 bg-[#f4f5f8] border border-stone-100 text-brand-accent rounded-none">
            <Newspaper className="w-5 h-5" />
          </span>
          <div className="text-right">
            {item.category && (
              <span data-forge-path={`media.${index}.category`} className="font-sans text-[8px] uppercase tracking-widest font-bold text-brand-accent bg-brand-deep px-2 py-0.5 rounded-none block">
                {item.category}
              </span>
            )}
            <span data-forge-path={`media.${index}.date`} className="text-[10px] text-brand-deep/40 font-sans block mt-1">{item.date}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 data-forge-path={`media.${index}.title`} className="font-serif text-lg text-brand-deep font-bold leading-snug group-hover:text-brand-accent transition-colors duration-300 line-clamp-2">
            {item.title}
          </h3>
          <p data-forge-path={`media.${index}.excerpt`} className="font-sans text-xs text-brand-deep/70 font-light leading-relaxed line-clamp-3">
            "{item.excerpt}"
          </p>
        </div>
      </div>

      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-6 border-t border-stone-100 mt-2 flex justify-between items-center text-xs text-brand-deep/40 font-sans">
        <span data-forge-path={`media.${index}.source`} className="font-bold text-brand-deep">{item.source}</span>
        <span className="text-brand-accent font-semibold tracking-wider flex items-center space-x-0.5 group-hover:translate-x-1 transition-transform">
          <span>{isExternal ? 'Apri Articolo' : 'Leggi Articolo'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </CardShell>
  );
}

function ImageCard({ item, index, onOpen }: { item: MediaItem; index: number; onOpen: () => void }) {
  const cover = item.thumbnail || item.images?.[0] || '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      className="group relative w-72 shrink-0 snap-start bg-white border border-stone-200 overflow-hidden hover:border-brand-accent transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
    >
      <div className="relative aspect-[4/5] bg-brand-deep overflow-hidden">
        {cover && (
          <img
            src={cover}
            data-forge-image-path={`media.${index}.thumbnail`}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-95"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand-deep/90 text-white text-[9px] uppercase tracking-widest font-bold px-2 py-1">
          <ImageIcon className="w-3 h-3" />
          <span>{kindBadge(item.kind)}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/90 to-transparent p-4">
          <h3 data-forge-path={`media.${index}.title`} className="font-serif text-white text-sm font-bold leading-snug line-clamp-2">
            {item.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
