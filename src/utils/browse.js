import { MAX_POKEDEX_ID, generations } from "../data/pokemon.js";
import { normalizePokemonQuery } from "./search.js";

export const sortOptions = [
  { id: "number", label: "Número" },
  { id: "number-desc", label: "Número (maior)" },
  { id: "name", label: "Nome A-Z" }
];

const SORTERS = {
  number: (a, b) => a.id - b.id,
  "number-desc": (a, b) => b.id - a.id,
  name: (a, b) => a.name.localeCompare(b.name)
};

function matchesText(entry, text) {
  return entry.name.includes(text) || String(entry.id).startsWith(text);
}

export function filterPokemonList(
  list,
  { text = "", generation = null, typeMembers = null, favorites = null, includeForms = false, sort = "number" } = {}
) {
  const cleanText = normalizePokemonQuery(text);
  const range = generations.find(item => item.id === generation);

  const filtered = list.filter(entry => {
    if (!includeForms && entry.id > MAX_POKEDEX_ID) return false;
    if (range && (entry.id < range.first || entry.id > range.last)) return false;
    if (typeMembers && !typeMembers.has(entry.name)) return false;
    if (favorites && !favorites.has(entry.name)) return false;
    if (cleanText && !matchesText(entry, cleanText)) return false;
    return true;
  });

  return filtered.sort(SORTERS[sort] || SORTERS.number);
}

export function intersectSets(sets) {
  if (!sets.length) return null;

  return sets.reduce((result, set) => new Set([...result].filter(item => set.has(item))));
}
