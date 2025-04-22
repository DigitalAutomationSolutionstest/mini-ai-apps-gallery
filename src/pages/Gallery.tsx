
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const galleryItems = [
  {
    id: 1,
    title: "Assistente Virtuale",
    description: "Interagisci con un assistente AI personalizzato",
    image: "/placeholder.svg",
    category: "Assistente",
  },
  {
    id: 2,
    title: "Traduttore Universale",
    description: "Traduci testi in oltre 40 lingue diverse",
    image: "/placeholder.svg",
    category: "Linguaggio",
  },
  {
    id: 3,
    title: "Generatore di Contenuti",
    description: "Crea articoli, post e descrizioni con l'AI",
    image: "/placeholder.svg",
    category: "Contenuti",
  },
  {
    id: 4,
    title: "Analisi Dati",
    description: "Analizza e visualizza dati complessi",
    image: "/placeholder.svg",
    category: "Analisi",
  },
  {
    id: 5,
    title: "Generatore di Immagini",
    description: "Crea immagini uniche partendo da descrizioni testuali",
    image: "/placeholder.svg",
    category: "Creatività",
  },
  {
    id: 6,
    title: "Summarizer",
    description: "Riassumi documenti e articoli lunghi in pochi secondi",
    image: "/placeholder.svg",
    category: "Produttività",
  },
  {
    id: 7,
    title: "Voice Assistant",
    description: "Converti audio in testo e interagisci tramite voce",
    image: "/placeholder.svg",
    category: "Audio",
  },
  {
    id: 8,
    title: "Chatbot Personalizzato",
    description: "Crea un chatbot per il tuo sito web o applicazione",
    image: "/placeholder.svg",
    category: "Comunicazione",
  },
];

const Gallery = () => {
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Mini Apps Gallery</h1>
        <p className="text-lg text-muted-foreground">
          Esplora la nostra collezione di Mini Apps basate su AI
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {galleryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-video overflow-hidden bg-muted">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <CardHeader className="p-4 pb-0">
              <div className="mb-2">
                <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  {item.category}
                </span>
              </div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">Apri Mini App</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
