import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const CONFIG_PATH = process.env.CONFIG_PATH || 'config/concursos-instituicoes.json';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.4-nano';
const USAR_WEB_SEARCH = String(process.env.USAR_WEB_SEARCH || 'false').toLowerCase() === 'true';
const FORCAR_ATUALIZACAO = String(process.env.FORCAR_ATUALIZACAO || 'false').toLowerCase() === 'true';
const INSTITUICAO_ID = String(process.env.INSTITUICAO_ID || 'pmesp').trim().toLowerCase();
const LIMITE_INSTITUICOES = Number(process.env.LIMITE_INSTITUICOES || 1);
const DIAS_REVALIDACAO_COMPLETA = Number(process.env.DIAS_REVALIDACAO_COMPLETA || 14);
const MAX_PAGINAS_OFICIAIS = Number(process.env.MAX_PAGINAS_OFICIAIS || 6);
const MAX_CARACTERES_POR_PAGINA = Number(process.env.MAX_CARACTERES_POR_PAGINA || 4500);
const HOJE = new Date().toISOString().slice(0, 10);

const camposObrigatorios = [
  'instituicao_id',
  'instituicao_nome',
  'sigla',
  'uf',
  'tema',
  'status',
  'titulo',
  'resumo',
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
  'previsao',
  'site',
  'fontes',
  'ultima_pesquisa',
  'nivel_confianca',
  'precisa_revisao_humana',
  'alertas'
];

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    instituicao_id: { type: 'string' },
    instituicao_nome: { type: 'string' },
    sigla: { type: 'string' },
    uf: { type: 'string' },
    tema: { type: 'string' },
    status: { type: 'string' },
    titulo: { type: 'string' },
    resumo: { type: 'string' },
    edital: { type: 'string' },
    salario: { type: 'string' },
    vagas: { type: 'string' },
    cotas: { type: 'string' },
    idade: { type: 'string' },
    escolaridade: { type: 'string' },
    materias: { type: 'string' },
    banca: { type: 'string' },
    inscritos: { type: 'string' },
    etapas: { type: 'string' },
    cfsd: { type: 'string' },
    estagio: { type: 'string' },
    validade: { type: 'string' },
    previsao: { type: 'string' },
    site: { type: 'string' },
    fontes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          titulo: { type: 'string' },
          url: { type: 'string' },
          tipo: { type: 'string' },
          data_consulta: { type: 'string' }
        },
        required: ['titulo', 'url', 'tipo', 'data_consulta']
      }
    },
    ultima_pesquisa: { type: 'string' },
    nivel_confianca: { type: 'string' },
    precisa_revisao_humana: { type: 'boolean' },
    alertas: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: camposObrigatorios
};

function diasDesde(dataIso) {
  if (!dataIso) return Infinity;
  const data = new Date(`${dataIso}T00:00:00Z`);
  if (Number.isNaN(data.getTime())) return Infinity;
  const agora = new Date(`${HOJE}T00:00:00Z`);
  return Math.floor((agora - data) / 86400000);
}

function sha256(texto) {
  return crypto.createHash('sha256').update(texto).digest('hex');
}

function normalizarTexto(texto = '') {
  return String(texto)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function limitar(texto, limite) {
  if (!texto) return '';
  if (texto.length <= limite) return texto;
  return `${texto.slice(0, limite).trimEnd()}\n[conteúdo cortado para economia de tokens]`;
}

function escaparRegex(valor) {
  return String(valor).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function urlEhOficial(url = '', instituicao) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    return (instituicao.dominios_oficiais || []).some((dominio) => {
      const limpo = String(dominio).replace(/^www\./, '').toLowerCase();
      return hostname === limpo || hostname.endsWith(`.${limpo}`);
    });
  } catch {
    return false;
  }
}

function ehFonteOficial(url = '', instituicao) {
  return urlEhOficial(url, instituicao);
}

function extrairLinks(html, baseUrl, instituicao) {
  const links = new Set();
  const regexHref = /href=["']([^"'#]+)["']/gi;
  const termos = [
    ...(instituicao.termos_relevantes || []),
    instituicao.id,
    instituicao.sigla,
    'concurso',
    'edital',
    'inscri'
  ].filter(Boolean);
  const regexTermos = new RegExp(termos.map(escaparRegex).join('|'), 'i');
  let match;

  while ((match = regexHref.exec(html))) {
    try {
      const url = new URL(match[1], baseUrl).href;
      const texto = decodeURIComponent(url).toLowerCase();

      if (!urlEhOficial(url, instituicao)) continue;
      if (!regexTermos.test(texto)) continue;
      if (/\.(jpg|jpeg|png|gif|webp|svg|css|js|ico|zip|rar)$/i.test(texto)) continue;

      links.add(url);
    } catch {
      // ignora links quebrados
    }
  }

  return [...links];
}

async function buscarPagina(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const resposta = await fetch(url, {
      headers: {
        'User-Agent': 'UniversoSegPubBot/1.0 (+https://www.universosegpub.com.br)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5'
      },
      signal: controller.signal
    });

    const tipo = resposta.headers.get('content-type') || '';
    const bruto = await resposta.text();
    return {
      url,
      ok: resposta.ok,
      status: resposta.status,
      contentType: tipo,
      html: bruto,
      texto: normalizarTexto(bruto)
    };
  } catch (erro) {
    return {
      url,
      ok: false,
      status: 0,
      contentType: '',
      html: '',
      texto: '',
      erro: erro.message
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function coletarFontesOficiais(instituicao) {
  const paginas = [];
  const fila = [...(instituicao.fontes_base || [])];
  const visitadas = new Set();

  while (fila.length > 0 && paginas.length < MAX_PAGINAS_OFICIAIS) {
    const url = fila.shift();
    if (!url || visitadas.has(url)) continue;
    visitadas.add(url);

    const pagina = await buscarPagina(url);
    paginas.push(pagina);

    if (pagina.ok && pagina.html && paginas.length < MAX_PAGINAS_OFICIAIS) {
      const novosLinks = extrairLinks(pagina.html, url, instituicao);
      for (const link of novosLinks) {
        if (!visitadas.has(link) && fila.length < MAX_PAGINAS_OFICIAIS * 3) {
          fila.push(link);
        }
      }
    }
  }

  return paginas;
}

function resumoMonitoramento(paginas) {
  return paginas.map((pagina) => ({
    url: pagina.url,
    ok: pagina.ok,
    status: pagina.status,
    hash: sha256(normalizarTexto(pagina.texto).slice(0, 50000)),
    tamanho_texto: pagina.texto.length
  }));
}

function monitorMudou(monitorAnterior, monitorAtual) {
  if (!monitorAnterior || !Array.isArray(monitorAnterior.fontes_monitoradas)) return true;

  const anteriorPorUrl = new Map(monitorAnterior.fontes_monitoradas.map((item) => [item.url, item.hash]));

  for (const item of monitorAtual) {
    if (!anteriorPorUrl.has(item.url)) return true;
    if (anteriorPorUrl.get(item.url) !== item.hash) return true;
  }

  return false;
}

async function lerJson(caminho) {
  try {
    const bruto = await fs.readFile(caminho, 'utf8');
    return JSON.parse(bruto);
  } catch {
    return null;
  }
}

async function carregarConfig() {
  const bruto = await fs.readFile(CONFIG_PATH, 'utf8');
  const config = JSON.parse(bruto);
  if (!Array.isArray(config)) {
    throw new Error(`O arquivo ${CONFIG_PATH} precisa conter uma lista de instituições.`);
  }
  return config;
}

function selecionarInstituicoes(config) {
  if (INSTITUICAO_ID === 'todas_configuradas') {
    return [...config]
      .sort((a, b) => Number(a.prioridade || 99) - Number(b.prioridade || 99))
      .slice(0, Math.max(1, LIMITE_INSTITUICOES));
  }

  const prioridadeMatch = INSTITUICAO_ID.match(/^prioridade_(\d+)$/);
  if (prioridadeMatch) {
    const prioridade = Number(prioridadeMatch[1]);
    return config
      .filter((item) => Number(item.prioridade || 99) === prioridade)
      .sort((a, b) => String(a.id).localeCompare(String(b.id)))
      .slice(0, Math.max(1, LIMITE_INSTITUICOES));
  }

  const encontrada = config.find((item) => item.id === INSTITUICAO_ID);
  if (!encontrada) {
    throw new Error(`Instituição "${INSTITUICAO_ID}" não encontrada em ${CONFIG_PATH}.`);
  }
  return [encontrada];
}

function extrairTextoResposta(payload) {
  if (payload.output_text) return payload.output_text;

  const textos = [];
  for (const item of payload.output || []) {
    for (const conteudo of item.content || []) {
      if (typeof conteudo.text === 'string') textos.push(conteudo.text);
    }
  }

  return textos.join('\n').trim();
}


function valorEhRuim(valor) {
  const texto = String(valor == null ? '' : valor).trim().toLowerCase();
  if (!texto) return true;
  const padroesRuins = [
    'não encontrado em fonte oficial',
    'nao encontrado em fonte oficial',
    'não encontrado',
    'nao encontrado',
    'não informado',
    'nao informado',
    'dados em atualização',
    'dados em atualizacao',
    'em atualização',
    'em atualizacao',
    'não localizado',
    'nao localizado'
  ];
  return padroesRuins.some((padrao) => texto === padrao || texto.includes(padrao));
}

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

function avaliarQualidadePublicacao(dados) {
  const ruins = camposDeConteudo.filter((campo) => valorEhRuim(dados[campo]));
  const criticosRuins = camposCriticos.filter((campo) => valorEhRuim(dados[campo]));

  let score = 100;
  score -= ruins.length * 6;
  score -= criticosRuins.length * 8;
  if (String(dados.nivel_confianca || '').toLowerCase() === 'baixo') score -= 15;
  if (dados.precisa_revisao_humana) score -= 5;
  score = Math.max(0, Math.min(100, score));

  const qualidade = score >= 75
    ? 'alta'
    : score >= 55
      ? 'media'
      : 'baixa';

  return {
    score,
    qualidade,
    ruins,
    criticosRuins,
    podePublicar: qualidade !== 'baixa' && criticosRuins.length <= 2
  };
}

function mesclarComDadosAtuais(dadosGerados, dadosAtuais) {
  const base = dadosAtuais && typeof dadosAtuais === 'object' ? dadosAtuais : {};
  const mesclado = { ...dadosGerados };
  const alertas = new Set([...(Array.isArray(dadosGerados.alertas) ? dadosGerados.alertas : [])]);

  for (const campo of camposDeConteudo) {
    const novoRuim = valorEhRuim(dadosGerados[campo]);
    const atualBom = !valorEhRuim(base[campo]);

    if (novoRuim && atualBom) {
      mesclado[campo] = base[campo];
      alertas.add(`Campo ${campo} mantido da versão anterior porque a atualização automática não encontrou confirmação suficiente.`);
    }
  }

  if ((!Array.isArray(mesclado.fontes) || mesclado.fontes.length === 0) && Array.isArray(base.fontes)) {
    mesclado.fontes = base.fontes;
    alertas.add('Fontes mantidas da versão anterior porque a atualização automática não encontrou nova fonte publicável.');
  }

  if (valorEhRuim(mesclado.site) && !valorEhRuim(base.site)) {
    mesclado.site = base.site;
  }

  mesclado.alertas = [...alertas];
  return mesclado;
}

async function salvarRascunhoBloqueado(instituicao, dados, paginasColetadas, payload, motivo) {
  const pastaRascunhos = 'data/concursos/_rascunhos';
  await fs.mkdir(pastaRascunhos, { recursive: true });
  await fs.writeFile(
    `${pastaRascunhos}/${instituicao.id}.json`,
    `${JSON.stringify({
      gerado_em: HOJE,
      instituicao_id: instituicao.id,
      motivo_bloqueio: motivo,
      dados
    }, null, 2)}\n`,
    'utf8'
  );

  await fs.writeFile(
    instituicao.arquivo_monitoramento,
    `${JSON.stringify({
      atualizado_em: HOJE,
      instituicao_id: instituicao.id,
      modelo: OPENAI_MODEL,
      usou_openai: true,
      usou_web_search_openai: USAR_WEB_SEARCH,
      publicacao_bloqueada: true,
      motivo,
      usage: payload?.usage || null,
      fontes_monitoradas: resumoMonitoramento(paginasColetadas)
    }, null, 2)}\n`,
    'utf8'
  );
}

function validarDados(dados, instituicao) {
  for (const campo of camposObrigatorios) {
    if (!(campo in dados)) {
      throw new Error(`JSON gerado para ${instituicao.id} sem o campo obrigatório: ${campo}`);
    }
  }

  if (!Array.isArray(dados.fontes)) {
    throw new Error(`O campo fontes precisa ser uma lista em ${instituicao.id}.`);
  }

  if (!Array.isArray(dados.alertas)) {
    throw new Error(`O campo alertas precisa ser uma lista em ${instituicao.id}.`);
  }

  if (!dados.fontes.some((fonte) => ehFonteOficial(fonte.url, instituicao))) {
    dados.alertas.push('Nenhuma fonte oficial reconhecida foi encontrada automaticamente. Revisão humana obrigatória.');
    dados.precisa_revisao_humana = true;
    dados.nivel_confianca = 'baixo';
  }

  dados.instituicao_id = instituicao.id;
  dados.instituicao_nome = instituicao.nome;
  dados.sigla = instituicao.sigla;
  dados.uf = instituicao.uf;
  dados.tema = 'concursos';
  dados.site = dados.site || instituicao.site_principal || '';
  dados.ultima_pesquisa = dados.ultima_pesquisa || HOJE;

  return dados;
}

async function chamarOpenAI({ instituicao, jsonAtual, paginasColetadas, houveMudanca, forcarAtualizacao }) {
  if (!OPENAI_API_KEY) {
    throw new Error('Defina o segredo OPENAI_API_KEY no GitHub antes de rodar a automação com IA.');
  }

  const conteudoFontes = paginasColetadas
    .filter((pagina) => pagina.ok && pagina.texto)
    .map((pagina, index) => {
      return `FONTE ${index + 1}\nURL: ${pagina.url}\nSTATUS HTTP: ${pagina.status}\nTEXTO EXTRAÍDO:\n${limitar(pagina.texto, MAX_CARACTERES_POR_PAGINA)}`;
    })
    .join('\n\n---\n\n');

  const prompt = `
Você está atualizando o portal Universo Seg Pub.

Tarefa única:
Atualizar APENAS o tema Concursos da instituição abaixo com base nas fontes oficiais fornecidas.

Instituição:
- Nome: ${instituicao.nome}
- Sigla: ${instituicao.sigla}
- ID: ${instituicao.id}
- UF: ${instituicao.uf}
- Tema: concursos

Data da pesquisa: ${HOJE}

Regras rígidas:
- Use prioritariamente o texto das fontes oficiais fornecidas no prompt.
- Não invente edital, salário, vagas, datas, banca, requisitos ou etapas.
- Se uma informação não estiver nas fontes fornecidas, mas já existir nos dados atualmente publicados, MANTENHA o valor atualmente publicado e adicione alerta de revisão.
- Só escreva literalmente: "não encontrado em fonte oficial" quando não houver informação nem nas fontes fornecidas nem nos dados atualmente publicados.
- Diferencie concurso aberto, em andamento, encerrado e previsto.
- Para o campo "previsao", não prometa novo edital sem fonte oficial.
- Mantenha respostas curtas por campo, pois o objetivo é economizar custo e publicar em card do site.
- Não substitua conteúdo útil já publicado por "não encontrado em fonte oficial".
- Não cite blogs, cursinhos, agregadores de concurso ou sites comerciais.
- O JSON precisa continuar compatível com ${instituicao.arquivo_saida}.
- Mantenha instituicao_id exatamente como "${instituicao.id}".
- Mantenha instituicao_nome exatamente como "${instituicao.nome}".
- Mantenha sigla exatamente como "${instituicao.sigla}".
- Mantenha uf exatamente como "${instituicao.uf}".

Dados atualmente publicados, para comparação:
${JSON.stringify(jsonAtual, null, 2)}

Fontes oficiais coletadas automaticamente:
${conteudoFontes || 'Nenhuma fonte oficial pôde ser coletada automaticamente.'}

Atualize os campos do JSON somente quando houver base nas fontes oficiais. Retorne somente JSON válido, sem markdown, sem comentários e sem texto fora do JSON.
`;

  const body = {
    model: OPENAI_MODEL,
    input: [
      {
        role: 'system',
        content: 'Você é um pesquisador rigoroso de concursos públicos de segurança pública no Brasil. Você prioriza fontes oficiais, não inventa dados e devolve somente JSON válido quando solicitado.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'concurso_instituicao',
        strict: true,
        schema
      }
    }
  };

  if (USAR_WEB_SEARCH) {
    body.tools = [{ type: 'web_search', search_context_size: 'low' }];
  }

  const resposta = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Erro na API OpenAI para ${instituicao.id}: HTTP ${resposta.status} - ${erro}`);
  }

  const payload = await resposta.json();
  const texto = extrairTextoResposta(payload);

  if (!texto) {
    throw new Error(`A OpenAI não retornou texto/JSON para ${instituicao.id}.`);
  }

  let dadosGerados;
  try {
    dadosGerados = JSON.parse(texto);
  } catch {
    throw new Error(`A resposta não veio como JSON válido para ${instituicao.id}. Resposta recebida: ${texto}`);
  }

  const dadosValidados = validarDados(dadosGerados, instituicao);
  const dadosMesclados = mesclarComDadosAtuais(dadosValidados, jsonAtual);
  const avaliacao = avaliarQualidadePublicacao(dadosMesclados);

  dadosMesclados.qualidade_publicacao = avaliacao.qualidade;
  dadosMesclados.score_publicacao = avaliacao.score;
  dadosMesclados.bloquear_publicacao = !avaliacao.podePublicar;

  if (!avaliacao.podePublicar) {
    const motivo = `Atualização bloqueada: qualidade ${avaliacao.qualidade}, score ${avaliacao.score}, campos críticos sem confirmação: ${avaliacao.criticosRuins.join(', ') || 'nenhum'}.`;
    dadosMesclados.precisa_revisao_humana = true;
    dadosMesclados.alertas = Array.from(new Set([...(dadosMesclados.alertas || []), motivo]));
    await salvarRascunhoBloqueado(instituicao, dadosMesclados, paginasColetadas, payload, motivo);
    console.warn(`⚠️ ${instituicao.sigla}: ${motivo}`);
    console.warn(`⚠️ ${instituicao.sigla}: JSON principal NÃO foi sobrescrito. Rascunho salvo em data/concursos/_rascunhos/${instituicao.id}.json`);
    return;
  }

  await fs.mkdir(instituicao.arquivo_saida.split('/').slice(0, -1).join('/'), { recursive: true });
  await fs.writeFile(instituicao.arquivo_saida, `${JSON.stringify(dadosMesclados, null, 2)}\n`, 'utf8');
  await fs.writeFile(
    instituicao.arquivo_monitoramento,
    `${JSON.stringify({
      atualizado_em: HOJE,
      instituicao_id: instituicao.id,
      modelo: OPENAI_MODEL,
      usou_openai: true,
      usou_web_search_openai: USAR_WEB_SEARCH,
      publicacao_bloqueada: false,
      qualidade_publicacao: avaliacao.qualidade,
      score_publicacao: avaliacao.score,
      motivo: forcarAtualizacao
        ? 'Atualização forçada manualmente.'
        : houveMudanca
          ? 'Mudança detectada nas fontes oficiais monitoradas.'
          : 'Revalidação completa por prazo.',
      usage: payload.usage || null,
      fontes_monitoradas: resumoMonitoramento(paginasColetadas)
    }, null, 2)}\n`,
    'utf8'
  );

  console.log(`✅ ${instituicao.sigla}: arquivo atualizado com sucesso em ${instituicao.arquivo_saida}`);
  console.log(`   Última pesquisa: ${dadosMesclados.ultima_pesquisa}`);
  console.log(`   Nível de confiança: ${dadosMesclados.nivel_confianca}`);
  console.log(`   Qualidade publicação: ${avaliacao.qualidade} (${avaliacao.score}/100)`);
  console.log(`   Precisa revisão humana: ${dadosMesclados.precisa_revisao_humana ? 'sim' : 'não'}`);

  if (payload.usage) {
    console.log(`   Uso OpenAI ${instituicao.id}: ${JSON.stringify(payload.usage)}`);
  }
}

async function processarInstituicao(instituicao) {
  console.log('\n============================================================');
  console.log(`Instituição: ${instituicao.sigla} (${instituicao.id})`);
  console.log(`Arquivo: ${instituicao.arquivo_saida}`);
  console.log('============================================================');

  await fs.mkdir('data/concursos', { recursive: true });

  const jsonAtual = await lerJson(instituicao.arquivo_saida);
  const monitorAnterior = await lerJson(instituicao.arquivo_monitoramento);
  const paginasColetadas = await coletarFontesOficiais(instituicao);
  const monitorAtual = resumoMonitoramento(paginasColetadas);
  const houveMudanca = monitorMudou(monitorAnterior, monitorAtual);
  const diasDesdeUltimaPesquisa = diasDesde(jsonAtual?.ultima_pesquisa);
  const precisaRevalidarPorTempo = diasDesdeUltimaPesquisa >= DIAS_REVALIDACAO_COMPLETA;

  console.log(`Modelo configurado: ${OPENAI_MODEL}`);
  console.log(`Web search da OpenAI: ${USAR_WEB_SEARCH ? 'ligado' : 'desligado'}`);
  console.log(`Forçar atualização: ${FORCAR_ATUALIZACAO ? 'sim' : 'não'}`);
  console.log(`Fontes oficiais coletadas: ${paginasColetadas.length}`);
  console.log(`Houve mudança nas fontes monitoradas: ${houveMudanca ? 'sim' : 'não'}`);
  console.log(`Dias desde a última pesquisa completa: ${diasDesdeUltimaPesquisa}`);

  if (!FORCAR_ATUALIZACAO && !houveMudanca && !precisaRevalidarPorTempo) {
    console.log(`✅ ${instituicao.sigla}: nenhuma mudança relevante. OpenAI não foi chamada. Custo na API: US$ 0,00.`);
    return;
  }

  const fontesComTexto = paginasColetadas.filter((pagina) => pagina.ok && pagina.texto && pagina.texto.length > 300);
  if (fontesComTexto.length === 0 && jsonAtual) {
    console.warn(`⚠️ ${instituicao.sigla}: nenhuma fonte oficial com texto suficiente foi coletada. OpenAI não foi chamada e o JSON publicado foi preservado.`);
    await fs.writeFile(
      instituicao.arquivo_monitoramento,
      `${JSON.stringify({
        atualizado_em: HOJE,
        instituicao_id: instituicao.id,
        usou_openai: false,
        publicacao_bloqueada: true,
        motivo: 'Nenhuma fonte oficial com texto suficiente foi coletada; conteúdo publicado preservado.',
        fontes_monitoradas: monitorAtual
      }, null, 2)}\n`,
      'utf8'
    );
    return;
  }

  await chamarOpenAI({
    instituicao,
    jsonAtual,
    paginasColetadas,
    houveMudanca,
    forcarAtualizacao: FORCAR_ATUALIZACAO
  });
}

const config = await carregarConfig();
const instituicoes = selecionarInstituicoes(config);

console.log('Motor genérico de concursos iniciado.');
console.log(`Instituição selecionada: ${INSTITUICAO_ID}`);
console.log(`Total a processar nesta execução: ${instituicoes.length}`);
console.log(`Limite configurado: ${LIMITE_INSTITUICOES}`);

for (const instituicao of instituicoes) {
  await processarInstituicao(instituicao);
}

console.log('\nExecução finalizada.');
