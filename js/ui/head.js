/* =======================================================
   Head do portal — inicialização mínima e carregamento ordenado.
   ======================================================= */

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
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
  img.closest('.produto-imagem, .taf-produto-imagem, .partner-image-slot')?.classList.add('img-indisponivel');
  img.closest('.produto-card, .taf-produto-card')?.classList.add('img-indisponivel');
}

(function carregarComplementosDoPortal() {
  const estilos = [
    'css/site-stability-critical.css?v=20260504stable1',
    'css/liquid-glass-app.css?v=20260504glass2',
    'css/light-soft-gray-theme.css?v=20260504lightgray1',
    'css/sidebar-optimized.css?v=20260504sidebar1',
    'css/sidebar-deduplicate-ads.css?v=20260504dedupe1',
    'css/sidebar-more-products.css?v=20260504moreproducts1',
    'css/produtos-mobile-grid.css?v=20260504prodgrid1',
    'css/reduce-instructions.css?v=20260504instructions1',
    'css/home-hero-title-size.css?v=20260504herotitle1',
    'css/home-remove-duplicate-selector.css?v=20260504homeselector2',
    'css/desktop-navigation-cleanup.css?v=20260504desktopnav1',
    'css/bottom-menu-button-match.css?v=20260504menumatch1'
  ];

  const scripts = [
    'js/ui/site-ui-cleanup.js?v=20260504uiclean1',
    'js/ui/header-restaurar-original.js?v=20260504headerrestore2',
    'js/ui/header-background-dinamico.js?v=20260504headerbg3',
    'js/ui/sidebar-product-thumbs.js?v=20260504thumbs10'
  ];

  function carregarCss(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.unisegComplemento = 'true';
    document.head.appendChild(link);
  }

  function carregarScriptSequencial(index = 0) {
    const src = scripts[index];
    if (!src) return;
    if (document.querySelector(`script[src="${src}"]`)) return carregarScriptSequencial(index + 1);
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.unisegComplemento = 'true';
    script.onload = () => carregarScriptSequencial(index + 1);
    document.body.appendChild(script);
  }

  estilos.forEach(carregarCss);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => carregarScriptSequencial(), { once: true });
  else carregarScriptSequencial();
}());
