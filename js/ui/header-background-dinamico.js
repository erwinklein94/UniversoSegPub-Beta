/* =======================================================
   Cabeçalho — fundo dinâmico e brasão centralizado.
   Página inicial: logo do leão.
   Instituição selecionada: bandeira do estado ou Brasil para PF/PRF/GM.
   ======================================================= */

(function ajustarFundoDinamicoCabecalho() {
  const LOGO_LEAO = 'img/LOGO/logoleao.webp';
  const BANDEIRA_BRASIL = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Brazil.svg';
  let aplicarTimer;

  function estaNoModoInicial() {
    const selectHeader = document.getElementById('instituicao_header');
    const selectSidebar = document.getElementById('instituicao');
    const textoSigla = String(document.getElementById('header-active-sigla')?.textContent || '').trim().toLowerCase();
    const bodyInst = String(document.body?.dataset?.inst || document.body?.dataset?.instituicao || '').trim().toLowerCase();
    const page = String(document.body?.dataset?.page || '').trim().toLowerCase();
    return (!selectHeader?.value && !selectSidebar?.value && (textoSigla === 'universo' || bodyInst === 'portal' || page === 'principal'));
  }

  function getInstituicaoSelecionada() {
    const selectHeader = document.getElementById('instituicao_header')?.value;
    const selectSidebar = document.getElementById('instituicao')?.value;
    const bodyInst = document.body?.dataset?.instituicao || document.body?.dataset?.inst;
    if (selectHeader) return String(selectHeader).trim().toLowerCase();
    if (selectSidebar) return String(selectSidebar).trim().toLowerCase();
    if (bodyInst && bodyInst !== 'portal') return String(bodyInst).trim().toLowerCase();
    if (estaNoModoInicial()) return '';
    return String(typeof currInst !== 'undefined' ? currInst : '').trim().toLowerCase();
  }

  function isGuardaMunicipal(inst) {
    return /^gm/.test(inst) || /^gcm/.test(inst) || /guarda/.test(inst);
  }

  function isFederalBrasil(inst) {
    return inst === 'pf' || inst === 'prf' || isGuardaMunicipal(inst);
  }

  function getEstadoDaInst(inst) {
    if (!inst) return '';
    if (typeof getEstadoDaInstituicao === 'function') {
      const estado = getEstadoDaInstituicao(inst);
      if (estado) return estado;
    }

    if (typeof HEADER_ESTADOS !== 'undefined') {
      const estado = Object.keys(HEADER_ESTADOS).find((uf) => {
        const dados = HEADER_ESTADOS[uf] || {};
        return Object.values(dados).some((valor) => String(valor || '').toLowerCase() === inst);
      });
      if (estado) return estado;
    }

    const finalUf = inst.slice(-2);
    if (typeof HEADER_ESTADOS !== 'undefined' && HEADER_ESTADOS[finalUf]) return finalUf;
    return '';
  }

  function getImagemFundo(inst) {
    if (!inst) return LOGO_LEAO;
    if (isFederalBrasil(inst)) return BANDEIRA_BRASIL;
    const estado = getEstadoDaInst(inst);
    if (estado && typeof HEADER_ESTADOS !== 'undefined' && HEADER_ESTADOS[estado]?.flag) return HEADER_ESTADOS[estado].flag;
    return LOGO_LEAO;
  }

  function setCssUrl(el, variavel, url) {
    if (!el || !variavel) return;
    const segura = String(url || LOGO_LEAO).replace(/["\\]/g, '\\$&');
    el.style.setProperty(variavel, `url("${segura}")`);
  }

  function inserirEstilo() {
    let style = document.getElementById('header-background-dinamico-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'header-background-dinamico-style';
      document.head.appendChild(style);
    }

    style.textContent = `
      .site-header .header-institution-card {
        position: relative !important;
        isolation: isolate !important;
        overflow: hidden !important;
        background:
          radial-gradient(circle at 18% 18%, rgba(255,210,31,.18), transparent 32%),
          linear-gradient(145deg, rgba(12,18,30,.88), rgba(6,10,16,.82)),
          var(--uniseg-header-bg-dynamic, url('img/LOGO/logoleao.webp')) center center / cover no-repeat !important;
      }
      .site-header .header-institution-card::before {
        content: '' !important;
        position: absolute !important;
        inset: 0 !important;
        z-index: -2 !important;
        display: block !important;
        background: var(--uniseg-header-bg-dynamic, url('img/LOGO/logoleao.webp')) center center / cover no-repeat !important;
        opacity: .28 !important;
        filter: blur(1px) saturate(.95) brightness(.82) !important;
        transform: scale(1.08) !important;
        pointer-events: none !important;
      }
      .site-header .header-institution-card::after {
        content: '' !important;
        position: absolute !important;
        inset: 0 !important;
        z-index: -1 !important;
        display: block !important;
        background:
          linear-gradient(90deg, rgba(8,12,20,.92), rgba(12,18,30,.78)),
          radial-gradient(circle at 78% 10%, rgba(255,210,31,.14), transparent 30%) !important;
        pointer-events: none !important;
      }
      .site-header .header-current-identity,
      .site-header .header-facts-panel,
      .site-header .header-inst-selector,
      .site-header .header-branch-switcher {
        position: relative !important;
        z-index: 1 !important;
      }
      .site-header .header-current-identity { background: linear-gradient(145deg, rgba(18,25,38,.74), rgba(8,12,20,.62)) !important; }
      .site-header .current-flag-frame,
      .site-header .current-flag-frame.brand-logo-frame,
      .site-header .current-flag-frame.institution-logo-frame {
        display: grid !important;
        place-items: center !important;
        align-self: center !important;
        justify-self: center !important;
        overflow: hidden !important;
        padding: 8px !important;
        background: rgba(0,0,0,.42) !important;
      }
      .site-header .current-flag-frame img,
      .site-header .current-flag-frame.brand-logo-frame img,
      .site-header .current-flag-frame.institution-logo-frame img,
      #header-active-flag {
        display: block !important;
        margin: auto !important;
        object-fit: contain !important;
        object-position: center center !important;
        transform: none !important;
        max-width: 100% !important;
        max-height: 100% !important;
      }
      @media (max-width: 760px) {
        .site-header .header-institution-card::before { opacity: .24 !important; transform: scale(1.12) !important; }
        .site-header .current-flag-frame,
        .site-header .current-flag-frame.brand-logo-frame,
        .site-header .current-flag-frame.institution-logo-frame { padding: 7px !important; }
      }
    `;
  }

  function aplicar() {
    window.clearTimeout(aplicarTimer);
    aplicarTimer = window.setTimeout(() => {
      inserirEstilo();
      const inst = getInstituicaoSelecionada();
      const fundo = getImagemFundo(inst);
      const card = document.querySelector('.site-header .header-institution-card');
      const header = document.querySelector('.site-header');
      setCssUrl(card, '--uniseg-header-bg-dynamic', fundo);
      setCssUrl(header, '--uniseg-header-bg-dynamic', fundo);
      setCssUrl(document.body, '--uniseg-header-bg-dynamic', fundo);
      if (card) {
        card.dataset.headerBgMode = inst ? 'instituicao' : 'inicio';
        card.dataset.headerBgInst = inst || 'inicio';
      }
    }, 40);
  }

  function observarPontualmente() {
    if (window.__unisegHeaderBgObserver) return;
    const observer = new MutationObserver(aplicar);
    const alvos = [
      document.body,
      document.querySelector('.site-header'),
      document.getElementById('header-active-sigla'),
      document.getElementById('instituicao_header'),
      document.getElementById('instituicao')
    ].filter(Boolean);
    if (!alvos.length) return;
    alvos.forEach((alvo) => observer.observe(alvo, { childList: true, subtree: false, attributes: true, attributeFilter: ['data-instituicao', 'data-inst', 'value'] }));
    window.__unisegHeaderBgObserver = observer;
  }

  aplicar();
  observarPontualmente();
  document.addEventListener('DOMContentLoaded', () => {
    aplicar();
    observarPontualmente();
  }, { once: true });
  document.addEventListener('change', (event) => {
    if (event.target && /^(instituicao|instituicao_header)$/.test(event.target.id || '')) aplicar();
  }, true);
  window.setTimeout(aplicar, 250);
  window.setTimeout(aplicar, 900);
}());
