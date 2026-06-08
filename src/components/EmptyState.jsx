import { motion } from "motion/react";
import PokeballMark from "./PokeballMark.jsx";

export default function EmptyState({ status, message }) {
  const isLoading = status === "loading";
  const title = isLoading ? "Consultando Pokedex" : status === "error" ? "Nada encontrado" : "Pesquise um Pokémon";
  const copy = isLoading
    ? "Buscando arte oficial, tipos e atributos na PokeAPI."
    : message || "A tela inteira está pronta para exibir dados, animações e detalhes do Pokémon escolhido.";

  return (
    <motion.div
      className="m-auto max-w-lg text-center"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <PokeballMark spin={isLoading} className="mx-auto" />
      <h2 className="mt-6 font-display text-2xl leading-9 text-dex-ink sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-xl font-medium leading-7 text-emerald-950/75">{copy}</p>
    </motion.div>
  );
}
