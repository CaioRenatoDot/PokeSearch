import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { formatSearchLabel } from "../utils/search.js";
import Icon from "./Icon.jsx";

export default function SearchBox({ query, setQuery, status, suggestions = [], onSearch, onRandom }) {
  const listId = useId();
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isListDismissed, setIsListDismissed] = useState(false);

  const isListOpen = suggestions.length > 0 && !isListDismissed;
  const activeOptionId = isListOpen && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined;
  const suggestionsKey = suggestions.join("|");

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestionsKey]);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    listRef.current.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function handleChange(event) {
    setQuery(event.target.value);
    setIsListDismissed(false);
  }

  function handleSelect(name) {
    setIsListDismissed(true);
    setActiveIndex(-1);
    onSearch(name);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsListDismissed(true);
    onSearch(query);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setIsListDismissed(true);
      setActiveIndex(-1);
      return;
    }

    if (!isListOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex(current => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(current => (current <= 0 ? suggestions.length - 1 : current - 1));
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Tab") {
      setIsListDismissed(true);
    }
  }

  return (
    <motion.form
      className="relative grid gap-3 sm:grid-cols-[1fr_auto_auto] lg:grid-cols-1"
      onSubmit={handleSubmit}
      animate={status === "error" ? { x: [0, -8, 8, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.32 }}
    >
      <label className="sr-only" htmlFor="pokemonInput">
        Nome ou número do Pokémon
      </label>
      <p className="sr-only" id={`${listId}-hint`}>
        Use as setas para cima e para baixo para navegar pelas sugestões e Enter para escolher.
      </p>
      <div className="relative min-w-0">
        <input
          id="pokemonInput"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="h-14 w-full min-w-0 rounded-lg border-0 bg-white px-4 font-pixel text-xl font-semibold text-dex-ink outline-none ring-4 ring-transparent transition placeholder:text-dex-ink/45 focus:ring-sky-300/70"
          placeholder="Digite nome ou número"
          type="search"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={isListOpen}
          aria-controls={isListOpen ? listId : undefined}
          aria-activedescendant={activeOptionId}
          aria-autocomplete="list"
          aria-describedby={`${listId}-hint`}
        />
        {isListOpen ? (
          <motion.div
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-lg border-2 border-white/30 bg-dex-dark/95 shadow-dex"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div
              className="max-h-56 overflow-y-auto"
              id={listId}
              ref={listRef}
              role="listbox"
              aria-label="Sugestões de Pokémon"
            >
              {suggestions.map((name, index) => (
                <div
                  key={name}
                  id={`${listId}-option-${index}`}
                  className={`cursor-pointer px-4 py-2 text-left font-pixel text-lg font-black uppercase text-white transition ${
                    index === activeIndex ? "bg-white/20" : "hover:bg-white/15"
                  }`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelect(name)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {formatSearchLabel(name)}
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>

      <motion.button
        className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-amber-300 px-5 font-pixel text-xl font-black uppercase leading-5 text-slate-950 shadow-[inset_0_-4px_0_rgba(91,55,0,0.16)] transition hover:bg-amber-200"
        type="submit"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon name="search" size={20} strokeWidth={3} />
        {status === "loading" ? "Buscando" : "Buscar"}
      </motion.button>

      <motion.button
        className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border-2 border-white/25 bg-slate-950/20 px-4 font-pixel text-xl font-black uppercase leading-5 text-white transition hover:bg-white/20"
        type="button"
        onClick={onRandom}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon name="shuffle" size={20} strokeWidth={3} />
        Aleatório
      </motion.button>
    </motion.form>
  );
}
