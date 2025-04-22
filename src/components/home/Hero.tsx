
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <div className="relative flex min-h-[50vh] flex-col items-center justify-center py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-3xl px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="h-12 w-12 text-purple-600 dark:text-purple-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a8 8 0 0 1 8 8v12l-4-4H4a8 8 0 0 1 0-16Z" />
            <path d="M12 11v.01" />
            <path d="M8 11v.01" />
            <path d="M16 11v.01" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Crea la tua Mini App AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6 text-xl text-muted-foreground"
        >
          Soluzioni intelligenti, modulari e accessibili a tutti
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700">
            Scopri le Mini App
          </Button>
          <Button size="lg" variant="outline" className="border-purple-200 bg-white text-purple-600 hover:bg-purple-50">
            Richiedi la tua AI App
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
