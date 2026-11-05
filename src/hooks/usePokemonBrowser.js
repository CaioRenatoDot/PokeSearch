import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPokemonNamesByType } from "../api/pokeApi.js";
import { filterPokemonList, intersectSets } from "../utils/browse.js";

const PAGE_SIZE = 60;
const MAX_ACTIVE_TYPES = 2;

const INITIAL_FILTERS = {
  text: "",
  generation: null,
  onlyFavorites: false,
  includeForms: false,
  sort: "number"
};

export function usePokemonBrowser(pokemonList, favoriteNames) {
  const [activeTypes, setActiveTypes] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  // Os membros carregam os tipos a que pertencem, para o filtro nunca usar a lista de outra seleção.
  const [loadedMembers, setLoadedMembers] = useState({ key: "", names: null, failed: false });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const savedScrollRef = useRef(null);

  const typeKey = activeTypes.join(",");
  const isTypeLoaded = loadedMembers.key === typeKey;
  const typeMembers = typeKey && isTypeLoaded ? loadedMembers.names : null;
  const isLoadingType = Boolean(typeKey) && !isTypeLoaded;

  useEffect(() => {
    if (!typeKey) return;

    let isCurrent = true;

    Promise.all(typeKey.split(",").map(getPokemonNamesByType))
      .then(lists => {
        if (isCurrent) {
          setLoadedMembers({ key: typeKey, names: intersectSets(lists.map(list => new Set(list))), failed: false });
        }
      })
      .catch(() => {
        if (isCurrent) setLoadedMembers({ key: typeKey, names: new Set(), failed: true });
      });

    return () => {
      isCurrent = false;
    };
  }, [typeKey]);

  const filteredList = useMemo(() => {
    return filterPokemonList(pokemonList, {
      text: filters.text,
      generation: filters.generation,
      typeMembers,
      favorites: filters.onlyFavorites ? new Set(favoriteNames) : null,
      includeForms: filters.includeForms,
      sort: filters.sort
    });
  }, [pokemonList, filters, typeMembers, favoriteNames]);

  const visibleList = filteredList.slice(0, visibleCount);
  const hasMore = visibleCount < filteredList.length;

  function resetPosition() {
    setVisibleCount(PAGE_SIZE);
    savedScrollRef.current = null;
  }

  function selectType(type) {
    setActiveTypes(current => {
      if (current.includes(type)) return current.filter(item => item !== type);
      return [...current, type].slice(-MAX_ACTIVE_TYPES);
    });
    resetPosition();
  }

  function changeFilter(name, value) {
    setFilters(current => ({ ...current, [name]: value }));
    resetPosition();
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);
    setActiveTypes([]);
    resetPosition();
  }

  const showMore = useCallback(() => {
    setVisibleCount(current => current + PAGE_SIZE);
  }, []);

  const saveScroll = useCallback(position => {
    savedScrollRef.current = position;
  }, []);

  const takeSavedScroll = useCallback(() => {
    const position = savedScrollRef.current;
    savedScrollRef.current = null;
    return position;
  }, []);

  return {
    activeTypes,
    selectType,
    isLoadingType,
    isTypeFailed: Boolean(typeKey) && isTypeLoaded && loadedMembers.failed,
    isLoadingList: pokemonList.length === 0,
    filters,
    changeFilter,
    clearFilters,
    hasActiveFilters:
      activeTypes.length > 0 || Object.keys(INITIAL_FILTERS).some(name => filters[name] !== INITIAL_FILTERS[name]),
    filterKey: `${typeKey}|${JSON.stringify(filters)}`,
    visibleList,
    totalCount: filteredList.length,
    hasMore,
    showMore,
    saveScroll,
    takeSavedScroll
  };
}
