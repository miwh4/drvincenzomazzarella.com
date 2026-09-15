import { Download, Mail, MapPin, Phone } from 'lucide-react';
import portrait from '../assets/images/vincenzo-mazzarella-cv.jpeg';

const timeline = [
  {
    title: 'Incarichi professionali attuali',
    entries: [
      ['Novembre 2024 – oggi', 'Attività libero-professionale', 'Visite e attività clinica tra Frattamaggiore, Napoli e Milano.'],
      ['Gennaio 2025 – oggi', 'Medixa', 'Medical referee.'],
    ],
  },
  {
    title: 'Formazione e qualifiche',
    entries: [
      ['2026', 'Master universitario di II livello', 'Chirurgia funzionale, estetica e ricostruttiva della piramide nasale — Università Cattolica del Sacro Cuore, Policlinico A. Gemelli, Roma.'],
      ['2019 – 2024', 'Specializzazione in Chirurgia Plastica, Ricostruttiva ed Estetica', 'Università degli Studi della Campania Luigi Vanvitelli.'],
      ['2018', 'Laurea in Medicina e Chirurgia', 'Università degli Studi di Napoli Federico II.'],
      ['2016 – 2017', 'Programma Erasmus', 'Charles University, Pilsen.'],
    ],
  },
  {
    title: 'Formazione clinica internazionale',
    entries: [
      ['2020 – 2026', 'Corsi e training avanzati', 'Esperienze cliniche e formative presso Tirol Kliniken, Innsbruck; MyFace, Lisbona; e con il Dr. Enrico Robotti, Bergamo.'],
    ],
  },
  {
    title: 'Attività accademica e didattica',
    entries: [
      ['2023 – 2026', 'Teaching e international faculty', 'Partecipazione ad attività formative e congressuali in Europa e Asia, tra cui Praga, Atene, Bangkok, Hanoi, Jakarta e Tashkent.'],
    ],
  },
  {
    title: 'Pubblicazioni e società scientifiche',
    entries: [
      ['Pubblicazioni', 'Attività scientifica', 'Sei pubblicazioni scientifiche riportate nel curriculum aggiornato.'],
      ['Affiliazioni', 'AICPE · AICEFF · EAFPS', 'Membro delle tre società scientifiche.'],
    ],
  },
];

export default function ChiSonoPage() {
  return (
    <main className="bg-[#f4f5f8] min-h-screen pt-32 pb-24 text-brand-deep">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-5 justify-between md:items-end border-b border-stone-200 pb-8 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-brand-accent font-bold">Curriculum vitae</span>
            <h1 className="font-serif text-4xl md:text-5xl mt-2">Dr. Vincenzo Mazzarella</h1>
            <p className="text-sm text-brand-deep/70 mt-3">Specialista in Chirurgia Plastica, Ricostruttiva ed Estetica</p>
          </div>
          <a href={`${import.meta.env.BASE_URL}CV-Vincenzo-Mazzarella.pdf`} download className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-deep text-white hover:bg-brand-accent hover:text-brand-deep text-xs uppercase tracking-widest font-semibold transition-colors">
            <Download className="w-4 h-4" /> Scarica il CV professionale
          </a>
        </div>

        <div className="bg-white border border-stone-200 p-7 md:p-12">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-12 items-start border-b border-stone-100 pb-10">
            <img src={portrait} alt="Ritratto del Dr. Vincenzo Mazzarella" className="w-full max-w-[220px] aspect-[3/4] object-cover object-top border border-stone-200" />
            <div className="space-y-5">
              <h2 className="font-serif text-2xl">Profilo professionale</h2>
              <p className="text-sm leading-relaxed text-brand-deep/75">Il Dr. Vincenzo Mazzarella si è specializzato presso l’Università degli Studi della Campania Luigi Vanvitelli. Integra formazione clinica internazionale e pianificazione personalizzata, con attenzione alla sicurezza, all’armonia delle forme e a risultati naturali.</p>
              <div className="space-y-3 text-sm text-brand-deep/75">
                <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-brand-accent" /> Frattamaggiore · Napoli · Milano</p>
                <a className="flex items-center gap-3 hover:text-brand-accent" href="tel:+393500961963"><Phone className="w-4 h-4 text-brand-accent" /> +39 350 096 1963</a>
                <a className="flex items-center gap-3 hover:text-brand-accent" href="mailto:info@drvincenzomazzarella.it"><Mail className="w-4 h-4 text-brand-accent" /> info@drvincenzomazzarella.it</a>
              </div>
            </div>
          </div>
          <div className="mt-12 space-y-12">
            {timeline.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-2xl border-b border-stone-200 pb-3">{section.title}</h2>
                <div className="mt-6 ml-2 border-l border-brand-accent/40 space-y-7">
                  {section.entries.map(([date, title, description]) => (
                    <div key={`${date}-${title}`} className="relative pl-6">
                      <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-brand-accent rounded-full" />
                      <p className="text-xs uppercase tracking-wider font-bold text-brand-accent">{date}</p>
                      <h3 className="font-serif text-lg mt-1">{title}</h3>
                      <p className="text-sm leading-relaxed text-brand-deep/70 mt-1">{description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
