import { describe, expect, it } from "vitest";
import { formatSearchLabel, normalizePokemonQuery } from "./search.js";

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

describe("formatSearchLabel", () => {
  it("mostra cada parte com inicial maiúscula", () => {
    expect(formatSearchLabel("mr-mime")).toBe("Mr Mime");
    expect(formatSearchLabel("pikachu")).toBe("Pikachu");
  });
});
