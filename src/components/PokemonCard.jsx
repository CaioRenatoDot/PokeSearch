import { useState } from "react";
import { m } from "motion/react";
import { habitatLabels } from "../data/pokemon.js";
import { formatName, formatPokemonNumber } from "../utils/formatters.js";
import {
  getEggGroups,
  getFlavorText,
  getGenderRatio,
  getGenerationLabel,
  getGenus,
  getHabitat,
  getRarityLabel,
  getSpeciesId,
  getVarieties
} from "../utils/pokemonSpecies.js";
import { usePokemonSpecies } from "../hooks/usePokemonSpecies.js";
import { useEvolutionChain } from "../hooks/useEvolutionChain.js";
import { useTypeEffectiveness } from "../hooks/useTypeEffectiveness.js";
import ActionButton from "./ActionButton.jsx";
import CopyLinkButton from "./CopyLinkButton.jsx";
import EvolutionChain from "./EvolutionChain.jsx";
import FactCard from "./FactCard.jsx";
import Icon from "./Icon.jsx";
import { InfoPanel, InfoRow, PanelNote } from "./InfoPanel.jsx";
import MovesPanel from "./MovesPanel.jsx";
import PokemonForms from "./PokemonForms.jsx";
import PokemonSprite from "./PokemonSprite.jsx";
import SpriteModeControl from "./SpriteModeControl.jsx";
import StatBar from "./StatBar.jsx";
import TypeBadge from "./TypeBadge.jsx";

const cardVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.18,
      duration: 0.34,
      ease: "easeOut",
      staggerChildren: 0.055
    }
  },
  exit: { opacity: 0, y: -18, filter: "blur(6px)", transition: { duration: 0.22 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } }
};

export default function PokemonCard({
  pokemon,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  comparison,
  favorites,
  onSelectPokemon
}) {
  const [spriteMode, setSpriteMode] = useState("animated");
  const species = usePokemonSpecies(pokemon);
  const isSpeciesLoading = species === undefined;
  const genus = getGenus(species);
  const habitat = getHabitat(species);
  const evolutionStages = useEvolutionChain(species);
  const varieties = getVarieties(species);
  const types = pokemon.types.map(item => item.type.name);
  const effectiveness = useTypeEffectiveness(types);
  const abilities = pokemon.abilities.map(item => ({
    name: formatName(item.ability.name),
    hidden: item.is_hidden
  }));
  const primaryAbilities = abilities.slice(0, 2).map(item => item.name).join(", ");
  const statTotal = pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  const rarity = getRarityLabel(species);
  const isFavorite = favorites.isFavorite(pokemon.name);
  const speciesFallback = isSpeciesLoading ? "Carregando..." : "—";

  return (
    <m.article
      className="w-full pr-0 lg:scrollbar-none lg:h-full lg:overflow-y-auto lg:pr-1"
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {comparison.isPinned ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-amber-600/45 bg-amber-200/70 px-3 py-2">
          <p className="font-pixel text-base font-black uppercase leading-5 text-dex-ink">
            Fixado para comparação. Busque outro pokémon.
          </p>
          <button
            className="rounded border-2 border-emerald-950/25 bg-white/70 px-3 py-1.5 font-pixel text-base font-black uppercase leading-5 text-dex-ink transition hover:bg-white"
            type="button"
            onClick={comparison.onClear}
          >
            Cancelar
          </button>
        </div>
      ) : null}

      <m.div
        className="grid gap-4 rounded-lg border border-transparent bg-transparent p-0 shadow-none transition-colors duration-300 sm:gap-5 lg:p-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        animate={{ scale: 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <m.div
          className="grid place-items-center rounded-lg border border-emerald-950/15 bg-white/30 p-3"
          animate={{ minHeight: 280 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          variants={itemVariants}
        >
          <PokemonSprite pokemon={pokemon} mode={spriteMode} />
        </m.div>

        <m.div
          className="flex min-h-0 flex-col justify-center rounded-lg bg-white/25 p-4 sm:p-6"
          variants={itemVariants}
        >
          <m.div className="flex items-center justify-between gap-3" variants={itemVariants}>
            <p className="font-display text-xs leading-6 text-emerald-950/70">{formatPokemonNumber(pokemon.id)}</p>
            <div className="flex items-center gap-2">
              <NavButton icon="chevronLeft" label="Pokémon anterior" onClick={onPrevious} disabled={!hasPrevious} />
              <NavButton icon="chevronRight" label="Próximo Pokémon" onClick={onNext} disabled={!hasNext} />
            </div>
          </m.div>
          <m.h2
            className="mt-2 font-display leading-tight capitalize text-dex-ink [overflow-wrap:anywhere]"
            animate={{ fontSize: "clamp(1.75rem, 8vw, 3rem)" }}
            transition={{ duration: 0.24 }}
            variants={itemVariants}
          >
            {formatName(pokemon.name)}
          </m.h2>

          <m.div className="mt-5 flex flex-wrap items-center gap-2" variants={itemVariants}>
            {types.map(type => (
              <TypeBadge key={type} type={type} />
            ))}
            {rarity ? (
              <span className="rounded-lg border-2 border-amber-600/60 bg-amber-200 px-3 py-1.5 font-pixel text-base font-black uppercase leading-5 text-dex-ink">
                {rarity}
              </span>
            ) : null}
          </m.div>

          <m.div className="mt-4 flex flex-wrap gap-2" variants={itemVariants}>
            <ActionButton
              icon="star"
              iconFilled={isFavorite}
              isActive={isFavorite}
              aria-pressed={isFavorite}
              onClick={() => favorites.toggle(pokemon.name)}
            >
              {isFavorite ? "Favorito" : "Favoritar"}
            </ActionButton>
            {comparison.isPinned ? null : (
              <ActionButton icon="compare" onClick={() => comparison.onPin(pokemon)}>
                Comparar
              </ActionButton>
            )}
            <CopyLinkButton />
          </m.div>

          <SpriteModeControl value={spriteMode} onChange={setSpriteMode} />

          <m.div className="mt-6 grid grid-cols-2 gap-3" variants={itemVariants}>
            <FactCard icon="ruler" label="Altura" value={`${(pokemon.height / 10).toFixed(1)} m`} />
            <FactCard icon="weight" label="Peso" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
            <div className="col-span-2">
              <FactCard icon="sparkles" label="Habilidade" value={primaryAbilities} />
            </div>
          </m.div>
        </m.div>
      </m.div>

      <m.div
        className="grid gap-4 pb-4 pt-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.36, ease: "easeOut" }}
      >
        <section className="grid min-w-0 content-start gap-4">
          <InfoPanel title="Pokedex">
            <p className="font-display text-base leading-6 text-dex-ink">
              {isSpeciesLoading
                ? "Carregando a descrição..."
                : getFlavorText(species) || "Descrição indisponível no momento."}
            </p>
            <div className="mt-3 grid gap-2">
              <InfoRow label="Categoria" value={genus || speciesFallback} />
              <InfoRow label="Habitat" value={habitat ? habitatLabels[habitat] || formatName(habitat) : speciesFallback} />
              <InfoRow label="Geração" value={getGenerationLabel(species) || speciesFallback} />
            </div>
          </InfoPanel>

          <InfoPanel title="Dados de treino">
            <InfoRow label="Experiência" value={pokemon.base_experience ?? "N/A"} />
            <InfoRow label="Captura" value={species ? `${species.capture_rate}/255` : speciesFallback} />
            <InfoRow label="Amizade base" value={species?.base_happiness ?? speciesFallback} />
            <InfoRow label="Gênero" value={getGenderRatio(species) || speciesFallback} />
            <InfoRow label="Grupos de ovo" value={getEggGroups(species) || speciesFallback} />
          </InfoPanel>

          <InfoPanel title="Habilidades">
            <div className="grid gap-2">
              {abilities.map(ability => (
                <span
                  key={`${ability.name}-${ability.hidden}`}
                  className="rounded border-2 border-emerald-950/20 bg-[#f8efd0] px-3 py-2 font-pixel text-lg font-black text-dex-ink shadow-[inset_0_-3px_0_rgba(20,32,51,0.08)]"
                >
                  {ability.name}
                  {ability.hidden ? <em className="ml-2 not-italic text-emerald-950/50">(oculta)</em> : null}
                </span>
              ))}
            </div>
          </InfoPanel>
        </section>

        <section className="grid min-w-0 content-start gap-4">
          <InfoPanel title="Atributos">
            <div className="grid gap-3">
              {pokemon.stats.map(stat => (
                <StatBar key={stat.stat.name} stat={stat} />
              ))}
            </div>
            <div className="mt-2">
              <InfoRow label="Total" value={statTotal} />
            </div>
          </InfoPanel>

          <InfoPanel title="Tipos em batalha">
            <TypeMatchups effectiveness={effectiveness} />
          </InfoPanel>

          <MovesPanel pokemon={pokemon} />
        </section>
      </m.div>

      {evolutionStages.length > 1 ? (
        <div className="pb-4">
          <InfoPanel title="Evolução">
            <EvolutionChain
              stages={evolutionStages}
              currentSpeciesId={getSpeciesId(pokemon)}
              onSelect={onSelectPokemon}
            />
          </InfoPanel>
        </div>
      ) : null}

      {varieties.length > 1 ? (
        <div className="pb-4">
          <InfoPanel title="Formas">
            <PokemonForms varieties={varieties} currentName={pokemon.name} onSelect={onSelectPokemon} />
          </InfoPanel>
        </div>
      ) : null}
    </m.article>
  );
}

function TypeMatchups({ effectiveness }) {
  const { groups, strongAgainst, isLoading, failed } = effectiveness;

  if (isLoading) return <PanelNote>Carregando...</PanelNote>;
  if (failed) return <PanelNote>Não consegui carregar as relações de tipo.</PanelNote>;

  return (
    <div className="grid gap-3">
      <p className="font-pixel text-base font-black uppercase leading-5 text-dex-ink">Dano recebido</p>
      {groups.length ? (
        groups.map(group => (
          <div key={group.multiplier} className="grid gap-2">
            <span className="font-pixel text-lg font-black uppercase leading-5 text-emerald-950/60">{group.label}</span>
            <div className="flex flex-wrap gap-2">
              {group.types.map(type => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <PanelNote>Sem vantagens ou fraquezas fora do normal.</PanelNote>
      )}

      {strongAgainst.length ? (
        <>
          <p className="mt-2 font-pixel text-base font-black uppercase leading-5 text-dex-ink">Forte contra</p>
          <div className="flex flex-wrap gap-2">
            {strongAgainst.map(type => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function NavButton({ icon, label, onClick, disabled }) {
  return (
    <m.button
      className="grid h-10 w-10 place-items-center rounded border-2 border-emerald-950/25 bg-white/60 text-dex-ink shadow-[inset_0_-3px_0_rgba(20,32,51,0.08)] transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white/60"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
    >
      <Icon name={icon} size={20} strokeWidth={3} />
    </m.button>
  );
}
