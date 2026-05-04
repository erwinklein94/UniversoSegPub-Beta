(function aplicarAjustesFinaisPRF2026() {
  let timer;

  function getInstSelecionada() {
    const selectHeader = document.getElementById('instituicao_header')?.value;
    const selectSidebar = document.getElementById('instituicao')?.value;
    if (selectHeader) return String(selectHeader).toLowerCase();
    if (selectSidebar) return String(selectSidebar).toLowerCase();
    if (typeof currInst !== 'undefined' && currInst) return String(currInst).toLowerCase();
    return '';
  }

  function fmtBRL(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function escapeHtml(valor) {
    return String(valor ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function getLinhasPRF() {
    if (Array.isArray(window.UNISEG_REMUNERACAO_PRF_2026) && window.UNISEG_REMUNERACAO_PRF_2026.length) {
      return window.UNISEG_REMUNERACAO_PRF_2026.map(([cargo, valor]) => ({ cargo, valor }));
    }

    return [
      ['Classe Especial — Padrão III', 23000.00],
      ['Classe Especial — Padrão II', 22249.43],
      ['Classe Especial — Padrão I', 21524.32],
      ['Primeira Classe — Padrão VI', 20306.21],
      ['Primeira Classe — Padrão V', 19649.56],
      ['Primeira Classe — Padrão IV', 19015.88],
      ['Primeira Classe — Padrão III', 18404.39],
      ['Primeira Classe — Padrão II', 17814.28],
      ['Primeira Classe — Padrão I', 17244.77],
      ['Segunda Classe — Padrão VI', 15949.32],
      ['Segunda Classe — Padrão V', 15704.54],
      ['Segunda Classe — Padrão IV', 15463.72],
      ['Segunda Classe — Padrão III', 15226.76],
      ['Segunda Classe — Padrão II', 14993.63],
      ['Segunda Classe — Padrão I', 14764.25],
      ['Terceira Classe — Padrão III', 12630.98],
      ['Terceira Classe — Padrão II', 12440.90],
      ['Terceira Classe — Padrão I', 12253.84]
    ].map(([cargo, valor]) => ({ cargo, valor }));
  }

  function aplicarEstiloRemuneracaoMobilePRF() {
    if (document.getElementById('prf-remuneracao-mobile-style')) return;
    const style = document.createElement('style');
    style.id = 'prf-remuneracao-mobile-style';
    style.textContent = `
      .prf-remuneracao-mobile-list{display:grid;gap:10px;margin-top:8px;width:100%}
      .prf-remuneracao-mobile-row{display:grid;gap:4px;padding:12px;border-radius:14px;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.13)}
      .prf-remuneracao-mobile-row strong{font-size:.95rem;line-height:1.25;color:inherit}
      .prf-remuneracao-mobile-row span{font-size:1.08rem;font-weight:800;color:inherit}
      .prf-remuneracao-mobile-fonte{display:block;margin-top:10px;font-size:.82rem;line-height:1.35;opacity:.82}
    `;
    document.head.appendChild(style);
  }

  function htmlRemuneracaoMobilePRF() {
    return `
      <div class="prf-remuneracao-mobile-list" aria-label="Remuneração dos cargos da PRF 2026">
        ${getLinhasPRF().map((linha) => `
          <div class="prf-remuneracao-mobile-row">
            <strong>${escapeHtml(linha.cargo)}</strong>
            <span>${fmtBRL(linha.valor)}</span>
          </div>
        `).join('')}
        <small class="prf-remuneracao-mobile-fonte">Fonte: Lei nº 14.875/2024, Anexo XXVII — vigência financeira em 01/05/2026. Benefícios e indenizações não somados ao subsídio.</small>
      </div>
    `;
  }

  function corrigirCardMobileRemuneracaoPRF() {
    if (getInstSelecionada() !== 'prf') return;
    if (document.querySelector('.prf-remuneracao-mobile-list')) return;

    aplicarEstiloRemuneracaoMobilePRF();
    const marcador = 'Escolha uma instituição nesta aba para carregar a tabela';
    const raiz = document.getElementById('page-remuneracao') || document.querySelector('main') || document.body;
    const elementos = Array.from(raiz.querySelectorAll('p,span,div,td,li,article,section'))
      .filter((el) => !el.closest('.prf-remuneracao-mobile-list'))
      .filter((el) => (el.textContent || '').includes(marcador));

    elementos.forEach((el) => {
      const texto = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (texto.length > 220 && !/^Cargo\s*\/\s*Classe/i.test(texto)) return;
      el.innerHTML = htmlRemuneracaoMobilePRF();
      el.dataset.prfMobileCorrigido = 'true';
    });
  }

  function aplicarDadosPublicos() {
    if (window.UNISEG_PRF_2026) {
      window.UNISEG_PRF_2026.instituicao.extensaoMalha = '75 mil+ km de rodovias federais · fonte PRF';
      window.UNISEG_PRF_2026.concursos.previsao = 'Sem edital novo publicado · fonte PRF/2026';
    }

    if (typeof HEADER_INSTITUICOES_RESUMO !== 'undefined' && HEADER_INSTITUICOES_RESUMO.prf) {
      HEADER_INSTITUICOES_RESUMO.prf.fonte = 'PRF; Portal da Transparência; Planalto; Portal do Servidor/MGI';
      HEADER_INSTITUICOES_RESUMO.prf.atualizado = 'Referência: PRF/2025 · Lei 14.875/2024 com vigência em 01/05/2026';
    }

    if (typeof CONCURSOS !== 'undefined' && CONCURSOS.prf) {
      CONCURSOS.prf.previsao = 'Sem edital novo publicado · fonte PRF/2026';
    }
  }

  function aplicar() {
    aplicarDadosPublicos();
    if (getInstSelecionada() === 'prf') {
      const headerFonte = document.getElementById('header-resumo-dados-atualizados');
      if (headerFonte) headerFonte.textContent = 'Fontes: PRF/2025 · Portal da Transparência · Lei 14.875/2024';
      corrigirCardMobileRemuneracaoPRF();
    }
  }

  function agendarAplicar(delay = 120) {
    window.clearTimeout(timer);
    timer = window.setTimeout(aplicar, delay);
  }

  function observarAlvos() {
    if (window.__unisegPrfAjustesObserver) return;
    const alvos = [
      document.getElementById('page-remuneracao'),
      document.getElementById('instituicao'),
      document.getElementById('instituicao_header')
    ].filter(Boolean);
    if (!alvos.length) return;

    const observer = new MutationObserver(() => agendarAplicar(160));
    alvos.forEach((alvo) => observer.observe(alvo, { childList: true, subtree: true, attributes: true, attributeFilter: ['value'] }));
    window.__unisegPrfAjustesObserver = observer;
  }

  aplicar();
  observarAlvos();
  document.addEventListener('DOMContentLoaded', () => { aplicar(); observarAlvos(); }, { once: true });
  document.addEventListener('change', (event) => {
    if (event.target && /^(instituicao|instituicao_header|comparador-instituicao)$/.test(event.target.id || '')) agendarAplicar(80);
  }, true);
  window.setTimeout(aplicar, 250);
  window.setTimeout(aplicar, 900);
}());
