# Redesign standalone aplicado — 2026-05-15

## Objetivo
Aplicar a aparência do arquivo `Universo Segurança Pública - Redesign _standalone_` ao site principal, mantendo a lógica já existente dos brasões e das bandeiras no cabeçalho.

## Alterações realizadas
- Criado `css/redesign-institucional.css` com a camada visual do standalone.
- Adicionada a fonte institucional `Spectral`, `IBM Plex Sans` e `IBM Plex Mono`.
- Inserido o novo CSS depois das folhas existentes em 43 arquivos HTML para que a nova aparência prevaleça.
- Preservada a imagem ativa do brasão no cabeçalho (`#header-active-flag`).
- Preservadas as variáveis de imagem usadas pelo JavaScript (`--site-header-bg-image`, `--header-hero-image`, `--page-institution-image`).
- Reativada e redesenhada a régua de bandeiras `.header-state-flags`, que estava oculta por uma camada anterior.
- Mantida compatibilidade do menu lateral com as classes antigas `.active` e novas `.is-open`.

## Arquivos principais
- `css/redesign-institucional.css`
- HTMLs atualizados com o link para a nova folha de estilo.

## Observação
Esta revisão altera aparência e compatibilidade visual. Não altera dados, JSONs, scripts de remuneração, concursos, produtos, brasões ou mapeamento institucional.
