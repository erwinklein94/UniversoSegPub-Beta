/* =======================================================
   Carregador dos ajustes extras do portal.
   Mantém a ordem de dependência e evita recriar blocos antigos da sidebar.
   ======================================================= */

(function carregarAtualizacoesExtrasPortal() {
  const fontes = [
    'js/data/prf-atualizacao-2026.js?v=20260504prf2',
    'js/data/prf-ajustes-finais-2026.js?v=20260504prf1',
    'js/data/comparador-federais-fix.js?v=20260504fed1',
    'js/ui/sidebar-produtos-unificado.js?v=20260504produtos3',
    'js/ui/site-revisao-geral.js?v=20260504review1'
  ];

  function carregarSequencia(index = 0) {
    const src = fontes[index];
    if (!src) return;

    if (document.querySelector(`script[src="${src}"]`)) {
      carregarSequencia(index + 1);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.unisegExtra = 'true';
    script.onload = () => carregarSequencia(index + 1);
    document.body.appendChild(script);
  }

  const carregar = () => carregarSequencia();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregar, { once: true });
  } else {
    carregar();
  }
}());
