/* Funções pequenas carregadas cedo para evitar erro em imagens com fallback. */
(function () {
  const EXTENSOES = ['png', 'jpg', 'jpeg', 'webp'];

  function trocarImagemComFallback(img) {
    if (!img) return;

    const baseOriginal = img.dataset.imgBase || img.getAttribute('src') || '';
    const base = baseOriginal.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '');
    const tentativaAtual = Number(img.dataset.tentativa || 0);

    if (base && tentativaAtual < EXTENSOES.length) {
      img.dataset.tentativa = String(tentativaAtual + 1);
      img.src = `${base}.${EXTENSOES[tentativaAtual]}`;
      return;
    }

    img.style.display = 'none';

    const produto = img.closest('.produto-imagem, .taf-produto-card, .sidebar-product');
    if (produto) {
      produto.classList.add('img-indisponivel');
    }
  }

  function trocarImagemCabecalhoInstituicao(img) {
    if (!img) return;

    const fallbackSrc = img.dataset.fallbackSrc || '';
    const fallbackAlt = img.dataset.fallbackAlt || 'Bandeira do estado da instituição';
    const jaAplicouFallback = img.dataset.fallbackAplicado === 'true';

    if (fallbackSrc && !jaAplicouFallback) {
      img.dataset.fallbackAplicado = 'true';
      img.alt = fallbackAlt;
      img.src = fallbackSrc;

      const moldura = img.closest('.current-flag-frame');
      if (moldura) {
        moldura.classList.remove('institution-logo-frame', 'brand-logo-frame');
        moldura.classList.add('state-flag-fallback-frame');
      }
      return;
    }

    img.style.display = 'none';
  }

  window.carregarImagemProduto = trocarImagemComFallback;
  window.carregarImagemComFallback = trocarImagemComFallback;
  window.carregarImagemHeaderInstituicao = trocarImagemCabecalhoInstituicao;
})();
