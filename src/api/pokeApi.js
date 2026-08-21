const BASE_URL = "https://pokeapi.co/api/v2";
const LIST_STORAGE_KEY = "pokesearch:list";

// Os dados da PokeAPI não mudam durante a sessão, então cada recurso é buscado uma vez só.
const pokemonCache = new Map();
const typeCache = new Map();
let pokemonListPromise;

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

export async function getPokemon(query) {
  const key = String(query).toLowerCase();
  const cached = pokemonCache.get(key);

  if (cached) return cached;

  const response = await fetch(`${BASE_URL}/pokemon/${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("Pokémon não encontrado.");
  }

  const data = await response.json();

  // O mesmo Pokémon chega por nome, por número e pelo termo digitado.
  pokemonCache.set(key, data);
  pokemonCache.set(data.name, data);
  pokemonCache.set(String(data.id), data);

  return data;
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

export function getPokemonNamesByType(type) {
  const cached = typeCache.get(type);

  if (cached) return cached;

  const request = fetch(`${BASE_URL}/type/${encodeURIComponent(type)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Não consegui carregar esse tipo.");
      }

      return response.json();
    })
    .then(data => data.pokemon.map(item => item.pokemon.name))
    .catch(error => {
      typeCache.delete(type);
      throw error;
    });

  typeCache.set(type, request);
  return request;
}
