/* =======================================================
   JavaScript de inicialização extraído do index.html
   Inclui analytics, tema inicial e funções necessárias antes do carregamento das imagens.
   ======================================================= */

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){
  window.dataLayer.push(arguments);
};

window.gtag('js', new Date());
window.gtag('config', 'G-XHR4TCCF9D');
window.gtag('config', 'AW-18121830612');
window.gtag('event', 'conversion', {'send_to': 'AW-18121830612/GtZCCJSGh6McENThlMFD'});

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

function carregarImagemProduto(img) {
  if (!img) return;

  const original = img.dataset.imgBase || img.getAttribute('src') || '';
  const base = String(original).replace(/\.(webp|png|jpe?g)$/i, '');
  const extensoes = ['webp'];
  let tentativaAtual = Number(img.dataset.tentativa || 0);
  const srcAtual = String(img.getAttribute('src') || '');

  while (tentativaAtual < extensoes.length) {
    const proxima = `${base}.${extensoes[tentativaAtual]}`;
    tentativaAtual += 1;
    img.dataset.tentativa = String(tentativaAtual);

    if (!srcAtual.endsWith(proxima)) {
      img.src = proxima;
      return;
    }
  }

  const fallback = img.dataset.imgFallback || '';
  if (fallback && img.dataset.fallbackTentado !== 'true') {
    img.dataset.fallbackTentado = 'true';
    img.src = fallback;
    return;
  }

  img.style.display = 'none';
  const container = img.closest('.produto-imagem, .taf-produto-imagem, .partner-image-slot');
  if (container) container.classList.add('img-indisponivel');

  const card = img.closest('.produto-card, .taf-produto-card');
  if (card) card.classList.add('img-indisponivel');
}

/* =======================================================
   Tema visual extra — Liquid Glass App
   Carregado depois dos links CSS estáticos para garantir precedência.
   ======================================================= */
(function carregarTemaLiquidGlassApp() {
  const estilos = [
    'css/liquid-glass-app.css?v=20260504glass2',
    'css/light-soft-gray-theme.css?v=20260504lightgray1',
    'css/header-mobile-emblem.css?v=20260504emblem1',
    'css/header-unified-layout.css?v=20260504headerunified1',
    'css/sidebar-optimized.css?v=20260504sidebar1'
  ];

  function ajustarTextosDoCabecalho() {
    document.querySelectorAll('.header-inst-selector label, .sidebar-inst-panel label').forEach((label) => {
      label.textContent = 'Escolha instituição';
    });

    document.querySelectorAll('#instituicao_header option[value=""], #instituicao option[value=""]').forEach((option) => {
      option.textContent = 'Escolha instituição';
    });

    document.querySelectorAll('.sidebar-selector-hint, .sidebar-independent-note').forEach((elemento) => {
      elemento.remove();
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
    if (social && primeiroAnuncio) {
      sidebar.insertBefore(social, primeiroAnuncio);
    }

    sidebar.dataset.sidebarOptimized = 'true';
  }

  function aplicarTema() {
    estilos.forEach((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.liquidGlassApp = 'true';
      document.head.appendChild(link);
    });

    ajustarTextosDoCabecalho();
    reorganizarSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicarTema, { once: true });
  } else {
    aplicarTema();
  }
}());
