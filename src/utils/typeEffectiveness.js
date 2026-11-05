import { typeNames } from "../data/pokemon.js";

// Cada tipo do defensor multiplica o dano recebido; o resultado final e o produto dos dois.
export function buildDamageMultipliers(typeResources) {
  const multipliers = Object.fromEntries(typeNames.map(type => [type, 1]));

  for (const resource of typeResources) {
    const relations = resource?.damage_relations;
    if (!relations) continue;

    for (const { name } of relations.double_damage_from || []) {
      if (name in multipliers) multipliers[name] *= 2;
    }

    for (const { name } of relations.half_damage_from || []) {
      if (name in multipliers) multipliers[name] *= 0.5;
    }

    for (const { name } of relations.no_damage_from || []) {
      if (name in multipliers) multipliers[name] = 0;
    }
  }

  return multipliers;
}

export function groupMultipliers(multipliers) {
  const groups = new Map();

  for (const [type, multiplier] of Object.entries(multipliers)) {
    if (multiplier === 1) continue;

    if (!groups.has(multiplier)) groups.set(multiplier, []);
    groups.get(multiplier).push(type);
  }

  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([multiplier, types]) => ({ multiplier, types, label: formatMultiplier(multiplier) }));
}

// Tipos que levam dano dobrado de pelo menos um dos tipos do atacante.
export function getStrongAgainst(typeResources) {
  const strong = new Set();

  for (const resource of typeResources) {
    for (const { name } of resource?.damage_relations?.double_damage_to || []) {
      strong.add(name);
    }
  }

  return typeNames.filter(type => strong.has(type));
}

// O melhor golpe com bônus de tipo (STAB) que o atacante tem contra o defensor.
export function bestStabMultiplier(attackerTypes, defenderResources) {
  const multipliers = buildDamageMultipliers(defenderResources);
  return Math.max(...attackerTypes.map(type => multipliers[type] ?? 1));
}

export function formatMultiplier(multiplier) {
  if (multiplier === 0) return "Imune";
  if (multiplier === 0.25) return "¼×";
  if (multiplier === 0.5) return "½×";
  return `${multiplier}×`;
}
