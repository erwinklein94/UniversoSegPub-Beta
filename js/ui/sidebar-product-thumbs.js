(function carregarAtualizacoesExtrasPortal() {
  function carregarCssEstabilidade() {
    const href = 'css/site-stability-critical.css?v=20260504stable1';
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  const fontes = [
    'js/data/prf-atualizacao-2026.js?v=20260504prf2',
    'js/data/prf-ajustes-finais-2026.js?v=20260504prf1',
    'js/data/comparador-federais-fix.js?v=20260504fed1',
    'js/ui/sidebar-produtos-unificado.js?v=20260504produtos3',
    'js/ui/site-revisao-geral.js?v=20260504review3'
  ];

  function carregarSequencia(index = 0) {
    const src = fontes[index];
    if (!src) return;
    if (document.querySelector(`script[src="${src}"]`)) return carregarSequencia(index + 1);
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.unisegExtra = 'true';
    script.onload = () => carregarSequencia(index + 1);
    document.body.appendChild(script);
  }

  const carregar = () => {
    carregarCssEstabilidade();
    carregarSequencia();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', carregar, { once: true });
  else carregar();
}());
