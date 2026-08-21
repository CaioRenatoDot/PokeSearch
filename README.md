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

## Link compartilhável

Cada busca atualiza a URL com o Pokémon atual, então o endereço pode ser copiado e compartilhado:

```text
https://caiorenatodot.github.io/PokeSearch/?p=charizard
```

Ao abrir um link assim, o app já carrega o Pokémon do parâmetro em vez do padrão.

## Estrutura

- `src/components/SearchBox.jsx`: componente reutilizável de busca.
- `src/components/SearchPanel.jsx`: painel lateral com marca, busca e sugestões.
- `src/components/PokemonScreen.jsx`: visor principal.
- `src/components/PokemonCard.jsx`: apresentação do Pokémon.
- `src/hooks/usePokemonSearch.js`: estado e fluxo de busca na PokeAPI.
- `src/api/pokeApi.js`: chamada HTTP para a PokeAPI.
- `src/utils/url.js`: leitura e escrita do Pokémon atual na URL.
