
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("Email o password non validi. Controlla le tue credenziali e riprova.");
        } else {
          toast.error(error.message);
        }
        console.error("Login error:", error);
        return;
      }

      if (data?.user) {
        navigate("/dashboard");
        toast.success("Login effettuato con successo!");
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
      toast.error("Si è verificato un errore durante il login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/dashboard"
        }
      });

      if (error) {
        if (error.message === "User already registered") {
          toast.error("Questo indirizzo email è già registrato. Prova ad accedere invece.");
        } else {
          toast.error(error.message);
        }
        console.error("Registration error:", error);
        return;
      }

      if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          toast.error("Questo indirizzo email è già registrato. Prova ad accedere invece.");
        } else {
          toast.success("Registrazione effettuata! Controlla la tua email per confermare la registrazione.");
          toast.info("Non hai ricevuto l'email? Controlla la cartella spam o accedi direttamente se l'email è già stata confermata.");
        }
      }
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      toast.error("Si è verificato un errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <Card className="w-full max-w-md bg-[#1A1F2C] border border-purple-900">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Account Mini AI Hub
          </CardTitle>
          <CardDescription className="text-center">
            Accedi o registrati per utilizzare le funzionalità del Mini AI Hub
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#252a38]">
            <TabsTrigger value="login">Accedi</TabsTrigger>
            <TabsTrigger value="register">Registrati</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="email@esempio.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#252a38] border-purple-800"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <a href="#" className="text-xs text-purple-400 hover:text-purple-300">
                      Password dimenticata?
                    </a>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#252a38] border-purple-800"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? "Caricamento..." : "Accedi"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="email@esempio.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#252a38] border-purple-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#252a38] border-purple-800"
                  />
                  <p className="text-xs text-gray-400">
                    La password deve contenere almeno 6 caratteri
                  </p>
                </div>
                <p className="text-amber-300 text-xs">
                  Nota: In fase di sviluppo, potrebbe essere necessario disabilitare la verifica email in Supabase.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  {loading ? "Caricamento..." : "Registrati"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}
