import { typeLabels } from "../data/pokemon.js";

export function formatName(value) {
  return value
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatPokemonNumber(id) {
  return `#${String(id).padStart(4, "0")}`;
}

export function formatTypeName(type) {
  return typeLabels[type] || formatName(type);
}
