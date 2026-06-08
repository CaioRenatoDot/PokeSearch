import { motion } from "motion/react";
import { statLabels } from "../data/pokemon.js";
import { formatName } from "../utils/formatters.js";

const totalSegments = 16;

const statThemes = {
  hp: {
    fill: "bg-[#58d36f]",
    glow: "shadow-[0_0_10px_rgba(88,211,111,0.55)]",
    label: "text-[#245f34]"
  },
  attack: {
    fill: "bg-[#f15c45]",
    glow: "shadow-[0_0_10px_rgba(241,92,69,0.48)]",
    label: "text-[#7b2d25]"
  },
  defense: {
    fill: "bg-[#f1c84b]",
    glow: "shadow-[0_0_10px_rgba(241,200,75,0.52)]",
    label: "text-[#715713]"
  },
  "special-attack": {
    fill: "bg-[#7cb7ff]",
    glow: "shadow-[0_0_10px_rgba(124,183,255,0.5)]",
    label: "text-[#28598d]"
  },
  "special-defense": {
    fill: "bg-[#b884ff]",
    glow: "shadow-[0_0_10px_rgba(184,132,255,0.48)]",
    label: "text-[#5e398c]"
  },
  speed: {
    fill: "bg-[#42d7c7]",
    glow: "shadow-[0_0_10px_rgba(66,215,199,0.5)]",
    label: "text-[#206c65]"
  }
};

export default function StatBar({ stat }) {
  const name = stat.stat.name;
  const value = stat.base_stat;
  const theme = statThemes[name] || statThemes.hp;
  const activeSegments = Math.max(1, Math.min(totalSegments, Math.round((value / 160) * totalSegments)));

  return (
    <motion.div
      className="grid min-h-[84px] grid-cols-[1fr_auto] items-center gap-2 rounded border-2 border-emerald-950/25 bg-[#f8efd0] px-3 py-2 shadow-[inset_0_-4px_0_rgba(20,32,51,0.08)] sm:min-h-[72px] sm:grid-cols-[124px_1fr_52px] sm:gap-3"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32 }}
      whileHover={{ x: 3, backgroundColor: "#fff7d8" }}
    >
      <div>
        <span className={`block font-pixel text-lg font-black uppercase leading-5 ${theme.label}`}>
          {statLabels[name] || formatName(name)}
        </span>
        <span className="mt-0.5 block font-pixel text-sm font-black uppercase leading-4 text-emerald-950/45">
          STAT
        </span>
      </div>

      <div className="col-span-2 rounded border-2 border-dex-dark bg-[#142033] p-1 shadow-[inset_0_0_0_2px_rgba(216,255,242,0.08)] sm:col-span-1">
        <div className="grid h-7 grid-cols-[repeat(16,minmax(0,1fr))] gap-1">
          {Array.from({ length: totalSegments }, (_, index) => {
            const isActive = index < activeSegments;

            return (
              <motion.span
                key={index}
                className={`block rounded-[1px] border border-white/10 ${
                  isActive ? `${theme.fill} ${theme.glow}` : "bg-[#243044]"
                }`}
                initial={{ opacity: 0, y: 5, scaleY: 0.45 }}
                animate={{ opacity: isActive ? 1 : 0.42, y: 0, scaleY: 1 }}
                transition={{ delay: 0.08 + index * 0.025, duration: 0.22, ease: "easeOut" }}
              />
            );
          })}
        </div>
      </div>

      <strong className="rounded border-2 border-emerald-950/20 bg-white/65 px-2 py-1 text-right font-pixel text-xl font-black leading-5 text-dex-ink shadow-[inset_0_-2px_0_rgba(20,32,51,0.08)]">
        {value}
      </strong>
    </motion.div>
  );
}
