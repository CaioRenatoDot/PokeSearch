import { m } from "motion/react";
import { typeStyles } from "../data/pokemon.js";
import { formatTypeName } from "../utils/formatters.js";

const types = Object.keys(typeStyles);

export default function TypeFilter({ activeType, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
      {types.map(type => {
        const isActive = type === activeType;

        return (
          <m.button
            key={type}
            className={`rounded-lg px-3 py-1.5 font-pixel text-sm font-black uppercase leading-5 text-white transition ${
              typeStyles[type]
            } ${isActive ? "ring-4 ring-dex-ink/60" : "opacity-60 hover:opacity-100"}`}
            type="button"
            onClick={() => onSelect(type)}
            aria-pressed={isActive}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            {formatTypeName(type)}
          </m.button>
        );
      })}
    </div>
  );
}
