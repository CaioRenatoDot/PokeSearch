import { useEffect, useState } from "react";
import { m } from "motion/react";
import SearchPanel from "./components/SearchPanel.jsx";
import PokemonScreen from "./components/PokemonScreen.jsx";
import { usePokemonSearch } from "./hooks/usePokemonSearch.js";
import { useSoundPreference } from "./hooks/useSoundPreference.js";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts.js";
import { usePokemonBrowser } from "./hooks/usePokemonBrowser.js";
import { formatName, formatPokemonNumber } from "./utils/formatters.js";

const DEFAULT_TITLE = "PokeSearch | Pokedex";

export default function App() {
  const [isMonochrome, setIsMonochrome] = useState(false);
  const [view, setView] = useState("detail");
  const [pinnedPokemon, setPinnedPokemon] = useState(null);
  const { isSoundOn, toggleSound, volume, changeVolume } = useSoundPreference();
  const {
    query,
    setQuery,
    pokemon,
    status,
    message,
    failure,
    didYouMean,
    filteredSuggestions,
    pokemonList,
    history,
    searchPokemon,
    searchRandomPokemon,
    retrySearch,
    goToPreviousPokemon,
    goToNextPokemon,
    hasPreviousPokemon,
    hasNextPokemon
  } = usePokemonSearch("pikachu");
  const browser = usePokemonBrowser(pokemonList);

  function showDetail(action) {
    return (...args) => {
      setView("detail");
      action(...args);
    };
  }

  const handleSearch = showDetail(searchPokemon);
  const handleRandom = showDetail(searchRandomPokemon);
  const handlePrevious = showDetail(goToPreviousPokemon);
  const handleNext = showDetail(goToNextPokemon);
  const handleRetry = showDetail(retrySearch);

  useKeyboardShortcuts({
    onPrevious: handlePrevious,
    onNext: handleNext,
    onRandom: handleRandom
  });

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
        query={query}
        setQuery={setQuery}
        status={status}
        suggestions={filteredSuggestions}
        history={history}
        onSearch={handleSearch}
        onRandom={handleRandom}
        isMonochrome={isMonochrome}
        onToggleDisplayMode={() => setIsMonochrome(current => !current)}
        isSoundOn={isSoundOn}
        onToggleSound={toggleSound}
        volume={volume}
        onChangeVolume={changeVolume}
        view={view}
        onChangeView={setView}
      />
      <PokemonScreen
        pokemon={pokemon}
        status={status}
        message={message}
        failure={failure}
        didYouMean={didYouMean}
        onRetry={handleRetry}
        view={view}
        browser={browser}
        onSelectFromGrid={handleSearch}
        onSelectPokemon={handleSearch}
        comparison={{
          pinned: pinnedPokemon,
          onPin: setPinnedPokemon,
          onClear: () => setPinnedPokemon(null)
        }}
        navigation={{
          onPrevious: handlePrevious,
          onNext: handleNext,
          hasPrevious: hasPreviousPokemon,
          hasNext: hasNextPokemon
        }}
      />
    </m.main>
  );
}
