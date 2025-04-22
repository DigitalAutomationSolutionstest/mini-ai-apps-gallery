import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil'
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Errore nella verifica della firma del webhook:', err);
    res.status(400).json({ error: (err as Error).message });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Gestisci il pagamento completato
        console.log('Pagamento completato:', session.id);
        break;
      }
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        // Gestisci la creazione della sottoscrizione
        console.log('Sottoscrizione creata:', subscription.id);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        // Gestisci l'aggiornamento della sottoscrizione
        console.log('Sottoscrizione aggiornata:', subscription.id);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        // Gestisci la cancellazione della sottoscrizione
        console.log('Sottoscrizione cancellata:', subscription.id);
        break;
      }
      default:
        console.log(`Evento non gestito: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Errore nella gestione del webhook:', err);
    res.status(500).json({ error: 'Errore nella gestione del webhook' });
  }
} 