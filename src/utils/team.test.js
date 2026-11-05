import { describe, expect, it } from "vitest";
import { typeNames } from "../data/pokemon.js";
import {
  MAX_TEAM_SIZE,
  analyzeTeamDefense,
  averageStats,
  findSolidDefenses,
  findThreats,
  findUncoveredTypes,
  sanitizeTeam,
  suggestComplementTypes
} from "./team.js";

function relations(from = {}, to = []) {
  return {
    damage_relations: {
      double_damage_from: (from.double || []).map(name => ({ name })),
      half_damage_from: (from.half || []).map(name => ({ name })),
      no_damage_from: (from.none || []).map(name => ({ name })),
      double_damage_to: to.map(name => ({ name }))
    }
  };
}

// Só o que importa para os testes; os demais tipos ficam neutros.
const typeIndex = {
  ...Object.fromEntries(typeNames.map(type => [type, relations()])),
  fire: relations({ double: ["water", "rock"], half: ["grass", "fire"] }, ["grass", "ice"]),
  flying: relations({ double: ["rock", "electric"], half: ["grass"], none: ["ground"] }, ["grass", "bug"]),
  water: relations({ double: ["grass", "electric"], half: ["fire", "water"] }, ["fire", "rock"]),
  grass: relations({ double: ["fire", "flying"], half: ["water", "electric"] }, ["water", "rock"]),
  rock: relations({ double: ["water", "grass"], half: ["fire", "flying"] }, ["fire", "flying"]),
  ground: relations({ double: ["water"], half: ["rock"], none: ["electric"] }, ["electric", "fire"])
};

describe("sanitizeTeam", () => {
  it("normaliza, remove repetidos e descarta o que não é nome", () => {
    expect(sanitizeTeam(["Pikachu", "pikachu ", 7, null, "", "Mr. Mime"])).toEqual(["pikachu", "mr-mime"]);
  });

  it("limita ao tamanho do time", () => {
    const names = Array.from({ length: 10 }, (_, index) => `p${index}`);

    expect(sanitizeTeam(names)).toHaveLength(MAX_TEAM_SIZE);
  });

  it("aceita lixo vindo do storage", () => {
    expect(sanitizeTeam("nada")).toEqual([]);
    expect(sanitizeTeam(null)).toEqual([]);
  });
});

describe("analyzeTeamDefense", () => {
  it("conta quem sofre, resiste e é imune a cada ataque", () => {
    const defense = analyzeTeamDefense([["fire", "flying"], ["water"]], typeIndex);
    const row = type => defense.find(item => item.type === type);

    // Rocha é 4× no Charizard e neutro no Squirtle.
    expect(row("rock")).toEqual({ type: "rock", weak: 1, resist: 0, immune: 0 });
    expect(row("electric")).toEqual({ type: "electric", weak: 2, resist: 0, immune: 0 });
    expect(row("ground").immune).toBe(1);
    expect(row("normal")).toEqual({ type: "normal", weak: 0, resist: 0, immune: 0 });
  });

  it("deixa neutro o tipo cujas relações se anulam", () => {
    // Num Pokémon de fogo e água, o ataque de água vale 2× e ½×, o que dá 1×.
    const defense = analyzeTeamDefense([["fire", "water"]], typeIndex);

    expect(defense.find(item => item.type === "water")).toMatchObject({ weak: 0, resist: 0 });
  });
});

describe("findThreats e findSolidDefenses", () => {
  const defense = [
    { type: "electric", weak: 3, resist: 0, immune: 0 },
    { type: "rock", weak: 2, resist: 1, immune: 0 },
    { type: "ice", weak: 2, resist: 2, immune: 0 },
    { type: "water", weak: 1, resist: 0, immune: 0 },
    { type: "grass", weak: 0, resist: 2, immune: 1 },
    { type: "fire", weak: 1, resist: 3, immune: 0 }
  ];

  it("só chama de ameaça o que pega vários e tem pouca resposta, do pior ao menos pior", () => {
    expect(findThreats(defense).map(item => item.type)).toEqual(["electric", "rock"]);
  });

  it("só considera defesa sólida o que não fere ninguém", () => {
    expect(findSolidDefenses(defense).map(item => item.type)).toEqual(["grass"]);
  });
});

describe("findUncoveredTypes", () => {
  it("lista os tipos que o bônus de tipo do time não acerta", () => {
    const uncovered = findUncoveredTypes([["fire"], ["water"]], typeIndex);

    expect(uncovered).not.toContain("grass");
    expect(uncovered).not.toContain("rock");
    expect(uncovered).toContain("dragon");
  });
});

describe("suggestComplementTypes", () => {
  it("prefere o tipo que segura as ameaças", () => {
    const threats = [{ type: "electric", weak: 3, resist: 0, immune: 0 }];

    expect(suggestComplementTypes(threats, [], typeIndex)).toContain("ground");
  });

  it("não sugere quem sofre com a ameaça", () => {
    const threats = [{ type: "electric", weak: 3, resist: 0, immune: 0 }];

    expect(suggestComplementTypes(threats, [], typeIndex)).not.toContain("water");
  });

  it("usa a cobertura ofensiva quando não há ameaças", () => {
    expect(suggestComplementTypes([], ["fire"], typeIndex)).toEqual(expect.arrayContaining(["water", "rock", "ground"]));
  });

  it("não sugere nada para um time sem problemas", () => {
    expect(suggestComplementTypes([], [], typeIndex)).toEqual([]);
  });
});

describe("averageStats", () => {
  it("faz a média arredondada de cada atributo", () => {
    const member = (hp, speed) => ({
      stats: [
        { stat: { name: "hp" }, base_stat: hp },
        { stat: { name: "speed" }, base_stat: speed }
      ]
    });

    expect(averageStats([member(100, 50), member(51, 50)])).toEqual([
      { stat: { name: "hp" }, base_stat: 76 },
      { stat: { name: "speed" }, base_stat: 50 }
    ]);
  });

  it("devolve vazio sem membros", () => {
    expect(averageStats([])).toEqual([]);
  });
});
