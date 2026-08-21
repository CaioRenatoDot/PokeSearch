import { useEffect, useMemo, useState } from "react";
import { getPokemonNamesByType } from "../api/pokeApi.js";

const PAGE_SIZE = 60;

export function usePokemonBrowser(pokemonList) {
  const [activeType, setActiveType] = useState(null);
  // Os membros carregam o tipo a que pertencem, para o filtro nunca usar a lista de outro tipo.
  const [loadedMembers, setLoadedMembers] = useState({ type: null, names: null });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const typeMembers = loadedMembers.type === activeType ? loadedMembers.names : null;
  const isLoadingType = Boolean(activeType) && typeMembers === null;

  useEffect(() => {
    if (!activeType) return;

    let isCurrent = true;

    getPokemonNamesByType(activeType)
      .then(names => {
        if (isCurrent) setLoadedMembers({ type: activeType, names: new Set(names) });
      })
      .catch(() => {
        if (isCurrent) setLoadedMembers({ type: activeType, names: new Set() });
      });

    return () => {
      isCurrent = false;
    };
  }, [activeType]);

  const filteredList = useMemo(() => {
    if (!activeType || !typeMembers) return pokemonList;
    return pokemonList.filter(entry => typeMembers.has(entry.name));
  }, [activeType, pokemonList, typeMembers]);

  const visibleList = filteredList.slice(0, visibleCount);
  const hasMore = visibleCount < filteredList.length;

  function selectType(type) {
    setActiveType(current => (current === type ? null : type));
    setVisibleCount(PAGE_SIZE);
  }

  function showMore() {
    setVisibleCount(current => current + PAGE_SIZE);
  }

  return {
    activeType,
    selectType,
    isLoadingType,
    visibleList,
    totalCount: filteredList.length,
    hasMore,
    showMore
  };
}
