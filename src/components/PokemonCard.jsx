import { useState } from "react";
import { motion } from "motion/react";
import { formatName, formatPokemonNumber } from "../utils/formatters.js";
import FactCard from "./FactCard.jsx";
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

export default function PokemonCard({ pokemon }) {
  const [isCompact, setIsCompact] = useState(false);
  const [spriteMode, setSpriteMode] = useState("animated");
  const types = pokemon.types.map(item => item.type.name);
  const abilities = pokemon.abilities.map(item => ({
    name: formatName(item.ability.name),
    hidden: item.is_hidden
  }));
  const primaryAbilities = abilities.slice(0, 2).map(item => item.name).join(", ");
  const moves = pokemon.moves.slice(0, 10).map(item => formatName(item.move.name));
  const spriteCount = countSprites(pokemon.sprites);

  function handleScroll(event) {
    const nextCompact = event.currentTarget.scrollTop > 70;

    if (nextCompact !== isCompact) {
      setIsCompact(nextCompact);
    }
  }

  return (
    <motion.article
      className="scrollbar-none h-full w-full overflow-y-auto pr-1"
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      onScroll={handleScroll}
    >
      <motion.div
        className={`sticky top-0 z-10 grid gap-5 rounded-lg p-3 transition-colors duration-300 xl:grid-cols-[minmax(420px,1fr)_minmax(420px,1fr)] ${
          isCompact
            ? "border border-emerald-950/10 bg-dex-screen/95 shadow-[0_18px_30px_rgba(18,48,46,0.12)] backdrop-blur-sm"
            : "min-h-full border border-transparent bg-transparent shadow-none"
        }`}
        animate={{ scale: isCompact ? 0.985 : 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <motion.div
          className="grid place-items-center rounded-lg border border-emerald-950/15 bg-white/30 p-3"
          animate={{ minHeight: isCompact ? 210 : 340 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          variants={itemVariants}
        >
          <PokemonSprite pokemon={pokemon} compact={isCompact} mode={spriteMode} />
        </motion.div>

        <motion.div
          className="flex min-h-0 flex-col justify-center rounded-lg bg-white/25 p-4 sm:p-6"
          variants={itemVariants}
        >
          <motion.p className="font-display text-xs leading-6 text-emerald-950/70" variants={itemVariants}>
            {formatPokemonNumber(pokemon.id)}
          </motion.p>
          <motion.h2
            className="mt-2 font-display leading-tight capitalize text-dex-ink"
            animate={{ fontSize: isCompact ? "2rem" : "3rem" }}
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
            <FactCard icon="ruler" label="Altura" value={`${(pokemon.height / 10).toFixed(1)} m`} compact={isCompact} />
            <FactCard icon="weight" label="Peso" value={`${(pokemon.weight / 10).toFixed(1)} kg`} compact={isCompact} />
            <FactCard icon="sparkles" label="Habilidade" value={primaryAbilities} compact={isCompact} />
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
    </motion.article>
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
      <h3 className="mb-4 font-pixel text-2xl font-black uppercase leading-6 text-dex-ink">{title}</h3>
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
