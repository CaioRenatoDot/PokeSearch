import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SearchPanel from "./components/SearchPanel.jsx";
import PokemonScreen from "./components/PokemonScreen.jsx";
import { usePokemonSearch } from "./hooks/usePokemonSearch.js";
import { useSoundPreference } from "./hooks/useSoundPreference.js";
import { formatName, formatPokemonNumber } from "./utils/formatters.js";

const DEFAULT_TITLE = "PokeSearch | Pokedex";

export default function App() {
  const [isMonochrome, setIsMonochrome] = useState(false);
  const { isSoundOn, toggleSound } = useSoundPreference();
  const {
    query,
    setQuery,
    pokemon,
    status,
    message,
    filteredSuggestions,
    history,
    searchPokemon,
    searchRandomPokemon,
    goToPreviousPokemon,
    goToNextPokemon,
    hasPreviousPokemon,
    hasNextPokemon
  } = usePokemonSearch("pikachu");

  useEffect(() => {
    document.title = pokemon
      ? `${formatName(pokemon.name)} ${formatPokemonNumber(pokemon.id)} | PokeSearch`
      : DEFAULT_TITLE;
  }, [pokemon]);

  return (
    <motion.main
      className={`app-shell grid min-h-dvh grid-cols-1 gap-3 bg-page p-3 lg:h-screen lg:grid-cols-[420px_1fr] lg:gap-0 lg:overflow-hidden lg:p-5 ${
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
        onSearch={searchPokemon}
        onRandom={searchRandomPokemon}
        isMonochrome={isMonochrome}
        onToggleDisplayMode={() => setIsMonochrome(current => !current)}
        isSoundOn={isSoundOn}
        onToggleSound={toggleSound}
      />
      <PokemonScreen
        pokemon={pokemon}
        status={status}
        message={message}
        navigation={{
          onPrevious: goToPreviousPokemon,
          onNext: goToNextPokemon,
          hasPrevious: hasPreviousPokemon,
          hasNext: hasNextPokemon
        }}
      />
    </motion.main>
  );
}
