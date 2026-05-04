/* =======================================================
   Sidebar — vitrine única de produtos.
   Mantém apenas uma seção pública "Produtos" e remove o formato de
   destaque/mais produtos para que todos os cards tenham o mesmo peso.
   ======================================================= */

(function unificarProdutosSidebar() {
  let timerAplicar;

  const PRODUTOS = [
    {
      titulo: 'Mochila Coban Tática 24 L',
      descricao: 'Mochila tática para rotina operacional, estudos e deslocamento diário.',
      href: 'https://s.shopee.com.br/8V5RQXr16n',
      img: 'img/SHOPEE/mochilacoban.webp'
    },
    {
      titulo: 'Mochila tática impermeável 50 L',
      descricao: 'Bolsa reforçada para organização de equipamentos e materiais.',
      href: 'https://s.shopee.com.br/901i8h9IK5',
      img: 'img/SHOPEE/mochilaimpermeavel50l.webp'
    },
    {
      titulo: 'Lanterna LED tática',
      descricao: 'Lanterna recarregável para plantão, camping, pesca e emergências.',
      href: 'https://s.shopee.com.br/9Uy1hagpxm',
      img: 'img/SHOPEE/lanterna.webp'
    },
    {
      titulo: 'Bota tática Acero',
      descricao: 'Calçado resistente para rotina operacional, treino e uso diário.',
      href: 'https://s.shopee.com.br/1qYSZj5bki',
      img: 'img/SHOPEE/botaacero.webp'
    },
    {
      titulo: 'Presilha para cinto tático',
      descricao: 'Acessório para fixação de cinto, coldre e equipamentos leves.',
      href: 'https://s.shopee.com.br/gMdCBBSkJ',
      img: 'img/SHOPEE/presilha.webp'
    },
    {
      titulo: 'Boné tático camuflado',
      descricao: 'Boné para uso casual, treino e atividades ao ar livre.',
      href: 'https://s.shopee.com.br/8Km4Irus3i',
      img: 'img/SHOPEE/bonecaveira.webp'
    },
    {
      titulo: 'Livro de questões PRF',
      descricao: 'Questões comentadas para preparação em carreiras policiais.',
      href: 'https://s.shopee.com.br/1BItze7fTw',
      img: 'img/SHOPEE/prfquestoesalfacon.webp'
    },
    {
      titulo: 'Apostila PF Delegado',
      descricao: 'Material impresso para organização e revisão dos estudos.',
      href: 'https://s.shopee.com.br/10zTo819rd',
      img: 'img/SHOPEE/apostilapfdelegado.webp'
    },
    {
      titulo: 'Relógio digital esportivo',
      descricao: 'Relógio com cronômetro para treino, rotina e atividades externas.',
      href: 'https://s.shopee.com.br/3LNOPp1rnC',
      img: 'img/SHOPEE/relogiotatico.webp'
    },
    {
      titulo: 'Cantil com porta cantil 950 ml',
      descricao: 'Item simples para hidratação em treino, trilha e rotina operacional.',
      href: 'https://s.shopee.com.br/8piKxfAxmV',
      img: 'img/SHOPEE/cantil950.webp'
    },
    {
      titulo: 'Barra fixa para treino',
      descricao: 'Equipamento útil para preparação física e treino de TAF em casa.',
      href: 'https://s.shopee.com.br/9fHIyi0uae',
      img: 'img/SHOPEE/barrafixa01.webp'
    }
  ];

  function escapeHtml(valor) {
    return String(valor ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function ocultar(el) {
    if (!el) return;
    el.setAttribute('hidden', '');
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('display', 'none', 'important');
  }

  function inserirEstilo() {
    if (document.getElementById('sidebar-produtos-unificados-style')) return;
    const style = document.createElement('style');
    style.id = 'sidebar-produtos-unificados-style';
    style.textContent = `
      .sidebar-products-unified{margin:16px 0;padding:14px;border-radius:22px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.045)}
      .sidebar-products-unified-title{margin:0 0 12px;text-align:center;font-family:'Oswald',sans-serif;font-size:.98rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:inherit}
      .sidebar-products-unified-list{display:grid;gap:10px}
      .sidebar-products-unified-card{display:grid;grid-template-columns:72px minmax(0,1fr);gap:12px;align-items:center;padding:12px;border-radius:18px;border:1px solid rgba(255,255,255,.13);background:rgba(10,15,24,.42);color:inherit;text-decoration:none;box-shadow:none!important;min-height:112px}
      .sidebar-products-unified-card:hover{transform:translateY(-1px)}
      .sidebar-products-unified-thumb{width:72px;height:72px;border-radius:16px;overflow:hidden;background:rgba(255,255,255,.92);border:1px solid rgba(255,255,255,.14);display:grid;place-items:center}
      .sidebar-products-unified-thumb img{display:block;width:100%;height:100%;object-fit:contain;padding:5px}
      .sidebar-products-unified-body{display:flex;flex-direction:column;gap:5px;min-width:0}
      .sidebar-products-unified-body strong{font-family:'Roboto Condensed',sans-serif;font-size:.94rem;font-weight:800;line-height:1.08;color:inherit;text-transform:none;letter-spacing:0}
      .sidebar-products-unified-body small{font-size:.78rem;line-height:1.18;opacity:.78;color:inherit}
      .sidebar-products-unified-cta{width:max-content;min-width:58px;margin-top:3px;padding:6px 12px;border-radius:999px;background:#ffd21f;color:#111;font-family:'Oswald',sans-serif;font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;line-height:1}
      .sidebar-products-more-card{grid-template-columns:1fr!important;text-align:center;min-height:94px;background:linear-gradient(135deg,rgba(255,210,31,.18),rgba(255,255,255,.06));border-color:rgba(255,210,31,.42)}
      .sidebar-products-more-card .sidebar-products-unified-body{align-items:center;gap:7px}
      .sidebar-products-more-card strong{font-size:1rem!important;letter-spacing:.03em;text-transform:uppercase}
      .sidebar-products-more-card small{max-width:260px;opacity:.86}
      .sidebar-products-more-card .sidebar-products-unified-cta{font-size:.78rem;padding:8px 16px}
      .sidebar-products-unified-note{margin:12px 2px 0;font-size:.76rem;line-height:1.25;opacity:.72;text-align:center}
      .sidebar .ad-slot--sidebar[hidden],.sidebar .sidebar-ad[hidden],.sidebar .sidebar-extra-products[hidden],.sidebar .sidebar-products-cta[hidden]{display:none!important}
      @media (max-width:760px){.sidebar-products-unified{padding:12px}.sidebar-products-unified-card{grid-template-columns:70px minmax(0,1fr);gap:11px;min-height:108px}.sidebar-products-unified-thumb{width:70px;height:70px}.sidebar-products-unified-body strong{font-size:.92rem}.sidebar-products-unified-body small{font-size:.76rem}.sidebar-products-more-card{grid-template-columns:1fr!important}}
    `;
    document.head.appendChild(style);
  }

  function cardHtml(produto) {
    const base = produto.img.replace(/\.webp$/i, '');
    return `
      <a class="sidebar-products-unified-card" href="${escapeHtml(produto.href)}" target="_blank" rel="sponsored noopener noreferrer" aria-label="Abrir ${escapeHtml(produto.titulo)}">
        <span class="sidebar-products-unified-thumb" aria-hidden="true">
          <img src="${escapeHtml(produto.img)}" data-img-base="${escapeHtml(base)}" alt="" loading="lazy" decoding="async">
        </span>
        <span class="sidebar-products-unified-body">
          <strong>${escapeHtml(produto.titulo)}</strong>
          <small>${escapeHtml(produto.descricao)}</small>
          <span class="sidebar-products-unified-cta">Ver</span>
        </span>
      </a>
    `;
  }

  function maisProdutosHtml() {
    return `
      <a class="sidebar-products-unified-card sidebar-products-more-card" href="produtos.html" aria-label="Ver mais produtos do site">
        <span class="sidebar-products-unified-body">
          <strong>Ver mais produtos do site</strong>
          <small>Abra a vitrine completa com cursos, livros, equipamentos e itens úteis para estudo, treino e rotina operacional.</small>
          <span class="sidebar-products-unified-cta">Abrir vitrine</span>
        </span>
      </a>
    `;
  }

  function vitrineHtml() {
    return `
      <section class="sidebar-products-unified" aria-label="Produtos">
        <h2 class="sidebar-products-unified-title">Produtos</h2>
        <div class="sidebar-products-unified-list">
          ${PRODUTOS.map(cardHtml).join('')}
          ${maisProdutosHtml()}
        </div>
        <p class="sidebar-products-unified-note">Links podem ser comerciais ou afiliados. Confira a página do produto antes de comprar.</p>
      </section>
    `;
  }

  function aplicar() {
    inserirEstilo();
    const sidebar = document.querySelector('.sidebar, #sidebar');
    if (!sidebar) return;

    sidebar.querySelectorAll('.ad-slot--sidebar, .sidebar-ad, .sidebar-extra-products, .sidebar-products-cta').forEach(ocultar);

    let vitrine = sidebar.querySelector('.sidebar-products-unified');
    if (!vitrine) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = vitrineHtml();
      vitrine = wrapper.firstElementChild;
      const social = sidebar.querySelector('.sidebar-social');
      const nav = sidebar.querySelector('.sidebar-nav');
      const primeiroAntigo = sidebar.querySelector('.ad-slot--sidebar, .sidebar-ad, .sidebar-extra-products');
      if (social) social.insertAdjacentElement('afterend', vitrine);
      else if (primeiroAntigo) primeiroAntigo.insertAdjacentElement('beforebegin', vitrine);
      else if (nav) nav.insertAdjacentElement('afterend', vitrine);
      else sidebar.appendChild(vitrine);
    }
  }

  function agendarAplicar(delay = 80) {
    window.clearTimeout(timerAplicar);
    timerAplicar = window.setTimeout(aplicar, delay);
  }

  function observarSidebar() {
    if (window.__unisegSidebarProdutosObserver) return;
    const sidebar = document.querySelector('.sidebar, #sidebar');
    if (!sidebar) return;
    const observer = new MutationObserver(() => agendarAplicar(100));
    observer.observe(sidebar, { childList: true, subtree: true });
    window.__unisegSidebarProdutosObserver = observer;
  }

  function iniciar() {
    aplicar();
    observarSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }

  window.setTimeout(iniciar, 250);
  window.setTimeout(aplicar, 900);
}());
