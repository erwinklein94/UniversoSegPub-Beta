# Relatório de qualidade — Concursos

Gerado em: **2026-05-17**

Total de instituições avaliadas: **47**
Precisam de modo qualificado: **5**
Precisam de revisão: **2**
OK: **40**

## Fila de ações

| Ação | ID | Sigla | Prioridade | Score | Motivos | Workflow sugerido |
|---|---:|---:|---:|---:|---|---|
| rodar_qualificado | `pmmg` | PMMG | alta | 87 | fonte direta falhou ou não trouxe texto suficiente; foi publicado por modo qualificado; recomenda revisão visual | instituicao=pmmg; modo=qualificado; web=true; forcar=true |
| rodar_qualificado | `bmms` | CBMMS | media | 29 | score muito baixo (29); campos críticos genéricos: salario, escolaridade, etapas; muitos campos genéricos: salario, cotas, idade, escolaridade, materias, etapas; foi publicado por modo qualificado; recomenda revisão visual | instituicao=bmms; modo=qualificado; web=true; forcar=true |
| rodar_qualificado | `ppms` | PPMS | media | 70 | score abaixo do mínimo (70); campos críticos genéricos: vagas, banca | instituicao=ppms; modo=qualificado; web=true; forcar=true |
| rodar_qualificado | `pmsc` | PMSC | media | 75 | fonte direta falhou ou não trouxe texto suficiente; existe rascunho gerado para revisão; score abaixo do mínimo (75); foi publicado por modo qualificado; recomenda revisão visual | instituicao=pmsc; modo=qualificado; web=true; forcar=true |
| rodar_qualificado | `ppmt` | PPMT | media | 77 | score abaixo do mínimo (77); campos críticos genéricos: vagas, banca | instituicao=ppmt; modo=qualificado; web=true; forcar=true |
| revisar_ou_rodar_qualificado | `pmes` | PMES | baixa | 69 | score abaixo do mínimo (69); muitos campos genéricos: cotas, idade, materias, inscritos, etapas, validade |  |
| revisar_ou_rodar_qualificado | `bmmt` | CBMMT | baixa | 75 | score abaixo do mínimo (75) |  |
| ok | `pcap` | PCAP | baixa | 79 | sem ação necessária |  |
| ok | `pcms` | PCMS | baixa | 79 | sem ação necessária |  |
| ok | `bmrj` | CBMERJ | baixa | 82 | sem ação necessária |  |
| ok | `pcam` | PCAM | baixa | 82 | sem ação necessária |  |
| ok | `pmap` | PMAP | baixa | 82 | sem ação necessária |  |
| ok | `pmesp` | PMESP | baixa | 82 | sem ação necessária |  |
| ok | `pces` | PCES | baixa | 84 | sem ação necessária |  |
| ok | `pcrs` | PCRS | baixa | 84 | sem ação necessária |  |
| ok | `bmpr` | CBMPR | baixa | 85 | sem ação necessária |  |
| ok | `pmal` | PMAL | baixa | 85 | sem ação necessária |  |
| ok | `pmam` | PMAM | baixa | 85 | sem ação necessária |  |
| ok | `pmrs` | PMRS | baixa | 85 | sem ação necessária |  |
| ok | `prf` | PRF | baixa | 85 | sem ação necessária |  |
| ok | `bmap` | CBMAP | baixa | 87 | sem ação necessária |  |
| ok | `pcmg` | PCMG | baixa | 87 | sem ação necessária |  |
| ok | `pcmt` | PCMT | baixa | 87 | sem ação necessária |  |
| ok | `pcsc` | PCSC | baixa | 87 | sem ação necessária |  |
| ok | `pcsp` | PCSP | baixa | 87 | sem ação necessária |  |
| ok | `pmms` | PMMS | baixa | 87 | sem ação necessária |  |
| ok | `pmmt` | PMMT | baixa | 87 | sem ação necessária |  |
| ok | `ppmg` | PPMG | baixa | 87 | sem ação necessária |  |
| ok | `ppsp` | PPSP | baixa | 87 | sem ação necessária |  |
| ok | `bmsc` | CBMSC | baixa | 90 | sem ação necessária |  |
| ok | `bmsp` | CBPMESP | baixa | 90 | sem ação necessária |  |
| ok | `pcce` | PCCE | baixa | 90 | sem ação necessária |  |
| ok | `pmac` | PMAC | baixa | 90 | sem ação necessária |  |
| ok | `pmba` | PMBA | baixa | 90 | sem ação necessária |  |
| ok | `pmerj` | PMERJ | baixa | 90 | sem ação necessária |  |
| ok | `pmpr` | PMPR | baixa | 90 | sem ação necessária |  |
| ok | `ppac` | PPAC | baixa | 90 | sem ação necessária |  |
| ok | `ppal` | PPAL | baixa | 90 | sem ação necessária |  |
| ok | `bmes` | CBMES | baixa | 93 | sem ação necessária |  |
| ok | `bmmg` | CBMMG | baixa | 93 | sem ação necessária |  |
| ok | `pcac` | PCAC | baixa | 93 | sem ação necessária |  |
| ok | `pcal` | PCAL | baixa | 93 | sem ação necessária |  |
| ok | `pcba` | PCBA | baixa | 93 | sem ação necessária |  |
| ok | `pcdf` | PCDF | baixa | 93 | sem ação necessária |  |
| ok | `pcerj` | PCERJ | baixa | 93 | sem ação necessária |  |
| ok | `pcpr` | PCPR | baixa | 93 | sem ação necessária |  |
| ok | `pf` | PF | baixa | 93 | sem ação necessária |  |

## Como usar

Para as instituições marcadas como `rodar_qualificado`, use no GitHub Actions:

```text
forcar_atualizacao: true
usar_web_search: true
modo_qualidade: qualificado
limite: 1
```

Para as marcadas como `rodar_economico`, use:

```text
forcar_atualizacao: false
usar_web_search: false
modo_qualidade: economico
limite: 1
```

