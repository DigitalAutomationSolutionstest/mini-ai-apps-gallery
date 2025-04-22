
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const featuredApps = [
  {
    id: 1,
    title: 'Mini App Assistente',
    description: 'Assistente virtuale personalizzabile per il tuo business',
    category: 'Assistente',
    icon: '🤖',
  },
  {
    id: 2,
    title: 'Mini App Summarizer',
    description: 'Genera riassunti da lunghi testi e documenti in pochi secondi',
    category: 'Produttività',
    icon: '📝',
  },
  {
    id: 3,
    title: 'Mini App Traduttore',
    description: 'Traduci istantaneamente in oltre 40 lingue diverse',
    category: 'Linguaggio',
    icon: '🌍',
  },
  {
    id: 4,
    title: 'Mini App Analisi Dati',
    description: 'Analizza e visualizza i tuoi dati con l\'intelligenza artificiale',
    category: 'Analisi',
    icon: '📊',
  },
  {
    id: 5,
    title: 'Mini App Generatore Immagini',
    description: 'Crea immagini uniche partendo da semplici descrizioni testuali',
    category: 'Creatività',
    icon: '🎨',
  },
  {
    id: 6,
    title: 'Mini App Voice Assistant',
    description: 'Converti la voce in testo e interagisci tramite comandi vocali',
    category: 'Audio',
    icon: '🎤',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FeaturedGrid() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            Soluzioni AI in Evidenza
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Scopri le mini app più popolari e inizia a utilizzare l'intelligenza artificiale per migliorare il tuo lavoro
          </p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featuredApps.map((app) => (
            <motion.div key={app.id} variants={item}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="mb-2 text-3xl">{app.icon}</div>
                  <CardTitle>{app.title}</CardTitle>
                  <CardDescription>
                    <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                      {app.category}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{app.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                    Scopri di più
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
