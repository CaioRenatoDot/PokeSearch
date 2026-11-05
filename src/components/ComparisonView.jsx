import { m } from "motion/react";
import { statLabels } from "../data/pokemon.js";
import { formatName, formatPokemonNumber } from "../utils/formatters.js";
import ActionButton from "./ActionButton.jsx";
import CopyLinkButton from "./CopyLinkButton.jsx";
import PokemonSprite from "./PokemonSprite.jsx";
import TypeBadge from "./TypeBadge.jsx";

function totalStats(pokemon) {
  return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
}

export default function ComparisonView({ pinned, current, onClear }) {
  const rows = pinned.stats.map((stat, index) => ({
    name: stat.stat.name,
    pinnedValue: stat.base_stat,
    currentValue: current.stats[index]?.base_stat ?? 0
  }));

  const pinnedTotal = totalStats(pinned);
  const currentTotal = totalStats(current);

  return (
    <m.div
      className="w-full min-w-0 lg:scrollbar-none lg:h-full lg:overflow-y-auto lg:pr-1"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl leading-7 text-dex-ink sm:text-2xl">Comparação</h2>
        <div className="flex flex-wrap gap-2">
          <CopyLinkButton />
          <ActionButton onClick={onClear}>Encerrar</ActionButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ComparisonHeader pokemon={pinned} caption="Fixado" />
        <ComparisonHeader pokemon={current} caption="Atual" />
      </div>

      <div className="mt-4 grid gap-2 pb-4">
        {rows.map(row => (
          <StatComparisonRow key={row.name} row={row} />
        ))}
        <StatComparisonRow
          row={{ name: "total", pinnedValue: pinnedTotal, currentValue: currentTotal }}
          label="Total"
        />
      </div>
    </m.div>
  );
}

function ComparisonHeader({ pokemon, caption }) {
  return (
    <div className="grid content-start gap-2 rounded-lg border-2 border-emerald-950/20 bg-white/45 p-3 text-center">
      <p className="font-pixel text-sm font-black uppercase leading-5 text-emerald-950/55">{caption}</p>
      <div className="mx-auto grid h-28 w-full place-items-center sm:h-36">
        <PokemonSprite pokemon={pokemon} compact mode="official" />
      </div>
      <p className="font-pixel text-sm font-black uppercase leading-5 text-emerald-950/55">
        {formatPokemonNumber(pokemon.id)}
      </p>
      <h3 className="font-display text-lg leading-6 text-dex-ink [overflow-wrap:anywhere] sm:text-xl">
        {formatName(pokemon.name)}
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {pokemon.types.map(item => (
          <TypeBadge key={item.type.name} type={item.type.name} />
        ))}
      </div>
    </div>
  );
}

function StatComparisonRow({ row, label }) {
  const { pinnedValue, currentValue } = row;
  const highest = Math.max(pinnedValue, currentValue, 1);
  const difference = currentValue - pinnedValue;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded border-2 border-emerald-950/20 bg-[#f8efd0] px-3 py-2 shadow-[inset_0_-4px_0_rgba(20,32,51,0.08)]">
      <StatSide value={pinnedValue} share={pinnedValue / highest} isWinner={difference < 0} align="right" />

      <div className="min-w-24 text-center">
        <span className="block font-pixel text-sm font-black uppercase leading-4 text-emerald-950/60">
          {label || statLabels[row.name] || formatName(row.name)}
        </span>
        <span
          className={`block font-pixel text-sm font-black uppercase leading-4 ${
            difference > 0 ? "text-[#245f34]" : difference < 0 ? "text-[#7b2d25]" : "text-emerald-950/45"
          }`}
        >
          {difference > 0 ? `+${difference}` : difference}
        </span>
      </div>

      <StatSide value={currentValue} share={currentValue / highest} isWinner={difference > 0} align="left" />
    </div>
  );
}

function StatSide({ value, share, isWinner, align }) {
  return (
    <div className={align === "right" ? "grid justify-items-end" : "grid justify-items-start"}>
      <strong className="font-pixel text-lg font-black leading-5 text-dex-ink">{value}</strong>
      <div className={`mt-1 h-3 w-full rounded border-2 border-dex-dark bg-[#142033] p-px ${align === "right" ? "flex justify-end" : ""}`}>
        <m.span
          className={`block h-full rounded-[1px] ${isWinner ? "bg-[#58d36f]" : "bg-[#7cb7ff]"}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(4, share * 100)}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
