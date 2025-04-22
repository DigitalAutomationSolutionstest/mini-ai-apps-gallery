
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code, FileText, Lightbulb, MessagesSquare } from "lucide-react";

const Documentation = () => {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Documentazione</h1>
        <p className="text-lg text-muted-foreground">
          Tutto ciò che devi sapere per utilizzare e sviluppare Mini Apps AI
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md">
          <CardHeader>
            <BookOpen className="mb-2 h-8 w-8 text-purple-600" />
            <CardTitle>Guida introduttiva</CardTitle>
            <CardDescription>
              Inizia il tuo percorso nello sviluppo di Mini Apps AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-purple-600 hover:underline">
                <a href="#">Introduzione alle Mini Apps</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Requisiti e configurazione</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Primi passi con la piattaforma</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Concetti fondamentali</a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md">
          <CardHeader>
            <Code className="mb-2 h-8 w-8 text-purple-600" />
            <CardTitle>Guida per sviluppatori</CardTitle>
            <CardDescription>
              Documentazione tecnica per la creazione di Mini Apps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-purple-600 hover:underline">
                <a href="#">Architettura delle Mini Apps</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">API di integrazione</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Personalizzazione dell'interfaccia</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Best practices di sviluppo</a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md">
          <CardHeader>
            <FileText className="mb-2 h-8 w-8 text-purple-600" />
            <CardTitle>Riferimento API</CardTitle>
            <CardDescription>
              Documentazione dettagliata delle API disponibili
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-purple-600 hover:underline">
                <a href="#">API di elaborazione del linguaggio</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">API di generazione di contenuti</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">API di analisi dati</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">API di integrazione con servizi esterni</a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md">
          <CardHeader>
            <Lightbulb className="mb-2 h-8 w-8 text-purple-600" />
            <CardTitle>Tutorial e esempi</CardTitle>
            <CardDescription>
              Guide passo-passo per creare Mini Apps di esempio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-purple-600 hover:underline">
                <a href="#">Creare un assistente virtuale</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Sviluppare un analizzatore di testi</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Costruire un generatore di immagini</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Implementare un traduttore multilingua</a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md">
          <CardHeader>
            <MessagesSquare className="mb-2 h-8 w-8 text-purple-600" />
            <CardTitle>Community e supporto</CardTitle>
            <CardDescription>
              Risorse per ottenere aiuto e condividere conoscenze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-purple-600 hover:underline">
                <a href="#">Forum della community</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Canale Discord</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">FAQ e risoluzione problemi</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Contatta il supporto</a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md">
          <CardHeader>
            <BookOpen className="mb-2 h-8 w-8 text-purple-600" />
            <CardTitle>Risorse aggiuntive</CardTitle>
            <CardDescription>
              Materiali complementari per approfondire le tue conoscenze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-purple-600 hover:underline">
                <a href="#">Webinar e corsi video</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Libreria di risorse</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Blog e articoli tecnici</a>
              </li>
              <li className="text-purple-600 hover:underline">
                <a href="#">Casi di studio</a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
