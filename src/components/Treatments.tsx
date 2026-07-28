import { useState, useEffect } from 'react';
import { useSiteContent } from '../siteContent';
import { Clock, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TreatmentsProps {
  onOpenTreatment: (treatmentId: string) => void;
}

export default function Treatments({ onOpenTreatment }: TreatmentsProps) {
  const { treatments, treatmentCategories } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState(treatmentCategories[0]?.id || '');

  // Listen to custom header navigation events to switch categories automatically
  useEffect(() => {
    const handleSetCategory = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveCategory(customEvent.detail);
        const element = document.getElementById('trattamenti');
        if (element) {
          const offset = 90;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('set-treatment-category', handleSetCategory);
    return () => window.removeEventListener('set-treatment-category', handleSetCategory);
  }, []);

  useEffect(() => {
    if (!treatmentCategories.some((category) => category.id === activeCategory)) {
      setActiveCategory(treatmentCategories[0]?.id || '');
    }
  }, [activeCategory, treatmentCategories]);

  const filteredTreatments = treatments.filter(t => t.category === activeCategory);
  const activeCategoryLabel = treatmentCategories.find((category) => category.id === activeCategory)?.label || activeCategory.replace(/_/g, ' ');

  return (
    <section id="trattamenti" data-forge-id="treatments-section" className="py-24 bg-brand-dark text-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
            Trattamenti d&apos;Eccellenza
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-tight">
            Chirurgia Plastica e <br />
            <span className="font-light italic text-brand-accent">Medicina Rigenerativa</span>
          </h2>
          <p className="font-sans text-xs md:text-sm text-stone-300 font-light leading-relaxed">
            Seleziona la categoria d&apos;interesse ed esplora le procedure eseguite dal Dr. Vincenzo Mazzarella, progettate per valorizzare i tuoi contorni con precisione clinica e gusto estetico.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 border-b border-white/5 pb-6 max-w-3xl mx-auto">
          {treatmentCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-3 font-sans text-xs md:text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 relative rounded-none cursor-pointer ${
                activeCategory === cat.id
                  ? 'text-white bg-brand-deep border border-white/10'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-brand-accent"
                />
              )}
            </button>
          ))}
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTreatments.map((treatment) => (
              <motion.div
                data-forge-id={`treatment-card-${treatment.id}`}
                key={treatment.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group bg-brand-deep border border-white/5 hover:border-brand-accent/50 rounded-none overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer"
                onClick={() => onOpenTreatment(treatment.id)}
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-video overflow-hidden bg-brand-dark">
                    <img
                      src={treatment.imageUrl}
                      data-forge-image-path={`treatments.${treatments.findIndex((item) => item.id === treatment.id)}.imageUrl`}
                      alt={treatment.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-deep/20 pointer-events-none" />
                    
                    {/* Category tag */}
                    <span className="absolute top-4 left-4 bg-brand-dark/95 backdrop-blur-xs text-brand-accent font-sans text-[8px] uppercase tracking-[0.18em] font-bold px-3 py-1.5 rounded-none border border-white/5">
                      {activeCategoryLabel}
                    </span>
                  </div>

                  {/* Body text */}
                  <div className="p-6 md:p-8 space-y-3">
                    <h3 data-forge-path={`treatments.${treatments.findIndex((item) => item.id === treatment.id)}.title`} className="font-serif text-xl md:text-2xl text-white font-semibold group-hover:text-brand-accent transition-colors duration-300">
                      {treatment.title}
                    </h3>
                    <p data-forge-path={`treatments.${treatments.findIndex((item) => item.id === treatment.id)}.subtitle`} className="font-sans text-xs text-brand-accent font-medium tracking-wide uppercase italic">
                      {treatment.subtitle}
                    </p>
                    <p data-forge-path={`treatments.${treatments.findIndex((item) => item.id === treatment.id)}.description`} className="font-sans text-xs md:text-sm text-stone-400 font-light leading-relaxed line-clamp-3">
                      {treatment.description}
                    </p>
                  </div>
                </div>

                {/* Footer with actions */}
                <div className="px-6 md:px-8 pb-6 pt-2 border-t border-white/5 flex justify-between items-center text-stone-500">
                  <div className="flex items-center space-x-4 text-xs font-sans font-light">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-brand-accent" />
                      <span>{treatment.duration}</span>
                    </span>
                  </div>
                  <span className="text-brand-accent text-xs font-semibold tracking-wider flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Dettagli</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

    </section>
  );
}
