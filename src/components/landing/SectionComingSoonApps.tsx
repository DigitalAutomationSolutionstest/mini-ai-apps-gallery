
import { motion } from "framer-motion";
import { RocketIcon, WrenchIcon, PuzzleIcon } from "lucide-react";

const apps = [
  {
    name: "AI Video Generator",
    desc: "Crea video da testo o prompt, perfetti per reels, promo e ads.",
    icon: <RocketIcon className="w-6 h-6 text-white" />,
  },
  {
    name: "AI Chatbot Builder",
    desc: "Crea chatbot addestrati per siti, e-commerce, o servizi interni.",
    icon: <PuzzleIcon className="w-6 h-6 text-white" />,
  },
  {
    name: "Blender AI Agent",
    desc: "Controlla Blender via prompt: genera, anima, esporta in 3D.",
    icon: <WrenchIcon className="w-6 h-6 text-white" />,
  },
];

export const SectionComingSoonApps = () => {
  return (
    <section
      id="coming-soon"
      className="scroll-snap-start relative py-24 px-6 sm:px-10 bg-gradient-to-br from-[#0d0f11] via-[#101216] to-[#0a0c10] text-gray-100 dark:text-white"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
        >
          Mini App in arrivo 🚧
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12 text-lg text-gray-300"
        >
          Stiamo sviluppando nuove AI App per espandere la tua produttività. Ecco cosa bolle in pentola:
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {apps.map((app, i) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4">{app.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{app.name}</h3>
              <p className="text-sm text-gray-300">{app.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
