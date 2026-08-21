import { describe, expect, it } from "vitest";
import { buildDamageMultipliers, formatMultiplier, groupMultipliers } from "./typeEffectiveness.js";

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

describe("formatMultiplier", () => {
  it("usa rótulos legíveis", () => {
    expect(formatMultiplier(0)).toBe("Imune");
    expect(formatMultiplier(0.25)).toBe("¼×");
    expect(formatMultiplier(0.5)).toBe("½×");
    expect(formatMultiplier(4)).toBe("4×");
  });
});
