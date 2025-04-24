import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mini AI Hub - Applicazioni AI Personalizzate',
  description: 'Crea mini applicazioni web intelligenti con AI. Semplice, veloce e senza codice.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <style jsx global>{`
          body {
            background-color: #0a0a0a;
            color: white;
            min-height: 100vh;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
