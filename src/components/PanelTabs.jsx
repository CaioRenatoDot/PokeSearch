import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { formatSearchLabel } from "../utils/search.js";

const tabs = [
  { id: "quick", label: "Rápidos" },
  { id: "suggestions", label: "Sugestões" },
  { id: "history", label: "Histórico" }
];

export default function PanelTabs({ quickItems, suggestionItems, historyItems, onSelect }) {
  const [activeTab, setActiveTab] = useState("quick");
  const items = useMemo(() => {
    if (activeTab === "suggestions") return suggestionItems;
    if (activeTab === "history") return historyItems;
    return quickItems;
  }, [activeTab, historyItems, quickItems, suggestionItems]);

  return (
    <section className="min-h-0 rounded-lg border border-white/20 bg-slate-950/20 p-3">
      <div className="mb-3 grid grid-cols-3 gap-1.5 sm:gap-2">
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;

          return (
            <motion.button
              key={tab.id}
              className={`min-h-9 rounded border px-1.5 font-pixel text-xs font-black uppercase leading-4 transition sm:px-2 sm:text-sm ${
                isActive
                  ? "border-white/40 bg-amber-300 text-dex-ink"
                  : "border-white/15 bg-white/10 text-white/75 hover:bg-white/20"
              }`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      <div className="scrollbar-none max-h-40 overflow-y-auto pr-1 sm:max-h-48">
        {items.length ? (
          <div className="grid grid-cols-2 gap-2">
            {items.map((name, index) => (
              <motion.button
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
              </motion.button>
            ))}
          </div>
        ) : (
          <p className="px-2 py-5 text-center font-pixel text-base font-bold uppercase leading-5 text-white/55">
            Nada por aqui ainda
          </p>
        )}
      </div>
    </section>
  );
}
