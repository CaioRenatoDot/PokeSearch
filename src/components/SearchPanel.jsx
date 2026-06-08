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
  onRandom,
  isMonochrome,
  onToggleDisplayMode
}) {
  return (
    <motion.aside
      className="search-panel relative z-10 flex min-h-0 flex-col gap-4 overflow-visible rounded-lg bg-gradient-to-br from-dex-red to-dex-redDark p-4 text-white shadow-dex sm:p-5 lg:h-full lg:gap-5 lg:overflow-hidden lg:rounded-r-none lg:p-7"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.48, ease: "easeOut" }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <motion.div
          className="gb-lens grid h-16 w-16 shrink-0 place-items-center rounded-full border-[5px] border-white bg-sky-300 shadow-[inset_0_-12px_20px_rgba(29,109,159,0.36),0_12px_28px_rgba(60,19,23,0.28)] sm:h-20 sm:w-20 sm:border-[6px]"
          animate={{ scale: [1, 1.045, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="block h-5 w-5 -translate-x-1.5 -translate-y-1.5 rounded-full bg-white/80 sm:h-6 sm:w-6 sm:-translate-x-2 sm:-translate-y-2" />
        </motion.div>
        <div>
          <p className="font-display text-[10px] uppercase leading-5 text-white/70">PokeSearch</p>
          <h1 className="font-display text-2xl leading-tight tracking-normal sm:text-4xl">Pokedex</h1>
        </div>
      </div>

      <motion.button
        className={`theme-toggle inline-flex min-h-14 items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left font-pixel font-black uppercase leading-5 transition ${
          isMonochrome
            ? "border-[#0f380f] bg-[#9bbc0f] text-[#0f380f] shadow-[inset_0_-4px_0_rgba(15,56,15,0.2)]"
            : "border-white/25 bg-slate-950/20 text-white hover:bg-white/20"
        }`}
        type="button"
        onClick={onToggleDisplayMode}
        aria-pressed={isMonochrome}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="grid gap-1">
          <span className="text-sm leading-4 opacity-70">Tela</span>
          <span className="text-xl leading-5">{isMonochrome ? "Game Boy" : "Colorida"}</span>
        </span>
        <span className="grid h-9 w-12 shrink-0 place-items-center rounded border-2 border-current bg-current/10 text-base">
          {isMonochrome ? "GB" : "RGB"}
        </span>
      </motion.button>

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

      <PokeballMark className="absolute bottom-6 right-6 hidden opacity-10 lg:block" />
    </motion.aside>
  );
}
