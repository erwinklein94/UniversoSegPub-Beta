# Refatoração para páginas reais — Universo Segurança Pública

## O que foi alterado

O projeto deixou de depender de uma navegação principal baseada somente em `#hash` dentro de um único `index.html`.
Agora cada seção principal tem uma página HTML própria:

- `index.html` — Página principal
- `remuneracao.html` — Remuneração Tabelada
- `direitos.html` — Direitos e Vantagens
- `poderes-deveres.html` — Poderes e Deveres
- `brasoes.html` — Brasões e História
- `concursos.html` — Concursos
- `comparar-carreiras.html` — Comparar Carreiras
- `produtos.html` — Produtos
- `acoes-judiciais.html` — Ações Judiciais
- `associacoes-sindicatos.html` — Associações e Sindicatos
- `anuncie.html` — Parceiros / Anuncie aqui
- `parceiros.html` — alias de compatibilidade apontando para o mesmo conteúdo de `anuncie.html`

## Objetivo

A mudança foi feita para melhorar:

1. **Performance percebida**: cada URL contém apenas o bloco principal daquela seção.
2. **SEO**: cada assunto agora tem título, descrição e URL própria.
3. **Anúncios direcionados**: os espaços comerciais agora apontam para `anuncie.html?area=...`, permitindo identificar de qual página/área veio o interesse comercial.
4. **Manutenção**: o JS passou a ser carregado por arquivos-fonte menores, sem usar o bundle grande em todas as páginas.

## Arquivos novos/importantes

- `js/core/page-context.js`  
  Controla o modo MPA, ativa o item correto do menu, preserva compatibilidade com funções antigas e preenche o formulário comercial quando a URL possui `?area=`.

- `backup-original/index-spa-original.html`  
  Cópia do `index.html` antigo, mantida apenas para comparação e rollback.

## Scripts

As páginas não carregam mais:

```html
<script src="js/dist/app.bundle.js"></script>
```

Em vez disso, carregam os arquivos necessários em ordem. Exemplo resumido:

```html
<script src="js/data/parametros-cargos.js" defer></script>
<script src="js/data/policia-penal.js" defer></script>
<script src="js/data/bases-conteudo.js" defer></script>
<script src="js/ui/navegacao-ui.js" defer></script>
<script src="js/services/remuneracao.js" defer></script>
<script src="js/ui/header-estados.js" defer></script>
<script src="js/pages/contato-init.js" defer></script>
<script src="js/ui/event-bindings.js" defer></script>
<script src="js/core/page-context.js" defer></script>
```

Páginas específicas carregam também seus módulos próprios, por exemplo:

- `direitos.html` carrega `js/services/direitos.js`
- `concursos.html`, `comparar-carreiras.html`, `acoes-judiciais.html` e `associacoes-sindicatos.html` carregam `js/pages/concursos-comparador.js`
- `poderes-deveres.html` carrega `js/pages/poderes-deveres.js`
- `brasoes.html` carrega `js/brasao-lightbox.js`

## Anúncios direcionados

Os links de anúncio deixaram de apontar para `#parceiros` e passaram a apontar para URLs como:

```text
anuncie.html?area=home_topo
anuncie.html?area=remuneracao_antes_tabela
anuncie.html?area=concursos_antes_lista
anuncie.html?area=rodape_geral
```

Na página `anuncie.html`, o formulário é preenchido automaticamente com a área de interesse.

## Revisões feitas

Foram feitas estas checagens antes de compactar a versão final:

- Cada página HTML possui apenas um `<main>` ativo.
- Cada página possui apenas um item ativo no menu lateral.
- Todos os scripts locais referenciados existem.
- Todos os CSS locais referenciados existem.
- Todos os links internos `.html` apontam para arquivos existentes.
- Não há mais links internos principais baseados em `href="#..."` nas novas páginas.
- Nenhuma página nova carrega `js/dist/app.bundle.js`.
- Os JS carregados pelas páginas passaram no `node --check`.
- Foi executada uma simulação básica em Node com DOM falso para detectar erros de carregamento e dependências globais óbvias.

## Observação

O arquivo `js/dist/app.bundle.js` foi mantido no projeto como artefato antigo/rollback, mas não é carregado pelas páginas novas. Se a versão MPA for aprovada em produção, ele pode ser removido em uma próxima limpeza.

## Revisão corretiva — sidebar e eventos globais

### Problema encontrado
A sidebar podia não permanecer aberta ao clicar no botão de menu porque o `body` possui `data-page` para identificar a página atual, e o arquivo `js/ui/event-bindings.js` registrava clique em todo seletor `[data-page]`. Como cliques no botão do menu sobem até o `body`, o handler global chamava `switchPage()` e fechava o menu imediatamente.

### Correção aplicada
- O handler de navegação por `data-page` agora ignora o `body`: `[data-page]:not(body)`.
- O botão `.menu-btn` agora usa `event.stopPropagation()` para evitar conflito com outros handlers globais.
- O overlay e o botão de fechar agora chamam `toggleMenu(false)`, fechando a sidebar de forma explícita em vez de alternar o estado.
- A mesma correção foi replicada em `js/chunks/10-event-bindings.js` e `js/dist/app.bundle.js` para manter consistência caso algum arquivo antigo volte a ser usado.

### Checagens executadas após a correção
- Conferência de sintaxe com `node --check` em todos os arquivos JS.
- Conferência de referências locais de CSS, JS e imagens em todos os HTML.
- Conferência de que cada HTML principal contém exatamente um `<main class="page-section active">`.
- Conferência de que cada página possui o item correto ativo na sidebar.
- Conferência de que os links da sidebar apontam para páginas reais, não para hashes.
- Conferência de que as páginas MPA não carregam `js/dist/app.bundle.js` diretamente.
