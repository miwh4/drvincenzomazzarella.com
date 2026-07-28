import React, { useState, useEffect } from 'react';
import { BookingFormData } from '../types';
import { Calendar, Phone, Mail, CheckCircle, ShieldCheck, MapPin, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../siteContent';

interface BookingFormProps {
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
  preselectedCity?: string;
  preselectedTreatment?: string;
}

export default function BookingForm({
  isOpenAsModal = false,
  onCloseModal,
  preselectedCity = '',
  preselectedTreatment = '',
}: BookingFormProps) {
  const { siteSettings, treatmentCategories } = useSiteContent();
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    preferredClinic: 'napoli',
    preferredDate: '',
    treatmentCategory: 'seno',
    message: '',
    privacyAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    if (treatmentCategories.length > 0 && !treatmentCategories.some((category) => category.id === formData.treatmentCategory)) {
      setFormData((current) => ({ ...current, treatmentCategory: treatmentCategories[0].id }));
    }
  }, [formData.treatmentCategory, treatmentCategories]);

  // Apply preselected values when opening
  useEffect(() => {
    if (preselectedCity) {
      const cityLower = preselectedCity.toLowerCase();
      if (['napoli', 'roma', 'milano'].includes(cityLower)) {
        setFormData((prev) => ({ ...prev, preferredClinic: cityLower }));
      }
    }
    if (preselectedTreatment) {
      setFormData((prev) => ({
        ...prev,
        message: `Richiesta di consulto specifico per: ${preselectedTreatment}`,
      }));
    }
  }, [preselectedCity, preselectedTreatment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Valida dati
    if (!formData.fullName.trim()) {
      setError('Inserisci il tuo nome completo.');
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Inserisci un numero di telefono.');
      return;
    }
    if (!formData.privacyAccepted) {
      setError('È necessario accettare il trattamento dei dati personali per proseguire.');
      return;
    }

    setLoading(true);

    if (siteSettings.contactForm.submitMode === 'mailto') {
      const subject = `${siteSettings.contactForm.subjectPrefix} - ${formData.fullName}`;
      const body = [
        `Nome: ${formData.fullName}`,
        `Email: ${formData.email}`,
        `Telefono: ${formData.phone}`,
        `Sede preferita: ${formData.preferredClinic}`,
        `Data preferita: ${formData.preferredDate || 'Non indicata'}`,
        `Categoria: ${formData.treatmentCategory}`,
        '',
        formData.message || 'Nessun messaggio aggiuntivo.',
      ].join('\n');
      window.location.href = `mailto:${siteSettings.contactForm.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setLoading(false);
      setSuccess(true);
      setBookingRef(`MAIL-${Math.floor(100000 + Math.random() * 900000)}`);
      return;
    }

    // Simulate submission to CRM / Mail
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setBookingRef(`MAZ-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1500);
  };

  const handleReset = () => {
    setSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      preferredClinic: 'napoli',
      preferredDate: '',
      treatmentCategory: 'seno',
      message: '',
      privacyAccepted: false,
    });
    if (onCloseModal) onCloseModal();
  };
  const formContent = (
    <div className="w-full text-brand-deep">
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4 space-y-6"
        >
          <div className="w-20 h-20 rounded-none bg-brand-deep border border-brand-accent/20 flex items-center justify-center text-brand-accent mx-auto animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-2xl md:text-3xl font-bold text-brand-deep">
              Richiesta Ricevuta con Successo
            </h4>
            <p className="font-sans text-xs md:text-sm text-brand-deep/70 font-light max-w-md mx-auto leading-relaxed">
              {siteSettings.contactForm.successMessage}
            </p>
          </div>

          <div className="bg-[#f4f5f8] border border-brand-deep/5 p-6 rounded-none max-w-xs mx-auto text-left space-y-3 font-sans text-xs">
            <div className="flex justify-between border-b border-brand-deep/10 pb-2 text-brand-deep/50">
              <span>Codice Prenotazione:</span>
              <span className="font-mono font-bold text-brand-deep">{bookingRef}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-brand-deep/50">Paziente:</span>
              <span className="font-semibold text-brand-deep">{formData.fullName}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-brand-deep/50">Sede preferita:</span>
              <span className="font-semibold text-brand-deep uppercase">{formData.preferredClinic}</span>
            </div>
            {formData.preferredDate && (
              <div className="flex justify-between pb-1">
                <span className="text-brand-deep/50">Data Richiesta:</span>
                <span className="font-semibold text-brand-deep">{formData.preferredDate}</span>
              </div>
            )}
          </div>

          <p className="font-sans text-[11px] text-brand-deep/60 max-w-xs mx-auto">
            Un assistente della clinica selezionata ti contatterà telefonicamente entro 24 ore lavorative per confermare giorno e orario dell&apos;appuntamento.
          </p>

          <button
            onClick={handleReset}
            className="font-sans text-xs uppercase tracking-[0.18em] font-semibold text-white bg-brand-deep px-8 py-3.5 rounded-none hover:bg-brand-accent hover:text-brand-deep transition-colors cursor-pointer"
          >
            Torna al Sito
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 font-sans text-xs rounded-none text-left">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1 text-left">
              <label htmlFor="fullName" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/70">
                Nome e Cognome *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Inserisci nome e cognome"
                className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors text-brand-deep"
              />
            </div>

            {/* Email */}
            <div className="space-y-1 text-left">
              <label htmlFor="email" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/70">
                Indirizzo E-mail *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="latua@email.com"
                className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors text-brand-deep"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1 text-left">
              <label htmlFor="phone" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/70">
                Recapito Telefonico *
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+39 333 1234567"
                className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors text-brand-deep"
              />
            </div>

            {/* Sede */}
            <div className="space-y-1 text-left">
              <label htmlFor="preferredClinic" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/70">
                Sede della Visita *
              </label>
              <select
                id="preferredClinic"
                name="preferredClinic"
                value={formData.preferredClinic}
                onChange={handleChange}
                className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors text-brand-deep"
              >
                <option value="napoli">Napoli (Via dei Mille)</option>
                <option value="roma">Roma (Via Veneto)</option>
                <option value="milano">Milano (Corso Buenos Aires)</option>
              </select>
            </div>

            {/* Categoria Trattamento */}
            <div className="space-y-1 text-left">
              <label htmlFor="treatmentCategory" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/70">
                Categoria d&apos;Interesse
              </label>
              <select
                id="treatmentCategory"
                name="treatmentCategory"
                value={formData.treatmentCategory}
                onChange={handleChange}
                className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors text-brand-deep"
              >
                {treatmentCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </div>

            {/* Data preferenziale */}
            <div className="space-y-1 text-left">
              <label htmlFor="preferredDate" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/70">
                Data Indicativa Preferita
              </label>
              <input
                id="preferredDate"
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors text-brand-deep"
              />
            </div>
          </div>

          {/* Message / Details */}
          <div className="space-y-1 text-left">
            <label htmlFor="message" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/70">
              Note Aggiuntive / Messaggio
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Descrivi brevemente la tua richiesta o indica particolari esigenze..."
              className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors resize-none text-brand-deep"
            />
          </div>

          {/* GDPR Privacy agreement */}
          <div className="flex items-start space-x-3 text-left">
            <input
              id="privacyAccepted"
              type="checkbox"
              name="privacyAccepted"
              checked={formData.privacyAccepted}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded-none accent-brand-accent text-brand-accent border-stone-300 focus:ring-brand-accent"
            />
            <label htmlFor="privacyAccepted" className="font-sans text-[10px] text-brand-deep/60 leading-normal font-light">
              Acconsento al trattamento dei miei dati sensibili al solo fine di essere ricontattato in merito alla richiesta di consulto medico, ai sensi del Regolamento UE 2016/679 (GDPR). *
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2 text-left">
            <button
              type="submit"
              disabled={loading}
              className="w-full group font-sans text-xs uppercase tracking-[0.18em] font-semibold text-white bg-brand-deep py-4 hover:bg-brand-accent hover:text-brand-deep disabled:bg-stone-300 transition-all duration-300 flex items-center justify-center space-x-2 rounded-none shadow-none cursor-pointer"
            >
              {loading ? (
                <span>Elaborazione richiesta...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Invia Richiesta di Prenotazione</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  if (isOpenAsModal) {
    return (
      <AnimatePresence>
        <div
          className="fixed inset-0 bg-brand-deep/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onCloseModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white max-w-2xl w-full rounded-none shadow-2xl p-6 md:p-10 relative border border-brand-deep/10 text-brand-deep"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 text-brand-deep/60 hover:text-brand-accent transition-colors p-2 cursor-pointer"
              aria-label="Chiudi finestra"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center max-w-md mx-auto mb-8 space-y-2">
              <span className="font-sans text-[10px] uppercase tracking-widest text-brand-accent font-bold block">
                Contatto Privato
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-brand-deep font-bold">
                Richiedi una Consulenza
              </h3>
              <p className="font-sans text-xs text-brand-deep/60 font-light">
                Compila il modulo sottostante. La segreteria ti contatterà nelle prossime ore per pianificare il tuo incontro riservato con il Dr. Vincenzo Mazzarella.
              </p>
            </div>

            {formContent}
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // Otherwise, render as full, inline page section
  return (
    <section id="prenotazioni" className="py-24 bg-brand-dark text-white relative overflow-hidden">
      {/* Decorative vectors */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-deep/40 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Col - Contacts info */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <div className="space-y-3">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block animate-pulse">
              Contatto Diretto
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight font-bold">
              Inizia il tuo <br />
              <span className="font-light italic text-brand-accent">Percorso di Armonia</span>
            </h2>
            <div className="h-0.5 w-12 bg-brand-accent mt-4" />
          </div>

          <p className="font-sans text-xs md:text-sm text-stone-300 leading-relaxed font-light">
            Siamo a tua completa disposizione per rispondere a qualsiasi dubbio o per prenotare la tua prima visita conoscitiva presso gli studi di Napoli, Roma o Milano. La riservatezza e l&apos;attenzione individuale sono al centro del nostro operato fin dal primo contatto.
          </p>

          <div className="space-y-4 pt-6 border-t border-white/5 font-sans text-xs md:text-sm">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-brand-deep text-brand-accent rounded-none border border-white/5">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-light text-stone-400 uppercase tracking-widest text-[9px]">Segreteria Telefonica Unica</p>
                <p className="font-semibold text-white tracking-wide mt-0.5">+39 081 1930 4567</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-brand-deep text-brand-accent rounded-none border border-white/5">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-light text-stone-400 uppercase tracking-widest text-[9px]">E-mail Principale</p>
                <p className="font-semibold text-white tracking-wide mt-0.5">{siteSettings.contactForm.recipientEmail}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-brand-deep text-brand-accent rounded-none border border-white/5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-light text-stone-400 uppercase tracking-widest text-[9px]">Studi Medici Privati</p>
                <p className="font-semibold text-white tracking-wide mt-0.5">Napoli • Roma • Milano</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center space-x-2 text-stone-300 text-xs font-light">
            <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
            <span>Tutti i dati trasmessi sono criptati e gestiti in conformità GDPR.</span>
          </div>
        </div>

        {/* Right Col - Interactive Form Card */}
        <div className="lg:col-span-7 bg-white text-brand-deep p-8 md:p-12 shadow-2xl rounded-none border border-brand-deep/5">
          <div className="text-left mb-8 space-y-1">
            <h3 className="font-serif text-2xl text-brand-deep font-bold">
              Richiesta di Consulenza
            </h3>
            <p className="font-sans text-xs text-brand-deep/60 font-light">
              Compila tutti i campi indicati. Verrai ricontattato telefonicamente dalla nostra segreteria organizzativa.
            </p>
          </div>
          {formContent}
        </div>
      </div>
    </section>
  );
}
