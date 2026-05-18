(function () {
  'use strict';

  const CACHE = {};
  const DATA_DIR = 'data/remuneracao';
  window.REMUNERACAO_AUTOMATIZADA = window.REMUNERACAO_AUTOMATIZADA || {};

  function texto(valor) { return String(valor == null ? '' : valor).replace(/\s+/g, ' ').trim(); }
  function numero(valor) { const n = Number(valor); return Number.isFinite(n) && n > 0 ? n : 0; }
  function limpar(valor) {
    let s = texto(valor);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1');
    s = s.replace(/https?:\/\/\S+/g, '');
    s = s.replace(/utm_source=[^\s)]+/g, '');
    s = s.replace(/\[[^\]]*\]/g, '');
    s = s.replace(/\s+([.,;:])/g, '$1').replace(/\s{2,}/g, ' ').replace(/\(\s*\)/g, '').trim();
    return s;
  }
  function normalizar(valor) {
    return limpar(valor).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function fraseInadequada(valor) {
    const t = normalizar(valor);
    if (!t) return true;
    const proibidas = ['ver edital','conferir edital','consultar edital','conforme edital','depende do edital','consultar portal','acompanhar site','quando aplicavel','quando previsto','nao localizado nas fontes consultadas'];
    return proibidas.some(p => t.includes(p));
  }
  function fontePrincipal(dados) {
    if (Array.isArray(dados.fontes)) {
      const fonte = dados.fontes.find(f => f && /^https?:\/\//i.test(texto(f.url)));
      if (fonte) return { nome: texto(fonte.titulo || 'Fonte de remuneração'), url: texto(fonte.url) };
    }
    if (/^https?:\/\//i.test(texto(dados.fonte_principal))) return { nome: 'Fonte de remuneração', url: texto(dados.fonte_principal) };
    return { nome: 'Fonte de remuneração', url: '#' };
  }
  function linhaPublicavel(linha) {
    if (!linha || typeof linha !== 'object') return false;
    if (fraseInadequada(linha.cargo)) return false;
    return numero(linha.remuneracao) > 0 || numero(linha.total) > 0;
  }
  function linhaParaSite(linha, dados) {
    const fonte = fontePrincipal(dados);
    const rem = numero(linha.remuneracao || linha.total);
    const beneficios = numero(linha.beneficios);
    return {
      cargo: limpar(linha.cargo),
      badge: limpar(linha.badge || dados.sigla || 'Remuneração'),
      remuneracao: rem,
      beneficios,
      total: numero(linha.total) || rem + beneficios,
      classe: limpar(linha.classe || 'Carreira de segurança pública'),
      criterio: fraseInadequada(linha.criterio) ? 'Valor bruto mensal localizado em fonte pública.' : limpar(linha.criterio),
      benefDesc: fraseInadequada(linha.benefDesc) ? 'Benefícios, indenizações, descontos e verbas eventuais não foram somados ao bruto.' : limpar(linha.benefDesc),
      fonteKey: dados.instituicao_id,
      fonteNome: limpar(linha.fonteNome || fonte.nome),
      fonteUrl: /^https?:\/\//i.test(texto(linha.fonteUrl)) ? texto(linha.fonteUrl) : fonte.url,
      valorPendente: false
    };
  }
  function registrarDados(dados) {
    if (!dados || !dados.instituicao_id || !Array.isArray(dados.linhas)) return false;
    const id = texto(dados.instituicao_id).toLowerCase();
    const linhas = dados.linhas.filter(linhaPublicavel).map(l => linhaParaSite(l, dados));
    if (!linhas.length) return false;
    window.REMUNERACAO_AUTOMATIZADA[id] = { dados, linhas };

    const fonte = fontePrincipal(dados);
    window.REMUNERACAO_FONTES_OFICIAIS = window.REMUNERACAO_FONTES_OFICIAIS || {};
    window.REMUNERACAO_FONTES_OFICIAIS[id] = { nome: fonte.nome, url: fonte.url };

    document.dispatchEvent(new CustomEvent('remuneracao:json-carregado', { detail: { instituicao_id: id, dados, linhas } }));
    return true;
  }

  const geradorOriginal = window.gerarRemuneracaoTabelada;
  window.gerarRemuneracaoTabelada = function gerarRemuneracaoTabeladaAutomatica(inst) {
    const id = texto(inst).toLowerCase();
    if (window.REMUNERACAO_AUTOMATIZADA[id]) return window.REMUNERACAO_AUTOMATIZADA[id].linhas.slice();
    if (typeof geradorOriginal === 'function') return geradorOriginal(inst);
    return [];
  };

  async function carregar(id) {
    id = texto(id).toLowerCase();
    if (!id) return false;
    if (CACHE[id]) return CACHE[id];
    CACHE[id] = fetch(`${DATA_DIR}/${id}.json?v=${Date.now()}`, { cache: 'no-store' })
      .then(resposta => resposta.ok ? resposta.json() : null)
      .then(dados => dados ? registrarDados(dados) : false)
      .catch(() => false);
    return CACHE[id];
  }

  function instituicaoSelecionada() {
    const select = document.getElementById('remu-filtro-instituicao');
    return select ? select.value : '';
  }

  function carregarAtual() {
    const id = instituicaoSelecionada() || 'pmesp';
    carregar(id);
  }

  function iniciar() {
    carregarAtual();
    const select = document.getElementById('remu-filtro-instituicao');
    if (select) select.addEventListener('change', () => carregar(select.value));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  else iniciar();
}());
