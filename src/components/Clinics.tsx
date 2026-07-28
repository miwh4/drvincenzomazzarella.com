import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '../siteContent';

interface ClinicsProps {
  onOpenBooking: (clinicName?: string) => void;
}

export default function Clinics({ onOpenBooking }: ClinicsProps) {
  const { clinics } = useSiteContent();
  return (
    <section id="cliniche" data-forge-id="clinics-section" className="py-24 bg-brand-deep text-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
            Presenza sul Territorio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-tight">
            I Nostri <span className="font-light italic text-brand-accent">Studi Medici</span>
          </h2>
          <p className="font-sans text-xs md:text-sm text-stone-300 font-light leading-relaxed">
            Il Dr. Vincenzo Mazzarella riceve e opera esclusivamente in studi medici privati autorizzati e cliniche d&apos;eccellenza, dotate dei più alti standard di comfort e sicurezza.
          </p>
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {clinics.map((clinic, index) => (
            <motion.div
              data-forge-id={`clinic-card-${clinic.id}`}
              key={clinic.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-brand-dark border border-white/5 rounded-none shadow-none hover:border-brand-accent/50 hover:shadow-xs transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Clinic Image */}
                <div className="relative aspect-video overflow-hidden bg-brand-deep">
                  <img
                    src={clinic.images[0]}
                    data-forge-image-path={`clinics.${index}.images.0`}
                    alt={clinic.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-deep/20 pointer-events-none" />
                  
                  {/* City Tag */}
                  <span className="absolute bottom-4 left-4 bg-brand-deep text-white font-sans text-[9px] uppercase tracking-[0.18em] font-bold px-4 py-1.5 rounded-none border border-white/5">
                    {clinic.city}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-6 md:p-8 space-y-6 text-left">
                  <div className="space-y-1">
                    <h3 data-forge-path={`clinics.${index}.name`} className="font-serif text-xl md:text-2xl text-white font-bold">
                      {clinic.name}
                    </h3>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-brand-accent font-semibold flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Struttura Certificata</span>
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5 text-stone-400 font-sans text-xs font-light">
                    {/* Address */}
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-200">Indirizzo</p>
                        <p data-forge-path={`clinics.${index}.address`}>{clinic.address}</p>
                      </div>
                    </div>

                    {/* Telephone */}
                    <div className="flex items-start space-x-3">
                      <Phone className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-200">Telefono</p>
                        <a href={`tel:${clinic.phone.replace(/\s+/g, '')}`} className="hover:text-brand-accent transition-colors">
                          {clinic.phone}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-3">
                      <Mail className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-200">E-mail</p>
                        <a href={`mailto:${clinic.email}`} className="hover:text-brand-accent transition-colors">
                          {clinic.email}
                        </a>
                      </div>
                    </div>

                    {/* Orari */}
                    <div className="flex items-start space-x-3">
                      <Clock className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-200">Orari di Ricevimento</p>
                        <p>{clinic.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Trigger in Footer */}
              <div className="px-6 md:px-8 pb-6 pt-2 border-t border-white/5 bg-brand-deep/50">
                <button
                  onClick={() => onOpenBooking(clinic.city)}
                  className="w-full group font-sans text-xs uppercase tracking-[0.18em] font-medium text-white bg-brand-deep border border-white/10 py-3.5 hover:bg-brand-accent hover:text-brand-deep hover:border-brand-accent transition-all duration-300 flex items-center justify-center space-x-2 rounded-none cursor-pointer"
                >
                  <span>Scegli Sede {clinic.city}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Standard Info note */}
        <div className="mt-12 bg-brand-dark border border-white/5 p-6 max-w-3xl mx-auto rounded-none flex items-center space-x-4">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-ping shrink-0" />
          <p className="font-sans text-xs text-stone-300 font-light leading-relaxed text-left">
            <strong>Informazione Importante:</strong> Tutti gli interventi di chirurgia maggiore vengono eseguiti esclusivamente presso cliniche di ricovero dotate di reparto di terapia intensiva o rianimazione per garantire la massima tutela dei nostri pazienti.
          </p>
        </div>

      </div>
    </section>
  );
}
