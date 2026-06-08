export function normalizePokemonQuery(value) {
  const normalized = String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
