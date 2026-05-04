# Partials HTML

O site permanece como MPA estático para preservar SEO e compatibilidade com GitHub Pages.

Para uma futura etapa de componentização completa, a divisão recomendada é:

- `header.html`
- `sidebar.html`
- `pages/home.html`
- `pages/remuneracao.html`
- `pages/direitos.html`
- `pages/concursos.html`
- `pages/comparador.html`
- `pages/produtos.html`
- `pages/acoes.html`
- `pages/associacoes.html`
- `pages/parceiros.html`
- `footer.html`

Nesta revisão, a limpeza removeu backups e chunks legados não carregados pelas páginas públicas atuais. A próxima etapa boa é gerar `header`, `sidebar` e `footer` em build-time para acabar com a repetição entre páginas sem prejudicar indexação.

## Piloto aplicado: `anuncie.html`

Esta etapa criou um piloto de componentização **somente para `anuncie.html`**.

Arquivos principais:

- `src/pages/anuncie.template.html`
- `partials/pilot/anuncie/*.html`
- `scripts/build-pilot-anuncie.py`

O HTML público continua estático. Para validar que o template ainda gera a página pública sem diferença:

```bash
python scripts/build-pilot-anuncie.py --check
```

Para regenerar apenas a página piloto:

```bash
python scripts/build-pilot-anuncie.py --write
```

Nenhuma outra página foi migrada nesta etapa.

