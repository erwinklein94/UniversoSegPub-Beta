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
/* Ajuste visual: indicador de atualização apenas no cabeçalho inicial do portal. */
.header-update-note.header-fact--dados-atualizados {
  display: none !important;
}

body[data-page="principal"][data-inst="portal"] .header-update-note.header-fact--dados-atualizados {
  display: grid !important;
  grid-template-columns: 1fr !important;
  place-items: center !important;
  gap: 4px !important;
  width: clamp(64px, 5.6vw, 76px) !important;
  min-width: clamp(64px, 5.6vw, 76px) !important;
  aspect-ratio: 1 / 1 !important;
  margin: 8px 0 0 auto !important;
  padding: 8px 7px !important;
  border: 1px solid var(--usp-summary-divider) !important;
  border-radius: 16px !important;
  background: var(--usp-summary-sheet-bg) !important;
  box-shadow: none !important;
  opacity: .94 !important;
  text-align: center !important;
}

body[data-page="principal"][data-inst="portal"] .header-update-note.header-fact--dados-atualizados span {
  display: block !important;
  margin: 0 !important;
  color: var(--usp-summary-muted) !important;
  font-size: 6.4px !important;
  font-weight: 800 !important;
  line-height: 1.04 !important;
  letter-spacing: .055em !important;
  text-transform: uppercase !important;
}

body[data-page="principal"][data-inst="portal"] .header-update-note.header-fact--dados-atualizados strong {
  display: block !important;
  justify-self: center !important;
  color: #00c853 !important;
  font-size: clamp(15px, 1.35vw, 18px) !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  white-space: nowrap !important;
}

@media (max-width: 820px) {
  body[data-page="principal"][data-inst="portal"] .header-update-note.header-fact--dados-atualizados {
    width: 66px !important;
    min-width: 66px !important;
    margin-top: 7px !important;
    padding: 7px 6px !important;
    border-radius: 15px !important;
  }

  body[data-page="principal"][data-inst="portal"] .header-update-note.header-fact--dados-atualizados span {
    font-size: 5.9px !important;
  }

  body[data-page="principal"][data-inst="portal"] .header-update-note.header-fact--dados-atualizados strong {
    font-size: 15px !important;
  }
}

@media (max-width: 480px) {
  body[data-page="principal"][data-inst="portal"] .header-update-note.header-fact--dados-atualizados {
    width: 62px !important;
    min-width: 62px !important;
    padding: 6px 5px !important;
    border-radius: 14px !important;
  }

  body[data-page="principal"][data-inst="portal"] .header-update-note.header-fact--dados-atualizados span {
    font-size: 5.5px !important;
  }

  body[data-page="principal"][data-inst="portal"] .header-update-note.header-fact--dados-atualizados strong {
    font-size: 14px !important;
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
