import { motion } from "motion/react";
import { suggestions as quickSuggestions } from "../data/pokemon.js";
import PanelTabs from "./PanelTabs.jsx";
import PokeballMark from "./PokeballMark.jsx";
import SearchBox from "./SearchBox.jsx";

export default function SearchPanel({
  query,
  setQuery,
  status,
  suggestions,
  history,
  onSearch,
  onRandom
}) {
  return (
    <motion.aside
      className="relative z-10 flex min-h-0 flex-col gap-5 overflow-hidden rounded-lg bg-gradient-to-br from-dex-red to-dex-redDark p-5 text-white shadow-dex lg:h-full lg:rounded-r-none lg:p-7"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.48, ease: "easeOut" }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-[6px] border-white bg-sky-300 shadow-[inset_0_-12px_20px_rgba(29,109,159,0.36),0_12px_28px_rgba(60,19,23,0.28)]"
          animate={{ scale: [1, 1.045, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="block h-6 w-6 -translate-x-2 -translate-y-2 rounded-full bg-white/80" />
        </motion.div>
        <div>
          <p className="font-display text-[10px] uppercase leading-5 text-white/70">PokeSearch</p>
          <h1 className="font-display text-3xl leading-tight tracking-normal sm:text-4xl">Pokedex</h1>
        </div>
      </div>

      <SearchBox
        query={query}
        setQuery={setQuery}
        status={status}
        suggestions={suggestions}
        onSearch={onSearch}
        onRandom={onRandom}
      />

      <PanelTabs
        quickItems={quickSuggestions}
        suggestionItems={suggestions}
        historyItems={history}
        onSelect={onSearch}
      />

      <motion.div
        className="mt-auto hidden rounded-lg border border-white/20 bg-slate-950/20 p-4 lg:block"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.36 }}
      >
        <p className="mb-3 font-pixel text-base font-black uppercase leading-5 text-white/60">Atalhos</p>
        <div className="space-y-3 text-base font-semibold leading-5 text-white/80">
          <p>Use as abas para alternar entre favoritos rápidos, sugestões da busca e histórico.</p>
          <p>A lista interna rola sem empurrar o painel inteiro.</p>
        </div>
      </motion.div>

      <PokeballMark className="absolute bottom-6 right-6 hidden opacity-10 lg:block" />
    </motion.aside>
  );
}
