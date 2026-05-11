# Relatório — Guia das instituições (2026-05-11)

## Alterações aplicadas

- Criada a página `guia-instituicoes.html` como nova aba principal do portal.
- Adicionado o link **Guia das instituições** ao menu lateral das páginas HTML do site.
- Adicionado card de acesso ao Guia na página inicial.
- Adicionado botão de acesso rápido na área principal da home.
- Criado o arquivo `css/pages/guia-instituicoes.css` para manter o visual alinhado aos cards existentes do portal.
- Criado o arquivo `js/pages/guia-instituicoes.js` para filtro progressivo por esfera e instituição.
- O primeiro artigo, **Guia PMESP 2026**, foi incluído diretamente no HTML, dentro de um card estático.
- O conteúdo permanece visível sem JavaScript, favorecendo leitura por crawlers e avaliação inicial do AdSense.
- O filtro por instituição apenas oculta/exibe artigos já presentes no HTML; ele não gera o conteúdo principal via JavaScript.
- Atualizados `js/core/page-context.js` e `js/ui/navegacao-ui.js` para reconhecer o nome da nova aba.
- Atualizado `sitemap.xml` com a nova URL.

## Como adicionar novos artigos

1. Abra `guia-instituicoes.html`.
2. Duplique o bloco `<article class="card guia-artigo-card" ...>` dentro de `.guia-lista-artigos`.
3. Troque o `id`, o `data-guia-inst` e o `data-guia-esfera`.
4. Escreva o artigo diretamente no HTML.
5. O filtro reconhecerá automaticamente o novo card quando o `data-guia-inst` corresponder ao valor da instituição no sistema.

## Observação

Os valores do artigo PMESP foram tratados como informativos e aproximados, com aviso explícito para consulta aos canais oficiais e ao edital vigente.
