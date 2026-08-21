import { describe, expect, it } from "vitest";
import { buildEvolutionStages } from "./evolution.js";

function node(id, name, evolvesTo = []) {
  return {
    species: { name, url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
    evolves_to: evolvesTo
  };
}

describe("buildEvolutionStages", () => {
  it("achata uma linha simples em um estágio por evolução", () => {
    const chain = node(1, "bulbasaur", [node(2, "ivysaur", [node(3, "venusaur")])]);

    expect(buildEvolutionStages(chain).map(stage => stage.map(item => item.name))).toEqual([
      ["bulbasaur"],
      ["ivysaur"],
      ["venusaur"]
    ]);
  });

  it("mantém as ramificações no mesmo estágio", () => {
    const chain = node(133, "eevee", [node(134, "vaporeon"), node(135, "jolteon")]);

    expect(buildEvolutionStages(chain).map(stage => stage.map(item => item.name))).toEqual([
      ["eevee"],
      ["vaporeon", "jolteon"]
    ]);
  });

  it("extrai o id de cada espécie", () => {
    expect(buildEvolutionStages(node(25, "pikachu"))[0][0]).toEqual({ id: 25, name: "pikachu" });
  });

  it("devolve lista vazia sem cadeia", () => {
    expect(buildEvolutionStages(null)).toEqual([]);
  });
});
