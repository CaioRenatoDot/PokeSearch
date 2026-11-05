import { useEffect, useId, useRef, useState } from "react";
import { m } from "motion/react";
import { formatSearchLabel } from "../utils/search.js";
import Icon from "./Icon.jsx";

export default function SearchBox({ query, setQuery, status, suggestions = [], onSearch, onRandom }) {
  const listId = useId();
  const listRef = useRef(null);
  // A opção destacada guarda a lista a que pertence, então trocar de sugestões já zera o destaque.
  const [highlight, setHighlight] = useState({ key: "", index: -1 });
  // A lista só abre enquanto a pessoa digita: buscas por atalho, grade ou link não devem cobrir o painel.
  const [isTyping, setIsTyping] = useState(false);

  const suggestionsKey = suggestions.join("|");
  const activeIndex = highlight.key === suggestionsKey ? highlight.index : -1;
  const isListOpen = suggestions.length > 0 && isTyping;
  const activeOptionId = isListOpen && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined;

  function setActiveIndex(index) {
    setHighlight({ key: suggestionsKey, index });
  }

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    listRef.current.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function handleChange(event) {
    setQuery(event.target.value);
    setIsTyping(true);
  }

  function handleSelect(name) {
    setIsTyping(false);
    setActiveIndex(-1);
    onSearch(name);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsTyping(false);
    onSearch(query);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setIsTyping(false);
      setActiveIndex(-1);
      return;
    }

    if (!isListOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((activeIndex + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1);
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Tab") {
      setIsTyping(false);
    }
  }

  return (
    <m.form
      className="relative grid gap-3 sm:grid-cols-[1fr_auto_auto] lg:grid-cols-2"
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
      <div className="relative min-w-0 lg:col-span-2">
        <input
          id="pokemonInput"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsTyping(false)}
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
          <m.div
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
                  // Sem isso o campo perde o foco no clique e a lista fecha antes de a opção ser escolhida.
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => handleSelect(name)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {formatSearchLabel(name)}
                </div>
              ))}
            </div>
          </m.div>
        ) : null}
      </div>

      <m.button
        className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-amber-300 px-5 font-pixel text-xl font-black uppercase leading-5 text-slate-950 shadow-[inset_0_-4px_0_rgba(91,55,0,0.16)] transition hover:bg-amber-200 lg:px-2 lg:text-lg"
        type="submit"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon name="search" size={20} strokeWidth={3} />
        {status === "loading" ? "Buscando" : "Buscar"}
      </m.button>

      <m.button
        className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border-2 border-white/25 bg-slate-950/20 px-4 font-pixel text-xl font-black uppercase leading-5 text-white transition hover:bg-white/20 lg:px-2 lg:text-lg"
        type="button"
        onClick={onRandom}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon name="shuffle" size={20} strokeWidth={3} />
        Aleatório
      </m.button>
    </m.form>
  );
}
