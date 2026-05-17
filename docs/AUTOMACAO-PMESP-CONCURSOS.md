# Automação piloto — PMESP / Concursos

Esta automação atualiza o arquivo:

```text
data/concursos/pmesp.json
```

A página `concursos.html` já lê esse arquivo por meio de:

```text
js/pages/concursos-automacao-pmesp.js
```

## Como ativar

1. Abra o repositório no GitHub.
2. Vá em **Settings → Secrets and variables → Actions**.
3. Em **Repository secrets**, crie o segredo:

```text
OPENAI_API_KEY
```

4. Cole sua chave da OpenAI nesse segredo.
5. Vá na aba **Actions**.
6. Abra o workflow **Atualizar PMESP - Concursos**.
7. Clique em **Run workflow**.

## Quando roda automaticamente

O workflow está configurado para rodar:

```text
segunda, quarta e sexta às 07h00 de Brasília
```

O GitHub Actions usa horário UTC, por isso o cron está como:

```text
0 10 * * 1,3,5
```

## O que ele faz

1. Pesquisa dados atuais sobre concursos da PMESP.
2. Prioriza fontes oficiais.
3. Gera JSON estruturado.
4. Atualiza `data/concursos/pmesp.json`.
5. Faz commit automático no repositório.
6. O site passa a exibir os novos dados quando publicado.

## Arquivos criados nesta etapa

```text
.github/workflows/atualizar-pmesp-concursos.yml
scripts/atualizar-pmesp-concursos.mjs
docs/AUTOMACAO-PMESP-CONCURSOS.md
```
