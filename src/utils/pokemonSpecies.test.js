import { describe, expect, it } from "vitest";
import {
  getEggGroups,
  getFlavorText,
  getGenderRatio,
  getGenerationLabel,
  getGenus,
  getHabitat,
  getRarityLabel,
  getSpeciesId,
  getVarieties
} from "./pokemonSpecies.js";

// A PokeAPI corta palavras com hífen suave e quebra linhas com \f no meio do texto.
const SOFT_HYPHEN = "\u00ad";

const species = {
  flavor_text_entries: [
    { flavor_text: "Texto em japonês", language: { name: "ja" } },
    {
      flavor_text: `It keeps its tail\fraised to mo${SOFT_HYPHEN}nitor    the area.`,
      language: { name: "en" }
    }
  ],
  genera: [
    { genus: "Gênero japonês", language: { name: "ja" } },
    { genus: "Mouse Pokémon", language: { name: "en" } }
  ],
  habitat: { name: "forest" }
};

describe("getFlavorText", () => {
  it("prefere o inglês, junta a palavra cortada e limpa as quebras", () => {
    expect(getFlavorText(species)).toBe("It keeps its tail raised to monitor the area.");
  });

  it("cai na primeira entrada quando não há inglês", () => {
    const outro = { flavor_text_entries: [{ flavor_text: "Solo texto", language: { name: "es" } }] };
    expect(getFlavorText(outro)).toBe("Solo texto");
  });

  it("devolve vazio sem espécie", () => {
    expect(getFlavorText(null)).toBe("");
    expect(getGenus(null)).toBe("");
    expect(getHabitat(null)).toBe("");
  });
});

describe("getGenus e getHabitat", () => {
  it("leem os campos da espécie", () => {
    expect(getGenus(species)).toBe("Mouse Pokémon");
    expect(getHabitat(species)).toBe("forest");
  });
});

describe("getSpeciesId", () => {
  it("usa o número da espécie, inclusive para formas alternativas", () => {
    const megaCharizard = { id: 10034, species: { url: "https://pokeapi.co/api/v2/pokemon-species/6/" } };

    expect(getSpeciesId(megaCharizard)).toBe(6);
  });

  it("cai no id do Pokémon sem espécie", () => {
    expect(getSpeciesId({ id: 25 })).toBe(25);
    expect(getSpeciesId(null)).toBeNull();
  });
});

describe("getVarieties", () => {
  it("lista as formas com o id de cada uma", () => {
    const varieties = getVarieties({
      varieties: [
        { is_default: true, pokemon: { name: "deoxys-normal", url: "https://pokeapi.co/api/v2/pokemon/386/" } },
        { is_default: false, pokemon: { name: "deoxys-attack", url: "https://pokeapi.co/api/v2/pokemon/10001/" } }
      ]
    });

    expect(varieties).toEqual([
      { name: "deoxys-normal", id: 386, isDefault: true },
      { name: "deoxys-attack", id: 10001, isDefault: false }
    ]);
  });

  it("devolve lista vazia sem espécie", () => {
    expect(getVarieties(null)).toEqual([]);
  });
});

describe("getGenderRatio", () => {
  it("converte oitavos em porcentagem", () => {
    expect(getGenderRatio({ gender_rate: 1 })).toBe("M 87,5% / F 12,5%");
    expect(getGenderRatio({ gender_rate: 8 })).toBe("M 0% / F 100%");
  });

  it("reconhece Pokémon sem gênero", () => {
    expect(getGenderRatio({ gender_rate: -1 })).toBe("Sem gênero");
    expect(getGenderRatio(null)).toBe("");
  });
});

describe("dados de espécie", () => {
  it("formata grupos de ovo e geração", () => {
    const data = { egg_groups: [{ name: "ground" }, { name: "water1" }], generation: { name: "generation-iv" } };

    expect(getEggGroups(data)).toBe("Ground, Water1");
    expect(getGenerationLabel(data)).toBe("Geração IV");
    expect(getGenerationLabel(null)).toBe("");
  });

  it("dá prioridade a mítico sobre lendário", () => {
    expect(getRarityLabel({ is_mythical: true, is_legendary: true })).toBe("Mítico");
    expect(getRarityLabel({ is_legendary: true })).toBe("Lendário");
    expect(getRarityLabel({ is_baby: true })).toBe("Bebê");
    expect(getRarityLabel({})).toBe("");
  });
});
