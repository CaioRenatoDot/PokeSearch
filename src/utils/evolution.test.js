import { describe, expect, it } from "vitest";
import { buildEvolutionStages, formatEvolutionCondition } from "./evolution.js";

function node(id, name, evolvesTo = []) {
  return {
    species: { name, url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
    evolves_to: evolvesTo
  };
}

function levelUp(fields) {
  return { trigger: { name: "level-up" }, ...fields };
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
    expect(buildEvolutionStages(node(25, "pikachu"))[0][0]).toEqual({ id: 25, name: "pikachu", condition: null });
  });

  it("devolve lista vazia sem cadeia", () => {
    expect(buildEvolutionStages(null)).toEqual([]);
  });

  it("descreve a condição de cada evolução", () => {
    const ivysaur = { ...node(2, "ivysaur"), evolution_details: [levelUp({ min_level: 16 })] };

    expect(buildEvolutionStages(node(1, "bulbasaur", [ivysaur]))[1][0].condition).toBe("Nv 16");
  });
});

describe("formatEvolutionCondition", () => {
  it("prefere a condição marcada como padrão entre as versões do jogo", () => {
    const leafeon = [
      levelUp({ location: { name: "eterna-forest" }, is_default: false }),
      { trigger: { name: "use-item" }, item: { name: "leaf-stone" }, is_default: true }
    ];

    expect(formatEvolutionCondition(leafeon)).toBe("Leaf Stone");
  });

  it("junta amizade e horário", () => {
    expect(formatEvolutionCondition([levelUp({ min_happiness: 160, time_of_day: "night" })])).toBe(
      "Amizade · à noite"
    );
  });

  it("traduz o tipo do golpe exigido", () => {
    expect(formatEvolutionCondition([levelUp({ known_move_type: { name: "fairy" } })])).toBe("Golpe Fada");
  });

  it("descreve troca segurando item", () => {
    expect(
      formatEvolutionCondition([{ trigger: { name: "trade" }, held_item: { name: "metal-coat" } }])
    ).toBe("Troca · Segurando Metal Coat");
  });

  it("não inventa condição para o primeiro estágio nem para gatilhos raros", () => {
    expect(formatEvolutionCondition([])).toBeNull();
    expect(formatEvolutionCondition(undefined)).toBeNull();
    expect(formatEvolutionCondition([{ trigger: { name: "spin" } }])).toBe("Especial");
    expect(formatEvolutionCondition([levelUp({})])).toBe("Subir de nível");
  });
});
