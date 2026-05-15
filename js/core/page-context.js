/* ============================================================
   UniSegPub — Contexto MPA (Multi Page Application)
   Mantém compatibilidade com o JS legado da versão em abas,
   mas agora cada seção principal é uma página HTML real.
   ============================================================ */
(function () {
  const PAGE_URLS = {
    principal: 'index.html',
    remuneracao: 'remuneracao.html',
    direitos: 'direitos.html',
    brasoes: 'brasoes.html',
    guia: 'guia-instituicoes.html',
    concursos: 'concursos.html',
    comparar: 'comparar-carreiras.html',
    produtos: 'produtos.html',
    acoes: 'acoes-judiciais.html',
    associacoes: 'associacoes-sindicatos.html',
    parceiros: 'parceiros.html'
  };

  const PAGE_NAMES = {
    principal: 'Principal',
    remuneracao: 'Remuneração Tabelada',
    direitos: 'Direitos e Vantagens',
    brasoes: 'Brasões e história',
    guia: 'Guia das instituições',
    concursos: 'Concursos',
    comparar: 'Comparar Carreiras',
    produtos: 'Produtos',
    acoes: 'Ações Judiciais',
    associacoes: 'Associações e Sindicatos',
    parceiros: 'Parceiros e Contato'
  };



  window.UNISEGPUB_PAGE_URLS = Object.assign({}, PAGE_URLS);
  window.UNISEGPUB_PAGE_NAMES = Object.assign({}, PAGE_NAMES);

  function getCurrentPage() {
    return document.body?.dataset?.page || 'principal';
  }

  function setActivePage(page) {
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.toggle('active', section.id === `page-${page}`);
    });

    document.querySelectorAll('.sidebar-nav a').forEach(link => {
      const active = link.id === `menu-${page}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }


  function initPageSpecificContent(page) {
    if (typeof window.atualizarVisibilidadeResumoInstitucional === 'function') {
      window.atualizarVisibilidadeResumoInstitucional(page);
    }

    if (typeof window.atualizarHeaderDesc === 'function') {
      window.atualizarHeaderDesc(PAGE_NAMES[page] || PAGE_NAMES.principal);
    }

    const institutionalPages = ['remuneracao', 'direitos', 'brasoes', 'concursos', 'acoes', 'associacoes'];
    if (institutionalPages.includes(page) && typeof window.prepararPaginaComSelecaoInstituicao === 'function') {
      window.prepararPaginaComSelecaoInstituicao(page);
    }

    if (page === 'comparar' && typeof window.inicializarComparadorCarreiras === 'function') {
      window.inicializarComparadorCarreiras();
    }

  }

  document.addEventListener('DOMContentLoaded', () => {
    const page = getCurrentPage();
    setActivePage(page);
    initPageSpecificContent(page);
  });
})();
