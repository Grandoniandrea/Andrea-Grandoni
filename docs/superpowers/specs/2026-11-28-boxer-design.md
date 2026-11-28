# Boxer — demo da proporre al socio

## Perché
Andrea vuole proporre a un socio un'app di shadow boxing a casa, con lo stesso
tipo di esperienza delle pubblicità BetterMe Boxing (questionario → piano
personalizzato → abbonamento → allenamenti guidati). Lo scopo ora è **valutare
l'idea**: il socio deve aprirla sul telefono e pensare "questa si vende".

## Obiettivi
- Percorso completo e credibile, dall'apertura del link all'allenamento finito.
- Aspetto da prodotto vero (non da prototipo), in italiano, pensato per telefono.
- Un allenamento che funziona davvero e si può provare in salotto.

## Non-obiettivi
- Pagamenti veri, account, server, pubblicazione sugli store.
- Video di un coach (non ne abbiamo): l'allenamento è guidato da testo grande,
  animazioni e voce.

## Da evitare (anti-obiettivi)
- Copiare nome, testi, grafica o video di BetterMe: tutto deve essere di Boxer.
- Qualsiasi cosa che faccia sembrare la demo "finta" al primo sguardo
  (testi segnaposto, pulsanti morti, schermate vuote).

## Vincoli
- Stesso modello delle altre app del repo: una cartella `boxer/` con un unico
  `index.html` autonomo, pubblicato su GitHub Pages
  (`grandoniandrea.github.io/Andrea-Grandoni/boxer/`), installabile sulla Home
  (meta apple-mobile-web-app come `giro/`).
- Nessuna libreria obbligatoria; i dati restano nel telefono (localStorage).

## Approcci considerati
- **A. Web app installabile (scelta).** Link condivisibile, percorso completo
  e allenamento funzionante, pronta in fretta, coerente col sito esistente.
- B. Schermate cliccabili statiche: più veloce ma l'allenamento non si prova,
  sembra finta.
- C. App nativa: settimane di lavoro e store; ha senso solo se il socio dice sì.

## Il percorso
1. **Benvenuto** — logo Boxer, slogan ("Allenati come un pugile. A casa, in 15
   minuti al giorno"), pulsante Inizia.
2. **Questionario** (~12 domande, una per schermata, barra di avanzamento,
   risposte a scheda grande con emoji/icone): sesso, obiettivo, età, forma
   attuale, forma desiderata, esperienza di boxe, livello di allenamento, zone
   da migliorare, tempo al giorno, altezza, peso attuale, peso obiettivo.
   Alcune schermate intermedie "motivazionali" (es. "Il 87% delle persone come
   te ha visto risultati in 4 settimane").
3. **Creazione del piano** — cerchio di avanzamento con passaggi che si
   spuntano e recensioni che scorrono.
4. **Il tuo piano** — IMC calcolato, grafico del peso previsto con data
   obiettivo, riepilogo (livello, minuti al giorno, durata programma).
5. **Abbonamento** — tre piani (1 settimana, 4 settimane evidenziato
   "più scelto", 12 settimane), sconto con conto alla rovescia di 10 minuti,
   garanzia, FAQ brevi. Al tocco: schermata "pagamento" simulata con una nota
   discreta "Demo — nessun addebito".
6. **App**
   - Home = **"SFIDA BOXER 28 GIORNI"** (come nel reel di riferimento): in alto
     obiettivo principale e peso attuale (dal questionario), "I tuoi progressi:
     N allenamenti su 28" con barra; griglia 6 colonne di 28 caselle "Giorno N"
     con la miniatura dell'atleta luminoso; i giorni futuri hanno il lucchetto,
     il successivo si sblocca completando il precedente. Toccando un giorno si
     apre la scheda dell'allenamento (nome, es. "Condizionamento Total Body",
     durata, colpi usati, pulsante Inizia). Serie di giorni consecutivi,
     minuti e calorie stimate.
   - **Allenamento**: riscaldamento → round (es. 3 × 2 min) → pause → defaticamento.
     Colpi numerati (1 jab, 2 diretto, 3 gancio sx, 4 gancio dx,
     5 montante sx, 6 montante dx, più schivate/difese). Combinazioni grandi a
     schermo con animazione, voce in italiano che le chiama (sintesi vocale del
     telefono), suoni di gong/beep, timer, pausa/salta.
   - Fine: riepilogo e giorno spuntato nel calendario.
   - Una piccola libreria di altri allenamenti (Principiante, Brucia grassi,
     Velocità, Addominali da pugile) bloccati/sbloccati come nel prodotto vero.

## Stile (deciso guardando il reel di riferimento)
- **Atleta "ologramma" al neon arancio** su fondo nero: figura di pugile
  disegnata da noi (SVG con bagliore), animata in guardia, jab, diretto,
  gancio, montante, schivata. È l'elemento visivo principale: schermata
  iniziale, miniature dei giorni, allenamento. Arancio scelto da Andrea per
  distinguersi dal verde di BetterMe.
- **Scritte grandi, una parola alla volta**, maiuscolo bold condensato, al
  centro sopra l'atleta (benvenuto e allenamento).
- Schermate di allenamento/intro scure; schermata Sfida su fondo chiaro
  crema con caselle scure, come nel reel.
- Pulsanti grandi, pensata per telefono.

## Riferimento
Reel pubblicitario BetterMe (30 s) visto il 28/11/2026: atleta verde neon su
nero con parole singole a schermo, poi schermata "Sfida di shadowboxing" con
obiettivo, peso, progressi 0–3 su 28, griglia di 28 giorni con lucchetti e
scheda "Condizionamento Total Body". Ne riprendiamo struttura e ritmo, non
contenuti, nome o grafica.

## Lasciato a chi costruisce
- Testi definitivi, percentuali motivazionali e recensioni d'esempio
  (marcate come esempi nel codice).
- Prezzi indicativi: 1 sett. 6,99 €, 4 sett. 15,99 € (da 39,99), 12 sett.
  29,99 € (da 79,99) — modificabili in un punto solo.
- Se aggiungere un collegamento a Boxer dalla homepage del sito: per ora **no**,
  resta un link privato da mandare al socio.
- Pulsante nascosto per ricominciare la demo da capo (per mostrarla più volte).
