import { useEffect, useState } from "react";
import { getType } from "../api/pokeApi.js";

// `index` só existe com todos os tipos carregados, então nenhuma tela calcula sobre dados pela metade.
export function useTypeResources(types) {
  const [loaded, setLoaded] = useState({ key: null, index: null, failed: false });
  const key = types.join(",");

  useEffect(() => {
    if (!key) return;

    let isCurrent = true;
    const names = key.split(",");

    Promise.all(names.map(getType))
      .then(resources => {
        if (!isCurrent) return;

        const index = Object.fromEntries(names.map((name, position) => [name, resources[position]]));
        setLoaded({ key, index, failed: false });
      })
      .catch(() => {
        if (isCurrent) setLoaded({ key, index: null, failed: true });
      });

    return () => {
      isCurrent = false;
    };
  }, [key]);

  if (!key) return { index: null, isLoading: false, failed: false };
  if (loaded.key !== key) return { index: null, isLoading: true, failed: false };

  return { index: loaded.index, isLoading: false, failed: loaded.failed };
}
