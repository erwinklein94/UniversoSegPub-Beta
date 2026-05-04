/* =======================================================
   Miniaturas reais nos produtos extras da sidebar
   Remove emojis visuais e usa imagens dos produtos.
   ======================================================= */

(function aplicarMiniaturasReaisNaSidebar() {
  const miniaturas = [
    {
      src: 'img/SHOPEE/mochilaimpermeavel50l.webp',
      alt: 'Mochila tática impermeável'
    },
    {
      src: 'img/SHOPEE/lanterna.webp',
      alt: 'Lanterna LED tática'
    },
    {
      src: 'img/SHOPEE/botaacero.webp',
      alt: 'Bota tática Acero'
    },
    {
      src: 'img/SHOPEE/presilha.webp',
      alt: 'Presilha para cinto tático'
    },
    {
      src: 'img/SHOPEE/bonecaveira.webp',
      alt: 'Boné tático camuflado'
    },
    {
      src: 'img/SHOPEE/prfquestoesalfacon.webp',
      alt: 'Livro de questões PRF'
    },
    {
      src: 'img/SHOPEE/apostilapfdelegado.webp',
      alt: 'Apostila para Delegado da Polícia Federal'
    },
    {
      src: 'img/SHOPEE/relogiotatico.webp',
      alt: 'Relógio digital esportivo'
    },
    {
      src: 'img/SHOPEE/cantil950.webp',
      alt: 'Cantil com porta cantil'
    },
    {
      src: 'img/SHOPEE/barrafixa01.webp',
      alt: 'Barra fixa para treino'
    }
  ];

  function aplicar() {
    document.querySelectorAll('.sidebar-extra-products .sidebar-extra-product').forEach((produto, index) => {
      const dados = miniaturas[index];
      if (!dados || produto.querySelector('.sidebar-extra-product-thumb img')) return;

      const emoji = produto.querySelector('.sidebar-extra-product-icon');
      const thumb = document.createElement('span');
      thumb.className = 'sidebar-extra-product-thumb';
      thumb.setAttribute('aria-hidden', 'true');
      thumb.innerHTML = `<img src="${dados.src}" alt="" loading="lazy" decoding="async" data-img-base="${dados.src.replace(/\.webp$/i, '')}">`;

      if (emoji) {
        emoji.replaceWith(thumb);
      } else {
        produto.prepend(thumb);
      }

      const nome = produto.querySelector('strong')?.textContent?.trim();
      if (nome) produto.setAttribute('aria-label', nome);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicar, { once: true });
  } else {
    aplicar();
  }

  const observer = new MutationObserver(aplicar);
  observer.observe(document.documentElement, { childList: true, subtree: true });
}());

(function carregarAtualizacoesExtrasPortal() {
  const fontes = [
    'js/data/prf-atualizacao-2026.js?v=20260504prf2',
    'js/data/prf-ajustes-finais-2026.js?v=20260504prf1',
    'js/data/comparador-federais-fix.js?v=20260504fed1',
    'js/ui/sidebar-produtos-unificado.js?v=20260504produtos2'
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
