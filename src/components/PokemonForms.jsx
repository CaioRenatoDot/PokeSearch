import { formatSearchLabel } from "../utils/search.js";
import { getSpriteUrlById } from "../utils/pokemonSprites.js";

export default function PokemonForms({ varieties, currentName, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-5">
      {varieties.map(variety => {
        const isCurrent = variety.name === currentName;

        return (
          <button
            key={variety.name}
            className={`grid content-start justify-items-center gap-1 rounded border-2 p-2 transition hover:-translate-y-0.5 motion-reduce:transform-none ${
              isCurrent ? "border-dex-dark bg-amber-300" : "border-emerald-950/20 bg-white/55 hover:bg-white/80"
            }`}
            type="button"
            onClick={() => onSelect(variety.name)}
            aria-current={isCurrent ? "true" : undefined}
          >
            <img
              className="pokemon-sprite-image h-14 w-14 object-contain [image-rendering:pixelated]"
              src={getSpriteUrlById(variety.id)}
              alt=""
              loading="lazy"
              decoding="async"
              onError={event => {
                event.currentTarget.style.visibility = "hidden";
              }}
            />
            <span className="text-center font-pixel text-sm font-black uppercase leading-4 text-dex-ink">
              {formatSearchLabel(variety.name)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
