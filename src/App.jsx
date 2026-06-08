import { motion } from "motion/react";
import SearchPanel from "./components/SearchPanel.jsx";
import PokemonScreen from "./components/PokemonScreen.jsx";
import { usePokemonSearch } from "./hooks/usePokemonSearch.js";

export default function App() {
  const {
    query,
    setQuery,
    pokemon,
    status,
    message,
    filteredSuggestions,
    history,
    searchPokemon,
    searchRandomPokemon
  } = usePokemonSearch("pikachu");

  return (
    <motion.main
      className="grid min-h-dvh grid-cols-1 gap-3 bg-page p-3 lg:h-screen lg:grid-cols-[420px_1fr] lg:gap-0 lg:overflow-hidden lg:p-5"
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
      />
      <PokemonScreen pokemon={pokemon} status={status} message={message} />
    </motion.main>
  );
}
