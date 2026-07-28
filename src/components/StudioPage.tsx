import { useCallback, useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Clock, Shield, Sparkles, Building2, Eye, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../siteContent';
import type { Clinic } from '../types';

export default function StudioPage() {
  const { clinics } = useSiteContent();
  const [selectedId, setSelectedId] = useState<string>(clinics[0]?.id ?? '');

  // Keep the selection valid if clinics change (add/remove from backend)
  useEffect(() => {
    if (!clinics.some((clinic) => clinic.id === selectedId)) {
      setSelectedId(clinics[0]?.id ?? '');
    }
  }, [clinics, selectedId]);

  const currentClinic = clinics.find((clinic) => clinic.id === selectedId) ?? clinics[0];

  if (!currentClinic) {
    return (
      <div className="bg-[#f4f5f8] min-h-screen pt-32 pb-24 font-sans text-brand-deep">
        <div className="max-w-3xl mx-auto px-6 text-center text-brand-deep/60">
          <Building2 className="w-10 h-10 text-brand-accent mx-auto mb-4" />
          <p className="font-sans text-sm">Nessuna sede configurata. Aggiungi una sede dal pannello di gestione.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f5f8] min-h-screen pt-32 pb-24 font-sans text-brand-deep">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
            Ambienti Esclusivi
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-brand-deep leading-tight font-bold uppercase">
            Gli Studi Medici del Dottore
          </h1>
          <div className="h-0.5 w-12 bg-brand-accent mx-auto mt-4" />
          <p className="font-sans text-xs md:text-sm text-brand-deep/70 font-light leading-relaxed">
            Esplora le nostre sedi private. Ogni studio è concepito per offrire un'esperienza d'eccellenza, coniugando comfort, eleganza architettonica e rigore clinico-sanitario.
          </p>
        </div>

        {/* City Selector Buttons */}
        <div id="studio-sedi" className="scroll-mt-28 flex flex-wrap justify-center gap-3 md:gap-4 mb-12 max-w-xl mx-auto border-b border-stone-200 pb-6">
          {clinics.map((clinic) => (
            <button
              key={clinic.id}
              onClick={() => setSelectedId(clinic.id)}
              className={`px-4 py-1.5 font-sans text-xs uppercase tracking-[0.15em] font-bold transition-all duration-300 relative rounded-full cursor-pointer flex items-center space-x-1.5 border ${
                selectedId === clinic.id
                  ? 'text-brand-deep bg-white border-stone-300'
                  : 'text-brand-deep/50 hover:text-brand-deep bg-transparent border-transparent'
              }`}
            >
              <Building2 className="w-4 h-4 text-brand-accent" />
              <span>{clinic.city}</span>
              {selectedId === clinic.id && (
                <motion.div
                  layoutId="studioActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent"
                />
              )}
            </button>
          ))}
        </div>

        {/* Studio Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Image Carousel */}
          <div className="lg:col-span-7 space-y-4">
            <StudioCarousel clinic={currentClinic} />
          </div>

          {/* Right Column: Studio Descriptions and Clinical Details */}
          <div className="lg:col-span-5 text-left space-y-8">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl md:text-3xl text-brand-deep font-bold leading-tight">
                {currentClinic.name}
              </h2>
              <div className="flex items-center space-x-1 text-brand-accent font-sans text-[10px] uppercase tracking-wider font-bold">
                <Shield className="w-4 h-4 text-brand-accent" />
                <span>Struttura Sanitaria Autorizzata</span>
              </div>
              <div className="h-0.5 w-12 bg-brand-accent mt-2" />
            </div>

            {currentClinic.description && (
              <p className="font-sans text-xs md:text-sm text-brand-deep/70 font-light leading-relaxed">
                {currentClinic.description}
              </p>
            )}

            {/* Equipment checklist */}
            {currentClinic.equipment && currentClinic.equipment.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-stone-200">
                <h3 className="font-serif text-sm font-bold text-brand-deep uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-brand-accent" />
                  <span>Tecnologie & Dotazioni Mediche</span>
                </h3>
                <ul className="grid grid-cols-1 gap-2.5">
                  {currentClinic.equipment.map((eq, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-brand-deep/80 font-sans text-xs font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-2" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Contact & Details */}
            <div className="bg-[#f4f5f8] border border-stone-200 p-6 space-y-4 rounded-none font-sans text-xs text-brand-deep/60 font-light">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-brand-deep">Ubicazione</p>
                  <p>{currentClinic.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-brand-deep">Recapito Sede</p>
                  <p>{currentClinic.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-brand-deep">Orari Segreteria</p>
                  <p>{currentClinic.hours}</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

const AUTOPLAY_MS = 5000;

function StudioCarousel({ clinic }: { clinic: Clinic }) {
  const images = clinic.images ?? [];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Reset when the clinic (or its gallery) changes
  useEffect(() => {
    setActive(0);
  }, [clinic.id, images.length]);

  const goTo = useCallback(
    (idx: number) => {
      if (images.length === 0) return;
      setActive((idx + images.length) % images.length);
    },
    [images.length],
  );

  const next = useCallback(() => goTo(active + 1), [goTo, active]);
  const prev = useCallback(() => goTo(active - 1), [goTo, active]);

  // Autoplay (paused on hover / when a single image)
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, images.length]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-3/2 bg-stone-100 border border-stone-200 rounded-none flex flex-col items-center justify-center text-brand-deep/40 space-y-2">
        <ImageOff className="w-8 h-8" />
        <span className="font-sans text-[10px] uppercase tracking-widest font-bold">Nessuna immagine per questa sede</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-3/2 bg-stone-100 border border-stone-200 overflow-hidden group rounded-none shadow-sm"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 40) { if (delta < 0) next(); else prev(); }
          touchStartX.current = null;
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={`${clinic.id}-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={images[active]}
            alt={clinic.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        <div className="absolute top-4 left-4 bg-brand-deep text-white font-sans text-[8px] uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-none border-b border-brand-accent flex items-center space-x-1">
          <Eye className="w-3.5 h-3.5 text-brand-accent" />
          <span>Foto {active + 1} di {images.length}</span>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Immagine precedente"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-brand-accent text-brand-deep flex items-center justify-center rounded-none border border-stone-200 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Immagine successiva"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-brand-accent text-brand-deep flex items-center justify-center rounded-none border border-stone-200 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Vai alla foto ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    active === idx ? 'w-5 bg-brand-accent' : 'w-1.5 bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail selector */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`aspect-3/2 bg-stone-100 border transition-all duration-300 overflow-hidden relative rounded-none cursor-pointer ${
                active === idx
                  ? 'border-brand-accent ring-1 ring-brand-accent/50 scale-[0.98]'
                  : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
