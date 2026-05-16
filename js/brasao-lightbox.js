/*
  Lightbox global para imagens institucionais.
  - Permite ampliar brasões e o logoleão em qualquer página.
  - Fecha pelo X, clique fora da imagem ou tecla ESC.
  - Usa delegação de eventos para funcionar também com conteúdo renderizado por JS.
*/
(function () {
  'use strict';

  const LIGHTBOX_ID = 'usp-image-lightbox';
  const STYLE_ID = 'usp-image-lightbox-style';
  const IMAGE_SELECTOR = [
    'img.usp-brand__logo',
    '#header-active-flag',
    'img.brasoes-imagem',
    '.brasoes-card-imgbox img',
    '.brasoes-imagem-wrap img',
    '.usp-noticia-card__brasao',
    'img.noticias-brasao',
    'img.guia-artigo-brasao',
    'img[src*="img/LOGO/logoleao"]',
    'img[src*="/LOGO/logoleao"]',
    'img[src*="img/FEDERAL/"]',
    'img[src*="/FEDERAL/"]',
    'img[src*="img/MILITAR/"]',
    'img[src*="/MILITAR/"]',
    'img[src*="img/CIVIL/"]',
    'img[src*="/CIVIL/"]',
    'img[src*="img/BOMBEIRO/"]',
    'img[src*="/BOMBEIRO/"]',
    'img[src*="img/PENAL/"]',
    'img[src*="/PENAL/"]'
  ].join(',');

  let ultimoFocoAntesDoLightbox = null;

  function injetarEstilo() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      body.usp-image-lightbox-open,
      body.brasao-lightbox-open {
        overflow: hidden !important;
      }

      ${IMAGE_SELECTOR} {
        cursor: zoom-in;
      }

      .brasao-header-clickable,
      .usp-image-clickable {
        cursor: zoom-in;
      }

      .usp-image-lightbox,
      .brasao-lightbox {
        position: fixed;
        inset: 0;
        z-index: 2147483000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: clamp(16px, 4vw, 44px);
      }

      .usp-image-lightbox.is-open,
      .brasao-lightbox.is-open {
        display: flex;
      }

      .usp-image-lightbox__backdrop,
      .brasao-lightbox__backdrop {
        position: absolute;
        inset: 0;
        background: rgba(2, 8, 18, .84);
        backdrop-filter: blur(8px);
      }

      .usp-image-lightbox__content,
      .brasao-lightbox__content {
        position: relative;
        z-index: 1;
        max-width: min(94vw, 980px);
        max-height: 92vh;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr) auto;
        gap: 12px;
        justify-items: center;
        padding: clamp(14px, 2vw, 22px);
        border: 1px solid rgba(216, 184, 58, .38);
        border-radius: 18px;
        background: #08111d;
        box-shadow: 0 28px 90px rgba(0, 0, 0, .45);
      }

      .usp-image-lightbox__close,
      .brasao-lightbox__close {
        justify-self: end;
        width: 42px;
        height: 42px;
        border: 1px solid rgba(216, 184, 58, .42);
        border-radius: 999px;
        background: #ffffff;
        color: #08111d;
        font-size: 28px;
        line-height: 1;
        font-weight: 700;
        cursor: pointer;
      }

      .usp-image-lightbox__close:hover,
      .usp-image-lightbox__close:focus-visible,
      .brasao-lightbox__close:hover,
      .brasao-lightbox__close:focus-visible {
        outline: none;
        border-color: #d8b83a;
        box-shadow: 0 0 0 4px rgba(216, 184, 58, .18);
      }

      .usp-image-lightbox__image-frame,
      .brasao-lightbox__image-frame {
        max-width: min(88vw, 860px);
        max-height: 74vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: clamp(12px, 2vw, 26px);
        border-radius: 16px;
        background: #f8fafc;
        border: 1px solid rgba(226, 232, 240, .95);
        overflow: auto;
      }

      .usp-image-lightbox__img,
      .brasao-lightbox__img {
        display: block;
        width: auto;
        height: auto;
        max-width: min(82vw, 760px);
        max-height: 68vh;
        object-fit: contain;
        image-rendering: auto;
      }

      .usp-image-lightbox__caption,
      .brasao-lightbox__caption {
        max-width: min(82vw, 760px);
        margin: 0;
        color: rgba(255, 255, 255, .82);
        font: 500 13px/1.5 Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-align: center;
      }

      @media (max-width: 640px) {
        .usp-image-lightbox,
        .brasao-lightbox {
          padding: 10px;
        }

        .usp-image-lightbox__content,
        .brasao-lightbox__content {
          width: 100%;
          max-width: calc(100vw - 20px);
          padding: 12px;
          border-radius: 14px;
        }

        .usp-image-lightbox__image-frame,
        .brasao-lightbox__image-frame {
          max-width: calc(100vw - 44px);
          max-height: 72vh;
        }

        .usp-image-lightbox__img,
        .brasao-lightbox__img {
          max-width: calc(100vw - 76px);
          max-height: 64vh;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ehImagemAmpliavel(elemento) {
    return Boolean(elemento && elemento.matches && elemento.matches(IMAGE_SELECTOR));
  }

  function closestSeguro(alvo, seletor) {
    if (!alvo) return null;
    const elemento = alvo.nodeType === 1 ? alvo : alvo.parentElement;
    return elemento && elemento.closest ? elemento.closest(seletor) : null;
  }

  function encontrarImagemAmpliavel(alvo) {
    const img = closestSeguro(alvo, 'img');
    return ehImagemAmpliavel(img) ? img : null;
  }

  function garantirLightbox() {
    let lightbox = document.getElementById(LIGHTBOX_ID);
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = LIGHTBOX_ID;
    lightbox.className = 'usp-image-lightbox brasao-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Imagem ampliada');

    lightbox.innerHTML = [
      '<div class="usp-image-lightbox__backdrop brasao-lightbox__backdrop" data-usp-image-close="true"></div>',
      '<div class="usp-image-lightbox__content brasao-lightbox__content" role="document">',
      '  <button type="button" class="usp-image-lightbox__close brasao-lightbox__close" data-usp-image-close="true" aria-label="Fechar imagem ampliada">×</button>',
      '  <div class="usp-image-lightbox__image-frame brasao-lightbox__image-frame">',
      '    <img class="usp-image-lightbox__img brasao-lightbox__img" alt="Imagem ampliada">',
      '  </div>',
      '  <p class="usp-image-lightbox__caption brasao-lightbox__caption">Clique fora da imagem, aperte ESC ou use o botão × para fechar.</p>',
      '</div>'
    ].join('');

    document.body.appendChild(lightbox);
    return lightbox;
  }

  function textoLegenda(imgOrigem) {
    const alt = (imgOrigem.getAttribute('alt') || '').trim();
    const title = (imgOrigem.getAttribute('title') || '').trim();
    const legenda = alt || title || 'Imagem institucional ampliada';
    return legenda.replace(/\s+/g, ' ');
  }

  function abrirLightbox(imgOrigem) {
    if (!imgOrigem) return;

    const src = imgOrigem.currentSrc || imgOrigem.getAttribute('src');
    if (!src) return;

    const lightbox = garantirLightbox();
    const imgAmpliada = lightbox.querySelector('.usp-image-lightbox__img');
    const legenda = lightbox.querySelector('.usp-image-lightbox__caption');
    const botaoFechar = lightbox.querySelector('.usp-image-lightbox__close');
    const texto = textoLegenda(imgOrigem);

    imgAmpliada.src = src;
    imgAmpliada.alt = texto;
    if (legenda) legenda.textContent = `${texto} — clique fora da imagem, aperte ESC ou use o botão × para fechar.`;

    ultimoFocoAntesDoLightbox = document.activeElement;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('usp-image-lightbox-open', 'brasao-lightbox-open');

    if (botaoFechar) botaoFechar.focus({ preventScroll: true });
  }

  function fecharLightbox() {
    const lightbox = document.getElementById(LIGHTBOX_ID);
    if (!lightbox || !lightbox.classList.contains('is-open')) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('usp-image-lightbox-open', 'brasao-lightbox-open');

    const imgAmpliada = lightbox.querySelector('.usp-image-lightbox__img');
    if (imgAmpliada) imgAmpliada.removeAttribute('src');

    if (ultimoFocoAntesDoLightbox && typeof ultimoFocoAntesDoLightbox.focus === 'function') {
      ultimoFocoAntesDoLightbox.focus({ preventScroll: true });
    }
    ultimoFocoAntesDoLightbox = null;
  }

  function prepararImagem(img) {
    if (!ehImagemAmpliavel(img)) return;

    img.classList.add('usp-image-clickable');
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');

    const alt = (img.getAttribute('alt') || '').trim();
    const nome = alt ? `: ${alt}` : '';
    img.setAttribute('aria-label', `Ampliar imagem${nome}`);
    img.setAttribute('title', 'Clique para ampliar a imagem');

    const moldura = img.closest('.current-flag-frame, .usp-brand__mark, .brasoes-card-imgbox, .brasoes-imagem-wrap');
    if (moldura) {
      moldura.classList.add('usp-image-clickable');
      moldura.removeAttribute('aria-hidden');
    }
  }

  function prepararTodasAsImagens(raiz) {
    const escopo = raiz && raiz.querySelectorAll ? raiz : document;
    escopo.querySelectorAll(IMAGE_SELECTOR).forEach(prepararImagem);
  }

  function iniciar() {
    injetarEstilo();
    garantirLightbox();
    prepararTodasAsImagens(document);

    document.addEventListener('click', function (event) {
      if (closestSeguro(event.target, '[data-usp-image-close="true"], [data-brasao-fechar="true"]')) {
        event.preventDefault();
        fecharLightbox();
        return;
      }

      const img = encontrarImagemAmpliavel(event.target);
      if (!img) return;

      event.preventDefault();
      event.stopPropagation();
      abrirLightbox(img);
    }, true);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        fecharLightbox();
        return;
      }

      if (event.key !== 'Enter' && event.key !== ' ') return;
      const img = encontrarImagemAmpliavel(event.target);
      if (!img) return;

      event.preventDefault();
      abrirLightbox(img);
    });

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (ehImagemAmpliavel(node)) prepararImagem(node);
          prepararTodasAsImagens(node);
        });

        if (mutation.type === 'attributes' && mutation.target && mutation.target.tagName === 'IMG') {
          prepararImagem(mutation.target);
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset', 'class', 'alt']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
}());
