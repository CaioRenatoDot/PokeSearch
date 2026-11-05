export const suggestions = ["pikachu", "charizard", "bulbasaur", "greninja", "lucario", "gengar"];

export const typeStyles = {
  normal: "bg-slate-500",
  fire: "bg-orange-600",
  water: "bg-sky-600",
  electric: "bg-amber-500 text-slate-950",
  grass: "bg-emerald-600",
  ice: "bg-cyan-500 text-slate-950",
  fighting: "bg-rose-700",
  poison: "bg-purple-700",
  ground: "bg-stone-600",
  flying: "bg-indigo-500",
  psychic: "bg-pink-600",
  bug: "bg-lime-600",
  rock: "bg-yellow-800",
  ghost: "bg-violet-800",
  dragon: "bg-blue-700",
  dark: "bg-zinc-800",
  steel: "bg-slate-600",
  fairy: "bg-fuchsia-500"
};

export const typeNames = Object.keys(typeStyles);

export const typeLabels = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Venenoso",
  ground: "Terrestre",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Aço",
  fairy: "Fada"
};

export const statLabels = {
  hp: "Vitalidade",
  attack: "Poder",
  defense: "Guarda",
  "special-attack": "Especial",
  "special-defense": "Resist.",
  speed: "Agilidade"
};

export const habitatLabels = {
  cave: "Caverna",
  forest: "Floresta",
  grassland: "Campo",
  mountain: "Montanha",
  rare: "Raro",
  "rough-terrain": "Terreno acidentado",
  sea: "Mar",
  urban: "Urbano",
  "waters-edge": "Beira d'água"
};

export const damageClassLabels = {
  physical: "Físico",
  special: "Especial",
  status: "Status"
};

// Faixas de número da Pokedex nacional em cada geração; formas alternativas ficam de fora.
export const generations = [
  { id: 1, label: "Geração I", first: 1, last: 151 },
  { id: 2, label: "Geração II", first: 152, last: 251 },
  { id: 3, label: "Geração III", first: 252, last: 386 },
  { id: 4, label: "Geração IV", first: 387, last: 493 },
  { id: 5, label: "Geração V", first: 494, last: 649 },
  { id: 6, label: "Geração VI", first: 650, last: 721 },
  { id: 7, label: "Geração VII", first: 722, last: 809 },
  { id: 8, label: "Geração VIII", first: 810, last: 905 },
  { id: 9, label: "Geração IX", first: 906, last: 1025 }
];

// Último número da Pokedex nacional; formas alternativas usam ids acima de 10000.
export const MAX_POKEDEX_ID = generations[generations.length - 1].last;
