
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Code, Rocket } from "lucide-react";

const Workshop = () => {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">AI Workshop</h1>
        <p className="text-lg text-muted-foreground">
          Crea e personalizza la tua Mini App AI con il nostro workshop interattivo
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <PlusCircle className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Crea Nuova Mini App</CardTitle>
            <CardDescription>
              Inizia a creare una nuova Mini App AI partendo da zero
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Crea Nuovo Progetto
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Usa Template</CardTitle>
            <CardDescription>
              Scegli un template preconfigurato per la tua Mini App AI
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button variant="outline" className="w-full">
              Sfoglia Template
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Processo di Sviluppo</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                1
              </div>
              <CardTitle className="text-lg">Progettazione</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-center">
                <Code className="h-16 w-16 text-purple-300" />
              </div>
              <p className="text-sm text-muted-foreground">
                Definisci le funzionalità e il comportamento della tua Mini App
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                2
              </div>
              <CardTitle className="text-lg">Sviluppo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-center">
                <Code className="h-16 w-16 text-purple-300" />
              </div>
              <p className="text-sm text-muted-foreground">
                Personalizza il codice e le integrazioni con l'intelligenza artificiale
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                3
              </div>
              <CardTitle className="text-lg">Pubblicazione</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-center">
                <Rocket className="h-16 w-16 text-purple-300" />
              </div>
              <p className="text-sm text-muted-foreground">
                Pubblica e condividi la tua Mini App con altri utenti
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Workshop;
