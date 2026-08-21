function extractIdFromUrl(url) {
  const match = /\/(\d+)\/?$/.exec(url || "");
  return match ? Number(match[1]) : null;
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
        id: extractIdFromUrl(node.species.url)
      }))
    );

    currentLevel = currentLevel.flatMap(node => node.evolves_to || []);
  }

  return stages.filter(stage => stage.every(item => item.id !== null));
}
