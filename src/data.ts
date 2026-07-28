import { Treatment, Clinic, Testimonial, MediaSection, MediaItem } from './types';

export const DR_INFO = {
  name: 'Dr. Vincenzo Mazzarella',
  title: 'Specialista in Chirurgia Plastica, Ricostruttiva ed Estetica',
  shortBio: 'Il Dr. Vincenzo Mazzarella vanta anni di esperienza nella chirurgia plastica ed estetica, specializzato in interventi per valorizzare la tua bellezza.',
  philosophy: 'La bellezza non è omologazione, ma armonia. Ogni intervento è una creazione su misura che rispetta l\'identità della persona, restituendo una naturale freschezza senza mai alterare i tratti originari.',
  credentials: [
    {
      year: 'Laurea',
      title: 'Laurea in Medicina e Chirurgia',
      institution: 'Università degli Studi di Napoli "Federico II" - Massimi voti e plauso della commissione'
    },
    {
      year: 'Specializzazione',
      title: 'Specializzazione in Chirurgia Plastica, Ricostruttiva ed Estetica',
      institution: 'Università degli Studi di Napoli "Federico II" - Votazione 50/50'
    },
    {
      year: 'Esperienza',
      title: 'Formazione e Fellowship Internazionali',
      institution: 'Corsi teorico-pratici di altissimo profilo in Europa e collaborazioni con primari centri di chirurgia estetica'
    },
    {
      year: 'Società Scientifiche',
      title: 'Membro Attivo AICPE e SICPRE',
      institution: 'Partecipazione costante come relatore ai più prestigiosi congressi nazionali e internazionali di chirurgia estetica'
    }
  ]
};

export const CLINICS: Clinic[] = [
  {
    id: 'napoli',
    city: 'Napoli',
    name: 'Studio Medico Napoli — Via dei Mille',
    address: 'Via dei Mille, 16 - 80121 Napoli (NA)',
    phone: '+39 081 1930 4567',
    email: 'napoli@drvincenzomazzarella.it',
    hours: 'Lun - Ven: 10:00 - 19:00 (Su appuntamento)',
    lat: 40.8358,
    lng: 14.2405,
    description: "Situato nel prestigioso quartiere Chiaia, lo studio di Napoli rappresenta la sede storica del Dottore. Ambienti raffinati arredati con sobria eleganza accolgono i pazienti garantendo la massima riservatezza. Dispone di due sale di consulto private, una sala trattamenti per la medicina estetica con apparecchiature laser di ultima generazione e una confortevole area lounge.",
    equipment: [
      'Laser CO2 Frazionato per Skin Resurfacing',
      'Dispositivi a Radiofrequenza Medicale',
      'Sistemi di Simulazione 3D pre-operatoria Crisalix',
      'Sorgenti Luce Fredda per fotoringiovanimento'
    ],
    images: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 'roma',
    city: 'Roma',
    name: 'Studio Medico Roma — Via Vittorio Veneto',
    address: 'Via Vittorio Veneto, 108 - 00187 Roma (RM)',
    phone: '+39 06 4890 1234',
    email: 'roma@drvincenzomazzarella.it',
    hours: 'Martedì e Giovedì: 14:00 - 20:00 (Su appuntamento)',
    lat: 41.9069,
    lng: 12.4897,
    description: "Nel cuore della Dolce Vita romana, a pochi passi da Villa Borghese, la clinica di Roma offre uno spazio di assoluta esclusività. Il design contemporaneo si fonde con tecnologie chirurgiche ambulatoriali d'avanguardia. Uno staff di infermieri dedicati assicura la perfetta assistenza prima e dopo ogni trattamento di medicina e chirurgia estetica.",
    equipment: [
      'Piattaforma di Criolipolisi Medicale avanzata',
      'Ultrasuoni Microfocalizzati (HIFU) per lifting non chirurgico',
      'Laser Nd:Yag per lesioni vascolari facciali',
      'Ambienti sterili certificati ISO classe 5'
    ],
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 'milano',
    city: 'Milano',
    name: 'Studio Medico Milano — Corso Buenos Aires',
    address: 'Corso Buenos Aires, 45 - 20124 Milano (MI)',
    phone: '+39 02 2951 7890',
    email: 'milano@drvincenzomazzarella.it',
    hours: 'Su appuntamento mensile',
    lat: 45.4802,
    lng: 9.2115,
    description: "Nel distretto milanese dello shopping e dell'innovazione, la sede di Milano si caratterizza per una spiccata impronta high-tech e minimalista. Progettata per soddisfare i ritmi frenetici della metropoli, offre sedute di consulto e trattamenti ambulatoriali d'eccellenza, coordinando i successivi interventi di chirurgia con rinomate cliniche di degenza private del capoluogo lombardo.",
    equipment: [
      'Sistemi di biorivitalizzazione transdermica senza aghi',
      'Laser Q-Switched per rimozione macchie e tatuaggi',
      'Dispositivi LED per stimolazione del microcircolo del cuoio capelluto',
      'Videodermatoscopio digitale ad altissima risoluzione'
    ],
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000'
    ]
  }
];

export const TREATMENTS: Treatment[] = [
  // --- SENO ---
  {
    id: 'mastoplastica-additiva',
    category: 'seno',
    title: 'Mastoplastica Additiva',
    subtitle: 'Aumento del volume del seno',
    description: 'Intervento mirato ad aumentare il volume del seno e migliorarne la forma mediante l\'inserimento di protesi di altissima qualità, con risultati estremamente naturali.',
    fullDescription: 'La mastoplastica additiva è uno degli interventi più richiesti. Il Dr. Vincenzo Mazzarella utilizza protesi di ultima generazione certificate FDA e CE, applicando tecniche mininvasive personalizzate (sottomuscolare, dual-plane o retroghiandolare) per garantire la massima naturalezza al tatto e alla vista, con tempi di recupero rapidi.',
    anesthesia: 'Generale o Sedazione Profonda',
    duration: '60 - 90 minuti',
    hospitalization: 'Day Hospital o 1 notte',
    recoveryTime: '7 - 10 giorni',
    benefits: [
      'Aumento personalizzato del volume del decolleté',
      'Correzione di asimmetrie mammarie',
      'Protesi certificate di ultima generazione',
      'Risultato naturale in armonia con le proporzioni del corpo'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mastopessi',
    category: 'seno',
    title: 'Mastopessi',
    subtitle: 'Lifting del seno svuotato o cadente',
    description: 'Il lifting del seno riposiziona e rimodella la mammella che ha perso tono in seguito a gravidanze, allattamento o cali ponderali, donando un aspetto sodo e giovanile.',
    fullDescription: 'Chiamata anche lifting del seno, la mastopessi solleva il seno cadente (ptosico), riposizionando l\'areola e rimodellando la ghiandola. Può essere eseguita da sola o in combinazione con protesi se si desidera ripristinare il volume perduto, lasciando cicatrici minime e sapientemente nascoste.',
    anesthesia: 'Generale o Sedazione Profonda con anestesia locale',
    duration: '2 - 3 ore',
    hospitalization: 'Day Hospital o 1 notte',
    recoveryTime: '10 - 14 giorni',
    benefits: [
      'Rassodamento e sollevamento del decolleté',
      'Riposizionamento dell\'areola mammaria',
      'Possibilità di abbinare protesi per volume aggiuntivo',
      'Cicatrici sottili e discretamente posizionate'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mastoplastica-riduttiva',
    category: 'seno',
    title: 'Mastoplastica Riduttiva',
    subtitle: 'Riduzione del seno ipertrofico',
    description: 'Intervento volto a ridurre le dimensioni di un seno eccessivamente grande e pesante, migliorando la fisionomia corporea e alleviando dolori a schiena e collo.',
    fullDescription: 'La mastoplastica riduttiva elimina l\'eccesso di ghiandola, grasso e pelle mammaria. L\'obiettivo del Dr. Mazzarella è alleggerire il seno per donare proporzione e sollievo fisico, migliorando nettamente la postura e la qualità della vita della paziente.',
    anesthesia: 'Generale',
    duration: '2.5 - 3.5 ore',
    hospitalization: '1 notte di degenza',
    recoveryTime: '14 giorni',
    benefits: [
      'Sollievo immediato da dolori cervicali e posturali',
      'Seno proporzionato e modellato sulle forme corporee',
      'Maggiore comfort nell\'attività fisica e nell\'abbigliamento',
      'Miglioramento della simmetria generale'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800'
  },

  // --- VISO ---
  {
    id: 'rinoplastica',
    category: 'viso',
    title: 'Rinoplastica',
    subtitle: 'Rimodellamento del naso',
    description: 'Correzione dei difetti estetici del naso (gobba, punta cadente, deviazioni) in piena armonia con il viso, migliorando se necessario la funzionalità respiratoria.',
    fullDescription: 'La rinoplastica moderna unisce estetica e funzionalità. Il Dr. Vincenzo Mazzarella predilige un approccio conservativo per modellare il profilo nasale senza mai creare un "naso finto". Attraverso tecniche mini-invasive, si eliminano le imperfezioni e si ripristina la corretta respirazione (rinosettoplastica) in un unico tempo chirurgico.',
    anesthesia: 'Generale o Sedazione Locale profonda',
    duration: '1.5 - 2 ore',
    hospitalization: 'Day Hospital',
    recoveryTime: '7 - 10 giorni (senza tamponi fastidiosi)',
    benefits: [
      'Profilo nasale naturale e in armonia con il volto',
      'Risoluzione di problemi respiratori e setto deviato',
      'Tecniche moderne che riducono gonfiori e lividi',
      'Assenza di tamponi dolorosi post-operatori'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blefaroplastica',
    category: 'viso',
    title: 'Blefaroplastica',
    subtitle: 'Ringiovanimento dello sguardo',
    description: 'Eliminazione della pelle in eccesso sulle palpebre superiori e delle borse sotto gli occhi per restituire freschezza, luminosità e giovinezza allo sguardo.',
    fullDescription: 'La blefaroplastica (superiore, inferiore o completa) corregge lo sguardo stanco e appesantito dovuto all\'età. Rimuovendo l\'eccesso cutaneo e ridefinendo i cuscinetti adiposi (borse), l\'occhio riacquista la sua originaria vivacità senza alcuna alterazione della fisionomia o dell\'espressione naturale.',
    anesthesia: 'Locale con sedazione leggera',
    duration: '45 - 90 minuti',
    hospitalization: 'Day Hospital',
    recoveryTime: '5 - 7 giorni',
    benefits: [
      'Eliminazione delle palpebre cadenti e delle borse oculari',
      'Sguardo visibilmente più riposato e luminoso',
      'Cicatrici invisibili nascoste nelle pieghe naturali dell\'occhio',
      'Recupero rapidissimo con minimo disagio'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'lifting-viso',
    category: 'viso',
    title: 'Lifting del Viso',
    subtitle: 'Ringiovanimento globale di viso e collo',
    description: 'Rimodellamento e sollevamento dei tessuti rilassati del viso e del collo per contrastare i segni del tempo, restituendo definizione alla mandibola e tensione naturale.',
    fullDescription: 'Il lifting cervico-facciale riposiziona i muscoli e la pelle del volto che hanno ceduto con gli anni. Il Dr. Mazzarella adotta tecniche che agiscono sui piani profondi (SMAS lifting) per garantire un risultato stabile, elegante e soprattutto naturale, evitando l\'effetto "pelle tirata".',
    anesthesia: 'Generale o Sedazione Profonda',
    duration: '2.5 - 4 ore',
    hospitalization: '1 notte di degenza',
    recoveryTime: '10 - 14 giorni',
    benefits: [
      'Distensione profonda dei tessuti di viso e collo',
      'Definizione del profilo mandibolare',
      'Risultato stabile e duraturo negli anni',
      'Cicatrici nascoste tra i capelli e intorno all\'orecchio'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800'
  },

  // --- CORPO ---
  {
    id: 'liposuzione',
    category: 'corpo',
    title: 'Liposuzione & Liposcultura',
    subtitle: 'Rimodellamento dei contorni corporei',
    description: 'Eliminazione degli accumuli adiposi localizzati resistenti a dieta e sport, ridefinendo le curve di addome, fianchi, cosce, glutei e mento.',
    fullDescription: 'La liposcultura non è un intervento per dimagrire, ma per scolpire il corpo. Attraverso micro-cannule, il Dr. Vincenzo Mazzarella aspira il grasso localizzato in eccesso. Il grasso prelevato può essere purificato e riutilizzato (lipofilling) per donare volume a glutei o seno, garantendo una silhouette tonica e armoniosa.',
    anesthesia: 'Locale con sedazione o Spinale (a seconda delle aree)',
    duration: '1 - 3 ore',
    hospitalization: 'Day Hospital o 1 notte',
    recoveryTime: '7 - 10 giorni',
    benefits: [
      'Eliminazione definitiva dei cuscinetti di grasso resistenti',
      'Rimodellamento tridimensionale della silhouette',
      'Cicatrici millimetriche praticamente invisibili',
      'Possibilità di lipofilling per volumizzare altre aree'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'addominoplastica',
    category: 'corpo',
    title: 'Addominoplastica',
    subtitle: 'Ricostruzione e tensione dell\'addome',
    description: 'Asportazione della pelle e del grasso in eccesso nella regione addominale, con eventuale ricostruzione della parete muscolare (diastasi) per un addome piatto.',
    fullDescription: 'L\'addominoplastica è indicata dopo forti dimagrimenti o gravidanze che hanno lasciato un eccesso di pelle rilassata (grembiule addominale) o una diastasi dei muscoli retti. L\'intervento ripristina la tensione dei muscoli e rimuove la cute in esubero, restituendo un addome piatto e un punto vita delineato.',
    anesthesia: 'Generale o Spinale',
    duration: '2 - 3 ore',
    hospitalization: '1 o 2 notti di degenza',
    recoveryTime: '15 - 20 giorni',
    benefits: [
      'Rimozione della cute flaccida e delle smagliature sottombelicali',
      'Riparazione della diastasi dei muscoli retti addominali',
      'Addome piatto, sodo e giovanile',
      'Cicatrice bassa, facilmente occultabile dall\'intimo'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mastoplastica-secondaria',
    category: 'seno',
    title: 'Mastoplastica Secondaria',
    subtitle: 'Revisione e correzione di impianti mammari',
    description: 'Intervento di revisione volto a sostituire protesi usurate, correggere contratture capsulari, asimmetrie o risultati estetici insoddisfacenti di precedenti interventi.',
    fullDescription: 'La mastoplastica secondaria (o di revisione) richiede un elevato livello di competenza specialistica. Il Dr. Vincenzo Mazzarella interviene per risolvere complicanze come la contrattura capsulare, la rottura o lo spostamento della protesi, asimmetrie o per assecondare la volontà della paziente di cambiare il volume o il tipo di impianto, ripristinando la corretta estetica del decolleté.',
    anesthesia: 'Generale',
    duration: '2 - 3 ore',
    hospitalization: '1 notte di degenza',
    recoveryTime: '10 - 14 giorni',
    benefits: [
      'Risoluzione di contratture capsulari e dolore',
      'Sostituzione di vecchie protesi con impianti di ultima generazione',
      'Correzione di asimmetrie mammarie e difetti di forma',
      'Ripristino della fiducia in sé e del benessere personale'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'otoplastica',
    category: 'viso',
    title: 'Otoplastica',
    subtitle: 'Correzione delle orecchie a sventola',
    description: 'Rimodellamento e riposizionamento dei padiglioni auricolari per correggere l\'asimmetria o le orecchie "a sventola" in armonia con le proporzioni del volto.',
    fullDescription: 'L\'otoplastica permette di correggere in modo definitivo gli inestetismi delle orecchie, quali la sporgenza eccessiva ("a sventola") o malformazioni congenite. Attraverso incisioni nascoste nella piega retroauricolare, il Dr. Mazzarella rimodella la cartilagine auricolare donando un profilo naturale e proporzionato sia negli adulti che nei bambini.',
    anesthesia: 'Locale con sedazione (adulti) o Generale (bambini)',
    duration: '45 - 60 minuti',
    hospitalization: 'Day Hospital / Ambulatoriale',
    recoveryTime: '5 - 7 giorni',
    benefits: [
      'Eliminazione definitiva del complesso delle orecchie a sventola',
      'Cicatrici invisibili posizionate dietro il padiglione',
      'Intervento sicuro con immediato ritorno alle normali attività',
      'Miglioramento dell\'armonia complessiva del viso'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'lifting-interno-coscia',
    category: 'corpo',
    title: 'Lifting Interno Coscia',
    subtitle: 'Rassodamento e rimodellamento delle cosce',
    description: 'Eliminazione dell\'eccesso di pelle e di grasso localizzato nella parte interna delle cosce, restituendo tonicità, tensione ed elasticità agli arti inferiori.',
    fullDescription: 'Il lifting delle cosce è particolarmente indicato in seguito a un importante calo ponderale o al naturale rilassamento cutaneo dovuto all\'età. L\'intervento elimina la cute flaccida e cadente nell\'area interna, rimodellando la forma della gamba e rendendola visibilmente più snella e tonica.',
    anesthesia: 'Spinale con sedazione o Generale',
    duration: '2 ore',
    hospitalization: '1 notte di degenza',
    recoveryTime: '14 giorni',
    benefits: [
      'Rassodamento profondo della cute flaccida delle cosce',
      'Miglioramento del comfort motorio e riduzione degli sfregamenti',
      'Gambe più snelle e proporzionate',
      'Cicatrici nascoste nella piega dell\'inguine'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ginecomastia',
    category: 'corpo',
    title: 'Ginecomastia',
    subtitle: 'Riduzione del seno maschile',
    description: 'Correzione dello sviluppo anomalo della ghiandola mammaria o del grasso localizzato nel torace maschile, restituendo un profilo piatto e mascolino.',
    fullDescription: 'La ginecomastia (vera, falsa o mista) consiste nell\'aumento di volume della regione mammaria nell\'uomo. Il Dr. Vincenzo Mazzarella esegue l\'asportazione chirurgica della ghiandola mammaria in eccesso (adenectomia) e/o l\'aspirazione del grasso localizzato (liposuzione), ripristinando un torace atletico e naturale senza cicatrici visibili.',
    anesthesia: 'Locale con sedazione o Generale',
    duration: '60 - 90 minuti',
    hospitalization: 'Day Hospital',
    recoveryTime: '7 giorni',
    benefits: [
      'Ripristino di un torace piatto, tonico e mascolino',
      'Eliminazione definitiva della ghiandola e del grasso in eccesso',
      'Incisioni millimetriche intorno all\'areola',
      'Risoluzione dei disagi psicologici ed estetici'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800'
  },

  // --- MEDICINA ESTETICA ---
  {
    id: 'filler-acido-ialuronico',
    category: 'medicina_estetica',
    title: 'Filler Acido Ialuronico',
    subtitle: 'Ripristino volumi e definizione labbra/zigomi',
    description: 'Trattamento ambulatoriale mini-invasivo per rimodellare le labbra, ridefinire gli zigomi, riempire le rughe e idratare profondamente il viso.',
    fullDescription: 'I filler a base di acido ialuronico consentono di correggere i volumi del viso in pochi minuti. Il Dr. Mazzarella utilizza esclusivamente prodotti top di gamma altamente biocompatibili. È specializzato nel rimodellamento labbra (tecniche russe e naturali) e nel ringiovanimento non chirurgico degli zigomi e del profilo mandibolare.',
    anesthesia: 'Crema anestetica o anestesia locale integrata',
    duration: '15 - 30 minuti',
    hospitalization: 'Ambulatoriale (ritorno immediato al sociale)',
    recoveryTime: 'Immediato (possibile leggero rossore per poche ore)',
    benefits: [
      'Labbra turgide e definite dal disegno naturale',
      'Zigomi rimodellati e ripristino dei volumi del volto',
      'Riempimento istantaneo di rughe naso-labiali e rughette',
      'Effetto temporaneo, sicuro e totalmente riassorbibile'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'tossina-botulinica',
    category: 'medicina_estetica',
    title: 'Tossina Botulinica',
    subtitle: 'Distensione delle rughe d\'espressione',
    description: 'Trattamento rapido ed efficace per distendere le rughe della fronte, dello spazio glabellare e del contorno occhi (zampe di gallina), per un viso rilassato e riposato.',
    fullDescription: 'La tossina botulinica agisce rilassando temporaneamente i muscoli mimici responsabili delle rughe d\'espressione. Il Dr. Vincenzo Mazzarella dosa il trattamento con estrema precisione per preservare la naturale espressività e mimica facciale del paziente, evitando l\'effetto "viso bloccato".',
    anesthesia: 'Nessuna (totalmente indolore)',
    duration: '15 minuti',
    hospitalization: 'Ambulatoriale',
    recoveryTime: 'Immediato (evitare sport intensi per 24 ore)',
    benefits: [
      'Sguardo disteso, fresco e visibilmente riposato',
      'Attenuazione drastica delle rughe frontali e perioculari',
      'Prevenzione dell\'invecchiamento cutaneo',
      'Risultato visibile dopo 4-7 giorni ed estremamente elegante'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'biorivitalizzazione',
    category: 'medicina_estetica',
    title: 'Biorivitalizzazione / Biostimolazione',
    subtitle: 'Idratazione profonda e rigenerazione cutanea',
    description: 'Micro-iniezioni di acido ialuronico libero, vitamine, amminoacidi e antiossidanti per risvegliare la compattezza e la luminosità di viso, collo e decolleté.',
    fullDescription: 'La biorivitalizzazione è un trattamento anti-aging mirato a contrastare l\'invecchiamento cutaneo a livello cellulare. L\'iniezione di complessi bioristrutturanti stimola i fibroblasti a produrre nuovo collagene ed elastina. Restituisce turgore, idratazione profonda e una pelle visibilmente ringiovanita, luminosa e tonica.',
    anesthesia: 'Nessuna o Crema Anestetica topica',
    duration: '20 minuti',
    hospitalization: 'Ambulatoriale',
    recoveryTime: 'Immediato',
    benefits: [
      'Idratare in profondità la pelle di viso, collo e decolleté',
      'Stimolare la produzione endogena di collagene ed elastina',
      'Migliorare visibilmente la texture e la luminosità cutanea',
      'Trattamento preventivo e curativo senza alcun fermo sociale'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'peeling-chimico',
    category: 'medicina_estetica',
    title: 'Peeling Chimico Medicale',
    subtitle: 'Rinnovamento cellulare ed esfoliazione controllata',
    description: 'Applicazione di soluzioni acide per accelerare il ricambio cellulare, correggere macchie, rughe sottili, cicatrici acneiche e opacità del viso.',
    fullDescription: 'Il peeling chimico medicale consiste nell\'applicazione sulla pelle del viso di agenti chimici esfolianti (quali acido glicolico, salicilico, mandelico o TCA) a concentrazioni professionali. Promuove l\'eliminazione delle cellule morte dello strato corneo e accelera il turnover cellulare, lasciando la pelle incredibilmente liscia, uniforme, priva di imperfezioni e ringiovanita.',
    anesthesia: 'Nessuna (sensazione di leggero calore/pizzicore)',
    duration: '15 - 20 minuti',
    hospitalization: 'Ambulatoriale',
    recoveryTime: 'Da 1 a 4 giorni (esfoliazione fine, ritorno immediato)',
    benefits: [
      'Levigatura immediata della pelle e riduzione delle rughe superficiali',
      'Schiarimento di macchie solari e iperpigmentazioni senili',
      'Trattamento attivo di acne in fase attiva ed esiti cicatriziali',
      'Pelle luminosa e pori visibilmente ristretti'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800'
  }
];

export const MEDIA_SECTIONS: MediaSection[] = [
  {
    id: 'video',
    title: 'Video Interviste e Approfondimenti',
    subtitle: 'Apparizioni televisive, interventi congressuali e tutorial clinici del Dottore.',
    layout: 'video-grid',
  },
  {
    id: 'press',
    title: 'Rassegna Stampa e Editoriali',
    subtitle: 'Interviste, redazionali e rubriche sulle principali testate nazionali.',
    layout: 'press-grid',
  },
];

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'vid-1',
    sectionId: 'video',
    kind: 'video',
    title: 'Intervista TG5 Salute: Le Nuove Frontiere della Mastoplastica Additiva',
    excerpt: 'Il Dr. Vincenzo Mazzarella illustra le moderne tecniche dual-plane con protesi ergonomiche di ultima generazione.',
    source: 'TG5 Salute',
    category: 'Intervista TV',
    date: 'Giugno 2026',
    duration: '08:45',
    thumbnail: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    linkMode: 'internal',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoFile: '',
    externalUrl: '',
    images: [],
    body: 'In questa intervista per il TG5 Salute il Dottore approfondisce la scelta consapevole dell\'impianto ideale, le indagini pre-operatorie e il percorso di recupero post-operatorio.',
  },
  {
    id: 'vid-2',
    sectionId: 'video',
    kind: 'video',
    title: 'Rinoplastica Preservativa e Strutturale: Differenze e Risultati',
    excerpt: 'Discussione scientifica ed esempi di rimodellamento del profilo nasale senza cicatrici visibili e con recupero accelerato.',
    source: 'YouTube Clinical Channel',
    category: 'Approfondimento',
    date: 'Maggio 2026',
    duration: '12:20',
    thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    linkMode: 'internal',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoFile: '',
    externalUrl: '',
    images: [],
    body: 'Un confronto tra rinoplastica preservativa e strutturale, con esempi di rimodellamento del profilo nasale e recupero post-operatorio accelerato.',
  },
  {
    id: 'vid-3',
    sectionId: 'video',
    kind: 'video',
    title: 'Lifting Facciale: Riposizionare lo SMAS per un Ringiovanimento Naturale',
    excerpt: 'Tutorial video congressuale del Dottore per chirurghi estetici sul trattamento dei piani profondi facciali.',
    source: 'SICPRE Congress Live',
    category: 'Congresso',
    date: 'Marzo 2026',
    duration: '15:40',
    thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    linkMode: 'internal',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoFile: '',
    externalUrl: '',
    images: [],
    body: 'Tutorial congressuale dedicato ai chirurghi estetici sul riposizionamento dello SMAS per un ringiovanimento facciale stabile e naturale.',
  },
  {
    id: 'press-1',
    sectionId: 'press',
    kind: 'article',
    title: 'La Mastoplastica del Futuro: Naturalezza al Tatto e Massima Sicurezza',
    excerpt: 'In un lungo redazionale, il Dottore descrive le indagini pre-operatorie e la scelta consapevole dell\'impianto ideale.',
    source: 'Vogue Salute & Bellezza',
    category: 'Intervista',
    date: 'Aprile 2026',
    thumbnail: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?auto=format&fit=crop&q=80&w=800',
    linkMode: 'internal',
    externalUrl: '',
    videoUrl: '',
    videoFile: '',
    images: [],
    body: 'La mastoplastica additiva moderna punta a un risultato naturale al tatto e alla vista.\nIn questo redazionale il Dottore descrive il percorso di studio pre-operatorio: dalla valutazione delle proporzioni corporee alla simulazione del volume, fino alla scelta della protesi ideale.\nLa sicurezza è al centro: protesi certificate, tecniche mininvasive e un follow-up post-operatorio costante garantiscono un decolleté armonioso e duraturo.',
  },
  {
    id: 'press-2',
    sectionId: 'press',
    kind: 'article',
    title: 'Combattere la Diastasi Addominale con l\'Addominoplastica Ricostruttiva',
    excerpt: 'Un focus medico sul ripristino della parete muscolare indebolita dopo la gravidanza o significativi cali ponderali.',
    source: 'Corriere della Sera',
    category: 'Rassegna Stampa',
    date: 'Febbraio 2026',
    thumbnail: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&q=80&w=800',
    linkMode: 'external',
    externalUrl: 'https://www.corriere.it/',
    videoUrl: '',
    videoFile: '',
    images: [],
    body: '',
  },
  {
    id: 'press-3',
    sectionId: 'press',
    kind: 'article',
    title: 'Filler e Tossina Botulinica: l\'Eleganza sta nel Saper Dire di No',
    excerpt: 'L\'opinione del Dottore sulla medicina estetica etica: preservare l\'unicità espressiva di ciascun volto rifiutando gli eccessi.',
    source: 'Elle Italia',
    category: 'Rubrica',
    date: 'Maggio 2026',
    thumbnail: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
    linkMode: 'internal',
    externalUrl: '',
    videoUrl: '',
    videoFile: '',
    images: [],
    body: 'La medicina estetica etica non insegue la moda, ma valorizza l\'unicità di ogni volto.\nIl Dottore spiega perché a volte il gesto più elegante è proprio quello di dire di no a un ritocco eccessivo, preservando la naturale espressività del paziente.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Elena R.',
    age: 34,
    treatmentName: 'Mastoplastica Additiva',
    rating: 5,
    content: 'Ho scelto il Dr. Mazzarella dopo molte visite e non potevo fare scelta migliore. Ha capito subito il mio desiderio di avere un seno naturale e proporzionato. La sua empatia, professionalità e l\'assistenza post-operatoria sono state straordinarie. Il risultato è semplicemente perfetto.',
    date: 'Maggio 2026'
  },
  {
    id: 'test-2',
    author: 'Francesco M.',
    age: 41,
    treatmentName: 'Rinoplastica',
    rating: 5,
    content: 'Il mio naso era un complesso da sempre. Il Dr. Mazzarella ha fatto un capolavoro: ha raddrizzato il setto facendomi respirare benissimo e ha armonizzato la forma senza stravolgere la mia espressione. Nessuno si è accorto dell\'operazione, dicono solo che mi trovano molto più bello e disteso.',
    date: 'Aprile 2026'
  },
  {
    id: 'test-3',
    author: 'Silvia B.',
    age: 29,
    treatmentName: 'Filler Labbra & Tossina Botulinica',
    rating: 5,
    content: 'Frequento lo studio di Napoli del Dottore per piccoli trattamenti di medicina estetica. La sua cura del dettaglio è incredibile. Non esagera mai, ti consiglia sempre il meno possibile per mantenere la naturalezza. Le mie labbra sono bellissime, idratate e piene ma senza l\'effetto "canotto". Lo consiglio a tutti!',
    date: 'Giugno 2026'
  }
];
