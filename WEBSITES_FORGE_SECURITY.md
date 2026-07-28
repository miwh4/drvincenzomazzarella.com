# Websites Forge - Sicurezza

## Stato attuale

Websites Forge e' un backend locale per costruire un sito statico esportabile. Il server ascolta su `127.0.0.1`, non deve essere pubblicato online e non deve contenere credenziali reali dentro lo ZIP esportato.

## Protezioni gia attive

- Sanitizzazione server-side su contenuti salvati, template, autosave ed export.
- Blocco di tag pericolosi inseriti dal builder: `script`, `style`, `iframe`, `object`, `embed`, `link`, `meta`, `base`.
- Rimozione di attributi evento inline come `onclick`, `onload`, `onerror`.
- Blocco di URL `javascript:` e `vbscript:` in link, immagini, form action e stili.
- Sanitizzazione dei link esterni salvati nelle azioni live editor.
- Filtraggio CSS contro `expression()`, `@import`, `behavior` e `-moz-binding`.
- `data:` ammesso solo per immagini raster base64: png, jpg/jpeg, gif e webp.
- Host FTP, utente FTP e cartella remota vengono rimossi dal `site-content.json` pubblico generato per l'export.
- Audit export prima dello ZIP: estensioni consentite, dimensione massima per file e percorsi validi.
- Report `websites-forge-security-report.json` con controlli applicati e hash SHA-256 degli asset esportati.
- CORS locale limitato a editor e preview di Websites Forge.

## Regole da mantenere

- Non esporre il backend Forge su internet.
- Non salvare password, token API o credenziali FTP dentro template o contenuti pubblici.
- Ogni futura funzione dinamica deve avere validazione server-side, rate limit, CSRF token e log minimo.
- Ogni nuovo tipo di file esportabile deve essere aggiunto esplicitamente alla allowlist.

## Prima di form PHP, database o utenti

- Separare il backend pubblico dal template statico esportato.
- Aggiungere test automatici per sanitizzazione, merge contenuti, export e form.
- Generare una CSP compatibile con il template finale.
- Firmare il manifest export o almeno verificare hash e dimensioni prima dell'upload FTP.
