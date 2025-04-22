'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckoutButtonProps {
  priceId: string
}

export default function CheckoutButton({ priceId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })
      
      const data = await response.json()
      
      if (data.url) {
        // Se l'URL è una pagina di errore, reindirizza direttamente
        if (data.url.includes('/error')) {
          router.push(data.url)
        } else {
          // Altrimenti, reindirizza alla pagina di checkout di Stripe
          window.location.href = data.url
        }
      } else {
        throw new Error('URL di checkout non disponibile')
      }
    } catch (error) {
      console.error('Errore durante il checkout:', error)
      // Reindirizza alla pagina di errore con il messaggio
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il checkout'
      router.push(`/error?error=${encodeURIComponent(errorMessage)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="mt-6 w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium py-2 px-4 rounded transition-colors"
    >
      {loading ? 'Elaborazione...' : 'Acquista ora'}
    </button>
  )
}