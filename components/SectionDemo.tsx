'use client'

import { motion } from 'framer-motion'
import MiniAppDemo from './MiniAppDemo'

export default function SectionDemo() {
  return (
    <section id="demo" className="py-20 bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Prova le nostre Mini App AI</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Esplora le nostre applicazioni di intelligenza artificiale e scopri come possono migliorare il tuo lavoro.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8"
        >
          <MiniAppDemo
            title="Generatore Report AI"
            description="Inserisci un testo e genera un report professionale in formato testo. Ideale per riassumere documenti, creare report di analisi o sintetizzare informazioni complesse."
            apiEndpoint="/api/miniapps/generate-report"
          />
          
          {/* Qui puoi aggiungere altre Mini App in futuro */}
        </motion.div>
      </div>
    </section>
  )
} 