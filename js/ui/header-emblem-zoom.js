/* =======================================================
   Cabeçalho original
   Este arquivo era usado para zoom/alteração visual do brasão no mobile.
   Agora ele apenas restaura o cabeçalho padrão e remove ajustes extras.
   ======================================================= */

(function restaurarCabecalhoOriginalViaArquivoLegado() {
  const src = 'js/ui/header-restaurar-original.js?v=20260504headerrestore1';

  function carregar() {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.headerRestore = 'true';
    document.body.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregar, { once: true });
  } else {
    carregar();
  }
}());
