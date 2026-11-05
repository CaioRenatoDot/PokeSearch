import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { getPokemon } from "./api/pokeApi.js";
import SearchPanel from "./components/SearchPanel.jsx";
import PokemonScreen from "./components/PokemonScreen.jsx";
import { useFavorites } from "./hooks/useFavorites.js";
import { usePokemonSearch } from "./hooks/usePokemonSearch.js";
import { useSoundPreference } from "./hooks/useSoundPreference.js";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts.js";
import { usePokemonBrowser } from "./hooks/usePokemonBrowser.js";
import { useStoredState } from "./hooks/useStoredState.js";
import { useTeam } from "./hooks/useTeam.js";
import { formatName, formatPokemonNumber } from "./utils/formatters.js";
import { readUrlState, updateUrl } from "./utils/url.js";

const DEFAULT_TITLE = "PokeSearch | Pokedex";
const FALLBACK_POKEMON = "pikachu";

export default function App() {
  const [isMonochrome, setIsMonochrome] = useStoredState("pokesearch:monochrome", false, Boolean);
  const [view, setView] = useState(() => readUrlState().view);
  const [pinnedPokemon, setPinnedPokemon] = useState(null);
  const { isSoundOn, toggleSound, volume, changeVolume } = useSoundPreference();
  const search = usePokemonSearch(FALLBACK_POKEMON);
  const { pokemon, status, message, pokemonList } = search;
  const favorites = useFavorites();
  const team = useTeam();
  const browser = usePokemonBrowser(pokemonList, favorites.names);

  function showDetail(action) {
    return (...args) => {
      setView("detail");
      action(...args);
    };
  }

  const handleSearch = showDetail(search.searchPokemon);
  const handleRandom = showDetail(search.searchRandomPokemon);
  const handlePrevious = showDetail(search.goToPreviousPokemon);
  const handleNext = showDetail(search.goToNextPokemon);
  const handleRetry = showDetail(search.retrySearch);

  function handleChangeView(nextView) {
    if (nextView === view) return;

    setView(nextView);
    updateUrl({ view: nextView === "detail" ? null : nextView }, { history: "push" });
  }

  function handlePin(target) {
    setPinnedPokemon(target);
    updateUrl({ versus: target.name });
  }

  function handleClearPin() {
    setPinnedPokemon(null);
    updateUrl({ versus: null });
  }

  useKeyboardShortcuts({
    onPrevious: handlePrevious,
    onNext: handleNext,
    onRandom: handleRandom,
    onToggleFavorite: () => {
      if (pokemon) favorites.toggle(pokemon.name);
    },
    onToggleTeam: () => {
      if (pokemon && (team.isInTeam(pokemon.name) || !team.isFull)) team.toggle(pokemon.name);
    }
  });

  // Reaplica o endereço quando o usuário usa voltar e avançar do navegador.
  const restoreFromUrlRef = useRef(null);

  useEffect(() => {
    restoreFromUrlRef.current = () => {
      const state = readUrlState();
      const targetName = state.pokemon || FALLBACK_POKEMON;

      setView(state.view);
      team.syncWithUrl();

      if (targetName !== pokemon?.name) {
        search.searchPokemon(targetName, { history: "none" });
      }

      if (!state.versus) {
        setPinnedPokemon(null);
      } else if (state.versus !== pinnedPokemon?.name) {
        getPokemon(state.versus)
          .then(setPinnedPokemon)
          .catch(() => setPinnedPokemon(null));
      }
    };
  });

  useEffect(() => {
    function handlePopState() {
      restoreFromUrlRef.current();
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Um link de comparação já abre com o outro Pokémon fixado.
  useEffect(() => {
    const { versus } = readUrlState();

    if (!versus) return;

    getPokemon(versus)
      .then(setPinnedPokemon)
      .catch(() => updateUrl({ versus: null }));
  }, []);

  useEffect(() => {
    document.title = pokemon
      ? `${formatName(pokemon.name)} ${formatPokemonNumber(pokemon.id)} | PokeSearch`
      : DEFAULT_TITLE;
  }, [pokemon]);

  return (
    <m.main
      className={`app-shell grid min-h-dvh grid-cols-1 gap-3 bg-page p-3 lg:h-screen lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-0 lg:overflow-hidden lg:p-5 ${
        isMonochrome ? "theme-monochrome" : ""
      }`}
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <SearchPanel
        query={search.query}
        setQuery={search.setQuery}
        status={status}
        suggestions={search.filteredSuggestions}
        history={search.history}
        onClearHistory={search.clearHistory}
        favorites={favorites.names}
        onSearch={handleSearch}
        onRandom={handleRandom}
        isMonochrome={isMonochrome}
        onToggleDisplayMode={() => setIsMonochrome(current => !current)}
        isSoundOn={isSoundOn}
        onToggleSound={toggleSound}
        volume={volume}
        onChangeVolume={changeVolume}
        view={view}
        onChangeView={handleChangeView}
        teamSize={team.ownNames.length}
      />
      <PokemonScreen
        pokemon={pokemon}
        status={status}
        message={message}
        failure={search.failure}
        didYouMean={search.didYouMean}
        onRetry={handleRetry}
        view={view}
        browser={browser}
        favorites={favorites}
        team={team}
        pokemonList={pokemonList}
        onSelectPokemon={handleSearch}
        comparison={{
          pinned: pinnedPokemon,
          onPin: handlePin,
          onClear: handleClearPin
        }}
        navigation={{
          onPrevious: handlePrevious,
          onNext: handleNext,
          hasPrevious: search.hasPreviousPokemon,
          hasNext: search.hasNextPokemon
        }}
      />
    </m.main>
  );
}
