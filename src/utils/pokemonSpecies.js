import { formatName } from "./formatters.js";

// A PokeAPI não publica textos em português; o inglês é a única língua com cobertura completa.
const PREFERRED_LANGUAGES = ["en"];

const ROMAN_GENERATION = /^generation-([ivx]+)$/;

function cleanFlavorText(text) {
  return text
    .replace(/[\n\f\r]/g, " ")
    .replace(/­/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pickByLanguage(entries, languages = PREFERRED_LANGUAGES) {
  for (const language of languages) {
    const match = entries.find(entry => entry.language?.name === language);
    if (match) return match;
  }

  return entries[0] || null;
}

function extractIdFromUrl(url) {
  const match = /\/(\d+)\/?$/.exec(url || "");
  return match ? Number(match[1]) : null;
}

export function getFlavorText(species) {
  const entry = pickByLanguage(species?.flavor_text_entries || []);
  return entry ? cleanFlavorText(entry.flavor_text) : "";
}

export function getGenus(species) {
  const entry = pickByLanguage(species?.genera || []);
  return entry?.genus || "";
}

export function getHabitat(species) {
  return species?.habitat?.name || "";
}

// Formas alternativas têm id próprio acima de 10000, mas pertencem à espécie do número da Pokedex.
export function getSpeciesId(pokemon) {
  return extractIdFromUrl(pokemon?.species?.url) ?? pokemon?.id ?? null;
}

export function getVarieties(species) {
  return (species?.varieties || [])
    .map(variety => ({
      name: variety.pokemon.name,
      id: extractIdFromUrl(variety.pokemon.url),
      isDefault: variety.is_default
    }))
    .filter(variety => variety.id !== null);
}

export function getGenderRatio(species) {
  const rate = species?.gender_rate;

  if (rate === undefined || rate === null) return "";
  if (rate < 0) return "Sem gênero";

  const female = (rate / 8) * 100;
  const format = value => String(value).replace(".", ",");

  return `M ${format(100 - female)}% / F ${format(female)}%`;
}

export function getEggGroups(species) {
  return (species?.egg_groups || []).map(group => formatName(group.name)).join(", ");
}

export function getGenerationLabel(species) {
  const match = ROMAN_GENERATION.exec(species?.generation?.name || "");
  return match ? `Geração ${match[1].toUpperCase()}` : "";
}

export function getRarityLabel(species) {
  if (species?.is_mythical) return "Mítico";
  if (species?.is_legendary) return "Lendário";
  if (species?.is_baby) return "Bebê";
  return "";
}
