import { useEffect, useLayoutEffect, useRef } from "react";
import { m } from "motion/react";
import { generations } from "../data/pokemon.js";
import { sortOptions } from "../utils/browse.js";
import { formatPokemonNumber } from "../utils/formatters.js";
import { formatSearchLabel } from "../utils/search.js";
import { getSpriteUrlById } from "../utils/pokemonSprites.js";
import ActionButton from "./ActionButton.jsx";
import Icon from "./Icon.jsx";
import TypeFilter from "./TypeFilter.jsx";

const FIELD_CLASS =
  "h-10 min-w-0 rounded border-2 border-emerald-950/25 bg-white/70 px-2 font-pixel text-base font-black text-dex-ink outline-none transition focus:border-dex-dark";

export default function PokemonGrid({ browser, favorites, onSelect }) {
  const {
    activeTypes,
    selectType,
    isLoadingType,
    isTypeFailed,
    isLoadingList,
    filters,
    changeFilter,
    clearFilters,
    hasActiveFilters,
    filterKey,
    visibleList,
    totalCount,
    hasMore,
    showMore,
    saveScroll,
    takeSavedScroll
  } = browser;
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const lastFilterKeyRef = useRef(filterKey);
  const isLoading = isLoadingType || isLoadingList;

  // Voltar de um Pokémon escolhido na grade devolve o usuário ao ponto onde estava.
  useLayoutEffect(() => {
    const saved = takeSavedScroll();

    if (!saved) return;

    if (containerRef.current) containerRef.current.scrollTop = saved.container;
    window.scrollTo(0, saved.window);
  }, [takeSavedScroll]);

  useEffect(() => {
    if (lastFilterKeyRef.current === filterKey) return;

    lastFilterKeyRef.current = filterKey;
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [filterKey]);

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

  function handleSelect(name) {
    saveScroll({ container: containerRef.current?.scrollTop ?? 0, window: window.scrollY });
    onSelect(name);
  }

  return (
    <m.div
      ref={containerRef}
      className="w-full min-w-0 lg:scrollbar-none lg:h-full lg:overflow-y-auto lg:pr-1"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <div className="z-10 -mx-1 mb-4 grid gap-2 bg-dex-screen/90 px-1 pb-3 pt-1 backdrop-blur lg:sticky lg:top-0">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
          <input
            className={`${FIELD_CLASS} sm:col-span-2 xl:col-span-1`}
            type="search"
            value={filters.text}
            onChange={event => changeFilter("text", event.target.value)}
            placeholder="Filtrar por nome ou número"
            aria-label="Filtrar a lista por nome ou número"
            autoComplete="off"
            spellCheck={false}
          />
          <select
            className={FIELD_CLASS}
            value={filters.generation ?? ""}
            onChange={event => changeFilter("generation", event.target.value ? Number(event.target.value) : null)}
            aria-label="Filtrar por geração"
          >
            <option value="">Todas as gerações</option>
            {generations.map(generation => (
              <option key={generation.id} value={generation.id}>
                {generation.label}
              </option>
            ))}
          </select>
          <select
            className={FIELD_CLASS}
            value={filters.sort}
            onChange={event => changeFilter("sort", event.target.value)}
            aria-label="Ordenar a lista"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <TypeFilter activeTypes={activeTypes} onSelect={selectType} />

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton
            icon="star"
            iconFilled={filters.onlyFavorites}
            isActive={filters.onlyFavorites}
            aria-pressed={filters.onlyFavorites}
            onClick={() => changeFilter("onlyFavorites", !filters.onlyFavorites)}
          >
            Favoritos ({favorites.names.length})
          </ActionButton>
          <ActionButton
            isActive={filters.includeForms}
            aria-pressed={filters.includeForms}
            onClick={() => changeFilter("includeForms", !filters.includeForms)}
          >
            Incluir formas
          </ActionButton>
          {hasActiveFilters ? <ActionButton icon="x" onClick={clearFilters}>Limpar</ActionButton> : null}
          <p className="font-pixel text-base font-black uppercase leading-5 text-emerald-950/55">
            {isLoadingType ? "Carregando tipo..." : isLoadingList ? "Carregando a Pokedex..." : `${totalCount} pokémon`}
          </p>
        </div>
      </div>

      {visibleList.length ? (
        <div className="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {visibleList.map(entry => {
            const label = formatSearchLabel(entry.name);
            const isFavorite = favorites.isFavorite(entry.name);

            return (
              <div key={entry.name} className="relative">
                <button
                  className="grid h-full w-full content-start gap-1 rounded-lg border-2 border-emerald-950/20 bg-white/45 p-2 text-center shadow-[inset_0_-4px_0_rgba(20,32,51,0.06)] transition duration-200 hover:-translate-y-1 hover:bg-white/75 active:scale-[0.97] motion-reduce:transform-none"
                  type="button"
                  onClick={() => handleSelect(entry.name)}
                >
                  <img
                    className="pokemon-sprite-image mx-auto h-20 w-20 object-contain [image-rendering:pixelated]"
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
                  <span className="font-pixel text-base font-black uppercase leading-5 text-dex-ink">{label}</span>
                </button>
                <button
                  className={`absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded transition hover:bg-white/80 ${
                    isFavorite ? "text-amber-600" : "text-emerald-950/35"
                  }`}
                  type="button"
                  onClick={() => favorites.toggle(entry.name)}
                  aria-pressed={isFavorite}
                  aria-label={`${isFavorite ? "Remover" : "Adicionar"} ${label} ${isFavorite ? "dos" : "aos"} favoritos`}
                >
                  <Icon name="star" size={18} strokeWidth={2.6} filled={isFavorite} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="py-10 text-center font-pixel text-lg font-black uppercase leading-6 text-emerald-950/55">
          {isLoading
            ? "Carregando..."
            : isTypeFailed
              ? "Não consegui carregar este tipo"
              : "Nenhum pokémon para este filtro"}
        </p>
      )}

      {hasMore ? <div ref={sentinelRef} className="h-10" aria-hidden="true" /> : null}
    </m.div>
  );
}
