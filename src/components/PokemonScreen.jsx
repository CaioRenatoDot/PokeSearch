import { AnimatePresence, motion } from "motion/react";
import EmptyState from "./EmptyState.jsx";
import PokemonCard from "./PokemonCard.jsx";
import PixelReveal from "./PixelReveal.jsx";

export default function PokemonScreen({ pokemon, status, message }) {
  return (
    <motion.section
      className="relative min-h-[70dvh] overflow-hidden rounded-lg border-[7px] border-dex-dark bg-dex-screen shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),inset_0_0_52px_rgba(18,48,46,0.2)] sm:border-[10px] lg:h-full lg:min-h-0 lg:rounded-l-none"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08, duration: 0.48, ease: "easeOut" }}
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3 bg-gradient-to-b from-transparent via-white/35 to-transparent"
        animate={{ y: ["-120%", "320%"] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: status === "loading" ? 0.2 : 2.4,
          ease: "easeInOut"
        }}
      />
      <div className="screen-lines pointer-events-none absolute inset-0" />

      <div className="relative z-0 flex h-full min-h-[64dvh] p-3 sm:min-h-[70dvh] sm:p-6 lg:min-h-0 lg:p-8">
        <AnimatePresence mode="wait">
          {status === "ready" && pokemon ? (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ) : (
            <EmptyState key={status} status={status} message={message} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {status === "ready" && pokemon ? <PixelReveal key={`pixels-${pokemon.id}`} triggerKey={pokemon.id} /> : null}
      </AnimatePresence>
    </motion.section>
  );
}
