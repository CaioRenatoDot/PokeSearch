export const spriteModes = [
  { id: "animated", label: "Animado" },
  { id: "official", label: "Oficial" },
  { id: "shiny", label: "Shiny" },
  { id: "back", label: "Costas" }
];

export function getPokemonSprite(pokemon, mode = "animated") {
  const animatedShowdown = pokemon.sprites.other?.showdown?.front_default;
  const animatedBlackWhite =
    pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;
  const animatedBack =
    pokemon.sprites.other?.showdown?.back_default ||
    pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.back_default;
  const shiny =
    pokemon.sprites.other?.showdown?.front_shiny ||
    pokemon.sprites.other?.["official-artwork"]?.front_shiny ||
    pokemon.sprites.front_shiny;
  const officialArtwork = pokemon.sprites.other?.["official-artwork"]?.front_default;
  const homeArtwork = pokemon.sprites.other?.home?.front_default;
  const defaultSprite = pokemon.sprites.front_default;
  const fallback = animatedShowdown || animatedBlackWhite || officialArtwork || homeArtwork || defaultSprite;
  const sources = {
    animated: animatedShowdown || animatedBlackWhite || fallback,
    official: officialArtwork || homeArtwork || defaultSprite || fallback,
    shiny: shiny || fallback,
    back: animatedBack || pokemon.sprites.back_default || fallback
  };
  const src = sources[mode] || fallback;

  return {
    src,
    isAnimated: Boolean(src && src.endsWith(".gif")),
    mode
  };
}
