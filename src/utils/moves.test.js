import { describe, expect, it } from "vitest";
import { getLevelUpMoves } from "./moves.js";

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
});
