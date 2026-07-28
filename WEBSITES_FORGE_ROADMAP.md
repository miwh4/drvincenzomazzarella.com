# Websites Forge - Roadmap

## Builder visuale

- [Fatto base] Sidebar come mappa sito gerarchica: menu, sotto-menu, pagine interne, sezioni home, link esterni e azioni sito.
- [Fatto base] Sidebar collassabile e ridimensionabile con handle visibile, larghezza salvata localmente e reset rapido.
- [Fatto base] Estendere lo stesso sistema destinazione/azione agli elementi selezionati dal live editor: pagina, sezione, link esterno o azione sito.
- Azioni avanzate live editor: stati hover/focus, target link, tracking privacy-friendly, disattivazione/rimozione azione e preset per CTA.
- Pagine dinamiche create dall'utente: slug, titolo, SEO, template pagina, transizione e relazione opzionale con voce menu.
- [Fatto base] Libreria elementi base dal live editor: sezione, contenitore, titolo, testo, immagine, pulsante, separatore, box e form base.
- Libreria blocchi completi: hero, header/menu, footer, CTA, trattamenti, gallery, FAQ, recensioni, contatti, form prenotazione.
- [Fatto base] Creazione da live editor: aggiunta elementi dentro/accanto a elementi esistenti e nesting controllato dal pannello struttura.
- [Fatto base] Struttura interna: selezione livelli, selezione contenitore padre, selezione SVG/logo/icona come elemento intero, rinomina, elimina, duplica e aggiungi simile.
- [Fatto base] Menu tasto destro con target evidenziato, intestazione elemento e azioni replicate nel Full edit.
- [Fatto base] Drag/resize con handle su elementi selezionati e salvataggio responsive iniziale.
- Drag/resize avanzato: snap, griglia, guide, limiti parent/section, undo atomico e salvataggio separato per breakpoint desktop/tablet/mobile.
- Media manager locale: upload, copia in `public/uploads`, rinomina, ottimizzazione, alt text e sostituzione globale.
- [Fatto base] Componenti speciali configurabili: menu con sotto-menu/sotto-sotto-menu, footer, form demo/mailto e sticky action bar.
- Componenti speciali avanzati: mappe configurabili, gallery, modali, cookie/privacy e blocchi riutilizzabili.

## Responsive e template

- [Fatto base] Preview desktop, tablet e mobile con frame dimensionato meglio rispetto alla finestra.
- Breakpoint separati per desktop, tablet e mobile con override salvabili.
- [Fatto base] Preset layout globali per sito full/boxed e menu full/boxed.
- Preset avanzati per colonne, spacing e tipografia.
- [Fatto base] Template selezionabili, salvabili con nome, rinominabili ed eliminabili.
- Versioning template con storico e ripristino.
- [Fatto base] Stili puntuali salvabili su elementi: colore, sfondo, font, spaziature, dimensioni e contrasto adattivo.
- Stili globali: palette, font, scale tipografiche, bottoni, card, sezioni, tema chiaro/scuro.

## Form e integrazioni

- [Fatto base] Form statico `mailto` per hosting semplice e modalita demo locale.
- Form con endpoint PHP opzionale per hosting Aruba.
- [Fatto base] Configurazione destinatario, oggetto e messaggio conferma dalla sidebar.
- Validazione avanzata campi client/server, honeypot, rate limit, captcha opzionale e consenso GDPR.
- Notifiche email configurabili, template messaggio e log locale opzionale.
- Integrazioni future: CRM, newsletter, analytics privacy-friendly.

## Sicurezza export

- [Fatto base] Sanitizzazione HTML degli elementi creati dal builder: niente script inline, event handler inline o URL pericolosi.
- [Fatto base] Sanitizzazione centrale server-side su salvataggio, template, autosave ed export per `customHtmls`, `customInserts` e stili custom.
- [Fatto base] CORS limitato alle origini locali dell'editor/preview e header HTTP locali anti-sniffing/referrer.
- Content Security Policy generata nell'export dove compatibile con hosting statico.
- Escape rigoroso dei dati utente e dei contenuti template.
- [Fatto base] Validazione immagini/link: blocco `javascript:`, `vbscript:`, CSS pericoloso, `data:` non immagine e URL pericolosi negli attributi HTML.
- Form PHP opzionale con CSRF token, rate limit, validazione server-side, header sicuri e logging minimo.
- [Fatto base] Nessun dato operativo FTP dentro l'export statico: host FTP, utente FTP e cartella remota restano solo nel backend locale.
- [Fatto base] Audit export prima dello ZIP: file permessi, estensioni consentite e limite dimensione per singolo asset.
- [Fatto base] Report export leggibile con controlli applicati e hash SHA-256 degli asset generati.
- Audit export avanzato: rilevamento riferimenti esterni sospetti, firma del manifest e policy diverse per hosting PHP/Node/statico.

## Futuro database e utenti

- Architettura separata dal template statico: backend opzionale con autenticazione, ruoli e sessioni sicure.
- Password hash moderne, 2FA opzionale, reset token a scadenza, protezione brute force.
- Permessi granulari per template, media, form, utenti e export.
- Migrazioni DB, backup, restore e audit log.
- Hardening deployment per PHP/Node in base all'hosting scelto.

## Debito tecnico

- Rifattorizzare `src/siteContent.tsx` in moduli:
  - schema/default content
  - provider runtime
  - customizzazioni DOM
  - overlay live edit
  - inspector tabs
  - drag/resize
  - insert/duplicate library
- Aggiungere test per merge contenuti, undo/redo, custom inserts, export e sanitizzazione.
- Aggiungere typecheck obbligatorio prima dell'export.
