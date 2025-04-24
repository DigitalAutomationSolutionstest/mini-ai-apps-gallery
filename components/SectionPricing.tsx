'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CurrencyEuroIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import CheckoutButton from './CheckoutButton'
import { API_URL } from '@/lib/env'

type Price = {
  id: string
  nickname: string
  unit_amount: number
  product: {
    name: string
    description: string
    category: string
  }
}

export default function SectionPricing() {
  const [prices, setPrices] = useState<Price[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true)
        setError('')
        const res = await fetch(`${API_URL}/api/stripe/prices`)
        if (!res.ok) throw new Error('Errore nel caricamento dei prezzi')
        const data = await res.json()

        if (Array.isArray(data)) {
          const validPrices = data.filter((price): price is Price => {
            return (
              price &&
              typeof price === 'object' &&
              'id' in price &&
              'nickname' in price &&
              'unit_amount' in price &&
              'product' in price &&
              typeof price.product === 'object' &&
              'name' in price.product &&
              'description' in price.product &&
              'category' in price.product
            )
          })
          
          // Ordina i prezzi per unit_amount crescente
          const sorted = validPrices.sort((a, b) => a.unit_amount - b.unit_amount)
          setPrices(sorted)
        } else {
          throw new Error('Formato dati non valido')
        }
      } catch (err) {
        console.error('Errore nel fetch dei prezzi:', err)
        setError('Impossibile caricare i piani. Riprova più tardi.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-[#0a0a0a] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-10">Prezzi trasparenti</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-[#0a0a0a] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-10">Prezzi trasparenti</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10">Prezzi trasparenti</h2>

        {prices.length === 0 ? (
          <p className="text-gray-400">Impossibile caricare i piani. Riprova più tardi.</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {prices.map((price, index) => (
                <motion.div
                  key={price.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-zinc-900 p-6 rounded-xl shadow-md flex flex-col justify-between hover:scale-105 transition-all duration-300"
                >
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-purple-400">
                      {price.product.name}
                    </h3>
                    <p className="text-gray-300">{price.product.description}</p>
                  </motion.div>
                  <motion.div 
                    className="mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <p className="text-3xl font-extrabold text-white mb-2 flex items-baseline gap-1">
                      <CurrencyEuroIcon className="w-5 h-5 text-purple-400" />
                      {(price.unit_amount / 100).toFixed(2)}
                      <span className="text-sm text-gray-400 ml-1">/mese</span>
                    </p>
                    <CheckoutButton priceId={price.id} />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
