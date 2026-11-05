const PARAMS = {
  pokemon: "p",
  versus: "vs",
  view: "view",
  team: "team"
};

const VALID_VIEWS = ["browse", "team"];

function parseTeam(value) {
  return value ? value.split(",").filter(Boolean) : [];
}

export function parseUrlState(search) {
  const params = new URLSearchParams(search);
  const view = params.get(PARAMS.view);

  return {
    pokemon: params.get(PARAMS.pokemon) || "",
    versus: params.get(PARAMS.versus) || "",
    view: VALID_VIEWS.includes(view) ? view : "detail",
    team: parseTeam(params.get(PARAMS.team))
  };
}

export function readUrlState() {
  return parseUrlState(typeof window === "undefined" ? "" : window.location.search);
}

function applyChanges(url, changes) {
  for (const [key, value] of Object.entries(changes)) {
    if (value) url.searchParams.set(PARAMS[key], Array.isArray(value) ? value.join(",") : value);
    else url.searchParams.delete(PARAMS[key]);
  }

  return url;
}

// `history: "push"` cria uma entrada para o botão voltar; "replace" só corrige o endereço atual.
export function updateUrl(changes, { history = "replace" } = {}) {
  if (typeof window === "undefined") return;

  const url = applyChanges(new URL(window.location.href), changes);

  // Repetir o mesmo endereço só faria o botão voltar parecer travado.
  if (url.href === window.location.href) return;

  try {
    if (history === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  } catch {
    // O Safari limita as trocas de histórico por segundo; perder uma não atrapalha o uso.
  }
}

export function buildShareUrl(changes) {
  return applyChanges(new URL(window.location.href), changes).toString();
}
