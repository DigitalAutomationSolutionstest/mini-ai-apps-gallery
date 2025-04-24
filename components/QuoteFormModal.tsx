'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, EnvelopeIcon, UserIcon, DocumentTextIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

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
          <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-[#0a0a0a] text-white p-6 shadow-xl transition-all w-full max-w-lg border border-zinc-800">
                <div className="absolute top-4 right-4">
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <Dialog.Title as="h3" className="text-2xl font-semibold text-center mb-4">
                  Richiedi un preventivo gratuito
                </Dialog.Title>
                <form className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Nome
                    </label>
                    <input type="text" className="w-full rounded bg-zinc-800 border border-zinc-700 p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      Email
                    </label>
                    <input type="email" className="w-full rounded bg-zinc-800 border border-zinc-700 p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <DocumentTextIcon className="h-4 w-4" />
                      Descrizione del progetto
                    </label>
                    <textarea rows={4} className="w-full rounded bg-zinc-800 border border-zinc-700 p-2 text-white" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 rounded transition flex items-center justify-center gap-2"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
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