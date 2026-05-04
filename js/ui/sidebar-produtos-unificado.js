/* =======================================================
   Sidebar — unifica títulos de produtos.
   Mantém apenas o título público "Produtos" e remove títulos duplicados
   como "Produtos selecionados" e "Mais produtos".
   ======================================================= */

(function unificarTituloProdutosSidebar() {
  const TITULO_FINAL = 'Produtos';
  const PADROES_TITULO = /^(produtos\s+selecionados|mais\s+produtos|produtos)$/i;

  function textoLimpo(el) {
    return String(el?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function ehTituloProduto(el) {
    const texto = textoLimpo(el);
    if (!PADROES_TITULO.test(texto)) return false;
    const sidebar = el.closest('.sidebar, #sidebar, aside');
    if (!sidebar) return false;
    const tag = String(el.tagName || '').toLowerCase();
    const classe = String(el.className || '').toLowerCase();
    return /^(h1|h2|h3|h4|h5|h6|div|span|strong|p)$/.test(tag) || /title|titulo|heading|products/.test(classe);
  }

  function ocultarTitulo(el) {
    el.setAttribute('hidden', '');
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('display', 'none', 'important');
  }

  function aplicar() {
    const sidebars = Array.from(document.querySelectorAll('.sidebar, #sidebar, aside'));
    sidebars.forEach((sidebar) => {
      const titulos = Array.from(sidebar.querySelectorAll('h1,h2,h3,h4,h5,h6,div,span,strong,p')).filter(ehTituloProduto);
      if (!titulos.length) return;

      const tituloPrincipal = titulos.find((el) => /produtos\s+selecionados/i.test(textoLimpo(el))) || titulos[0];
      tituloPrincipal.textContent = TITULO_FINAL;
      tituloPrincipal.removeAttribute('hidden');
      tituloPrincipal.removeAttribute('aria-hidden');
      tituloPrincipal.style.removeProperty('display');

      titulos.forEach((el) => {
        if (el !== tituloPrincipal) ocultarTitulo(el);
      });
    });

    document.querySelectorAll('.sidebar-extra-products-title').forEach((titulo) => {
      const sidebar = titulo.closest('.sidebar, #sidebar, aside');
      const jaExisteTituloProdutos = sidebar && Array.from(sidebar.querySelectorAll('h1,h2,h3,h4,h5,h6,div,span,strong,p'))
        .some((el) => el !== titulo && !el.hidden && textoLimpo(el) === TITULO_FINAL);
      if (jaExisteTituloProdutos) ocultarTitulo(titulo);
      else titulo.textContent = TITULO_FINAL;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicar, { once: true });
  } else {
    aplicar();
  }

  const observer = new MutationObserver(() => window.setTimeout(aplicar, 30));
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.setTimeout(aplicar, 250);
  window.setTimeout(aplicar, 900);
}());
