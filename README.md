# Universo Segurança Pública — Portal Independente

Projeto estático preparado para **GitHub Pages**.

## Natureza do site

Este site é um **portal independente e não governamental**.  
Ele organiza informações públicas, referências institucionais, links úteis, remuneração, direitos, concursos, ações judiciais, associações e materiais relacionados à segurança pública.

O site **não representa órgãos públicos**, **não fala em nome de instituições oficiais** e **não substitui fontes oficiais**, holerites, editais, leis, regulamentos ou setores administrativos competentes.

## Estrutura de arquivos

```text
/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   ├── styles.css
    │   └── professional.css
    ├── js/
    │   ├── image-fallback.js
    │   ├── app.js
    │   └── dados/
    │       ├── 01-parametros.js
    │       ├── 02-remuneracoes.js
    │       ├── 03-policia-penal.js
    │       ├── 04-acoes.js
    │       ├── 05-associacoes.js
    │       └── 06-concursos.js
    └── img/
        ├── barrafixa01.jpg
        ├── barrafixa02.jpg
        ├── botaacero.jpeg
        ├── logoleao.jpeg
        ├── pcba.jpeg
        ├── pces.jpeg
        ├── pcmg.jpeg
        ├── pcms.jpeg
        ├── pcmt.jpeg
        ├── pcpr.jpeg
        ├── pcrj.jpeg
        ├── pcrs.jpeg
        ├── pcsc.jpeg
        ├── pcsp.jpeg
        ├── pmba.jpeg
        ├── pmerj.jpeg
        ├── pmes.jpeg
        ├── pmesp.jpeg
        ├── pmmg.jpeg
        ├── pmms.jpeg
        ├── pmmt.jpeg
        ├── pmpr.jpeg
        ├── pmrs.jpeg
        ├── pmsc.jpeg
        ├── ppba.jpeg
        ├── ppes.jpeg
        ├── ppmg.jpeg
        ├── ppms.jpeg
        ├── ppmt.jpeg
        ├── pppr.jpeg
        ├── pprj.jpeg
        ├── pprs.jpeg
        ├── ppsc.jpeg
        └── ppsp.jpeg
```

## Onde colocar as imagens

Coloque exatamente estes arquivos na pasta `assets/img/`:

```text
barrafixa01.jpg
barrafixa02.jpg
botaacero.jpeg
logoleao.jpeg
logolesao.jpeg
pcba.jpeg
pces.jpeg
pcma.jpeg
pcmg.jpeg
pcms.jpeg
pcmt.jpeg
pcpr.jpeg
pcrj.jpeg
pcrs.jpeg
pcsc.jpeg
pcsp.jpeg
pcto.jpeg
pmba.jpeg
pmej.jpeg
pmes.jpeg
pmesp.jpeg
pmgo.jpeg
pmma.jpeg
pmmg.jpeg
pmms.jpeg
pmmt.jpeg
pmpr.jpeg
pmrs.jpeg
pmsc.jpeg
pmto.jpeg
ppba.jpeg
ppes.jpeg
ppma.jpeg
ppmg.jpeg
ppms.jpeg
ppmt.jpeg
pppr.jpeg
pprj.jpeg
pprs.jpeg
ppsc.jpeg
ppsp.jpeg
ppto.jpeg
pmerj.jpeg
pcgo.jpeg
ppgo.jpeg
```

No GitHub Pages, letras maiúsculas e minúsculas fazem diferença. Use os nomes exatamente como estão acima.

### Imagens do cabeçalho institucional

O cabeçalho agora usa a imagem da instituição selecionada, não mais a bandeira do estado.

Exemplo:

- PMESP usa `assets/img/pmesp.jpeg`.
- PCSP usa `assets/img/pcsp.jpeg`.
- Polícia Civil do RJ usa a chave interna `pcerj`, mas o arquivo esperado é `assets/img/pcrj.jpeg`, conforme a lista informada.
- PMERJ usa `assets/img/pmerj.jpeg` e também aceita `assets/img/pmej.jpeg` como referência alternativa.
- O logo usa `assets/img/logoleao.jpeg` e também aceita `assets/img/logolesao.jpeg` como referência alternativa.

Se alguma imagem institucional não existir na pasta, o site usa automaticamente a bandeira do estado como fallback.

## O que cada arquivo faz

- `index.html`: estrutura do site, textos principais, páginas e carregamento dos arquivos.
- `assets/css/styles.css`: CSS original/base do projeto.
- `assets/css/professional.css`: camada visual profissional. Também contém o acabamento das imagens institucionais do cabeçalho.
- `assets/js/app.js`: funções, navegação, cálculos, renderizações e mapeamento das imagens institucionais.
- `assets/js/dados/*.js`: dados separados por assunto para manutenção e cache.
- `assets/js/image-fallback.js`: fallback para imagens de produto e fallback do cabeçalho para bandeira estadual.

## Publicação no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie o conteúdo desta pasta para a raiz do repositório.
3. Vá em **Settings > Pages**.
4. Em **Build and deployment**, selecione:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/root`
5. Salve e aguarde o link do GitHub Pages.

## Manutenção recomendada

- Para mudar aparência: edite `assets/css/professional.css`.
- Para alterar textos fixos e estrutura: edite `index.html`.
- Para alterar o nome dos arquivos institucionais: edite `HEADER_INSTITUICOES_IMAGENS` em `assets/js/app.js`.
- Para alterar remunerações: edite `assets/js/dados/02-remuneracoes.js`.
- Para alterar concursos: edite `assets/js/dados/06-concursos.js`.
- Para alterar ações judiciais: edite `assets/js/dados/04-acoes.js`.
- Para alterar associações: edite `assets/js/dados/05-associacoes.js`.


## Ajuste do cabeçalho: logos maiores

A imagem institucional exibida no cabeçalho foi ampliada em `assets/css/professional.css`, no bloco:

```css
/* AJUSTE 2026-04 — Logos institucionais maiores no cabeçalho */
```

Para mudar só o tamanho do logo, edite principalmente estes valores:

```css
.current-flag-frame.institution-logo-frame {
  width: clamp(128px, 12vw, 178px);
  height: clamp(128px, 12vw, 178px);
}
```

No celular, o tamanho está controlado dentro de:

```css
@media (max-width: 700px) { ... }
```

## Melhorias de UX aplicadas nesta versão

- Tema salvo no navegador respeitado antes da página carregar.
- Tema claro recebeu contraste próprio em vez de herdar a camada escura militar.
- Hero principal ajustado para remover faixa clara que prejudicava leitura.
- Tocantins corrigido no seletor institucional (`PMTO`, `PCTO`, `PPTO`).
- Dossiê rápido incluído na página inicial para mostrar cobertura, fonte e campos que ainda exigem conferência.
- Tabela de remuneração recebeu busca, filtro por faixa da carreira e ordenação.
- Formulário de direitos ficou sem valores pré-preenchidos para evitar falsa personalização.
- Comparador manteve seleção clara por checkbox e resumo de instituições selecionadas.
- Menu lateral recebeu foco inicial, retorno de foco e navegação com `Esc`/`Tab` mais consistente.
- Links comerciais/afiliados receberam aviso de transparência mais explícito.
- Associações sem URL real não são mais renderizadas como links quebrados.
- URLs podem ser compartilhadas com `?inst=sigla&aba=nome-da-aba`, por exemplo `?inst=pmto&aba=remuneracao`.

## Tema visual refeito do zero — referência anexada

Nesta versão, a aparência anterior foi removida da página principal: o `index.html` agora carrega apenas `assets/css/tema-anexo-zero.css` como camada visual do site. O novo tema foi construído a partir da imagem de referência enviada, usando preto, grafite, aço, branco e vermelho, com fundo técnico, linhas centrais, painéis escuros, bordas chanfradas e alto contraste para leitura.

Arquivo de referência visual incluído:

- `assets/img/tema-anexo-interface.jpeg`

As camadas CSS anteriores foram removidas do pacote final para evitar conflitos: o `index.html` carrega somente o novo tema visual.

## Atualização — conteúdo enriquecido a partir do Alpha

Esta versão do `UniSegPub-Teste` foi enriquecida para aproveitar a base informacional do `UniSegPub-Alpha` sem perder a interface nova do Teste.

Principais melhorias adicionadas:

- Painel completo da instituição na página inicial, alimentado automaticamente pelos dados já cadastrados de remuneração, concursos, efetivo, ações judiciais e associações.
- Mapa rápido de cobertura por estado, com botões para alternar entre Polícia Militar, Polícia Civil e Polícia Penal.
- Resumos institucionais mais úteis ao usuário após a seleção da instituição.
- Atalhos contextuais para remuneração, concursos, direitos, ações e associações.
- Tema claro reforçado com contraste real, mantendo o tema escuro técnico como padrão visual.
- CSS complementar no próprio `assets/css/tema-anexo-zero.css`, sem criar dependências externas novas.

Arquivos principais alterados nesta atualização:

- `index.html`
- `assets/css/tema-anexo-zero.css`
- `assets/js/app.js`
