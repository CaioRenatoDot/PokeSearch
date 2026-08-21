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

## Recursos

- **Busca na PokeAPI** por nome ou número, com sugestões navegáveis por teclado.
- **Modo explorar**: grade com todos os Pokémon, filtro pelos 18 tipos e carregamento por scroll.
- **Comparação** de dois Pokémon lado a lado, com a diferença de cada atributo base.
- **Grito oficial** de cada Pokémon, com controle de volume e botão de mudo salvos no navegador.
- **Tela Game Boy** monocromática como alternativa à tela colorida.

## Link compartilhável

Cada busca atualiza a URL com o Pokémon atual, então o endereço pode ser copiado e compartilhado:

```text
https://caiorenatodot.github.io/PokeSearch/?p=charizard
```

Ao abrir um link assim, o app já carrega o Pokémon do parâmetro em vez do padrão.

## Atalhos de teclado

| Tecla | Ação |
| --- | --- |
| `/` | Foca o campo de busca |
| `←` `→` | Pokémon anterior e próximo |
| `R` | Sorteia um Pokémon |
| `↑` `↓` | Percorre as sugestões da busca |

## Estrutura

- `src/components/SearchPanel.jsx`: painel lateral com marca, busca, som e modos.
- `src/components/SearchBox.jsx`: campo de busca com as sugestões em combobox.
- `src/components/PokemonScreen.jsx`: visor principal, que alterna entre card, grade e comparação.
- `src/components/PokemonCard.jsx`: apresentação do Pokémon.
- `src/components/PokemonGrid.jsx`: grade do modo explorar.
- `src/components/ComparisonView.jsx`: confronto de dois Pokémon.
- `src/hooks/usePokemonSearch.js`: estado e fluxo de busca na PokeAPI.
- `src/hooks/usePokemonBrowser.js`: lista, filtro por tipo e paginação da grade.
- `src/hooks/useSoundPreference.js`: volume e mudo persistidos.
- `src/hooks/useKeyboardShortcuts.js`: atalhos globais.
- `src/api/pokeApi.js`: chamadas HTTP para a PokeAPI.
- `src/utils/url.js`: leitura e escrita do Pokémon atual na URL.
