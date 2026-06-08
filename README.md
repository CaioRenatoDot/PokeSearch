# PokeSearch

Pokedex em React com Vite, Tailwind CSS e Motion.

## Rodar o projeto

```bash
npm install
npm run dev
```

Depois abra a URL que o Vite mostrar no terminal, normalmente:

```text
http://localhost:5173/
```

## Estrutura

- `src/components/SearchBox.jsx`: componente reutilizável de busca.
- `src/components/SearchPanel.jsx`: painel lateral com marca, busca e sugestões.
- `src/components/PokemonScreen.jsx`: visor principal.
- `src/components/PokemonCard.jsx`: apresentação do Pokémon.
- `src/hooks/usePokemonSearch.js`: estado e fluxo de busca na PokeAPI.
- `src/api/pokeApi.js`: chamada HTTP para a PokeAPI.
