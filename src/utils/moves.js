export const moveMethods = [
  { id: "level-up", label: "Nível" },
  { id: "machine", label: "MT" },
  { id: "egg", label: "Ovo" },
  { id: "tutor", label: "Tutor" }
];

// A API repete cada golpe por versao do jogo; interessa o menor nivel em que ele e aprendido.
function lowestLevel(details) {
  const levels = details
    .filter(detail => detail.move_learn_method.name === "level-up" && detail.level_learned_at > 0)
    .map(detail => detail.level_learned_at);

  return levels.length ? Math.min(...levels) : null;
}

export function getMovesByMethod(pokemon) {
  const groups = Object.fromEntries(moveMethods.map(method => [method.id, []]));

  for (const entry of pokemon.moves) {
    const name = entry.move.name;
    const level = lowestLevel(entry.version_group_details);

    if (level !== null) groups["level-up"].push({ name, level });

    for (const method of ["machine", "egg", "tutor"]) {
      if (entry.version_group_details.some(detail => detail.move_learn_method.name === method)) {
        groups[method].push({ name });
      }
    }
  }

  groups["level-up"].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  for (const method of ["machine", "egg", "tutor"]) {
    groups[method].sort((a, b) => a.name.localeCompare(b.name));
  }

  return groups;
}

export function getLevelUpMoves(pokemon, limit = Infinity) {
  return getMovesByMethod(pokemon)["level-up"].slice(0, limit);
}

function findEnglish(entries) {
  return (entries || []).filter(entry => entry.language?.name === "en");
}

export function getMoveSummary(move) {
  const shortEffect = findEnglish(move.effect_entries)[0]?.short_effect;
  // Golpes mais novos só têm o texto dos jogos, sem a descrição técnica; o último é o mais recente.
  const flavorText = findEnglish(move.flavor_text_entries).at(-1)?.flavor_text;
  const effect = (shortEffect || flavorText || "")
    .replace(/\$effect_chance/g, move.effect_chance ?? "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    type: move.type?.name ?? null,
    damageClass: move.damage_class?.name ?? null,
    power: move.power ?? null,
    accuracy: move.accuracy ?? null,
    pp: move.pp ?? null,
    effect
  };
}
