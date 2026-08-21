import { useState } from "react";
import { motion } from "motion/react";
import { formatName, formatPokemonNumber } from "../utils/formatters.js";
import { getFlavorText, getGenus, getHabitat } from "../utils/pokemonSpecies.js";
import { usePokemonSpecies } from "../hooks/usePokemonSpecies.js";
import { useEvolutionChain } from "../hooks/useEvolutionChain.js";
import EvolutionChain from "./EvolutionChain.jsx";
import FactCard from "./FactCard.jsx";
import Icon from "./Icon.jsx";
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
  onSelectPokemon
}) {
  const [spriteMode, setSpriteMode] = useState("animated");
  const species = usePokemonSpecies(pokemon);
  const flavorText = getFlavorText(species);
  const genus = getGenus(species);
  const habitat = getHabitat(species);
  const evolutionStages = useEvolutionChain(species);
  const types = pokemon.types.map(item => item.type.name);
  const abilities = pokemon.abilities.map(item => ({
    name: formatName(item.ability.name),
    hidden: item.is_hidden
  }));
  const primaryAbilities = abilities.slice(0, 2).map(item => item.name).join(", ");
  const moves = pokemon.moves.slice(0, 10).map(item => formatName(item.move.name));
  const spriteCount = countSprites(pokemon.sprites);

  return (
    <motion.article
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

      <motion.div
        className="grid gap-4 rounded-lg border border-transparent bg-transparent p-0 shadow-none transition-colors duration-300 sm:gap-5 lg:p-3 xl:grid-cols-[minmax(420px,1fr)_minmax(420px,1fr)]"
        animate={{ scale: 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <motion.div
          className="grid place-items-center rounded-lg border border-emerald-950/15 bg-white/30 p-3"
          animate={{ minHeight: 280 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          variants={itemVariants}
        >
          <PokemonSprite pokemon={pokemon} mode={spriteMode} />
        </motion.div>

        <motion.div
          className="flex min-h-0 flex-col justify-center rounded-lg bg-white/25 p-4 sm:p-6"
          variants={itemVariants}
        >
          <motion.div className="flex items-center justify-between gap-3" variants={itemVariants}>
            <p className="font-display text-xs leading-6 text-emerald-950/70">{formatPokemonNumber(pokemon.id)}</p>
            <div className="flex items-center gap-2">
              {comparison.isPinned ? null : (
                <motion.button
                  className="rounded border-2 border-emerald-950/25 bg-white/60 px-3 py-2 font-pixel text-base font-black uppercase leading-5 text-dex-ink shadow-[inset_0_-3px_0_rgba(20,32,51,0.08)] transition hover:bg-white/85"
                  type="button"
                  onClick={() => comparison.onPin(pokemon)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Comparar
                </motion.button>
              )}
              <NavButton icon="chevronLeft" label="Pokémon anterior" onClick={onPrevious} disabled={!hasPrevious} />
              <NavButton icon="chevronRight" label="Próximo Pokémon" onClick={onNext} disabled={!hasNext} />
            </div>
          </motion.div>
          <motion.h2
            className="mt-2 font-display leading-tight capitalize text-dex-ink"
            animate={{ fontSize: "clamp(2rem, 11vw, 3rem)" }}
            transition={{ duration: 0.24 }}
            variants={itemVariants}
          >
            {formatName(pokemon.name)}
          </motion.h2>

          <motion.div className="mt-5 flex flex-wrap gap-2" variants={itemVariants}>
            {types.map(type => (
              <TypeBadge key={type} type={type} />
            ))}
          </motion.div>

          <SpriteModeControl value={spriteMode} onChange={setSpriteMode} />

          <motion.div className="mt-6 grid gap-3 sm:grid-cols-3" variants={itemVariants}>
            <FactCard icon="ruler" label="Altura" value={`${(pokemon.height / 10).toFixed(1)} m`} />
            <FactCard icon="weight" label="Peso" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
            <FactCard icon="sparkles" label="Habilidade" value={primaryAbilities} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-4 pb-4 pt-5 xl:grid-cols-[minmax(340px,0.85fr)_minmax(420px,1.15fr)]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.36, ease: "easeOut" }}
      >
        <section className="grid content-start gap-4">
          <InfoPanel title="Pokedex">
            <p className="font-display text-base leading-6 text-dex-ink">
              {flavorText || "Carregando a descrição..."}
            </p>
            <div className="mt-3 grid gap-2">
              <InfoRow label="Categoria" value={genus || "—"} />
              <InfoRow label="Habitat" value={habitat ? formatName(habitat) : "—"} />
              <InfoRow label="Captura" value={species ? `${species.capture_rate}/255` : "—"} />
            </div>
          </InfoPanel>

          <InfoPanel title="Dados de treino">
            <InfoRow label="Experiência" value={pokemon.base_experience ?? "N/A"} />
            <InfoRow label="Ordem" value={pokemon.order ?? "N/A"} />
            <InfoRow label="Sprites" value={spriteCount} />
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

        <section className="grid content-start gap-4">
          <InfoPanel title="Atributos">
            <div className="grid gap-3">
              {pokemon.stats.map(stat => (
                <StatBar key={stat.stat.name} stat={stat} />
              ))}
            </div>
          </InfoPanel>

          <InfoPanel title="Golpes iniciais">
            <div className="flex flex-wrap gap-2">
              {moves.map(move => (
                <span
                  key={move}
                  className="rounded border-2 border-dex-dark bg-white/70 px-3 py-2 font-pixel text-base font-black text-dex-ink shadow-[inset_0_-2px_0_rgba(20,32,51,0.08)]"
                >
                  {move}
                </span>
              ))}
            </div>
          </InfoPanel>
        </section>
      </motion.div>

      {evolutionStages.length > 1 ? (
        <div className="pb-4">
          <InfoPanel title="Evolução">
            <EvolutionChain stages={evolutionStages} currentId={pokemon.id} onSelect={onSelectPokemon} />
          </InfoPanel>
        </div>
      ) : null}
    </motion.article>
  );
}

function NavButton({ icon, label, onClick, disabled }) {
  return (
    <motion.button
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
    </motion.button>
  );
}

function InfoPanel({ title, children }) {
  return (
    <motion.div
      className="rounded-lg border-2 border-emerald-950/20 bg-white/45 p-4 shadow-[inset_0_-4px_0_rgba(20,32,51,0.06)]"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.28 }}
    >
      <h3 className="mb-4 font-pixel text-xl font-black uppercase leading-6 text-dex-ink sm:text-2xl">{title}</h3>
      {children}
    </motion.div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b-2 border-emerald-950/10 py-2 last:border-b-0">
      <span className="font-pixel text-lg font-black uppercase text-emerald-950/60">{label}</span>
      <strong className="font-display text-base leading-5 text-dex-ink">{value}</strong>
    </div>
  );
}

function countSprites(sprites) {
  return Object.values(sprites).reduce((total, value) => {
    if (!value) return total;
    if (typeof value === "string") return total + 1;
    if (typeof value === "object") return total + countSprites(value);
    return total;
  }, 0);
}
