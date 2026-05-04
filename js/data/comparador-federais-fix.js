(function corrigirComparadorCarreirasFederais() {
  const FEDERAIS = [
    { inst: 'pf', sigla: 'PF', nome: 'Polícia Federal', ramo: 'Polícia Federal', ordem: 1 },
    { inst: 'prf', sigla: 'PRF', nome: 'Polícia Rodoviária Federal', ramo: 'Rodoviária Federal', ordem: 2 }
  ];

  const PF_REMUNERACAO_2026 = [
    ['Delegado de Polícia Federal / Perito Criminal Federal — Categoria Especial', 41350.00],
    ['Delegado de Polícia Federal / Perito Criminal Federal — Primeira Categoria', 35377.35],
    ['Delegado de Polícia Federal / Perito Criminal Federal — Segunda Categoria', 30869.46],
    ['Delegado de Polícia Federal / Perito Criminal Federal — Terceira Categoria', 27831.70],
    ['Agente, Escrivão e Papiloscopista PF — Classe Especial', 25250.00],
    ['Agente, Escrivão e Papiloscopista PF — 1ª Classe', 19617.37],
    ['Agente, Escrivão e Papiloscopista PF — 2ª Classe', 16761.16],
    ['Agente, Escrivão e Papiloscopista PF — 3ª Classe', 14710.10]
  ];

  function escapeHtml(valor) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(valor);
    return String(valor ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function isFederal(inst) {
    return inst === 'pf' || inst === 'prf';
  }

  function getInstituicoesValidasArray() {
    if (typeof INSTITUICOES_VALIDAS !== 'undefined' && Array.isArray(INSTITUICOES_VALIDAS)) return INSTITUICOES_VALIDAS;
    if (Array.isArray(window.INSTITUICOES_VALIDAS)) return window.INSTITUICOES_VALIDAS;
    return [];
  }

  function instValidaNoComparador(inst) {
    return isFederal(inst) || getInstituicoesValidasArray().includes(inst);
  }

  function ensureFederaisBasicos() {
    if (typeof HEADER_INSTITUICOES_INFO !== 'undefined') {
      HEADER_INSTITUICOES_INFO.pf = HEADER_INSTITUICOES_INFO.pf || { titulo: 'PF', desc: 'Polícia Federal' };
      HEADER_INSTITUICOES_INFO.prf = HEADER_INSTITUICOES_INFO.prf || { titulo: 'PRF', desc: 'Polícia Rodoviária Federal' };
    }

    if (typeof HEADER_ESTADOS !== 'undefined') {
      HEADER_ESTADOS.federal = Object.assign({
        nome: 'União',
        sigla: 'BR',
        pf: 'pf',
        prf: 'prf',
        flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Brazil.svg'
      }, HEADER_ESTADOS.federal || {});
    }

    const validas = getInstituicoesValidasArray();
    if (validas.length) {
      FEDERAIS.forEach(({ inst }) => {
        if (!validas.includes(inst)) validas.push(inst);
      });
    }

    if (typeof REMUNERACAO_FONTES_OFICIAIS !== 'undefined') {
      REMUNERACAO_FONTES_OFICIAIS.pf = {
        nome: 'Lei nº 14.875/2024, Anexo XXVI — subsídio dos cargos da carreira de Policial Federal com vigência financeira em 01/05/2026',
        url: 'https://www.planalto.gov.br/ccivil_03/_Ato2023-2026/2024/Lei/Anexo/L14875-24-anexos.pdf'
      };
      REMUNERACAO_FONTES_OFICIAIS.prf = REMUNERACAO_FONTES_OFICIAIS.prf || {
        nome: 'Lei nº 14.875/2024, Anexo XXVII — subsídio PRF com vigência financeira em 01/05/2026',
        url: 'https://www.planalto.gov.br/ccivil_03/_Ato2023-2026/2024/Lei/Anexo/L14875-24-anexos.pdf'
      };
    }

    if (typeof REMUNERACAO_SP_OFICIAL !== 'undefined') {
      REMUNERACAO_SP_OFICIAL.pf = PF_REMUNERACAO_2026.map(([cargo, valor]) => ({
        cargo,
        nome: cargo,
        text: cargo,
        val: cargo,
        remuneracao: valor,
        beneficios: 0,
        total: valor,
        criterio: 'Subsídio bruto mensal da carreira de Policial Federal. Vigência financeira: 01/05/2026. Fonte: Lei nº 14.875/2024, Anexo XXVI.',
        benefDesc: 'Benefícios e indenizações federais não somados: auxílio-alimentação federal, assistência à saúde suplementar, assistência pré-escolar quando devida, diárias e indenizações conforme missão, lotação e legislação federal.',
        fonteKey: 'pf',
        badge: 'Lei 14.875/2024',
        valorPendente: false
      }));
    }

    if (typeof CONCURSOS !== 'undefined') {
      CONCURSOS.pf = CONCURSOS.pf || {
        edital: 'Polícia Federal — concurso de referência',
        salario: 'R$ 14.710,10 a R$ 41.350,00 · tabela federal 2026 conforme cargo/classe',
        vagas: 'Conforme edital vigente/publicado',
        cotas: 'Reserva legal conforme edital e legislação federal',
        idade: 'Sem idade máxima geral específica; exige requisitos legais do cargo',
        escolaridade: 'Nível superior, conforme cargo',
        banca: 'Conforme edital',
        inscritos: 'Dados em breve',
        materias: 'Conforme edital do cargo',
        etapas: 'Provas objetiva e discursiva, exames/avaliações, investigação social e curso de formação, conforme edital',
        cfsd: 'Curso de Formação Profissional na Academia Nacional de Polícia',
        estagio: 'Estágio probatório conforme regime federal',
        validade: 'Conforme edital',
        previsao: 'Conforme autorização federal e edital publicado',
        site: 'https://www.gov.br/pf/pt-br'
      };
    }
  }

  function getEstadoComparadorFederalFix(inst) {
    if (isFederal(inst)) return 'federal';
    if (typeof getEstadoDaInstituicao === 'function') return getEstadoDaInstituicao(inst);
    return '';
  }

  function getRamoComparadorFederalFix(inst) {
    const federal = FEDERAIS.find((item) => item.inst === inst);
    if (federal) return federal.ramo;
    if (typeof window.getRamoComparadorOriginalFederalFix === 'function') return window.getRamoComparadorOriginalFederalFix(inst);
    if (String(inst || '').startsWith('bm')) return 'Bombeiro Militar';
    if (String(inst || '').startsWith('pp')) return 'Penal';
    if (String(inst || '').startsWith('pc')) return 'Civil';
    if (String(inst || '').startsWith('pm')) return inst === 'pmrs' ? 'Militar / Brigada' : 'Militar';
    return 'Carreira';
  }

  function getInstituicoesComparadorFederalFix() {
    ensureFederaisBasicos();
    const listaBase = getInstituicoesValidasArray().slice();
    FEDERAIS.forEach(({ inst }) => {
      if (!listaBase.includes(inst)) listaBase.push(inst);
    });

    return listaBase
      .filter((inst, index, arr) => inst && arr.indexOf(inst) === index)
      .filter((inst) => typeof HEADER_INSTITUICOES_INFO !== 'undefined' && HEADER_INSTITUICOES_INFO[inst])
      .map((inst) => {
        const estado = getEstadoComparadorFederalFix(inst);
        const dadosEstado = isFederal(inst)
          ? { nome: 'União', sigla: 'BR' }
          : ((typeof HEADER_ESTADOS !== 'undefined' && HEADER_ESTADOS[estado]) || { nome: estado.toUpperCase(), sigla: estado.toUpperCase() });
        const info = HEADER_INSTITUICOES_INFO[inst] || {};
        return {
          inst,
          estado,
          esfera: isFederal(inst) ? 'federal' : 'estadual',
          uf: dadosEstado.sigla || 'BR',
          estadoNome: dadosEstado.nome || 'União',
          sigla: info.titulo || inst.toUpperCase(),
          nome: info.desc || inst.toUpperCase(),
          ramo: getRamoComparadorFederalFix(inst)
        };
      })
      .sort((a, b) => {
        if (a.esfera !== b.esfera) return a.esfera === 'federal' ? -1 : 1;
        const ordemFederalA = FEDERAIS.find((item) => item.inst === a.inst)?.ordem || 99;
        const ordemFederalB = FEDERAIS.find((item) => item.inst === b.inst)?.ordem || 99;
        if (a.esfera === 'federal') return ordemFederalA - ordemFederalB;
        const ordemEstados = typeof HEADER_ESTADOS !== 'undefined' ? Object.keys(HEADER_ESTADOS).filter((k) => k !== 'federal') : [];
        const estadoComp = ordemEstados.indexOf(a.estado) - ordemEstados.indexOf(b.estado);
        if (estadoComp) return estadoComp;
        if (typeof getOrdemComparador === 'function') return getOrdemComparador(a.inst) - getOrdemComparador(b.inst);
        return a.sigla.localeCompare(b.sigla);
      });
  }

  function renderizarListaComparadorFederalFix() {
    const selecao = document.getElementById('comparador-selecao');
    if (!selecao) return;
    const instituicoes = getInstituicoesComparadorFederalFix();
    const grupos = [
      { chave: 'federal', nome: 'União', itens: instituicoes.filter((item) => item.esfera === 'federal') },
      ...((typeof HEADER_ESTADOS !== 'undefined' ? Object.keys(HEADER_ESTADOS) : [])
        .filter((estado) => estado !== 'federal')
        .map((estado) => ({
          chave: estado,
          nome: HEADER_ESTADOS[estado]?.nome || estado.toUpperCase(),
          itens: instituicoes.filter((item) => item.estado === estado)
        })))
    ].filter((grupo) => grupo.itens.length);

    selecao.innerHTML = grupos.map((grupo) => `
      <div class="comparador-check-grupo" role="group" aria-label="${escapeHtml(grupo.nome)}">
        <div class="comparador-check-titulo">${escapeHtml(grupo.nome)}</div>
        ${grupo.itens.map((item) => `
          <label class="comparador-check-option">
            <input type="checkbox" value="${escapeHtml(item.inst)}" data-sigla="${escapeHtml(item.sigla)}">
            <span>
              <strong>${escapeHtml(item.sigla)}</strong>
              <small>${escapeHtml(item.nome)} · ${escapeHtml(item.uf)} · ${escapeHtml(item.ramo)}</small>
            </span>
          </label>
        `).join('')}
      </div>
    `).join('');
    selecao.dataset.renderizado = 'true';
    selecao.dataset.federaisFix = 'true';
  }

  function popularInstituicoesComparadorPorEsferaFederalFix(esfera, valorPreferido = '') {
    const seletorInst = document.getElementById('comparador-instituicao');
    if (!seletorInst) return;
    const esferaNormalizada = String(esfera || '').trim().toLowerCase();
    const itens = getInstituicoesComparadorFederalFix().filter((item) => !esferaNormalizada || item.esfera === esferaNormalizada);

    if (!esferaNormalizada) {
      seletorInst.innerHTML = '<option value="">Escolha primeiro a esfera</option>';
      seletorInst.disabled = true;
      return;
    }

    if (!itens.length) {
      seletorInst.innerHTML = '<option value="">Nenhuma instituição disponível para esta esfera</option>';
      seletorInst.disabled = true;
      return;
    }

    let html = '<option value="">Escolha a instituição</option>';
    let grupoAtual = '';
    itens.forEach((item) => {
      const grupo = item.esfera === 'federal' ? 'União' : `${item.estadoNome} (${item.uf})`;
      if (grupo !== grupoAtual) {
        if (grupoAtual) html += '</optgroup>';
        html += `<optgroup label="${escapeHtml(grupo)}">`;
        grupoAtual = grupo;
      }
      const texto = item.esfera === 'federal' ? `${item.sigla} — ${item.nome}` : `${item.sigla} — ${item.ramo}`;
      html += `<option value="${escapeHtml(item.inst)}">${escapeHtml(texto)}</option>`;
    });
    if (grupoAtual) html += '</optgroup>';

    seletorInst.disabled = false;
    seletorInst.innerHTML = html;
    seletorInst.value = valorPreferido && itens.some((item) => item.inst === valorPreferido) ? valorPreferido : '';
  }

  function getDadosComparadorFederalFix(inst) {
    const info = (typeof HEADER_INSTITUICOES_INFO !== 'undefined' && HEADER_INSTITUICOES_INFO[inst]) || {};
    const estado = getEstadoComparadorFederalFix(inst);
    const dadosEstado = isFederal(inst)
      ? { nome: 'União', sigla: 'BR' }
      : ((typeof HEADER_ESTADOS !== 'undefined' && HEADER_ESTADOS[estado]) || { nome: estado.toUpperCase(), sigla: estado.toUpperCase() });
    const concurso = typeof getConcursoComparador === 'function' ? getConcursoComparador(inst) : {};
    const remuneracao = typeof getResumoRemuneracaoComparador === 'function'
      ? getResumoRemuneracaoComparador(inst)
      : { menor: 0, maior: 0, cargoMenor: 'Dados em breve', cargoMaior: 'Dados em breve', adicionais: 'Dados em breve', fonteUrl: '#' };

    return {
      inst,
      sigla: info.titulo || inst.toUpperCase(),
      nome: info.desc || inst.toUpperCase(),
      estado: dadosEstado.nome || 'União',
      uf: dadosEstado.sigla || 'BR',
      ramo: getRamoComparadorFederalFix(inst),
      concurso,
      remuneracao
    };
  }

  function getSelecionadasComparadorFederalFix() {
    const selecao = document.getElementById('comparador-selecao');
    const checkboxes = selecao ? Array.from(selecao.querySelectorAll('input[type="checkbox"]')) : [];
    return checkboxes
      .filter((check) => check.checked)
      .map((check) => check.value)
      .filter((inst, index, arr) => inst && arr.indexOf(inst) === index)
      .filter(instValidaNoComparador);
  }

  function inicializarComparadorCarreirasFederalFix() {
    const selecao = document.getElementById('comparador-selecao');
    if (!selecao) return;
    renderizarListaComparadorFederalFix();
    const esferaComparador = document.getElementById('comparador-esfera');
    if (esferaComparador && esferaComparador.value) popularInstituicoesComparadorPorEsferaFederalFix(esferaComparador.value);
    if (typeof carregarComparadorCarreiras === 'function') carregarComparadorCarreiras();
  }

  function comparadorSelecionarEstadoAtualFederalFix(exibirToast = true) {
    const atual = typeof currInst !== 'undefined' ? currInst : '';
    if (isFederal(atual)) {
      if (typeof setSelecionadasComparador === 'function') setSelecionadasComparador(['pf', 'prf']);
      if (typeof carregarComparadorCarreiras === 'function') carregarComparadorCarreiras();
      if (exibirToast && typeof mostrarToast === 'function') mostrarToast('Comparando carreiras federais.');
      return;
    }
    if (typeof window.comparadorSelecionarEstadoAtualOriginalFederalFix === 'function') {
      window.comparadorSelecionarEstadoAtualOriginalFederalFix(exibirToast);
    }
  }

  function instalarOverrides() {
    ensureFederaisBasicos();
    if (!window.getRamoComparadorOriginalFederalFix && typeof getRamoComparador === 'function') window.getRamoComparadorOriginalFederalFix = getRamoComparador;
    if (!window.comparadorSelecionarEstadoAtualOriginalFederalFix && typeof comparadorSelecionarEstadoAtual === 'function') window.comparadorSelecionarEstadoAtualOriginalFederalFix = comparadorSelecionarEstadoAtual;

    try { getInstituicoesComparador = getInstituicoesComparadorFederalFix; } catch (e) {}
    try { popularInstituicoesComparadorPorEsfera = popularInstituicoesComparadorPorEsferaFederalFix; } catch (e) {}
    try { getDadosComparador = getDadosComparadorFederalFix; } catch (e) {}
    try { getSelecionadasComparador = getSelecionadasComparadorFederalFix; } catch (e) {}
    try { inicializarComparadorCarreiras = inicializarComparadorCarreirasFederalFix; } catch (e) {}
    try { comparadorSelecionarEstadoAtual = comparadorSelecionarEstadoAtualFederalFix; } catch (e) {}

    window.getInstituicoesComparador = getInstituicoesComparadorFederalFix;
    window.popularInstituicoesComparadorPorEsfera = popularInstituicoesComparadorPorEsferaFederalFix;
    window.getDadosComparador = getDadosComparadorFederalFix;
    window.getSelecionadasComparador = getSelecionadasComparadorFederalFix;
    window.inicializarComparadorCarreiras = inicializarComparadorCarreirasFederalFix;
    window.comparadorSelecionarEstadoAtual = comparadorSelecionarEstadoAtualFederalFix;
  }

  function aplicar() {
    instalarOverrides();
    if (document.getElementById('comparador-selecao')) inicializarComparadorCarreirasFederalFix();
  }

  aplicar();
  document.addEventListener('DOMContentLoaded', aplicar, { once: true });
  document.addEventListener('change', (event) => {
    if (event.target && /^(comparador-esfera|comparador-instituicao|comparador-selecao)$/.test(event.target.id || '')) {
      window.setTimeout(aplicar, 40);
      window.setTimeout(() => { if (typeof carregarComparadorCarreiras === 'function') carregarComparadorCarreiras(); }, 120);
    }
  }, true);
  window.setTimeout(aplicar, 250);
  window.setTimeout(aplicar, 900);
  window.setTimeout(aplicar, 1800);
}());
