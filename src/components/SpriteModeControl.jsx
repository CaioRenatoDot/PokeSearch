import { motion } from "motion/react";
import { spriteModes } from "../utils/pokemonSprites.js";

export default function SpriteModeControl({ value, onChange }) {
  return (
    <div className="mt-5">
      <p className="mb-2 font-pixel text-base font-black uppercase leading-5 text-emerald-950/60">Sprite</p>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {spriteModes.map(mode => {
          const isActive = mode.id === value;

          return (
            <motion.button
              key={mode.id}
              className={`rounded border-2 px-2 py-2 font-pixel text-sm font-black uppercase leading-5 transition sm:px-3 sm:text-base ${
                isActive
                  ? "border-dex-dark bg-amber-300 text-dex-ink shadow-[inset_0_-3px_0_rgba(91,55,0,0.18)]"
                  : "border-emerald-950/20 bg-white/55 text-emerald-950/70 hover:bg-white/75"
              }`}
              type="button"
              onClick={() => onChange(mode.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
