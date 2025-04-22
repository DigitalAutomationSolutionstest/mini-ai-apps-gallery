import Stripe from 'stripe'
<<<<<<< HEAD

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

async function createProducts() {
  try {
    // Crea il prodotto per il piano Basic
    const basicProduct = await stripe.products.create({
      name: 'Mini AI Hub - Basic',
      description: 'Piano base con 100 crediti al mese',
    })
    
    // Crea il prezzo per il piano Basic
    await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 1900, // €19.00
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        credits: '100',
      },
    })
    
    // Crea il prodotto per il piano Pro
    const proProduct = await stripe.products.create({
      name: 'Mini AI Hub - Pro',
      description: 'Piano professionale con 500 crediti al mese',
    })
    
    // Crea il prezzo per il piano Pro
    await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 4900, // €49.00
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        credits: '500',
      },
    })
    
    // Crea il prodotto per il piano Business
    const businessProduct = await stripe.products.create({
      name: 'Mini AI Hub - Business',
      description: 'Piano business con 2000 crediti al mese',
    })
    
    // Crea il prezzo per il piano Business
    await stripe.prices.create({
      product: businessProduct.id,
      unit_amount: 14900, // €149.00
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        credits: '2000',
      },
    })
    
    console.log('Prodotti e prezzi creati con successo!')
  } catch (error) {
    console.error('Errore durante la creazione dei prodotti:', error)
  }
}

createProducts() 
=======
import dotenv from 'dotenv'

// Carica le variabili d'ambiente
dotenv.config({ path: '.env.local' })

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

// Definizione dei prodotti da creare
const products = [
  {
    name: 'Piano Starter',
    description: 'Ideale per iniziare con le tue prime app AI',
    category: 'Starter',
    prices: [
      {
        unit_amount: 2900, // €29.00
        currency: 'eur',
        recurring: {
          interval: 'month' as Stripe.PriceCreateParams.Recurring.Interval,
        },
      },
    ],
  },
  {
    name: 'Piano Pro',
    description: 'Funzionalità avanzate per progetti professionali',
    category: 'Pro',
    prices: [
      {
        unit_amount: 4900, // €49.00
        currency: 'eur',
        recurring: {
          interval: 'month' as Stripe.PriceCreateParams.Recurring.Interval,
        },
      },
    ],
  },
  {
    name: 'Piano Business',
    description: 'Soluzioni complete per aziende e team',
    category: 'Business',
    prices: [
      {
        unit_amount: 9900, // €99.00
        currency: 'eur',
        recurring: {
          interval: 'month' as Stripe.PriceCreateParams.Recurring.Interval,
        },
      },
    ],
  },
  {
    name: 'Piano Custom',
    description: 'Soluzioni personalizzate su misura per le tue esigenze',
    category: 'Custom',
    prices: [
      {
        unit_amount: 19900, // €199.00
        currency: 'eur',
        recurring: {
          interval: 'month' as Stripe.PriceCreateParams.Recurring.Interval,
        },
      },
    ],
  },
]

async function createProducts() {
  console.log('Inizio creazione prodotti Stripe...')

  for (const product of products) {
    try {
      // Crea il prodotto
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: {
          category: product.category,
        },
      })

      console.log(`✅ Prodotto creato: ${stripeProduct.name} (ID: ${stripeProduct.id})`)

      // Crea il prezzo per il prodotto
      for (const price of product.prices) {
        const stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          ...price,
        })

        console.log(`✅ Prezzo creato: €${(stripePrice.unit_amount! / 100).toFixed(2)}/mese (ID: ${stripePrice.id})`)

        // Imposta il prezzo come default_price per il prodotto
        await stripe.products.update(stripeProduct.id, {
          default_price: stripePrice.id,
        })

        console.log(`✅ Prezzo impostato come default per il prodotto ${stripeProduct.name}`)
      }
    } catch (error) {
      console.error(`❌ Errore nella creazione del prodotto ${product.name}:`, error)
    }
  }

  console.log('Creazione prodotti completata!')
}

// Esegui la funzione
createProducts()
  .then(() => {
    console.log('Script completato con successo!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Errore durante l\'esecuzione dello script:', error)
    process.exit(1)
  }) 
>>>>>>> 365b77d50a1183e790f78776a0c2e9bc6262f9c8
