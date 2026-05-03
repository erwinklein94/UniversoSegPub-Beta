# Relatório — Correção geral de bugs

Data: 02/05/2026

## Correções aplicadas

1. **Comparador de Carreiras não gerava comparação com os novos seletores**
   - Problema encontrado: havia duas funções `getSelecionadasComparador()`. A função antiga, baseada em checkboxes, sobrescrevia a função nova baseada em seletores.
   - Efeito prático: mesmo preenchendo 2 a 4 carreiras, o comparador podia interpretar que nenhuma carreira havia sido selecionada.
   - Correção: removida a sobrescrita antiga e mantida a lógica única baseada nos seletores.

2. **Limite do comparador reforçado na lógica interna**
   - Problema encontrado: a validação visual já falava em 2 a 4 carreiras, mas a função final de seleção precisava ser a fonte única de verdade.
   - Correção: `getSelecionadasComparador()` agora filtra apenas instituições válidas e limita a lista a no máximo 4 carreiras.

3. **Guarda Municipal ausente do Comparador de Carreiras**
   - Problema encontrado: a estrutura geral de Guarda Municipal era criada para os seletores das abas institucionais, mas não era garantida antes de montar a lista do comparador.
   - Efeito prático: a Guarda Municipal podia aparecer em outras áreas do portal, mas não no comparador.
   - Correção: o comparador agora garante a estrutura da Guarda Municipal antes de montar os seletores e exibe o ramo como “Guarda Municipal”, não como “Carreira”.

4. **Pré-seleção automática não contemplava Guarda Municipal**
   - Problema encontrado: ao selecionar automaticamente carreiras do estado/esfera atual, a lista considerava PM, BM, PC, PP, PF e PRF, mas não GM.
   - Correção: adicionada GM à rotina de pré-seleção, mantendo a deduplicação e o limite máximo de 4 carreiras.

5. **Acessibilidade do bloco de seleção do comparador**
   - Problema encontrado: havia um `<label for="comparador-selecao">` apontando para uma `<div>`, que não é um controle de formulário.
   - Correção: convertido para título acessível com `aria-labelledby`, mantendo os labels reais dentro dos 4 seletores.

6. **Cache-busting atualizado**
   - Correção: versão dos arquivos CSS/JS alterada para `v=20260502bugfixv1`, reduzindo risco de o navegador continuar carregando arquivos antigos.

## Verificações realizadas

- Verificação de sintaxe JavaScript com `node --check` em todos os arquivos JS.
- Verificação de assets referenciados no `index.html`: nenhum arquivo local ausente encontrado.
- Verificação de IDs duplicados no HTML: nenhum ID duplicado encontrado.
- Verificação de labels com `for` sem alvo válido: nenhum problema restante encontrado.
- Execução estática do bundle em ambiente simulado para confirmar que o carregamento do JavaScript não quebra.
- Teste simulado do comparador confirmando que 2 carreiras selecionadas geram tabela/cards e que 4 carreiras pré-selecionadas geram comparação.

## Observações

- Ainda existem referências antigas e nulas-seguras a `cargo` e `poderes_instituicao` no JavaScript por compatibilidade com versões anteriores. Elas não quebram a página porque são verificadas antes de uso.
- Não foi feita alteração de conteúdo jurídico/remuneratório; as mudanças foram focadas em bugs funcionais, consistência e acessibilidade.
