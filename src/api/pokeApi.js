const BASE_URL = "https://pokeapi.co/api/v2";

function extractIdFromUrl(url) {
  const match = /\/(\d+)\/?$/.exec(url);
  return match ? Number(match[1]) : null;
}

export async function getPokemon(query) {
  const response = await fetch(`${BASE_URL}/pokemon/${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("Pokémon não encontrado.");
  }

  return response.json();
}

export async function getPokemonList() {
  const response = await fetch(`${BASE_URL}/pokemon?limit=2000`);

  if (!response.ok) {
    throw new Error("Não consegui carregar a lista de Pokémon.");
  }

  const data = await response.json();

  return data.results
    .map(item => ({ id: extractIdFromUrl(item.url), name: item.name }))
    .filter(item => item.id !== null);
}

export async function getPokemonNamesByType(type) {
  const response = await fetch(`${BASE_URL}/type/${encodeURIComponent(type)}`);

  if (!response.ok) {
    throw new Error("Não consegui carregar esse tipo.");
  }

  const data = await response.json();
  return data.pokemon.map(item => item.pokemon.name);
}
