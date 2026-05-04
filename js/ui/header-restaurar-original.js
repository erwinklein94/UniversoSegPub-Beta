/* =======================================================
   Restaura o cabeçalho original.
   Remove os ajustes experimentais de fundo/zoom/layout do cabeçalho
   que duplicavam o brasão/logo no desktop e no mobile.
   ======================================================= */

(function restaurarCabecalhoOriginal() {
  const ARQUIVOS_CABECALHO_EXTRAS = [
    'header-mobile-emblem.css',
    'header-unified-layout.css',
    'header-text-fit.css',
    'header-emblem-zoom.css'
  ];

  function removerCssExtras() {
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const href = String(link.getAttribute('href') || '');
      if (ARQUIVOS_CABECALHO_EXTRAS.some((nome) => href.includes(nome))) {
        link.remove();
      }
    });
  }

  function removerOverlayZoom() {
    document.querySelectorAll('.emblem-zoom-overlay').forEach((el) => el.remove());
    document.body?.classList.remove('emblem-zoom-open');
    document.body?.style.removeProperty('overflow');
  }

  function inserirCssRestauracao() {
    if (document.getElementById('header-restaurar-original-style')) return;

    const style = document.createElement('style');
    style.id = 'header-restaurar-original-style';
    style.textContent = `
      .site-header .header-institution-main,
      .site-header .header-controls-grid,
      .site-header .header-institution-card,
      .site-header .header-current-identity,
      .site-header .header-facts-panel,
      .site-header .header-current-copy,
      .site-header .header-facts-grid,
      .site-header .header-leadership,
      .site-header .branch-buttons {
        animation: none !important;
      }

      .site-header .header-current-identity {
        overflow: visible !important;
        min-height: initial !important;
      }

      .site-header .current-flag-frame,
      .site-header .current-flag-frame.brand-logo-frame,
      .site-header .current-flag-frame.institution-logo-frame {
        position: relative !important;
        top: auto !important;
        right: auto !important;
        left: auto !important;
        bottom: auto !important;
        z-index: auto !important;
        width: 96px !important;
        height: 96px !important;
        max-width: 96px !important;
        max-height: 96px !important;
        margin: 0 !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: none !important;
        background-image: none !important;
      }

      .site-header .current-flag-frame img,
      .site-header .current-flag-frame.brand-logo-frame img,
      .site-header .current-flag-frame.institution-logo-frame img,
      #header-active-flag {
        width: 96px !important;
        height: 96px !important;
        max-width: 96px !important;
        max-height: 96px !important;
        object-fit: contain !important;
        opacity: 1 !important;
        transform: none !important;
        filter: none !important;
      }

      .site-header .header-current-copy {
        max-width: none !important;
        position: static !important;
        z-index: auto !important;
      }

      .site-header .header-current-copy #header-desc {
        display: block !important;
      }

      .site-header .header-current-identity::before,
      .site-header .header-current-identity::after,
      .site-header .header-institution-card::before,
      .site-header .header-institution-card::after,
      .site-header .header-shell::before,
      .site-header .header-shell::after {
        background-image: none !important;
      }

      @media (max-width: 760px) {
        .site-header .header-current-identity {
          min-height: initial !important;
          padding: inherit !important;
          overflow: visible !important;
        }

        .site-header .header-current-copy strong,
        .site-header .header-current-copy p,
        .site-header .header-current-copy small,
        .site-header .header-current-label {
          position: static !important;
          z-index: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function aplicar() {
    removerCssExtras();
    removerOverlayZoom();
    inserirCssRestauracao();
  }

  aplicar();
  document.addEventListener('DOMContentLoaded', aplicar, { once: true });
  const observer = new MutationObserver(() => window.setTimeout(aplicar, 20));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(aplicar, 200);
  window.setTimeout(aplicar, 800);
  window.setTimeout(aplicar, 1800);
}());
