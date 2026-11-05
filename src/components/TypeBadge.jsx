import { m } from "motion/react";
import { typeStyles } from "../data/pokemon.js";
import { formatTypeName } from "../utils/formatters.js";

export default function TypeBadge({ type, suffix }) {
  return (
    <m.span
      className={`type-badge rounded-lg px-3 py-2 font-pixel text-base font-black uppercase leading-5 text-white ${typeStyles[type] || "bg-dex-dark"}`}
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2, scale: 1.04 }}
    >
      {formatTypeName(type)}
      {suffix ? <span className="ml-1.5 opacity-80">{suffix}</span> : null}
    </m.span>
  );
}
