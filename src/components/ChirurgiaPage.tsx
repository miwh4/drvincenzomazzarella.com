import { Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '../siteContent';

interface ChirurgiaPageProps {
  onOpenTreatment: (treatmentId: string) => void;
}

export default function ChirurgiaPage({ onOpenTreatment }: ChirurgiaPageProps) {
  const { treatments, treatmentCategories } = useSiteContent();

  const sections = treatmentCategories
    .filter((category) => category.page === 'chirurgia')
    .map((category) => ({
      id: category.id,
      title: category.label,
      items: treatments.filter(t => t.category === category.id),
    }));

  return (
    <div className="bg-[#f4f5f8] min-h-screen pt-32 pb-24 font-sans text-brand-deep">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
            Specializzazione Chirurgica
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-brand-deep leading-tight font-bold uppercase">
            Chirurgia Plastica Ricostruttiva ed Estetica
          </h1>
          <div className="h-0.5 w-12 bg-brand-accent mx-auto mt-4" />
          <p className="font-sans text-xs md:text-sm text-brand-deep/70 font-light leading-relaxed">
            Ogni procedura è concepita per ripristinare e valorizzare l'equilibrio delle forme corporee, garantendo la massima aderenza a standard clinici internazionali di sicurezza e un design estetico d'avanguardia su misura.
          </p>
        </div>

        {/* Categories loop */}
        <div className="space-y-20">
          {sections.map((section, idx) => (
            <div id={section.id} key={section.id} className="scroll-mt-28 space-y-8">
              {/* Category Subheader */}
              <div className="flex items-center space-x-4 border-b border-stone-200 pb-4">
                <span className="font-serif text-2xl md:text-3xl font-bold text-brand-deep">
                  {section.title}
                </span>
                <div className="flex-1 h-px bg-stone-200" />
                <span className="font-sans text-[10px] uppercase font-bold text-brand-accent tracking-wider bg-brand-deep px-3 py-1 border border-brand-accent/20">
                  {section.items.length} Procedure
                </span>
              </div>

              {/* Treatments list within category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.items.map((treatment) => (
                  <motion.div
                    key={treatment.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group bg-white border border-stone-200 hover:border-brand-accent rounded-none overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-none hover:shadow-xs"
                    onClick={() => onOpenTreatment(treatment.id)}
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden bg-stone-100">
                        <img
                          src={treatment.imageUrl}
                          data-forge-image-path={`treatments.${treatments.findIndex((item) => item.id === treatment.id)}.imageUrl`}
                          alt={treatment.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-brand-deep/10 pointer-events-none" />
                      </div>

                      {/* Content */}
                      <div className="p-5 text-left space-y-2">
                        <h3 data-forge-path={`treatments.${treatments.findIndex((item) => item.id === treatment.id)}.title`} className="font-serif text-lg md:text-xl text-brand-deep font-bold group-hover:text-brand-accent transition-colors duration-300">
                          {treatment.title}
                        </h3>
                        <p data-forge-path={`treatments.${treatments.findIndex((item) => item.id === treatment.id)}.subtitle`} className="font-sans text-[10px] text-brand-accent font-bold uppercase tracking-wider">
                          {treatment.subtitle}
                        </p>
                        <p data-forge-path={`treatments.${treatments.findIndex((item) => item.id === treatment.id)}.description`} className="font-sans text-xs text-brand-deep/70 font-light leading-relaxed line-clamp-3">
                          {treatment.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-5 pt-2 border-t border-stone-50 flex justify-between items-center text-brand-deep/50">
                      <span className="flex items-center space-x-1 text-[11px] font-sans font-light">
                        <Clock className="w-3.5 h-3.5 text-brand-accent" />
                        <span>{treatment.duration}</span>
                      </span>
                      <span className="text-brand-accent text-[11px] font-semibold tracking-wider flex items-center space-x-0.5 group-hover:translate-x-1 transition-transform">
                        <span>Consulta</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
