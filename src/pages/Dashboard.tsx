
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Layout, DollarSign, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSearchParams } from "react-router-dom";

interface MiniApp {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
}

const miniApps: MiniApp[] = [
  {
    id: "pdf",
    name: "Generatore PDF",
    href: "/dashboard/pdf",
    icon: FileText
  },
  {
    id: "image",
    name: "Generatore Immagini",
    href: "/dashboard/image",
    icon: Layout
  },
  {
    id: "plans",
    name: "Piani di Abbonamento",
    href: "/#pricing",
    icon: DollarSign
  },
  {
    id: "quote",
    name: "Richiedi Preventivo",
    href: "/quote",
    icon: MessageSquare
  }
];

export default function Dashboard() {
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();
  const [searchParams] = useSearchParams();

  // Check if the user is coming from a successful checkout
  useEffect(() => {
    const checkoutStatus = searchParams.get("checkout");
    if (checkoutStatus === "success") {
      toast.success("Abbonamento attivato con successo!");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First try to fetch from our database
        const { data: userData, error } = await supabase
          .from('subscribers')
          .select('subscription_tier, credits')
          .eq('user_id', session.user.id)
          .single();

        if (userData) {
          setPlan(userData.subscription_tier || "Free");
          setCredits(userData.credits || 0);
        } else {
          // If no data in database, fetch from the API
          const { data, error: fnError } = await supabase.functions.invoke('check-subscription');
          
          if (fnError) {
            console.error("Error checking subscription:", fnError);
            toast.error("Errore nel caricamento dati abbonamento");
          } else if (data) {
            setPlan(data.subscription_tier || "Free");
            setCredits(data.credits || 0);
          }
        }
      } catch (err) {
        console.error("Errore nel caricamento dati utente", err);
        toast.error("Errore nel caricamento dei dati utente");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, supabase]);

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6">La tua Dashboard</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Il tuo account</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-lg">Caricamento dati...</p>
            ) : !session ? (
              <div className="flex flex-col items-start gap-4">
                <p className="text-lg">Accedi per visualizzare i dettagli del tuo account</p>
                <a 
                  href="/login" 
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Login
                </a>
              </div>
            ) : (
              <>
                <p className="text-lg mb-2">
                  Abbonamento attivo:{" "}
                  <span className="font-semibold text-purple-500">
                    {plan || "Free"}
                  </span>
                </p>
                <p className="text-lg">
                  Crediti disponibili:{" "}
                  <span className="font-semibold text-purple-500">
                    {credits ?? "--"}
                  </span>
                </p>
                <div className="mt-4">
                  <a 
                    href="/#pricing" 
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Aggiorna il tuo piano
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {miniApps.map((app, idx) => {
            const Icon = app.icon;
            return (
              <motion.a
                key={app.id}
                href={app.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{app.name}</h3>
                      <span className="text-purple-400 hover:underline">
                        Vai →
                      </span>
                    </div>
                    <Icon className="h-6 w-6 text-purple-500" />
                  </CardContent>
                </Card>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
