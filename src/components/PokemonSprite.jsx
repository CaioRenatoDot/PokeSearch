import { motion } from "motion/react";
import { formatName } from "../utils/formatters.js";
import { getPokemonSprite } from "../utils/pokemonSprites.js";

export default function PokemonSprite({ pokemon, compact = false, mode = "animated" }) {
  const sprite = getPokemonSprite(pokemon, mode);

  return (
    <motion.div
      className="relative grid h-full w-full place-items-center"
      initial={{ opacity: 0, y: 28, scale: 0.86, rotate: -3 }}
      animate={{
        opacity: 1,
        y: [0, -7, 0],
        scale: 1,
        rotate: sprite.isAnimated ? [0, -0.6, 0.6, 0] : 0
      }}
      transition={{
        opacity: { delay: 0.08, duration: 0.4, ease: "easeOut" },
        scale: { delay: 0.08, duration: 0.52, ease: "easeOut" },
        rotate: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
      }}
      whileHover={{ scale: 1.025, y: -6 }}
    >
      <motion.div
        className={`absolute rounded-full bg-emerald-950/18 blur-sm ${compact ? "bottom-[6%] h-6 w-36" : "bottom-[8%] h-10 w-56"}`}
        animate={{ scaleX: [1, 0.86, 1], opacity: [0.22, 0.12, 0.22] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <img
        className={`relative z-10 h-full w-full object-contain drop-shadow-[0_26px_22px_rgba(18,48,46,0.22)] ${
          sprite.isAnimated
            ? compact
              ? "max-h-[24vh] max-w-[74%] xl:max-h-[30vh] xl:max-w-[74%] [image-rendering:pixelated]"
              : "max-h-[32vh] max-w-[90%] sm:max-h-[39vh] xl:max-h-[58vh] xl:max-w-[90%] [image-rendering:pixelated]"
            : compact
              ? "max-h-[28vh] max-w-[78%] xl:max-h-[34vh] xl:max-w-[78%]"
              : "max-h-[36vh] max-w-[92%] sm:max-h-[43vh] xl:max-h-[68vh] xl:max-w-[92%]"
        }`}
        src={sprite.src}
        alt={formatName(pokemon.name)}
      />
    </motion.div>
  );
}
