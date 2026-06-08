import { useEffect, useState } from "react";
import { getPokemon, getPokemonList } from "../api/pokeApi.js";
import { normalizePokemonQuery } from "../utils/search.js";
import { playSearchSound } from "../utils/sounds.js";

export function usePokemonSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [history, setHistory] = useState([]);

  const normalizedQuery = normalizePokemonQuery(query);
  const filteredSuggestions = pokemonList
    .filter(name => normalizedQuery && name.includes(normalizedQuery) && name !== normalizedQuery)
    .slice(0, 6);

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
      playSearchSound("success");
    } catch (error) {
      setPokemon(null);
      setStatus("error");
      setMessage(error.message || "Não consegui consultar a PokeAPI agora.");
      playSearchSound("error");
    }
  }

  function searchRandomPokemon() {
    if (pokemonList.length) {
      const randomName = pokemonList[Math.floor(Math.random() * pokemonList.length)];
      searchPokemon(randomName);
      return;
    }

    searchPokemon(String(Math.floor(Math.random() * 1025) + 1));
  }

  useEffect(() => {
    getPokemonList()
      .then(setPokemonList)
      .catch(() => setPokemonList([]));

    if (initialQuery) {
      searchPokemon(initialQuery);
    }
  }, []);

  return {
    query,
    setQuery,
    pokemon,
    status,
    message,
    filteredSuggestions,
    history,
    searchPokemon,
    searchRandomPokemon
  };
}
