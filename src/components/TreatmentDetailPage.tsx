import { ArrowLeft, CalendarRange, CheckCircle, Clock, Home, Scissors, Sparkles } from 'lucide-react';
import type { Treatment } from '../types';
import { useSiteContent } from '../siteContent';

interface TreatmentDetailPageProps {
  treatment: Treatment;
  onBack: () => void;
  onOpenBooking: (treatmentName?: string) => void;
}

export default function TreatmentDetailPage({ treatment, onBack, onOpenBooking }: TreatmentDetailPageProps) {
  const { treatments, treatmentCategories } = useSiteContent();
  const treatmentIndex = treatments.findIndex((item) => item.id === treatment.id);
  const categoryLabel = treatmentCategories.find((category) => category.id === treatment.category)?.label || treatment.category.replace(/_/g, ' ');

  return (
    <article className="bg-[#f4f5f8] min-h-screen pt-32 pb-24 font-sans text-brand-deep">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-brand-deep/60 hover:text-brand-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Torna ai trattamenti</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-5">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
                {categoryLabel}
              </span>
              <h1 data-forge-path={`treatments.${treatmentIndex}.title`} className="font-serif text-4xl md:text-6xl tracking-tight text-brand-deep leading-tight font-bold">
                {treatment.title}
              </h1>
              <p data-forge-path={`treatments.${treatmentIndex}.subtitle`} className="font-sans text-sm md:text-base text-brand-accent font-semibold uppercase tracking-wider">
                {treatment.subtitle}
              </p>
              <p data-forge-path={`treatments.${treatmentIndex}.${treatment.fullDescription ? 'fullDescription' : 'description'}`} className="font-sans text-sm md:text-base text-brand-deep/75 font-light leading-relaxed max-w-2xl">
                {treatment.fullDescription || treatment.description}
              </p>
            </div>

            {!treatment.isTechnology && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-stone-200 p-5 md:p-6">
              {[
                { icon: Scissors, label: 'Anestesia', value: treatment.anesthesia },
                { icon: Clock, label: 'Durata', value: treatment.duration },
                { icon: Home, label: 'Degenza', value: treatment.hospitalization },
                { icon: CalendarRange, label: 'Ripresa delle attività', value: treatment.recoveryTime },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="space-y-2">
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-deep/50 font-bold">
                      <Icon className="w-3.5 h-3.5 text-brand-accent" />
                      <span>{item.label}</span>
                    </span>
                    <p className="text-xs font-semibold text-brand-deep leading-snug">{item.value}</p>
                  </div>
                );
              })}
            </div>}

            {!treatment.isTechnology && ['seno', 'viso', 'corpo'].includes(treatment.category) && (
              <p className="text-xs text-brand-deep/60 italic">Tempi e modalità possono variare in base al caso clinico e alla procedura eseguita.</p>
            )}

            {treatment.detailSections?.map((section) => (
              <section key={section.heading} className="border-t border-stone-200 pt-6 space-y-3">
                <h2 className="font-serif text-xl md:text-2xl font-bold">{section.heading}</h2>
                <p className="text-sm md:text-base text-brand-deep/75 leading-relaxed whitespace-pre-line">{section.body}</p>
              </section>
            ))}

            {treatment.benefits.length > 0 && <section className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-deep">
                Benefici principali
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {treatment.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-brand-deep/80 font-light leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenBooking(treatment.title)}
                className="px-6 py-3 bg-brand-deep text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-brand-accent hover:text-brand-deep transition-colors border border-brand-deep hover:border-brand-accent"
              >
                Prenota una visita
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 bg-white text-brand-deep text-xs font-bold uppercase tracking-[0.18em] hover:text-brand-accent transition-colors border border-stone-200"
              >
                Vedi altri trattamenti
              </button>
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-200 border border-stone-200">
              {treatment.imageUrl ? <>
              <img
                src={treatment.imageUrl}
                data-forge-id={`treatment-detail-image-${treatment.id}`}
                data-forge-image-path={`treatments.${treatmentIndex}.imageUrl`}
                alt={treatment.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              </> : <div className="w-full h-full flex items-center justify-center p-10 bg-brand-deep text-white text-center"><span className="font-serif text-3xl">{treatment.title}</span></div>}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/90 to-transparent p-6 text-white">
                <div className="flex items-center gap-2 text-xs text-stone-200">
                  <Sparkles className="w-4 h-4 text-brand-accent" />
                  <span>Pagina trattamento dedicata</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
