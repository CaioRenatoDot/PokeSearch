import { useMemo, useState } from "react";
import { m } from "motion/react";
import { formatSearchLabel } from "../utils/search.js";

const tabs = [
  { id: "quick", label: "Rápidos", empty: "Nada por aqui ainda" },
  { id: "suggestions", label: "Sugestões", empty: "Digite para ver sugestões" },
  { id: "favorites", label: "Favoritos", empty: "Marque a estrela de um pokémon" },
  { id: "history", label: "Histórico", empty: "Nada por aqui ainda" }
];

export default function PanelTabs({ quickItems, suggestionItems, favoriteItems, historyItems, onSelect, onClearHistory }) {
  const [activeTab, setActiveTab] = useState("quick");
  const items = useMemo(() => {
    if (activeTab === "suggestions") return suggestionItems;
    if (activeTab === "favorites") return favoriteItems;
    if (activeTab === "history") return historyItems;
    return quickItems;
  }, [activeTab, favoriteItems, historyItems, quickItems, suggestionItems]);
  const emptyMessage = tabs.find(tab => tab.id === activeTab).empty;

  return (
    <section className="flex min-h-0 flex-col rounded-lg border border-white/20 bg-slate-950/20 p-3 lg:min-h-36">
      <div className="mb-3 grid shrink-0 grid-cols-2 gap-1.5 sm:grid-cols-4">
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;

          return (
            <m.button
              key={tab.id}
              className={`min-h-9 rounded border px-1 font-pixel text-xs font-black uppercase leading-4 transition ${
                isActive
                  ? "border-white/40 bg-amber-300 text-dex-ink"
                  : "border-white/15 bg-white/10 text-white/75 hover:bg-white/20"
              }`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
            </m.button>
          );
        })}
      </div>

      <div className="scrollbar-none max-h-40 min-h-0 overflow-y-auto pr-1 sm:max-h-48">
        {items.length ? (
          <div className="grid grid-cols-2 gap-2">
            {items.map((name, index) => (
              <m.button
                key={name}
                className="min-h-10 rounded-lg border border-white/20 bg-slate-950/20 px-2 font-pixel text-sm font-bold uppercase leading-5 transition hover:bg-white/20 sm:min-h-11 sm:px-3 sm:text-base"
                type="button"
                onClick={() => onSelect(name)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025, duration: 0.2 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {formatSearchLabel(name)}
              </m.button>
            ))}
          </div>
        ) : (
          <p className="px-2 py-5 text-center font-pixel text-base font-bold uppercase leading-5 text-white/55">
            {emptyMessage}
          </p>
        )}

        {activeTab === "history" && items.length ? (
          <button
            className="mt-2 w-full rounded px-2 py-1 font-pixel text-sm font-bold uppercase leading-5 text-white/60 transition hover:bg-white/15 hover:text-white"
            type="button"
            onClick={onClearHistory}
          >
            Limpar histórico
          </button>
        ) : null}
      </div>
    </section>
  );
}
