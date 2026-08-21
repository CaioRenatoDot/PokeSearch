import { useEffect, useState } from "react";
import { getEvolutionChain } from "../api/pokeApi.js";
import { buildEvolutionStages } from "../utils/evolution.js";

export function useEvolutionChain(species) {
  const [stages, setStages] = useState([]);
  const chainUrl = species?.evolution_chain?.url;

  useEffect(() => {
    if (!chainUrl) {
      setStages([]);
      return;
    }

    let isCurrent = true;

    getEvolutionChain(chainUrl)
      .then(data => {
        if (isCurrent) setStages(buildEvolutionStages(data.chain));
      })
      .catch(() => {
        if (isCurrent) setStages([]);
      });

    return () => {
      isCurrent = false;
    };
  }, [chainUrl]);

  return stages;
}
