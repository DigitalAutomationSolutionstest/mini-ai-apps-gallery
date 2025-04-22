'use client'

import { useState } from 'react'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import QuoteFormModal from '@/components/QuoteFormModal'

export default function SectionCustomQuote() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section id="richiedi" className="bg-zinc-950 text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <LightBulbIcon className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-4xl font-bold mb-6">Hai bisogno di una soluzione su misura?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Realizziamo app AI e siti web personalizzati per ogni esigenza: dal portfolio minimal al portale per agenzie, dalla dashboard con API al sistema di prenotazioni automatizzato.
          <br />
          I prezzi variano da <span className="font-semibold text-white">€99</span> per soluzioni semplici fino a <span className="font-semibold text-white">€1200+</span> per progetti avanzati full custom. 
          Il costo è giustificato da:
        </p>

        <ul className="text-left text-gray-300 list-disc list-inside max-w-2xl mx-auto mb-8">
          <li>Livello di personalizzazione richiesto</li>
          <li>Numero di funzionalità, API e automazioni incluse</li>
          <li>Integrazioni con Stripe, Supabase, AI APIs, CMS o CRM</li>
          <li>Design UI/UX, animazioni e performance responsive</li>
          <li>Velocità di consegna (fast delivery disponibile)</li>
        </ul>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-8 py-3 rounded-xl hover:scale-105 transition shadow-lg"
        >
          Richiedi un preventivo gratuito
        </button>
      </div>

      <QuoteFormModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </section>
  )
} 