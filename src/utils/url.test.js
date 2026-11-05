import { describe, expect, it } from "vitest";
import { parseUrlState } from "./url.js";

describe("parseUrlState", () => {
  it("assume o modo detalhe sem parâmetros", () => {
    expect(parseUrlState("")).toEqual({ pokemon: "", versus: "", view: "detail", team: [] });
  });

  it("lê o Pokémon e a comparação", () => {
    const state = parseUrlState("?p=charizard&vs=blastoise");

    expect(state.pokemon).toBe("charizard");
    expect(state.versus).toBe("blastoise");
  });

  it("ignora um modo desconhecido", () => {
    expect(parseUrlState("?view=hack").view).toBe("detail");
    expect(parseUrlState("?view=team").view).toBe("team");
  });

  it("separa os membros do time por vírgula", () => {
    expect(parseUrlState("?team=pikachu,,mew").team).toEqual(["pikachu", "mew"]);
  });
});
