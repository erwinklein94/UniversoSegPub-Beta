/* =======================================================
   Limpezas e ajustes leves de UI.
   Sem criação de produtos e sem alteração agressiva do cabeçalho.
   ======================================================= */

(function limparUiDoPortal() {
  function ajustarTextosDoCabecalho() {
    document.querySelectorAll('.header-inst-selector label, .sidebar-inst-panel label').forEach((label) => {
      label.textContent = 'Escolha instituição';
    });

    document.querySelectorAll('#instituicao_header option[value=""], #instituicao option[value=""]').forEach((option) => {
      option.textContent = 'Escolha instituição';
    });

    document.querySelectorAll('.sidebar-selector-hint, .sidebar-independent-note').forEach((elemento) => elemento.remove());
  }

  function textoNormalizado(elemento) {
    return (elemento?.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function estaNoCabecalhoOuMenu(elemento) {
    return Boolean(elemento?.closest?.('header, .site-header, #sidebar, .sidebar'));
  }

  function temReferenciaInstituicao(elemento) {
    if (!elemento) return false;
    const texto = textoNormalizado(elemento);
    const attrs = [
      elemento.id,
      elemento.name,
      elemento.className,
      elemento.getAttribute?.('aria-label'),
      elemento.getAttribute?.('for'),
      elemento.getAttribute?.('data-field')
    ].join(' ').toLowerCase();

    return /institui[cç][aã]o|institui[cç][oõ]es/.test(`${texto} ${attrs}`);
  }

  function removerSeletorDuplicadoDaHome() {
    if (document.body?.dataset.page !== 'principal') return;

    const raizHome = document.querySelector('main') || document.getElementById('page-principal');
    if (!raizHome) return;

    const deveRemoverBloco = (bloco) => {
      if (!bloco || bloco === document.body || estaNoCabecalhoOuMenu(bloco)) return false;

      const texto = textoNormalizado(bloco);
      const possuiControle = Boolean(bloco.querySelector('select, [role="combobox"], option, label, .select-wrapper, .custom-select'));
      const ehCardDeSelecao = bloco.matches('.consulta-instituicao-card, .inst-selector, .header-inst-selector, .field');
      const ehResumoDaHome = [
        'resumo da página inicial',
        'resumo da pagina inicial',
        'escolha uma instituição para ver no cabeçalho',
        'escolha uma instituicao para ver no cabecalho',
        'esta escolha muda apenas o cabeçalho',
        'esta escolha muda apenas o cabecalho'
      ].some((marcador) => texto.includes(marcador));

      return ehResumoDaHome || (ehCardDeSelecao && possuiControle && temReferenciaInstituicao(bloco));
    };

    const removerBloco = (bloco) => {
      if (!bloco || estaNoCabecalhoOuMenu(bloco)) return;
      bloco.setAttribute('hidden', '');
      bloco.setAttribute('aria-hidden', 'true');
      bloco.style.setProperty('display', 'none', 'important');
      bloco.remove();
    };

    raizHome.querySelectorAll('.consulta-instituicao-card, .inst-selector:not(.sidebar-inst-panel), .header-inst-selector, .field, .card, .principal-card, section, article, aside').forEach((bloco) => {
      if (deveRemoverBloco(bloco)) removerBloco(bloco);
    });

    raizHome.querySelectorAll('select, [role="combobox"], .select-wrapper, .custom-select').forEach((controle) => {
      if (estaNoCabecalhoOuMenu(controle)) return;
      if (!temReferenciaInstituicao(controle) && !temReferenciaInstituicao(controle.closest('label, .field, .card, .principal-card, .consulta-instituicao-card, .inst-selector') || controle)) return;
      removerBloco(controle.closest('.consulta-instituicao-card, .principal-card, .card, .field, .inst-selector, .header-inst-selector, section, article, aside, div') || controle);
    });
  }

  function substituirCardGratisDaHome() {
    if (document.body?.dataset.page !== 'principal') return;

    const seletorCards = [
      'main .principal-card',
      '#page-principal .principal-card',
      'main .header-fact',
      '#page-principal .header-fact',
      'main .remuneracao-stat',
      '#page-principal .remuneracao-stat',
      'main .card',
      '#page-principal .card'
    ].join(', ');

    document.querySelectorAll(seletorCards).forEach((card) => {
      const texto = textoNormalizado(card);
      if (!/gr[aá]tis|gratis/.test(texto) || !/consulta/.test(texto)) return;
      card.classList.add('principal-card--abrangencia');
      card.innerHTML = '<h3>Federal, Estadual e Municipal</h3>';
    });
  }

  function reduzirInstrucoesForaDaHome() {
    if (document.body?.dataset.page === 'principal') return;

    const termosInstrucao = [
      'como usar',
      'como consultar',
      'como mexer',
      'passo a passo',
      'dica',
      'dicas',
      'orientação',
      'orientações',
      'instruções',
      'selecione uma instituição',
      'escolha uma instituição'
    ];

    document.querySelectorAll('section, article, aside, .card, .principal-card, .principal-nota, .portal-disclaimer').forEach((bloco) => {
      const texto = textoNormalizado(bloco);
      if (!texto || texto.length > 900) return;
      if (termosInstrucao.some((termo) => texto.includes(termo))) bloco.classList.add('is-instruction-reduced');
    });
  }

  function reorganizarSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const nav = sidebar?.querySelector('.sidebar-nav');
    if (!sidebar || !nav || sidebar.dataset.sidebarOptimized === 'true') return;

    const ordem = [
      'menu-principal',
      'menu-remuneracao',
      'menu-comparar',
      'menu-concursos',
      'menu-brasoes',
      'menu-direitos',
      'menu-poderes',
      'menu-acoes',
      'menu-associacoes',
      'menu-produtos',
      'menu-parceiros'
    ];

    const rotulosGrupo = {
      consultas: 'Consultas',
      carreira: 'Carreira e dados',
      apoio: 'Direitos e apoio',
      extras: 'Produtos e parceiros'
    };

    const grupos = {
      consultas: ['menu-principal', 'menu-remuneracao', 'menu-comparar'],
      carreira: ['menu-concursos', 'menu-brasoes'],
      apoio: ['menu-direitos', 'menu-poderes', 'menu-acoes', 'menu-associacoes'],
      extras: ['menu-produtos', 'menu-parceiros']
    };

    const links = new Map();
    ordem.forEach((id) => {
      const link = nav.querySelector(`#${id}`);
      if (link) links.set(id, link);
    });

    nav.replaceChildren();

    Object.entries(grupos).forEach(([grupo, ids]) => {
      const existentes = ids.map((id) => links.get(id)).filter(Boolean);
      if (!existentes.length) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'sidebar-nav-group';
      wrapper.setAttribute('aria-label', rotulosGrupo[grupo]);

      const titulo = document.createElement('div');
      titulo.className = 'sidebar-nav-title';
      titulo.textContent = rotulosGrupo[grupo];
      wrapper.appendChild(titulo);

      existentes.forEach((link) => wrapper.appendChild(link));
      nav.appendChild(wrapper);
    });

    const social = sidebar.querySelector('.sidebar-social');
    const primeiroAnuncio = sidebar.querySelector('.ad-slot--sidebar');
    if (social && primeiroAnuncio) sidebar.insertBefore(social, primeiroAnuncio);

    sidebar.dataset.sidebarOptimized = 'true';
  }

  function aplicar() {
    ajustarTextosDoCabecalho();
    removerSeletorDuplicadoDaHome();
    substituirCardGratisDaHome();
    reduzirInstrucoesForaDaHome();
    reorganizarSidebar();
  }

  aplicar();
  document.addEventListener('DOMContentLoaded', aplicar, { once: true });
  window.setTimeout(aplicar, 250);
  window.setTimeout(aplicar, 900);

  if (document.body?.dataset.page === 'principal') {
    const alvo = document.querySelector('main') || document.getElementById('page-principal');
    if (alvo && !window.__unisegHomeSelectorObserver) {
      let timer;
      const observer = new MutationObserver(() => {
        window.clearTimeout(timer);
        timer = window.setTimeout(aplicar, 60);
      });
      observer.observe(alvo, { childList: true, subtree: true });
      window.__unisegHomeSelectorObserver = observer;
    }
  }
}());
