
import React, { useState } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { LogOut, CreditCard } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface UserSettingsProps {
  email?: string;
  onLogout?: () => void;
}

export default function UserSettings({
  email,
  onLogout,
}: UserSettingsProps) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [loadingCredits, setLoadingCredits] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  };

  const handleAddCredits = async () => {
    if (!session) {
      toast.error("Devi effettuare l'accesso per acquistare crediti");
      return;
    }

    setLoadingCredits(true);
    try {
      // Get the current session token
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession?.access_token) {
        toast.error("Sessione non valida, effettua nuovamente il login");
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount: 5 }, // €5 = 50 crediti
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`
        }
      });
      
      if (error) {
        console.error("Errore durante l'acquisto crediti", error);
        toast.error(`Errore durante l'acquisto crediti: ${error.message}`);
        return;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Errore durante la creazione del checkout");
      }
    } catch (err) {
      console.error("Errore durante l'acquisto crediti", err);
      toast.error("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setLoadingCredits(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!session) {
      toast.error("Devi effettuare l'accesso per gestire l'abbonamento");
      return;
    }

    setLoadingPortal(true);
    try {
      // Get the current session token
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession?.access_token) {
        toast.error("Sessione non valida, effettua nuovamente il login");
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`
        }
      });
      
      if (error) {
        console.error("Errore nell'accesso al portale", error);
        toast.error(`Errore nell'accesso al portale clienti: ${error.message}`);
        return;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Errore durante la creazione della sessione");
      }
    } catch (err) {
      console.error("Errore nell'accesso al portale", err);
      toast.error("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="bg-[#1A1F2C] p-8 rounded-2xl shadow-lg max-w-md w-full mx-auto border border-purple-900">
      <h2 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
        <CreditCard className="text-purple-400" size={24} /> Impostazioni Utente
      </h2>
      <p className="mb-2 text-white/90">
        <span className="font-medium text-purple-300">Email:</span> {email || session?.user?.email}
      </p>
      <p className="mb-6 text-sm text-purple-200">
        Gestisci il tuo abbonamento o esci dall'account.
      </p>

      <Button
        variant="default"
        onClick={handleManageSubscription}
        disabled={loadingPortal}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white hover:from-purple-700 hover:to-purple-500 font-semibold mb-4"
      >
        <CreditCard className="mr-2" /> 
        {loadingPortal ? "Caricamento..." : "Gestisci abbonamento"}
      </Button>

      <button
        onClick={handleAddCredits}
        disabled={loadingCredits}
        className="mt-2 w-full bg-teal-600 px-5 py-2 rounded text-sm font-medium hover:bg-teal-700 transition"
      >
        {loadingCredits ? "Attendi..." : "Aggiungi Crediti"}
      </button>

      <Button
        variant="secondary"
        onClick={handleLogout}
        className="w-full bg-white text-purple-700 hover:bg-purple-50 flex items-center justify-center mt-4"
      >
        <LogOut className="mr-2" /> Logout
      </Button>
    </div>
  );
}
