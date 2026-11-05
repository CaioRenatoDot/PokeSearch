import { m } from "motion/react";
import { typeNames, typeStyles } from "../data/pokemon.js";
import { formatTypeName } from "../utils/formatters.js";

export default function TypeFilter({ activeTypes, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por até dois tipos">
      {typeNames.map(type => {
        const isActive = activeTypes.includes(type);

        return (
          <m.button
            key={type}
            className={`rounded-lg px-2.5 py-1 font-pixel text-sm font-black uppercase leading-5 text-white transition ${
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
