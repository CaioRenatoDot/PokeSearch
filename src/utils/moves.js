// A API repete cada golpe por versao do jogo; interessa o menor nivel em que ele e aprendido.
export function getLevelUpMoves(pokemon, limit = 12) {
  const byName = new Map();

  for (const entry of pokemon.moves) {
    const levels = entry.version_group_details
      .filter(detail => detail.move_learn_method.name === "level-up" && detail.level_learned_at > 0)
      .map(detail => detail.level_learned_at);

    if (!levels.length) continue;

    const level = Math.min(...levels);
    const current = byName.get(entry.move.name);

    if (!current || level < current) {
      byName.set(entry.move.name, level);
    }
  }

  return [...byName.entries()]
    .map(([name, level]) => ({ name, level }))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
    .slice(0, limit);
}
