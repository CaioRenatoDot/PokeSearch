import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { formatPokemonNumber } from "../utils/formatters.js";
import { formatSearchLabel } from "../utils/search.js";
import { getSpriteUrlById } from "../utils/pokemonSprites.js";
import TypeFilter from "./TypeFilter.jsx";

export default function PokemonGrid({ browser, onSelect }) {
  const { activeType, selectType, isLoadingType, visibleList, totalCount, hasMore, showMore } = browser;
  const sentinelRef = useRef(null);
  // Sem filtro e sem itens quer dizer que a lista completa ainda esta chegando da API.
  const isLoadingList = !activeType && totalCount === 0;

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) showMore();
      },
      { rootMargin: "240px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, showMore, visibleList.length]);

  return (
    <motion.div
      className="w-full lg:scrollbar-none lg:h-full lg:overflow-y-auto lg:pr-1"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sticky top-0 z-10 -mx-1 mb-4 bg-dex-screen/90 px-1 pb-3 pt-1 backdrop-blur">
        <TypeFilter activeType={activeType} onSelect={selectType} />
        <p className="mt-2 font-pixel text-base font-black uppercase leading-5 text-emerald-950/55">
          {isLoadingType ? "Carregando tipo..." : isLoadingList ? "Carregando a Pokedex..." : `${totalCount} pokémon`}
        </p>
      </div>

      {visibleList.length ? (
        <div className="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {visibleList.map(entry => (
            <motion.button
              key={entry.name}
              className="grid gap-1 rounded-lg border-2 border-emerald-950/20 bg-white/45 p-2 text-center shadow-[inset_0_-4px_0_rgba(20,32,51,0.06)] transition hover:bg-white/75"
              type="button"
              onClick={() => onSelect(entry.name)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <img
                className="mx-auto h-20 w-20 object-contain [image-rendering:pixelated]"
                src={getSpriteUrlById(entry.id)}
                alt=""
                loading="lazy"
                decoding="async"
                onError={event => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
              <span className="font-pixel text-sm font-black uppercase leading-4 text-emerald-950/55">
                {formatPokemonNumber(entry.id)}
              </span>
              <span className="font-pixel text-base font-black uppercase leading-5 text-dex-ink">
                {formatSearchLabel(entry.name)}
              </span>
            </motion.button>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center font-pixel text-lg font-black uppercase leading-6 text-emerald-950/55">
          {isLoadingType || isLoadingList ? "Carregando..." : "Nenhum pokémon para este filtro"}
        </p>
      )}

      {hasMore ? <div ref={sentinelRef} className="h-10" aria-hidden="true" /> : null}
    </motion.div>
  );
}
