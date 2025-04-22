
import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -100]);

  return (
    <section className="relative h-screen overflow-hidden snap-start">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30">
          <source src="/assets/videos/mesh-tech.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center"
        >
          Potenzia il tuo business con l'AI
        </motion.h2>
      </div>
    </section>
  );
}
