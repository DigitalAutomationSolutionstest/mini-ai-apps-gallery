
import React from "react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Loader2 } from "lucide-react";

export default function ImageGenerator() {
  const [loading, setLoading] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [styleOption, setStyleOption] = React.useState("realistic");
  const [generatedImage, setGeneratedImage] = React.useState("");

  const styleOptions = [
    { value: "realistic", label: "Realistico" },
    { value: "cartoon", label: "Cartone animato" },
    { value: "abstract", label: "Astratto" },
    { value: "painting", label: "Dipinto" },
    { value: "sketch", label: "Schizzo" },
  ];

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Inserisci una descrizione per l'immagine");
      return;
    }

    setLoading(true);
    try {
      // Simulazione della generazione dell'immagine - in produzione useremmo un'API reale
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Per demo, usiamo un'immagine di placeholder
      setGeneratedImage("https://placehold.co/600x400/9333ea/ffffff?text=AI+Generated+Image");
      
      toast.success("Immagine generata con successo!");
      
      // In un'implementazione reale, qui richiameremmo un endpoint che genera e restituisce l'immagine
    } catch (error) {
      console.error("Errore nella generazione dell'immagine:", error);
      toast.error("Si è verificato un errore durante la generazione dell'immagine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Generatore Immagini</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Crea la tua immagine AI</CardTitle>
              <CardDescription>
                Descrivi l'immagine che vorresti generare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                    Descrizione dell'immagine
                  </label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Descrivi dettagliatamente l'immagine che vuoi generare..."
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <label htmlFor="style" className="block text-sm font-medium mb-1">
                    Stile artistico
                  </label>
                  <Select value={styleOption} onValueChange={setStyleOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona uno stile" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateImage} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generazione in corso...
                  </>
                ) : (
                  "Genera Immagine"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Anteprima</CardTitle>
              <CardDescription>
                L'immagine generata apparirà qui
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[350px] bg-gray-100 dark:bg-gray-800 rounded-md">
              {generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Immagine generata" 
                  className="max-w-full max-h-[300px] rounded-md shadow-lg"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Image className="w-16 h-16 mx-auto mb-3 opacity-40" />
                  <p>Nessuna immagine ancora generata</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
