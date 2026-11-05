import { describe, expect, it } from "vitest";
import { getLevelUpMoves, getMoveSummary, getMovesByMethod } from "./moves.js";

function move(name, details) {
  return { move: { name }, version_group_details: details };
}

function levelUp(level) {
  return { move_learn_method: { name: "level-up" }, level_learned_at: level };
}

describe("getLevelUpMoves", () => {
  it("ignora golpes que não são aprendidos por nível", () => {
    const pokemon = {
      moves: [
        move("thunderbolt", [{ move_learn_method: { name: "machine" }, level_learned_at: 0 }]),
        move("tackle", [{ move_learn_method: { name: "egg" }, level_learned_at: 0 }]),
        move("quick-attack", [levelUp(10)])
      ]
    };

    expect(getLevelUpMoves(pokemon).map(item => item.name)).toEqual(["quick-attack"]);
  });

  it("usa o menor nível entre as versões do jogo", () => {
    const pokemon = { moves: [move("thunder-shock", [levelUp(5), levelUp(1), levelUp(8)])] };

    expect(getLevelUpMoves(pokemon)).toEqual([{ name: "thunder-shock", level: 1 }]);
  });

  it("ordena por nível e respeita o limite", () => {
    const pokemon = {
      moves: [move("c", [levelUp(30)]), move("a", [levelUp(1)]), move("b", [levelUp(15)])]
    };

    expect(getLevelUpMoves(pokemon, 2).map(item => item.name)).toEqual(["a", "b"]);
  });

  it("não corta a lista quando não há limite", () => {
    const moves = Array.from({ length: 30 }, (_, index) => move(`golpe-${index}`, [levelUp(index + 1)]));

    expect(getLevelUpMoves({ moves })).toHaveLength(30);
  });
});

describe("getMovesByMethod", () => {
  it("separa os golpes por forma de aprender, sem repetir", () => {
    const groups = getMovesByMethod({
      moves: [
        move("surf", [
          { move_learn_method: { name: "machine" }, level_learned_at: 0 },
          { move_learn_method: { name: "machine" }, level_learned_at: 0 }
        ]),
        move("bite", [levelUp(4), { move_learn_method: { name: "egg" }, level_learned_at: 0 }]),
        move("slam", [{ move_learn_method: { name: "tutor" }, level_learned_at: 0 }])
      ]
    });

    expect(groups["level-up"]).toEqual([{ name: "bite", level: 4 }]);
    expect(groups.machine).toEqual([{ name: "surf" }]);
    expect(groups.egg).toEqual([{ name: "bite" }]);
    expect(groups.tutor).toEqual([{ name: "slam" }]);
  });
});

describe("getMoveSummary", () => {
  it("preenche a chance do efeito e lê os números", () => {
    const summary = getMoveSummary({
      type: { name: "electric" },
      damage_class: { name: "special" },
      power: 90,
      accuracy: 100,
      pp: 15,
      effect_chance: 10,
      effect_entries: [
        { short_effect: "Efecto", language: { name: "es" } },
        { short_effect: "Has a $effect_chance% chance to paralyze.", language: { name: "en" } }
      ]
    });

    expect(summary).toEqual({
      type: "electric",
      damageClass: "special",
      power: 90,
      accuracy: 100,
      pp: 15,
      effect: "Has a 10% chance to paralyze."
    });
  });

  it("usa o texto mais recente dos jogos quando falta a descrição técnica", () => {
    const summary = getMoveSummary({
      effect_entries: [],
      flavor_text_entries: [
        { flavor_text: "Antigo", language: { name: "en" } },
        { flavor_text: "Mais\nrecente", language: { name: "en" } }
      ]
    });

    expect(summary.effect).toBe("Mais recente");
  });

  it("mantém nulos os golpes sem poder ou precisão", () => {
    const summary = getMoveSummary({ power: null, accuracy: null, pp: 20 });

    expect(summary.power).toBeNull();
    expect(summary.accuracy).toBeNull();
    expect(summary.effect).toBe("");
  });
});
