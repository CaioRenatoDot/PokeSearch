import { describe, expect, it } from "vitest";
import {
  bestStabMultiplier,
  buildDamageMultipliers,
  formatMultiplier,
  getStrongAgainst,
  groupMultipliers
} from "./typeEffectiveness.js";

const fire = {
  damage_relations: {
    double_damage_from: [{ name: "water" }, { name: "ground" }, { name: "rock" }],
    half_damage_from: [{ name: "fire" }, { name: "grass" }, { name: "bug" }],
    no_damage_from: []
  }
};

const flying = {
  damage_relations: {
    double_damage_from: [{ name: "rock" }, { name: "electric" }, { name: "ice" }],
    half_damage_from: [{ name: "fighting" }, { name: "bug" }, { name: "grass" }],
    no_damage_from: [{ name: "ground" }]
  }
};

describe("buildDamageMultipliers", () => {
  it("multiplica as relações dos dois tipos", () => {
    const multipliers = buildDamageMultipliers([fire, flying]);

    expect(multipliers.rock).toBe(4);
    expect(multipliers.water).toBe(2);
    expect(multipliers.grass).toBe(0.25);
    expect(multipliers.bug).toBe(0.25);
  });

  it("faz a imunidade vencer a fraqueza", () => {
    expect(buildDamageMultipliers([fire, flying]).ground).toBe(0);
  });

  it("deixa em 1 os tipos sem relação", () => {
    expect(buildDamageMultipliers([fire, flying]).normal).toBe(1);
  });
});

describe("groupMultipliers", () => {
  it("agrupa do mais perigoso ao imune e ignora o neutro", () => {
    const groups = groupMultipliers(buildDamageMultipliers([fire, flying]));

    expect(groups.map(group => group.multiplier)).toEqual([4, 2, 0.5, 0.25, 0]);
    expect(groups[0].types).toEqual(["rock"]);
    expect(groups.some(group => group.multiplier === 1)).toBe(false);
  });
});

describe("getStrongAgainst", () => {
  it("junta os tipos dobrados dos dois tipos do atacante, sem repetir", () => {
    const attacker = [
      { damage_relations: { double_damage_to: [{ name: "grass" }, { name: "bug" }] } },
      { damage_relations: { double_damage_to: [{ name: "grass" }, { name: "fighting" }] } }
    ];

    expect(getStrongAgainst(attacker).sort()).toEqual(["bug", "fighting", "grass"]);
  });

  it("tolera recurso sem relações", () => {
    expect(getStrongAgainst([null, {}])).toEqual([]);
  });
});

describe("bestStabMultiplier", () => {
  it("escolhe o melhor tipo do atacante contra o defensor", () => {
    expect(bestStabMultiplier(["normal", "rock"], [fire, flying])).toBe(4);
  });

  it("reconhece a imunidade quando é o único golpe", () => {
    expect(bestStabMultiplier(["ground"], [flying])).toBe(0);
  });
});

describe("formatMultiplier", () => {
  it("usa rótulos legíveis", () => {
    expect(formatMultiplier(0)).toBe("Imune");
    expect(formatMultiplier(0.25)).toBe("¼×");
    expect(formatMultiplier(0.5)).toBe("½×");
    expect(formatMultiplier(4)).toBe("4×");
  });
});
