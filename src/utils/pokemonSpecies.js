// A PokeAPI não publica textos em português; o inglês é a única língua com cobertura completa.
const PREFERRED_LANGUAGES = ["en"];

function cleanFlavorText(text) {
  return text
    .replace(/[\n\f\r]/g, " ")
    .replace(/\u00ad/g, "")
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
