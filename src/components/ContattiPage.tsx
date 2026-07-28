import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, CheckCircle, CalendarCheck2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '../siteContent';

interface ContattiPageProps {
  onOpenBooking: (cityName?: string) => void;
}

// Fallback map center (Italy) when a sede has no coordinates configured
const DEFAULT_CENTER: [number, number] = [41.9028, 12.4964];

export default function ContattiPage({ onOpenBooking }: ContattiPageProps) {
  const { clinics, siteSettings } = useSiteContent();
  const contact = siteSettings.contact;
  const [selectedId, setSelectedId] = useState<string>(clinics[0]?.id ?? '');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'informazioni',
    message: '',
    privacyAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const mapRef = useRef<any>(null);

  // Keep selection valid when sedi are added/removed from the backend
  useEffect(() => {
    if (!clinics.some((clinic) => clinic.id === selectedId)) {
      setSelectedId(clinics[0]?.id ?? '');
    }
  }, [clinics, selectedId]);

  const currentClinic = clinics.find((clinic) => clinic.id === selectedId) ?? clinics[0];
  const hasCoords = !!currentClinic && typeof currentClinic.lat === 'number' && typeof currentClinic.lng === 'number';
  const center: [number, number] = hasCoords ? [currentClinic!.lat as number, currentClinic!.lng as number] : DEFAULT_CENTER;

  const showMap = contact.showMap && clinics.length > 0;
  const showSedi = contact.showSedi && clinics.length > 0;

  // Dynamically load Leaflet for the interactive map
  useEffect(() => {
    if (!showMap) return;

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !document.getElementById('leaflet-map')) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map('leaflet-map', {
        zoomControl: true,
        scrollWheelZoom: false
      }).setView(center, 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      const goldIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="w-8 h-8 rounded-full bg-[#101428] border-2 border-[#72C3BF] flex items-center justify-center text-white shadow-lg animate-pulse">
                <span class="w-3 h-3 rounded-full bg-[#72C3BF]"></span>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker(center, { icon: goldIcon })
        .addTo(map)
        .bindPopup(`<b class="font-serif text-brand-deep">${currentClinic?.name ?? ''}</b><br/><span class="font-sans text-xs text-brand-deep/80">${currentClinic?.address ?? ''}</span>`)
        .openPopup();

      mapRef.current = map;
    };

    if ((window as any).L) {
      initMap();
    } else {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.body.appendChild(script);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, showMap]);

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

    if (!formData.fullName.trim()) {
      setError('Inserisci il tuo nome completo.');
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Inserisci un indirizzo e-mail valido.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Inserisci il tuo numero di telefono.');
      return;
    }
    if (!formData.privacyAccepted) {
      setError('Accetta l\'informativa sulla privacy per procedere.');
      return;
    }

    setLoading(true);

    // Honour the backend submit mode: real e-mail (mailto) or demo confirmation
    if (siteSettings.contactForm.submitMode === 'mailto') {
      const recipient = siteSettings.contactForm.recipientEmail || currentClinic?.email || '';
      const subject = `${siteSettings.contactForm.subjectPrefix} — ${formData.subject}`;
      const body = [
        `Nome: ${formData.fullName}`,
        `Email: ${formData.email}`,
        `Telefono: ${formData.phone}`,
        `Sede: ${currentClinic?.city ?? ''}`,
        `Motivo: ${formData.subject}`,
        '',
        formData.message,
      ].join('\n');
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setLoading(false);
      setSuccess(true);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleReset = () => {
    setSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: 'informazioni',
      message: '',
      privacyAccepted: false
    });
  };

  const leftSpan = contact.mode === 'none' ? 'lg:col-span-12' : 'lg:col-span-6';

  return (
    <div className="bg-[#f4f5f8] min-h-screen pt-32 pb-24 font-sans text-brand-deep">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
            Canali di Contatto
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-brand-deep leading-tight font-bold uppercase">
            Contatti e Sedi Private
          </h1>
          <div className="h-0.5 w-12 bg-brand-accent mx-auto mt-4" />
          <p className="font-sans text-xs md:text-sm text-brand-deep/70 font-light leading-relaxed">
            La segreteria organizzativa unica coordina gli appuntamenti per le nostre sedi. Utilizza i canali qui sotto per inviarci le tue richieste o pianificare la visita.
          </p>
        </div>

        {/* Contact info cards / Map / Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Studios and map */}
          <div className={`${leftSpan} space-y-8 text-left`}>

            {showSedi && currentClinic && (
              <>
                {/* Sede Selector tabs */}
                {clinics.length > 1 && (
                  <div
                    className="bg-white border border-stone-200 p-1.5 grid gap-2 rounded-full"
                    style={{ gridTemplateColumns: `repeat(${Math.min(clinics.length, 4)}, minmax(0, 1fr))` }}
                  >
                    {clinics.map((clinic) => (
                      <button
                        key={clinic.id}
                        onClick={() => setSelectedId(clinic.id)}
                        className={`py-2 px-3 text-[10px] md:text-xs uppercase tracking-wider font-bold transition-all rounded-full cursor-pointer ${
                          selectedId === clinic.id
                            ? 'bg-brand-deep text-white'
                            : 'text-brand-deep/60 hover:text-brand-deep hover:bg-[#f4f5f8]'
                        }`}
                      >
                        {clinic.city}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sede Details card */}
                <div className="bg-white border border-stone-200 p-6 md:p-8 space-y-6 rounded-none">
                  <div>
                    <span className="font-sans text-[9px] uppercase font-bold text-brand-accent tracking-widest block mb-1">
                      Studio Selezionato
                    </span>
                    <h2 className="font-serif text-xl md:text-2xl text-brand-deep font-bold">
                      {currentClinic.name}
                    </h2>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-stone-100 font-sans text-xs text-brand-deep/70 font-light leading-relaxed">
                    <div className="flex items-start space-x-3.5">
                      <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-brand-deep">Indirizzo Sede</p>
                        <p>{currentClinic.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <Phone className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-brand-deep">Segreteria Unica</p>
                        <a href={`tel:${currentClinic.phone.replace(/\s+/g, '')}`} className="hover:text-brand-accent transition-colors font-medium">
                          {currentClinic.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <Mail className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-brand-deep">E-mail Organizzativa</p>
                        <a href={`mailto:${currentClinic.email}`} className="hover:text-brand-accent transition-colors">
                          {currentClinic.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <Clock className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-brand-deep">Orari di Ricevimento</p>
                        <p>{currentClinic.hours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex gap-4">
                    <button
                      onClick={() => onOpenBooking(currentClinic.city)}
                      className="flex-1 py-3 bg-brand-deep hover:bg-brand-accent text-white hover:text-brand-deep font-sans text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-none cursor-pointer border border-brand-deep hover:border-brand-accent"
                    >
                      Prenota in questa Sede
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Interactive Leaflet Map Wrapper */}
            {showMap && (
              <div id="contatti-mappa" className="scroll-mt-28 border border-stone-200 p-1 bg-white rounded-none">
                <div
                  id="leaflet-map"
                  className="w-full h-80 z-10 bg-stone-100"
                  style={{ minHeight: '320px' }}
                />
              </div>
            )}

          </div>

          {/* Right Column: Contact channel (form / MioDottore / custom) */}
          {contact.mode !== 'none' && (
            <div id="contatti-form" className="scroll-mt-28 lg:col-span-6 text-left">
              {contact.mode === 'form' && (
                <div className="bg-white border border-stone-200 p-8 md:p-10 rounded-none">
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16 space-y-6"
                    >
                      <div className="w-16 h-16 rounded-none bg-stone-50 border border-brand-accent flex items-center justify-center text-brand-accent mx-auto">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl text-brand-deep font-bold">Messaggio Spedito</h3>
                        <p className="font-sans text-xs md:text-sm text-brand-deep/70 font-light leading-relaxed max-w-sm mx-auto">
                          {siteSettings.contactForm.successMessage}
                        </p>
                      </div>
                      <button
                        onClick={handleReset}
                        className="font-sans text-xs uppercase tracking-widest font-bold text-white bg-brand-deep hover:bg-brand-accent hover:text-brand-deep px-8 py-3.5 transition-all duration-300 rounded-none cursor-pointer border border-brand-deep hover:border-brand-accent"
                      >
                        Nuovo Messaggio
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="font-serif text-xl md:text-2xl text-brand-deep font-bold">Invia una Richiesta</h3>
                        <p className="font-sans text-xs text-brand-deep/50 font-light">
                          Compila il modulo sottostante per richiedere informazioni mediche generali, organizzative o per richiedere di essere ricontattato.
                        </p>
                      </div>

                      {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-sans rounded-none text-left">
                          {error}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label htmlFor="fullName" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/60">
                          Nome e Cognome *
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Esempio: Maria Rossi"
                          className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label htmlFor="email" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/60">
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
                            className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="phone" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/60">
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
                            className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="subject" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/60">
                          Motivo del Contatto
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors"
                        >
                          <option value="informazioni">Informazioni Generali</option>
                          <option value="chirurgia">Informazioni Chirurgia Plastica</option>
                          <option value="medicina">Informazioni Medicina Estetica</option>
                          <option value="prenotazione">Pianificazione Appuntamento</option>
                          <option value="collaborazione">Collaborazione Scientifica</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="message" className="block font-sans text-[10px] uppercase font-bold tracking-wider text-brand-deep/60">
                          La tua richiesta / Domanda *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Scrivi qui i dettagli del tuo messaggio..."
                          className="w-full font-sans text-xs px-4 py-3 bg-[#f4f5f8] border border-stone-200 rounded-none focus:outline-none focus:border-brand-accent focus:bg-white transition-colors resize-none"
                        />
                      </div>

                      <div className="flex items-start space-x-3 text-left">
                        <input
                          id="privacyAccepted"
                          type="checkbox"
                          name="privacyAccepted"
                          checked={formData.privacyAccepted}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 rounded-none accent-brand-accent text-brand-accent border-stone-300 focus:ring-brand-accent"
                        />
                        <label htmlFor="privacyAccepted" className="font-sans text-[10px] text-brand-deep/50 leading-normal font-light">
                          Acconsento al trattamento dei miei dati al fine esclusivo di ricevere riscontro alla mia richiesta, in conformità con la normativa sulla tutela dei dati personali GDPR (Regolamento UE 2016/679). *
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full group font-sans text-xs uppercase tracking-widest font-bold text-white bg-brand-deep hover:bg-brand-accent hover:text-brand-deep disabled:bg-stone-300 py-4 transition-all duration-300 flex items-center justify-center space-x-2 rounded-none shadow-none cursor-pointer border border-brand-deep hover:border-brand-accent"
                      >
                        {loading ? (
                          <span>Invio in corso...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Invia Messaggio Segreteria</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  <div className="mt-6 pt-6 border-t border-stone-100 flex items-center space-x-2 text-[10px] text-brand-deep/40 font-light font-sans">
                    <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
                    <span>Connessione sicura SSL. I dati sensibili trasmessi sono criptati.</span>
                  </div>
                </div>
              )}

              {contact.mode === 'miodottore' && <MioDottorePanel contact={contact} />}

              {contact.mode === 'custom' && (
                <div
                  className="contatti-custom-embed"
                  dangerouslySetInnerHTML={{ __html: contact.customHtml || '' }}
                />
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

function MioDottorePanel({ contact }: { contact: ReturnType<typeof useSiteContent>['siteSettings']['contact'] }) {
  const { integration, profileUrl, embedCode } = contact.miodottore;

  // Paste-and-go embed provided by MioDottore
  if (integration === 'embed' && embedCode.trim()) {
    return <div className="miodottore-embed" dangerouslySetInnerHTML={{ __html: embedCode }} />;
  }

  // Widget mode: branded booking card that links to the official MioDottore profile
  if (profileUrl.trim()) {
    return (
      <div className="bg-white border border-stone-200 p-8 md:p-10 rounded-none text-center space-y-6">
        <div className="w-16 h-16 rounded-none bg-stone-50 border border-brand-accent flex items-center justify-center text-brand-accent mx-auto">
          <CalendarCheck2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl md:text-2xl text-brand-deep font-bold">Prenota online su MioDottore</h3>
          <p className="font-sans text-xs md:text-sm text-brand-deep/70 font-light leading-relaxed max-w-sm mx-auto">
            Verifica in tempo reale le disponibilità e prenota la tua visita direttamente dal profilo ufficiale del Dottore su MioDottore.
          </p>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center space-x-2 font-sans text-xs uppercase tracking-widest font-bold text-white bg-brand-deep hover:bg-brand-accent hover:text-brand-deep px-8 py-4 transition-all duration-300 rounded-none cursor-pointer border border-brand-deep hover:border-brand-accent"
        >
          <span>Prenota su MioDottore</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-dashed border-stone-300 p-8 rounded-none text-center text-brand-deep/40 font-sans text-xs">
      Integrazione MioDottore non ancora configurata.
    </div>
  );
}
