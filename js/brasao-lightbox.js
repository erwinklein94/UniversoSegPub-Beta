/*
  Ampliação dos brasões do cabeçalho e da aba "Brasões e história".
  - Mantém a imagem do brasão grande no cabeçalho.
  - Ao clicar no brasão do cabeçalho ou da página informativa, abre uma visualização ampliada.
  - Fecha pelo botão, clique fora da imagem ou tecla ESC.
*/
(function () {
  'use strict';

  const HEADER_BRASAO_SELECTOR = '#header-active-flag';
  const PAGE_BRASAO_SELECTOR = '.brasoes-imagem';
  const BRASAO_INTERATIVO_SELECTOR = `${HEADER_BRASAO_SELECTOR}, ${PAGE_BRASAO_SELECTOR}`;
  const LIGHTBOX_ID = 'brasao-lightbox';

  let ultimoFocoAntesDoLightbox = null;

  function getImagemCabecalho() {
    return document.querySelector(HEADER_BRASAO_SELECTOR);
  }

  function prepararImagemInterativa(img, origem = 'brasão') {
    if (!img) return;
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', img.getAttribute('aria-label') || `Ampliar imagem do ${origem}`);
    img.setAttribute('title', img.getAttribute('title') || 'Clique para ampliar o brasão');
    img.classList.add('brasao-clickable-img');
  }

  function prepararImagemCabecalho() {
    const img = getImagemCabecalho();
    if (!img) return;

    const moldura = img.closest('.current-flag-frame');
    if (moldura) {
      moldura.removeAttribute('aria-hidden');
      moldura.classList.add('brasao-header-clickable');
    }

    prepararImagemInterativa(img, 'brasão no cabeçalho');
  }

  function prepararImagensDaPagina() {
    document.querySelectorAll(PAGE_BRASAO_SELECTOR).forEach(img => prepararImagemInterativa(img, 'brasão da instituição'));
  }

  function garantirLightbox() {
    let lightbox = document.getElementById(LIGHTBOX_ID);
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = LIGHTBOX_ID;
    lightbox.className = 'brasao-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Imagem ampliada do brasão');

    lightbox.innerHTML = [
      '<div class="brasao-lightbox__backdrop" data-brasao-fechar="true"></div>',
      '<div class="brasao-lightbox__content" role="document">',
      '  <button type="button" class="brasao-lightbox__close" data-brasao-fechar="true" aria-label="Fechar imagem ampliada">×</button>',
      '  <img class="brasao-lightbox__img" alt="Imagem ampliada do brasão">',
      '  <p class="brasao-lightbox__caption">Clique fora da imagem, use ESC ou o botão × para fechar.</p>',
      '</div>'
    ].join('');

    document.body.appendChild(lightbox);
    return lightbox;
  }

  function abrirLightbox(imgOrigem) {
    if (!imgOrigem || (!imgOrigem.currentSrc && !imgOrigem.src)) return;

    const lightbox = garantirLightbox();
    const imgAmpliada = lightbox.querySelector('.brasao-lightbox__img');
    const botaoFechar = lightbox.querySelector('.brasao-lightbox__close');

    imgAmpliada.src = imgOrigem.currentSrc || imgOrigem.src;
    imgAmpliada.alt = imgOrigem.alt || 'Imagem ampliada do brasão';

    ultimoFocoAntesDoLightbox = document.activeElement;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('brasao-lightbox-open');

    if (botaoFechar) botaoFechar.focus({ preventScroll: true });
  }

  function fecharLightbox() {
    const lightbox = document.getElementById(LIGHTBOX_ID);
    if (!lightbox || !lightbox.classList.contains('is-open')) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('brasao-lightbox-open');

    if (ultimoFocoAntesDoLightbox && typeof ultimoFocoAntesDoLightbox.focus === 'function') {
      ultimoFocoAntesDoLightbox.focus({ preventScroll: true });
    }
  }

  function iniciar() {
    prepararImagemCabecalho();
    prepararImagensDaPagina();
    garantirLightbox();

    document.addEventListener('click', function (event) {
      const imgBrasao = event.target.closest && event.target.closest(BRASAO_INTERATIVO_SELECTOR);
      if (imgBrasao) {
        event.preventDefault();
        abrirLightbox(imgBrasao);
        return;
      }

      if (event.target.closest('[data-brasao-fechar="true"]')) {
        event.preventDefault();
        fecharLightbox();
      }
    });

    document.addEventListener('keydown', function (event) {
      const imgBrasao = event.target.closest && event.target.closest(BRASAO_INTERATIVO_SELECTOR);
      if (imgBrasao && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        abrirLightbox(imgBrasao);
        return;
      }

      if (event.key === 'Escape') fecharLightbox();
    });

    const img = getImagemCabecalho();
    if (img) {
      const observer = new MutationObserver(prepararImagemCabecalho);
      observer.observe(img, { attributes: true, attributeFilter: ['src', 'alt', 'class'] });
    }

    const pageObserver = new MutationObserver(prepararImagensDaPagina);
    pageObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
}());
