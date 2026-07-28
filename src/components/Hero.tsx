import { ArrowRight, Sparkles, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '../siteContent';
import doctorPortrait from '../assets/images/regenerated_image_1782312449704.jpg';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const { drInfo, clinics } = useSiteContent();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="hero" data-forge-id="hero-section" className="relative min-h-screen flex items-center bg-brand-deep text-white pt-24 overflow-hidden">
      {/* Decorative luxury backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-dark/30 blur-3xl" />
      <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full border border-brand-accent/5" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left column - Content */}
        <div data-forge-id="hero-copy" className="lg:col-span-7 flex flex-col justify-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-brand-dark/80 border border-white/5 px-4 py-1.5 rounded-none w-fit shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-300 font-medium">
              Armonia • Naturalezza • Eccellenza Medica
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 text-left"
          >
            <h1 data-forge-path="drInfo.name" className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-[1.15] font-normal uppercase">
              {drInfo.name}
            </h1>
            <p data-forge-path="drInfo.title" className="font-sans text-sm md:text-base text-brand-accent font-semibold tracking-wider uppercase">
              {drInfo.title}
            </p>
            <p data-forge-path="drInfo.shortBio" className="font-sans text-xs md:text-sm text-stone-300 max-w-lg font-light leading-relaxed tracking-wide mt-4">
              {drInfo.shortBio}
            </p>
          </motion.div>

          {/* Quick clinical stats/highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            data-forge-id="hero-stats"
            className="grid grid-cols-3 gap-4 border-y border-white/10 py-6 max-w-lg text-stone-300"
          >
            <div className="flex flex-col items-center text-center">
              <Award className="w-5 h-5 text-brand-accent mb-1.5" />
              <span className="font-sans font-medium text-xs text-white uppercase tracking-wide">Federico II</span>
              <span className="font-sans text-[9px] text-stone-500 uppercase tracking-widest mt-1">Specialista</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-white/10">
              <ShieldCheck className="w-5 h-5 text-brand-accent mb-1.5" />
              <span className="font-sans font-medium text-xs text-white uppercase tracking-wide">SICPRE</span>
              <span className="font-sans text-[9px] text-stone-500 uppercase tracking-widest mt-1">Membro Attivo</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-serif italic text-sm text-brand-accent font-semibold">{clinics.slice(0, 2).map((clinic) => clinic.city).join(' • ')}</span>
              <span className="font-sans text-[9px] text-stone-500 uppercase tracking-widest mt-2">Sedi</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              data-forge-id="hero-primary-button"
              onClick={onOpenBooking}
              className="group font-sans text-xs uppercase tracking-[0.2em] font-bold text-brand-deep bg-white hover:bg-brand-accent hover:text-brand-deep transition-all duration-300 px-5 py-2.5 rounded-full shadow-none cursor-pointer flex items-center space-x-1"
            >
              <span>Consulenza Privata</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              data-forge-id="hero-secondary-button"
              onClick={() => scrollToSection('trattamenti')}
              className="font-sans text-xs uppercase tracking-[0.2em] font-medium text-white bg-transparent border border-white/20 hover:border-brand-accent hover:text-brand-accent transition-all duration-300 px-5 py-2.5 rounded-full text-center cursor-pointer"
            >
              Scopri i Trattamenti
            </button>
          </motion.div>
        </div>

        {/* Right column - Images */}
        <div data-forge-id="hero-media" className="lg:col-span-5 relative mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative mx-auto max-w-[380px] sm:max-w-[420px]"
          >
            {/* Elegant Background frame */}
            <div className="absolute inset-0 border border-brand-accent/20 translate-x-4 translate-y-4 rounded-none -z-10" />

            {/* Doctor portrait placeholder of high-fidelity aesthetic */}
            <div className="relative aspect-3/4 overflow-hidden shadow-2xl rounded-none bg-brand-dark">
              <img
                src={drInfo.portraitUrl || doctorPortrait}
                data-forge-image-path="drInfo.portraitUrl"
                alt="Dr. Vincenzo Mazzarella"
                className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              {/* Subtle light leak overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/85 via-transparent to-transparent pointer-events-none" />
              
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-brand-deep/95 backdrop-blur-md p-5 border border-white/10 shadow-lg rounded-none text-white">
                <span className="text-[10px] uppercase font-sans tracking-widest text-brand-accent font-bold block mb-1">
                  Chirurgo Estetico Qualificato
                </span>
                <span className="font-serif text-lg text-white font-semibold block">
                  <span data-forge-path="drInfo.name">{drInfo.name}</span>
                </span>
                <span className="text-xs text-stone-400 font-sans font-light mt-1 block">
                  Specialista Federico II, Napoli.
                </span>
              </div>
            </div>

            {/* Minimal aesthetic medical details floating bubble */}
            <div className="absolute top-10 -left-6 bg-brand-deep text-white p-4 hidden sm:flex items-center space-x-3 rounded-none shadow-xl border border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
              <div className="font-sans text-left">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-semibold">Risultati Naturali</span>
                <span className="text-xs block font-light">Chirurgia d'Alta Precisione</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 z-10 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        onClick={() => scrollToSection('filosofia')}
      >
        <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-stone-500 font-semibold">Esplora</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1.5 h-1.5 rounded-full bg-brand-accent"
        />
        <div className="w-[1px] h-10 bg-gradient-to-b from-brand-accent to-transparent" />
      </div>
    </section>
  );
}
