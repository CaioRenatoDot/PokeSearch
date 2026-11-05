import { describe, expect, it } from "vitest";
import { getFlavorText, getGenus, getHabitat, getSpeciesId } from "./pokemonSpecies.js";

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
