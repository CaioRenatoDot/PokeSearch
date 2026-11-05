import { describe, expect, it } from "vitest";
import { formatSearchLabel, normalizePokemonQuery, rankSuggestions } from "./search.js";

describe("normalizePokemonQuery", () => {
  it("normaliza caixa, espaços e acentos", () => {
    expect(normalizePokemonQuery("  Pikachu ")).toBe("pikachu");
    expect(normalizePokemonQuery("Flabébé")).toBe("flabebe");
    expect(normalizePokemonQuery("Mr. Mime")).toBe("mr-mime");
  });

  it("converte os símbolos de gênero", () => {
    expect(normalizePokemonQuery("Nidoran♀")).toBe("nidoran-f");
    expect(normalizePokemonQuery("Nidoran♂")).toBe("nidoran-m");
  });

  it("aceita os apelidos em português", () => {
    expect(normalizePokemonQuery("nidoran fêmea")).toBe("nidoran-f");
    expect(normalizePokemonQuery("nidoran macho")).toBe("nidoran-m");
  });

  it("devolve string vazia para entrada sem letras", () => {
    expect(normalizePokemonQuery("   ")).toBe("");
    expect(normalizePokemonQuery("---")).toBe("");
  });
});

describe("rankSuggestions", () => {
  const list = [
    { id: 25, name: "pikachu" },
    { id: 133, name: "eevee" },
    { id: 151, name: "mew" },
    { id: 150, name: "mewtwo" },
    { id: 646, name: "kyurem" },
    { id: 10022, name: "kyurem-black" },
    { id: 10034, name: "charizard-mega-x" },
    { id: 196, name: "espeon" },
    { id: 6, name: "charizard" }
  ];

  it("prefere quem começa com o termo a quem só o contém", () => {
    expect(rankSuggestions(list, "e")[0]).toBe("eevee");
  });

  it("traz a espécie antes das formas", () => {
    expect(rankSuggestions(list, "char")).toEqual(["charizard", "charizard-mega-x"]);
  });

  it("não sugere o próprio termo já completo", () => {
    expect(rankSuggestions(list, "mew")).toEqual(["mewtwo"]);
  });

  it("encontra pelo número", () => {
    expect(rankSuggestions(list, "25")).toEqual(["pikachu"]);
  });

  it("acha as formas pela segunda parte do nome", () => {
    expect(rankSuggestions(list, "black")).toEqual(["kyurem-black"]);
  });

  it("respeita o limite e ignora termo vazio", () => {
    expect(rankSuggestions(list, "e", 2)).toHaveLength(2);
    expect(rankSuggestions(list, "")).toEqual([]);
  });
});

describe("formatSearchLabel", () => {
  it("mostra cada parte com inicial maiúscula", () => {
    expect(formatSearchLabel("mr-mime")).toBe("Mr Mime");
    expect(formatSearchLabel("pikachu")).toBe("Pikachu");
  });
});
