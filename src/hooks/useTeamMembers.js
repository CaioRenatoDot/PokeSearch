import { useEffect, useState } from "react";
import { getPokemon } from "../api/pokeApi.js";

// Devolve um mapa nome -> Pokémon: `undefined` ainda carregando e `null` quando a busca falhou.
export function useTeamMembers(names) {
  const [loaded, setLoaded] = useState({});
  const key = names.join(",");

  useEffect(() => {
    if (!key) return;

    let isCurrent = true;
    const requested = key.split(",");

    Promise.allSettled(requested.map(name => getPokemon(name))).then(results => {
      if (!isCurrent) return;

      setLoaded(current => {
        const next = { ...current };

        results.forEach((result, index) => {
          next[requested[index]] = result.status === "fulfilled" ? result.value : null;
        });

        return next;
      });
    });

    return () => {
      isCurrent = false;
    };
  }, [key]);

  return loaded;
}
