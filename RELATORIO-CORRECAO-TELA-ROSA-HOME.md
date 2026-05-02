# Correção emergencial — tela rosa/travamento

## Problema relatado
A versão anterior travou no computador e, no mobile, abriu uma tela totalmente rosa/magenta.

## Correções aplicadas
- O pacote foi reconstruído a partir da última versão estável anterior.
- Foram reaplicados apenas os ajustes solicitados da página inicial: disclaimer menor, cobertura incluindo PF/PRF/Guardas Municipais e troca de “Primeiro passo” por “Como consultar”.
- O cache busting de CSS e JS foi atualizado para forçar atualização no GitHub Pages/Safari.
- Foi adicionado CSS de estabilidade para mobile, removendo fundos fixos e filtros pesados que podem causar tela rosa ou travamento em navegadores móveis.
- O overlay do menu e o lightbox do brasão receberam regra defensiva para não cobrirem a tela quando fechados.

## Validação
- Sintaxe JavaScript validada com `node --check`.
- CSS validado com PostCSS.
- ZIP final gerado com estrutura original preservada.
