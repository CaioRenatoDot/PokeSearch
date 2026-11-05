import { m } from "motion/react";
import { formatSearchLabel } from "../utils/search.js";
import ActionButton from "./ActionButton.jsx";
import PokeballMark from "./PokeballMark.jsx";

export default function EmptyState({ status, message, failure, didYouMean = [], onSelect, onRetry }) {
  const isLoading = status === "loading";
  const isNetworkError = failure?.kind === "network";
  const title = isLoading
    ? "Consultando Pokedex"
    : isNetworkError
      ? "Sem resposta"
      : status === "error"
        ? "Nada encontrado"
        : "Pesquise um Pokémon";
  const copy = isLoading
    ? "Buscando arte oficial, tipos e atributos na PokeAPI."
    : message || "A tela inteira está pronta para exibir dados, animações e detalhes do Pokémon escolhido.";

  return (
    <m.div
      className="m-auto max-w-lg text-center"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <PokeballMark spin={isLoading} className="relative mx-auto" />
      <h2 className="mt-6 font-display text-2xl leading-9 text-dex-ink sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-xl font-medium leading-7 text-emerald-950/75">{copy}</p>

      {isNetworkError ? (
        <div className="mt-5">
          <ActionButton onClick={onRetry}>Tentar de novo</ActionButton>
        </div>
      ) : null}

      {didYouMean.length ? (
        <div className="mt-5">
          <p className="font-pixel text-base font-black uppercase leading-5 text-emerald-950/60">Você quis dizer</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {didYouMean.map(name => (
              <ActionButton key={name} onClick={() => onSelect(name)}>
                {formatSearchLabel(name)}
              </ActionButton>
            ))}
          </div>
        </div>
      ) : null}
    </m.div>
  );
}
