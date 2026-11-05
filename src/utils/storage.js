export function readStored(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch {
    // Navegação privada pode bloquear o storage e um valor corrompido não pode travar o app.
    return fallback;
  }
}

export function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sem storage o valor vale só para esta sessão.
  }
}

export function toNameList(value) {
  return Array.isArray(value) ? value.filter(item => typeof item === "string") : [];
}
