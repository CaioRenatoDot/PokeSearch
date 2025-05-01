document.getElementById("searchBtn").addEventListener('click', () => {
  const pokemonName = document.getElementById('pokemonInput').value.toLowerCase().trim();
  const displayDiv = document.getElementById('pokemonDisplay');

  if(!pokemonName){
    displayDiv.innerHTML = '<p>Digite um nome de Pokémon.</p>';
    return;
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`

  fetch(url)
    .then(response => {
      if(!response.ok){
        throw new Error('Pokemon não encontrado.');
      }
      return response.json();
    })
    .then(data => {
      const name = data.name;
      const sprite = data.sprites.front_default;
      const types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
      
      displayDiv.innerHTML = `
      <h2>${name.toUpperCase()}</h2>
      <img src="${sprite}" alt="${name}">
      <p><strong>Tipo(s):</strong> ${types}</p>
      `;
    })
    .catch(Error => {
      displayDiv.innerHTML = `<p>${error.message}</p>`;
    });
});