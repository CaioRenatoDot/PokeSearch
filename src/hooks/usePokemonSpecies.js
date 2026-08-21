import { useEffect, useState } from "react";
import { getPokemonSpecies } from "../api/pokeApi.js";

export function usePokemonSpecies(pokemon) {
  const [species, setSpecies] = useState(null);
  const speciesUrl = pokemon?.species?.url;

  useEffect(() => {
    if (!speciesUrl) {
      setSpecies(null);
      return;
    }

    let isCurrent = true;
    setSpecies(null);

    getPokemonSpecies(speciesUrl)
      .then(data => {
        if (isCurrent) setSpecies(data);
      })
      .catch(() => {
        if (isCurrent) setSpecies(null);
      });

    return () => {
      isCurrent = false;
    };
  }, [speciesUrl]);

  return species;
}
