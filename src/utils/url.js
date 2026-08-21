const QUERY_PARAM = "p";

export function readPokemonFromUrl() {
  if (typeof window === "undefined") return "";

  return new URLSearchParams(window.location.search).get(QUERY_PARAM) || "";
}

export function writePokemonToUrl(name) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set(QUERY_PARAM, name);
  window.history.replaceState(null, "", url);
}
