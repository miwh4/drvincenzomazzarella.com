# Websites Forge - Release notes

## Step 2 completato

- Il menu tasto destro ora evidenzia il suo target con una cornice ambra separata e mostra nome/ID dell'elemento in alto.
- Le azioni prima disponibili solo dal tasto destro sono state replicate nella tab `Azioni` del Full edit.
- Migliorata la selezione live edit dei contenitori annidati: click ripetuto sullo stesso punto scorre tutti i livelli sotto il puntatore, fino ai container grandi come griglie/sezioni; toolbar e tasto destro mantengono anche il comando `Padre`.
- Migliorata la selezione di SVG/logo/icone: cliccando dentro un SVG ora viene selezionato l'SVG intero invece dei singoli polygon/path o del contenitore link.
- Aggiunto handle visibile tra sidebar e preview: la sidebar `Gestione sito` ora si puo allargare/restringere manualmente, salva la larghezza in locale e si resetta con doppio click.
- Aggiornata la roadmap segnando come `[Fatto base]` le parti gia implementate, distinguendole dagli sviluppi avanzati ancora aperti.
- Estesa la tab `Azioni` del Full edit: gli elementi selezionati possono aprire una pagina interna, una sezione home, un link esterno o un'azione sito.
- Aggiunto salvataggio `customActions` per le azioni impostate dal live editor, con sanitizzazione server-side dei link esterni.
- Riorganizzata la sidebar `Gestione sito`: ora parte da `Mappa sito` invece che da campi identita scollegati.
- Aggiunto modello destinazione sulle voci menu: pagina interna, sezione della home, link esterno o azione sito.
- Le voci menu possono mantenere tendine e sotto-tendine, ma ora ogni livello mostra chiaramente cosa apre.
- La navigazione del sito interpreta le nuove destinazioni mantenendo compatibilita con il vecchio campo `tab`.
- Aggiunte ancore interne stabili per Hero e form contatto, e allineata la sezione Review all'ID reale `recensioni`.
- Rinominata la vecchia area `Selezione live` in scorciatoie dell'elemento selezionato, con nota che struttura e collegamenti si gestiscono dalla mappa sito.
- Aggiunto primo hardening server-side: HTML e insert creati dal builder vengono sanitizzati prima di essere salvati, caricati nei template o esportati.
- Bloccati script/style tag pericolosi, iframe/object/embed/meta/link/base, handler inline `on...`, URL `javascript:`/`vbscript:` e CSS pericoloso come `expression()`, `@import`, `behavior` e `-moz-binding`.
- Limitati i data URL ammessi alle immagini raster base64 supportate dal builder, evitando payload generici dentro contenuti e stili.
- Aggiunto audit prima dello ZIP: l'export viene fermato se contiene estensioni non previste, percorsi non validi o file troppo grandi.
- L'export pubblico ora rimuove host FTP, utente FTP e cartella remota dal `site-content.json`: questi dati restano solo nel backend locale.
- Aggiunto `websites-forge-security-report.json` dentro la build esportata con controlli applicati e hash SHA-256 degli asset.
- Rafforzate le API locali con CORS limitato a editor/preview locali e header HTTP di base contro content sniffing e referrer leak.
- Aggiunto `WEBSITES_FORGE_SECURITY.md` con regole operative, protezioni attive e vincoli da rispettare prima di form PHP, database o utenti.
- Aggiunti controlli `Dup` e `+Sim` nei pannelli `Livelli` e `Struttura interna`: gli elementi possono essere duplicati o creati rapidamente con un tipo plausibile simile.
- Esteso il pannello media dell'overlay: immagini, logo, SVG e icone mostrano controlli per URL/sostituzione visuale, dimensioni, fit, posizione, opacita e colore logo/icona.
- Aggiunto pulsante `Scegli immagine dal PC` nel pannello media: carica file locali e li salva nel contenuto/stile Forge come data URL.
- Aggiunti slider guidati per valori comuni come larghezza, altezza minima, padding, margine, raggio e opacita, mantenendo comunque i campi manuali per valori avanzati.
- Esteso il drag/drop immagini su tutti i media riconosciuti, non solo sui campi immagine tecnici.
- Esteso il tasto destro live edit con inserimento rapido di titolo, testo, pulsante, immagine, separatore, contenitore, sezione, form base e duplicazione elemento.
- Aggiunti handle visuali sull'elemento selezionato: trascinamento rapido e resize dai lati/angoli con salvataggio nello stile Forge.
- Il resize orizzontale salva larghezze percentuali rispetto al contenitore per restare piu responsive, mentre altezza/min-height e spostamento restano controllati.
- Aggiunta roadmap dedicata in `WEBSITES_FORGE_ROADMAP.md` per builder da zero, libreria blocchi, sicurezza export, form e futuro database/utenti.
- Riorganizzata la sidebar come area di gestione sito/template, distinta dagli overlay di live edit in preview.
- Aggiunte tab sidebar per `Sezioni`, `Impostazioni` e `Hosting`, oltre a Identita, Menu, Sedi, Trattamenti e Review.
- Aggiunta sidebar collassabile per lasciare piu spazio alla preview.
- Aggiunte impostazioni globali salvabili per larghezza sito e larghezza menu, mantenendo il default uguale al template attuale.
- Aggiunta gestione sezioni speciali: mostra/nasconde form contatto in home, footer e pulsanti flottanti.
- Aggiunta configurazione form contatto: modalita demo locale oppure apertura email pronta via `mailto`, destinatario, oggetto e messaggio di conferma.
- Aggiunta area dati dominio/hosting: dominio, provider, host FTP, utente FTP e cartella pubblica remota come riferimento operativo per export/FTP.
- Esteso lo schema `siteSettings` a runtime, server, autosave, template, undo/redo e preview live.
- Migliorata preview Tablet/Mobile: il frame ora scala in base all'altezza disponibile della finestra e sfrutta meglio lo spazio verticale.

## Step 1 completato

- Aggiunto backend locale `Websites Forge` avviabile con `npm run forge`.
- Aggiunto launcher Windows `Avvia Websites Forge.bat` per aprire il pannello nel browser.
- Il launcher usa PowerShell + `node.exe` diretto, evitando `npm.cmd`/`cmd` per non interferire con AutoRun di sistema.
- Aggiunto runner separato `Run-WebsitesForgeServer.ps1` per gestire correttamente i percorsi Windows con spazi.
- Aggiunto pannello editor locale con toolbar superiore, gestione template, autosalvataggio e pulsante `Export ZIP`.
- Aggiunta anteprima laterale del sito con aggiornamento live tramite toggle `Live edit`.
- Aggiunto inspector overlay direttamente dentro la preview: selezione di qualsiasi elemento, box di evidenziazione, toolbar flottante, menu tasto destro, doppio click per testo, controlli layout/tipografia/colore/spaziature e nudge di posizione.
- Semplificata la toolbar overlay: per testi e colori ora ci sono bottoni rapidi, swatch colore/sfondo, allineamenti, grandezza testo e spaziature guidate; i campi tecnici restano sotto `Avanzato`.
- Aggiunta modalita testo nell'overlay: durante la modifica mostra strumenti tipografici compatti e puo applicare formato all'intero elemento oppure solo alla selezione evidenziata, salvando anche l'HTML interno formattato.
- Aggiunto pannello `Livelli` nell'overlay live edit: mostra gli elementi annidati sotto il click e permette di selezionare rapidamente div esterni, div interni o testo specifico.
- Migliorate le etichette del pannello `Livelli`: ora usa nomi riconoscibili come `Voce menu`, `Titolo`, `Paragrafo`, `Sezione`, `Contenitore`, `Immagine`.
- Migliorata la libreria `Livelli`: ora evita l'elemento selezionato, e' trascinabile, ridimensionabile/espandibile e permette di rinominare livelli e sotto-livelli con nomi personalizzati persistenti.
- Aggiunta multi-selezione in live edit: CTRL/Command-click aggiunge o rimuove elementi dal gruppo e applica stile, colori, sfondo, spostamento, testo adattivo ed eliminazione a tutti gli elementi selezionati.
- Migliorato Undo/Redo per operazioni live: stile/comportamenti multi-selezione ed eliminazioni miste ora vengono salvati come patch batch, quindi un'azione multi torna indietro con un solo undo.
- Aggiunto pulsante `Edit` su ogni livello: apre un pannello `Full edit` dedicato anche per elementi troppo piccoli o annidati, con controlli specifici per testo, immagini/logo, layout e struttura interna.
- Rifattorizzato il `Full edit` in una finestra stile builder: trascinabile, ridimensionabile, sempre aggiornata sull'elemento selezionato e organizzata in tab `Contenuto`, `Design`, `Layout`, `Effetti`, `Struttura`, `Azioni` con sotto-tab contestuali.
- Migliorata la selezione delle voci menu: le label del menu principale, delle tendine e delle sotto-tendine ora sono elementi live-edit salvabili e hanno una hit-area piu comoda durante il live edit.
- Aggiunti preset tipografici principali: Titolo, Sottotitolo, Testo e Citazione, oltre alla scelta font visibile nei controlli testo.
- Aggiunti colore custom con ruota colore e comportamento testo adattivo: gli elementi marcati possono usare colori manuali oppure modalita automatica con testo bianco su sfondo scuro e scuro su sfondo chiaro.
- Corretto il toggle `◐` del testo adattivo: ora resta visivamente attivo, si disattiva al secondo click e non forza piu il testo al nero.
- Aggiunta scelta della sorgente per il testo adattivo: auto, pagina sotto, sezione, contenitore o stato header chiaro/scuro.
- Corretto il testo adattivo su header/menu dopo scroll: ora valuta il background della pagina sotto la barra e forza automaticamente testo bianco su sfondo scuro e testo scuro su sfondo chiaro.
- Corretto il caso `Chi sono` bloccato: rimosso il vecchio HTML automatico salvato sulla voce menu e impedito ai legacy `customHtmls` di sovrascrivere elementi collegati a campi contenuto.
- Aggiunta ruota colore custom anche per lo sfondo degli elementi, con preset rapidi sincronizzati.
- Corretto Undo/Redo: gli snapshot dello storico vengono normalizzati prima del render, evitando errori quando mancano campi come `navItems`.
- La toolbar overlay ora si posiziona automaticamente fuori dall'elemento selezionato quando possibile ed e' trascinabile manualmente tramite maniglia `Sposta`.
- La toolbar mantiene la posizione manuale scelta dall'utente anche cambiando elemento o livello selezionato, e mostra una label riconoscibile dell'elemento in modifica.
- Aggiunti inserimenti persistenti dal menu contestuale: testo, separatore e contenitore.
- Autosave reso non invasivo: durante l'editing non aggiorna piu' `public/site-content.json`, evitando reload della preview da Vite.
- Le modifiche dei campi laterali vengono inviate alla preview come patch puntuali, non come refresh completo del contenuto.
- Aggiunti pulsanti preview `Desktop`, `Tablet`, `Mobile`.
- Aggiunta gestione menu principale dal backend con supporto ad albero: tendine, sotto-tendine e livelli annidati.
- Ripristinato il menu base del sito senza tendine precompilate: le sotto-voci restano disponibili solo quando vengono create dal backend.
- Creato layer contenuti dinamico per nome, titolo, bio, credenziali, sedi, trattamenti e recensioni.
- Aggiunta persistenza locale in `forge-data/active-site-content.json`.
- Aggiunta gestione template in `forge-data/templates`: carica, salva, salva con nome, rinomina ed elimina.
- Aggiunto export statico in `exports/`, con build Vite e zip pronto da caricare via FTP.
- Il sito continua a funzionare come front-end statico: l'export include `index.html`, asset buildati e `site-content.json`.

## Limiti noti di questo step

- Il live edit diretto copre gli elementi principali marcati nel template; va esteso progressivamente a tutte le sezioni secondarie.
- Le sezioni disponibili sono quelle del sito attuale; aggiunta/rimozione visuale di blocchi complessi stile Divi e' da fare in uno step successivo.
- Le gallery e coordinate di Napoli/Roma/Milano restano legate agli ID tecnici delle sedi esistenti.
- La gestione immagini usa URL o path gia' disponibili; manca ancora upload locale guidato dal pannello.
- Mancano ruoli utente, login e storico versioni: per ora e' pensato come strumento locale personale.

## Prossimi step consigliati

- Editor inline nel frame di anteprima con selezione blocchi e breadcrumb sezione/elemento.
- Libreria sezioni riutilizzabili: hero, trattamenti, CTA, gallery, FAQ, footer.
- Media manager locale con copia automatica immagini in `public/uploads`.
- Layout builder con drag and drop e ordinamento sezioni.
- Validazione SEO e anteprima meta title/description prima dell'export.
