import fs from 'node:fs/promises';

const ARQUIVO_DESTINO = 'data/concursos/pmesp.json';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.5';
const HOJE = new Date().toISOString().slice(0, 10);

if (!OPENAI_API_KEY) {
  throw new Error('Defina o segredo OPENAI_API_KEY no GitHub antes de rodar a automação.');
}

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

function ehFonteOficial(url = '') {
  const texto = String(url).toLowerCase();
  return [
    'concursos.policiamilitar.sp.gov.br',
    'policiamilitar.sp.gov.br',
    'vunesp.com.br',
    'doe.sp.gov.br',
    'imprensaoficial.com.br',
    'saopaulo.sp.gov.br'
  ].some((dominio) => texto.includes(dominio));
}

function validarDados(dados) {
  for (const campo of camposObrigatorios) {
    if (!(campo in dados)) {
      throw new Error(`JSON gerado sem o campo obrigatório: ${campo}`);
    }
  }

  if (dados.instituicao_id !== 'pmesp') {
    throw new Error('O campo instituicao_id precisa ser exatamente "pmesp".');
  }

  if (!Array.isArray(dados.fontes)) {
    throw new Error('O campo fontes precisa ser uma lista.');
  }

  if (!Array.isArray(dados.alertas)) {
    throw new Error('O campo alertas precisa ser uma lista.');
  }

  if (!dados.fontes.some((fonte) => ehFonteOficial(fonte.url))) {
    dados.alertas.push('Nenhuma fonte oficial reconhecida foi encontrada automaticamente. Revisão humana obrigatória.');
    dados.precisa_revisao_humana = true;
    dados.nivel_confianca = 'baixo';
  }

  dados.instituicao_id = 'pmesp';
  dados.instituicao_nome = 'Polícia Militar do Estado de São Paulo';
  dados.sigla = 'PMESP';
  dados.uf = 'SP';
  dados.tema = 'concursos';
  dados.ultima_pesquisa = dados.ultima_pesquisa || HOJE;

  return dados;
}

async function lerJsonAtual() {
  try {
    const bruto = await fs.readFile(ARQUIVO_DESTINO, 'utf8');
    return JSON.parse(bruto);
  } catch {
    return null;
  }
}

const jsonAtual = await lerJsonAtual();

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

const prompt = `
Você está atualizando o portal Universo Seg Pub.

Tarefa única:
Pesquisar e atualizar APENAS o tema Concursos da PMESP.

Instituição:
- Polícia Militar do Estado de São Paulo
- Sigla: PMESP
- UF: SP
- Tema: concursos

Data da pesquisa: ${HOJE}

Fontes prioritárias obrigatórias:
1. Portal oficial de concursos da PMESP: https://concursos.policiamilitar.sp.gov.br
2. Fundação Vunesp: https://www.vunesp.com.br
3. Diário Oficial do Estado de São Paulo
4. Governo do Estado de São Paulo
5. Site oficial da Polícia Militar do Estado de São Paulo

Regras rígidas:
- Priorize fontes oficiais.
- Não use blogs, cursinhos, agregadores de concurso ou sites comerciais como fonte final.
- Se usar algum site não oficial como pista, confirme a informação em fonte oficial antes de escrever.
- Não invente edital, salário, vagas, datas, banca, requisitos ou etapas.
- Se uma informação não for encontrada em fonte oficial, escreva literalmente: "não encontrado em fonte oficial".
- Diferencie concurso aberto, concurso em andamento, concurso encerrado e concurso previsto.
- Para o campo "previsao", não prometa novo edital sem fonte oficial.
- O texto precisa ser útil para o visitante leigo do site.
- O JSON deve ser compatível com o arquivo data/concursos/pmesp.json do site.

Dados atualmente publicados, para comparação:
${JSON.stringify(jsonAtual, null, 2)}

Atualize todos os campos do JSON conforme a pesquisa atual.
Retorne somente JSON válido, sem markdown, sem comentários e sem texto fora do JSON.
`;

const resposta = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: OPENAI_MODEL,
    tools: [{ type: 'web_search' }],
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
        name: 'pmesp_concursos',
        strict: true,
        schema
      }
    }
  })
});

if (!resposta.ok) {
  const erro = await resposta.text();
  throw new Error(`Erro na API OpenAI: HTTP ${resposta.status} - ${erro}`);
}

const payload = await resposta.json();
const texto = extrairTextoResposta(payload);

if (!texto) {
  throw new Error('A OpenAI não retornou texto/JSON na resposta.');
}

let dadosGerados;
try {
  dadosGerados = JSON.parse(texto);
} catch (erro) {
  throw new Error(`A resposta não veio como JSON válido. Resposta recebida: ${texto}`);
}

const dadosValidados = validarDados(dadosGerados);

await fs.mkdir('data/concursos', { recursive: true });
await fs.writeFile(ARQUIVO_DESTINO, `${JSON.stringify(dadosValidados, null, 2)}\n`, 'utf8');

console.log(`Arquivo atualizado com sucesso: ${ARQUIVO_DESTINO}`);
console.log(`Última pesquisa: ${dadosValidados.ultima_pesquisa}`);
console.log(`Nível de confiança: ${dadosValidados.nivel_confianca}`);
console.log(`Precisa revisão humana: ${dadosValidados.precisa_revisao_humana ? 'sim' : 'não'}`);
