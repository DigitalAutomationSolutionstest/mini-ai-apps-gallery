'use client'
import {
  CpuChipIcon,
  RocketLaunchIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline'
import DemoModal from './DemoModal'

const services = [
  {
    icon: <CpuChipIcon className="w-8 h-8 text-fuchsia-400" />,
    title: 'App AI su misura',
    description: 'Sviluppiamo applicazioni AI personalizzate per il tuo business.',
  },
  {
    icon: <RocketLaunchIcon className="w-8 h-8 text-blue-400" />,
    title: 'Landing Page AI',
    description: 'Creiamo landing page con AI per aumentare le conversioni.',
  },
  {
    icon: <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-cyan-400" />,
    title: 'Chatbot Avanzati',
    description: 'Implementiamo chatbot intelligenti per supporto 24/7.',
  },
]

export default function SectionServices() {
  return (
    <section id="servizi" className="py-20 px-6 bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">I Nostri Servizi</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="bg-zinc-900/80 p-6 rounded-xl shadow-md hover:scale-105 transition border border-zinc-800">
              <div className="mb-4">{s.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-300 mb-3">{s.description}</p>
              <DemoModal title={s.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 