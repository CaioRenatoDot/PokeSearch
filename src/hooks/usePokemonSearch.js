import { useEffect, useState } from "react";
import { getPokemon, getPokemonList } from "../api/pokeApi.js";
import { normalizePokemonQuery } from "../utils/search.js";
import { playPokemonCry, playSearchSound } from "../utils/sounds.js";
import { readPokemonFromUrl, writePokemonToUrl } from "../utils/url.js";

// Ultimo numero da Pokedex nacional; formas alternativas usam ids acima de 10000.
const MAX_POKEDEX_ID = 1025;

export function usePokemonSearch(fallbackQuery = "") {
  const [query, setQuery] = useState(() => readPokemonFromUrl() || fallbackQuery);
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [history, setHistory] = useState([]);

  const normalizedQuery = normalizePokemonQuery(query);
  const filteredSuggestions = pokemonList
    .filter(({ name }) => normalizedQuery && name.includes(normalizedQuery) && name !== normalizedQuery)
    .slice(0, 6)
    .map(({ name }) => name);

  async function searchPokemon(nextQuery) {
    const cleanQuery = normalizePokemonQuery(nextQuery);

    if (!cleanQuery) {
      setStatus("error");
      setMessage("Digite um nome ou número para pesquisar.");
      setPokemon(null);
      playSearchSound("error");
      return;
    }

    setQuery(cleanQuery);
    setStatus("loading");
    setMessage("");

    try {
      const data = await getPokemon(cleanQuery);
      setPokemon(data);
      setStatus("ready");
      setHistory(current => [data.name, ...current.filter(name => name !== data.name)].slice(0, 12));
      writePokemonToUrl(data.name);
      playPokemonCry(data.cries?.latest || data.cries?.legacy);
    } catch (error) {
      setPokemon(null);
      setStatus("error");
      setMessage(error.message || "Não consegui consultar a PokeAPI agora.");
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

  useEffect(() => {
    getPokemonList()
      .then(setPokemonList)
      .catch(() => setPokemonList([]));

    const startupQuery = readPokemonFromUrl() || fallbackQuery;

    if (startupQuery) {
      searchPokemon(startupQuery);
    }
  }, []);

  return {
    query,
    setQuery,
    pokemon,
    status,
    message,
    filteredSuggestions,
    pokemonList,
    history,
    searchPokemon,
    searchRandomPokemon,
    goToPreviousPokemon,
    goToNextPokemon,
    hasPreviousPokemon: previousId !== null,
    hasNextPokemon: nextId !== null
  };
}
