import { describe, expect, it } from "vitest";
import { filterPokemonList, intersectSets } from "./browse.js";

const list = [
  { id: 25, name: "pikachu" },
  { id: 6, name: "charizard" },
  { id: 152, name: "chikorita" },
  { id: 906, name: "sprigatito" },
  { id: 10034, name: "charizard-mega-x" }
];

const names = result => result.map(entry => entry.name);

describe("filterPokemonList", () => {
  it("esconde as formas por padrão e ordena por número", () => {
    expect(names(filterPokemonList(list))).toEqual(["charizard", "pikachu", "chikorita", "sprigatito"]);
  });

  it("inclui as formas quando pedido", () => {
    expect(names(filterPokemonList(list, { includeForms: true }))).toContain("charizard-mega-x");
  });

  it("filtra pela faixa da geração", () => {
    expect(names(filterPokemonList(list, { generation: 2 }))).toEqual(["chikorita"]);
    expect(names(filterPokemonList(list, { generation: 9 }))).toEqual(["sprigatito"]);
  });

  it("não mostra formas ao escolher uma geração", () => {
    expect(names(filterPokemonList(list, { generation: 1, includeForms: true }))).toEqual(["charizard", "pikachu"]);
  });

  it("filtra por nome e por número digitados", () => {
    expect(names(filterPokemonList(list, { text: "CHAR" }))).toEqual(["charizard"]);
    expect(names(filterPokemonList(list, { text: "90" }))).toEqual(["sprigatito"]);
  });

  it("combina tipo e favoritos", () => {
    const result = filterPokemonList(list, {
      typeMembers: new Set(["charizard", "pikachu"]),
      favorites: new Set(["pikachu", "chikorita"])
    });

    expect(names(result)).toEqual(["pikachu"]);
  });

  it("ordena como pedido, sem alterar a lista original", () => {
    expect(names(filterPokemonList(list, { sort: "name" }))[0]).toBe("charizard");
    expect(names(filterPokemonList(list, { sort: "number-desc" }))[0]).toBe("sprigatito");
    expect(list[0].name).toBe("pikachu");
  });
});

describe("intersectSets", () => {
  it("mantém só o que está em todos os conjuntos", () => {
    expect([...intersectSets([new Set(["a", "b"]), new Set(["b", "c"])])]).toEqual(["b"]);
  });

  it("devolve nulo sem conjuntos", () => {
    expect(intersectSets([])).toBeNull();
  });
});
