import { Quote, Heart, HelpCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function Philosophy() {
  return (
    <section id="filosofia" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#f4f5f8] -z-10" />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        
        {/* Clean Clinical Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-12"
        >
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
            La Nostra Visione
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-brand-deep uppercase font-bold">
            I valori che guidano ogni percorso
          </h2>
          <div className="h-0.5 w-12 bg-brand-accent mx-auto mt-4" />
        </motion.div>

        {/* Three pillars of philosophy cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-left">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#f4f5f8] border border-brand-deep/5 p-8 rounded-none transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-none bg-brand-deep text-white flex items-center justify-center mb-6">
              <Heart className="w-5 h-5 text-brand-accent" />
            </div>
            <h3 className="font-serif text-xl text-brand-deep font-semibold mb-3">Risultato Naturale</h3>
            <p className="font-sans text-xs md:text-sm text-brand-deep/80 leading-relaxed font-light">
              Ogni paziente ha proporzioni e caratteristiche uniche. Il progetto terapeutico ricerca armonia e naturalezza, senza proporre risultati standardizzati.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#f4f5f8] border border-brand-deep/5 p-8 rounded-none transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-none bg-brand-deep text-white flex items-center justify-center mb-6">
              <ShieldAlert className="w-5 h-5 text-brand-accent" />
            </div>
            <h3 className="font-serif text-xl text-brand-deep font-semibold mb-3">Sicurezza &amp; Rigore</h3>
            <p className="font-sans text-xs md:text-sm text-brand-deep/80 leading-relaxed font-light">
              La valutazione clinica, la scelta delle indicazioni e la pianificazione dell&apos;intervento mettono al centro la sicurezza del paziente in ogni fase del percorso.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#f4f5f8] border border-brand-deep/5 p-8 rounded-none transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-none bg-brand-deep text-white flex items-center justify-center mb-6">
              <HelpCircle className="w-5 h-5 text-brand-accent" />
            </div>
            <h3 className="font-serif text-xl text-brand-deep font-semibold mb-3">Ascolto ed Empatia</h3>
            <p className="font-sans text-xs md:text-sm text-brand-deep/80 leading-relaxed font-light">
              Il percorso inizia dall&apos;ascolto. La visita permette di comprendere esigenze e aspettative, discutere possibilità e limiti e definire un piano personalizzato.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
