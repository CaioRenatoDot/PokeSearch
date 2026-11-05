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

function editDistance(a, b) {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }

    previous = current;
  }

  return previous[b.length];
}

// Erros de digitação: a tolerância cresce com o tamanho do termo para "mew" não virar metade da Pokedex.
export function findClosestNames(list, query, limit = 3) {
  if (query.length < 3 || /^\d+$/.test(query)) return [];

  const tolerance = Math.max(1, Math.floor(query.length / 3));

  return list
    .filter(entry => Math.abs(entry.name.length - query.length) <= tolerance)
    .map(entry => ({ name: entry.name, id: entry.id, distance: editDistance(query, entry.name) }))
    .filter(item => item.distance <= tolerance)
    .sort((a, b) => a.distance - b.distance || a.id - b.id)
    .slice(0, limit)
    .map(item => item.name);
}
