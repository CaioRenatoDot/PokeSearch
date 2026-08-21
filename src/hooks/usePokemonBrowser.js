import { useEffect, useMemo, useRef, useState } from "react";
import { getPokemonNamesByType } from "../api/pokeApi.js";

const PAGE_SIZE = 60;

export function usePokemonBrowser(pokemonList) {
  const [activeType, setActiveType] = useState(null);
  const [typeMembers, setTypeMembers] = useState(null);
  const [isLoadingType, setIsLoadingType] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const typeCache = useRef(new Map());

  useEffect(() => {
    if (!activeType) {
      setTypeMembers(null);
      setIsLoadingType(false);
      return;
    }

    const cached = typeCache.current.get(activeType);

    if (cached) {
      setTypeMembers(cached);
      return;
    }

    let isCurrent = true;
    setIsLoadingType(true);

    getPokemonNamesByType(activeType)
      .then(names => {
        const members = new Set(names);
        typeCache.current.set(activeType, members);
        if (isCurrent) setTypeMembers(members);
      })
      .catch(() => {
        if (isCurrent) setTypeMembers(new Set());
      })
      .finally(() => {
        if (isCurrent) setIsLoadingType(false);
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
