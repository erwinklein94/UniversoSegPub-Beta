# Otimização de carregamento — Universo Segurança Pública

Esta versão mantém o código original como backup e carrega o site por arquivos menores.

## O que foi alterado

- `js/script.js` foi preservado como backup completo em `js/script-original.js`.
- O JavaScript ativo agora está dividido em `js/chunks/01-...` até `09-...`, carregado em ordem com `defer`.
- `css/style.css` foi preservado como backup completo em `css/style-original.css`.
- O CSS ativo agora está dividido em `css/chunks/01-...` até `05-...`, carregado diretamente pelo `index.html`.
- Imagens com `loading="lazy"` receberam `decoding="async"`.
- A imagem principal do cabeçalho recebeu `fetchpriority="high"`.

## Como voltar ao modelo antigo, se necessário

1. No `index.html`, substitua os links de `css/chunks/*.css` por:

```html
<link rel="stylesheet" href="css/style-original.css">
```

2. No final do `index.html`, substitua os scripts de `js/chunks/*.js` por:

```html
<script src="js/script-original.js"></script>
```

## Observação

A divisão foi feita de forma conservadora para preservar a ordem original das declarações, funções e inicialização.
