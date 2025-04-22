
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, FileCode, Mic } from 'lucide-react';

const miniApps = [
  {
    id: 1,
    name: "Generatore PDF",
    description: "Crea PDF personalizzati da testi, immagini e template pronti all'uso.",
    icon: FileText,
    href: "/dashboard/pdf"
  },
  {
    id: 2,
    name: "Generatore Immagini",
    description: "Crea immagini e illustrazioni uniche tramite intelligenza artificiale.",
    icon: Image,
    href: "/dashboard/image"
  },
  {
    id: 3,
    name: "Assistente Codice",
    description: "Ottieni suggerimenti, correzioni o ottimizzazioni per il tuo codice.",
    icon: FileCode,
    href: "/dashboard/code"
  },
  {
    id: 4,
    name: "Trascrizione Audio",
    description: "Converti file audio in testo con precisione e in diverse lingue.",
    icon: Mic,
    href: "/dashboard/audio"
  }
];

export const MiniAppGrid = () => {
  return (
    <section 
      id="mini-apps" 
      className="w-full px-6 py-24 bg-gradient-to-br from-[#0d0f11] via-[#101216] to-[#0a0c10] text-gray-100 dark:text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
          Le nostre Mini App AI
        </h2>
        <p className="text-gray-400 mb-12 text-lg">
          Soluzioni pronte all'uso per incrementare la tua produttività
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {miniApps.map((app, index) => {
            const Icon = app.icon;
            return (
              <motion.a
                href={app.href}
                key={app.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/10 border border-white/20 rounded-xl p-6 shadow-md backdrop-blur-sm transition-all hover:shadow-glow hover:border-white/40"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-white/80">{app.description}</p>
                <span className="inline-block mt-4 text-sm font-medium text-white hover:underline">
                  Prova demo →
                </span>
              </motion.a>
            )
          })}
        </div>
      </motion.div>
    </section>
  );
};
