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
            I Nostri Valori Fondamentali
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
              Ogni viso ha proporzioni uniche. Rifiuto i risultati standardizzati e omologati. Il chirurgo deve comportarsi come uno scultore attento, modellando con tocchi precisi che non lasciano tracce di artificio.
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
              La medicina e la chirurgia sono scienze. Operiamo esclusivamente in cliniche autorizzate di altissimo livello, impiegando materiali certificati FDA e seguendo protocolli rigidi per il comfort e la tutela assoluta del paziente.
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
              Il percorso inizia dall&apos;ascolto. La visita conoscitiva è fondamentale per comprendere le motivazioni profonde del paziente, spiegare chiaramente i limiti della chirurgia e costruire una reciproca e salda fiducia.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
