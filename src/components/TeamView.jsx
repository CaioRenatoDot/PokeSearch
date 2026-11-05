import { useMemo, useState } from "react";
import { m } from "motion/react";
import { typeNames } from "../data/pokemon.js";
import { useTeamMembers } from "../hooks/useTeamMembers.js";
import { useTypeResources } from "../hooks/useTypeResources.js";
import { formatName, formatPokemonNumber } from "../utils/formatters.js";
import { normalizePokemonQuery, rankSuggestions, formatSearchLabel } from "../utils/search.js";
import {
  MAX_TEAM_SIZE,
  analyzeTeamDefense,
  averageStats,
  findSolidDefenses,
  findThreats,
  findUncoveredTypes,
  getMemberTypes,
  suggestComplementTypes
} from "../utils/team.js";
import { getPokemonSprite } from "../utils/pokemonSprites.js";
import { buildShareUrl } from "../utils/url.js";
import ActionButton from "./ActionButton.jsx";
import CopyLinkButton from "./CopyLinkButton.jsx";
import Icon from "./Icon.jsx";
import { InfoPanel, InfoRow, PanelNote } from "./InfoPanel.jsx";
import StatBar from "./StatBar.jsx";
import TypeBadge from "./TypeBadge.jsx";

const NO_TYPES = [];

export default function TeamView({ team, pokemonList, currentPokemon, onSelect }) {
  const { names, isShared } = team;
  const loaded = useTeamMembers(names);
  const members = useMemo(() => names.map(name => loaded[name]).filter(Boolean), [names, loaded]);
  const emptySlots = Math.max(0, MAX_TEAM_SIZE - names.length);

  function handleClear() {
    if (window.confirm("Remover todos os pokémon do time?")) team.clear();
  }

  return (
    <m.div
      className="w-full min-w-0 lg:scrollbar-none lg:h-full lg:overflow-y-auto lg:pr-1"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl leading-7 text-dex-ink sm:text-2xl">
          {isShared ? "Time compartilhado" : "Meu time"}
          <span className="ml-3 font-pixel text-lg text-emerald-950/55">
            {names.length}/{MAX_TEAM_SIZE}
          </span>
        </h2>
        {names.length ? (
          <div className="flex flex-wrap gap-2">
            <CopyLinkButton
              getUrl={() => buildShareUrl({ view: "team", team: names, pokemon: null, versus: null })}
            />
            {isShared ? null : <ActionButton icon="x" onClick={handleClear}>Limpar</ActionButton>}
          </div>
        ) : null}
      </div>

      {isShared ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-amber-600/45 bg-amber-200/70 px-3 py-2">
          <p className="font-pixel text-base font-black uppercase leading-5 text-dex-ink">
            Este time veio de um link. O seu continua salvo.
          </p>
          <div className="flex flex-wrap gap-2">
            <ActionButton onClick={team.keepShared}>Usar como meu time</ActionButton>
            <ActionButton onClick={team.leaveShared}>Ver meu time</ActionButton>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {names.map(name => (
          <TeamSlot
            key={name}
            name={name}
            member={loaded[name]}
            onOpen={() => onSelect(name)}
            onRemove={isShared ? null : () => team.remove(name)}
          />
        ))}
        {isShared
          ? null
          : Array.from({ length: emptySlots }, (_, index) => <EmptySlot key={index} />)}
      </div>

      {isShared ? null : (
        <TeamPicker team={team} pokemonList={pokemonList} currentPokemon={currentPokemon} />
      )}

      {names.length ? (
        <TeamAnalysis members={members} />
      ) : (
        <div className="mt-4 pb-4">
          <PanelNote>
            Monte um time de até seis pokémon para ver as fraquezas em comum, os tipos que ele não acerta e o que
            falta para fechar a equipe.
          </PanelNote>
        </div>
      )}
    </m.div>
  );
}

function TeamSlot({ name, member, onOpen, onRemove }) {
  const label = formatName(member?.name ?? name);

  return (
    <div className="relative">
      <button
        className="grid h-full w-full content-start justify-items-center gap-1 rounded-lg border-2 border-emerald-950/20 bg-white/45 p-2 text-center transition hover:bg-white/75"
        type="button"
        onClick={onOpen}
      >
        <div className="grid h-20 w-20 place-items-center">
          {member ? (
            <img
              className="pokemon-sprite-image h-20 w-20 object-contain [image-rendering:pixelated]"
              src={getPokemonSprite(member, "official").src}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>
        {member ? (
          <span className="font-pixel text-sm font-black uppercase leading-4 text-emerald-950/55">
            {formatPokemonNumber(member.id)}
          </span>
        ) : null}
        <span className="font-pixel text-base font-black uppercase leading-5 text-dex-ink [overflow-wrap:anywhere]">
          {label}
        </span>
        {member === null ? (
          <span className="font-pixel text-sm font-black uppercase leading-4 text-[#7b2d25]">Não encontrado</span>
        ) : null}
        {member ? (
          <span className="mt-1 flex flex-wrap justify-center gap-1">
            {getMemberTypes(member).map(type => (
              <TypeBadge key={type} type={type} />
            ))}
          </span>
        ) : null}
      </button>
      {onRemove ? (
        <button
          className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded text-emerald-950/55 transition hover:bg-white/80 hover:text-dex-ink"
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${label} do time`}
        >
          <Icon name="x" size={16} strokeWidth={3} />
        </button>
      ) : null}
    </div>
  );
}

function EmptySlot() {
  return (
    <div
      className="grid min-h-40 place-items-center rounded-lg border-2 border-dashed border-emerald-950/25 text-emerald-950/30"
      aria-hidden="true"
    >
      <Icon name="plus" size={24} strokeWidth={3} />
    </div>
  );
}

function TeamPicker({ team, pokemonList, currentPokemon }) {
  const [text, setText] = useState("");
  const results = useMemo(
    () => rankSuggestions(pokemonList, normalizePokemonQuery(text)),
    [pokemonList, text]
  );
  const exactMatch = pokemonList.find(entry => entry.name === normalizePokemonQuery(text));
  const options = exactMatch ? [exactMatch.name, ...results] : results;
  const canAddCurrent = currentPokemon && !team.isFull && !team.isInTeam(currentPokemon.name);

  function addFromPicker(name) {
    team.add(name);
    setText("");
  }

  if (team.isFull) return null;

  return (
    <div className="mt-4 grid gap-2">
      <div className="flex flex-wrap gap-2">
        <input
          className="h-11 min-w-48 flex-1 rounded border-2 border-emerald-950/25 bg-white/70 px-3 font-pixel text-base font-black text-dex-ink outline-none transition focus:border-dex-dark"
          type="search"
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="Adicionar pelo nome ou número"
          aria-label="Adicionar pokémon ao time pelo nome ou número"
          autoComplete="off"
          spellCheck={false}
        />
        {canAddCurrent ? (
          <ActionButton icon="plus" onClick={() => team.add(currentPokemon.name)}>
            {formatName(currentPokemon.name)}
          </ActionButton>
        ) : null}
      </div>
      {options.length ? (
        <div className="flex flex-wrap gap-2">
          {options.map(name => (
            <ActionButton key={name} icon="plus" disabled={team.isInTeam(name)} onClick={() => addFromPicker(name)}>
              {formatSearchLabel(name)}
            </ActionButton>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TeamAnalysis({ members }) {
  const { index, isLoading, failed } = useTypeResources(members.length ? typeNames : NO_TYPES);

  const analysis = useMemo(() => {
    if (!index || !members.length) return null;

    const memberTypes = members.map(getMemberTypes);
    const defense = analyzeTeamDefense(memberTypes, index);
    const threats = findThreats(defense);
    const uncovered = findUncoveredTypes(memberTypes, index);

    return {
      threats,
      solid: findSolidDefenses(defense),
      uncovered,
      suggestions: suggestComplementTypes(threats, uncovered, index),
      averages: averageStats(members)
    };
  }, [index, members]);

  if (failed) {
    return (
      <div className="mt-4 pb-4">
        <PanelNote>Não consegui carregar as relações de tipo para analisar o time.</PanelNote>
      </div>
    );
  }

  if (isLoading || !analysis) {
    return (
      <div className="mt-4 pb-4">
        <PanelNote>Analisando o time...</PanelNote>
      </div>
    );
  }

  const averageTotal = analysis.averages.reduce((total, stat) => total + stat.base_stat, 0);

  return (
    <div className="mt-4 grid gap-4 pb-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="grid min-w-0 content-start gap-4">
        <InfoPanel title="Fraquezas em comum">
          {analysis.threats.length ? (
            <div className="grid gap-2">
              <TypeList types={analysis.threats} getSuffix={row => `${row.weak}/${members.length}`} />
              <PanelNote>Quantos membros levam dano aumentado de cada tipo, sem resposta suficiente no time.</PanelNote>
            </div>
          ) : (
            <PanelNote>Nenhum tipo pega vários membros de uma vez sem resposta.</PanelNote>
          )}
        </InfoPanel>

        <InfoPanel title="Defesas sólidas">
          {analysis.solid.length ? (
            <TypeList types={analysis.solid} getSuffix={row => `${row.resist + row.immune}/${members.length}`} />
          ) : (
            <PanelNote>Ainda não há tipo que dois membros seguram sem ninguém sofrer.</PanelNote>
          )}
        </InfoPanel>

        <InfoPanel title="Sem cobertura">
          {analysis.uncovered.length ? (
            <div className="grid gap-2">
              <TypeList types={analysis.uncovered.map(type => ({ type }))} />
              <PanelNote>Tipos que nenhum membro atinge com dano dobrado usando golpes do próprio tipo.</PanelNote>
            </div>
          ) : (
            <PanelNote>O time acerta todos os 18 tipos com golpes do próprio tipo.</PanelNote>
          )}
        </InfoPanel>
      </section>

      <section className="grid min-w-0 content-start gap-4">
        <InfoPanel title="Para a próxima vaga">
          {analysis.suggestions.length ? (
            <div className="grid gap-2">
              <TypeList types={analysis.suggestions.map(type => ({ type }))} />
              <PanelNote>Tipos que seguram as fraquezas do time ou acertam o que ele ainda não cobre.</PanelNote>
            </div>
          ) : (
            <PanelNote>O time está equilibrado nos tipos.</PanelNote>
          )}
        </InfoPanel>

        <InfoPanel title="Média de atributos">
          <div className="grid gap-3">
            {analysis.averages.map(stat => (
              <StatBar key={stat.stat.name} stat={stat} />
            ))}
          </div>
          <div className="mt-2">
            <InfoRow label="Total médio" value={averageTotal} />
          </div>
        </InfoPanel>
      </section>
    </div>
  );
}

function TypeList({ types, getSuffix }) {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map(row => (
        <TypeBadge key={row.type} type={row.type} suffix={getSuffix?.(row)} />
      ))}
    </div>
  );
}
