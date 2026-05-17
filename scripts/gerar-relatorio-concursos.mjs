import fs from 'node:fs/promises';
import path from 'node:path';

const CONFIG_PATH = process.env.CONFIG_PATH || 'config/concursos-instituicoes.json';
const DATA_DIR = process.env.DATA_DIR || 'data/concursos';
const HOJE = new Date().toISOString().slice(0, 10);
const SCORE_MINIMO_QUALIFICADO = Number(process.env.SCORE_MINIMO_QUALIFICADO || 78);
const DIAS_ALERTA_DESATUALIZADO = Number(process.env.DIAS_ALERTA_DESATUALIZADO || 30);
const DIAS_ALERTA_MUITO_DESATUALIZADO = Number(process.env.DIAS_ALERTA_MUITO_DESATUALIZADO || 60);

const camposDeConteudo = [
  'edital',
  'salario',
  'vagas',
  'cotas',
  'idade',
  'escolaridade',
  'materias',
  'banca',
  'inscritos',
  'etapas',
  'cfsd',
  'estagio',
  'validade',
  'previsao'
];

const camposCriticos = ['edital', 'salario', 'vagas', 'escolaridade', 'banca', 'etapas'];

async function lerJson(caminho, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(caminho, 'utf8'));
  } catch {
    return fallback;
  }
}

function normalizar(valor) {
  return String(valor == null ? '' : valor)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function valorRuim(valor) {
  const texto = normalizar(valor);
  if (!texto) return true;
  const padroes = [
    'nao encontrado em fonte oficial',
    'nao encontrado',
    'nao informado',
    'dados em atualizacao',
    'em atualizacao',
    'sem informacao',
    'sem dados',
    'indisponivel',
    'nao localizado'
  ];
  return padroes.some((padrao) => texto === padrao || texto.includes(padrao));
}

function valorConcreto(valor) {
  const original = String(valor == null ? '' : valor).trim();
  const texto = normalizar(original);
  if (!texto || valorRuim(original)) return false;

  const padroes = [
    /r\$\s?\d/i,
    /\b\d{1,4}([\.,]\d{3})*\s*(vagas?|cargos?|convocados?|nomeacoes?|inscritos?)\b/i,
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
    /\b20\d{2}\b/,
    /\b(cebraspe|vunesp|fgv|ibfc|iades|idecan|fcc|fepese|acafe|cesgranrio|aocp|idib|consulplan|fundatec)\b/i,
    /\b(soldado|oficial|delegado|investigador|escriv[aã]o|perito|agente|papiloscopista|inspetor|policial penal|bombeiro|tempor[aá]rio)\b/i,
    /\b(ensino m[eé]dio|n[ií]vel m[eé]dio|n[ií]vel superior|bacharelado|gradua[cç][aã]o|cnh|direito|medicina)\b/i
  ];

  return padroes.some((regex) => regex.test(original));
}

function valorGenerico(valor) {
  const texto = normalizar(valor);
  if (!texto || valorRuim(valor)) return true;

  const padroes = [
    'conferir edital',
    'consultar edital',
    'conforme edital',
    'edital especifico',
    'acompanhar a pagina',
    'acompanhar o site',
    'varia conforme',
    'podem variar',
    'depende do concurso',
    'depende do cargo',
    'quando previsto',
    'quando aplicavel',
    'demais etapas',
    'informacoes completas',
    'pagina oficial',
    'banca organizadora',
    'edital vigente',
    'atos oficiais',
    'deve ser conferido'
  ];

  const contem = padroes.some((padrao) => texto.includes(padrao));
  return contem && !valorConcreto(valor);
}

function diasDesde(dataIso) {
  if (!dataIso) return Infinity;
  const data = new Date(`${dataIso}T00:00:00Z`);
  if (Number.isNaN(data.getTime())) return Infinity;
  const hoje = new Date(`${HOJE}T00:00:00Z`);
  return Math.floor((hoje - data) / 86400000);
}

function avaliar(dados) {
  if (!dados) {
    return {
      score: 0,
      qualidade: 'sem_json',
      ruins: camposDeConteudo,
      genericos: camposDeConteudo,
      concretos: [],
      criticosRuins: camposCriticos,
      criticosGenericos: camposCriticos,
      criticosConcretos: []
    };
  }

  const ruins = camposDeConteudo.filter((campo) => valorRuim(dados[campo]));
  const genericos = camposDeConteudo.filter((campo) => !valorRuim(dados[campo]) && valorGenerico(dados[campo]));
  const concretos = camposDeConteudo.filter((campo) => valorConcreto(dados[campo]));
  const criticosRuins = camposCriticos.filter((campo) => valorRuim(dados[campo]));
  const criticosGenericos = camposCriticos.filter((campo) => !valorRuim(dados[campo]) && valorGenerico(dados[campo]));
  const criticosConcretos = camposCriticos.filter((campo) => valorConcreto(dados[campo]));

  let score = 100;
  score -= ruins.length * 7;
  score -= genericos.length * 5;
  score -= criticosRuins.length * 10;
  score -= criticosGenericos.length * 8;
  if (criticosConcretos.length < 3) score -= 12;
  if (concretos.length < 6) score -= 8;
  if (!Array.isArray(dados.fontes) || dados.fontes.length === 0) score -= 12;
  if (normalizar(dados.nivel_confianca) === 'baixo') score -= 8;
  if (dados.precisa_revisao_humana) score -= 2;

  const scoreDoJson = Number(dados.score_publicacao);
  if (Number.isFinite(scoreDoJson)) {
    // Mistura avaliação original do motor com avaliação independente do relatório.
    score = Math.round((score * 0.65) + (scoreDoJson * 0.35));
  }

  score = Math.max(0, Math.min(100, score));

  const qualidade = score >= 82 ? 'alta' : score >= SCORE_MINIMO_QUALIFICADO ? 'media' : 'baixa';

  return {
    score,
    qualidade,
    ruins,
    genericos,
    concretos,
    criticosRuins,
    criticosGenericos,
    criticosConcretos
  };
}

function fonteFalhou(monitor) {
  if (!monitor) return false;
  if (monitor.publicacao_bloqueada && /fonte|texto suficiente|preservado/i.test(String(monitor.motivo || ''))) return true;
  const fontes = Array.isArray(monitor.fontes_monitoradas) ? monitor.fontes_monitoradas : [];
  if (fontes.length === 0) return false;
  const nenhumaOk = fontes.every((f) => !f.ok || Number(f.tamanho_texto || 0) < 300);
  return nenhumaOk;
}

function rascunhoExiste(id) {
  return fs.access(path.join(DATA_DIR, '_rascunhos', `${id}.json`)).then(() => true).catch(() => false);
}

function escolherAcao({ item, dados, monitor, avaliacao, temRascunho, idadeDias }) {
  const motivos = [];

  if (!dados) {
    return { acao: 'criar_json_inicial', prioridade_operacional: 'alta', motivos: ['arquivo JSON principal não encontrado'] };
  }

  if (fonteFalhou(monitor)) motivos.push('fonte direta falhou ou não trouxe texto suficiente');
  if (temRascunho) motivos.push('existe rascunho gerado para revisão');
  if (avaliacao.score < 65) motivos.push(`score muito baixo (${avaliacao.score})`);
  if (avaliacao.score >= 65 && avaliacao.score < SCORE_MINIMO_QUALIFICADO) motivos.push(`score abaixo do mínimo (${avaliacao.score})`);
  if (avaliacao.criticosRuins.length > 0) motivos.push(`campos críticos sem dado: ${avaliacao.criticosRuins.join(', ')}`);
  if (avaliacao.criticosGenericos.length >= 2) motivos.push(`campos críticos genéricos: ${avaliacao.criticosGenericos.join(', ')}`);
  if (avaliacao.genericos.length >= 5) motivos.push(`muitos campos genéricos: ${avaliacao.genericos.slice(0, 6).join(', ')}`);
  if (idadeDias >= DIAS_ALERTA_MUITO_DESATUALIZADO) motivos.push(`muito desatualizado: ${idadeDias} dias`);
  else if (idadeDias >= DIAS_ALERTA_DESATUALIZADO) motivos.push(`desatualizado: ${idadeDias} dias`);
  if (dados.publicacao_forcada_por_credito_openai || dados.publicado_por_modo_qualificado) motivos.push('foi publicado por modo qualificado; recomenda revisão visual');

  const prioridadeConfig = Number(item.prioridade || 99);

  if (fonteFalhou(monitor) || avaliacao.score < 65 || avaliacao.criticosRuins.length > 0 || avaliacao.criticosGenericos.length >= 2) {
    return {
      acao: 'rodar_qualificado',
      prioridade_operacional: prioridadeConfig === 1 ? 'alta' : 'media',
      motivos
    };
  }

  if (temRascunho || dados.publicacao_forcada_por_credito_openai || dados.publicado_por_modo_qualificado) {
    return {
      acao: 'revisar_rascunho_ou_site',
      prioridade_operacional: prioridadeConfig === 1 ? 'alta' : 'media',
      motivos
    };
  }

  if (avaliacao.score < SCORE_MINIMO_QUALIFICADO || avaliacao.genericos.length >= 4) {
    return {
      acao: 'revisar_ou_rodar_qualificado',
      prioridade_operacional: prioridadeConfig === 1 ? 'alta' : 'baixa',
      motivos
    };
  }

  if (idadeDias >= DIAS_ALERTA_DESATUALIZADO) {
    return {
      acao: 'rodar_economico',
      prioridade_operacional: 'baixa',
      motivos
    };
  }

  return {
    acao: 'ok',
    prioridade_operacional: 'baixa',
    motivos: motivos.length ? motivos : ['sem ação necessária']
  };
}

function workflowSugerido(id, acao) {
  if (acao === 'rodar_qualificado') {
    return {
      instituicao: id,
      limite: '1',
      forcar_atualizacao: 'true',
      usar_web_search: 'true',
      modo_qualidade: 'qualificado'
    };
  }

  if (acao === 'rodar_economico') {
    return {
      instituicao: id,
      limite: '1',
      forcar_atualizacao: 'false',
      usar_web_search: 'false',
      modo_qualidade: 'economico'
    };
  }

  return null;
}

function ordenarFila(a, b) {
  const pesoAcao = {
    rodar_qualificado: 0,
    revisar_rascunho_ou_site: 1,
    revisar_ou_rodar_qualificado: 2,
    criar_json_inicial: 3,
    rodar_economico: 4,
    ok: 9
  };
  const pesoPrioridade = { alta: 0, media: 1, baixa: 2 };
  return (pesoAcao[a.acao] ?? 8) - (pesoAcao[b.acao] ?? 8)
    || (pesoPrioridade[a.prioridade_operacional] ?? 2) - (pesoPrioridade[b.prioridade_operacional] ?? 2)
    || (a.score - b.score)
    || String(a.id).localeCompare(String(b.id));
}

function mdEscape(valor) {
  return String(valor == null ? '' : valor).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function gerarMarkdown(relatorio) {
  const linhas = [];
  linhas.push(`# Relatório de qualidade — Concursos`);
  linhas.push('');
  linhas.push(`Gerado em: **${relatorio.gerado_em}**`);
  linhas.push('');
  linhas.push(`Total de instituições avaliadas: **${relatorio.resumo.total}**`);
  linhas.push(`Precisam de modo qualificado: **${relatorio.resumo.rodar_qualificado}**`);
  linhas.push(`Precisam de revisão: **${relatorio.resumo.revisar}**`);
  linhas.push(`OK: **${relatorio.resumo.ok}**`);
  linhas.push('');

  linhas.push(`## Fila de ações`);
  linhas.push('');
  linhas.push('| Ação | ID | Sigla | Prioridade | Score | Motivos | Workflow sugerido |');
  linhas.push('|---|---:|---:|---:|---:|---|---|');

  for (const item of relatorio.fila_acoes) {
    const wf = item.workflow_sugerido
      ? `instituicao=${item.workflow_sugerido.instituicao}; modo=${item.workflow_sugerido.modo_qualidade}; web=${item.workflow_sugerido.usar_web_search}; forcar=${item.workflow_sugerido.forcar_atualizacao}`
      : '';
    linhas.push(`| ${mdEscape(item.acao)} | \`${item.id}\` | ${mdEscape(item.sigla)} | ${mdEscape(item.prioridade_operacional)} | ${item.score} | ${mdEscape(item.motivos.join('; '))} | ${mdEscape(wf)} |`);
  }

  linhas.push('');
  linhas.push(`## Como usar`);
  linhas.push('');
  linhas.push('Para as instituições marcadas como `rodar_qualificado`, use no GitHub Actions:');
  linhas.push('');
  linhas.push('```text');
  linhas.push('forcar_atualizacao: true');
  linhas.push('usar_web_search: true');
  linhas.push('modo_qualidade: qualificado');
  linhas.push('limite: 1');
  linhas.push('```');
  linhas.push('');
  linhas.push('Para as marcadas como `rodar_economico`, use:');
  linhas.push('');
  linhas.push('```text');
  linhas.push('forcar_atualizacao: false');
  linhas.push('usar_web_search: false');
  linhas.push('modo_qualidade: economico');
  linhas.push('limite: 1');
  linhas.push('```');
  linhas.push('');

  return `${linhas.join('\n')}\n`;
}

function escapeHtml(valor) {
  return String(valor == null ? '' : valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function gerarHtml(relatorio) {
  const rows = relatorio.fila_acoes.map((item) => {
    const cls = item.acao === 'ok' ? 'ok' : item.acao.includes('qualificado') ? 'danger' : item.acao.includes('revisar') ? 'warn' : 'info';
    const wf = item.workflow_sugerido
      ? `instituicao: ${item.workflow_sugerido.instituicao}\nlimite: ${item.workflow_sugerido.limite}\nforcar_atualizacao: ${item.workflow_sugerido.forcar_atualizacao}\nusar_web_search: ${item.workflow_sugerido.usar_web_search}\nmodo_qualidade: ${item.workflow_sugerido.modo_qualidade}`
      : 'Sem workflow sugerido';
    return `<tr class="${cls}" data-acao="${escapeHtml(item.acao)}">
      <td>${escapeHtml(item.acao)}</td>
      <td><strong>${escapeHtml(item.sigla)}</strong><br><small>${escapeHtml(item.id)}</small></td>
      <td>${escapeHtml(item.nome)}</td>
      <td>${escapeHtml(item.prioridade_operacional)}</td>
      <td><strong>${item.score}</strong></td>
      <td>${escapeHtml(item.motivos.join('; '))}</td>
      <td><pre>${escapeHtml(wf)}</pre></td>
    </tr>`;
  }).join('\n');

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Relatório de qualidade — Concursos</title>
  <style>
    body{font-family:Arial, sans-serif;margin:0;background:#f6f7f9;color:#111827}
    header{background:#07111f;color:white;padding:28px 36px;border-bottom:4px solid #c8a400}
    main{padding:28px 36px;max-width:1400px;margin:auto}
    .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-bottom:24px}
    .card{background:white;border:1px solid #d7dce3;border-radius:12px;padding:18px;box-shadow:0 4px 18px rgba(0,0,0,.04)}
    .card span{display:block;color:#64748b;font-size:13px;margin-bottom:6px}.card strong{font-size:30px}
    .toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.toolbar button{border:1px solid #cbd5e1;background:white;border-radius:999px;padding:8px 14px;cursor:pointer}.toolbar button:hover{background:#eef2ff}
    table{width:100%;border-collapse:collapse;background:white;border:1px solid #d7dce3;border-radius:12px;overflow:hidden}
    th,td{padding:12px;border-bottom:1px solid #e5e7eb;text-align:left;vertical-align:top}th{background:#f1f5f9;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#475569}
    tr.danger{border-left:6px solid #dc2626}tr.warn{border-left:6px solid #f59e0b}tr.info{border-left:6px solid #2563eb}tr.ok{border-left:6px solid #16a34a}
    pre{margin:0;white-space:pre-wrap;font-size:12px;background:#f8fafc;padding:8px;border-radius:8px;border:1px solid #e2e8f0}
    small{color:#64748b}
  </style>
</head>
<body>
<header>
  <h1>Relatório de qualidade — Concursos</h1>
  <p>Gerado em ${escapeHtml(relatorio.gerado_em)}. Use esta fila para decidir quais instituições precisam de pesquisa qualificada.</p>
</header>
<main>
  <section class="cards">
    <div class="card"><span>Total</span><strong>${relatorio.resumo.total}</strong></div>
    <div class="card"><span>Rodar qualificado</span><strong>${relatorio.resumo.rodar_qualificado}</strong></div>
    <div class="card"><span>Revisar</span><strong>${relatorio.resumo.revisar}</strong></div>
    <div class="card"><span>OK</span><strong>${relatorio.resumo.ok}</strong></div>
  </section>
  <div class="toolbar">
    <button onclick="filtrar('')">Todos</button>
    <button onclick="filtrar('rodar_qualificado')">Rodar qualificado</button>
    <button onclick="filtrar('revisar_rascunho_ou_site')">Revisar</button>
    <button onclick="filtrar('ok')">OK</button>
  </div>
  <table>
    <thead><tr><th>Ação</th><th>Instituição</th><th>Nome</th><th>Prioridade</th><th>Score</th><th>Motivos</th><th>Workflow sugerido</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</main>
<script>
function filtrar(acao){document.querySelectorAll('tbody tr').forEach(tr=>{tr.style.display=!acao||tr.dataset.acao===acao?'':'none'})}
</script>
</body>
</html>`;
}

async function main() {
  const config = await lerJson(CONFIG_PATH, []);
  if (!Array.isArray(config) || config.length === 0) {
    throw new Error(`Configuração não encontrada ou vazia: ${CONFIG_PATH}`);
  }

  const avaliados = [];

  for (const item of config) {
    const id = item.id;
    const dados = await lerJson(item.arquivo_saida || path.join(DATA_DIR, `${id}.json`));
    const monitor = await lerJson(item.arquivo_monitoramento || path.join(DATA_DIR, `${id}-monitor.json`));
    const temRascunho = await rascunhoExiste(id);
    const avaliacao = avaliar(dados);
    const idadeDias = dados ? diasDesde(dados.ultima_pesquisa) : Infinity;
    const decisao = escolherAcao({ item, dados, monitor, avaliacao, temRascunho, idadeDias });

    avaliados.push({
      id,
      sigla: item.sigla || dados?.sigla || id.toUpperCase(),
      nome: item.nome || dados?.instituicao_nome || id,
      uf: item.uf || dados?.uf || '',
      prioridade_config: Number(item.prioridade || 99),
      score: avaliacao.score,
      qualidade: avaliacao.qualidade,
      acao: decisao.acao,
      prioridade_operacional: decisao.prioridade_operacional,
      motivos: decisao.motivos,
      workflow_sugerido: workflowSugerido(id, decisao.acao),
      idade_dias: Number.isFinite(idadeDias) ? idadeDias : null,
      campos_ruins: avaliacao.ruins,
      campos_genericos: avaliacao.genericos,
      campos_concretos: avaliacao.concretos,
      campos_criticos_ruins: avaliacao.criticosRuins,
      campos_criticos_genericos: avaliacao.criticosGenericos,
      fonte_falhou: fonteFalhou(monitor),
      tem_rascunho: temRascunho,
      publicado_por_modo_qualificado: Boolean(dados?.publicado_por_modo_qualificado),
      publicacao_forcada_por_credito_openai: Boolean(dados?.publicacao_forcada_por_credito_openai),
      ultima_pesquisa: dados?.ultima_pesquisa || null,
      monitor: monitor ? {
        atualizado_em: monitor.atualizado_em || null,
        usou_openai: Boolean(monitor.usou_openai),
        usou_web_search_openai: Boolean(monitor.usou_web_search_openai),
        publicacao_bloqueada: Boolean(monitor.publicacao_bloqueada),
        motivo: monitor.motivo || null
      } : null
    });
  }

  const fila = [...avaliados].sort(ordenarFila);
  const relatorio = {
    gerado_em: HOJE,
    criterios: {
      score_minimo_qualificado: SCORE_MINIMO_QUALIFICADO,
      dias_alerta_desatualizado: DIAS_ALERTA_DESATUALIZADO,
      dias_alerta_muito_desatualizado: DIAS_ALERTA_MUITO_DESATUALIZADO,
      campos_criticos: camposCriticos
    },
    resumo: {
      total: avaliados.length,
      rodar_qualificado: avaliados.filter((i) => i.acao === 'rodar_qualificado').length,
      revisar: avaliados.filter((i) => i.acao === 'revisar_rascunho_ou_site' || i.acao === 'revisar_ou_rodar_qualificado').length,
      rodar_economico: avaliados.filter((i) => i.acao === 'rodar_economico').length,
      ok: avaliados.filter((i) => i.acao === 'ok').length,
      fonte_falhou: avaliados.filter((i) => i.fonte_falhou).length,
      com_rascunho: avaliados.filter((i) => i.tem_rascunho).length
    },
    fila_acoes: fila,
    grupos: {
      rodar_qualificado: fila.filter((i) => i.acao === 'rodar_qualificado'),
      revisar: fila.filter((i) => i.acao === 'revisar_rascunho_ou_site' || i.acao === 'revisar_ou_rodar_qualificado'),
      rodar_economico: fila.filter((i) => i.acao === 'rodar_economico'),
      ok: fila.filter((i) => i.acao === 'ok')
    }
  };

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir('docs', { recursive: true });

  await fs.writeFile(path.join(DATA_DIR, '_relatorio-qualidade.json'), `${JSON.stringify(relatorio, null, 2)}\n`, 'utf8');
  await fs.writeFile('docs/RELATORIO-CONCURSOS.md', gerarMarkdown(relatorio), 'utf8');
  await fs.writeFile('relatorio-concursos.html', gerarHtml(relatorio), 'utf8');

  console.log(`Relatório gerado em ${DATA_DIR}/_relatorio-qualidade.json`);
  console.log(`Rodar qualificado: ${relatorio.resumo.rodar_qualificado}`);
  console.log(`Revisar: ${relatorio.resumo.revisar}`);
  console.log(`OK: ${relatorio.resumo.ok}`);
}

await main();
