/* =======================================================
   Zoom mobile do logo/brasão do cabeçalho
   ======================================================= */

(function ativarZoomMobileDoBrasao() {
  const mediaMobile = window.matchMedia('(max-width: 760px)');

  function criarOverlay() {
    let overlay = document.querySelector('.emblem-zoom-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.className = 'emblem-zoom-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Imagem ampliada do brasão ou logo');
    overlay.innerHTML = `
      <div class="emblem-zoom-dialog" role="document">
        <button class="emblem-zoom-close" type="button" aria-label="Fechar imagem ampliada">×</button>
        <div>
          <img class="emblem-zoom-img" alt="" />
          <div class="emblem-zoom-caption"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target.closest('.emblem-zoom-close')) {
        fecharOverlay();
      }
    });

    return overlay;
  }

  function fecharOverlay() {
    const overlay = document.querySelector('.emblem-zoom-overlay');
    if (!overlay) return;

    overlay.classList.remove('is-active');
    document.body.classList.remove('emblem-zoom-open');
    document.body.style.removeProperty('overflow');
  }

  function abrirOverlay(img) {
    if (!img || !mediaMobile.matches) return;

    const overlay = criarOverlay();
    const zoomImg = overlay.querySelector('.emblem-zoom-img');
    const caption = overlay.querySelector('.emblem-zoom-caption');
    const nome = document.querySelector('#header-active-name')?.textContent?.trim();
    const sigla = document.querySelector('#header-active-sigla')?.textContent?.trim();
    const legenda = [sigla, nome].filter(Boolean).join(' — ');

    zoomImg.src = img.currentSrc || img.src;
    zoomImg.alt = img.alt || legenda || 'Brasão ou logo ampliado';
    caption.textContent = legenda || 'Imagem ampliada';

    overlay.classList.add('is-active');
    document.body.classList.add('emblem-zoom-open');
    document.body.style.overflow = 'hidden';
  }

  document.addEventListener('click', (event) => {
    const frame = event.target.closest('.site-header .current-flag-frame');
    if (!frame || !mediaMobile.matches) return;

    const img = frame.querySelector('img');
    if (!img) return;

    event.preventDefault();
    event.stopPropagation();
    abrirOverlay(img);
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') fecharOverlay();
  });
}());
