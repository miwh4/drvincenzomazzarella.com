import { Award, GraduationCap, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '../siteContent';

export default function Biography() {
  const { drInfo } = useSiteContent();
  const icons = [GraduationCap, Award, Users, ShieldCheck];

  return (
    <section id="biografia" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left column - Elegant Photo of doctor / clinic environment */}
        <div className="lg:col-span-5 relative order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Outline decorative border */}
            <div className="absolute inset-0 border border-brand-accent/30 -translate-x-4 -translate-y-4 rounded-none -z-10" />

            <div className="aspect-3/4 overflow-hidden rounded-none shadow-xl bg-[#f4f5f8]">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000"
                alt="Dr. Vincenzo Mazzarella consulto"
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 grayscale-[10%]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-deep/10 pointer-events-none" />
            </div>

            {/* Float sign card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl border border-brand-deep/5 rounded-none max-w-[260px] text-left">
              <span className="font-serif text-lg text-brand-accent italic block mb-2 font-semibold">
                &ldquo;Il miglior intervento è quello che si vede ma non si percepisce.&rdquo;
              </span>
              <span className="font-sans text-[10px] uppercase tracking-wider text-brand-deep/60 font-bold">
                — Filosofia del Dottore
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right column - Curriculum details */}
        <div className="lg:col-span-7 space-y-8 order-1 lg:order-2 text-left">
          
          <div className="space-y-3">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
              Profilo Professionale
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-brand-deep leading-tight uppercase font-bold">
              Il Rigore della Scienza, la Sensibilità dell&apos;Arte
            </h2>
            <div className="h-0.5 w-12 bg-brand-accent mt-4" />
          </div>

          <div className="font-sans text-xs md:text-sm text-brand-deep/80 space-y-4 font-light leading-relaxed">
            <p>
              Il <strong>Dr. Vincenzo Mazzarella</strong> è uno specialista accreditato in Chirurgia Plastica, Ricostruttiva ed Estetica. La sua formazione è avvenuta interamente sotto il segno dell&apos;eccellenza, conseguendo la laurea in Medicina e Chirurgia e successivamente il diploma di Specializzazione presso l&apos;<strong>Università degli Studi di Napoli &quot;Federico II&quot;</strong>.
            </p>
            <p>
              Il suo approccio integra la più approfondita conoscenza delle tecniche anatomiche con un innato senso della misura ed equilibrio estetico, offrendo risposte terapeutiche su misura per contrastare l&apos;invecchiamento o rimodellare le fisionomie nel pieno rispetto delle proporzioni originarie.
            </p>
          </div>

          {/* Timeline Credentials */}
          <div className="space-y-4 pt-4 border-t border-brand-deep/5">
            <h3 className="font-serif text-lg text-brand-deep font-bold mb-6">
              Formazione e Certificazioni
            </h3>
            
            <div className="space-y-6">
              {drInfo.credentials.map((cred, index) => {
                const IconComponent = icons[index % icons.length];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex space-x-4 items-start"
                  >
                    <div className="w-10 h-10 rounded-none bg-brand-deep flex items-center justify-center text-brand-accent shrink-0 border border-brand-deep/10">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-sans text-[10px] uppercase font-bold text-brand-accent bg-brand-deep px-2 py-0.5 rounded-none">
                          {cred.year}
                        </span>
                        <h4 className="font-serif text-sm md:text-base text-brand-deep font-bold">
                          {cred.title}
                        </h4>
                      </div>
                      <p className="font-sans text-xs text-brand-deep/60 font-light">
                        {cred.institution}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Doctor Signature */}
          <div className="pt-6 flex flex-col space-y-1">
            <span className="font-serif text-2xl italic text-brand-deep font-medium">
              {drInfo.name}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-widest text-brand-deep/60 font-semibold">
              Specialista Chirurgia Plastica Estetica
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
