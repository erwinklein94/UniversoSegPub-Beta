# Hotfix crítico — site travado / sem rolagem

## Causa provável encontrada

A versão anterior havia sido gerada com mudanças maiores que o necessário, incluindo mudança na estrutura do ZIP e uma nova versão completa do bundle. Como o problema relatado foi travamento global da página, o hotfix foi feito por rebase no último pacote funcional, aplicando apenas correções pontuais.

## Correções aplicadas

1. O comparador tinha duas funções `getSelecionadasComparador()` com lógicas diferentes. A função antiga de checkboxes sobrescrevia a nova lógica dos seletores. Removida a duplicidade.
2. A função final do comparador agora lê somente os seletores, filtra instituições válidas e respeita o limite máximo de 4 carreiras.
3. A ampliação do brasão foi blindada para não criar camada/overlay no carregamento inicial. O lightbox agora só é criado quando o usuário clica no brasão.
4. Adicionado CSS de segurança para garantir rolagem normal quando o lightbox não estiver aberto e impedir que overlay inativo capture cliques.
5. Mantida a estrutura original do ZIP com a pasta `UniSegPub-Alpha-main`, como no pacote anterior funcional.
6. Cache-busting atualizado para `v=20260502hotfixv1`.

## Verificações

- Sintaxe JavaScript validada com `node --check`.
- Verificada a remoção da função duplicada no comparador.
- Verificado que `brasao-lightbox.js` não cria overlay no carregamento inicial.
