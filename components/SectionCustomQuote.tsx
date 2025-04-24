'use client'

import { useState } from 'react'
import { LightBulbIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import QuoteFormModal from '@/components/QuoteFormModal'

export default function SectionCustomQuote() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section id="richiedi" className="bg-[#0a0a0a] text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <LightBulbIcon className="mx-auto h-12 w-12 text-fuchsia-500 mb-4" />
        <h2 className="text-4xl font-bold mb-6">Hai bisogno di una soluzione su misura?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Realizziamo app AI e siti web personalizzati per ogni esigenza: dal portfolio minimal al portale per agenzie, dalla dashboard con API al sistema di prenotazioni automatizzato.
          <br />
          I prezzi variano da <span className="font-semibold text-white">€99</span> per soluzioni semplici fino a <span className="font-semibold text-white">€1200+</span> per progetti avanzati full custom. 
          Il costo è giustificato da:
        </p>

        <ul className="text-left text-gray-300 max-w-2xl mx-auto mb-8 space-y-2">
          {[
            'Livello di personalizzazione richiesto',
            'Numero di funzionalità, API e automazioni incluse',
            'Integrazioni con Stripe, Supabase, AI APIs, CMS o CRM',
            'Design UI/UX, animazioni e performance responsive',
            'Velocità di consegna (fast delivery disponibile)'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircleIcon className="h-5 w-5 text-fuchsia-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-fuchsia-600 text-white px-8 py-3 rounded-xl hover:bg-fuchsia-700 hover:scale-105 transition shadow-lg flex items-center gap-2 mx-auto"
        >
          <DocumentTextIcon className="h-5 w-5" />
          Richiedi un preventivo gratuito
        </button>
      </div>

      <QuoteFormModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </section>
  )
} 