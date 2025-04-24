# MiniAI Backend

API backend per Mini AI Hub

## Deploy

- Hosting: Vercel (https://api.miniaiapps.tech)
- Stack: Next.js API Routes + Edge Functions

## API Principali

- `GET /api/debug` → Verifica stato dei servizi
- `POST /api/quote` → Richiesta preventivo
- `POST /api/stripe/checkout-subscription` → Abbonamento
- `POST /api/ai/pdf` → Elaborazione PDF con AI
- `POST /api/ai/image` → Generazione immagini con AI

## Struttura del Progetto

```
/miniai-backend
│
├── app/
│   └── api/
│       └── debug/route.ts       # API verifica stato
│       └── stripe/...           # Rotte API Stripe
│       └── quote/...            # API preventivi
│       └── ai/...               # API AI (PDF, Image)
│
├── lib/                         # Librerie utility
│   └── stripe.ts                # Integrazione Stripe
│   └── supabase.ts              # Integrazione Supabase
│
├── .env.example                 # Variabili da impostare
├── vercel.json                  # Configurazione Vercel
└── README.md                    # Documentazione
```

## Variabili d'Ambiente

Copia da `.env.example` e incolla nella sezione Environment Variables su Vercel.

```
# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=

# AI
OPENAI_API_KEY=
HUGGINGFACE_API_KEY=
ANTHROPIC_API_KEY=

# Altro
EMAIL_ADMIN=admin@miniaiapps.tech
BASE_URL=https://miniaiapps.tech
```

## Sviluppo Locale

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build
```

## Deployment

Il deployment è automatizzato tramite Vercel. Ogni push al branch `main` attiva un nuovo deployment.

Per un deployment manuale:

```bash
# Installa Vercel CLI
npm i -g vercel

# Esegui il deployment
vercel
```
