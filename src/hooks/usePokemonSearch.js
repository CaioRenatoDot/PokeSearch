import { useEffect, useMemo, useRef, useState } from "react";
import { PokemonNotFoundError, getPokemon, getPokemonList } from "../api/pokeApi.js";
import { findClosestNames, normalizePokemonQuery, rankSuggestions } from "../utils/search.js";
import { playPokemonCry, playSearchSound } from "../utils/sounds.js";
import { readPokemonFromUrl, writePokemonToUrl } from "../utils/url.js";

// Ultimo numero da Pokedex nacional; formas alternativas usam ids acima de 10000.
const MAX_POKEDEX_ID = 1025;

export function usePokemonSearch(fallbackQuery = "") {
  const [query, setQuery] = useState(() => readPokemonFromUrl() || fallbackQuery);
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  // Guarda o tipo de falha e o termo: a tela oferece sugestões ou "tentar de novo" conforme o caso.
  const [failure, setFailure] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [history, setHistory] = useState([]);
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

  async function searchPokemon(nextQuery) {
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
      setHistory(current => [data.name, ...current.filter(name => name !== data.name)].slice(0, 12));
      writePokemonToUrl(data.name);
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

  const previousId = pokemon && pokemon.id > 1 && pokemon.id <= MAX_POKEDEX_ID ? pokemon.id - 1 : null;
  const nextId = pokemon && pokemon.id < MAX_POKEDEX_ID ? pokemon.id + 1 : null;

  function goToPreviousPokemon() {
    if (previousId) searchPokemon(String(previousId));
  }

  function goToNextPokemon() {
    if (nextId) searchPokemon(String(nextId));
  }

  function searchRandomPokemon() {
    if (pokemonList.length) {
      const randomEntry = pokemonList[Math.floor(Math.random() * pokemonList.length)];
      searchPokemon(randomEntry.name);
      return;
    }

    searchPokemon(String(Math.floor(Math.random() * MAX_POKEDEX_ID) + 1));
  }

  function retrySearch() {
    if (failure?.query) searchPokemon(failure.query);
  }

  useEffect(() => {
    getPokemonList()
      .then(setPokemonList)
      .catch(() => setPokemonList([]));

    const startupQuery = readPokemonFromUrl() || fallbackQuery;

    if (startupQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial: o pedido tem que sair na montagem
      searchPokemon(startupQuery);
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
    searchPokemon,
    searchRandomPokemon,
    retrySearch,
    goToPreviousPokemon,
    goToNextPokemon,
    hasPreviousPokemon: previousId !== null,
    hasNextPokemon: nextId !== null
  };
}
