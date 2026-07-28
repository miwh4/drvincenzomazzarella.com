import { motion } from 'motion/react';
import { GraduationCap, Award, Briefcase, FileText, CheckCircle, MapPin, Phone, Mail, Globe, Sparkles } from 'lucide-react';

export default function ChiSonoPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#f4f5f8] min-h-screen pt-32 pb-24 font-sans text-brand-deep">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Page Title & Download Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-8 mb-12">
          <div className="text-left space-y-1">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-accent font-bold block">
              Curriculum Vitae Accademico
            </span>
            <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-brand-deep font-bold">
              Dr. Vincenzo <span className="font-light italic text-brand-accent">Mazzarella</span>
            </h1>
          </div>
          <button
            onClick={handlePrint}
            className="mt-4 md:mt-0 px-6 py-3 bg-brand-deep hover:bg-brand-accent hover:text-brand-deep text-white font-sans text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 rounded-none shadow-none flex items-center space-x-2 border border-brand-deep hover:border-brand-accent cursor-pointer print:hidden"
          >
            <FileText className="w-4 h-4" />
            <span>Stampa / PDF CV</span>
          </button>
        </div>

        {/* CV Wrapper Card */}
        <div className="bg-white border border-stone-200 shadow-sm p-8 md:p-12 space-y-12 text-left relative overflow-hidden rounded-none print:shadow-none print:border-none print:p-0">
          
          {/* Decorative Corner Ribbon */}
          <div className="absolute top-0 right-0 bg-brand-deep text-white font-sans text-[8px] uppercase tracking-[0.2em] font-bold px-8 py-2 rotate-45 translate-x-8 translate-y-3 border-b border-brand-accent">
            SICPRE • AICPE
          </div>

          {/* CV Header: Profile and Quick Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-stone-100 pb-10">
            {/* Left/Avatar */}
            <div className="md:col-span-4 flex justify-center">
              <div className="w-44 h-56 bg-stone-100 border border-stone-200 relative p-1 rounded-none overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000"
                  alt="Dr. Vincenzo Mazzarella"
                  className="w-full h-full object-cover grayscale-[20%]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right/General Info */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-brand-deep font-bold tracking-tight">
                  Dr. Vincenzo Mazzarella
                </h2>
                <p className="font-sans text-xs text-brand-accent uppercase tracking-widest font-bold mt-1">
                  Specialista in Chirurgia Plastica, Ricostruttiva ed Estetica
                </p>
              </div>

              <p className="font-sans text-xs md:text-sm text-brand-deep/70 font-light leading-relaxed">
                Il Dr. Vincenzo Mazzarella vanta anni di esperienza nella chirurgia plastica ed estetica, Specializzato in interventi per valorizzare la tua bellezza.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-deep/60 font-light pt-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>Napoli • Roma • Milano</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>+39 081 1930 4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>info@drvincenzomazzarella.it</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>www.drvincenzomazzarella.it</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main CV Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Education & Experience */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Experience */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b border-stone-100 pb-2">
                  <Briefcase className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-serif text-lg md:text-xl text-brand-deep font-bold uppercase tracking-wide">
                    Esperienza Professionale
                  </h3>
                </div>

                <div className="space-y-8 pl-4 border-l border-stone-200">
                  {/* Item 1 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-accent border border-white" />
                    <span className="font-sans text-[10px] uppercase font-bold text-brand-accent">
                      2021 - Presente
                    </span>
                    <h4 className="font-serif text-base text-brand-deep font-bold">
                      Chirurgo Plastico Libero Professionista
                    </h4>
                    <p className="font-sans text-xs text-brand-deep/70 font-medium italic">
                      Attività Chirurgica e Ambulatoriale (Napoli, Roma, Milano)
                    </p>
                    <p className="font-sans text-xs text-brand-deep/60 font-light leading-relaxed pt-1">
                      Esecuzione di oltre 1.500 interventi di chirurgia estetica e ricostruttiva come primo operatore, focalizzato sulla chirurgia mammaria avanzata, rinoplastica strutturale e preservativa, rimodellamento corporeo ad alta definizione e trattamenti mini-invasivi.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-stone-300 border border-white" />
                    <span className="font-sans text-[10px] uppercase font-bold text-stone-400">
                      2018 - 2021
                    </span>
                    <h4 className="font-serif text-base text-brand-deep font-bold">
                      Fellowship e Collaborazioni Internazionali
                    </h4>
                    <p className="font-sans text-xs text-brand-deep/70 font-medium italic">
                      Centri Clinici d'Eccellenza in Europa (Barcellona, Parigi, Londra)
                    </p>
                    <p className="font-sans text-xs text-brand-deep/60 font-light leading-relaxed pt-1">
                      Esperienza di specializzazione pratica a fianco di leader internazionali del settore, perfezionando le tecniche di mastoplastica dual-plane, ringiovanimento facciale chirurgico profondo (Deep Plane Facelift) e medicina estetica rigenerativa.
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-stone-300 border border-white" />
                    <span className="font-sans text-[10px] uppercase font-bold text-stone-400">
                      2015 - 2021
                    </span>
                    <h4 className="font-serif text-base text-brand-deep font-bold">
                      Medico in Formazione Specialistica
                    </h4>
                    <p className="font-sans text-xs text-brand-deep/70 font-medium italic">
                      Scuola di Specializzazione
                    </p>
                    <p className="font-sans text-xs text-brand-deep/60 font-light leading-relaxed pt-1">
                      Attività clinica, ambulatoriale e chirurgica in chirurgia plastica ricostruttiva, oncologica (ricostruzione mammaria post-oncologica) e microchirurgia dei tessuti molli.
                    </p>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b border-stone-100 pb-2">
                  <GraduationCap className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-serif text-lg md:text-xl text-brand-deep font-bold uppercase tracking-wide">
                    Istruzione e Formazione
                  </h3>
                </div>

                <div className="space-y-8 pl-4 border-l border-stone-200">
                  {/* Ed 1 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-accent border border-white" />
                    <span className="font-sans text-[10px] uppercase font-bold text-brand-accent">
                      2021
                    </span>
                    <h4 className="font-serif text-base text-brand-deep font-bold">
                      Specializzazione in Chirurgia Plastica, Ricostruttiva ed Estetica
                    </h4>
                    <p className="font-sans text-xs text-brand-deep/70 font-medium italic">
                      Votazione: 50/50 e lode
                    </p>
                    <p className="font-sans text-xs text-brand-deep/60 font-light leading-relaxed pt-1">
                      Tesi sperimentale sulle moderne tecniche di ricostruzione mammaria con materiali protesici biologici e acellulari, pubblicata su riviste scientifiche nazionali.
                    </p>
                  </div>

                  {/* Ed 2 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-stone-300 border border-white" />
                    <span className="font-sans text-[10px] uppercase font-bold text-stone-400">
                      2014
                    </span>
                    <h4 className="font-serif text-base text-brand-deep font-bold">
                      Laurea Magistrale in Medicina e Chirurgia
                    </h4>
                    <p className="font-sans text-xs text-brand-deep/70 font-medium italic">
                      110/110 con Plauso Accademico
                    </p>
                    <p className="font-sans text-xs text-brand-deep/60 font-light leading-relaxed pt-1">
                      Dignità di stampa per la tesi in oncologia cutanea e ricostruzione microchirurgica facciale. Abilitazione all'esercizio della professione di medico chirurgo conseguita a pieni voti nella sessione immediatamente successiva.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Skills, Affiliations & Publications */}
            <div className="lg:col-span-4 space-y-10">
              
              {/* Scientific Affiliations */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-stone-100 pb-2">
                  <Award className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-serif text-md text-brand-deep font-bold uppercase tracking-wide">
                    Affiliazioni Scientifiche
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-brand-deep/70 font-light text-left">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                    <span><strong>Membro Ordinario SICPRE</strong> (Società Italiana di Chirurgia Plastica Ricostruttiva ed Estetica)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                    <span><strong>Socio Attivo AICPE</strong> (Associazione Italiana di Chirurgia Plastica Estetica)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                    <span>Iscritto all'Ordine dei Medici Chirurghi di Napoli, n° d'iscrizione: 34567</span>
                  </li>
                </ul>
              </div>

              {/* Core Surgical Competences */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-stone-100 pb-2">
                  <Sparkles className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-serif text-md text-brand-deep font-bold uppercase tracking-wide">
                    Competenze Chirurgiche
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 text-left">
                  {['Mastoplastica Additiva (Dual Plane)', 'Mastopessi con Protesi', 'Rinoplastica Preservativa', 'Blefaroplastica Mininvasiva', 'Lifting Facciale Profondo', 'Liposcultura Alta Definizione (HD)', 'Addominoplastica & Diastasi', 'Medicina Rigenerativa e Biorivitalizzazione', 'Filler Labbra Avanzato'].map((skill, index) => (
                    <span
                      key={index}
                      className="bg-[#f4f5f8] border border-stone-200 text-brand-deep text-[10px] font-sans tracking-wide px-3 py-1.5 rounded-none"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3 border-b border-stone-100 pb-2">
                  <Globe className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-serif text-md text-brand-deep font-bold uppercase tracking-wide">
                    Lingue Parlate
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-brand-deep/70 font-light">
                  <li className="flex justify-between">
                    <span>Italiano</span>
                    <span className="font-bold text-brand-deep">Madrelingua</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Inglese</span>
                    <span className="font-bold text-brand-deep">Fluente (C1)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Spagnolo</span>
                    <span className="font-bold text-brand-deep">Buona (B2)</span>
                  </li>
                </ul>
              </div>

              {/* Publications note */}
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3 border-b border-stone-100 pb-2">
                  <FileText className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-serif text-md text-brand-deep font-bold uppercase tracking-wide">
                    Congressi & Stampa
                  </h3>
                </div>
                <p className="font-sans text-[11px] text-brand-deep/60 font-light leading-relaxed">
                  Autore di oltre 15 articoli scientifici pubblicati su riviste indicizzate (PubMed / Scopus) in materia di chirurgia mammaria ed estetica del volto. Partecipa regolarmente, in qualità di relatore, ai congressi nazionali SICPRE e AICPE per presentare le sue casistiche cliniche personali.
                </p>
              </div>

            </div>

          </div>

          {/* Standard EU Declaration */}
          <div className="border-t border-stone-100 pt-6 text-[9px] text-brand-deep/40 font-sans leading-relaxed text-left">
            Consapevole delle sanzioni penali, nel caso di dichiarazioni non veritiere, di formazione o uso di atti falsi, richiamate dall’art. 76 del D.P.R. 445 del 28 dicembre 2000, dichiaro sotto la mia responsabilità che quanto riportato corrisponde a verità. Autorizzo al trattamento dei dati ai sensi del D.Lgs. 196/2003 e del GDPR (Regolamento UE 2016/679).
          </div>

        </div>

      </div>
    </div>
  );
}
