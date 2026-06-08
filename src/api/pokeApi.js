const BASE_URL = "https://pokeapi.co/api/v2";

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
  return data.results.map(item => item.name);
}
