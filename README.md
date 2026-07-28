[![Deploy GitHub Pages](https://github.com/miwh4/drvincenzomazzarella.com/actions/workflows/pages.yml/badge.svg)](https://github.com/miwh4/drvincenzomazzarella.com/actions/workflows/pages.yml)

# Dr. Vincenzo Mazzarella — Chirurgia Plastica

Sito web professionale sviluppato con React, TypeScript, Vite e Tailwind CSS.

## Requisiti

- Node.js 18 o successivo
- npm

## Avvio locale

1. Installa le dipendenze:

   ```sh
   npm ci
   ```

2. Copia `.env.example` in `.env.local` e valorizza solo le variabili necessarie. Non inserire mai credenziali nel repository.

3. Avvia il sito:

   ```sh
   npm run dev
   ```

Il server di sviluppo usa normalmente `http://localhost:3000`.

## Comandi disponibili

- `npm run dev`: avvia il sito in modalità sviluppo.
- `npm run build`: crea la versione di produzione in `dist/`.
- `npm run preview`: mostra localmente la build di produzione.
- `npm run lint`: esegue il controllo TypeScript.
- `npm run forge`: avvia l'editor locale Websites Forge.

## Dati locali e sicurezza

Il repository esclude deliberatamente:

- file `.env` e credenziali;
- snapshot e dati di lavoro del builder (`forge-data/`, `projects/`, `exports/`);
- contenuti runtime generati (`public/site-content.json`);
- report di sicurezza locali, log, cache e build.

Il file `.env.example` contiene esclusivamente nomi di variabili e valori segnaposto. Prima di ogni pubblicazione verifica sempre i file selezionati con `git status`.

## Build di produzione

```sh
npm ci
npm run lint
npm run build
```

Se `public/site-content.json` non è presente, l'applicazione utilizza i contenuti predefiniti definiti nel codice sorgente.

## Export pronto per FTP

Avvia l'editor con `npm run forge`, completa le modifiche e usa **Export ZIP**. L'archivio generato contiene `index.html` alla radice, le immagini come file separati e un breve file di istruzioni.

Carica via FTP il contenuto dello ZIP, non la cartella contenitore. Se il sito deve vivere in una sottocartella del dominio, imposta prima il relativo **Percorso pubblico** nella sezione Hosting dell'editor. Host e nome utente FTP non vengono inclusi nell'export.

## Licenza

Progetto proprietario. Tutti i diritti riservati.
