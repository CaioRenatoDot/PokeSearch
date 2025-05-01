document.getElementById("searchBtn").addEventListener('click', () => {
  const pokemonName = document.getElementById('pokemonInput').value.toLowerCase().trim();

  if(!pokemonName){
    console.log('Digite um nome de Pokemon.')
    return
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`

  fetch(url)
    .then(response =>{
      if(!response.ok){
        throw new Error('Pokemon não encontrado.')
      }
      return response.json();
    })
    .then(data =>console.log(data))
    .catch(error => console.error(error.message));
    
});