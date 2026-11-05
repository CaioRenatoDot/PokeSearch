import { useState } from "react";
import { MAX_TEAM_SIZE, sanitizeTeam } from "../utils/team.js";
import { readUrlState, updateUrl } from "../utils/url.js";
import { useStoredState } from "./useStoredState.js";

export function useTeam() {
  const [ownNames, setOwnNames] = useStoredState("pokesearch:team", [], sanitizeTeam);
  // Um link compartilhado só mostra o time de outra pessoa; o seu não muda até você aceitar.
  const [sharedNames, setSharedNames] = useState(() => sanitizeTeam(readUrlState().team));
  const isShared = sharedNames.length > 0;

  function add(name) {
    setOwnNames(current => sanitizeTeam([...current, name]));
  }

  function remove(name) {
    setOwnNames(current => current.filter(item => item !== name));
  }

  function toggle(name) {
    if (ownNames.includes(name)) remove(name);
    else add(name);
  }

  function clear() {
    setOwnNames([]);
  }

  function leaveShared() {
    setSharedNames([]);
    updateUrl({ team: null });
  }

  function keepShared() {
    setOwnNames(sharedNames);
    leaveShared();
  }

  function syncWithUrl() {
    setSharedNames(sanitizeTeam(readUrlState().team));
  }

  return {
    names: isShared ? sharedNames : ownNames,
    ownNames,
    isShared,
    isFull: ownNames.length >= MAX_TEAM_SIZE,
    isInTeam: name => ownNames.includes(name),
    add,
    remove,
    toggle,
    clear,
    keepShared,
    leaveShared,
    syncWithUrl
  };
}
