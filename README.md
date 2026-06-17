# FMF Portfolio Builder

Tool online per creare PDF portfolio personalizzati con selezione progetti, drag & drop, e modifica dinamica intro/coda.

## Setup Locale

### 1. Prerequisiti
- Node.js 16+ ([download qui](https://nodejs.org/))
- Git ([download qui](https://git-scm.com/))
- GitHub account (gratuito)

### 2. Clona il repo
```bash
git clone https://github.com/TUO_USERNAME/fmf-portfolio-builder.git
cd fmf-portfolio-builder
```

### 3. Installa dipendenze
```bash
npm install
```

### 4. Run in locale
```bash
npm run dev
```
Apri http://localhost:3000 nel browser

### 5. Build per production
```bash
npm run build
npm start
```

---

## Deploy su Vercel (Facile!)

### Step 1: Crea GitHub repo
1. Vai su https://github.com/new
2. Nome: `fmf-portfolio-builder`
3. Clicca "Create repository"
4. Copia i comandi da GitHub

### Step 2: Push il codice
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/fmf-portfolio-builder.git
git push -u origin main
```

### Step 3: Deploy su Vercel
1. Vai su https://vercel.com/new
2. Clicca "Import Git Repository"
3. Seleziona il tuo GitHub account
4. Clicca "fmf-portfolio-builder"
5. Clicca "Deploy"
6. **Fine!** ✅

Il sito sarà online in ~1 minuto. Link: `https://fmf-portfolio-builder.vercel.app`

---

## Struttura Progetto

```
fmf-portfolio-builder/
├── pages/
│   ├── index.js          # Pagina principale
│   └── api/
│       ├── upload.js     # API upload PDF (future)
│       └── generate-pdf.js # API generazione PDF (future)
├── public/               # File statici
├── package.json          # Dipendenze
├── next.config.js        # Config Next.js
└── README.md             # Questo file
```

---

## Funzionalità

- ✅ Editor intro + coda in tempo reale (sfondo nero, testo bianco)
- ✅ Selezzione progetti con checkbox
- ✅ Filtri per categoria
- ✅ Drag & drop per riordinare
- ✅ Preview live 16:9 landscape
- ✅ Download PDF: `FMF_DDMMYYYY_Portfolio_NomeCliente.pdf`
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Input cliente + data dinamici

---

## Prossimi Passi (TODO)

### Quando hai i PDF veri pronto:
1. Crea folder `public/uploads/`
2. Upload i PDF: `intro.pdf`, `coda.pdf`, `proj1.pdf`, ecc.
3. Aggiungi API `/api/upload.js` per gestire file upload
4. Integra PDFLib per manipolare form fields
5. Implementa lettura PDF multipagina

### File da aggiungere:

**`pages/api/generate-pdf.js`** (genera PDF finale)
```javascript
// Legge i PDF dei progetti
// Scrive nome cliente e data nei form fields
// Assemela tutto in un PDF finale
// Restituisce download
```

**`pages/api/upload.js`** (riceve upload PDF)
```javascript
// Riceve PDF da upload
// Salva in /public/uploads/
// Estrae metadati (numero pagine, ecc.)
```

---

## Ambiente di Produzione (Vercel)

### Variabili d'ambiente (opzionale)
Crea `.env.local` per development:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Limite upload
Max file size: 50MB (configurable in `next.config.js`)

---

## Troubleshooting

**"npm: command not found"**
→ Installa Node.js da https://nodejs.org/

**"Module not found"**
→ Esegui `npm install` nella cartella del progetto

**Port 3000 già in uso**
→ Esegui `npm run dev -- -p 3001` (usa porta 3001)

**Deploy su Vercel non funziona**
→ Controlla che `.gitignore` abbia `/node_modules` e `/.next/`
→ Fai commit e push di nuovo

---

## Domande?

Contattami! Sono pronto a:
- Aggiungere feature
- Risolvere bug
- Migliorare performance
- Integrare PDF reali

---

**Last updated**: 2025
**Status**: 🚀 Ready for development
