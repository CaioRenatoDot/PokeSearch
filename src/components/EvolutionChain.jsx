import { m } from "motion/react";
import { formatPokemonNumber } from "../utils/formatters.js";
import { formatSearchLabel } from "../utils/search.js";
import { getSpriteUrlById } from "../utils/pokemonSprites.js";

export default function EvolutionChain({ stages, currentId, onSelect }) {
  if (!stages.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {stages.map((stage, stageIndex) => (
        <div key={stageIndex} className="flex items-center gap-2">
          {stageIndex > 0 ? (
            <span className="font-pixel text-2xl font-black leading-none text-emerald-950/45" aria-hidden="true">
              ›
            </span>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {stage.map(item => (
              <m.button
                key={item.name}
                className={`grid w-24 justify-items-center gap-1 rounded border-2 p-2 transition ${
                  item.id === currentId
                    ? "border-dex-dark bg-amber-300"
                    : "border-emerald-950/20 bg-white/55 hover:bg-white/80"
                }`}
                type="button"
                onClick={() => onSelect(item.name)}
                aria-current={item.id === currentId ? "true" : undefined}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                <img
                  className="pokemon-sprite-image h-14 w-14 object-contain [image-rendering:pixelated]"
                  src={getSpriteUrlById(item.id)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="font-pixel text-xs font-black uppercase leading-4 text-emerald-950/55">
                  {formatPokemonNumber(item.id)}
                </span>
                <span className="font-pixel text-sm font-black uppercase leading-4 text-dex-ink">
                  {formatSearchLabel(item.name)}
                </span>
              </m.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
