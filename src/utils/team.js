import { typeNames } from "../data/pokemon.js";
import { normalizePokemonQuery } from "./search.js";
import { buildDamageMultipliers, getStrongAgainst } from "./typeEffectiveness.js";

export const MAX_TEAM_SIZE = 6;

// Vale para o que vem do storage e de links compartilhados, então não confia em nada recebido.
export function sanitizeTeam(names) {
  if (!Array.isArray(names)) return [];

  const clean = names
    .filter(name => typeof name === "string")
    .map(normalizePokemonQuery)
    .filter(Boolean);

  return [...new Set(clean)].slice(0, MAX_TEAM_SIZE);
}

export function getMemberTypes(pokemon) {
  return pokemon.types.map(item => item.type.name);
}

function resourcesFor(types, typeIndex) {
  return types.map(type => typeIndex[type]);
}

// Para cada tipo de ataque, quantos membros sofrem, resistem ou são imunes.
export function analyzeTeamDefense(memberTypes, typeIndex) {
  const memberMultipliers = memberTypes.map(types => buildDamageMultipliers(resourcesFor(types, typeIndex)));

  return typeNames.map(type => {
    const values = memberMultipliers.map(multipliers => multipliers[type]);

    return {
      type,
      weak: values.filter(value => value > 1).length,
      resist: values.filter(value => value > 0 && value < 1).length,
      immune: values.filter(value => value === 0).length
    };
  });
}

// Ameaça é o tipo que atinge vários membros e que quase ninguém segura.
export function findThreats(defense) {
  return defense
    .filter(row => row.weak >= 2 && row.weak > row.resist + row.immune)
    .sort((a, b) => b.weak - b.resist - b.immune - (a.weak - a.resist - a.immune) || b.weak - a.weak);
}

export function findSolidDefenses(defense) {
  return defense
    .filter(row => row.resist + row.immune >= 2 && row.weak === 0)
    .sort((a, b) => b.resist + b.immune - (a.resist + a.immune));
}

// Considera só o bônus de tipo (STAB): os golpes reais de cada Pokémon não estão no time.
export function findUncoveredTypes(memberTypes, typeIndex) {
  const covered = new Set(
    memberTypes.flatMap(types => getStrongAgainst(resourcesFor(types, typeIndex)))
  );

  return typeNames.filter(type => !covered.has(type));
}

// Sugere tipos para a próxima vaga: quem segura as ameaças atuais sem sofrer com elas.
export function suggestComplementTypes(threats, uncovered, typeIndex, limit = 3) {
  if (!threats.length && !uncovered.length) return [];

  return typeNames
    .map(type => {
      const multipliers = buildDamageMultipliers([typeIndex[type]]);
      const strong = getStrongAgainst([typeIndex[type]]);
      const defenseScore = threats.reduce((total, threat) => {
        const value = multipliers[threat.type];
        if (value < 1) return total + 1;
        if (value > 1) return total - 1;
        return total;
      }, 0);
      const coverageScore = uncovered.filter(target => strong.includes(target)).length;

      return { type, defenseScore, coverageScore };
    })
    .filter(item => item.defenseScore > 0 || (item.defenseScore === 0 && item.coverageScore > 0))
    .sort((a, b) => b.defenseScore - a.defenseScore || b.coverageScore - a.coverageScore)
    .slice(0, limit)
    .map(item => item.type);
}

export function averageStats(members) {
  if (!members.length) return [];

  return members[0].stats.map((stat, index) => {
    const total = members.reduce((sum, member) => sum + (member.stats[index]?.base_stat ?? 0), 0);

    return { stat: stat.stat, base_stat: Math.round(total / members.length) };
  });
}
