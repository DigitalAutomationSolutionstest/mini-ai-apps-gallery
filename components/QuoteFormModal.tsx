'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function QuoteFormModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white text-black p-6 shadow-xl transition-all w-full max-w-lg">
                <div className="absolute top-4 right-4">
                  <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <Dialog.Title as="h3" className="text-2xl font-semibold text-center mb-4">
                  Richiedi un preventivo gratuito
                </Dialog.Title>
                <form className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium">Nome</label>
                    <input type="text" className="w-full rounded border p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input type="email" className="w-full rounded border p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Descrizione del progetto</label>
                    <textarea rows={4} className="w-full rounded border p-2" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                  >
                    Invia richiesta
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 