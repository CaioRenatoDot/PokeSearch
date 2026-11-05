import { useEffect, useMemo, useRef, useState } from "react";
import { PokemonNotFoundError, getPokemon, getPokemonList } from "../api/pokeApi.js";
import { getSpeciesId } from "../utils/pokemonSpecies.js";
import { findClosestNames, normalizePokemonQuery, rankSuggestions } from "../utils/search.js";
import { playPokemonCry, playSearchSound } from "../utils/sounds.js";
import { toNameList } from "../utils/storage.js";
import { readUrlState, updateUrl } from "../utils/url.js";
import { useStoredState } from "./useStoredState.js";

// Ultimo numero da Pokedex nacional; formas alternativas usam ids acima de 10000.
const MAX_POKEDEX_ID = 1025;
const HISTORY_SIZE = 12;

export function usePokemonSearch(fallbackQuery = "") {
  const [query, setQuery] = useState(() => readUrlState().pokemon || fallbackQuery);
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  // Guarda o tipo de falha e o termo: a tela oferece sugestões ou "tentar de novo" conforme o caso.
  const [failure, setFailure] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [history, setHistory] = useStoredState("pokesearch:history", [], toNameList);
  // Cada busca recebe um numero; respostas de buscas antigas sao descartadas.
  const requestIdRef = useRef(0);

  const normalizedQuery = normalizePokemonQuery(query);
  const filteredSuggestions = useMemo(
    () => rankSuggestions(pokemonList, normalizedQuery),
    [pokemonList, normalizedQuery]
  );
  const didYouMean = useMemo(
    () => (failure?.kind === "not-found" ? findClosestNames(pokemonList, failure.query) : []),
    [pokemonList, failure]
  );

  async function searchPokemon(nextQuery, { history: historyMode = "push" } = {}) {
    const cleanQuery = normalizePokemonQuery(nextQuery);

    if (!cleanQuery) {
      setStatus("error");
      setMessage("Digite um nome ou número para pesquisar.");
      setFailure({ kind: "empty", query: "" });
      setPokemon(null);
      playSearchSound("error");
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setQuery(cleanQuery);
    setStatus("loading");
    setMessage("");
    setFailure(null);

    try {
      const data = await getPokemon(cleanQuery);

      if (requestId !== requestIdRef.current) return;

      setPokemon(data);
      setStatus("ready");
      // Quem chegou por número ou pelas setas vê o nome no campo; o que foi digitado depois é preservado.
      setQuery(current => (current === cleanQuery ? data.name : current));
      setHistory(current => [data.name, ...current.filter(name => name !== data.name)].slice(0, HISTORY_SIZE));

      if (historyMode === "push") {
        updateUrl({ pokemon: data.name, view: null, team: null }, { history: "push" });
      } else if (historyMode === "replace") {
        updateUrl({ pokemon: data.name });
      }

      playPokemonCry(data.cries?.latest || data.cries?.legacy);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      const isNotFound = error instanceof PokemonNotFoundError;

      setPokemon(null);
      setStatus("error");
      setMessage(
        isNotFound
          ? `Não encontrei "${cleanQuery}" na Pokedex.`
          : "Não consegui falar com a PokeAPI. Confira sua conexão e tente de novo."
      );
      setFailure({ kind: isNotFound ? "not-found" : "network", query: cleanQuery });
      playSearchSound("error");
    }
  }

  // Formas alternativas navegam a partir do número da espécie: da Mega Charizard para o Squirtle.
  const speciesId = getSpeciesId(pokemon);
  const previousId = speciesId && speciesId > 1 ? speciesId - 1 : null;
  const nextId = speciesId && speciesId < MAX_POKEDEX_ID ? speciesId + 1 : null;

  function goToPreviousPokemon() {
    if (previousId) searchPokemon(String(previousId));
  }

  function goToNextPokemon() {
    if (nextId) searchPokemon(String(nextId));
  }

  function searchRandomPokemon() {
    const candidates = pokemonList.filter(entry => entry.id <= MAX_POKEDEX_ID);

    if (candidates.length) {
      searchPokemon(candidates[Math.floor(Math.random() * candidates.length)].name);
      return;
    }

    searchPokemon(String(Math.floor(Math.random() * MAX_POKEDEX_ID) + 1));
  }

  function retrySearch() {
    if (failure?.query) searchPokemon(failure.query);
  }

  function clearHistory() {
    setHistory([]);
  }

  useEffect(() => {
    getPokemonList()
      .then(setPokemonList)
      .catch(() => setPokemonList([]));

    const startupQuery = readUrlState().pokemon || fallbackQuery;

    if (startupQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial: o pedido tem que sair na montagem
      searchPokemon(startupQuery, { history: "replace" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda só na montagem, com o valor inicial
  }, []);

  return {
    query,
    setQuery,
    pokemon,
    status,
    message,
    failure,
    didYouMean,
    filteredSuggestions,
    pokemonList,
    history,
    clearHistory,
    searchPokemon,
    searchRandomPokemon,
    retrySearch,
    goToPreviousPokemon,
    goToNextPokemon,
    hasPreviousPokemon: previousId !== null,
    hasNextPokemon: nextId !== null
  };
}
