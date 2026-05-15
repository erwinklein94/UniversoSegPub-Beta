/* Concursos — filtro e paginação visual sobre conteúdo já escrito no HTML. */
(function () {
  const CARDS_POR_PAGINA = 4;

  function qs(selector, root) { return (root || document).querySelector(selector); }
  function qsa(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
  function normalizar(valor) { return String(valor || '').trim().toLowerCase(); }

  function cards() {
    return qsa('[data-concurso-card][data-inst]');
  }

  function esconderDetalhe() {
    const detalhe = qs('#consulta-concurso-detalhado');
    if (detalhe) detalhe.hidden = true;
  }

  function mostrarDetalhe() {
    const detalhe = qs('#consulta-concurso-detalhado');
    if (detalhe) detalhe.hidden = false;
  }

  function textoSeguro(valor) {
    const texto = String(valor == null ? '' : valor);
    if (typeof escapeHtml === 'function') return escapeHtml(texto);
    return texto.replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
  }

  function urlValida(valor) {
    return /^https?:\/\//i.test(String(valor || '').trim());
  }

  function concursoFallbackHtml(inst) {
    if (typeof CONCURSOS === 'undefined' || !CONCURSOS[inst]) return '';
    const c = CONCURSOS[inst];
    const link = urlValida(c.site)
      ? `<a href="${textoSeguro(c.site)}" target="_blank" rel="noopener noreferrer" class="concurso-link">🔗 Site oficial da instituição</a>`
      : '<span class="direito-desc">Fonte oficial em breve</span>';

    return `
      <div class="direito-item acao">
        <span class="direito-nome">${textoSeguro(c.edital || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Salário inicial:</strong> ${textoSeguro(c.salario || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Vagas:</strong> ${textoSeguro(c.vagas || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Cotas:</strong> ${textoSeguro(c.cotas || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Idade exigida:</strong> ${textoSeguro(c.idade || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Escolaridade:</strong> ${textoSeguro(c.escolaridade || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Banca:</strong> ${textoSeguro(c.banca || 'Dados em breve')} · <strong>Inscritos no último:</strong> ${textoSeguro(c.inscritos || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Disciplinas:</strong> ${textoSeguro(c.materias || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Etapas do certame:</strong> ${textoSeguro(c.etapas || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Curso de Formação:</strong> ${textoSeguro(c.cfsd || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Estágio Probatório:</strong> ${textoSeguro(c.estagio || 'Dados em breve')}</span>
        <span class="direito-desc"><strong>Validade do edital:</strong> ${textoSeguro(c.validade || 'Dados em breve')}</span>
        <span class="direito-desc" style="margin-top:8px;"><strong>Próximo Edital:</strong> ${textoSeguro(c.previsao || 'Dados em breve')}</span>
        ${link}
      </div>
    `;
  }

  function atualizarOpcoesInstituicao(seletorEsfera, seletorInstituicao) {
    const esfera = normalizar(seletorEsfera?.value);
    Array.from(seletorInstituicao?.options || []).forEach(option => {
      if (!option.value) {
        option.hidden = false;
        return;
      }
      option.hidden = Boolean(esfera) && option.dataset.esfera !== esfera;
    });

    const atual = seletorInstituicao?.selectedOptions?.[0];
    if (atual && atual.hidden) seletorInstituicao.value = '';
  }

  function cardsFiltrados(seletorEsfera, seletorInstituicao) {
    const esfera = normalizar(seletorEsfera?.value);
    const inst = normalizar(seletorInstituicao?.value);
    return cards().filter(card => {
      if (esfera && card.dataset.esfera !== esfera) return false;
      if (inst && card.dataset.inst !== inst) return false;
      return true;
    });
  }

  function renderizarPaginacao(paginacao, paginaAtual, totalPaginas) {
    if (!paginacao) return;
    if (totalPaginas <= 1) {
      paginacao.hidden = true;
      paginacao.innerHTML = '';
      return;
    }

    paginacao.hidden = false;
    const botoes = [];
    botoes.push(`<button type="button" data-concursos-page="prev" ${paginaAtual === 1 ? 'disabled' : ''}>Anterior</button>`);
    for (let i = 1; i <= totalPaginas; i += 1) {
      botoes.push(`<button type="button" data-concursos-page="${i}" ${i === paginaAtual ? 'aria-current="page"' : ''}>${i}</button>`);
    }
    botoes.push(`<button type="button" data-concursos-page="next" ${paginaAtual === totalPaginas ? 'disabled' : ''}>Próxima</button>`);
    paginacao.innerHTML = botoes.join('');
  }



  const BUSCADOR_STATUS_CONCURSOS = Object.freeze({
    pmal: 'aberto',
    pmesp: 'aberto',
    bmsp: 'aberto',
    ppsp: 'aberto',
    pmmg: 'aberto',
    pmpr: 'aberto',
    bmpr: 'aberto',
    pmrs: 'aberto',
    pcrs: 'aberto',
    pcce: 'aberto',
    pcsc: 'aberto',
    bmsc: 'aberto',
    bmes: 'aberto',
    pces: 'aberto',
    pcms: 'aberto',
    bmms: 'aberto',
    ppmg: 'aberto',
    bmmg: 'aberto',
    bmrj: 'aberto',
    bmap: 'aberto',
    pcal: 'pedido',
    pcap: 'pedido',
    pcac: 'pedido',
    pcerj: 'pedido',
    pcba: 'pedido',
    pcpr: 'pedido'
  });

  const BUSCADOR_STATUS_LABELS = Object.freeze({
    aberto: 'Em aberto',
    pedido: 'Pedido de abertura'
  });

  function obterBaseConcursos() {
    return (typeof CONCURSOS !== 'undefined' && CONCURSOS) ? CONCURSOS : {};
  }

  function limitarTexto(valor, limite) {
    const texto = String(valor || 'Dados em breve').replace(/\s+/g, ' ').trim();
    if (!limite || texto.length <= limite) return texto;
    return `${texto.slice(0, limite - 1).trim()}…`;
  }

  function nomeConcurso(inst) {
    const option = qs(`#concursos_instituicao option[value="${inst}"]`);
    if (option && option.textContent.trim()) return option.textContent.trim();

    const valorCss = (window.CSS && typeof window.CSS.escape === 'function') ? window.CSS.escape(inst) : String(inst).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
    const tituloCard = qs(`[data-concurso-card][data-inst="${valorCss}"] h2`);
    if (tituloCard && tituloCard.textContent.trim()) {
      return tituloCard.textContent.replace(/:\s*concursos.*$/i, '').trim();
    }

    return String(inst || '').toUpperCase();
  }

  function detectarEscolaridade(concurso) {
    const texto = normalizar([
      concurso?.edital,
      concurso?.escolaridade,
      concurso?.idade,
      concurso?.previsao
    ].join(' '));

    const aceitaMedio = /(ensino médio|nível médio|nivel medio|médio completo|medio completo|soldado|praça|praca|cfp|cfsd|cadete|guarda-vidas|guarda vidas)/i.test(texto);
    const exigeSuperior = /(nível superior|nivel superior|superior completo|curso superior|bacharel|graduação|graduacao|tecnólogo|tecnologo|diploma de curso superior)/i.test(texto);

    let resumo = 'Confirmar no edital';
    if (aceitaMedio && exigeSuperior) resumo = 'Há cargos de nível médio e/ou superior';
    else if (aceitaMedio) resumo = 'Ensino médio';
    else if (exigeSuperior) resumo = 'Curso superior';

    return { aceitaMedio, exigeSuperior, resumo };
  }

  function detectarLimiteIdade(concurso) {
    const texto = normalizar([concurso?.idade, concurso?.edital, concurso?.escolaridade].join(' '));
    const indefinido = /(a definir|conferir|não fixar|nao fixar|depende|conforme edital|requisitos específicos|requisitos especificos)/i.test(texto);
    let min = 18;
    let max = 75;

    if (/(17\s*a\s*30|17\s*anos?.{0,30}30)/i.test(texto)) { min = 17; max = 30; }
    else if (/(18\s*a\s*25|idade máxima de 25|idade maxima de 25)/i.test(texto)) { min = 18; max = 25; }
    else if (/(18\s*a\s*28|máximo de 28|maximo de 28|menos de 28)/i.test(texto)) { min = 18; max = 28; }
    else if (/(18\s*a\s*29|idade máxima de 29|idade maxima de 29)/i.test(texto)) { min = 18; max = 29; }
    else if (/(18\s*a\s*30|máximo de 30|maximo de 30|até 30|ate 30|menos de 30|30 anos completos)/i.test(texto)) { min = 18; max = 30; }
    else if (/(18\s*a\s*32|idades? de 18 a 32)/i.test(texto)) { min = 18; max = 32; }
    else if (/(18\s*a\s*35|máximo de 35|maximo de 35)/i.test(texto)) { min = 18; max = 35; }
    else if (/(18\s*(e|a)\s*55|18.{0,12}55)/i.test(texto)) { min = 18; max = 55; }
    else if (/(21\s*a\s*45|21.{0,12}45)/i.test(texto)) { min = 21; max = 45; }
    else if (/(sem limite|não há limite|nao ha limite)/i.test(texto)) { min = 18; max = 75; }

    return {
      min,
      max,
      indefinido,
      resumo: indefinido && max === 75 ? 'Confirmar no edital' : `${min} a ${max} anos`
    };
  }

  function compativelComPerfil(concurso, idade, temSuperior) {
    const escolaridade = detectarEscolaridade(concurso);
    const limiteIdade = detectarLimiteIdade(concurso);
    const idadeOk = limiteIdade.indefinido || (idade >= limiteIdade.min && idade <= limiteIdade.max);
    const escolaridadeOk = temSuperior || escolaridade.aceitaMedio || !escolaridade.exigeSuperior;

    return {
      ok: idadeOk && escolaridadeOk,
      escolaridade,
      limiteIdade,
      motivo: !idadeOk ? 'Fora da faixa etária informada no cadastro' : (!escolaridadeOk ? 'Exige curso superior completo' : '')
    };
  }

  function concursosBuscadorOrdenados() {
    const base = obterBaseConcursos();
    return Object.keys(BUSCADOR_STATUS_CONCURSOS)
      .filter(inst => base[inst])
      .map(inst => ({ inst, status: BUSCADOR_STATUS_CONCURSOS[inst], concurso: base[inst] }))
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === 'aberto' ? -1 : 1;
        return nomeConcurso(a.inst).localeCompare(nomeConcurso(b.inst), 'pt-BR');
      });
  }

  function cardResultadoBuscador(item, compatibilidade) {
    const c = item.concurso;
    const site = urlValida(c.site) ? `<a href="${textoSeguro(c.site)}" target="_blank" rel="noopener noreferrer">Fonte oficial</a>` : '';
    return `
      <article class="concursos-buscador-card" data-buscador-resultado-card="${textoSeguro(item.inst)}">
        <div class="concursos-buscador-card__cabecalho">
          <h3>${textoSeguro(nomeConcurso(item.inst))}</h3>
          <span class="concursos-buscador-status">${textoSeguro(BUSCADOR_STATUS_LABELS[item.status] || item.status)}</span>
        </div>
        <p>${textoSeguro(limitarTexto(c.edital || c.previsao || 'Dados em breve', 220))}</p>
        <dl>
          <div data-campo="idade">
            <dt>Idade</dt>
            <dd>${textoSeguro(compatibilidade.limiteIdade.resumo)}</dd>
          </div>
          <div data-campo="escolaridade">
            <dt>Escolaridade</dt>
            <dd>${textoSeguro(compatibilidade.escolaridade.resumo)}</dd>
          </div>
          <div data-campo="vagas">
            <dt>Vagas</dt>
            <dd>${textoSeguro(limitarTexto(c.vagas, 120))}</dd>
          </div>
          <div data-campo="banca">
            <dt>Banca</dt>
            <dd>${textoSeguro(limitarTexto(c.banca, 80))}</dd>
          </div>
        </dl>
        <p><strong>Próximo passo:</strong> ${textoSeguro(limitarTexto(c.previsao || 'Acompanhar atos oficiais.', 180))}</p>
        <div class="concursos-buscador-card__acoes">
          <button type="button" data-buscador-carreira-abrir="${textoSeguro(item.inst)}">Ver dados completos</button>
          ${site}
        </div>
      </article>
    `;
  }

  function renderizarMensagemInicialBuscador(resultado) {
    if (!resultado) return;
    resultado.innerHTML = `
      <div class="concursos-buscador-vazio">
        Preencha idade e escolaridade para listar oportunidades compatíveis cadastradas como em aberto ou em pedido de abertura.
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const seletorEsfera = qs('#concursos_esfera');
    const seletorInstituicao = qs('#concursos_instituicao');
    const paginacao = qs('#concursos-paginacao');
    const contador = qs('#concursos-contador-cards');
    const btnLimpar = qs('[data-concursos-limpar]');
    const listaDetalhe = qs('#lista-concursos');
    let paginaAtual = 1;

    if (!seletorEsfera || !seletorInstituicao || !paginacao) return;

    function renderizar() {
      atualizarOpcoesInstituicao(seletorEsfera, seletorInstituicao);
      const filtrados = cardsFiltrados(seletorEsfera, seletorInstituicao);
      const totalPaginas = Math.max(1, Math.ceil(filtrados.length / CARDS_POR_PAGINA));
      if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
      if (paginaAtual < 1) paginaAtual = 1;

      const inicio = (paginaAtual - 1) * CARDS_POR_PAGINA;
      const fim = inicio + CARDS_POR_PAGINA;
      const visiveis = new Set(filtrados.slice(inicio, fim));

      cards().forEach(card => {
        card.hidden = !visiveis.has(card);
      });

      if (contador) {
        const texto = seletorInstituicao.value ? 'instituição selecionada' : 'instituições encontradas';
        contador.textContent = `${filtrados.length} ${texto}`;
      }

      renderizarPaginacao(paginacao, paginaAtual, totalPaginas);
    }

    function selecionarInstituicao(inst, rolar) {
      if (!inst) {
        esconderDetalhe();
        if (listaDetalhe) listaDetalhe.innerHTML = '';
        return;
      }

      mostrarDetalhe();

      try {
        if (typeof mudarInstituicao === 'function') {
          mudarInstituicao(inst);
        }
      } catch (erro) {
        console.warn('Falha ao atualizar cabeçalho institucional do concurso:', erro);
      }

      try {
        if (typeof carregarConcursos === 'function') carregarConcursos();
      } catch (erro) {
        console.warn('Falha ao carregar dados completos do concurso:', erro);
      }

      if (listaDetalhe && !listaDetalhe.textContent.trim()) {
        listaDetalhe.innerHTML = concursoFallbackHtml(inst);
      }

      if (rolar) {
        const destino = qs('#consulta-concurso-detalhado');
        if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    const formBuscadorCarreira = qs('#form-buscador-carreira');
    const idadeBuscadorCarreira = qs('#buscador_carreira_idade');
    const superiorBuscadorCarreira = qs('#buscador_carreira_superior');
    const resultadoBuscadorCarreira = qs('#buscador-carreira-resultado');
    const btnLimparBuscadorCarreira = qs('[data-buscador-carreira-limpar]');

    function executarBuscaCarreira() {
      if (!resultadoBuscadorCarreira || !idadeBuscadorCarreira || !superiorBuscadorCarreira) return;

      const idade = Number(idadeBuscadorCarreira.value);
      const superiorValor = superiorBuscadorCarreira.value;

      if (!Number.isFinite(idade) || idade < 16 || idade > 75 || !superiorValor) {
        resultadoBuscadorCarreira.innerHTML = `
          <div class="concursos-buscador-vazio">
            Informe uma idade entre 16 e 75 anos e selecione se possui curso superior completo para fazer a triagem.
          </div>
        `;
        return;
      }

      const temSuperior = superiorValor === 'sim';
      const candidatos = concursosBuscadorOrdenados()
        .map(item => ({ ...item, compatibilidade: compativelComPerfil(item.concurso, idade, temSuperior) }))
        .filter(item => item.compatibilidade.ok);

      const perfilTexto = `${idade} anos · ${temSuperior ? 'com curso superior completo' : 'sem curso superior completo'}`;
      if (!candidatos.length) {
        resultadoBuscadorCarreira.innerHTML = `
          <div class="concursos-buscador-vazio">
            Nenhum concurso cadastrado como em aberto ou em pedido de abertura ficou compatível com o perfil informado (${textoSeguro(perfilTexto)}). Revise os dados ou acompanhe novas atualizações da página.
          </div>
        `;
        return;
      }

      const totalAbertos = candidatos.filter(item => item.status === 'aberto').length;
      const totalPedidos = candidatos.filter(item => item.status === 'pedido').length;
      resultadoBuscadorCarreira.innerHTML = `
        <div class="concursos-buscador-resumo">
          <span>${candidatos.length} oportunidade${candidatos.length === 1 ? '' : 's'} compatível${candidatos.length === 1 ? '' : 'eis'}</span>
          <span>${totalAbertos} em aberto</span>
          <span>${totalPedidos} em pedido/planejamento</span>
          <span>Perfil: ${textoSeguro(perfilTexto)}</span>
        </div>
        <div class="concursos-buscador-grid">
          ${candidatos.map(item => cardResultadoBuscador(item, item.compatibilidade)).join('')}
        </div>
      `;
    }

    if (formBuscadorCarreira) {
      formBuscadorCarreira.addEventListener('submit', event => {
        event.preventDefault();
        executarBuscaCarreira();
      });
    }

    if (resultadoBuscadorCarreira) {
      renderizarMensagemInicialBuscador(resultadoBuscadorCarreira);
      resultadoBuscadorCarreira.addEventListener('click', event => {
        const botao = event.target.closest('[data-buscador-carreira-abrir]');
        if (!botao) return;
        const inst = botao.dataset.buscadorCarreiraAbrir;
        if (!inst) return;

        const valorCss = (window.CSS && typeof window.CSS.escape === 'function') ? window.CSS.escape(inst) : String(inst).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
        const card = qs(`[data-concurso-card][data-inst="${valorCss}"]`);
        if (card) seletorEsfera.value = card.dataset.esfera || '';
        seletorInstituicao.value = inst;
        paginaAtual = 1;
        renderizar();
        selecionarInstituicao(inst, true);
      });
    }

    if (btnLimparBuscadorCarreira) {
      btnLimparBuscadorCarreira.addEventListener('click', () => {
        if (idadeBuscadorCarreira) idadeBuscadorCarreira.value = '';
        if (superiorBuscadorCarreira) superiorBuscadorCarreira.value = '';
        renderizarMensagemInicialBuscador(resultadoBuscadorCarreira);
      });
    }

    seletorEsfera.addEventListener('change', () => {
      paginaAtual = 1;
      renderizar();
      if (!seletorInstituicao.value) selecionarInstituicao('', false);
    });

    seletorInstituicao.addEventListener('change', () => {
      paginaAtual = 1;
      renderizar();
      selecionarInstituicao(seletorInstituicao.value, !!seletorInstituicao.value);
    });

    if (btnLimpar) {
      btnLimpar.addEventListener('click', () => {
        seletorEsfera.value = '';
        seletorInstituicao.value = '';
        paginaAtual = 1;
        renderizar();
        selecionarInstituicao('', false);
        if (typeof aplicarHeaderInicialPortal === 'function') aplicarHeaderInicialPortal();
      });
    }

    paginacao.addEventListener('click', event => {
      const botao = event.target.closest('[data-concursos-page]');
      if (!botao || botao.disabled) return;
      const destino = botao.dataset.concursosPage;
      const totalPaginas = Math.max(1, Math.ceil(cardsFiltrados(seletorEsfera, seletorInstituicao).length / CARDS_POR_PAGINA));

      if (destino === 'prev') paginaAtual -= 1;
      else if (destino === 'next') paginaAtual += 1;
      else paginaAtual = Number(destino) || 1;

      if (paginaAtual < 1) paginaAtual = 1;
      if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
      renderizar();
      const lista = qs('#concursos-conteudo-lista');
      if (lista) lista.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.addEventListener('click', event => {
      const botao = event.target.closest('[data-concurso-load]');
      if (!botao) return;
      const inst = botao.dataset.concursoLoad;
      if (!inst) return;
      event.preventDefault();

      const valorCss = (window.CSS && typeof window.CSS.escape === 'function') ? window.CSS.escape(inst) : String(inst).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
      const card = qs(`[data-concurso-card][data-inst="${valorCss}"]`);
      if (card) seletorEsfera.value = card.dataset.esfera || '';
      seletorInstituicao.value = inst;
      paginaAtual = 1;
      renderizar();
      selecionarInstituicao(inst, true);
    });

    esconderDetalhe();
    renderizar();
  });
})();
