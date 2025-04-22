'use client'
import React from 'react'
import { motion } from 'framer-motion'

const benefits = [
  {
    title: "Rapidità di Sviluppo",
    description: "Consegna veloce delle applicazioni grazie al nostro builder intuitivo",
    icon: "⚡"
  },
  {
    title: "Scalabilità",
    description: "Architettura modulare che cresce con le tue esigenze",
    icon: "📈"
  },
  {
    title: "Personalizzazione",
    description: "Interfacce e funzionalità completamente personalizzabili",
    icon: "🎯"
  },
  {
    title: "Supporto 24/7",
    description: "Assistenza tecnica dedicata sempre disponibile",
    icon: "💬"
  }
]

export default function SectionBenefits() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Perché Scegliere <span className="text-primary">Noi</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Vantaggi esclusivi per il tuo progetto AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-4 p-6 bg-gray-900/50 rounded-xl border border-gray-800"
            >
              <div className="text-3xl">{benefit.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 