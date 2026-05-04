(function aplicarAjustesFinaisPRF2026() {
  function getInstSelecionada() {
    if (typeof currInst !== 'undefined' && currInst) return String(currInst).toLowerCase();
    return String(document.getElementById('instituicao_header')?.value || document.getElementById('instituicao')?.value || '').toLowerCase();
  }

  function aplicar() {
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

    if (getInstSelecionada() === 'prf') {
      const setText = (id, texto) => {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
      };
      setText('header-resumo-dados-atualizados', 'Fontes: PRF/2025 · Portal da Transparência · Lei 14.875/2024');
    }
  }

  aplicar();
  document.addEventListener('change', (event) => {
    if (event.target && /^(instituicao|instituicao_header|comparador-instituicao)$/.test(event.target.id || '')) {
      window.setTimeout(aplicar, 40);
      window.setTimeout(aplicar, 300);
    }
  }, true);
  document.addEventListener('DOMContentLoaded', aplicar, { once: true });
  window.setTimeout(aplicar, 500);
  window.setTimeout(aplicar, 1200);
}());
