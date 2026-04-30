# Universo Segurança Pública — Versão corrigida para GitHub Pages

Esta versão corrige o problema em que a página abre sem estilo no GitHub Pages.

## Como publicar corretamente

1. Extraia este ZIP.
2. No repositório `UniSegPub-Teste`, envie **todo o conteúdo** desta pasta para a raiz do repositório:
   - `index.html`
   - pasta `assets/`
   - `.nojekyll`
   - `README.md`
3. Em **Settings > Pages**, configure:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
4. Aguarde alguns minutos.
5. Abra o site e pressione `Ctrl + F5` para limpar o cache.

## O que foi ajustado

- CSS incorporado dentro do `index.html` para o visual carregar mesmo se o GitHub Pages falhar ao buscar o arquivo CSS externo.
- JavaScript principal incorporado dentro do `index.html` para reduzir problemas de caminho.
- Pasta `assets/` mantida para imagens e organização.
- Arquivo `.nojekyll` incluído para evitar processamento indesejado do GitHub Pages.

## Importante

O erro visual geralmente acontece quando o GitHub recebe apenas o `index.html`, mas não recebe a pasta `assets/`. Nesta versão o estilo já vai junto dentro do próprio HTML, então o site não deve mais aparecer “cru” como HTML simples.
