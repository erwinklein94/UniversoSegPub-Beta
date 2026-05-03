/* Chunk gerado a partir de js/script-original.js — Concursos, comparador de carreiras, ações judiciais e associações.
   Mantém a ordem original para preservar compatibilidade. */

/* === CONCURSOS (RICO) ======================================= */
/* ============================================================ */
/* BLOCO 15.12 — Renderização das páginas de concursos, ações e associações */

const TEXTO_DADOS_EM_BREVE = 'Dados em breve';

function valorOuDadosEmBreve(valor) {
  if (typeof normalizarTextoSemFonteSegura === 'function') return normalizarTextoSemFonteSegura(valor);
  const texto = String(valor ?? '').trim();
  if (!texto || texto === '#' || /(?:a preencher|preencher|a confirmar|a definir|consultar|conferir|sem informação|sem informacao|pendente|estrutura criada|estrutura aberta|espaço reservado|reservado para|não afirmar|nao afirmar)/i.test(texto)) return TEXTO_DADOS_EM_BREVE;
  return texto;
}

function ehDadosEmBreve(valor) {
  return valorOuDadosEmBreve(valor) === TEXTO_DADOS_EM_BREVE;
}

function itemUnicoDadosEmBreve(classe = 'acao') {
  return `<div class="direito-item ${classe}"><span class="direito-nome">${TEXTO_DADOS_EM_BREVE}</span></div>`;
}

function urlPublicaValida(valor) {
  return /^https?:\/\//i.test(String(valor || '').trim());
}

function getConcursoPoliciaPenal(inst) {
  if (!isPoliciaPenal(inst)) return null;
  const info = getInfoPoliciaPenal(inst);
  const dados = {
    edital: `${info.sigla} — ${info.nome}`,
    salario: valorOuDadosEmBreve(info.concurso?.salario || info.remuneracao),
    vagas: valorOuDadosEmBreve(info.concurso?.vagas),
    cotas: TEXTO_DADOS_EM_BREVE,
    idade: TEXTO_DADOS_EM_BREVE,
    escolaridade: valorOuDadosEmBreve(info.concurso?.escolaridade || info.escolaridade),
    materias: TEXTO_DADOS_EM_BREVE,
    banca: valorOuDadosEmBreve(info.concurso?.banca),
    inscritos: TEXTO_DADOS_EM_BREVE,
    etapas: TEXTO_DADOS_EM_BREVE,
    cfsd: valorOuDadosEmBreve(info.formacao),
    estagio: TEXTO_DADOS_EM_BREVE,
    validade: TEXTO_DADOS_EM_BREVE,
    previsao: TEXTO_DADOS_EM_BREVE,
    site: urlPublicaValida(info.url) ? info.url : (REMUNERACAO_FONTES_OFICIAIS[inst]?.url || '#')
  };
  return typeof concursoNormalizarObjeto === 'function' ? concursoNormalizarObjeto(inst, dados) : dados;
}

function getAcoesPoliciaPenal(inst) {
  if (!isPoliciaPenal(inst)) return [];
  return [
    { titulo: TEXTO_DADOS_EM_BREVE, status: TEXTO_DADOS_EM_BREVE, ano: TEXTO_DADOS_EM_BREVE, tipo: 'individual', desc: TEXTO_DADOS_EM_BREVE, base: TEXTO_DADOS_EM_BREVE, fonte: TEXTO_DADOS_EM_BREVE, fonteUrl: '', atualizado: TEXTO_DADOS_EM_BREVE }
  ];
}

function getAssociacoesPoliciaPenal(inst) {
  if (!isPoliciaPenal(inst)) return [];
  return [
    { nome: TEXTO_DADOS_EM_BREVE, foco: TEXTO_DADOS_EM_BREVE, acao: TEXTO_DADOS_EM_BREVE, site: '', telefone: TEXTO_DADOS_EM_BREVE, mensalidade: TEXTO_DADOS_EM_BREVE, servicos: TEXTO_DADOS_EM_BREVE }
  ];
}


/* ============================================================ */
/* === COMPARADOR DE CARREIRAS ================================ */
/* ============================================================ */
/* BLOCO 15.14.1 — Comparar remuneração, benefícios, concursos e fontes entre instituições */
function getRamoComparador(inst) {
  inst = String(inst || '');
  if (inst === 'pf') return 'Federal';
  if (inst === 'prf') return 'Rodoviária Federal';
  if (inst.startsWith('bm')) return 'Bombeiro Militar';
  if (inst.startsWith('pp')) return 'Penal';
  if (inst.startsWith('pc')) return 'Civil';
  if (inst.startsWith('pm')) return inst === 'pmrs' ? 'Militar / Brigada' : 'Militar';
  return 'Carreira';
}

function getOrdemComparador(inst) {
  const estado = getEstadoDaInstituicao(inst);
  const dadosEstado = HEADER_ESTADOS[estado] || {};
  if (dadosEstado.pm === inst) return 1;
  if (dadosEstado.bm === inst) return 2;
  if (dadosEstado.pc === inst) return 3;
  if (dadosEstado.pp === inst) return 4;
  if (dadosEstado.pf === inst) return 1;
  if (dadosEstado.prf === inst) return 2;
  return 9;
}

function getInstituicoesComparador() {
  return INSTITUICOES_VALIDAS
    .filter(inst => HEADER_INSTITUICOES_INFO[inst])
    .map(inst => {
      const estado = getEstadoDaInstituicao(inst);
      const dadosEstado = HEADER_ESTADOS[estado] || HEADER_ESTADOS.sp;
      const info = HEADER_INSTITUICOES_INFO[inst] || {};
      return {
        inst,
        estado,
        uf: dadosEstado.sigla || estado.toUpperCase(),
        estadoNome: dadosEstado.nome || estado.toUpperCase(),
        sigla: info.titulo || inst.toUpperCase(),
        nome: info.desc || inst.toUpperCase(),
        ramo: getRamoComparador(inst)
      };
    })
    .sort((a, b) => {
      const estadoComp = Object.keys(HEADER_ESTADOS).indexOf(a.estado) - Object.keys(HEADER_ESTADOS).indexOf(b.estado);
      return estadoComp || getOrdemComparador(a.inst) - getOrdemComparador(b.inst);
    });
}

function inicializarComparadorCarreiras() {
  const selecao = document.getElementById('comparador-selecao');
  if (!selecao) return;

  if (!selecao.dataset.renderizado) {
    renderizarSeletoresComparador(selecao);
    selecao.dataset.renderizado = 'true';
  }

  if (!getSelecionadasComparador().length) comparadorSelecionarEstadoAtual(false);
  sincronizarOpcoesComparador();
  carregarComparadorCarreiras();
}

const COMPARADOR_MIN_CARREIRAS = 2;
const COMPARADOR_MAX_CARREIRAS = 4;

function getComparadorSelect() {
  return document.getElementById('comparador-selecao');
}

function getComparadorSelects() {
  const selecao = getComparadorSelect();
  return selecao ? Array.from(selecao.querySelectorAll('select[data-comparador-select]')) : [];
}

function getComparadorCheckboxes() {
  return [];
}

function montarOptionsComparador(valorAtual = '', placeholder = 'Selecione uma carreira') {
  const instituicoes = getInstituicoesComparador();
  const ordemEstados = Object.keys(HEADER_ESTADOS);
  const selectedAttr = !valorAtual ? ' selected' : '';
  const grupos = ordemEstados.map(estado => {
    const dadosEstado = HEADER_ESTADOS[estado] || {};
    const itens = instituicoes.filter(item => item.estado === estado);
    if (!itens.length) return '';
    const opcoes = itens.map(item => {
      const selected = item.inst === valorAtual ? ' selected' : '';
      const label = `${item.sigla} — ${item.uf} — ${item.ramo}`;
      return `<option value="${escapeHtml(item.inst)}" data-sigla="${escapeHtml(item.sigla)}"${selected}>${escapeHtml(label)}</option>`;
    }).join('');
    return `<optgroup label="${escapeHtml(dadosEstado.nome || estado.toUpperCase())}">${opcoes}</optgroup>`;
  }).join('');
  return `<option value=""${selectedAttr}>${escapeHtml(placeholder)}</option>${grupos}`;
}

function renderizarSeletoresComparador(selecao) {
  const placeholders = [
    'Selecione a 1ª carreira',
    'Selecione a 2ª carreira',
    '3ª carreira opcional',
    '4ª carreira opcional'
  ];
  const labels = [
    'Carreira 1',
    'Carreira 2',
    'Carreira 3',
    'Carreira 4'
  ];
  selecao.innerHTML = labels.map((label, index) => `
    <div class="comparador-select-campo">
      <label for="comparador-carreira-${index + 1}">
        ${escapeHtml(label)} ${index < COMPARADOR_MIN_CARREIRAS ? '<span>obrigatória</span>' : '<span>opcional</span>'}
      </label>
      <select id="comparador-carreira-${index + 1}" data-comparador-select="${index + 1}" aria-label="${escapeHtml(label)}">
        ${montarOptionsComparador('', placeholders[index])}
      </select>
    </div>
  `).join('');
}

function getValoresComparador() {
  const valores = [];
  getComparadorSelects().forEach(select => {
    const valor = String(select.value || '').trim();
    if (valor && !valores.includes(valor)) valores.push(valor);
  });
  return valores.slice(0, COMPARADOR_MAX_CARREIRAS);
}

function setSelecionadasComparador(valores) {
  const selects = getComparadorSelects();
  const lista = Array.from(new Set((valores || []).filter(Boolean))).slice(0, COMPARADOR_MAX_CARREIRAS);
  selects.forEach((select, index) => {
    select.value = lista[index] || '';
  });
  sincronizarOpcoesComparador();
}

function sincronizarOpcoesComparador() {
  const selects = getComparadorSelects();
  const selecionadas = selects.map(select => select.value).filter(Boolean);
  selects.forEach(select => {
    Array.from(select.options).forEach(option => {
      if (!option.value) {
        option.disabled = false;
        return;
      }
      option.disabled = selecionadas.includes(option.value) && option.value !== select.value;
    });
  });
  atualizarResumoSelecaoComparador();
}

function comparadorSelectAlterado(event) {
  const alvo = event?.target;
  const selects = getComparadorSelects();
  if (alvo && alvo.value) {
    const repetido = selects.some(select => select !== alvo && select.value === alvo.value);
    if (repetido) {
      alvo.value = '';
      if (typeof mostrarToast === 'function') mostrarToast('Essa carreira já foi selecionada. Escolha outra opção.');
    }
  }
  sincronizarOpcoesComparador();
  carregarComparadorCarreiras();
}

function toggleComparadorLista() {
  return;
}

function atualizarResumoSelecaoComparador() {
  const resumoSelecao = document.getElementById('comparador-selecionadas');
  const contador = document.getElementById('comparador-contador-selecao');
  if (!resumoSelecao) return;

  const selects = getComparadorSelects();
  const selecionadas = selects
    .filter(select => select.value)
    .map(select => {
      const option = select.selectedOptions && select.selectedOptions[0];
      return option?.dataset?.sigla || option?.textContent || select.value.toUpperCase();
    })
    .filter(Boolean);

  if (contador) contador.textContent = `${selecionadas.length}/${COMPARADOR_MAX_CARREIRAS} selecionadas`;

  if (!selecionadas.length) {
    resumoSelecao.innerHTML = `Selecione pelo menos ${COMPARADOR_MIN_CARREIRAS} carreiras para comparar.`;
    return;
  }

  const faltam = Math.max(0, COMPARADOR_MIN_CARREIRAS - selecionadas.length);
  const complemento = faltam ? ` <span>Falta ${faltam} carreira${faltam === 1 ? '' : 's'} para liberar a comparação.</span>` : '';
  resumoSelecao.innerHTML = `<strong>Selecionadas (${selecionadas.length}/${COMPARADOR_MAX_CARREIRAS}):</strong> ${escapeHtml(selecionadas.join(', '))}${complemento}`;
}

function comparadorSelecionarEstadoAtual(exibirToast = true) {
  const estadoAtivo = getEstadoDaInstituicao(currInst);
  const dadosEstado = HEADER_ESTADOS[estadoAtivo] || HEADER_ESTADOS.sp;
  const valores = [dadosEstado.pm, dadosEstado.bm, dadosEstado.pc, dadosEstado.pp, dadosEstado.pf, dadosEstado.prf]
    .filter(Boolean)
    .slice(0, COMPARADOR_MAX_CARREIRAS);
  setSelecionadasComparador(valores);
  carregarComparadorCarreiras();
  if (exibirToast) mostrarToast(`Comparando até ${COMPARADOR_MAX_CARREIRAS} carreiras de ${dadosEstado.nome}.`);
}

function comparadorSelecionarTodas() {
  const valores = getInstituicoesComparador().map(item => item.inst).slice(0, COMPARADOR_MAX_CARREIRAS);
  setSelecionadasComparador(valores);
  carregarComparadorCarreiras();
  mostrarToast(`Limite aplicado: máximo de ${COMPARADOR_MAX_CARREIRAS} carreiras por comparação.`);
}

function comparadorLimparSelecao() {
  setSelecionadasComparador([]);
  carregarComparadorCarreiras();
}

function getSelecionadasComparador() {
  return getValoresComparador();
}

function getConcursoComparador(inst) {
  if (CONCURSOS[inst]) return CONCURSOS[inst];
  const penal = getConcursoPoliciaPenal(inst);
  if (penal) return typeof concursoNormalizarObjeto === 'function' ? concursoNormalizarObjeto(inst, penal) : penal;
  const dados = {
    edital: HEADER_INSTITUICOES_INFO[inst]?.titulo || inst.toUpperCase(),
    salario: 'Dados em breve',
    vagas: 'Dados em breve',
    cotas: 'Dados em breve',
    idade: 'Dados em breve',
    inscritos: 'Dados em breve',
    banca: 'Dados em breve',
    materias: 'Dados em breve',
    previsao: 'Dados em breve',
    escolaridade: 'Dados em breve',
    etapas: 'Dados em breve',
    cfsd: 'Dados em breve',
    estagio: 'Dados em breve',
    validade: 'Dados em breve',
    site: REMUNERACAO_FONTES_OFICIAIS[inst]?.url || '#'
  };
  return typeof concursoNormalizarObjeto === 'function' ? concursoNormalizarObjeto(inst, dados) : dados;
}

function limitarTextoComparador(texto, limite = 220) {
  texto = String(texto || '').replace(/\s+/g, ' ').trim();
  return texto.length > limite ? texto.slice(0, limite - 1).trim() + '…' : texto;
}

function getResumoRemuneracaoComparador(inst) {
  const linhas = gerarRemuneracaoTabelada(inst) || [];
  const validas = linhas.filter(l => Number(l.remuneracao || 0) > 0);
  const menor = validas.length ? Math.min(...validas.map(l => Number(l.remuneracao || 0))) : 0;
  const maior = validas.length ? Math.max(...validas.map(l => Number(l.remuneracao || 0))) : 0;
  const linhaMenor = validas.find(l => Number(l.remuneracao || 0) === menor) || linhas[0] || {};
  const linhaMaior = validas.find(l => Number(l.remuneracao || 0) === maior) || linhas[0] || {};
  const fonte = REMUNERACAO_FONTES_OFICIAIS[linhaMenor.fonteKey] || REMUNERACAO_FONTES_OFICIAIS[inst] || { nome: 'Dados em breve', url: '#' };
  const adicionais = getAdicionaisRemuneracaoResumo(inst, linhaMenor);
  return {
    totalCargos: linhas.length,
    menor,
    maior,
    cargoMenor: linhaMenor.cargo || 'Dados em breve',
    cargoMaior: linhaMaior.cargo || 'Dados em breve',
    adicionais,
    fonteNome: fonte.nome || 'Dados em breve',
    fonteUrl: fonte.url || '#'
  };
}

function getDadosComparador(inst) {
  const info = HEADER_INSTITUICOES_INFO[inst] || {};
  const estado = getEstadoDaInstituicao(inst);
  const dadosEstado = HEADER_ESTADOS[estado] || HEADER_ESTADOS.sp;
  const concurso = getConcursoComparador(inst);
  const remuneracao = getResumoRemuneracaoComparador(inst);
  return {
    inst,
    sigla: info.titulo || inst.toUpperCase(),
    nome: info.desc || inst.toUpperCase(),
    estado: dadosEstado.nome || estado.toUpperCase(),
    uf: dadosEstado.sigla || estado.toUpperCase(),
    ramo: getRamoComparador(inst),
    concurso,
    remuneracao
  };
}

function getSelecionadasComparador() {
  return getComparadorCheckboxes()
    .filter(check => check.checked)
    .map(check => check.value)
    .filter(inst => INSTITUICOES_VALIDAS.includes(inst));
}

function linkComparador(url, texto = 'Abrir fonte') {
  if (!url || url === '#') return '<span>Dados em breve</span>';
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(texto)}</a>`;
}

function carregarComparadorCarreiras() {
  const tbody = document.getElementById('comparador-tabela');
  const cards = document.getElementById('comparador-cards');
  const resumo = document.getElementById('comparador-resumo');
  const wrap = document.getElementById('comparador-tabela-wrap');
  if (!tbody || !cards || !resumo || !wrap) return;

  atualizarResumoSelecaoComparador();
  const selecionadas = getSelecionadasComparador();
  if (selecionadas.length < 2) {
    resumo.innerHTML = '';
    tbody.innerHTML = '';
    cards.innerHTML = '<div class="comparador-vazio">Selecione pelo menos duas carreiras para gerar o comparativo. O limite é de quatro carreiras por comparação.</div>';
    wrap.style.display = 'none';
    return;
  }

  wrap.style.display = '';
  const dados = selecionadas.map(getDadosComparador);

  const menores = dados.map(d => d.remuneracao.menor).filter(v => v > 0);
  const maiores = dados.map(d => d.remuneracao.maior).filter(v => v > 0);
  const melhorInicial = dados
    .filter(d => d.remuneracao.menor > 0)
    .sort((a, b) => b.remuneracao.menor - a.remuneracao.menor)[0];
  const melhorTopo = dados
    .filter(d => d.remuneracao.maior > 0)
    .sort((a, b) => b.remuneracao.maior - a.remuneracao.maior)[0];

  resumo.innerHTML = `
    <div class="comparador-stat">
      <span>Instituições comparadas</span>
      <strong>${dados.length}</strong>
    </div>
    <div class="comparador-stat">
      <span>Menor remuneração encontrada</span>
      <strong>${menores.length ? fmt(Math.min(...menores)) : 'Dados em breve'}</strong>
    </div>
    <div class="comparador-stat">
      <span>Maior remuneração encontrada</span>
      <strong>${maiores.length ? fmt(Math.max(...maiores)) : 'Dados em breve'}</strong>
    </div>
    <div class="comparador-stat">
      <span>Destaques</span>
      <strong>${melhorInicial ? escapeHtml(melhorInicial.sigla) + ' menor base' : 'Sem base'} · ${melhorTopo ? escapeHtml(melhorTopo.sigla) + ' topo' : 'Sem topo'}</strong>
    </div>
  `;

  tbody.innerHTML = dados.map(d => {
    const c = d.concurso;
    const r = d.remuneracao;
    return `
      <tr>
        <td>
          <strong>${escapeHtml(d.sigla)}</strong><br>
          ${escapeHtml(d.nome)}<br>
          <span class="comparador-pill">${escapeHtml(d.uf)}</span>
          <span class="comparador-pill">${escapeHtml(d.ramo)}</span>
        </td>
        <td>
          <strong>Menor:</strong> ${r.menor ? fmt(r.menor) : 'Dados em breve'}<br>
          <small>${escapeHtml(r.cargoMenor)}</small><br>
          <strong>Maior:</strong> ${r.maior ? fmt(r.maior) : 'Dados em breve'}<br>
          <small>${escapeHtml(r.cargoMaior)}</small>
        </td>
        <td>
          ${escapeHtml(limitarTextoComparador(r.adicionais, 260))}
        </td>
        <td>
          <strong>Último edital:</strong> ${escapeHtml(c.edital || 'Dados em breve')}<br>
          <strong>Salário edital:</strong> ${escapeHtml(c.salario || 'Dados em breve')}<br>
          <strong>Próximo concurso / andamento:</strong> ${escapeHtml(limitarTextoComparador(c.previsao, 180))}
        </td>
        <td>
          <strong>Vagas:</strong> ${escapeHtml(c.vagas || 'Dados em breve')}<br>
          <strong>Inscritos:</strong> ${escapeHtml(c.inscritos || 'Dados em breve')}
        </td>
        <td>
          <strong>Banca:</strong> ${escapeHtml(c.banca || 'Dados em breve')}<br>
          <strong>Matérias:</strong> ${escapeHtml(limitarTextoComparador(c.materias, 230))}
        </td>
        <td>
          ${linkComparador(c.site || r.fonteUrl, 'Concurso')}<br>
          ${linkComparador(r.fonteUrl, 'Remuneração')}
        </td>
      </tr>
    `;
  }).join('');

  cards.innerHTML = dados.map(d => {
    const c = d.concurso;
    const r = d.remuneracao;
    return `
      <article class="comparador-card">
        <h3>${escapeHtml(d.sigla)} — ${escapeHtml(d.uf)}</h3>
        <p><strong>${escapeHtml(d.nome)}</strong> · ${escapeHtml(d.ramo)}</p>
        <ul>
          <li><strong>Faixa cadastrada:</strong> ${r.menor ? fmt(r.menor) : 'Dados em breve'} até ${r.maior ? fmt(r.maior) : 'Dados em breve'}.</li>
          <li><strong>Referência inferior:</strong> ${escapeHtml(r.cargoMenor)}.</li>
          <li><strong>Último edital de referência:</strong> ${escapeHtml(c.edital || 'Dados em breve')}.</li>
          <li><strong>Vagas:</strong> ${escapeHtml(c.vagas || 'Dados em breve')}.</li>
          <li><strong>Banca:</strong> ${escapeHtml(c.banca || 'Dados em breve')}.</li>
          <li><strong>Escolaridade:</strong> ${escapeHtml(limitarTextoComparador(c.escolaridade, 180))}.</li>
          <li><strong>Etapas:</strong> ${escapeHtml(limitarTextoComparador(c.etapas, 200))}.</li>
        </ul>
        <p><strong>Vantagens/benefícios:</strong> ${escapeHtml(limitarTextoComparador(r.adicionais, 260))}</p>
        <p>${linkComparador(c.site || r.fonteUrl, 'Ver fonte do concurso')} · ${linkComparador(r.fonteUrl, 'Ver fonte remuneratória')}</p>
      </article>
    `;
  }).join('');
}


function carregarConcursos() {
  const cont = document.getElementById('lista-concursos');
  if (!cont) return;
  if (typeof instituicaoConsultaFoiSelecionada === 'function' && !instituicaoConsultaFoiSelecionada()) {
    if (typeof mostrarAvisoSelecaoInstituicao === 'function') mostrarAvisoSelecaoInstituicao('concursos');
    return;
  }
  const c = CONCURSOS[currInst] || getConcursoPoliciaPenal(currInst);
  if (!c) { cont.innerHTML = ""; return; }

  cont.innerHTML = `
    <div class="direito-item acao">
      <span class="direito-nome">${c.edital}</span>
      <span class="direito-desc"><strong>Salário inicial:</strong> ${c.salario}</span>
      <span class="direito-desc"><strong>Vagas:</strong> ${c.vagas}</span>
      <span class="direito-desc"><strong>Cotas:</strong> ${c.cotas}</span>
      <span class="direito-desc"><strong>Idade exigida:</strong> ${c.idade}</span>
      <span class="direito-desc"><strong>Escolaridade:</strong> ${c.escolaridade}</span>
      <span class="direito-desc"><strong>Banca:</strong> ${c.banca} · <strong>Inscritos no último:</strong> ${c.inscritos}</span>
      <span class="direito-desc"><strong>Disciplinas:</strong> ${c.materias}</span>
      <span class="direito-desc"><strong>Etapas do certame:</strong> ${c.etapas}</span>
      <span class="direito-desc"><strong>Curso de Formação:</strong> ${c.cfsd}</span>
      <span class="direito-desc"><strong>Estágio Probatório:</strong> ${c.estagio}</span>
      <span class="direito-desc"><strong>Validade do edital:</strong> ${c.validade}</span>
      <span class="direito-desc" style="margin-top:8px;"><strong>Próximo Edital:</strong> ${c.previsao}</span>
      ${urlPublicaValida(c.site) ? `<a href="${c.site}" target="_blank" rel="noopener noreferrer" class="concurso-link">🔗 Site oficial da instituição</a>` : `<span class="direito-desc">Dados em breve</span>`}
    </div>

    <a class="taf-produto-card" href="https://s.shopee.com.br/9fHIyi0uae" target="_blank" rel="noopener noreferrer" aria-label="Ver barra fixa para porta, produto útil para treino de TAF">
      <div class="taf-produto-imagem" aria-hidden="true">
        <img src="img/SHOPEE/barrafixa01.webp" data-img-base="img/SHOPEE/barrafixa01" alt="Detalhes da Oferta do Produto - barra fixa para porta" loading="lazy">
      </div>
      <div class="taf-produto-conteudo">
        <span class="taf-produto-selo">Produto útil para o TAF</span>
        <strong>Barra fixa para porta</strong>
        <p>Ajuda o candidato a treinar em casa um dos exercícios que mais reprovam no TAF. Com constância, a barra fortalece costas, braços, pegada e resistência, facilitando a evolução para cumprir as repetições exigidas nos testes físicos das polícias.</p>
        <span class="taf-produto-cta">Comprar</span>
      </div>
    </a>

    <a class="taf-produto-card taf-produto-card-mochilaimpermeavel50l" href="https://s.shopee.com.br/901i8h9IK5" target="_blank" rel="noopener noreferrer" aria-label="Comprar Mochila Militar Tática Impermeável 50 L Grande Reforçada c/ 2 Bandeiras Brasil/EUA, produto útil para rotina operacional e preparação">
      <div class="taf-produto-imagem" aria-hidden="true">
        <img src="img/SHOPEE/mochilaimpermeavel50l.webp" data-img-base="img/SHOPEE/mochilaimpermeavel50l" alt="Mochila Militar Tática Impermeável 50 L Grande Reforçada c/ 2 Bandeiras Brasil/EUA" loading="lazy">
      </div>
      <div class="taf-produto-conteudo">
        <span class="taf-produto-selo">Produto útil para rotina operacional</span>
        <strong>Mochila Militar Tática Impermeável 50 L Grande Reforçada c/ 2 Bandeiras Brasil/EUA</strong>
        <p>Mochila tática impermeável de 50 L, grande e reforçada, indicada para rotina operacional, estudos, viagens, treinos e organização de equipamentos. Acompanha 2 bandeiras Brasil/EUA.</p>
        <span class="taf-produto-cta">Comprar</span>
      </div>
    </a>

    <a class="taf-produto-card taf-produto-card-barrafixa02" href="https://s.shopee.com.br/9fHJ0X4HVl" target="_blank" rel="noopener noreferrer" aria-label="Ver Power Rack Funcional com paralelas, suporte de agachamento, supino, barra fixa e barra paralela, produto útil para treino de TAF">
      <div class="taf-produto-imagem" aria-hidden="true">
        <img src="img/SHOPEE/barrafixa02.webp" data-img-base="img/SHOPEE/barrafixa02" alt="Power Rack Funcional com paralelas, suporte de agachamento, supino, barra fixa e barra paralela" loading="lazy">
      </div>
      <div class="taf-produto-conteudo">
        <span class="taf-produto-selo">Produto útil para o TAF</span>
        <strong>Power Rack Funcional com barra fixa e paralelas</strong>
        <p>Por ser maior, mais estável e permitir treino completo, o power rack ajuda o candidato a evoluir com mais segurança na barra fixa, paralelas, agachamento e fortalecimento geral. É uma opção superior para quem quer passar no TAF das polícias, porque permite treinar força, pegada, costas, braços, core e resistência em um equipamento mais robusto e versátil.</p>
        <span class="taf-produto-cta">Comprar</span>
      </div>
    </a>
  `;
}

/* ============================================================ */
/* === AÇÕES JUDICIAIS ======================================== */
/* ============================================================ */
function carregarAcoes() {
  const cont = document.getElementById('lista-acoes');
  if (!cont) return;
  if (typeof instituicaoConsultaFoiSelecionada === 'function' && !instituicaoConsultaFoiSelecionada()) {
    if (typeof mostrarAvisoSelecaoInstituicao === 'function') mostrarAvisoSelecaoInstituicao('acoes');
    return;
  }
  const lista = ACOES_JUDICIAIS[currInst] || getAcoesPoliciaPenal(currInst) || [];

  if (!lista.length) {
    cont.innerHTML = itemUnicoDadosEmBreve('acao');
    return;
  }

  cont.innerHTML = lista.map(a => {
    const titulo = valorOuDadosEmBreve(a.titulo);
    const campos = [a.status, a.ano, a.desc, a.base, a.fonte, a.atualizado].map(valorOuDadosEmBreve);
    const semFonteSegura = titulo === TEXTO_DADOS_EM_BREVE || campos.every(v => v === TEXTO_DADOS_EM_BREVE);
    if (semFonteSegura) return itemUnicoDadosEmBreve('acao');

    const fonteHtml = a.fonte && a.fonte !== TEXTO_DADOS_EM_BREVE
      ? `<span class="direito-desc"><strong>Fonte de conferência:</strong> ${urlPublicaValida(a.fonteUrl) ? `<a href="${a.fonteUrl}" target="_blank" rel="noopener noreferrer" class="concurso-link">${a.fonte}</a>` : TEXTO_DADOS_EM_BREVE}</span>`
      : `<span class="direito-desc">${TEXTO_DADOS_EM_BREVE}</span>`;
    const atualizadoHtml = !ehDadosEmBreve(a.atualizado) ? `<span class="direito-desc"><strong>Última atualização:</strong> ${a.atualizado}</span>` : '';

    return `
      <div class="direito-item acao">
        <span class="direito-nome">${titulo}</span>
        <span class="direito-status" style="color: var(--vermelho);">${valorOuDadosEmBreve(a.status)}</span>
        <div>
          <span class="badge-info ${a.tipo === 'coletiva' ? 'coletiva' : 'individual'}">${a.tipo === 'coletiva' ? '⚖ Ação Coletiva' : '👤 Ação Individual'}</span>
          <span class="badge-info ativa">${valorOuDadosEmBreve(a.ano)}</span>
        </div>
        <span class="direito-desc">${valorOuDadosEmBreve(a.desc)}</span>
        <span class="direito-desc"><strong>Base legal/jurisprudência:</strong> ${valorOuDadosEmBreve(a.base)}</span>
        ${fonteHtml}
        ${atualizadoHtml}
      </div>
    `;
  }).join('');
}

/* ============================================================ */
/* === ASSOCIAÇÕES ============================================ */
/* ============================================================ */
function carregarAssociacoes() {
  const cont = document.getElementById('lista-associacoes');
  if (!cont) return;
  if (typeof instituicaoConsultaFoiSelecionada === 'function' && !instituicaoConsultaFoiSelecionada()) {
    if (typeof mostrarAvisoSelecaoInstituicao === 'function') mostrarAvisoSelecaoInstituicao('associacoes');
    return;
  }
  const lista = ASSOCIACOES[currInst] || getAssociacoesPoliciaPenal(currInst) || [];
  if (!lista.length) {
    cont.innerHTML = itemUnicoDadosEmBreve('associacao');
    return;
  }

  cont.innerHTML = lista.map(a => {
    const nome = valorOuDadosEmBreve(a.nome);
    const campos = [a.foco, a.acao, a.servicos, a.mensalidade, a.telefone, a.site].map(valorOuDadosEmBreve);
    const semFonteSegura = nome === TEXTO_DADOS_EM_BREVE || campos.every(v => v === TEXTO_DADOS_EM_BREVE);
    if (semFonteSegura) return itemUnicoDadosEmBreve('associacao');
    const contato = urlPublicaValida(a.site)
      ? `${valorOuDadosEmBreve(a.telefone)} · <a href="${a.site}" target="_blank" rel="noopener noreferrer" class="concurso-link" style="margin-top:0;">${a.site}</a>`
      : TEXTO_DADOS_EM_BREVE;
    return `
      <div class="direito-item associacao">
        <span class="direito-nome">${nome}</span>
        <span class="direito-desc"><strong>Foco:</strong> ${valorOuDadosEmBreve(a.foco)}</span>
        <span class="direito-desc"><strong>Atuação atual:</strong> ${valorOuDadosEmBreve(a.acao)}</span>
        <span class="direito-desc"><strong>Serviços:</strong> ${valorOuDadosEmBreve(a.servicos)}</span>
        <span class="direito-desc"><strong>Mensalidade:</strong> ${valorOuDadosEmBreve(a.mensalidade)}</span>
        <span class="direito-desc"><strong>Contato:</strong> ${contato}</span>
      </div>
    `;
  }).join('');
}




/* ============================================================ */
