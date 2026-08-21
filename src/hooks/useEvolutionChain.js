import { useEffect, useState } from "react";
import { getEvolutionChain } from "../api/pokeApi.js";
import { buildEvolutionStages } from "../utils/evolution.js";

const EMPTY_STAGES = [];

export function useEvolutionChain(species) {
  const [loaded, setLoaded] = useState({ url: null, stages: EMPTY_STAGES });
  const chainUrl = species?.evolution_chain?.url;

  useEffect(() => {
    if (!chainUrl) return;

    let isCurrent = true;

    getEvolutionChain(chainUrl)
      .then(data => {
        if (isCurrent) setLoaded({ url: chainUrl, stages: buildEvolutionStages(data.chain) });
      })
      .catch(() => {
        if (isCurrent) setLoaded({ url: chainUrl, stages: EMPTY_STAGES });
      });

    return () => {
      isCurrent = false;
    };
  }, [chainUrl]);

  return loaded.url === chainUrl ? loaded.stages : EMPTY_STAGES;
}
