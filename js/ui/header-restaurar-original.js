/* =======================================================
   Cabeçalho estável do portal.
   Aplica uma composição limpa para desktop e mobile, sem observer global.
   ======================================================= */

(function organizarCabecalhoPortal() {
  let timer;
  const ARQUIVOS_CABECALHO_EXTRAS = [
    'header-mobile-emblem.css',
    'header-unified-layout.css',
    'header-text-fit.css',
    'header-emblem-zoom.css'
  ];

  function removerCssExtras() {
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const href = String(link.getAttribute('href') || '');
      if (ARQUIVOS_CABECALHO_EXTRAS.some((nome) => href.includes(nome))) link.remove();
    });
  }

  function removerOverlayZoom() {
    document.querySelectorAll('.emblem-zoom-overlay').forEach((el) => el.remove());
    document.body?.classList.remove('emblem-zoom-open');
    document.body?.style.removeProperty('overflow');
  }

  function inserirCssCabecalho() {
    let style = document.getElementById('header-restaurar-original-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'header-restaurar-original-style';
      document.head.appendChild(style);
    }

    style.textContent = `
      .site-header,.site-header *{box-sizing:border-box!important}
      .site-header .header-shell,.site-header .header-content{overflow:visible!important}
      .site-header .header-institution-card{display:grid!important;grid-template-columns:1fr!important;gap:18px!important;overflow:hidden!important;background-image:none!important}
      .site-header .header-institution-main{display:grid!important;grid-template-columns:minmax(280px,.92fr) minmax(360px,1.38fr)!important;gap:18px!important;align-items:stretch!important;width:100%!important}
      .site-header .header-current-identity{position:relative!important;display:grid!important;grid-template-columns:104px minmax(0,1fr)!important;gap:18px!important;align-items:center!important;min-height:168px!important;width:100%!important;max-width:100%!important;padding:22px!important;overflow:hidden!important;border-radius:26px!important;background-image:linear-gradient(145deg,rgba(255,255,255,.08),rgba(9,12,17,.18))!important}
      .site-header .current-flag-frame,.site-header .current-flag-frame.brand-logo-frame,.site-header .current-flag-frame.institution-logo-frame{position:relative!important;inset:auto!important;z-index:1!important;display:grid!important;place-items:center!important;flex:0 0 auto!important;width:104px!important;height:104px!important;min-width:104px!important;max-width:104px!important;min-height:104px!important;max-height:104px!important;margin:0!important;opacity:1!important;pointer-events:auto!important;transform:none!important;background-image:none!important}
      .site-header .current-flag-frame img,.site-header .current-flag-frame.brand-logo-frame img,.site-header .current-flag-frame.institution-logo-frame img,#header-active-flag{display:block!important;width:96px!important;height:96px!important;max-width:96px!important;max-height:96px!important;object-fit:contain!important;opacity:1!important;transform:none!important;filter:none!important}
      .site-header .header-current-copy{position:relative!important;z-index:2!important;display:grid!important;align-content:center!important;gap:6px!important;min-width:0!important;max-width:100%!important;width:100%!important;overflow:hidden!important}
      .site-header .header-current-label,.site-header .header-current-copy strong,.site-header .header-current-copy p,.site-header .header-current-copy small{position:static!important;z-index:auto!important;max-width:100%!important;margin:0!important;overflow-wrap:anywhere!important;word-break:normal!important;transform:none!important}
      .site-header .header-current-copy strong,#header-active-sigla{display:block!important;font-size:clamp(2rem,4vw,4.2rem)!important;line-height:.95!important;letter-spacing:-.035em!important;white-space:normal!important;text-overflow:clip!important;overflow:visible!important}
      .site-header .header-current-copy p,#header-active-name{display:block!important;font-size:clamp(1rem,1.45vw,1.4rem)!important;line-height:1.08!important;font-weight:800!important;white-space:normal!important}
      .site-header .header-current-copy small,#header-desc{display:block!important;width:fit-content!important;max-width:100%!important;padding:7px 12px!important;border-radius:999px!important;font-size:.86rem!important;line-height:1.1!important;white-space:normal!important}
      .site-header .header-facts-panel{display:grid!important;grid-template-columns:1fr!important;gap:12px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important;padding:18px!important;border-radius:26px!important}
      .site-header .header-facts-head{display:grid!important;gap:6px!important;margin:0!important}
      .site-header .header-facts-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important;width:100%!important;min-width:0!important}
      .site-header .header-fact,.site-header .header-leadership-item,.site-header .header-update-note{min-width:0!important;min-height:0!important;padding:12px!important;border-radius:18px!important;overflow:hidden!important}
      .site-header .header-fact span,.site-header .header-leadership-item span{display:block!important;margin:0 0 4px!important;font-size:.78rem!important;line-height:1.12!important}
      .site-header .header-fact strong,.site-header .header-leadership-item strong{display:block!important;min-width:0!important;font-size:clamp(.86rem,.95vw,1rem)!important;line-height:1.18!important;overflow-wrap:anywhere!important}
      .site-header .header-leadership{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;margin:0!important}
      .site-header .header-update-note{margin:0!important}
      .site-header .header-controls-grid{display:grid!important;grid-template-columns:minmax(280px,.92fr) minmax(360px,1.38fr)!important;gap:18px!important;align-items:stretch!important;width:100%!important;min-width:0!important}
      .site-header .header-inst-selector,.site-header .header-branch-switcher{display:grid!important;gap:10px!important;width:100%!important;min-width:0!important;padding:16px!important;border-radius:22px!important;overflow:hidden!important}
      .site-header .header-inst-selector select,.site-header #instituicao_header{width:100%!important;min-width:0!important;min-height:52px!important;max-width:100%!important}
      .site-header .branch-buttons{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important;width:100%!important}
      .site-header .branch-option{min-width:0!important;min-height:56px!important;padding:9px 8px!important}
      @media (max-width:980px){.site-header .header-institution-main,.site-header .header-controls-grid{grid-template-columns:1fr!important}.site-header .header-facts-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media (max-width:760px){.site-header .header-institution-card{gap:14px!important;padding:14px!important;overflow:hidden!important}.site-header .header-institution-main,.site-header .header-controls-grid{gap:14px!important}.site-header .header-current-identity{grid-template-columns:82px minmax(0,1fr)!important;gap:12px!important;min-height:132px!important;padding:16px!important;border-radius:24px!important}.site-header .current-flag-frame,.site-header .current-flag-frame.brand-logo-frame,.site-header .current-flag-frame.institution-logo-frame{width:82px!important;height:82px!important;min-width:82px!important;max-width:82px!important;min-height:82px!important;max-height:82px!important}.site-header .current-flag-frame img,.site-header .current-flag-frame.brand-logo-frame img,.site-header .current-flag-frame.institution-logo-frame img,#header-active-flag{width:76px!important;height:76px!important;max-width:76px!important;max-height:76px!important}.site-header .header-current-copy strong,#header-active-sigla{font-size:clamp(1.85rem,9vw,2.75rem)!important;line-height:.96!important}.site-header .header-current-copy p,#header-active-name{font-size:clamp(.94rem,3.9vw,1.18rem)!important;line-height:1.08!important}.site-header .header-current-copy small,#header-desc{padding:6px 10px!important;font-size:.72rem!important;line-height:1.08!important}.site-header .header-facts-panel{padding:14px!important;border-radius:24px!important}.site-header .header-facts-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.site-header .header-fact,.site-header .header-leadership-item,.site-header .header-update-note{padding:10px!important;border-radius:16px!important}.site-header .header-fact span,.site-header .header-leadership-item span{font-size:.7rem!important;letter-spacing:.08em!important}.site-header .header-fact strong,.site-header .header-leadership-item strong{font-size:.84rem!important;line-height:1.12!important}.site-header .branch-buttons{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media (max-width:390px){.site-header .header-current-identity{grid-template-columns:72px minmax(0,1fr)!important;gap:10px!important;padding:14px!important}.site-header .current-flag-frame,.site-header .current-flag-frame.brand-logo-frame,.site-header .current-flag-frame.institution-logo-frame{width:72px!important;height:72px!important;min-width:72px!important;max-width:72px!important;min-height:72px!important;max-height:72px!important}.site-header .current-flag-frame img,.site-header .current-flag-frame.brand-logo-frame img,.site-header .current-flag-frame.institution-logo-frame img,#header-active-flag{width:66px!important;height:66px!important;max-width:66px!important;max-height:66px!important}.site-header .header-current-copy strong,#header-active-sigla{font-size:clamp(1.55rem,8.4vw,2.25rem)!important}}
    `;
  }

  function aplicar() {
    removerCssExtras();
    removerOverlayZoom();
    inserirCssCabecalho();
  }

  function agendarAplicar(delay = 80) {
    window.clearTimeout(timer);
    timer = window.setTimeout(aplicar, delay);
  }

  function observarCabecalho() {
    if (window.__unisegHeaderRestaurarObserver) return;
    const header = document.querySelector('.site-header');
    if (!header) return;
    const observer = new MutationObserver(() => agendarAplicar(120));
    observer.observe(header, { childList: true, subtree: true });
    window.__unisegHeaderRestaurarObserver = observer;
  }

  aplicar();
  observarCabecalho();
  document.addEventListener('DOMContentLoaded', () => { aplicar(); observarCabecalho(); }, { once: true });
  window.setTimeout(aplicar, 150);
  window.setTimeout(aplicar, 700);
}());
