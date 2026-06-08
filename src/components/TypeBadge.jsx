import { motion } from "motion/react";
import { typeStyles } from "../data/pokemon.js";
import { formatName } from "../utils/formatters.js";

export default function TypeBadge({ type }) {
  return (
    <motion.span
      className={`type-badge rounded-lg px-3 py-2 font-pixel text-base font-black uppercase leading-5 text-white ${typeStyles[type] || "bg-dex-dark"}`}
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2, scale: 1.04 }}
    >
      {formatName(type)}
    </motion.span>
  );
}
