export function normalizePokemonQuery(value) {
  const normalized = String(value)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['.]/g, "")
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const aliases = {
    "nidoran-female": "nidoran-f",
    "nidoran-femea": "nidoran-f",
    "nidoran-f": "nidoran-f",
    "nidoran-male": "nidoran-m",
    "nidoran-macho": "nidoran-m",
    "nidoran-m": "nidoran-m"
  };

  return aliases[normalized] || normalized;
}

export function formatSearchLabel(value) {
  return String(value)
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Quanto menor a nota, melhor a sugestão: quem começa com o termo vem antes de quem só o contém.
function matchScore(entry, query) {
  if (String(entry.id) === query) return 0;
  if (entry.name.startsWith(query)) return 1;
  if (entry.name.includes(`-${query}`)) return 2;
  if (entry.name.includes(query)) return 3;
  return null;
}

export function rankSuggestions(list, query, limit = 6) {
  if (!query) return [];

  return list
    .map(entry => ({ entry, score: entry.name === query ? null : matchScore(entry, query) }))
    .filter(item => item.score !== null)
    .sort((a, b) => a.score - b.score || a.entry.id - b.entry.id)
    .slice(0, limit)
    .map(item => item.entry.name);
}
