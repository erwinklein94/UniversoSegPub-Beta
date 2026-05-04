/* =======================================================
   Revisão geral de estabilidade visual do portal.
   Protege layout, remove duplicidades residuais e usa observação pontual
   para não pesar no mobile.
   ======================================================= */

(function revisarEstabilidadeGeralDoSite() {
  let timerAplicar;

  function inserirCss() {
    let style = document.getElementById('site-revisao-geral-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'site-revisao-geral-style';
      document.head.appendChild(style);
    }

    style.textContent = `
      html, body { max-width: 100% !important; overflow-x: hidden !important; }
      img, svg, video, canvas, iframe { max-width: 100%; }
      .site-header, .site-header .header-shell, .site-header .header-institution-card, main, .page, .page-content, .content, .main-content { max-width: 100% !important; }
      .site-header .header-institution-card, .site-header .header-current-identity, .site-header .header-facts-panel, .site-header .header-controls-grid, .site-header .header-inst-selector, .site-header .header-branch-switcher { min-width: 0 !important; }
      .site-header .header-current-copy, .site-header .header-current-copy *, .site-header .header-facts-panel, .site-header .header-facts-panel *, .site-header .header-inst-selector, .site-header .header-branch-switcher { overflow-wrap: anywhere; }
      .site-header .current-flag-frame img, #header-active-flag { display: block !important; margin: auto !important; object-position: center center !important; }
      .prf-dados-publicos-card, .sidebar-products-unified, .comparador-check-grupo, .produto-card, .remuneracao-card, .card { max-width: 100% !important; }
      body[data-page="produtos"] #page-produtos .produto-card, .page-produtos #page-produtos .produto-card { contain: layout paint; }
      @media (max-width: 760px) {
        body { padding-bottom: max(116px, env(safe-area-inset-bottom)) !important; }
        main, .page, .page-content, .content, .main-content, .site-main { padding-bottom: 126px !important; }
        .site-header { padding-left: clamp(8px, 2.5vw, 14px) !important; padding-right: clamp(8px, 2.5vw, 14px) !important; }
        .site-header .header-institution-card { width: 100% !important; margin-left: auto !important; margin-right: auto !important; }
        .bottom-nav, .mobile-bottom-nav, .app-bottom-nav { z-index: 999 !important; }
        .sidebar-products-unified-card, .comparador-check-option, .produto-card { min-width: 0 !important; }
      }
    `;
  }

  function removerDuplicidadesAntigasDaSidebar() {
    const sidebar = document.querySelector('.sidebar, #sidebar');
    if (!sidebar || !sidebar.querySelector('.sidebar-products-unified')) return;

    sidebar.querySelectorAll('.sidebar-extra-products, .sidebar-products-cta, .sidebar-ad, .ad-slot--sidebar').forEach((el) => {
      if (!el.closest('.sidebar-products-unified')) el.remove();
    });
  }

  function removerCardsPrfDuplicados() {
    const cards = Array.from(document.querySelectorAll('.prf-dados-publicos-card'));
    cards.slice(1).forEach((card) => card.remove());
  }

  function normalizarBotoesFlutuantes() {
    document.querySelectorAll('.floating-back-button, .theme-toggle-floating, .back-button, .theme-toggle').forEach((el) => {
      el.style.setProperty('max-width', '72px');
      el.style.setProperty('max-height', '72px');
    });
  }

  function aplicar() {
    inserirCss();
    removerDuplicidadesAntigasDaSidebar();
    removerCardsPrfDuplicados();
    normalizarBotoesFlutuantes();
  }

  function agendarAplicar(delay = 100) {
    window.clearTimeout(timerAplicar);
    timerAplicar = window.setTimeout(aplicar, delay);
  }

  function observarAlvosPontuais() {
    if (window.__unisegRevisaoGeralObserver) return;
    const alvos = [
      document.querySelector('.sidebar, #sidebar'),
      document.querySelector('.site-header'),
      document.getElementById('page-remuneracao'),
      document.getElementById('page-produtos'),
      document.getElementById('page-comparar'),
      document.getElementById('page-principal')
    ].filter(Boolean);
    if (!alvos.length) return;

    const observer = new MutationObserver(() => agendarAplicar(120));
    alvos.forEach((alvo) => observer.observe(alvo, { childList: true, subtree: true }));
    window.__unisegRevisaoGeralObserver = observer;
  }

  aplicar();
  observarAlvosPontuais();
  document.addEventListener('DOMContentLoaded', () => {
    aplicar();
    observarAlvosPontuais();
  }, { once: true });
  document.addEventListener('change', () => agendarAplicar(80), true);
  window.setTimeout(aplicar, 300);
  window.setTimeout(aplicar, 1000);
}());
