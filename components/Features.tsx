'use client'
import React from 'react'
import { motion } from 'framer-motion'

const features = [
  {
    title: "Builder Intuitivo",
    description: "Crea la tua mini app AI con un'interfaccia drag & drop. Nessuna programmazione richiesta.",
    icon: "🎨"
  },
  {
    title: "Integrazione AI",
    description: "Collega facilmente i modelli AI più popolari: OpenAI, Claude, Hugging Face e altri.",
    icon: "🤖"
  },
  {
    title: "Deploy Istantaneo",
    description: "Pubblica la tua app in un click. Hosting ottimizzato e scalabile incluso.",
    icon: "🚀"
  },
  {
    title: "Analytics Avanzate",
    description: "Monitora l'utilizzo, le performance e il feedback degli utenti in tempo reale.",
    icon: "📊"
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Tutto ciò che serve per creare app AI
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Strumenti potenti e intuitivi per trasformare le tue idee in realtà
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 