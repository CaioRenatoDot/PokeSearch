# PokeSearch

Pokedex em React com Vite, Tailwind CSS e Motion.

## Rodar o projeto

```bash
npm install
npm run dev
```

Depois abra a URL que o Vite mostrar no terminal, normalmente:

```text
http://localhost:5173/PokeSearch/
```

## Scripts

```bash
npm run dev     # ambiente de desenvolvimento
npm run lint    # ESLint
npm test        # testes das funções puras (Vitest)
npm run build   # build de produção
```

## Recursos

- **Busca na PokeAPI** por nome, número ou parte do nome, com sugestões navegáveis por teclado. Erros de digitação recebem um "você quis dizer", e falhas de conexão oferecem tentar de novo.
- **Ficha completa**: descrição da Pokedex, categoria, habitat, geração, gênero, grupos de ovo, raridade, tipos em batalha e formas alternativas (Mega, Gigantamax, regionais).
- **Evolução clicável** com a condição de cada etapa: nível, item, troca, amizade ou horário.
- **Golpes** por nível, MT, ovo e tutor, com tipo, classe, poder, precisão, PP e efeito ao abrir cada um.
- **Modo explorar**: grade da Pokedex nacional com filtro por nome ou número, geração, até dois tipos e favoritos, além de ordenação e opção de incluir as formas. Voltar de um Pokémon devolve você ao mesmo ponto da lista.
- **Time** de até seis Pokémon, salvo no navegador, com fraquezas em comum, defesas sólidas, tipos sem cobertura, sugestão de tipo para a próxima vaga e média de atributos.
- **Favoritos e histórico** salvos no navegador.
- **Comparação** de dois Pokémon lado a lado, com a diferença de cada atributo e o melhor multiplicador de tipo de cada um contra o outro.
- **Grito oficial** de cada Pokémon, com controle de volume e botão de mudo salvos no navegador.
- **Tela Game Boy** monocromática como alternativa à tela colorida, também salva no navegador.

## Link compartilhável

O endereço acompanha o que está na tela, e os botões voltar e avançar do navegador funcionam entre Pokémon e modos:

```text
https://caiorenatodot.github.io/PokeSearch/?p=charizard
https://caiorenatodot.github.io/PokeSearch/?p=blastoise&vs=charizard
https://caiorenatodot.github.io/PokeSearch/?view=team&team=charizard,blastoise,venusaur
```

| Parâmetro | Significado |
| --- | --- |
| `p` | Pokémon atual |
| `vs` | Pokémon fixado para comparação |
| `view` | Modo do visor: `browse` ou `team` |
| `team` | Time compartilhado, com os nomes separados por vírgula |

Um link de time mostra a equipe de outra pessoa sem alterar a sua. Ela só substitui o seu time se você escolher "Usar como meu time".

## Atalhos de teclado

| Tecla | Ação |
| --- | --- |
| `/` | Foca o campo de busca |
| `←` `→` | Pokémon anterior e próximo |
| `R` | Sorteia um Pokémon |
| `F` | Marca ou desmarca o favorito |
| `T` | Coloca ou tira do time |
| `↑` `↓` | Percorre as sugestões da busca |

## Estrutura

- `src/components/SearchPanel.jsx`: painel lateral com marca, busca, som e modos.
- `src/components/SearchBox.jsx`: campo de busca com as sugestões em combobox.
- `src/components/PokemonScreen.jsx`: visor principal, que alterna entre card, grade, time e comparação.
- `src/components/PokemonCard.jsx`: apresentação do Pokémon.
- `src/components/MovesPanel.jsx`: golpes por forma de aprender, com detalhes sob demanda.
- `src/components/PokemonGrid.jsx`: grade e filtros do modo explorar.
- `src/components/TeamView.jsx`: montagem e análise do time.
- `src/components/ComparisonView.jsx`: confronto de dois Pokémon.
- `src/hooks/usePokemonSearch.js`: estado e fluxo de busca na PokeAPI.
- `src/hooks/usePokemonBrowser.js`: lista, filtros e paginação da grade.
- `src/hooks/useTeam.js`: time salvo e time vindo de um link.
- `src/hooks/useFavorites.js`: favoritos salvos.
- `src/hooks/useStoredState.js`: estado persistido no `localStorage`.
- `src/hooks/useTypeResources.js`: relações de tipo carregadas da API.
- `src/hooks/useSoundPreference.js`: volume e mudo persistidos.
- `src/hooks/useKeyboardShortcuts.js`: atalhos globais.
- `src/api/pokeApi.js`: chamadas HTTP para a PokeAPI.
- `src/utils/url.js`: leitura e escrita do estado na URL.
- `src/utils/search.js`: normalização, ranking de sugestões e correção de digitação.
- `src/utils/browse.js`: filtros e ordenação da grade.
- `src/utils/team.js`: análise de fraquezas, cobertura e sugestões do time.
- `src/utils/typeEffectiveness.js`: multiplicadores de dano a partir dos tipos.
- `src/utils/evolution.js`: cadeia evolutiva em estágios e condição de cada evolução.
- `src/utils/moves.js`: golpes por forma de aprender e resumo de cada golpe.
- `src/utils/pokemonSpecies.js`: dados da espécie, como formas, gênero e geração.
