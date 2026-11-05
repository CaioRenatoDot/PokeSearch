import { useEffect, useState } from "react";
import { getPokemonSpecies } from "../api/pokeApi.js";

// Devolve `undefined` enquanto carrega e `null` se falhou, para a tela não prometer um dado que não vem.
export function usePokemonSpecies(pokemon) {
  // O estado guarda a que URL ele pertence, para nunca devolver a espécie do pokémon anterior.
  const [loaded, setLoaded] = useState({ url: null, data: null });
  const speciesUrl = pokemon?.species?.url;

  useEffect(() => {
    if (!speciesUrl) return;

    let isCurrent = true;

    getPokemonSpecies(speciesUrl)
      .then(data => {
        if (isCurrent) setLoaded({ url: speciesUrl, data });
      })
      .catch(() => {
        if (isCurrent) setLoaded({ url: speciesUrl, data: null });
      });

    return () => {
      isCurrent = false;
    };
  }, [speciesUrl]);

  return loaded.url === speciesUrl ? loaded.data : undefined;
}
