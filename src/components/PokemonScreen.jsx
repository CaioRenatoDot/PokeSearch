import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { formatName, formatPokemonNumber } from "../utils/formatters.js";
import EmptyState from "./EmptyState.jsx";
import PokemonCard from "./PokemonCard.jsx";
import PixelReveal from "./PixelReveal.jsx";
import PokemonGrid from "./PokemonGrid.jsx";
import ComparisonView from "./ComparisonView.jsx";

// Abaixo de "lg" o painel de busca fica em cima e o resultado nasceria fora da tela.
const STACKED_LAYOUT_QUERY = "(max-width: 1023px)";

export default function PokemonScreen({
  pokemon,
  status,
  message,
  failure,
  didYouMean,
  onRetry,
  navigation,
  view,
  browser,
  comparison,
  favorites,
  onSelectPokemon
}) {
  const isBrowsing = view === "browse";
  const pinned = comparison.pinned;
  const isComparing =
    !isBrowsing && Boolean(pinned) && status === "ready" && Boolean(pokemon) && pokemon.id !== pinned.id;

  const sectionRef = useRef(null);
  const hasShownContentRef = useRef(false);
  const pokemonId = pokemon?.id;

  useEffect(() => {
    if (!pokemonId && status !== "error") return;

    // A primeira resposta chega sozinha ao abrir a página; só depois a rolagem responde a um pedido.
    if (!hasShownContentRef.current) {
      hasShownContentRef.current = true;
      return;
    }

    if (window.matchMedia(STACKED_LAYOUT_QUERY).matches) {
      sectionRef.current?.scrollIntoView({ block: "start" });
    }
  }, [pokemonId, status, view]);

  return (
    <m.section
      ref={sectionRef}
      className="pokemon-screen relative min-h-[70dvh] min-w-0 overflow-hidden rounded-lg border-[7px] border-dex-dark bg-dex-screen shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),inset_0_0_52px_rgba(18,48,46,0.2)] sm:border-[10px] lg:h-full lg:min-h-0 lg:rounded-l-none"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08, duration: 0.48, ease: "easeOut" }}
    >
      <m.div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3 bg-gradient-to-b from-transparent via-white/35 to-transparent"
        aria-hidden="true"
        animate={{ y: ["-120%", "320%"] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: status === "loading" ? 0.2 : 2.4,
          ease: "easeInOut"
        }}
      />
      <div className="screen-lines pointer-events-none absolute inset-0" aria-hidden="true" />

      <p className="sr-only" role="status" aria-live="polite">
        {buildStatusAnnouncement(pokemon, status, message)}
      </p>

      <div className="relative z-0 flex h-full min-h-[64dvh] p-3 sm:min-h-[70dvh] sm:p-6 lg:min-h-0 lg:p-8">
        <AnimatePresence mode="wait">
          {isBrowsing ? (
            <PokemonGrid key="grid" browser={browser} favorites={favorites} onSelect={onSelectPokemon} />
          ) : isComparing ? (
            <ComparisonView
              key={`compare-${pinned.id}-${pokemon.id}`}
              pinned={pinned}
              current={pokemon}
              onClear={comparison.onClear}
            />
          ) : status === "ready" && pokemon ? (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onPrevious={navigation.onPrevious}
              onNext={navigation.onNext}
              hasPrevious={navigation.hasPrevious}
              hasNext={navigation.hasNext}
              onSelectPokemon={onSelectPokemon}
              favorites={favorites}
              comparison={{
                isPinned: Boolean(pinned),
                onPin: comparison.onPin,
                onClear: comparison.onClear
              }}
            />
          ) : (
            <EmptyState
              key={status}
              status={status}
              message={message}
              failure={failure}
              didYouMean={didYouMean}
              onSelect={onSelectPokemon}
              onRetry={onRetry}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!isBrowsing && !isComparing && status === "ready" && pokemon ? (
          <PixelReveal key={`pixels-${pokemon.id}`} triggerKey={pokemon.id} />
        ) : null}
      </AnimatePresence>
    </m.section>
  );
}

function buildStatusAnnouncement(pokemon, status, message) {
  if (status === "loading") return "Consultando a Pokedex.";
  if (status === "error") return message || "Não consegui concluir a busca.";
  if (status === "ready" && pokemon) {
    return `${formatName(pokemon.name)}, ${formatPokemonNumber(pokemon.id)}, carregado na tela.`;
  }

  return "";
}
