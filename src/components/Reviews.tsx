import React, { useEffect, useState } from 'react';
import { Testimonial } from '../types';
import { Star, ChevronLeft, ChevronRight, MessageSquare, Quote, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../siteContent';

export default function Reviews() {
  const { testimonials } = useSiteContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<Testimonial[]>(testimonials);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [author, setAuthor] = useState('');
  const [age, setAge] = useState('');
  const [treatmentName, setTreatmentName] = useState('Mastoplastica Additiva');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    setReviews(testimonials);
    setCurrentIndex(0);
  }, [testimonials]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (reviews.length === 0) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;

    const newReview: Testimonial = {
      id: `custom-test-${Date.now()}`,
      author,
      age: age ? parseInt(age) : undefined,
      treatmentName,
      rating,
      content,
      date: 'Oggi'
    };

    setReviews([newReview, ...reviews]);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsFormOpen(false);
      // Reset form fields
      setAuthor('');
      setAge('');
      setContent('');
      setRating(5);
      setCurrentIndex(0); // View the new review first!
    }, 2000);
  };

  return (
    <section id="recensioni" className="py-24 bg-white relative overflow-hidden text-brand-deep">
      <div className="max-w-5xl mx-auto px-6 text-center">
        
        {/* Title */}
        <div className="max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
            Storie di Rinascita
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-brand-deep leading-tight font-bold">
            Le Opinioni dei <span className="font-light italic text-brand-accent">Nostri Pazienti</span>
          </h2>
          <div className="h-0.5 w-12 bg-brand-accent mx-auto mt-4" />
        </div>

        {/* Testimonial Active Display with smooth animations */}
        <div className="relative max-w-4xl mx-auto bg-[#f4f5f8] border border-brand-deep/5 p-8 md:p-16 rounded-none shadow-none min-h-[350px] flex flex-col justify-between">
          
          {/* Quote element decoration */}
          <div className="absolute top-6 left-6 text-brand-deep/5 pointer-events-none">
            <Quote className="w-16 h-16 rotate-180 text-brand-accent/20" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-left relative z-10"
            >
              {/* Stars */}
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-4 h-4 ${
                      idx < reviews[currentIndex].rating
                        ? 'text-brand-accent fill-brand-accent'
                        : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>

              {/* Review Content */}
              <p className="font-serif text-lg md:text-xl text-brand-deep/90 leading-relaxed font-light italic">
                &ldquo;{reviews[currentIndex].content}&rdquo;
              </p>

              {/* Reviewer bio and info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-brand-deep/10 pt-4 mt-6 gap-4">
                <div>
                  <p className="font-serif text-base text-brand-deep font-bold">
                    {reviews[currentIndex].author}
                    {reviews[currentIndex].age && <span className="font-sans text-xs text-brand-deep/60 font-light">, {reviews[currentIndex].age} anni</span>}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-brand-accent font-semibold mt-0.5">
                    Trattamento: {reviews[currentIndex].treatmentName}
                  </p>
                </div>
                <span className="font-sans text-[10px] text-brand-deep/60 font-light">
                  {reviews[currentIndex].date}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider controls */}
          <div className="flex justify-between items-center mt-10 border-t border-brand-deep/5 pt-6">
            <button
              onClick={prevReview}
              className="p-3 bg-white border border-stone-200 rounded-full hover:text-brand-accent hover:border-brand-accent transition-colors cursor-pointer text-brand-deep"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Slide dots */}
            <div className="flex space-x-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-brand-accent w-6' : 'bg-stone-200'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="p-3 bg-white border border-stone-200 rounded-full hover:text-brand-accent hover:border-brand-accent transition-colors cursor-pointer text-brand-deep"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Review Action Trigger */}
        <div className="mt-12">
          <button
            onClick={() => setIsFormOpen(true)}
            className="font-sans text-xs uppercase tracking-[0.18em] font-semibold text-brand-deep bg-white border border-brand-deep hover:bg-brand-deep hover:text-white transition-all duration-300 px-8 py-4.5 rounded-none shadow-none inline-flex items-center space-x-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-brand-accent" />
            <span>Condividi la tua Esperienza</span>
          </button>
        </div>

      </div>

      {/* Leave review modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-deep/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto text-brand-deep"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white max-w-lg w-full rounded-none shadow-2xl p-6 md:p-10 relative border border-brand-deep/10 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 text-brand-deep/60 hover:text-brand-accent transition-colors p-1"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2 mb-8">
                <span className="font-sans text-[10px] uppercase tracking-widest text-brand-accent font-bold block">
                  Scrivi una Recensione
                </span>
                <h3 className="font-serif text-2xl text-brand-deep font-bold">
                  Raccontaci il tuo percorso
                </h3>
                <p className="font-sans text-xs text-brand-deep/60 font-light">
                  La tua opinione è preziosa per aiutarci a mantenere i più alti standard e per guidare altri pazienti nella scelta corretta.
                </p>
              </div>

              {success ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-brand-deep">Grazie per il tuo feedback!</h4>
                  <p className="font-sans text-xs text-brand-deep/60 max-w-xs leading-relaxed">
                    La tua recensione è stata registrata con successo e inserita tra le testimonianze del Dr. Vincenzo Mazzarella.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/80">
                        Nome o Iniziali *
                      </label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Es. Elena R."
                        className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                    {/* Age */}
                    <div className="space-y-1">
                      <label className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/80">
                        Età (Opzionale)
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Es. 34"
                        className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                  </div>

                  {/* Treatment Selector */}
                  <div className="space-y-1">
                    <label className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/80">
                      Trattamento Ricevuto
                    </label>
                    <select
                      value={treatmentName}
                      onChange={(e) => setTreatmentName(e.target.value)}
                      className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent transition-colors"
                    >
                      <option value="Mastoplastica Additiva">Mastoplastica Additiva</option>
                      <option value="Rinoplastica">Rinoplastica</option>
                      <option value="Mastopessi">Mastopessi</option>
                      <option value="Blefaroplastica">Blefaroplastica</option>
                      <option value="Lifting del Viso">Lifting del Viso</option>
                      <option value="Liposuzione &amp; Liposcultura">Liposuzione &amp; Liposcultura</option>
                      <option value="Addominoplastica">Addominoplastica</option>
                      <option value="Filler Acido Ialuronico">Filler Acido Ialuronico</option>
                      <option value="Tossina Botulinica">Tossina Botulinica</option>
                    </select>
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/80">
                      Valutazione
                    </label>
                    <div className="flex space-x-2 py-2">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          className="text-[#f4f5f8] hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              starVal <= rating
                                ? 'text-brand-accent fill-brand-accent'
                                : 'text-stone-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content review */}
                  <div className="space-y-1">
                    <label className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/80">
                      La tua Testimonianza *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Descrivi la tua esperienza con il Dr. Vincenzo Mazzarella, la professionalità dello staff e il risultato ottenuto..."
                      className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent transition-colors resize-none"
                    />
                  </div>

                  {/* Action submit */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full font-sans text-xs uppercase tracking-[0.18em] font-semibold text-white bg-brand-deep py-3.5 rounded-none hover:bg-brand-accent hover:text-brand-deep transition-colors cursor-pointer"
                    >
                      Invia Recensione
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
