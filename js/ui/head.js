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

(function aplicarCardAtualizacaoHome(){
  if (document.getElementById('usp-home-update-card-style')) return;

  const style = document.createElement('style');
  style.id = 'usp-home-update-card-style';
  style.textContent = `
/* Ajuste visual: indicador de atualização solto, discreto e apenas na página inicial. */
.header-update-note.header-fact--dados-atualizados {
  display: none !important;
}

body[data-page="principal"] .header-update-note.header-fact--dados-atualizados {
  position: fixed !important;
  top: max(12px, env(safe-area-inset-top)) !important;
  right: max(12px, env(safe-area-inset-right)) !important;
  z-index: 140 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: auto !important;
  min-width: 0 !important;
  height: 20px !important;
  min-height: 20px !important;
  aspect-ratio: auto !important;
  margin: 0 !important;
  padding: 2px 7px !important;
  border: 1px solid rgba(255,255,255,.13) !important;
  border-radius: 999px !important;
  background: rgba(30,34,42,.72) !important;
  box-shadow: 0 6px 18px rgba(0,0,0,.22) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  opacity: .76 !important;
  pointer-events: none !important;
  text-align: center !important;
}

body[data-page="principal"] .header-update-note.header-fact--dados-atualizados span {
  display: none !important;
}

body[data-page="principal"] .header-update-note.header-fact--dados-atualizados strong {
  display: block !important;
  color: #00c853 !important;
  font-size: 10.5px !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  letter-spacing: .01em !important;
  white-space: nowrap !important;
}

@media (max-width: 760px) {
  body[data-page="principal"] .header-update-note.header-fact--dados-atualizados {
    top: calc(env(safe-area-inset-top) + 82px) !important;
    right: 14px !important;
    height: 18px !important;
    min-height: 18px !important;
    padding: 2px 6px !important;
    opacity: .72 !important;
  }

  body[data-page="principal"] .header-update-note.header-fact--dados-atualizados strong {
    font-size: 9.8px !important;
  }
}

@media (max-width: 390px) {
  body[data-page="principal"] .header-update-note.header-fact--dados-atualizados {
    right: 10px !important;
    height: 17px !important;
    min-height: 17px !important;
    padding: 2px 5px !important;
  }

  body[data-page="principal"] .header-update-note.header-fact--dados-atualizados strong {
    font-size: 9.2px !important;
  }
}
`;
  document.head.appendChild(style);
})();

(function aplicarMenuInferiorMobileMesmoTamanho(){
  if (document.getElementById('usp-mobile-bottom-menu-size-style')) return;

  const style = document.createElement('style');
  style.id = 'usp-mobile-bottom-menu-size-style';
  style.textContent = `
/* Ajuste visual mobile: botão Menu da barra inferior com o mesmo tamanho dos demais. */
@media (max-width: 760px) {
  .app-bottom-nav .menu-btn.app-bottom-item {
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    height: 62px !important;
    min-height: 62px !important;
    aspect-ratio: auto !important;
    padding: 7px 4px !important;
    display: grid !important;
    place-items: center !important;
    align-content: center !important;
    gap: 3px !important;
    border-radius: 17px !important;
  }

  .app-bottom-nav .menu-btn.app-bottom-item .app-bottom-icon,
  .app-bottom-nav .menu-btn.app-bottom-item .app-bottom-label {
    display: block !important;
  }

  .app-bottom-nav .menu-btn.app-bottom-item .app-bottom-icon {
    font-size: 22px !important;
    line-height: 1 !important;
  }

  .app-bottom-nav .menu-btn.app-bottom-item .app-bottom-label {
    max-width: 100% !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
}

@media (max-width: 390px) {
  .app-bottom-nav .menu-btn.app-bottom-item {
    height: 62px !important;
    min-height: 62px !important;
  }

  .app-bottom-nav .menu-btn.app-bottom-item .app-bottom-icon {
    font-size: 20px !important;
  }
}
`;
  document.head.appendChild(style);
})();

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
