import { useMemo, useState } from "react";
import { damageClassLabels } from "../data/pokemon.js";
import { useMoveDetails } from "../hooks/useMoveDetails.js";
import { formatName } from "../utils/formatters.js";
import { getMovesByMethod, moveMethods } from "../utils/moves.js";
import ActionButton from "./ActionButton.jsx";
import { InfoPanel, PanelNote } from "./InfoPanel.jsx";
import TypeBadge from "./TypeBadge.jsx";

const COLLAPSED_COUNT = 12;

export default function MovesPanel({ pokemon }) {
  const groups = useMemo(() => getMovesByMethod(pokemon), [pokemon]);
  const available = moveMethods.filter(method => groups[method.id].length);
  const [selectedMethod, setSelectedMethod] = useState("level-up");
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMove, setOpenMove] = useState(null);

  const method = available.some(item => item.id === selectedMethod) ? selectedMethod : available[0]?.id;
  const moves = method ? groups[method] : [];
  const visibleMoves = isExpanded ? moves : moves.slice(0, COLLAPSED_COUNT);

  function selectMethod(id) {
    setSelectedMethod(id);
    setIsExpanded(false);
    setOpenMove(null);
  }

  return (
    <InfoPanel title="Golpes">
      {available.length ? (
        <>
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Forma de aprender o golpe">
            {available.map(item => (
              <ActionButton
                key={item.id}
                isActive={item.id === method}
                aria-pressed={item.id === method}
                onClick={() => selectMethod(item.id)}
              >
                {item.label} ({groups[item.id].length})
              </ActionButton>
            ))}
          </div>

          <div className="grid gap-2">
            {visibleMoves.map(move => (
              <MoveRow
                key={move.name}
                move={move}
                isOpen={openMove === move.name}
                onToggle={() => setOpenMove(current => (current === move.name ? null : move.name))}
              />
            ))}
          </div>

          {moves.length > COLLAPSED_COUNT ? (
            <div className="mt-3">
              <ActionButton onClick={() => setIsExpanded(current => !current)}>
                {isExpanded ? "Ver menos" : `Ver todos (${moves.length})`}
              </ActionButton>
            </div>
          ) : null}
        </>
      ) : (
        <PanelNote>Sem golpes registrados para este pokémon.</PanelNote>
      )}
    </InfoPanel>
  );
}

function MoveRow({ move, isOpen, onToggle }) {
  return (
    <div className="border-b-2 border-emerald-950/10 pb-2 last:border-b-0 last:pb-0">
      <button
        className={`grid min-h-8 w-full items-center gap-3 rounded text-left transition hover:bg-white/50 ${
          move.level ? "grid-cols-[auto_1fr_auto]" : "grid-cols-[1fr_auto]"
        }`}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {move.level ? (
          <span className="grid h-8 min-w-16 place-items-center rounded border-2 border-emerald-950/25 bg-[#f8efd0] px-2 font-pixel text-sm font-black uppercase leading-4 text-emerald-950/70">
            Nv {move.level}
          </span>
        ) : null}
        <span className="font-pixel text-base font-black uppercase leading-5 text-dex-ink">{formatName(move.name)}</span>
        <span className="pr-1 font-pixel text-lg font-black leading-none text-emerald-950/45" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen ? <MoveDetails name={move.name} /> : null}
    </div>
  );
}

function MoveDetails({ name }) {
  const { summary, failed } = useMoveDetails(name);

  if (failed) return <div className="mt-2"><PanelNote>Não consegui carregar este golpe.</PanelNote></div>;
  if (!summary) return <div className="mt-2"><PanelNote>Carregando...</PanelNote></div>;

  return (
    <div className="mt-3 grid gap-3 pb-1">
      <div className="flex flex-wrap items-center gap-2">
        {summary.type ? <TypeBadge type={summary.type} /> : null}
        <MoveStat label="Classe" value={damageClassLabels[summary.damageClass] || "—"} />
        <MoveStat label="Poder" value={summary.power ?? "—"} />
        <MoveStat label="Precisão" value={summary.accuracy === null ? "—" : `${summary.accuracy}%`} />
        <MoveStat label="PP" value={summary.pp ?? "—"} />
      </div>
      {summary.effect ? <PanelNote>{summary.effect}</PanelNote> : null}
    </div>
  );
}

function MoveStat({ label, value }) {
  return (
    <span className="rounded border-2 border-emerald-950/20 bg-white/60 px-2 py-1 font-pixel text-sm font-black uppercase leading-5 text-dex-ink">
      <span className="mr-1.5 text-emerald-950/55">{label}</span>
      {value}
    </span>
  );
}
