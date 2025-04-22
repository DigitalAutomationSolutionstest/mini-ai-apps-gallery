
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "@/components/ui/sonner";

const plans = [
  {
    name: "Starter",
    price: "9",
    features: ["1 Mini App", "50 crediti al mese", "Assistenza base"],
    priceId: "price_starter"
  },
  {
    name: "Pro",
    price: "29",
    features: ["Tutte le Mini App", "300 crediti al mese", "Assistenza prioritaria"],
    highlight: true,
    priceId: "price_pro"
  },
  {
    name: "Business",
    price: "99",
    features: ["Tutte le Mini App", "2000 crediti/mese", "Supporto premium dedicato"],
    priceId: "price_business"
  }
];

export const PricingSection = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleSelectPlan = async (priceId: string) => {
    try {
      if (!session) {
        // Redirect to login if not authenticated
        toast.error("Devi effettuare l'accesso per sottoscrivere un abbonamento");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      toast.loading("Preparazione checkout...");
      
      // Get the current session token
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession?.access_token) {
        toast.dismiss();
        toast.error("Sessione non valida, effettua nuovamente il login");
        return;
      }
      
      // Call the Supabase Edge Function for creating a checkout session
      const { data, error } = await supabase.functions.invoke('checkout-subscription', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`
        }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.dismiss();
        toast.error(`Errore durante la creazione del checkout: ${error.message}`);
        return;
      }

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.dismiss();
        toast.error("Errore durante la creazione del checkout");
      }
    } catch (err) {
      console.error('Error handling checkout:', err);
      toast.dismiss();
      toast.error("Si è verificato un errore. Riprova più tardi.");
    }
  };

  return (
    <section className="w-full bg-[#101216] py-24 px-6 text-gray-100">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-white"
        >
          Prezzi trasparenti, valore reale
        </motion.h2>
        <p className="text-gray-400 mb-12">
          Scegli il piano che meglio si adatta al tuo business. Tutti i piani includono accesso immediato alle AI Mini App.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`rounded-xl border border-[#2c2f36] bg-[#1a1d23] p-6 backdrop-blur-md shadow-md hover:shadow-purple-500/10 transition-all duration-300 flex flex-col ${
                plan.highlight ? "border-purple-500 shadow-purple-500/20" : ""
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
              <div className="text-4xl font-bold mb-4 text-white">€{plan.price}<span className="text-base font-normal text-gray-400">/mese</span></div>
              <ul className="text-sm text-gray-400 flex-1 space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan.priceId)}
                className={`w-full py-2 px-4 rounded-md font-medium transition-all ${
                  plan.highlight 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "bg-white/10 hover:bg-white/20 text-white border border-purple-500/50"
                }`}
              >
                Scegli piano
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
