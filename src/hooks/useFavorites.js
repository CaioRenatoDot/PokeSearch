import { toNameList } from "../utils/storage.js";
import { useStoredState } from "./useStoredState.js";

export function useFavorites() {
  const [names, setNames] = useStoredState("pokesearch:favorites", [], toNameList);

  function toggle(name) {
    setNames(current => (current.includes(name) ? current.filter(item => item !== name) : [name, ...current]));
  }

  return { names, isFavorite: name => names.includes(name), toggle };
}
