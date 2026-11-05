import { formatName, formatTypeName } from "./formatters.js";

function extractIdFromUrl(url) {
  const match = /\/(\d+)\/?$/.exec(url || "");
  return match ? Number(match[1]) : null;
}

const TIME_LABELS = { day: "de dia", night: "à noite", dusk: "ao anoitecer" };
const GENDER_LABELS = { 1: "fêmea", 2: "macho" };

function levelUpParts(detail) {
  const parts = [];

  if (detail.min_level) parts.push(`Nv ${detail.min_level}`);
  if (detail.min_happiness) parts.push("Amizade");
  if (detail.min_affection) parts.push("Afeição");
  if (detail.min_beauty) parts.push("Beleza");
  if (detail.known_move) parts.push(`Sabendo ${formatName(detail.known_move.name)}`);
  if (detail.known_move_type) parts.push(`Golpe ${formatTypeName(detail.known_move_type.name)}`);
  if (detail.location) parts.push("Local específico");

  return parts.length ? parts : ["Subir de nível"];
}

function triggerParts(detail) {
  const trigger = detail.trigger?.name;

  if (trigger === "level-up") return levelUpParts(detail);
  if (trigger === "use-item") return [detail.item ? formatName(detail.item.name) : "Item"];
  if (trigger === "trade") return ["Troca"];

  return ["Especial"];
}

// A API lista uma condição por versão do jogo; `is_default` marca a que vale nos jogos atuais.
export function formatEvolutionCondition(details) {
  if (!details?.length) return null;

  const detail = details.find(item => item.is_default) ?? details[0];
  const parts = triggerParts(detail);

  if (detail.held_item) parts.push(`Segurando ${formatName(detail.held_item.name)}`);
  if (TIME_LABELS[detail.time_of_day]) parts.push(TIME_LABELS[detail.time_of_day]);
  if (GENDER_LABELS[detail.gender]) parts.push(GENDER_LABELS[detail.gender]);

  return parts.join(" · ");
}

// A cadeia vem como uma arvore; achatar por estagio cobre linhas simples e ramificadas como a do Eevee.
export function buildEvolutionStages(chain) {
  if (!chain) return [];

  const stages = [];
  let currentLevel = [chain];

  while (currentLevel.length) {
    stages.push(
      currentLevel.map(node => ({
        name: node.species.name,
        id: extractIdFromUrl(node.species.url),
        condition: formatEvolutionCondition(node.evolution_details)
      }))
    );

    currentLevel = currentLevel.flatMap(node => node.evolves_to || []);
  }

  return stages.filter(stage => stage.every(item => item.id !== null));
}
