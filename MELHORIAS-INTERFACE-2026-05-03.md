# MELHORIAS DE INTERFACE — 2026-05-03

Refinamento visual aplicado em camada de override (não altera arquivos de
origem nem o `dist/main.min.css`). Pode ser revertido removendo:

- `css/improvements.css`
- `js/ui/improvements.js`
- O `<svg>` sprite no topo do `<body>` em `index.html`
- A `<div class="sidebar-current-chip">` em `index.html`
- Os dois `<link>`/`<script>` adicionados em `index.html`

## Arquivos novos

| Arquivo                            | Função                                                          |
|------------------------------------|-----------------------------------------------------------------|
| `css/improvements.css`             | Toda a camada de refinamento visual (~14 KB)                    |
| `js/ui/improvements.js`            | Atualiza o chip da instituição na sidebar conforme o seletor    |

## Alterações em `index.html`

1. `<link>` para `css/improvements.css` adicionado depois de `override-logoleao.css`.
2. `<script>` para `js/ui/improvements.js` adicionado no fim do `<body>`.
3. Sprite SVG inline com 14 ícones (`#icon-home`, `#icon-wallet`, `#icon-scale`,
   `#icon-scroll`, `#icon-shield`, `#icon-clipboard`, `#icon-compare`,
   `#icon-gavel`, `#icon-users`, `#icon-bag`, `#icon-handshake`,
   `#icon-instagram`, `#icon-close`, `#icon-arrow-right`).
4. Chip "Instituição selecionada" inserido logo abaixo do `.sidebar-header`.
5. Emojis trocados por `<svg><use href="#icon-X"/></svg>` em:
   - todos os links da sidebar (11 itens)
   - todos os 9 cards de "Consultas principais" e "Conteúdos e parceiros"
   - botão social do Instagram
   - botão de fechar (✕ → ícone close)

Nenhum `id`, `class`, `data-*` ou `role` existente foi removido — todos os
hooks de JavaScript do bundle continuam funcionando.

## O que mudou visualmente

### Sidebar
- Cabeçalho perdeu o gradiente preto (agora respeita o tema do site).
- Largura de 300 px no desktop, `min(86vw, 320px)` no mobile.
- Chip compacto da instituição atual logo abaixo do cabeçalho.
- Links de navegação em pílulas com ícone SVG + texto sentence-case.
- Estado ativo: barra vertical vermelha à esquerda + fundo translúcido,
  no lugar da bolinha + sombra.
- Subtítulos `<small>` dos links ocultos (poluíam visualmente).
- Bloco "patrocinado" separado por linha de divisão e label discreto.
- Botão do Instagram com mesmo padrão visual dos demais links.
- Botão de fechar com ícone SVG e estado hover sutil.

### Página principal
- Hero sem `clip-path` (canto cortado), sem watermark gigante e sem
  gradiente radial sobreposto. Fundo glass alinhado ao restante do site.
- Eyebrow com bullet point pulsante e cor da instituição.
- Título sentence-case com `letter-spacing` reduzido (era 1.5 px → 0.5 px).
- Disclaimer "Portal informativo" rebaixado para nota lateral discreta.
- Botões: o primário continua sólido vermelho; os secundários viram
  outline ghost (transparente, borda sutil, hover com cor da instituição).
- Stats com `grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))`
  — quebra sozinho em 2x2 ou 1x4 conforme a largura.
- Cards com fundo `var(--glass-panel)` (claro no tema claro, escuro no
  tema escuro), sem `clip-path`, com ícone em pílula colorida 38x38 px.
- Tag do card com seta `→` que desliza no hover.
- "Como usar" agora tem uma linha conectora horizontal sutil entre os
  3 passos numerados (apenas ≥720 px).
- Estados de foco (`:focus-visible`) padronizados: outline 2 px vermelho
  + halo de 4 px em `color-mix`, visível em ambos os temas.

## Reversão

Para reverter parcialmente:
- **Manter SVGs e remover só o CSS:** apague `css/improvements.css` e o
  `<link>` correspondente. Os ícones SVG continuam funcionando (têm
  fallback para `currentColor` e tamanho mínimo herdado).
- **Reverter tudo:** apague os 2 arquivos novos, o sprite SVG, o chip e
  as 4 linhas adicionadas em `index.html`.

## Sobre o que NÃO foi feito (e por quê)

- **Combobox de busca para o seletor de 27 estados**: requer JS substancial
  e teste cuidadoso de acessibilidade (combobox WAI-ARIA + teclado +
  mobile). Risco alto de quebrar fluxos existentes. Mantive o `<select>`
  nativo, que continua funcional. Pode ser implementado depois.
- **Trocar `dist/main.min.css`**: optei por sobreposição (override) para
  preservar seu pipeline de build atual.
