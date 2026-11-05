const BASE_URL = "https://pokeapi.co/api/v2";
const LIST_STORAGE_KEY = "pokesearch:list";

// Os dados da PokeAPI não mudam durante a sessão, então cada recurso é buscado uma vez só.
const pokemonCache = new Map();
const resourceCache = new Map();
let pokemonListPromise;

// Separa "não existe" de "não consegui perguntar": a tela oferece ações diferentes para cada um.
export class PokemonNotFoundError extends Error {
  constructor() {
    super("Pokémon não encontrado.");
    this.name = "PokemonNotFoundError";
  }
}

function getResource(url) {
  if (!resourceCache.has(url)) {
    const request = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Não consegui carregar esse dado da PokeAPI.");
        }

        return response.json();
      })
      .catch(error => {
        // Sem isso uma falha de rede ficaria em cache para sempre.
        resourceCache.delete(url);
        throw error;
      });

    resourceCache.set(url, request);
  }

  return resourceCache.get(url);
}

function extractIdFromUrl(url) {
  const match = /\/(\d+)\/?$/.exec(url);
  return match ? Number(match[1]) : null;
}

function readCachedList() {
  try {
    const stored = window.sessionStorage.getItem(LIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function writeCachedList(list) {
  try {
    window.sessionStorage.setItem(LIST_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Sem storage a lista é buscada de novo no próximo carregamento.
  }
}

async function fetchJsonOrNull(url) {
  const response = await fetch(url);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Não consegui consultar a PokeAPI agora.");

  return response.json();
}

async function fetchPokemon(query) {
  const encoded = encodeURIComponent(query);
  const pokemon = await fetchJsonOrNull(`${BASE_URL}/pokemon/${encoded}`);

  if (pokemon) return pokemon;

  // Espécies com várias formas não têm Pokémon com o próprio nome: "deoxys" só existe como "deoxys-normal".
  const species = await fetchJsonOrNull(`${BASE_URL}/pokemon-species/${encoded}`);
  const defaultVariety = species?.varieties?.find(variety => variety.is_default) ?? species?.varieties?.[0];

  if (!defaultVariety) throw new PokemonNotFoundError();

  const variety = await fetchJsonOrNull(defaultVariety.pokemon.url);

  if (!variety) throw new PokemonNotFoundError();

  return variety;
}

export function getPokemon(query) {
  const key = String(query).toLowerCase();

  if (!pokemonCache.has(key)) {
    const request = fetchPokemon(key)
      .then(data => {
        // O mesmo Pokémon chega por nome, por número e pelo termo digitado.
        pokemonCache.set(data.name, request);
        pokemonCache.set(String(data.id), request);
        return data;
      })
      .catch(error => {
        pokemonCache.delete(key);
        throw error;
      });

    pokemonCache.set(key, request);
  }

  return pokemonCache.get(key);
}

async function fetchPokemonList() {
  const response = await fetch(`${BASE_URL}/pokemon?limit=2000`);

  if (!response.ok) {
    throw new Error("Não consegui carregar a lista de Pokémon.");
  }

  const data = await response.json();

  return data.results
    .map(item => ({ id: extractIdFromUrl(item.url), name: item.name }))
    .filter(item => item.id !== null);
}

export function getPokemonList() {
  if (!pokemonListPromise) {
    const cached = readCachedList();

    pokemonListPromise = cached
      ? Promise.resolve(cached)
      : fetchPokemonList()
          .then(list => {
            writeCachedList(list);
            return list;
          })
          .catch(error => {
            // Sem isso um erro de rede deixaria a promessa rejeitada em cache para sempre.
            pokemonListPromise = undefined;
            throw error;
          });
  }

  return pokemonListPromise;
}

export function getType(type) {
  return getResource(`${BASE_URL}/type/${encodeURIComponent(type)}`);
}

export async function getPokemonNamesByType(type) {
  const data = await getType(type);
  return data.pokemon.map(item => item.pokemon.name);
}

export function getPokemonSpecies(speciesUrl) {
  return getResource(speciesUrl);
}

export function getEvolutionChain(chainUrl) {
  return getResource(chainUrl);
}

export function getMove(moveName) {
  return getResource(`${BASE_URL}/move/${encodeURIComponent(moveName)}`);
}
