
import React from "react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

export default function PdfGenerator() {
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const handleGeneratePdf = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Inserisci sia un titolo che del contenuto");
      return;
    }

    setLoading(true);
    try {
      // Simulazione della generazione PDF - in produzione useremmo un'API reale
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulazione di download
      toast.success("PDF generato con successo!");
      
      // In un'implementazione reale, qui richiameremmo un endpoint che genera e restituisce il PDF
    } catch (error) {
      console.error("Errore nella generazione del PDF:", error);
      toast.error("Si è verificato un errore durante la generazione del PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Generatore PDF</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Configura il tuo documento</CardTitle>
              <CardDescription>
                Inserisci il contenuto del tuo PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Titolo del documento
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Inserisci il titolo"
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-1">
                    Contenuto
                  </label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Scrivi il contenuto del tuo documento..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGeneratePdf} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Generazione in corso..." : "Genera PDF"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Anteprima</CardTitle>
              <CardDescription>
                Visualizzazione del documento
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[300px] bg-gray-100 dark:bg-gray-800 rounded-md">
              {!title && !content ? (
                <div className="text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-3 opacity-40" />
                  <p>Aggiungi contenuto per visualizzare l'anteprima</p>
                </div>
              ) : (
                <div className="w-full max-w-md p-4 bg-white dark:bg-gray-900 shadow-sm rounded-md">
                  <h2 className="text-xl font-bold mb-2">{title || "Senza titolo"}</h2>
                  <p className="whitespace-pre-line">{content || "Nessun contenuto"}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
