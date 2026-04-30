/* BLOCO 15.7 — Funções utilitárias gerais */
const fmt = v => `R$ ${(+v || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
const valEl = id => parseFloat(document.getElementById(id)?.value) || 0;
const BA_REFS = ['I', 'II', 'III', 'IV', 'V'];
const refBa = i => BA_REFS[Math.max(0, Math.min(4, parseInt(i, 10) || 0))] || 'I';
const idxRefBa = id => Math.max(0, Math.min(4, parseInt(document.getElementById(id)?.value || '0', 10) || 0));

function debounce(fn, ms = 150) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function mostrarToast(msg, tipo = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (tipo === 'error' ? ' error' : '');
  setTimeout(() => { toast.className = 'toast'; }, 3500);
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>'"]/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'}[ch]));
}

/* ============================================================ */
/* === UI: MENU, TEMA, TROCA DE PÁGINA ======================== */
/* ============================================================ */
/* BLOCO 15.8 — Menu lateral, navegação por abas e tema */
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menuOverlay');
  const btn = document.querySelector('.menu-btn');
  const isActive = sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
}

function switchPage(page) {
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  const menuEl = document.getElementById('menu-' + page);
  if (!pageEl || !menuEl) return;

  pageEl.classList.add('active');
  menuEl.classList.add('active');
  atualizarHeaderDesc();
  atualizarVisibilidadeResumoInstitucional(page);

  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 968 && sidebar && sidebar.classList.contains('active')) toggleMenu();

  // Atualiza dados da página alvo
  if (page === 'direitos') analisarDireitos();
  else if (page === 'concursos') carregarConcursos();
  else if (page === 'comparar') inicializarComparadorCarreiras();
  else if (page === 'acoes') carregarAcoes();
  else if (page === 'associacoes') carregarAssociacoes();
  else if (page === 'remuneracao') carregarRemuneracaoTabelada();
}

function atualizarVisibilidadeResumoInstitucional(page = '') {
  const ativa = document.querySelector('.page-section.active');
  const pagina = page || (ativa ? ativa.id.replace('page-', '') : 'principal');
  const painelResumo = document.querySelector('.header-facts-panel');
  const cardInstitucional = document.querySelector('.header-institution-card');
  const blocoPrincipal = document.querySelector('.header-institution-main');
  const mostrarResumo = pagina === 'principal';

  if (painelResumo) {
    painelResumo.hidden = !mostrarResumo;
    painelResumo.style.display = mostrarResumo ? '' : 'none';
    painelResumo.setAttribute('aria-hidden', mostrarResumo ? 'false' : 'true');
  }

  if (cardInstitucional) cardInstitucional.classList.toggle('sem-resumo-institucional', !mostrarResumo);
  if (blocoPrincipal) blocoPrincipal.classList.toggle('sem-resumo-institucional', !mostrarResumo);
}

function getNomeAbaAtual() {
  const ativa = document.querySelector('.page-section.active');
  const page = ativa ? ativa.id.replace('page-', '') : 'principal';
  const nomes = {
    principal: 'Principal',
    acoes: 'Ações Judiciais',
    associacoes: 'Associações e Sindicatos',
    remuneracao: 'Remuneração Tabelada',
    concursos: 'Concursos',
    comparar: 'Comparar Carreiras',
    produtos: 'Produtos',
    direitos: 'Direitos e Vantagens',
    parceiros: 'Parceiros - Anuncie aqui!'
  };
  return nomes[page] || 'Principal';
}

function atualizarHeaderDesc(descInstituicao) {
  if (headerModoInicialPortal) {
    const el = document.getElementById('header-desc');
    if (el) el.textContent = getNomeAbaAtual() === 'Principal' ? 'Escolha uma instituição' : getNomeAbaAtual();
    return;
  }

  const descs = {
    pmesp: 'Polícia Militar de São Paulo',
    pcsp: 'Polícia Civil de São Paulo',
    pmerj: 'Polícia Militar do Rio de Janeiro',
    pcerj: 'Polícia Civil do Rio de Janeiro',
    pmmg: 'Polícia Militar de Minas Gerais',
    pcmg: 'Polícia Civil de Minas Gerais',
    pmba: 'Polícia Militar da Bahia',
    pcba: 'Polícia Civil da Bahia',
    pmpr: 'Polícia Militar do Paraná',
    pcpr: 'Polícia Civil do Paraná',
    pmrs: 'Brigada Militar do Rio Grande do Sul',
    pcrs: 'Polícia Civil do Rio Grande do Sul',
    pmsc: 'Polícia Militar de Santa Catarina',
    pcsc: 'Polícia Civil de Santa Catarina',
    pmes: 'Polícia Militar do Espírito Santo',
    pces: 'Polícia Civil do Espírito Santo',
    ppsp: 'Polícia Penal de São Paulo',
    pprj: 'Polícia Penal do Rio de Janeiro',
    ppmg: 'Polícia Penal de Minas Gerais',
    ppba: 'Polícia Penal da Bahia',
    pppr: 'Polícia Penal do Paraná',
    pprs: 'Polícia Penal do Rio Grande do Sul',
    ppsc: 'Polícia Penal de Santa Catarina',
    ppes: 'Polícia Penal do Espírito Santo',
    pmms: 'Polícia Militar de Mato Grosso do Sul',
    pcms: 'Polícia Civil de Mato Grosso do Sul',
    ppms: 'Polícia Penal de Mato Grosso do Sul',
    pmmt: 'Polícia Militar de Mato Grosso',
    pcmt: 'Polícia Judiciária Civil de Mato Grosso',
    ppmt: 'Polícia Penal de Mato Grosso'
  };
  const textoAba = getNomeAbaAtual();
  const desc = descInstituicao || descs[currInst] || descs.pmesp;
  const el = document.getElementById('header-desc');
  if (el) el.textContent = textoAba;

  const info = HEADER_INSTITUICOES_INFO?.[currInst];
  const siglaAtual = document.getElementById('header-active-sigla');
  if (siglaAtual && info) siglaAtual.textContent = info.titulo;

  const nomeAtual = document.getElementById('header-active-name');
  if (nomeAtual) nomeAtual.textContent = desc;
}

function toggleTheme() {
  const html = document.documentElement;
  const tema = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', tema);
  localStorage.setItem('theme', tema);
  initTheme();
}

function initTheme() {
  const tema = document.documentElement.getAttribute('data-theme');
  const btnHeader = document.getElementById('theme-toggle-header');
  if (btnHeader) btnHeader.innerHTML = tema === 'dark' ? '☀️ Claro' : '🌙 Escuro';
}

/* ============================================================ */
/* === POPULA CARGOS NO SELECT ================================ */
/* ============================================================ */
/* BLOCO 15.9 — Troca de instituição e popularização dos cargos */
function popularCargos(inst) {
  const map = {
    pmesp: CARGOS_PM,    pcsp: CARGOS_PC,    ppsp: CARGOS_PPSP,
    pmerj: CARGOS_PMERJ, pcerj: CARGOS_PCERJ, pprj: CARGOS_PPRJ,
    pmmg: CARGOS_PMMG,   pcmg: CARGOS_PCMG,   ppmg: CARGOS_PPMG,
    pmba: CARGOS_PMBA,   pcba: CARGOS_PCBA,   ppba: CARGOS_PPBA,
    pmpr: CARGOS_PMPR,   pcpr: CARGOS_PCPR,   pppr: CARGOS_PPPR,
    pmrs: CARGOS_PMRS,   pcrs: CARGOS_PCRS,   pprs: CARGOS_PPRS,
    pmsc: CARGOS_PMSC,   pcsc: CARGOS_PCSC,   ppsc: CARGOS_PPSC,
    pmes: CARGOS_PMES,   pces: CARGOS_PCES,   ppes: CARGOS_PPES,
    pmms: CARGOS_PMMS,   pcms: CARGOS_PCMS,   ppms: CARGOS_PPMS,
    pmmt: CARGOS_PMMT,   pcmt: CARGOS_PCMT,   ppmt: CARGOS_PPMT,};
  currTabela = map[inst] || CARGOS_PM;

  const sCargo = document.getElementById('cargo');
  const sCargoDir = document.getElementById('cargo_dir');
  if (!sCargo && !sCargoDir) return;
  if (sCargo) sCargo.innerHTML = '';
  if (sCargoDir) sCargoDir.innerHTML = '';

  currTabela.forEach(c => {
    if (sCargo) {
      const o1 = document.createElement('option');
      o1.value = c.val; o1.textContent = c.text;
      if (c.selected) o1.selected = true;
      sCargo.appendChild(o1);
    }

    if (sCargoDir) {
      const o2 = document.createElement('option');
      o2.value = c.val; o2.textContent = c.text;
      if (c.selected) o2.selected = true;
      sCargoDir.appendChild(o2);
    }
  });



}


/* ============================================================ */
/* === REMUNERAÇÃO TABELADA =================================== */
/* ============================================================ */
/* BLOCO 15.8.1 — Tabela simples gratuita de remuneração bruta com fontes oficiais */
const REMUNERACAO_FONTES_OFICIAIS = {
  pmesp: {
    nome: 'SGGD/SP — Área Policial — Polícia Militar — mês de referência julho/2025',
    url: 'https://www.sggd.sp.gov.br/sgp/normas_e_legislacao/policial'
  },
  pcsp: {
    nome: 'SGGD/SP — Área Policial — Polícia Civil — mês de referência julho/2025',
    url: 'https://www.sggd.sp.gov.br/sgp/normas_e_legislacao/policial'
  },
  pmerj: {
    nome: 'GESPERJ/RJ — Caderno de Remuneração — janeiro/2026 — SEPM',
    url: 'https://www.rj.gov.br/gesperj/sites/default/files/Caderno%20de%20Remunera%C3%A7%C3%A3o%20-%20janeiro%20-%202026.pdf'
  },
  pcerj: {
    nome: 'GESPERJ/RJ — Caderno de Remuneração — janeiro/2026 — SEPOL',
    url: 'https://www.rj.gov.br/gesperj/sites/default/files/Caderno%20de%20Remunera%C3%A7%C3%A3o%20-%20janeiro%20-%202026.pdf'
  },
  pmmg: {
    nome: 'MG/SEPLAG — Grupo XI — Atividades da Defesa Social — Lei nº 25.804/2026',
    url: 'https://www.mg.gov.br/system/files/media/planejamento/documento_detalhado/2026/grupo_11_atualizacao-54-2026.pdf'
  },
  pcmg: {
    nome: 'MG/SEPLAG — Grupo XI — Atividades da Defesa Social — Lei nº 25.804/2026',
    url: 'https://www.mg.gov.br/system/files/media/planejamento/documento_detalhado/2026/grupo_11_atualizacao-54-2026.pdf'
  },
  pmba: {
    nome: 'Casa Civil/BA — Lei nº 14.890/2025 — soldo, GAP e auxílio fardamento',
    url: 'https://www.legislabahia.ba.gov.br/documentos/lei-no-14890-de-05-de-maio-de-2025'
  },
  pcba: {
    nome: 'Casa Civil/BA — Lei nº 14.891/2025 — vencimento, GAJ e GAPJ',
    url: 'https://www.legislabahia.ba.gov.br/documentos/lei-no-14891-de-05-de-maio-de-2025'
  },
  pmpr: {
    nome: 'Legislação/PR — Lei nº 22.187/2024 e Lei nº 22.208/2024',
    url: 'https://www.legislacao.pr.gov.br/legislacao/exibirAto.do?action=iniciarProcesso&codAto=344946&codItemAto=2177446'
  },
  pcpr: {
    nome: 'Legislação/PR — Lei Complementar nº 259/2023 e Lei nº 22.208/2024',
    url: 'https://www.legislacao.pr.gov.br/legislacao/pesquisarAto.do?action=exibir&codAto=300584&dt=27.1.2024.16.42.52.571&indice=1&totalRegistros=1'
  },
  pmrs: {
    nome: 'Governo do RS/RHE — Relação de Remuneração — competência 11/2025; editais BMRS 2025 para ingresso',
    url: 'https://tesouro-admin.fazenda.rs.gov.br/upload/arquivos/202512/12090345-cargos-venc-gov3032-112025.pdf'
  },
  pcrs: {
    nome: 'Governo do RS/RHE — Relação de Remuneração — competência 11/2025; editais PCRS 2025 para ingresso',
    url: 'https://tesouro-admin.fazenda.rs.gov.br/upload/arquivos/202512/12090345-cargos-venc-gov3032-112025.pdf'
  },
  pmsc: {
    nome: 'ALESC/SC — LC 765/2020, LC 776/2021, LC 872/2025 e LC 880/2025 — PMSC',
    url: 'https://leis.alesc.sc.gov.br/ato-normativo/20899'
  },
  pcsc: {
    nome: 'ALESC/SC — LC 765/2020, LC 776/2021 e LC 872/2025; PCSC editais 2025',
    url: 'https://pc.sc.gov.br/?p=35166'
  },
  pmes: {
    nome: 'PMES/ES — LC 420/2007, legislação PMES e tabela PM/CBM a partir de 01/12/2025',
    url: 'https://pm.es.gov.br/legislacao'
  },
  pces: {
    nome: 'PCES/ES — LC 1.093/2024, concurso OIP 2025, tabelas de Delegado e PCIES/Perícia Oficial',
    url: 'https://pc.es.gov.br/Media/PCES/Legisla%C3%A7%C3%A3o/LC_%20n_%201093_cria_OIP.pdf'
  },
  pmms: {
    nome: 'PMMS — Tabela salarial militar MS 05/2025, com reajuste de 5,06% aplicado',
    url: 'https://ronda.org.br/assembleia-aprova-reajuste-de-506-aos-servidores-de-ms-confira-a-tabela-salarial-da-pm-e-bm/'
  },
  pcms: {
    nome: 'PCMS — Edital APJ/2025; LC MS nº 343/2024; LC MS nº 290/2021 para Delegado',
    url: 'https://www.pc.ms.gov.br/governo-de-mato-grosso-do-sul-abre-concurso-publico-com-400-vagas-para-a-policia-civil/'
  },
  pcms_apj2025: {
    nome: 'PCMS — Edital APJ/2025 — 400 vagas, APJ 40h',
    url: 'https://www.pc.ms.gov.br/governo-de-mato-grosso-do-sul-abre-concurso-publico-com-400-vagas-para-a-policia-civil/'
  },
  pcms_lc343: {
    nome: 'PCMS — LC MS nº 343/2024 — Tabelas A, B e C com vigência 01/01/2025',
    url: 'https://dhg1h5j42swfq.cloudfront.net/2024/12/18174426/diariooficial-2.pdf'
  },
  pcms_lc290: {
    nome: 'PCMS — LC MS nº 290/2021 — Tabela D de Delegado',
    url: 'https://www.cgp.sejusp.ms.gov.br/wp-content/uploads/2022/12/DO10711_17_12_2021-pag-02-07-1.pdf'
  },
  ppms: {
    nome: 'AGEPEN/MS — Tabela Subsídio Polícia Penal 2026 — Lei MS nº 6.562/2026',
    url: 'https://www.agepen.ms.gov.br/wp-content/uploads/2025/12/Tabela-Subsidio-AGEPEN-2026.pdf'
  },
  pmmt: {
    nome: 'PMMT — Planilha de vencimentos LC MT nº 541/2014 e Lei MT nº 12.007/2023',
    url: 'https://site.cabosesoldadosmt.com.br/assets/pdf/tabelasalarial.pdf'
  },
  pcmt: {
    nome: 'PCMT/PJC-MT — Portal do Servidor/SEPLAG-MT — tabela salarial 40h 2025',
    url: 'https://dhg1h5j42swfq.cloudfront.net/2025/07/16180311/tabela-salarial-pc-mt.pdf'
  },
  ppmt: {
    nome: 'PPMT — Portal do Servidor/SEPLAG-MT — tabela 40h Policial Penal 2026',
    url: 'https://sites.diretasistemas.com.br/sites/1377/wp-content/uploads/2026/02/10103833/Portal-do-Servidor.pdf'
  },
  ppsp: {
    nome: 'PPSP — SAP/SP e ALESP — LC SP 1.416/2024, LC SP 1.425/2025 e concurso SAP 2025',
    url: 'https://www.sap.sp.gov.br/sec_adm_penitenciaria/Noticias/policia-penal-paulista-abre-inscricoes-para-concurso'
  },
  pprj: {
    nome: 'PPRJ — GESPERJ/RJ — Caderno de Remuneração janeiro/2026 — SEAP/Polícia Penal',
    url: 'https://www.rj.gov.br/gesperj/sites/default/files/Caderno%20de%20Remunera%C3%A7%C3%A3o%20-%20janeiro%20-%202026.pdf'
  },
  ppmg: {
    nome: 'PPMG — SEJUSP/MG — Edital nº 01/2025 e tabela da carreira de Policial Penal',
    url: 'https://depen.seguranca.mg.gov.br/images/2025/SEI_124235863_Edital_01_2025.pdf'
  },
  ppba: {
    nome: 'PPBA — SEAP/BA — Edital nº 02/2024, remuneração de Agente Penitenciário/Policial Penal',
    url: 'https://www.ba.gov.br/seap/'
  },
  pppr: {
    nome: 'PPPR — ALEP/PR — LC PR 245/2022 e LC PR 283/2025 — subsídio do QPPP',
    url: 'https://www.assembleia.pr.leg.br/storage/ccj/208dlCXRFOeEMxdtVDrKxlRxAY9MelrYJIyyrkPM.pdf'
  },
  pprs: {
    nome: 'PPRS — Tesouro/RS — Relações de Remuneração RHE e LC RS 16.449/2025',
    url: 'https://tesouro-admin.fazenda.rs.gov.br/upload/arquivos/202512/12090345-cargos-venc-gov3032-112025.pdf'
  },
  ppsc: {
    nome: 'PPSC — ALESC — LC SC 774/2021 e atualização remuneratória 2025/2026',
    url: 'https://leis.alesc.sc.gov.br/ato-normativo/21250'
  },
  ppes: {
    nome: 'PPES — SEGER/ES e PPES — Edital nº 001/2025, LC ES 1.059/2023 e tabela da carreira',
    url: 'https://seger.es.gov.br/concurso-ppes-edital-no-01-2025-policial-penal'
  },
  sc_auxilio: {
    nome: 'ALESC/SC — Lei 18.796/2023, redação da Lei 19.059/2024 — auxílio-alimentação',
    url: 'https://leis.alesc.sc.gov.br/ato-normativo/22251'
  },
  pr_auxilio: {
    nome: 'Legislação/PR — auxílio-alimentação de R$ 834,74',
    url: 'https://www.legislacao.pr.gov.br/legislacao/pesquisarAto.do?action=exibir&codAto=257965&indice=1'
  },
  mg_auxilio: {
    nome: 'ALMG — Decreto nº 49.006/2025 — ajuda de custo para alimentação',
    url: 'https://www.almg.gov.br/legislacao-mineira/texto/DEC/49006/2025/'
  }
};

function linhaRemuneracaoOficial(cargo, remuneracao, beneficios, criterio, benefDesc, fonteKey, badge = 'Fonte oficial') {
  const valor = Number(remuneracao || 0);
  return { cargo, remuneracao: valor, beneficios: 0, total: valor, criterio, benefDesc, fonteKey, badge, valorPendente: valor <= 0 };
}

function getAdicionaisRemuneracaoResumo(inst, linha = {}) {
  inst = normalizarInstituicao(inst);
  const cargo = String(linha.cargo || '').toLowerCase();

  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    const detalhesLinha = linha.benefDesc ? `${linha.benefDesc} ` : '';
    return `${detalhesLinha}${info.sigla}: ${info.atribuicoes} ${info.vantagens} Fonte principal: ${info.fonte}.`;
  }

  if (inst === 'pmms') {
    return linha.benefDesc || 'PMMS: adicionais, indenizações, auxílio, escala, fardamento ou verbas específicas dependem da legislação estadual, lotação, ordem de serviço, escala e contracheque; não foram somados automaticamente.';
  }
  if (inst === 'pcms') {
    return linha.benefDesc || 'PCMS: o edital APJ/2025 informou remuneração inicial de R$ 6.569,53 para 40h; abonos, adicionais, plantões e demais rubricas dependem da legislação estadual, lotação, escala e contracheque.';
  }
  if (inst === 'pmmt') {
    return linha.benefDesc || 'PMMT: adicionais, indenizações, etapas, auxílio, escala, fardamento e demais verbas específicas dependem da legislação estadual, lotação, ordem de serviço, escala e contracheque; não foram somados automaticamente.';
  }
  if (inst === 'pcmt') {
    return linha.benefDesc || 'PCMT: a tabela salarial cadastrada usa referências do Portal do Servidor/SEPLAG-MT para Escrivão e Delegado; abonos, adicionais, plantões e demais rubricas dependem da legislação estadual, lotação, escala e contracheque.';
  }

  if (inst === 'pmesp') {
    const representacao = /(cmt g|coronel|cel|ten cel)/i.test(linha.cargo || '')
      ? ' Gratificação de representação: pode existir para postos/funções específicas e já aparece incorporada quando constar na fonte oficial.'
      : '';
    return `RETP: em regra 100% sobre o padrão/vencimento-base, já considerado no bruto oficial desta tabela. Quinquênio: 5% por período aquisitivo; sexta-parte: 1/6 após requisito temporal. Auxílio-alimentação: ${fmt(AUX_ALIM_SP_DIA_PADRAO)} por dia efetivamente trabalhado. Insalubridade: possível conforme grau, laudo e enquadramento.${representacao}`;
  }

  if (inst === 'pcsp') {
    const carreiraDelegado = /delegado/i.test(linha.cargo || '');
    return `RETP: em regra 100% sobre o padrão/vencimento-base, já considerado no bruto oficial desta tabela. ${carreiraDelegado ? 'Delegados podem ter verbas próprias de representação quando previstas. ' : ''}Quinquênio: 5% por período aquisitivo; sexta-parte: 1/6 após requisito temporal. Auxílio-alimentação: ${fmt(AUX_ALIM_SP_DIA_PADRAO)} por dia efetivamente trabalhado. Insalubridade: possível conforme grau, laudo e enquadramento.`;
  }

  if (isPoliciaPenal(inst)) {
    remuneracao = padrao;
    beneficios = Number(cargo.beneficios || 0);
    criterio = cargo.criterio || 'Remuneração bruta mensal de referência da tabela oficial da Polícia Penal.';
    benefDesc = cargo.benefDesc || 'Auxílios, adicionais, plantões e parcelas indenizatórias dependem de lei, escala, lotação e situação funcional; não foram somados automaticamente.';
    fonteKey = cargo.fonteKey || inst;
    badge = cargo.badge || 'Fonte oficial';
  } else if (inst === 'pmms') {
    remuneracao = padrao;
    beneficios = 0;
    criterio = cargo.valorPendente || padrao <= 0
      ? 'Cargo cadastrado para a PMMS; valor vigente deve ser confirmado em tabela oficial, Diário Oficial/MS, edital ou contracheque.'
      : 'Referência de remuneração do último concurso/edital PMMS; confirmar tabela vigente antes de decisão financeira.';
    benefDesc = 'Auxílios, adicionais, fardamento, indenizações e verbas por escala/lotação dependem da legislação estadual, ato administrativo e contracheque; não foram somados automaticamente.';
    fonteKey = 'pmms';
    badge = cargo.valorPendente || padrao <= 0 ? 'A confirmar' : 'Edital/triagem';
  } else if (inst === 'pcms') {
    remuneracao = padrao;
    beneficios = 0;
    criterio = cargo.valorPendente || padrao <= 0
      ? 'Cargo/carreira da PCMS cadastrado para seleção; remuneração deve ser confirmada em tabela legal, DOE/MS, edital ou contracheque.'
      : 'Remuneração inicial divulgada no Edital SAD/SEJUSP/PCMS/APJ/2025 para jornada de 40h.';
    benefDesc = 'Abonos, adicionais, plantões, indenizações e outras rubricas dependem da legislação estadual, lotação, escala e contracheque; não foram somados automaticamente.';
    fonteKey = 'pcms';
    badge = cargo.valorPendente || padrao <= 0 ? 'A confirmar' : 'Edital APJ/2025';
  } else if (inst === 'pmerj') {
    let gret = '150%';
    let ghp = '110%';
    if (/cel|ten cel/i.test(linha.cargo || '')) { gret = '192,5%'; ghp = '160%'; }
    else if (/maj/i.test(linha.cargo || '')) { gret = '192,5%'; ghp = '110%'; }
    else if (/cabo|sd pm|soldado a\/b\/c/i.test(linha.cargo || '')) { ghp = '75%'; }
    else if (/aluno|soldado-aluno|sd aluno|esfo/i.test(linha.cargo || '')) { gret = '122,5%'; ghp = 'não aplicada na linha'; }
    return `GRET: ${gret} sobre o soldo; GHP: ${ghp}; GRAM: 62,5% sobre soldo + GRET + GHP. Essas parcelas já compõem a remuneração bruta exibida. Auxílio-alimentação PMERJ: ${fmt(AUX_ALIM_RJ_PM)} mensais, sem somar no bruto.`;
  }

  if (inst === 'pcerj') {
    if (/delegado/i.test(linha.cargo || '')) {
      return 'Verba de representação: 212% sobre o vencimento-base; GHP: 105%. Essas parcelas já compõem a remuneração bruta exibida. Auxílio-alimentação: R$ 704,00/mês; auxílio-transporte: R$ 100,00/mês, sem somar no bruto.';
    }
    const gatc = /perito|médico|medico|eng\.?|telecomunicações|telecomunicacoes/i.test(linha.cargo || '')
      ? ' GATC: 100% sobre o vencimento-base quando aplicável ao cargo.'
      : ' GATC: pode existir quando prevista para o cargo/função.';
    return `AAP: 230% sobre o vencimento-base; GHP: até 100%.${gatc} Essas parcelas já compõem a remuneração bruta exibida quando aplicáveis. Auxílio-alimentação: R$ 704,00/mês; auxílio-transporte: R$ 100,00/mês, sem somar no bruto.`;
  }

  if (inst === 'pmmg') {
    return `Ajuda de custo para alimentação: ${fmt(AUX_ALIM_MG_DIA_PADRAO)} por dia efetivamente trabalhado, quando atendidos os critérios. Outros adicionais, gratificações ou indenizações dependem de função, local, escala, ato específico ou situação individual e não foram somados ao bruto.`;
  }

  if (inst === 'pcmg') {
    return `Ajuda de custo para alimentação: ${fmt(AUX_ALIM_MG_DIA_PADRAO)} por dia efetivamente trabalhado, quando atendidos os critérios. Adicionais funcionais, gratificações ou indenizações específicas dependem de cargo, lotação, ato próprio ou situação individual e não foram somados ao bruto.`;
  }

  if (inst === 'pmba') {
    const ref = (linha.cargo || '').match(/GAP Ref\.\s*([IVX]+)/i)?.[1] || 'informada';
    return `GAP: gratificação por atividade policial na referência ${ref}, já considerada na remuneração bruta da linha. Auxílio-fardamento: R$ 256,18 mensais. Auxílio-alimentação: referência geral BA de ${fmt(AUX_ALIM_BA_40H)} para 40h ou ${fmt(AUX_ALIM_BA_30H)} para 30h, quando aplicável; não somado ao bruto.`;
  }

  if (inst === 'pcba') {
    const verba = /delegado/i.test(linha.cargo || '') ? 'GAJ' : 'GAPJ';
    const ref = (linha.cargo || '').match(/Ref\.\s*([IVX]+)/i)?.[1] || 'informada';
    return `${verba}: gratificação da carreira na referência ${ref}, já considerada na remuneração bruta da linha. CET, GIP, GQUAL ou outras vantagens podem existir conforme função, titulação, lotação ou ato específico. Auxílio-alimentação: referência geral BA de ${fmt(AUX_ALIM_BA_40H)} para 40h ou ${fmt(AUX_ALIM_BA_30H)} para 30h, quando aplicável; não somado ao bruto.`;
  }

  if (inst === 'pmpr') {
    return `Regime por subsídio: a remuneração bruta da linha corresponde ao subsídio do cargo/classe. Auxílio-alimentação oficial PR: ${fmt(AUX_ALIM_PR_PADRAO)}. Outras indenizações ou gratificações específicas dependem de previsão própria, escala, local ou situação individual e não foram somadas.`;
  }

  if (inst === 'pcpr') {
    return `Regime por subsídio: o subsídio pode compreender adicionais como insalubridade, periculosidade e risco de vida, conforme LC PR 259/2023 e aplicação vigente. Auxílio-alimentação oficial PR: ${fmt(AUX_ALIM_PR_PADRAO)}. Verbas específicas/eventuais não foram somadas.`;
  }

  if (inst === 'pmrs') return `RHE/RS: linhas inicial e final por posto/graduação, com competência 11/2025. Editais BM/RS 2025: referências de ingresso para Soldado, Aluno-Oficial e Capitão. Auxílio-alimentação BM/RS: ${fmt(AUX_ALIM_RS_BM)} informado em edital; não somado automaticamente ao bruto.`;
  if (inst === 'pcrs') return 'Carreira PCRS: classes de Delegado, Escrivão, Inspetor e Comissário, com valores de referência dos editais/tabelas 2025 e conferência na relação RHE 11/2025. Adicionais/indenizações: dependem de rubrica, lotação, legislação e situação funcional; não são somados automaticamente.';
  if (inst === 'pmsc') return `Regime por subsídio da PMSC: valores atualizados pela LC SC 872/2025 e Soldado unificado pela LC SC 880/2025. Auxílio-alimentação SC de referência: ${fmt(AUX_ALIM_SC_PADRAO)}, verba indenizatória não somada ao bruto. Diárias, indenizações e eventuais serviços extraordinários dependem de escala, local, função ou situação funcional.`;
  if (inst === 'pcsc') return `Regime por subsídio da PCSC: classes de Delegado, Agente, Escrivão e Psicólogo Policial conforme legislação estadual. Auxílio-alimentação SC: ${fmt(AUX_ALIM_SC_PADRAO)}, já citado nos editais de Agente/Escrivão 2025, mas não somado automaticamente ao bruto.`;
  if (inst === 'pmes') return `Regime por subsídio da PMES: tabela PM/CBM por posto/graduação e referências, com base na LC ES 420/2007 e valores de referência a partir de 01/12/2025. Auxílio-alimentação ES de referência: ${fmt(AUX_ALIM_ES_PADRAO)}; não somado automaticamente ao bruto.`;
  if (inst === 'pces') return `Regime por subsídio da PCES: Delegado e Oficial Investigador por categorias/referências. Carreiras periciais aparecem sinalizadas como PCIES/Perícia Oficial após segregação institucional. Auxílio-alimentação ES de referência: ${fmt(AUX_ALIM_ES_PADRAO)}; não somado automaticamente ao bruto.`;
  return linha.benefDesc || 'Adicionais e benefícios dependem de legislação, cargo, lotação, escala e situação individual; não foram somados ao bruto.';
}

const REMUNERACAO_SP_OFICIAL = {
  pmesp: [
    linhaRemuneracaoOficial('CMT G — Comandante Geral PM', 22587.35, 0, 'Salário inicial oficial: salário-base + RETP + gratificação de representação. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('CEL — Coronel PM', 18082.57, 0, 'Salário inicial oficial: salário-base + RETP + gratificação de representação. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('TEN CEL — Tenente Coronel PM', 16604.78, 0, 'Salário inicial oficial: salário-base + RETP + gratificação de representação. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('MAJ — Major PM', 15219.78, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('CAP — Capitão PM', 14384.64, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('1º TEN — 1º Tenente PM', 13332.24, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('2º TEN — 2º Tenente PM', 9046.74, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('ASP OF — Aspirante a Oficial PM', 8666.50, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('SUBTEN — Subtenente PM', 7363.88, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('1º SGT — 1º Sargento PM', 6377.26, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('2º SGT — 2º Sargento PM', 5743.24, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('3º SGT — 3º Sargento PM', 5040.34, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('CABO PM', 4884.18, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('SD 1ª CL — Soldado PM 1ª Classe', 4520.20, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('SD 2ª CL — Soldado PM 2ª Classe', 4269.86, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('AL OF 4º CFO', 5013.58, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('AL OF 3º CFO', 4840.38, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('AL OF 2º CFO', 4458.80, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp'),
    linhaRemuneracaoOficial('AL OF 1º CFO', 4249.98, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pmesp')
  ],
  pcsp: [
    linhaRemuneracaoOficial('Delegado Geral de Polícia', 24832.04, 0, 'Salário inicial oficial: salário-base + RETP + gratificação de representação + ADPJ. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
    linhaRemuneracaoOficial('Delegado de Polícia — Classe Especial', 18998.25, 0, 'Salário inicial oficial: salário-base + RETP + ADPJ. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
    linhaRemuneracaoOficial('Delegado de Polícia — 1ª Classe', 17935.65, 0, 'Salário inicial oficial: salário-base + RETP + ADPJ. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
    linhaRemuneracaoOficial('Delegado de Polícia — 2ª Classe', 16824.27, 0, 'Salário inicial oficial: salário-base + RETP + ADPJ. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
    linhaRemuneracaoOficial('Delegado de Polícia — 3ª Classe', 15789.88, 0, 'Salário inicial oficial: salário-base + RETP + ADPJ. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
    ...['Médico Legista', 'Perito Criminal'].flatMap(nome => [
      linhaRemuneracaoOficial(`${nome} — Classe Especial`, 16357.24, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 1ª Classe`, 15445.98, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 2ª Classe`, 14491.16, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 3ª Classe`, 13602.12, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp')
    ]),
    ...['Escrivão de Polícia', 'Investigador de Polícia'].flatMap(nome => [
      linhaRemuneracaoOficial(`${nome} — Classe Especial`, 7804.58, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 1ª Classe`, 7086.34, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 2ª Classe`, 6613.20, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 3ª Classe`, 6173.66, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp')
    ]),
    ...['Fotógrafo Técnico-Pericial', 'Agente de Telecomunicações Policial', 'Auxiliar de Necropsia', 'Desenhista Técnico-Pericial', 'Papiloscopista Policial'].flatMap(nome => [
      linhaRemuneracaoOficial(`${nome} — Classe Especial`, 6852.94, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 1ª Classe`, 6505.76, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 2ª Classe`, 6141.88, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 3ª Classe`, 5803.06, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp')
    ]),
    ...['Atendente Necrotério Policial', 'Auxiliar Papiloscopista Policial'].flatMap(nome => [
      linhaRemuneracaoOficial(`${nome} — Classe Especial`, 5685.64, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 1ª Classe`, 5371.36, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 2ª Classe`, 5037.22, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp'),
      linhaRemuneracaoOficial(`${nome} — 3ª Classe`, 4725.36, 0, 'Salário inicial oficial: salário-base + RETP. Mês de referência: julho/2025.', 'Benefícios não somados; adicional de insalubridade é variável conforme classificação oficial.', 'pcsp')
    ])
  ]
};

const REMUNERACAO_MG_OFICIAL = {
  pmmg: [
    ['CORONEL PMMG', 21635.64], ['TENENTE CORONEL PMMG', 19515.61], ['MAJOR PMMG', 17394.91], ['CAPITÃO PMMG', 16101.58],
    ['1º TENENTE PMMG', 14324.95], ['2º TENENTE PMMG', 12170.60], ['ASPIRANTE A OFICIAL PMMG', 10932.55],
    ['CADETE — Último ano PMMG', 9743.51], ['CADETE — Demais anos PMMG', 7912.19], ['SUBTENENTE PMMG', 10932.55],
    ['1º SARGENTO PMMG', 9743.51], ['2º SARGENTO PMMG', 8505.46], ['3º SARGENTO PMMG', 7505.19],
    ['CABO PMMG', 6505.00], ['SOLDADO 1ª CLASSE PMMG', 5620.57], ['SOLDADO 2ª CLASSE (ALUNO) PMMG', 4808.66],
    ['ALUNO 1º SARGENTO PMMG', 9743.56], ['ALUNO SUBTENENTE PMMG', 10932.55]
  ].map(([cargo, valor]) => linhaRemuneracaoOficial(cargo, valor, 0, 'Subsídio/vencimento básico oficial da tabela Grupo XI — Defesa Social. Vigência: 01/01/2026.', 'Ajuda de custo para alimentação regulamentada pelo Decreto MG nº 49.006/2025; não somada por depender de regra, valor e dias efetivamente trabalhados.', 'pmmg')),
  pcmg: [
    ['Delegado de Polícia — Geral — A', 21635.64], ['Delegado de Polícia — Geral — B', 23799.18],
    ['Delegado de Polícia — Especial — A', 17402.29], ['Delegado de Polícia — Especial — B', 17529.88], ['Delegado de Polícia — Especial — C', 17665.93], ['Delegado de Polícia — Especial — D', 17803.03], ['Delegado de Polícia — Especial — E', 17941.20],
    ['Delegado de Polícia — Superior II — A', 16117.11], ['Delegado de Polícia — Superior II — B', 16407.51], ['Delegado de Polícia — Superior II — C', 16719.25], ['Delegado de Polícia — Superior II — D', 17036.93], ['Delegado de Polícia — Superior II — E', 17394.91],
    ['Delegado de Polícia — Superior I — A', 15737.60], ['Delegado de Polícia — Superior I — B', 15816.29], ['Delegado de Polícia — Superior I — C', 15895.36], ['Delegado de Polícia — Superior I — D', 15974.85], ['Delegado de Polícia — Superior I — E', 16101.58],
    ['Médico Legista — Especial — A', 15175.57], ['Médico Legista — Especial — B', 16693.11], ['Perito Criminal — Especial — A', 15175.57], ['Perito Criminal — Especial — B', 16693.11],
    ['Médico Legista — Superior III — A', 14947.06], ['Médico Legista — Superior III — B', 15003.86], ['Médico Legista — Superior III — C', 15060.88], ['Médico Legista — Superior III — D', 15118.10], ['Médico Legista — Superior III — E', 15175.56],
    ['Perito Criminal — Superior III — A', 14947.06], ['Perito Criminal — Superior III — B', 15003.85], ['Perito Criminal — Superior III — C', 15060.88], ['Perito Criminal — Superior III — D', 15118.10], ['Perito Criminal — Superior III — E', 15175.56],
    ['Médico Legista — Superior II — A', 14324.96], ['Médico Legista — Superior II — B', 14468.21], ['Médico Legista — Superior II — C', 14612.88], ['Médico Legista — Superior II — D', 14759.01], ['Médico Legista — Superior II — E', 14906.61],
    ['Perito Criminal — Superior II — A', 14324.96], ['Perito Criminal — Superior II — B', 14468.21], ['Perito Criminal — Superior II — C', 14612.88], ['Perito Criminal — Superior II — D', 14759.01], ['Perito Criminal — Superior II — E', 14906.61],
    ['Médico Legista — Superior I — A', 12170.61], ['Médico Legista — Superior I — B', 12535.72], ['Médico Legista — Superior I — C', 12911.81], ['Médico Legista — Superior I — D', 13299.15], ['Médico Legista — Superior I — E', 13698.13],
    ['Perito Criminal — Superior I — A', 12170.61], ['Perito Criminal — Superior I — B', 12535.72], ['Perito Criminal — Superior I — C', 12911.81], ['Perito Criminal — Superior I — D', 13299.15], ['Perito Criminal — Superior I — E', 13698.13],
    ['Escrivão de Polícia — Médio Especial — A', 9743.51], ['Escrivão de Polícia — Médio Especial — B', 10717.86],
    ['Investigador de Polícia — Médio/Superior Especial — A', 9743.51], ['Investigador de Polícia — Médio/Superior Especial — B', 10717.86],
    ['Escrivão de Polícia — Médio III — A', 7505.30], ['Escrivão de Polícia — Médio III — B', 7525.94], ['Escrivão de Polícia — Médio III — C', 7751.73], ['Escrivão de Polícia — Médio III — D', 7984.27], ['Escrivão de Polícia — Médio III — E', 8505.47],
    ['Investigador de Polícia — Médio/Superior III — A', 7505.30], ['Investigador de Polícia — Médio/Superior III — B', 7525.94], ['Investigador de Polícia — Médio/Superior III — C', 7751.73], ['Investigador de Polícia — Médio/Superior III — D', 7984.27], ['Investigador de Polícia — Médio/Superior III — E', 8505.47],
    ['Escrivão de Polícia — Médio II — A', 6504.99], ['Escrivão de Polícia — Médio II — B', 6667.59], ['Escrivão de Polícia — Médio II — C', 6834.29], ['Escrivão de Polícia — Médio II — D', 7005.15], ['Escrivão de Polícia — Médio II — E', 7505.19],
    ['Investigador de Polícia — Médio/Superior II — A', 6504.99], ['Investigador de Polícia — Médio/Superior II — B', 6667.59], ['Investigador de Polícia — Médio/Superior II — C', 6834.29], ['Investigador de Polícia — Médio/Superior II — D', 7005.15], ['Investigador de Polícia — Médio/Superior II — E', 7505.19],
    ['Escrivão de Polícia — Médio I — A', 5620.58], ['Escrivão de Polícia — Médio I — B', 5789.19], ['Escrivão de Polícia — Médio I — C', 5962.87], ['Escrivão de Polícia — Médio I — D', 6141.75], ['Escrivão de Polícia — Médio I — E', 6504.99],
    ['Investigador de Polícia — Médio/Superior I — A', 5620.58], ['Investigador de Polícia — Médio/Superior I — B', 5789.19], ['Investigador de Polícia — Médio/Superior I — C', 5962.86], ['Investigador de Polícia — Médio/Superior I — D', 6141.75], ['Investigador de Polícia — Médio/Superior I — E', 6504.99],
    ['Investigador de Polícia — Fundamental T — A', 5058.50], ['Investigador de Polícia — Fundamental T — B', 5353.43], ['Investigador de Polícia — Fundamental T — C', 5451.93], ['Investigador de Polícia — Fundamental T — D', 5481.34], ['Investigador de Polícia — Fundamental T — E', 5620.58]
  ].map(([cargo, valor]) => linhaRemuneracaoOficial(cargo, valor, 0, 'Vencimento básico oficial da tabela Grupo XI — Defesa Social. Vigência: 01/01/2026.', 'Ajuda de custo para alimentação regulamentada pelo Decreto MG nº 49.006/2025; não somada por depender de regra, valor e dias efetivamente trabalhados.', 'pcmg'))
};

function getTabelaCargosRemuneracao(inst) {
  const map = {
    pmesp: CARGOS_PM,    pcsp: CARGOS_PC,    ppsp: CARGOS_PPSP,
    pmerj: CARGOS_PMERJ, pcerj: CARGOS_PCERJ, pprj: CARGOS_PPRJ,
    pmmg: CARGOS_PMMG,   pcmg: CARGOS_PCMG,   ppmg: CARGOS_PPMG,
    pmba: CARGOS_PMBA,   pcba: CARGOS_PCBA,   ppba: CARGOS_PPBA,
    pmpr: CARGOS_PMPR,   pcpr: CARGOS_PCPR,   pppr: CARGOS_PPPR,
    pmrs: CARGOS_PMRS,   pcrs: CARGOS_PCRS,   pprs: CARGOS_PPRS,
    pmsc: CARGOS_PMSC,   pcsc: CARGOS_PCSC,   ppsc: CARGOS_PPSC,
    pmes: CARGOS_PMES,   pces: CARGOS_PCES,   ppes: CARGOS_PPES,
    pmms: CARGOS_PMMS,   pcms: CARGOS_PCMS,   ppms: CARGOS_PPMS,
    pmmt: CARGOS_PMMT,   pcmt: CARGOS_PCMT,   ppmt: CARGOS_PPMT,};
  return map[normalizarInstituicao(inst)] || CARGOS_PM;
}

function calcularRemuneracaoTabelada(inst, cargo) {
  inst = normalizarInstituicao(inst);
  const padrao = Number(cargo.padrao || 0);
  const gratif = Number(cargo.gratif || 0);
  let remuneracao = padrao + gratif;
  let beneficios = 0;
  let criterio = 'Vencimento/subsídio bruto mensal do cargo.';
  let benefDesc = 'Benefício fixo geral não somado.';
  let fonteKey = inst;
  let badge = cargo.oficial ? 'Fonte oficial' : 'Carreira operacional';

  if (isPoliciaPenal(inst)) {
    remuneracao = padrao;
    beneficios = Number(cargo.beneficios || 0);
    criterio = cargo.criterio || 'Remuneração bruta mensal de referência da tabela oficial da Polícia Penal.';
    benefDesc = cargo.benefDesc || 'Auxílios, adicionais, plantões e parcelas indenizatórias dependem de lei, escala, lotação e situação funcional; não foram somados automaticamente.';
    fonteKey = cargo.fonteKey || inst;
    badge = cargo.badge || 'Fonte oficial';
  } else if (inst === 'pmms') {
    remuneracao = padrao;
    beneficios = 0;
    criterio = cargo.criterio || 'Tabela salarial militar de Mato Grosso do Sul por posto/graduação e nível; confirmar DOE/MS, edital ou contracheque para rubricas individuais.';
    benefDesc = cargo.benefDesc || 'Auxílios, adicionais, fardamento, indenizações e verbas por escala/lotação dependem da legislação estadual, ato administrativo e contracheque; não foram somados automaticamente.';
    fonteKey = cargo.fonteKey || 'pmms';
    badge = cargo.valorPendente || padrao <= 0 ? 'A confirmar' : (cargo.badge || 'Tabela 05/2025');
  } else if (inst === 'pcms') {
    remuneracao = padrao;
    beneficios = 0;
    criterio = cargo.criterio || 'Tabela legal/edital da Polícia Civil de Mato Grosso do Sul; conferir DOE/MS, edital vigente e contracheque para a situação individual.';
    benefDesc = cargo.benefDesc || 'Abonos, adicionais, plantões, indenizações e outras rubricas dependem da legislação estadual, lotação, escala e contracheque; não foram somados automaticamente.';
    fonteKey = cargo.fonteKey || 'pcms';
    badge = cargo.valorPendente || padrao <= 0 ? 'A confirmar' : (cargo.badge || 'Fonte oficial');
  } else if (inst === 'pmmt') {
    remuneracao = padrao;
    beneficios = 0;
    criterio = cargo.criterio || 'Referência de edital/portal oficial da PMMT; postos sem valor confirmado ficam como "a confirmar".';
    benefDesc = cargo.benefDesc || 'Adicionais, indenizações, etapas, auxílio, escala, fardamento e demais rubricas dependem da legislação estadual, lotação, escala e contracheque; não foram somados automaticamente.';
    fonteKey = cargo.fonteKey || 'pmmt';
    badge = cargo.valorPendente || padrao <= 0 ? 'A confirmar' : (cargo.badge || 'Edital/portal oficial');
  } else if (inst === 'pcmt') {
    remuneracao = padrao;
    beneficios = 0;
    criterio = cargo.criterio || 'Tabela salarial do Portal do Servidor/SEPLAG-MT usada para referências cadastradas da PCMT; cargos sem tabela específica confirmada ficam como "a confirmar".';
    benefDesc = cargo.benefDesc || 'Adicionais, plantões, indenizações, verbas de escala e demais rubricas dependem da legislação estadual, lotação, escala e contracheque; não foram somados automaticamente.';
    fonteKey = cargo.fonteKey || 'pcmt';
    badge = cargo.valorPendente || padrao <= 0 ? 'A confirmar' : (cargo.badge || 'Tabela 2025');
  } else if (inst === 'pmerj') {
    const gret = padrao * Number(cargo.gretPct || 0);
    const ghp = padrao * Number(cargo.ghpPct || 0);
    const gram = (padrao + gret + ghp) * 0.625;
    remuneracao = padrao + gret + ghp + gram;
    beneficios = 0;
    criterio = 'Soldo + GRET + GHP + GRAM, conforme tabela remuneratória SEPM/RJ.';
    benefDesc = 'Benefícios gerais não somados nesta linha; a tabela oficial da SEPM apresenta remuneração por parcelas.';
  } else if (inst === 'pcerj') {
    const aapOuRepresentacao = cargo.delegado
      ? padrao * Number(cargo.representacaoPct || 2.12)
      : padrao * Number(cargo.aapPct || 2.30);
    const ghp = padrao * Number(cargo.ghpPct || 0);
    const gatc = padrao * Number(cargo.gatcPct || 0);
    remuneracao = padrao + aapOuRepresentacao + ghp + gatc;
    beneficios = 804;
    criterio = cargo.delegado
      ? 'VB + verba de representação + GHP máxima, conforme tabela SEPOL/RJ.'
      : 'VB + AAP + GHP máxima + GATC quando aplicável, conforme tabela SEPOL/RJ.';
    benefDesc = 'Auxílio alimentação R$ 704,00/mês + auxílio transporte R$ 100,00.';
  } else if (inst === 'pmpr' || inst === 'pcpr') {
    remuneracao = padrao;
    beneficios = AUX_ALIM_PR_PADRAO;
    criterio = 'Subsídio bruto mensal por cargo/classe.';
    benefDesc = `Auxílio-alimentação oficial PR: ${fmt(AUX_ALIM_PR_PADRAO)}.`;
  } else if (inst === 'pmrs') {
    remuneracao = padrao;
    beneficios = AUX_ALIM_RS_BM;
    criterio = 'Remuneração bruta mensal de referência por posto/graduação conforme RHE/RS 11/2025 e editais oficiais BMRS 2025 para linhas de ingresso.';
    benefDesc = `Auxílio-alimentação BM/RS informado em edital: ${fmt(AUX_ALIM_RS_BM)}.`;
  } else if (inst === 'pcrs') {
    remuneracao = padrao;
    beneficios = 0;
    criterio = 'Subsídio/vencimento bruto mensal por cargo/classe conforme editais PCRS 2025, tabelas de carreira e relação RHE/RS 11/2025.';
    benefDesc = 'Adicionais, indenizações e auxílios dependem de rubrica, lotação e situação funcional; não somados automaticamente.';
  } else if (inst === 'pmsc') {
    remuneracao = padrao;
    beneficios = AUX_ALIM_SC_PADRAO;
    criterio = 'Subsídio bruto mensal por posto/graduação conforme LC SC 765/2020, LC SC 776/2021, LC SC 872/2025 e LC SC 880/2025.';
    benefDesc = `Auxílio-alimentação SC de referência: ${fmt(AUX_ALIM_SC_PADRAO)}; verba indenizatória não somada automaticamente ao bruto.`;
  } else if (inst === 'pcsc') {
    remuneracao = padrao;
    beneficios = AUX_ALIM_SC_PADRAO;
    criterio = 'Subsídio bruto mensal por cargo/classe conforme LC SC 765/2020, LC SC 776/2021, LC SC 872/2025 e estatuto da PCSC; Agente/Escrivão conferidos nos editais PCSC 2025.';
    benefDesc = `Auxílio-alimentação SC de referência: ${fmt(AUX_ALIM_SC_PADRAO)}; nos editais PCSC 2025 aparece compondo o total divulgado de Agente e Escrivão.`;
  } else if (inst === 'pmes') {
    remuneracao = padrao;
    beneficios = AUX_ALIM_ES_PADRAO;
    criterio = 'Subsídio bruto mensal por posto/graduação conforme regime de subsídio dos militares estaduais do ES, tabela PM/CBM a partir de 01/12/2025 e editais PMES para linhas de formação.';
    benefDesc = `Auxílio-alimentação ES de referência: ${fmt(AUX_ALIM_ES_PADRAO)}; não somado automaticamente ao bruto. Auxílio-fardamento e serviço extraordinário dependem de regra, escala e situação funcional.`;
  } else if (inst === 'pces') {
    remuneracao = padrao;
    beneficios = AUX_ALIM_ES_PADRAO;
    criterio = 'Subsídio bruto mensal por cargo/categoria/referência conforme tabelas de Delegado, OIP/PCES e carreiras periciais PCIES vinculadas à legislação estadual do ES.';
    benefDesc = `Auxílio-alimentação ES de referência: ${fmt(AUX_ALIM_ES_PADRAO)}; não somado automaticamente ao bruto. Para carreiras por subsídio, vantagens pessoais podem estar absorvidas conforme opção/regime legal.`;
  }

  return { remuneracao, beneficios, total: remuneracao + beneficios, criterio, benefDesc, fonteKey, badge };
}

function gerarRemuneracaoTabelada(inst) {
  inst = normalizarInstituicao(inst);
  if (REMUNERACAO_SP_OFICIAL[inst]) return REMUNERACAO_SP_OFICIAL[inst];
  if (REMUNERACAO_MG_OFICIAL[inst]) return REMUNERACAO_MG_OFICIAL[inst];

  if (inst === 'pmba') {
    const refs = ['I', 'II', 'III', 'IV', 'V'];
    return CARGOS_PMBA.flatMap(cargo => (cargo.gapBa || [0]).map((gap, idx) => {
      const remuneracao = Number(cargo.padrao || 0) + Number(gap || 0);
      return linhaRemuneracaoOficial(
        `${cargo.text} — GAP Ref. ${refs[idx] || (idx + 1)}`,
        remuneracao,
        256.18,
        `Soldo oficial + GAP Referência ${refs[idx] || (idx + 1)}. Valores de soldo com efeito em 01/05/2026 e GAP com efeito em 01/06/2026.`,
        'Auxílio fardamento oficial mensal: R$ 256,18. Auxílio-alimentação não somado por falta de valor geral oficial nesta fonte.',
        'pmba',
        cargo.oficial ? 'Fonte oficial' : 'Carreira operacional'
      );
    }));
  }

  if (inst === 'pcba') {
    const refs = ['I', 'II', 'III', 'IV', 'V'];
    return CARGOS_PCBA.flatMap(cargo => (cargo.gratBa || [0]).map((grat, idx) => {
      const remuneracao = Number(cargo.padrao || 0) + Number(grat || 0);
      return linhaRemuneracaoOficial(
        `${cargo.text} — ${cargo.gratBaLabel || 'GAJ/GAPJ'} Ref. ${refs[idx] || (idx + 1)}`,
        remuneracao,
        0,
        `${cargo.gratBaLabel || 'GAJ/GAPJ'} Referência ${refs[idx] || (idx + 1)}. Valores com efeito em 01/06/2026.`,
        'Benefício fixo geral não somado nesta fonte oficial.',
        'pcba',
        cargo.oficial ? 'Fonte oficial' : 'Carreira operacional'
      );
    }));
  }

  return getTabelaCargosRemuneracao(inst).map(cargo => {
    const calc = calcularRemuneracaoTabelada(inst, cargo);
    return linhaRemuneracaoOficial(cargo.text, calc.remuneracao, calc.beneficios, calc.criterio, calc.benefDesc, calc.fonteKey, calc.badge);
  });
}

function formatarAdicionaisRemuneracaoHtml(inst, linha = {}) {
  const resumo = String(getAdicionaisRemuneracaoResumo(inst, linha) || '').replace(/\s+/g, ' ').trim();

  if (!resumo) {
    return '<span class="adicionais-vazio">Sem adicionais ou auxílios específicos cadastrados para esta linha.</span>';
  }

  const partes = resumo
    .split(/;\s+|\.\s+/)
    .map(parte => parte.trim().replace(/[.;]$/, ''))
    .filter(Boolean);

  const itens = partes.length ? partes : [resumo];

  return `<ul class="adicionais-lista">${itens.map(texto => {
    const match = texto.match(/^([^:]{2,52}):\s*(.+)$/);
    if (match) {
      return `<li><strong>${escapeHtml(match[1])}:</strong> ${escapeHtml(match[2])}</li>`;
    }
    return `<li>${escapeHtml(texto)}</li>`;
  }).join('')}</ul>`;
}

function carregarRemuneracaoTabelada() {
  const inst = normalizarInstituicao(currInst);
  const tbody = document.getElementById('lista-remuneracao');
  if (!tbody) return;

  const linhas = gerarRemuneracaoTabelada(inst);

  if (!linhas.length) {
    tbody.innerHTML = '<tr><td colspan="4">Não há dados cadastrados para esta instituição.</td></tr>';
    return;
  }

  const remuneracoes = linhas.map(l => l.remuneracao).filter(v => Number(v) > 0);
  const menor = remuneracoes.length ? Math.min(...remuneracoes) : 0;
  const maior = remuneracoes.length ? Math.max(...remuneracoes) : 0;

  const elTotal = document.getElementById('remu-total-cargos');
  const elMenor = document.getElementById('remu-menor-total');
  const elMaior = document.getElementById('remu-maior-total');
  if (elTotal) elTotal.textContent = String(linhas.length);
  if (elMenor) elMenor.textContent = menor ? fmt(menor) : 'A confirmar';
  if (elMaior) elMaior.textContent = maior ? fmt(maior) : 'A confirmar';

  tbody.innerHTML = linhas.map(l => {
    const fonte = REMUNERACAO_FONTES_OFICIAIS[l.fonteKey] || REMUNERACAO_FONTES_OFICIAIS[inst] || { nome: 'Fonte oficial da carreira', url: '#' };
    return `
      <tr>
        <td>
          <strong>${escapeHtml(l.cargo)}</strong>
          <br><span class="remuneracao-badge">${escapeHtml(l.badge || 'Fonte oficial')}</span>
        </td>
        <td class="valor">${l.valorPendente ? 'A confirmar' : fmt(l.remuneracao)}</td>
        <td class="adicionais">${formatarAdicionaisRemuneracaoHtml(inst, l)}</td>
        <td>
          ${escapeHtml(l.criterio || '')}<br>
          <span class="remuneracao-fonte">${escapeHtml(fonte.nome)}</span><br>
          <a class="remuneracao-link" href="${escapeHtml(fonte.url)}" target="_blank" rel="noopener noreferrer">Abrir fonte oficial</a>
        </td>
      </tr>
    `;
  }).join('');
}


/* ============================================================ */
/* === TROCA INSTITUIÇÃO ====================================== */
/* ============================================================ */

const HEADER_ESTADOS = {
  sp: {
    nome: 'São Paulo',
    sigla: 'SP',
    pm: 'pmesp',
    pc: 'pcsp',
    pp: 'ppsp',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg'
  },
  rj: {
    nome: 'Rio de Janeiro',
    sigla: 'RJ',
    pm: 'pmerj',
    pc: 'pcerj',
    pp: 'pprj',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_estado_do_Rio_de_Janeiro.svg'
  },
  mg: {
    nome: 'Minas Gerais',
    sigla: 'MG',
    pm: 'pmmg',
    pc: 'pcmg',
    pp: 'ppmg',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Minas_Gerais.svg'
  },
  ba: {
    nome: 'Bahia',
    sigla: 'BA',
    pm: 'pmba',
    pc: 'pcba',
    pp: 'ppba',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_da_Bahia.svg'
  },
  pr: {
    nome: 'Paraná',
    sigla: 'PR',
    pm: 'pmpr',
    pc: 'pcpr',
    pp: 'pppr',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Paran%C3%A1.svg'
  },
  rs: {
    nome: 'Rio Grande do Sul',
    sigla: 'RS',
    pm: 'pmrs',
    pc: 'pcrs',
    pp: 'pprs',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Rio_Grande_do_Sul.svg'
  },
  sc: {
    nome: 'Santa Catarina',
    sigla: 'SC',
    pm: 'pmsc',
    pc: 'pcsc',
    pp: 'ppsc',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Santa_Catarina.svg'
  },
  es: {
    nome: 'Espírito Santo',
    sigla: 'ES',
    pm: 'pmes',
    pc: 'pces',
    pp: 'ppes',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Esp%C3%ADrito_Santo.svg'
  },
  ms: {
    nome: 'Mato Grosso do Sul',
    sigla: 'MS',
    pm: 'pmms',
    pc: 'pcms',
    pp: 'ppms',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Mato_Grosso_do_Sul.svg'
  },
  mt: {
    nome: 'Mato Grosso',
    sigla: 'MT',
    pm: 'pmmt',
    pc: 'pcmt',
    pp: 'ppmt',
    flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Mato_Grosso.svg'
  }
};

const HEADER_INSTITUICOES_INFO = {
  pmesp: { titulo: 'PMESP', desc: 'Polícia Militar de São Paulo' },
  pcsp:  { titulo: 'PCSP',  desc: 'Polícia Civil de São Paulo' },
  pmerj: { titulo: 'PMERJ', desc: 'Polícia Militar do Rio de Janeiro' },
  pcerj: { titulo: 'PCERJ', desc: 'Polícia Civil do Rio de Janeiro' },
  pmmg:  { titulo: 'PMMG',  desc: 'Polícia Militar de Minas Gerais' },
  pcmg:  { titulo: 'PCMG',  desc: 'Polícia Civil de Minas Gerais' },
  pmba:  { titulo: 'PMBA',  desc: 'Polícia Militar da Bahia' },
  pcba:  { titulo: 'PCBA',  desc: 'Polícia Civil da Bahia' },
  pmpr:  { titulo: 'PMPR',  desc: 'Polícia Militar do Paraná' },
  pcpr:  { titulo: 'PCPR',  desc: 'Polícia Civil do Paraná' },
  pmrs:  { titulo: 'PMRS',  desc: 'Brigada Militar do Rio Grande do Sul' },
  pcrs:  { titulo: 'PCRS',  desc: 'Polícia Civil do Rio Grande do Sul' },
  pmsc:  { titulo: 'PMSC',  desc: 'Polícia Militar de Santa Catarina' },
  pcsc:  { titulo: 'PCSC',  desc: 'Polícia Civil de Santa Catarina' },
  pmes:  { titulo: 'PMES',  desc: 'Polícia Militar do Espírito Santo' },
  pces:  { titulo: 'PCES',  desc: 'Polícia Civil do Espírito Santo' },
  ppsp: { titulo: 'PPSP', desc: 'Polícia Penal de São Paulo' },
  pprj: { titulo: 'PPRJ', desc: 'Polícia Penal do Rio de Janeiro' },
  ppmg: { titulo: 'PPMG', desc: 'Polícia Penal de Minas Gerais' },
  ppba: { titulo: 'PPBA', desc: 'Polícia Penal da Bahia' },
  pppr: { titulo: 'PPPR', desc: 'Polícia Penal do Paraná' },
  pprs: { titulo: 'PPRS', desc: 'Polícia Penal do Rio Grande do Sul' },
  ppsc: { titulo: 'PPSC', desc: 'Polícia Penal de Santa Catarina' },
  ppes: { titulo: 'PPES', desc: 'Polícia Penal do Espírito Santo' },
  pmms: { titulo: 'PMMS', desc: 'Polícia Militar de Mato Grosso do Sul' },
  pcms: { titulo: 'PCMS', desc: 'Polícia Civil de Mato Grosso do Sul' },
  ppms: { titulo: 'PPMS', desc: 'Polícia Penal de Mato Grosso do Sul' },
  pmmt: { titulo: 'PMMT', desc: 'Polícia Militar de Mato Grosso' },
  pcmt: { titulo: 'PCMT', desc: 'Polícia Judiciária Civil de Mato Grosso' },
  ppmt: { titulo: 'PPMT', desc: 'Polícia Penal de Mato Grosso' }
};

/*
  Imagens institucionais do cabeçalho.
  Coloque os arquivos em assets/img/ exatamente com estes nomes.
  Se uma imagem não existir, o cabeçalho cai automaticamente para a bandeira do estado.
  Observação: a chave interna da Polícia Civil do RJ é pcerj, mas o arquivo informado é pcrj.jpeg.
*/
const HEADER_INSTITUICOES_IMAGENS = {
  pcba: 'pcba.jpeg',
  pces: 'pces.jpeg',
  pcmg: 'pcmg.jpeg',
  pcms: 'pcms.jpeg',
  pcmt: 'pcmt.jpeg',
  pcpr: 'pcpr.jpeg',
  pcerj: 'pcrj.jpeg',
  pcrs: 'pcrs.jpeg',
  pcsc: 'pcsc.jpeg',
  pcsp: 'pcsp.jpeg',
  pmba: 'pmba.jpeg',
  pmerj: 'pmerj.jpeg',
  pmes: 'pmes.jpeg',
  pmesp: 'pmesp.jpeg',
  pmmg: 'pmmg.jpeg',
  pmms: 'pmms.jpeg',
  pmmt: 'pmmt.jpeg',
  pmpr: 'pmpr.jpeg',
  pmrs: 'pmrs.jpeg',
  pmsc: 'pmsc.jpeg',
  ppba: 'ppba.jpeg',
  ppes: 'ppes.jpeg',
  ppmg: 'ppmg.jpeg',
  ppms: 'ppms.jpeg',
  ppmt: 'ppmt.jpeg',
  pppr: 'pppr.jpeg',
  pprj: 'pprj.jpeg',
  pprs: 'pprs.jpeg',
  ppsc: 'ppsc.jpeg',
  ppsp: 'ppsp.jpeg'
};

function montarCaminhoImagemInstituicao(inst) {
  const nomeArquivo = HEADER_INSTITUICOES_IMAGENS[inst];
  return nomeArquivo ? `assets/img/${nomeArquivo}` : '';
}

const HEADER_INSTITUICOES_RESUMO = {
  pmesp: { criacao: '15/12/1831', ativa: 82000, reserva: 90000, populacao: 46081801, governador: 'Tarcísio de Freitas', comando: 'Cel PM José Augusto Coutinho — Comandante-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pcsp:  { criacao: 'Origem histórica: 1841', ativa: 28000, reserva: 35000, populacao: 46081801, governador: 'Tarcísio de Freitas', comando: 'Delegado Artur José Dian — Delegado-Geral de Polícia', atualizado: 'Atualizado em 28/04/2026' },
  pmerj: { criacao: '13/05/1809', ativa: 43000, reserva: 40000, populacao: 17223547, governador: 'Douglas Ruas — Governador em exercício', comando: 'Cel PM Sylvio Ricardo Ciuffo Guerra — Secretário de Estado e Comandante-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pcerj: { criacao: 'Origem histórica: 1808', ativa: 9000, reserva: 10000, populacao: 17223547, governador: 'Douglas Ruas — Governador em exercício', comando: 'Delegado Delmir Gouveia — Secretário de Estado de Polícia Civil', atualizado: 'Atualizado em 28/04/2026' },
  pmmg:  { criacao: '09/06/1775', ativa: 40000, reserva: 45000, populacao: 21393441, governador: 'Mateus Simões', comando: 'Cel PM Carlos Frederico Otoni Garcia — Comandante-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pcmg:  { criacao: 'Origem histórica: 1891', ativa: 10000, reserva: 11000, populacao: 21393441, governador: 'Mateus Simões', comando: 'Delegada-Geral Letícia Baptista Gamboge Reis — Chefe da Polícia Civil', atualizado: 'Atualizado em 28/04/2026' },
  pmba:  { criacao: '17/02/1825', ativa: 30000, reserva: 27000, populacao: 14870907, governador: 'Jerônimo Rodrigues', comando: 'Cel PM Antônio Carlos Silva Magalhães — Comandante-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pcba:  { criacao: 'Origem histórica: 1833', ativa: 6000, reserva: 7000, populacao: 14870907, governador: 'Jerônimo Rodrigues', comando: 'Delegado André Viana — Delegado-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pmpr:  { criacao: '10/08/1854', ativa: 18000, reserva: 20000, populacao: 11890517, governador: 'Carlos Massa Ratinho Junior', comando: 'Cel PM Jefferson Silva — Comandante-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pcpr:  { criacao: 'Origem histórica: 1853', ativa: 5000, reserva: 6000, populacao: 11890517, governador: 'Carlos Massa Ratinho Junior', comando: 'Delegado Silvio Jacob Rockembach — Delegado-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pmrs:  { criacao: '18/11/1837', ativa: 18000, reserva: 23000, populacao: 11233263, governador: 'Eduardo Leite', comando: 'Cel PM Luigi Gustavo Soares Pereira — Comandante-Geral da Brigada Militar', atualizado: 'Atualizado em 28/04/2026' },
  pcrs:  { criacao: 'Origem histórica: 1841', ativa: 5500, reserva: 7000, populacao: 11233263, governador: 'Eduardo Leite', comando: 'Delegado Heraldo Chaves Guerreiro — Chefe de Polícia', atualizado: 'Atualizado em 28/04/2026' },
  pmsc:  { criacao: '05/05/1835', ativa: 10500, reserva: 12000, populacao: 8187029, governador: 'Jorginho Mello', comando: 'Cel PM Emerson Fernandes — Comandante-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pcsc:  { criacao: 'Origem histórica: 1812', ativa: 3500, reserva: 4500, populacao: 8187029, governador: 'Jorginho Mello', comando: 'Delegado Ulisses Gabriel — Delegado-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pmes:  { criacao: '06/04/1835', ativa: 8000, reserva: 7000, populacao: 4126854, governador: 'Ricardo Ferraço', comando: 'Cel PM Ríodo Lopes Rubim — Comandante-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pces:  { criacao: 'Origem histórica: 1896', ativa: 2500, reserva: 3500, populacao: 4126854, governador: 'Ricardo Ferraço', comando: 'Delegado-Geral Jordano Bruno — Delegado-Geral', atualizado: 'Atualizado em 28/04/2026' },
  ppsp: { criacao: 'EC 104/2019 · EC SP 51/2022 · LC SP 1.416/2024', ativaLabel: 'Carreira em implantação · concurso SAP/2025 com 1.100 vagas', reservaLabel: 'Inativos: SPPREV/SAP · quadro de origem em transição', totalLabel: 'Órgão permanente de segurança pública da SAP/SP', relacaoLabel: 'Relação ativa será consolidada após provimento oficial do quadro', populacao: 46081801, governador: 'Tarcísio de Freitas', comando: 'Rodrigo Santos Andrade — Diretor-Geral da Polícia Penal/SP', atualizado: 'Atualizado em 28/04/2026' },
  pprj: { criacao: 'EC 104/2019 · Secretaria de Estado de Polícia Penal/SEAP-RJ', ativaLabel: 'Ativo: conferir SEAP/RJ · operação 2026 mobilizou 2.355 policiais penais', reservaLabel: 'Inativos: RioPrevidência/SEAP-RJ', totalLabel: 'Carreira de Inspetor de Polícia Penal · concurso/renovação em acompanhamento', relacaoLabel: 'Relação depende do efetivo ativo consolidado pela SEAP/RJ', populacao: 17223547, governador: 'Ricardo Couto — Governador em exercício', comando: 'Secretaria de Estado de Polícia Penal do Rio de Janeiro — SEAP/SEPPEN', atualizado: 'Atualizado em 28/04/2026' },
  ppmg: { criacao: 'EC 104/2019 · carreira estadual da Polícia Penal/MG', ativaLabel: 'Concurso SEJUSP/MG 2025: 1.178 vagas · carreira em expansão', reservaLabel: 'Inativos: IPSEMG/regime estadual', totalLabel: 'Sistema prisional mineiro reforçado por nomeações recentes', relacaoLabel: 'Relação depende de efetivo ativo consolidado pela SEJUSP/MG', populacao: 21393441, governador: 'Mateus Simões', comando: 'Leonardo Mattos Alves Badaró — Diretor-Geral do Departamento Penitenciário/MG', atualizado: 'Atualizado em 28/04/2026' },
  ppba: { criacao: 'EC 104/2019 · estrutura estadual da SEAP/BA', ativaLabel: 'Efetivo oficial: conferir SEAP/BA · GEOP e unidades prisionais em operação', reservaLabel: 'Inativos: Funprev/BA', totalLabel: 'Sistema prisional baiano com ACADEPPEN, GEOP e segurança prisional', relacaoLabel: 'Relação depende de efetivo ativo consolidado pela SEAP/BA', populacao: 14870907, governador: 'Jerônimo Rodrigues', comando: 'José Castro — Secretário da SEAP/BA · Luiz Cláudio — Superintendência · Archimedes Neto — Segurança Prisional', atualizado: 'Atualizado em 28/04/2026' },
  pppr: { criacao: 'EC 104/2019 · QPPP modernizado pela LC PR 245/2022 e LC PR 283/2025', ativaLabel: '429 novos policiais penais nomeados em 2025', reservaLabel: 'Inativos: ParanáPrevidência', totalLabel: '1.181 promoções autorizadas após reestruturação do QPPP', relacaoLabel: 'Relação depende do efetivo ativo consolidado pela Polícia Penal/PR', populacao: 11890517, governador: 'Carlos Massa Ratinho Junior', comando: 'Ananda Chalegre dos Santos — Diretora-Geral da Polícia Penal/PR', atualizado: 'Atualizado em 28/04/2026' },
  pprs: { criacao: 'EC 104/2019 · EC RS 82/2022 · LC RS 16.449/2025', ativaLabel: 'Quadro legal: 6.938 cargos de Policial Penal', reservaLabel: 'Inativos: IPE Prev/RS', totalLabel: '5.364 nomeações desde 2019 · 643 novos servidores em formação em 2026', relacaoLabel: 'Relação aproximada depende do provimento efetivo dos cargos', populacao: 11233263, governador: 'Eduardo Leite', comando: 'Sergio Dalcol — Superintendente da Polícia Penal/RS · Jorge Pozzobom — Secretário da SSPS', atualizado: 'Atualizado em 28/04/2026' },
  ppsc: { criacao: 'EC 104/2019 · EC SC 80/2020 · LC SC 774/2021', ativa: 4809, ativaLabel: '4.809 profissionais informados pelo Governo/SC', reservaLabel: 'Inativos: IPREV/SC', totalLabel: '1.644 nomeações informadas em 2025 · carreira estruturada em 8 classes', relacaoLabel: '1 profissional / 1.703 hab. · cálculo aproximado com efetivo divulgado', populacao: 8187029, governador: 'Jorginho Mello', comando: 'Maicon Ronald Alves — Diretor-Geral do Departamento de Polícia Penal/SC', atualizado: 'Atualizado em 28/04/2026' },
  ppes: { criacao: 'EC 104/2019 · LC ES 1.059/2023 · LC ES 1.061/2023', ativaLabel: 'Meta institucional: 3.300 policiais penais concursados · concurso com 600 vagas', reservaLabel: 'Inativos: IPAJM/ES', totalLabel: 'Órgão próprio vinculado à SEJUS/ES · carreira em consolidação', relacaoLabel: 'Relação aproximada depende do provimento e da lotação efetiva', populacao: 4126854, governador: 'Ricardo Ferraço', comando: 'José Franco Morais Junior — Diretor-Geral da Polícia Penal/ES', atualizado: 'Atualizado em 28/04/2026' },
  pmms: { criacao: '05/09/1835 · MS estruturada em 1979', ativa: 10602, ativaLabel: 'Efetivo legal: 10.602 PMs', reservaLabel: 'Reserva/inativos: AGEPREV/MS', totalLabel: 'Ativo legal 10.602 · reserva à parte', populacao: 2924631, governador: 'Eduardo Riedel', comando: 'Cel QOPM Renato dos Anjos Garnes — Comandante-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pcms: { criacao: 'Abril/1979 · LC MS 114/2005', ativa: 2373, ativaLabel: '2.373 policiais na ativa', reservaLabel: 'Inativos: AGEPREV/MS', totalLabel: '2.373 ativos · inativos à parte', populacao: 2924631, governador: 'Eduardo Riedel', comando: 'Delegado Lupérsio Degerone Lúcio — Delegado-Geral', atualizado: 'Atualizado em 28/04/2026' },
  ppms: { criacao: 'EC 104/2019 · EC MS 88/2021 · Lei MS 5.846/2022', ativa: 1903, ativaLabel: '≈ 1.903 servidores ativos AGEPEN/PP', reservaLabel: 'Inativos: AGEPREV/MS', totalLabel: 'Ativo informado ≈ 1.903 · inativos à parte', populacao: 2924631, governador: 'Eduardo Riedel', comando: POLICIAS_PENAIS_INFO.ppms.direcao, atualizado: POLICIAS_PENAIS_INFO.ppms.atualizado },
  pmmt: { criacao: '05/09/1835 · LC MT 529/2014', ativa: 7275, ativaLabel: 'Ativo informado: 7.275 PMs', reservaLabel: 'Reserva/inativos: MTPREV/MT', totalLabel: 'Efetivo legal previsto: 12.495 PMs', populacao: 3893659, governador: 'Mauro Mendes', comando: 'Cel PM Claudio Fernando Carneiro Tinoco — Comandante-Geral', atualizado: 'Atualizado em 28/04/2026' },
  pcmt: { criacao: 'Lei MT 7.935/2003 · LC MT 407/2010', ativa: 2983, ativaLabel: 'Ativo informado: 2.983 policiais civis', reservaLabel: 'Inativos: MTPREV/MT', totalLabel: 'Efetivo legal: 5.600 cargos PJC', populacao: 3893659, governador: 'Mauro Mendes', comando: 'Delegada Daniela Silveira Maidel — Delegada-Geral', atualizado: 'Atualizado em 28/04/2026' },
  ppmt: { criacao: 'EC 104/2019 · SEJUS/MT · Polícia Penal MT', ativa: 2620, ativaLabel: 'Ativo informado: 2.620 policiais penais', reservaLabel: 'Inativos: MTPREV/MT', totalLabel: '2.620 ativos · inativos à parte', populacao: 3893659, governador: 'Mauro Mendes', comando: POLICIAS_PENAIS_INFO.ppmt.direcao, atualizado: POLICIAS_PENAIS_INFO.ppmt.atualizado }
};

function formatarNumeroHeader(valor) {
  return Number(valor || 0).toLocaleString('pt-BR');
}

function formatarEfetivoHeader(valor) {
  const numero = Number(valor || 0);
  if (!numero) return 'Não informado';
  if (numero >= 1000) {
    const mil = numero / 1000;
    const texto = Number.isInteger(mil) ? String(mil) : mil.toFixed(1).replace('.', ',');
    return `≈ ${texto} mil`;
  }
  return `≈ ${formatarNumeroHeader(numero)}`;
}

function calcularRelacaoHeader(populacao, ativa) {
  const pop = Number(populacao || 0);
  const ativo = Number(ativa || 0);
  if (!pop || !ativo) return 'Não informado';
  const habitantesPorAtivo = Math.round(pop / ativo);
  const percentual = ((ativo / pop) * 100).toFixed(3).replace('.', ',');
  return `1 ativo / ${habitantesPorAtivo.toLocaleString('pt-BR')} hab. · ${percentual}%`;
}

function atualizarLabelsHeaderResumo(labels = {}) {
  const padrao = {
    'header-label-criacao': 'Criação',
    'header-label-ativa': 'Efetivo ativo',
    'header-label-reserva': 'Reserva/inativos',
    'header-label-total': 'Efetivo total',
    'header-label-populacao': 'População UF',
    'header-label-relacao': 'Relação ativa',
    'header-label-governador': 'Chefe do Executivo',
    'header-label-comando': 'Comando atual'
  };

  Object.entries({ ...padrao, ...labels }).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  });
}

function calcularResumoPortalHeader() {
  const instituicoes = INSTITUICOES_VALIDAS.length;
  const estados = Object.keys(HEADER_ESTADOS).length;
  let ativa = 0;
  let reserva = 0;
  let populacao = 0;

  INSTITUICOES_VALIDAS.forEach(inst => {
    const dados = HEADER_INSTITUICOES_RESUMO[inst] || {};
    const infoPenal = POLICIAS_PENAIS_INFO?.[inst] || {};
    ativa += Number(dados.ativa || infoPenal.efetivoAtivo || 0);
    reserva += Number(dados.reserva || 0);
  });

  Object.values(HEADER_ESTADOS).forEach(estado => {
    const ref = HEADER_INSTITUICOES_RESUMO[estado.pm] || HEADER_INSTITUICOES_RESUMO[estado.pc] || HEADER_INSTITUICOES_RESUMO[estado.pp] || {};
    populacao += Number(ref.populacao || 0);
  });

  return { instituicoes, estados, ativa, reserva, total: ativa + reserva, populacao };
}

function aplicarHeaderInicialPortal() {
  headerModoInicialPortal = true;
  document.body.setAttribute('data-inst', 'portal');

  const resumoPortal = calcularResumoPortalHeader();
  const setTexto = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  };

  const flagAtual = document.getElementById('header-active-flag');
  if (flagAtual) {
    flagAtual.style.display = '';
    flagAtual.dataset.imgBase = 'assets/img/logoleao';
    flagAtual.dataset.retry = '';
    flagAtual.removeAttribute('data-fallback-src');
    flagAtual.removeAttribute('data-fallback-alt');
    flagAtual.removeAttribute('data-fallback-aplicado');
    flagAtual.onerror = function () { carregarImagemProduto(this); };
    flagAtual.src = 'assets/img/logoleao.jpeg';
    flagAtual.alt = 'Logo Universo Segurança Pública';
    const moldura = flagAtual.closest('.current-flag-frame');
    if (moldura) {
      moldura.classList.remove('institution-logo-frame', 'state-flag-fallback-frame');
      moldura.classList.add('brand-logo-frame');
    }
  }

  setTexto('header-active-sigla', 'Universo');
  setTexto('header-active-name', 'Segurança Pública');
  setTexto('header-desc', 'Escolha uma instituição');
  setTexto('header-resumo-titulo', 'Resumo do portal');
  setTexto('header-resumo-atualizado', 'Visão geral do portal');

  atualizarLabelsHeaderResumo({
    'header-label-criacao': 'Instituições',
    'header-label-ativa': 'Ativos estimados',
    'header-label-reserva': 'Reserva/inativos',
    'header-label-total': 'Total abrangido',
    'header-label-populacao': 'População abrangida',
    'header-label-relacao': 'Estados',
    'header-label-governador': 'Cobertura',
    'header-label-comando': 'Primeiro passo'
  });

  setTexto('header-resumo-criacao', String(resumoPortal.instituicoes));
  setTexto('header-resumo-ativa', `${formatarEfetivoHeader(resumoPortal.ativa)}+`);
  setTexto('header-resumo-reserva', `${formatarEfetivoHeader(resumoPortal.reserva)}+`);
  setTexto('header-resumo-total', `${formatarEfetivoHeader(resumoPortal.total)}+`);
  setTexto('header-resumo-populacao', formatarNumeroHeader(resumoPortal.populacao));
  setTexto('header-resumo-relacao', `${resumoPortal.estados} estados`);
  setTexto('header-resumo-governador', 'Polícias militares, civis e penais');
  setTexto('header-resumo-comando', 'Selecione uma instituição para ver os dados específicos');

  ['instituicao', 'instituicao_header'].forEach(id => {
    const seletor = document.getElementById(id);
    if (seletor) seletor.value = '';
  });

  [['header-pm-sigla', 'PM'], ['header-pc-sigla', 'PC'], ['header-pp-sigla', 'PP']].forEach(([id, valor]) => setTexto(id, valor));
  ['header-branch-pm', 'header-branch-pc', 'header-branch-pp'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.disabled = true;
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });

  document.querySelectorAll('.state-flag').forEach(flag => {
    flag.classList.remove('active');
    flag.setAttribute('aria-pressed', 'false');
  });

  atualizarVisibilidadeResumoInstitucional('principal');
}

function atualizarHeaderResumo(inst) {
  atualizarLabelsHeaderResumo();
  const tituloResumo = document.getElementById('header-resumo-titulo');
  if (tituloResumo) tituloResumo.textContent = 'Resumo institucional';

  const dados = HEADER_INSTITUICOES_RESUMO[inst] || HEADER_INSTITUICOES_RESUMO.pmesp;
  const totalEfetivo = Number(dados.ativa || 0) + Number(dados.reserva || 0);
  const setTexto = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  };

  const ativaTexto = dados.ativaLabel || formatarEfetivoHeader(dados.ativa);
  const reservaTexto = dados.reservaLabel || formatarEfetivoHeader(dados.reserva);
  const totalTexto = dados.totalLabel || (totalEfetivo ? formatarEfetivoHeader(totalEfetivo) : 'Não informado');
  const relacaoTexto = dados.relacaoLabel || calcularRelacaoHeader(dados.populacao, dados.ativa);

  setTexto('header-resumo-atualizado', dados.atualizado || 'Atualizado');
  setTexto('header-resumo-criacao', dados.criacao || 'Não informado');
  setTexto('header-resumo-ativa', ativaTexto);
  setTexto('header-resumo-reserva', reservaTexto);
  setTexto('header-resumo-total', totalTexto);
  setTexto('header-resumo-populacao', dados.populacao ? formatarNumeroHeader(dados.populacao) : 'Não informado');
  setTexto('header-resumo-relacao', relacaoTexto);
  setTexto('header-resumo-governador', dados.governador || 'Não informado');
  setTexto('header-resumo-comando', dados.comando || 'Não informado');
}

function getEstadoDaInstituicao(inst) {
  return Object.keys(HEADER_ESTADOS).find(estado => {
    const item = HEADER_ESTADOS[estado];
    return item.pm === inst || item.pc === inst || item.pp === inst;
  }) || 'sp';
}

function selecionarEstado(estado) {
  const estadoNormalizado = String(estado || '').toLowerCase();
  const dadosEstado = HEADER_ESTADOS[estadoNormalizado];
  if (!dadosEstado) return;

  mudarInstituicao(dadosEstado.pm || dadosEstado.pc || dadosEstado.pp);
  switchPage('principal');
  mostrarToast(`${dadosEstado.nome} selecionado. Agora escolha Militar, Civil ou Penal no botão ao lado do seletor.`);
}

function selecionarRamo(ramo) {
  const estadoAtivo = getEstadoDaInstituicao(currInst);
  const dadosEstado = HEADER_ESTADOS[estadoAtivo] || HEADER_ESTADOS.sp;
  const instituicao = dadosEstado[ramo] || dadosEstado.pm || dadosEstado.pc || dadosEstado.pp;
  if (instituicao) mudarInstituicao(instituicao);
}

function atualizarHeaderInstitucional(inst) {
  const instituicao = HEADER_INSTITUICOES_INFO[inst] || HEADER_INSTITUICOES_INFO.pmesp;
  const estadoAtivo = getEstadoDaInstituicao(inst);
  const dadosEstado = HEADER_ESTADOS[estadoAtivo] || HEADER_ESTADOS.sp;

  const flagAtual = document.getElementById('header-active-flag');
  if (flagAtual) {
    const moldura = flagAtual.closest('.current-flag-frame');
    const imagemInstituicao = montarCaminhoImagemInstituicao(inst);
    const usaImagemInstituicao = Boolean(imagemInstituicao);

    if (moldura) {
      moldura.classList.remove('brand-logo-frame', 'institution-logo-frame', 'state-flag-fallback-frame');
      moldura.classList.add(usaImagemInstituicao ? 'institution-logo-frame' : 'state-flag-fallback-frame');
    }

    flagAtual.style.display = '';
    flagAtual.removeAttribute('data-retry');
    flagAtual.dataset.fallbackSrc = dadosEstado.flag;
    flagAtual.dataset.fallbackAlt = `Bandeira de ${dadosEstado.nome}`;
    flagAtual.dataset.fallbackAplicado = 'false';
    flagAtual.onerror = function () { carregarImagemHeaderInstituicao(this); };
    flagAtual.src = usaImagemInstituicao ? imagemInstituicao : dadosEstado.flag;
    flagAtual.alt = usaImagemInstituicao
      ? `Imagem institucional da ${instituicao.titulo} — ${instituicao.desc}`
      : `Bandeira de ${dadosEstado.nome}`;
  }

  const siglaAtual = document.getElementById('header-active-sigla');
  if (siglaAtual) siglaAtual.textContent = instituicao.titulo;

  const nomeAtual = document.getElementById('header-active-name');
  if (nomeAtual) nomeAtual.textContent = instituicao.desc;

  const pmInfo = HEADER_INSTITUICOES_INFO[dadosEstado.pm];
  const pcInfo = HEADER_INSTITUICOES_INFO[dadosEstado.pc];
  const ppInfo = HEADER_INSTITUICOES_INFO[dadosEstado.pp];

  const pmSigla = document.getElementById('header-pm-sigla');
  if (pmSigla) pmSigla.textContent = pmInfo ? pmInfo.titulo : '—';

  const pcSigla = document.getElementById('header-pc-sigla');
  if (pcSigla) pcSigla.textContent = pcInfo ? pcInfo.titulo : '—';

  const ppSigla = document.getElementById('header-pp-sigla');
  if (ppSigla) ppSigla.textContent = ppInfo ? ppInfo.titulo : 'PP';

  const btnPm = document.getElementById('header-branch-pm');
  const btnPc = document.getElementById('header-branch-pc');
  const btnPp = document.getElementById('header-branch-pp');
  if (btnPm) {
    const ativo = !!dadosEstado.pm && inst === dadosEstado.pm;
    btnPm.disabled = !dadosEstado.pm;
    btnPm.classList.toggle('active', ativo);
    btnPm.setAttribute('aria-pressed', ativo ? 'true' : 'false');
  }
  if (btnPc) {
    const ativo = !!dadosEstado.pc && inst === dadosEstado.pc;
    btnPc.disabled = !dadosEstado.pc;
    btnPc.classList.toggle('active', ativo);
    btnPc.setAttribute('aria-pressed', ativo ? 'true' : 'false');
  }
  if (btnPp) {
    const ativo = !!dadosEstado.pp && inst === dadosEstado.pp;
    btnPp.disabled = !dadosEstado.pp;
    btnPp.classList.toggle('active', ativo);
    btnPp.setAttribute('aria-pressed', ativo ? 'true' : 'false');
  }

  atualizarHeaderResumo(inst);
}

function atualizarFlagsEstado(inst) {
  const estadoAtivo = getEstadoDaInstituicao(inst);
  document.querySelectorAll('.state-flag').forEach(flag => {
    const ativo = flag.dataset.estado === estadoAtivo;
    flag.classList.toggle('active', ativo);
    flag.setAttribute('aria-pressed', ativo ? 'true' : 'false');
  });
  atualizarHeaderInstitucional(inst);
}

function mudarInstituicao(novaInstituicao) {
  if (novaInstituicao === '') return;

  const configs = {
    pmesp: { titulo: "PMESP", desc: "Polícia Militar de São Paulo", cor: "#e60000", alertaPrev: "SPPREV (previdência) é descontada automaticamente — 14% sobre vencimentos, RETP, quinquênios e sexta-parte." },
    pcsp:  { titulo: "PCSP",  desc: "Polícia Civil de São Paulo",   cor: "#4f4f4f", alertaPrev: "SPPREV (previdência) — 14% sobre vencimentos, GAT, quinquênios e sexta-parte." },
    pmerj: { titulo: "PMERJ", desc: "Polícia Militar do Rio de Janeiro", cor: "#1E3084", alertaPrev: "RioPrevidência — 14% sobre soldo, GRET, GHP, GRAM e triênios." },
    pcerj: { titulo: "PCERJ", desc: "Polícia Civil do Rio de Janeiro",    cor: "#6B7280", alertaPrev: "RioPrevidência — 14% sobre vencimento-base, AAP/representação, GHP, GATC e adicionais remuneratórios." },
    pmmg:  { titulo: "PMMG",  desc: "Polícia Militar de Minas Gerais",     cor: "#7c1a1a", alertaPrev: "IPSM — 10,5% (8% previdência + 2,5% saúde compulsória) sobre o subsídio." },
    pcmg:  { titulo: "PCMG",  desc: "Polícia Civil de Minas Gerais",        cor: "#b58d3d", alertaPrev: "IPSEMG — 11% previdência + 3,2% saúde (opcional) sobre subsídio." },
    pmba:  { titulo: "PMBA",  desc: "Polícia Militar da Bahia",             cor: "#967117", alertaPrev: "Funprev-BA — 14% sobre soldo, GAP, anuênios e CET." },
    pcba:  { titulo: "PCBA",  desc: "Polícia Civil da Bahia",                cor: "#333333", alertaPrev: "Funprev-BA — 14% sobre vencimento, anuênios, CET, GIP e GQUAL." },
    pmpr:  { titulo: "PMPR",  desc: "Polícia Militar do Paraná",              cor: "#2f6b3f", alertaPrev: "ParanáPrevidência/Sistema de Proteção Social Militar: contribuição previdenciária estimada em 14% sobre base remuneratória. FASPM é facultativo e calculado somente se selecionado." },
    pcpr:  { titulo: "PCPR",  desc: "Polícia Civil do Paraná",                 cor: "#1f5e89", alertaPrev: "ParanáPrevidência: contribuição previdenciária estimada em 14% sobre base remuneratória. Verbas indenizatórias ficam destacadas sem incidência automática." },
    pmrs:  { titulo: "PMRS",  desc: "Brigada Militar do Rio Grande do Sul",     cor: "#0f3d75", alertaPrev: "IPE Prev/RS e sistema de proteção dos militares estaduais: conferir contribuição previdenciária, rubricas e auxílio-alimentação no contracheque." },
    pcrs:  { titulo: "PCRS",  desc: "Polícia Civil do Rio Grande do Sul",       cor: "#5b6472", alertaPrev: "IPE Prev/RS: contribuição previdenciária conforme regra estadual; adicionais e indenizações dependem de rubrica e situação funcional." },
    pmsc:  { titulo: "PMSC",  desc: "Polícia Militar de Santa Catarina",        cor: "#1b4f8a", alertaPrev: "IPREV/SC e sistema de proteção dos militares estaduais: conferir contribuição previdenciária, subsídio, rubricas e auxílio-alimentação no contracheque." },
    pcsc:  { titulo: "PCSC",  desc: "Polícia Civil de Santa Catarina",          cor: "#4b5563", alertaPrev: "IPREV/SC: contribuição previdenciária conforme regra estadual; classes, subsídios e indenizações dependem de cargo, rubrica e situação funcional." },
    pmes:  { titulo: "PMES",  desc: "Polícia Militar do Espírito Santo",        cor: "#0b5c9e", alertaPrev: "IPAJM/ES e sistema estadual: conferir subsídio, referência, auxílio-alimentação, fardamento, serviço extra e demais rubricas no contracheque." },
    pces:  { titulo: "PCES",  desc: "Polícia Civil do Espírito Santo",          cor: "#4b3f72", alertaPrev: "IPAJM/ES: contribuição previdenciária conforme regra estadual; OIP, Delegado e demais carreiras exigem conferência de categoria, referência e rubricas." },
    ppsp: { titulo: "PPSP", desc: POLICIAS_PENAIS_INFO.ppsp.nome, cor: "#6f4e37", alertaPrev: `${POLICIAS_PENAIS_INFO.ppsp.sigla}: ${POLICIAS_PENAIS_INFO.ppsp.previdencia} ${POLICIAS_PENAIS_INFO.ppsp.vantagens}` },
    pprj: { titulo: "PPRJ", desc: POLICIAS_PENAIS_INFO.pprj.nome, cor: "#5a4b81", alertaPrev: `${POLICIAS_PENAIS_INFO.pprj.sigla}: ${POLICIAS_PENAIS_INFO.pprj.previdencia} ${POLICIAS_PENAIS_INFO.pprj.vantagens}` },
    ppmg: { titulo: "PPMG", desc: POLICIAS_PENAIS_INFO.ppmg.nome, cor: "#8b5a2b", alertaPrev: `${POLICIAS_PENAIS_INFO.ppmg.sigla}: ${POLICIAS_PENAIS_INFO.ppmg.previdencia} ${POLICIAS_PENAIS_INFO.ppmg.vantagens}` },
    ppba: { titulo: "PPBA", desc: POLICIAS_PENAIS_INFO.ppba.nome, cor: "#6b5b2e", alertaPrev: `${POLICIAS_PENAIS_INFO.ppba.sigla}: ${POLICIAS_PENAIS_INFO.ppba.previdencia} ${POLICIAS_PENAIS_INFO.ppba.vantagens}` },
    pppr: { titulo: "PPPR", desc: POLICIAS_PENAIS_INFO.pppr.nome, cor: "#41644a", alertaPrev: `${POLICIAS_PENAIS_INFO.pppr.sigla}: ${POLICIAS_PENAIS_INFO.pppr.previdencia} ${POLICIAS_PENAIS_INFO.pppr.vantagens}` },
    pprs: { titulo: "PPRS", desc: POLICIAS_PENAIS_INFO.pprs.nome, cor: "#315d7c", alertaPrev: `${POLICIAS_PENAIS_INFO.pprs.sigla}: ${POLICIAS_PENAIS_INFO.pprs.previdencia} ${POLICIAS_PENAIS_INFO.pprs.vantagens}` },
    ppsc: { titulo: "PPSC", desc: POLICIAS_PENAIS_INFO.ppsc.nome, cor: "#38598b", alertaPrev: `${POLICIAS_PENAIS_INFO.ppsc.sigla}: ${POLICIAS_PENAIS_INFO.ppsc.previdencia} ${POLICIAS_PENAIS_INFO.ppsc.vantagens}` },
    ppes: { titulo: "PPES", desc: POLICIAS_PENAIS_INFO.ppes.nome, cor: "#5e548e", alertaPrev: `${POLICIAS_PENAIS_INFO.ppes.sigla}: ${POLICIAS_PENAIS_INFO.ppes.previdencia} ${POLICIAS_PENAIS_INFO.ppes.vantagens}` },
    pmms: { titulo: "PMMS", desc: "Polícia Militar de Mato Grosso do Sul", cor: "#2f5f8f", alertaPrev: "PMMS: conferir sistema de proteção social dos militares estaduais, AGEPREV/MS, regra de ingresso, averbações, reserva remunerada e reforma conforme legislação estadual." },
    pcms: { titulo: "PCMS", desc: "Polícia Civil de Mato Grosso do Sul", cor: "#4b5563", alertaPrev: "PCMS: conferir LC MS 114/2005, LC MS 343/2024, AGEPREV/MS, cargo, classe, referência, tempo em atividade policial e regra de aposentadoria aplicada." },
    ppms: { titulo: "PPMS", desc: POLICIAS_PENAIS_INFO.ppms.nome, cor: "#516b3b", alertaPrev: `${POLICIAS_PENAIS_INFO.ppms.sigla}: ${POLICIAS_PENAIS_INFO.ppms.previdencia} ${POLICIAS_PENAIS_INFO.ppms.vantagens}` },
    pmmt: { titulo: "PMMT", desc: "Polícia Militar de Mato Grosso", cor: "#1f7a4d", alertaPrev: "PMMT: conferir sistema de proteção social dos militares estaduais, MTPREV/MT, regra de ingresso, averbações, reserva remunerada e reforma conforme legislação estadual." },
    pcmt: { titulo: "PCMT", desc: "Polícia Judiciária Civil de Mato Grosso", cor: "#5b6472", alertaPrev: "PCMT: conferir tabela salarial do Portal do Servidor/SEPLAG-MT, cargo, classe, nível, tempo em atividade policial, MTPREV/MT e regra de aposentadoria aplicada." },
    ppmt: { titulo: "PPMT", desc: POLICIAS_PENAIS_INFO.ppmt.nome, cor: "#6b5f2f", alertaPrev: `${POLICIAS_PENAIS_INFO.ppmt.sigla}: ${POLICIAS_PENAIS_INFO.ppmt.previdencia} ${POLICIAS_PENAIS_INFO.ppmt.vantagens}` }
  };

  const solicitada = novaInstituicao || document.getElementById('instituicao')?.value || currInst || 'pmesp';
  const inst = configs[solicitada] ? solicitada : 'pmesp';

  // Proteção contra instituições antigas/inexistentes salvas no navegador.
  // Sem isso, uma opção inválida salva no navegador poderia travar a inicialização.
  if (!configs[solicitada]) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* silencioso */ }
  }

  headerModoInicialPortal = false;
  currInst = inst;
  document.body.setAttribute('data-inst', inst);

  ['instituicao', 'instituicao_header'].forEach(id => {
    const seletor = document.getElementById(id);
    if (!seletor) return;
    const existeOpcao = Array.from(seletor.options || []).some(o => o.value === inst);
    if (existeOpcao && seletor.value !== inst) seletor.value = inst;
  });

  const config = configs[inst];
  atualizarFlagsEstado(inst);

  // Atualiza textos visíveis
  const h1 = document.querySelector('.header-text h1');
  if (h1) h1.innerHTML = `Universo <span>Segurança Pública</span>`;
  atualizarHeaderDesc(config.desc);

  const atualizarTexto = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  };
  atualizarTexto('txt-inst-dir', config.titulo);
  atualizarTexto('txt-inst-concursos', config.titulo);
  atualizarTexto('txt-inst-comparar', config.titulo);
  atualizarTexto('txt-inst-produtos', config.titulo);
  atualizarTexto('txt-inst-remuneracao', config.titulo);
  atualizarTexto('txt-inst-acoes', config.titulo);
  atualizarTexto('txt-inst-assoc', config.titulo);


  popularCargos(inst);
  analisarDireitos();
  carregarConcursos();
  carregarAcoes();
  carregarAssociacoes();
  carregarRemuneracaoTabelada();
  if (document.getElementById('page-comparar')?.classList.contains('active')) carregarComparadorCarreiras();
}


/* ============================================================ */
/* === ANÁLISE DE DIREITOS (EXPANDIDA) ======================== */
/* ============================================================ */
/* BLOCO 15.11 — Análise de direitos e vantagens */
function analisarDireitos() {
  const cont = document.getElementById('resultados_dir');
  if (!cont) return;

  const inst = currInst;
  const tempo = valEl('tempo_dir');
  const idade = valEl('idade_dir');
  const renda = valEl('renda_dir');
  const sit = document.getElementById('situacao_dir')?.value || 'ativa';
  const sexo = document.getElementById('sexo_dir')?.value || 'na';
  const ingresso = document.getElementById('ingresso_dir')?.value || '';
  const dependente = document.getElementById('dependente_dir')?.value || 'na';
  const localEspecial = document.getElementById('local_especial_dir')?.value || 'na';
  const requisitosApos = document.getElementById('requisitos_apos_dir')?.value || 'na';
  const cargoVal = document.getElementById('cargo_dir')?.value;
  const c = currTabela.find(x => x.val === cargoVal);
  if (!c) return;

  const nomesInst = {
    pmesp: 'PMESP', pcsp: 'PCSP', ppsp: 'PPSP', pmerj: 'PMERJ', pcerj: 'PCERJ', pprj: 'PPRJ',
    pmmg: 'PMMG', pcmg: 'PCMG', ppmg: 'PPMG', pmba: 'PMBA', pcba: 'PCBA', ppba: 'PPBA', pmpr: 'PMPR', pcpr: 'PCPR', pppr: 'PPPR',
    pmrs: 'PMRS', pcrs: 'PCRS', pprs: 'PPRS', pmsc: 'PMSC', pcsc: 'PCSC', ppsc: 'PPSC',
    pmes: 'PMES', pces: 'PCES', ppes: 'PPES',
    pmms: 'PMMS', pcms: 'PCMS', ppms: 'PPMS',
    pmmt: 'PMMT', pcmt: 'PCMT', ppmt: 'PPMT'
  };
  const isPM = ['pmesp', 'pmerj', 'pmmg', 'pmba', 'pmpr', 'pmrs', 'pmsc', 'pmes', 'pmms', 'pmmt'].includes(inst);
  const isPC = ['pcsp', 'pcerj', 'pcmg', 'pcba', 'pcpr', 'pcrs', 'pcsc', 'pces', 'pcms', 'pcmt'].includes(inst);
  const isPP = isPoliciaPenal(inst);
  const uf = inst.includes('sp') ? 'SP' : inst.includes('rj') ? 'RJ' : inst.includes('mg') ? 'MG' : inst.includes('ba') ? 'BA' : inst.includes('pr') ? 'PR' : inst.includes('rs') ? 'RS' : inst.includes('sc') ? 'SC' :
             inst.includes('es') ? 'ES' : inst.includes('ms') ? 'MS' : inst.includes('mt') ? 'MT' : '';
  const ingressoAntesEC103 = ingresso ? new Date(ingresso + 'T00:00:00') < new Date('2019-11-13T00:00:00') : false;

  let html = '';

  html += direitoResumo(c.text, nomesInst[inst], tempo, idade, sit, sexo, ingresso, renda, dependente);

  // ===== DIREITOS GERAIS =====
  html += direitoSecao('Direitos gerais e benefícios familiares');

  if (dependente === 'sim' && renda > 0 && renda <= 1980.38) {
    html += direitoItem('Salário-Família', 'condicionado',
      'Pelos dados informados, pode haver enquadramento no salário-família: filho/equiparado até 14 anos ou inválido e remuneração dentro do limite legal. Cota 2026: <strong>R$ 67,54</strong>.',
      'Base: Portaria Interministerial MPS/MF nº 13/2026 e tabela INSS 2026. Conferir aplicação ao regime do servidor e regras do órgão.');
  } else if (dependente === 'nao' || (renda > 1980.38)) {
    html += direitoItem('Salário-Família', 'atencao',
      'Não aparece como direito provável com os dados informados. O benefício depende de dependente elegível e remuneração dentro do limite legal.',
      'Referência 2026: cota de R$ 67,54 para remuneração até R$ 1.980,38.');
  } else {
    html += direitoItem('Salário-Família', 'condicionado',
      'Pode existir somente se houver filho/equiparado até 14 anos ou inválido e remuneração dentro do limite legal. Informe dependente e remuneração para uma análise melhor.',
      'Referência 2026: cota de R$ 67,54 para remuneração até R$ 1.980,38.');
  }

  html += direitoItem('Auxílio-Funeral', 'condicionado',
    'Benefício/indenização normalmente destinado aos dependentes ou a quem comprovar despesas de funeral, conforme regra previdenciária ou estatuto próprio da instituição.',
    'Depende de requerimento, documentação, vínculo com o servidor e norma estadual específica.');

  html += direitoItem('Pensão por Morte', 'condicionado',
    'Direito dos dependentes legalmente habilitados, observadas as regras do regime próprio, sistema de proteção social militar ou previdência estadual.',
    'Depende da qualidade de dependente, documentação, cálculo previdenciário e legislação estadual aplicável.');

  html += direitoItem('Licença-Maternidade / Paternidade', 'condicionado',
    'Direito ligado ao nascimento, adoção ou guarda, com prazos definidos pela Constituição, lei estadual, estatuto e regulamento próprio da carreira.',
    'Evitar tratar prazo único como regra universal: a aplicação concreta depende do ente federativo e do regime jurídico.');

  html += direitoItem('Licença para Tratamento de Pessoa da Família', 'requerimento',
    'Possibilidade de afastamento para cuidar de familiar, normalmente condicionada a requerimento, comprovação do vínculo, necessidade de acompanhamento e avaliação administrativa/pericial.',
    'A remuneração, prazo e renovação variam conforme estatuto/regulamento da instituição.');

  // ===== SAÚDE E ASSISTÊNCIA =====
  html += direitoSecao('Saúde, assistência e proteção social');
  html += direitoItem('Assistência à Saúde / Plano Institucional', 'condicionado', getSaudeTexto(inst), getSaudeBase(inst));

  if (sit === 'reforma') {
    html += direitoItem('Reforma / Invalidez', 'requerimento',
      'A reforma ou aposentadoria por incapacidade exige procedimento administrativo e/ou perícia oficial. Em casos ligados ao serviço, pode haver tratamento jurídico e cálculo diferenciados.',
      'Depende de laudo, nexo com o serviço, junta médica e legislação estadual.');
  } else {
    html += direitoItem('Licença-Saúde e Readaptação', 'requerimento',
      'Em caso de doença, acidente ou limitação funcional, pode haver licença para tratamento de saúde, readaptação, restrição temporária ou avaliação de incapacidade.',
      'Depende de perícia médica oficial e procedimento administrativo.');
  }

  if (inst === 'pmesp') {
    html += direitoItem('SPSM / CBPM / Cruz Azul', 'condicionado',
      'Sistema de proteção social e assistência ligado ao militar paulista, com possíveis benefícios como pensão, auxílio-funeral, assistência e serviços vinculados.',
      'Acesso, contribuição, dependentes e coberturas dependem das normas da PMESP/CBPM/Cruz Azul.');
  } else if (inst === 'pmmg') {
    html += direitoItem('IPSM Minas Gerais', 'condicionado',
      'O IPSM é referência para previdência e saúde dos militares mineiros e seus dependentes, conforme regras próprias.',
      'Base institucional: IPSM/MG. Verificar contribuição, dependentes, rede e cobertura.');
  } else if (inst === 'pcmg') {
    html += direitoItem('IPSEMG / Assistência à Saúde', 'condicionado',
      'Servidores civis mineiros podem ter acesso a assistência conforme adesão, contribuição e regras do sistema estadual.',
      'Verificar adesão, descontos, dependentes e cobertura vigente.');
  } else if (inst === 'pmba' || inst === 'pcba') {
    html += direitoItem('Planserv Bahia', 'condicionado',
      'Assistência à saúde dos servidores públicos baianos, sujeita a adesão, contribuição, dependentes e regras administrativas.',
      'Base: normas do Planserv e legislação estadual da Bahia.');
  } else if (inst === 'pmrs' || inst === 'pcrs') {
    html += direitoItem('Assistência à saúde / sistema estadual RS', 'condicionado',
      getSaudeTexto(inst),
      getSaudeBase(inst));
  } else if (inst === 'pmsc' || inst === 'pcsc') {
    html += direitoItem('Assistência à saúde / sistema estadual SC', 'condicionado',
      getSaudeTexto(inst),
      getSaudeBase(inst));
  } else if (inst === 'pmes' || inst === 'pces') {
    html += direitoItem('Assistência à saúde / sistema estadual ES', 'condicionado',
      getSaudeTexto(inst),
      getSaudeBase(inst));
  } else if (isPP) {
    html += direitoItem('Assistência à saúde / sistema penitenciário', 'condicionado',
      getSaudeTexto(inst),
      getSaudeBase(inst));
  }

  // ===== VANTAGENS REMUNERATÓRIAS =====
  html += direitoSecao('Vantagens remuneratórias e adicionais');

  if (tempo >= 5) {
    html += direitoItem('Adicional por Tempo de Serviço', 'automatico', getTempoServicoTexto(inst, tempo), getTempoServicoBase(inst));
  } else {
    const faltaTempo = Math.max(0, 5 - tempo);
    html += direitoItem('Adicional por Tempo de Serviço', 'atencao',
      `Ainda não há indicativo de primeiro período completo de tempo de serviço. Faltam aproximadamente <strong>${faltaTempo}</strong> ano(s) para o primeiro marco de 5 anos, quando aplicável.`,
      getTempoServicoBase(inst));
  }

  if (inst === 'pmesp' || inst === 'pcsp') {
    if (tempo >= 20) {
      html += direitoItem('Sexta-Parte', 'automatico',
        'Com 20 anos ou mais de efetivo exercício, há indicativo de direito à sexta-parte dos vencimentos integrais, observadas as regras constitucionais e exceções legais.',
        'Base: Art. 129 da Constituição do Estado de São Paulo; atenção à exceção para servidores remunerados por subsídio, quando aplicável.');
    } else {
      html += direitoItem('Sexta-Parte', 'atencao',
        `Ainda não há 20 anos informados. Faltam aproximadamente <strong>${20 - tempo}</strong> ano(s) para o marco temporal da sexta-parte em SP.`,
        'Base: Art. 129 da Constituição do Estado de São Paulo.');
    }
  }

  if (tempo >= 5) {
    html += direitoItem('Licença-Prêmio / Férias-Prêmio / Licença Especial', 'condicionado',
      'Pode existir direito relacionado a períodos aquisitivos por tempo de serviço, conforme a regra estadual e a situação funcional do servidor.',
      'Não tratar como automático universal: nomenclatura, concessão, conversão em pecúnia e restrições variam por Estado e carreira.');
  }

  html += direitoItem('Insalubridade', 'condicionado', getInsalubridadeTexto(inst), getInsalubridadeBase(inst));
  html += direitoItem('Periculosidade / Atividade de Risco', inst === 'pcerj' ? 'automatico' : 'condicionado', getPericulosidadeTexto(inst), getPericulosidadeBase(inst));

  if (localEspecial === 'sim') {
    html += direitoItem('Localidade Especial / Unidade Especial', 'condicionado',
      'Você informou atuação em localidade ou unidade especial. Pode haver verba, gratificação, diária, adicional ou prioridade administrativa conforme norma da instituição.',
      'Depende de designação formal, publicação, unidade, escala, disponibilidade e legislação local.');
  } else {
    html += direitoItem('Localidade Especial / Unidade Especial', 'verificar',
      'Algumas instituições possuem verbas ou regras específicas para local de difícil provimento, unidade especial, transferência ou serviço extraordinário.',
      'Marque “sim” se o servidor atua nessas condições e confirme a norma da instituição.');
  }

  html += getVantagensEspecificas(inst);

  // ===== LICENÇAS E CARREIRA =====
  html += direitoSecao('Licenças, carreira e estabilidade');
  if (tempo >= 3) {
    html += direitoItem('Estabilidade no Serviço Público', 'automatico',
      'Com 3 anos ou mais informados, há indicativo de estabilidade, desde que o estágio probatório tenha sido cumprido e aprovado.',
      'Base geral: Art. 41 da Constituição Federal. Militares e carreiras específicas podem ter rito próprio de avaliação e permanência.');
  } else {
    html += direitoItem('Estabilidade no Serviço Público', 'atencao',
      `Tempo informado inferior a 3 anos. Faltam aproximadamente <strong>${3 - tempo}</strong> ano(s) para o marco geral de estabilidade, se aprovado no estágio probatório.`,
      'Base geral: Art. 41 da Constituição Federal.');
  }

  html += direitoItem('Promoção por Bravura / Ato de Bravura', 'condicionado',
    'Não é vantagem automática. Pode ocorrer em casos excepcionais de ato reconhecido formalmente como bravura, conforme regulamento de promoções da instituição.',
    'Depende de sindicância/procedimento, enquadramento, proposta, decisão administrativa e publicação oficial.');

  html += direitoItem('Progressão / Promoção na Carreira', 'condicionado',
    'Promoções e progressões dependem de tempo, merecimento, antiguidade, avaliação, cursos, vagas, interstício, conduta e regras próprias da carreira.',
    'Verificar estatuto, plano de carreira e editais internos da instituição.');

  // ===== APOSENTADORIA / RESERVA / REFORMA =====
  html += direitoSecao(isPM ? 'Reserva, reforma e proteção previdenciária' : 'Aposentadoria, abono e proteção previdenciária');

  html += direitoItem(isPM ? 'Reserva Remunerada / Inatividade' : 'Aposentadoria Policial', getStatusAposentadoria(tempo, idade, requisitosApos),
    getAposentadoriaTexto(inst, tempo, idade, sexo, requisitosApos, ingressoAntesEC103),
    'A regra concreta depende de idade, tempo total, tempo no cargo/carreira, sexo, data de ingresso, legislação estadual e regras de transição após a EC 103/2019.');

  if (sit === 'ativa') {
    if (requisitosApos === 'sim') {
      html += direitoItem('Abono de Permanência', 'condicionado',
        'Como você informou já ter cumprido requisitos de aposentadoria/reserva e permanece em atividade, pode haver direito ao abono de permanência conforme regra previdenciária aplicável.',
        'Depende de requerimento, reconhecimento administrativo dos requisitos e norma estadual.');
    } else {
      html += direitoItem('Abono de Permanência', 'verificar',
        'Só deve ser tratado como possível depois de confirmado o cumprimento dos requisitos para aposentadoria/reserva com permanência em atividade.',
        'Não depende apenas de tempo informado: exige análise de idade, ingresso, carreira, contribuição e regra de transição.');
    }
  }

  if (isPC && (sit === 'reserva' || sit === 'reforma')) {
    html += direitoItem('Paridade e Integralidade', ingressoAntesEC103 ? 'condicionado' : 'verificar',
      ingressoAntesEC103
        ? 'A data de ingresso informada é anterior à EC 103/2019, o que pode indicar análise de integralidade/paridade conforme regras de transição e jurisprudência aplicável aos policiais civis.'
        : 'A análise de paridade e integralidade depende principalmente da data de ingresso, regra de aposentadoria utilizada e legislação do Estado. Informe/verifique a data de ingresso.',
      'Tema sensível: confirmar com setor previdenciário, associação ou advogado especializado.');
  }

  if (sit === 'reserva' || sit === 'reforma') {
    html += direitoItem('Porte de Arma na Inatividade', 'condicionado',
      'Pode existir autorização para porte na inatividade, mas não deve ser tratado como “vitalício” sem ressalvas. Normalmente depende de requisitos legais, aptidão psicológica, documentação e regras de controle.',
      'Base geral: Estatuto do Desarmamento e regulamentos. Conferir norma institucional e exigências vigentes.');
  }

  // ===== ALERTAS E FONTES =====
  html += direitoSecao('Alertas e fontes de conferência');
  html += direitoItem('Conferência em fonte oficial', 'verificar',
    'Use esta aba como triagem inicial. Para decisão financeira, ação judicial, aposentadoria, abono ou requerimento administrativo, confira sempre a legislação atualizada e a ficha funcional do servidor.',
    'Fontes úteis: Diário Oficial do Estado, estatuto da carreira, lei orgânica, portal de transparência, setor de pessoal, previdência estadual e associação/sindicato.');

  cont.innerHTML = html;
}

function direitoResumo(cargo, instNome, tempo, idade, sit, sexo, ingresso, renda, dependente) {
  const sitTxt = sit === 'ativa' ? 'Serviço ativo' : sit === 'reserva' ? 'Inatividade / aposentadoria' : 'Reforma / invalidez';
  const sexoTxt = sexo === 'masculino' ? 'masculino' : sexo === 'feminino' ? 'feminino' : 'não informado';
  const ingressoTxt = ingresso ? ingresso.split('-').reverse().join('/') : 'não informado';
  const rendaTxt = renda > 0 ? fmt(renda) : 'não informada';
  const depTxt = dependente === 'sim' ? 'sim' : dependente === 'nao' ? 'não' : 'não informado';
  return `<div class="direito-item acao" style="border-left-color: var(--vermelho);">
    <span class="direito-nome">Resumo da análise — ${instNome}</span>
    <span class="direito-desc"><strong>Cargo/nível:</strong> ${cargo}</span>
    <span class="direito-desc"><strong>Situação:</strong> ${sitTxt} · <strong>Tempo informado:</strong> ${tempo} ano(s) · <strong>Idade:</strong> ${idade || 'não informada'} · <strong>Sexo:</strong> ${sexoTxt}</span>
    <span class="direito-desc"><strong>Ingresso:</strong> ${ingressoTxt} · <strong>Remuneração bruta:</strong> ${rendaTxt} · <strong>Dependente para salário-família:</strong> ${depTxt}</span>
  </div>`;
}

function direitoSecao(titulo) {
  return `<div class="direitos-section-title">${titulo}</div>`;
}

function direitoItem(nome, status, desc, base = '') {
  const statusMap = {
    automatico: { label: '✓ Direito automático / requisito provável', color: 'var(--verde)', bg: 'rgba(32, 142, 78, 0.06)' },
    condicionado: { label: '◼ Direito condicionado', color: 'var(--dourado)', bg: 'rgba(223,182,62,0.08)' },
    requerimento: { label: '⏳ Depende de requerimento/perícia', color: 'var(--azul)', bg: 'rgba(30,48,132,0.08)' },
    verificar: { label: '⚠ Verificar caso individual', color: 'var(--text-muted)', bg: 'var(--item-bg)' },
    atencao: { label: '⚠ Atenção / requisito não indicado', color: '#e60000', bg: 'rgba(230, 0, 0, 0.05)' }
  };
  const cfg = statusMap[status] || statusMap.verificar;
  const baseHtml = base ? `<span class="direito-meta"><strong>Base/observação:</strong> ${base}</span>` : '';
  const classe = status === 'automatico' ? 'sim' : status === 'atencao' ? 'nao' : '';
  return `<div class="direito-item ${classe}" style="border-left-color:${cfg.color}; background:${cfg.bg};">
    <span class="direito-nome">${nome}</span>
    <span class="direito-status" style="color:${cfg.color};">${cfg.label}</span>
    <span class="direito-desc">${desc}</span>
    ${baseHtml}
  </div>`;
}

function getSaudeTexto(inst) {
  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    return `${info.sigla}: ${info.saude} Não confundir assistência à saúde com adicional, indenização ou verba remuneratória.`;
  }
  const textos = {
    pmesp: 'PMESP: assistência pode envolver Cruz Azul, FUSAM, CBPM/SPSM e regras próprias para titular e dependentes.',
    pcsp: 'PCSP: pode haver atendimento pelo IAMSPE e outros mecanismos de assistência conforme vínculo, contribuição e regras do Estado.',
    pmerj: 'PMERJ: assistência pode envolver FUSPOM, HCPM, Família Azul ou estruturas próprias da corporação.',
    pcerj: 'PCERJ: verificar assistência disponível, convênios e regras administrativas da Polícia Civil/RJ.',
    pmmg: 'PMMG: assistência e previdência vinculadas ao IPSM, conforme contribuição, dependentes e rede credenciada.',
    pcmg: 'PCMG: assistência pode envolver IPSEMG ou outro plano, conforme adesão e regra estadual.',
    pmba: 'PMBA: assistência pode envolver Planserv e regras estaduais de adesão, contribuição e cobertura.',
    pcba: 'PCBA: assistência pode envolver Planserv e regras estaduais de adesão, contribuição e cobertura.',
    pmpr: 'PMPR: assistência pode envolver FASPM, sistema próprio de saúde militar e regras de adesão/dependentes.',
    pcpr: 'PCPR: assistência pode envolver o Sistema de Assistência à Saúde do Paraná e regras administrativas do Estado.',
    pmrs: 'PMRS: assistência pode envolver IPE Saúde, Hospital da Brigada Militar e regras próprias dos militares estaduais do RS.',
    pcrs: 'PCRS: assistência pode envolver IPE Saúde e regras administrativas do Estado do Rio Grande do Sul.',
    pmsc: 'PMSC: assistência pode envolver SC Saúde, IPREV/SC e regras próprias do sistema dos militares estaduais de Santa Catarina.',
    pcsc: 'PCSC: assistência pode envolver SC Saúde/IPREV-SC e regras administrativas do Estado de Santa Catarina.',
    pmes: 'PMES: assistência pode envolver IPAJM/ES, assistência médica/odontológica prevista em edital e normas próprias dos militares estaduais do Espírito Santo.',
    pces: 'PCES: assistência pode envolver IPAJM/ES, regras administrativas do Estado do Espírito Santo e normas da carreira policial civil.'
  };
  return textos[inst] || 'Verificar assistência à saúde conforme norma da instituição.';
}

function getSaudeBase(inst) {
  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    return `Base: ${info.orgao}; ${info.previdencia}`;
  }
  if (inst === 'pmmg') return 'IPSM/MG: gestão de benefícios previdenciários e de saúde dos militares mineiros e dependentes.';
  if (inst === 'pmba' || inst === 'pcba') return 'Planserv/BA e legislação estadual aplicável.';
  if (inst === 'pmpr') return 'FASPM/PR: contribuição facultativa de saúde dos militares estaduais, conforme Lei PR 17.169/2012.';
  if (inst === 'pcpr') return 'SAS/Paraná, legislação estadual e normas internas da PCPR/SEAP, conforme vínculo e adesão.';
  if (inst === 'pmrs' || inst === 'pcrs') return 'IPE Saúde/RS, Hospital da Brigada Militar quando aplicável, normas estaduais e regras de adesão/dependentes.';
  if (inst === 'pmsc' || inst === 'pcsc') return 'SC Saúde, IPREV/SC, normas estaduais e regras de adesão/dependentes conforme cargo e situação funcional.';
  if (inst === 'pmes' || inst === 'pces') return 'IPAJM/ES, legislação estadual do Espírito Santo, normas de adesão/dependentes e regras administrativas da instituição.';
  return 'Regulamento institucional, estatuto da carreira, órgão de saúde estadual e regras de contribuição/dependentes.';
}

function getTempoServicoTexto(inst, tempo) {
  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    return `${info.sigla}: ${info.quadro} O tempo informado indica <strong>${tempo}</strong> ano(s) para análise de interstício, progressão, promoção, aposentadoria e vantagens condicionadas.`;
  }
  if (inst === 'pmesp' || inst === 'pcsp') return `Em SP, há indicativo de <strong>${Math.floor(tempo / 5)}</strong> quinquênio(s), calculados em regra a cada 5 anos de efetivo exercício, observadas as exceções legais.`;
  if (inst === 'pmerj') return `Na PMERJ, o adicional por tempo de serviço deve ser conferido conforme regra estadual e ficha funcional. Pelo tempo informado, há <strong>${Math.floor(tempo / 3)}</strong> período(s) de 3 anos como referência de triênio, se aplicável.`;
  if (inst === 'pcerj') return `Na PCERJ, a Lei Orgânica vigente prevê adicional por tempo de serviço. Pelo tempo informado, há <strong>${Math.floor(tempo / 5)}</strong> período(s) de 5 anos como referência.`;
  if (inst === 'pmmg' || inst === 'pcmg') return `Em MG, tratar o adicional por tempo de serviço com cautela: pode envolver quinquênio, ADE, VPNI ou regra de transição. Pelo tempo informado, há <strong>${Math.floor(tempo / 5)}</strong> período(s) de 5 anos como referência para conferência.`;
  if (inst === 'pmba' || inst === 'pcba') return `Na Bahia, há referência a anuênios/adicionais por tempo conforme carreira. Pelo tempo informado, a referência inicial é de <strong>${Math.min(35, tempo)}</strong> ano(s) de serviço.`;
  if (inst === 'pmpr') return `Na PMPR, a carreira é estruturada por subsídio, posto/graduação e classes. A progressão/promoção por classe deve ser conferida no enquadramento funcional; o tempo informado indica <strong>${tempo}</strong> ano(s) para análise de interstício.`;
  if (inst === 'pcpr') return `Na PCPR, a carreira é estruturada por subsídio, cargo e níveis/classes. O tempo informado indica <strong>${tempo}</strong> ano(s) para análise de promoção, progressão e regras de titulação.`;
  if (inst === 'pmrs') return `Na PMRS, posto/graduação, promoções, interstícios e eventuais vantagens devem ser conferidos conforme estatuto e ficha funcional. O tempo informado indica <strong>${tempo}</strong> ano(s) para análise.`;
  if (inst === 'pcrs') return `Na PCRS, cargo, classe, tempo de carreira e regras de promoção/progressão devem ser conferidos na ficha funcional. O tempo informado indica <strong>${tempo}</strong> ano(s) para análise.`;
  if (inst === 'pmsc') return `Na PMSC, posto/graduação, promoções, interstícios e eventuais vantagens devem ser conferidos conforme estatuto, LC SC 801/2022, LC SC 880/2025 e ficha funcional. O tempo informado indica <strong>${tempo}</strong> ano(s) para análise.`;
  if (inst === 'pcsc') return `Na PCSC, cargo, classe, tempo de carreira e regras de promoção/progressão devem ser conferidos no estatuto e na ficha funcional. O tempo informado indica <strong>${tempo}</strong> ano(s) para análise.`;
  if (inst === 'pmes') return `Na PMES, posto/graduação, referência, progressão horizontal, promoções e eventuais vantagens devem ser conferidos conforme estatuto, LC ES 420/2007, ficha funcional e atos da corporação. O tempo informado indica <strong>${tempo}</strong> ano(s) para análise.`;
  if (inst === 'pces') return `Na PCES, cargo, categoria, referências, progressões e promoções devem ser conferidos na ficha funcional e na lei da carreira. O tempo informado indica <strong>${tempo}</strong> ano(s) para análise.`;
  return 'Verificar adicional por tempo de serviço conforme legislação da carreira.';
}

function getTempoServicoBase(inst) {
  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    return `Base: ${info.criacao}; ${info.fonte}; ficha funcional e tabela remuneratória vigente.`;
  }
  if (inst === 'pmesp' || inst === 'pcsp') return 'Base: Art. 129 da Constituição do Estado de São Paulo; observar exceções para remuneração por subsídio.';
  if (inst === 'pcerj') return 'Base: Lei Orgânica/Reestruturação da Polícia Civil do RJ e normas complementares.';
  if (inst === 'pmmg' || inst === 'pcmg') return 'Revisar no estatuto/plano de carreira atualizado e no demonstrativo de pagamento. Não fixar percentual sem conferência individual.';
  if (inst === 'pmba' || inst === 'pcba') return 'Base: estatuto/lei orgânica e normas remuneratórias do Estado da Bahia.';
  if (inst === 'pmpr') return 'Base: Lei PR 22.187/2024 e Lei PR 17.169/2012, com enquadramento por classes.';
  if (inst === 'pcpr') return 'Base: Lei Complementar PR 259/2023 e alterações posteriores, com estrutura por subsídio e níveis/classes.';
  if (inst === 'pmrs') return 'Base: estatuto dos militares estaduais do RS, normas remuneratórias e ficha funcional.';
  if (inst === 'pcrs') return 'Base: Lei Estadual RS 12.350/2005, Lei Federal 14.735/2023, normas estaduais e ficha funcional.';
  if (inst === 'pmsc') return 'Base: estatuto dos militares estaduais de SC, LC SC 801/2022, LC SC 880/2025 e ficha funcional.';
  if (inst === 'pcsc') return 'Base: Lei SC 6.843/1986, Lei Federal 14.735/2023, normas estaduais e ficha funcional.';
  if (inst === 'pmes') return 'Base: Lei ES 3.196/1978, LC ES 420/2007, LC ES 910/2019, LC ES 911/2019 e ficha funcional.';
  if (inst === 'pces') return 'Base: Estatuto da PCES, LC ES 1.093/2024, Lei Federal 14.735/2023 e ficha funcional.';
  return 'Base: estatuto, lei de remuneração e ficha funcional.';
}

function getInsalubridadeTexto(inst) {
  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    return `${info.sigla}: ${info.vantagens} Insalubridade, periculosidade, risco de vida ou adicional de atividade penitenciária só devem ser tratados como verba quando houver lei local, laudo, lotação, rubrica e contracheque.`;
  }
  if (inst === 'pmesp' || inst === 'pcsp') return 'Em SP, pode haver adicional de insalubridade em graus mínimo, médio ou máximo, conforme enquadramento, laudo e legislação. Não é universal para todo servidor em qualquer função.';
  if (inst === 'pcerj') return 'Na PCERJ, a insalubridade aparece entre vantagens possíveis, mas deve ser separada do adicional de atividade perigosa. Depende de previsão legal e enquadramento.';
  if (inst === 'pcpr') return 'Na PCPR, a LC 259/2023 indica que o subsídio compreende adicionais de insalubridade, periculosidade e risco de vida. Não lançar como verba separada sem decisão, rubrica ou tese específica.';
  if (inst === 'pmpr') return 'Na PMPR, a remuneração é por subsídio. Não computar adicional de insalubridade automático sem rubrica específica, laudo, decisão ou previsão expressa aplicável ao caso.';
  if (inst === 'pmrs') return 'Na PMRS, não lançar adicional de insalubridade automático sem rubrica específica, laudo, decisão ou previsão expressa aplicável ao caso.';
  if (inst === 'pcrs') return 'Na PCRS, eventual insalubridade deve ser conferida por legislação, rubrica, laudo, lotação e situação funcional; não é verba universal automática.';
  if (inst === 'pmsc') return 'Na PMSC, não lançar adicional de insalubridade automático sem rubrica específica, laudo, decisão ou previsão expressa aplicável ao caso.';
  if (inst === 'pcsc') return 'Na PCSC, eventual insalubridade deve ser conferida por legislação, rubrica, laudo, lotação e situação funcional; não é verba universal automática.';
  if (inst === 'pmes') return 'Na PMES, não lançar adicional de insalubridade automático sem rubrica específica, laudo, decisão ou previsão expressa aplicável ao caso.';
  if (inst === 'pces') return 'Na PCES, eventual insalubridade deve ser conferida por legislação, rubrica, laudo, lotação e situação funcional; em carreiras por subsídio pode haver absorção de vantagens conforme regime/lei.';
  return 'Pode existir quando houver exposição reconhecida a agente insalubre, mediante laudo, enquadramento e previsão legal da instituição.';
}

function getInsalubridadeBase(inst) {
  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    return `Base: ${info.criacao}; laudo/ato administrativo, rubrica, lotação, escala e contracheque.`;
  }
  if (inst === 'pmesp' || inst === 'pcsp') return 'Conferir grau, base de cálculo, laudo e holerite. Não confundir com periculosidade.';
  if (inst === 'pcpr') return 'Base: LC PR 259/2023, art. 39, §3º; observar ADI indicada na própria legislação e decisões aplicáveis.';
  if (inst === 'pmpr') return 'Base: regime de subsídio da carreira militar estadual do Paraná; conferir rubrica específica, laudo e legislação aplicável.';
  if (inst === 'pmrs' || inst === 'pcrs') return 'Base: legislação estadual do RS, laudo, rubrica de pagamento e enquadramento do local/função.';
  if (inst === 'pmsc' || inst === 'pcsc') return 'Base: legislação estadual de SC, laudo, rubrica de pagamento e enquadramento do local/função.';
  if (inst === 'pmes' || inst === 'pces') return 'Base: legislação estadual do ES, laudo, rubrica de pagamento e enquadramento do local/função.';
  return 'Depende de laudo, legislação estadual e enquadramento do local/função.';
}

function getPericulosidadeTexto(inst) {
  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    return `${info.sigla}: a atividade penal envolve custódia, vigilância, escolta, inteligência e segurança prisional. Eventual adicional de risco/periculosidade/atividade penitenciária depende da legislação da UF, rubrica e contracheque.`;
  }
  if (inst === 'pcerj') return 'PCERJ: a Lei 11.003/2025 prevê adicional de atividade perigosa de 230% sobre o vencimento-base para policiais civis, salvo Delegados, que possuem verba de representação própria.';
  if (inst === 'pcpr') return 'Na PCPR, a LC 259/2023 indica que o subsídio compreende o risco de vida e a periculosidade. Tratar como verba separada somente diante de rubrica, decisão ou tese específica.';
  if (inst === 'pcrs') return 'Na PCRS, eventual adicional ligado ao risco/atividade deve ser conferido em lei estadual, rubrica e contracheque; não aplicar automaticamente regra de outro Estado.';
  if (inst === 'pcsc') return 'Na PCSC, eventual adicional ligado ao risco/atividade deve ser conferido em lei estadual, rubrica e contracheque; não aplicar automaticamente regra de outro Estado.';
  if (inst === 'pces') return 'Na PCES, eventual adicional ligado ao risco/atividade deve ser conferido em lei estadual, rubrica e contracheque; no OIP e demais carreiras por subsídio, verificar se a vantagem foi absorvida pelo regime legal.';
  if (inst === 'pmesp' || inst === 'pmerj' || inst === 'pmmg' || inst === 'pmba' || inst === 'pmpr' || inst === 'pmrs' || inst === 'pmsc' || inst === 'pmes') return 'Para militares estaduais, o risco da atividade costuma estar absorvido no regime remuneratório ou em verbas próprias. Não aplicar automaticamente o modelo da PCERJ.';
  return 'Pode haver gratificação ou adicional ligado ao risco/atividade, mas a regra muda bastante por Estado e carreira. Verificar norma específica.';
}

function getPericulosidadeBase(inst) {
  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    return `Base: ${info.criacao}; ${info.fonte}; legislação remuneratória e contracheque.`;
  }
  if (inst === 'pcerj') return 'Base: Lei 11.003/2025/RJ, art. sobre adicional de atividade perigosa e verba de representação.';
  if (inst === 'pcpr') return 'Base: LC PR 259/2023, art. 39, §3º, e decisões judiciais aplicáveis.';
  if (inst === 'pmpr') return 'Base: Lei PR 22.187/2024 e regime de subsídio dos militares estaduais do Paraná.';
  if (inst === 'pmrs') return 'Base: estatuto e normas remuneratórias dos militares estaduais do RS.';
  if (inst === 'pcrs') return 'Base: Lei Estadual RS 12.350/2005, Lei Federal 14.735/2023 e normas remuneratórias estaduais aplicáveis.';
  if (inst === 'pmsc') return 'Base: estatuto e normas remuneratórias dos militares estaduais de SC.';
  if (inst === 'pcsc') return 'Base: Lei SC 6.843/1986, Lei Federal 14.735/2023 e normas remuneratórias estaduais aplicáveis.';
  if (inst === 'pmes') return 'Base: LC ES 420/2007, estatuto da PMES e normas remuneratórias dos militares estaduais do ES.';
  if (inst === 'pces') return 'Base: LC ES 1.093/2024, Lei Federal 14.735/2023 e normas remuneratórias estaduais aplicáveis.';
  return 'Base: estatuto e lei de remuneração da instituição; não usar regra genérica para todas as carreiras.';
}

function getVantagensEspecificas(inst) {
  let html = '';
  if (isPoliciaPenal(inst)) {
    const info = getInfoPoliciaPenal(inst);
    html += direitoItem(`${info.sigla} — Estrutura institucional e atribuições`, 'condicionado',
      `${info.marco} ${info.atribuicoes}`,
      `Base: ${info.criacao}; ${info.orgao}.`);
    html += direitoItem(`${info.sigla} — Adicionais, auxílios e verbas condicionadas`, 'condicionado',
      `${info.vantagens} ${info.remuneracao}`,
      'Conferir lei local, tabela oficial, edital, escala, ordem de serviço, laudo, rubrica e contracheque.');
    html += direitoItem(`${info.sigla} — Formação, porte, identidade funcional e prerrogativas`, 'condicionado',
      `${info.formacao} Prerrogativas, porte, uniforme, corregedoria e identidade funcional dependem da regulamentação da UF.`,
      `Base: Constituição Federal, art. 144, EC 104/2019 e legislação específica: ${info.criacao}.`);
    html += direitoItem(`${info.sigla} — Previdência, saúde e aposentadoria policial`, 'verificar',
      `${info.previdencia} ${info.saude}`,
      'A análise exige data de ingresso, tempo no cargo, sexo, idade, regra de transição, contribuição e ficha funcional.');
    return html;
  }
  if (inst === 'pmesp') {
    html += direitoItem('DEJEM / Diária Especial por Jornada Extraordinária', 'condicionado',
      'Verba eventual para jornada extraordinária, quando houver escala, autorização e cumprimento do serviço.',
      'Depende de escala, disponibilidade, limite mensal e norma vigente.');
  } else if (inst === 'pcsp') {
    html += direitoItem('DEJEC / Diária Especial por Jornada Extraordinária', 'condicionado',
      'Verba eventual para jornada extraordinária na Polícia Civil/SP, quando autorizada e efetivamente cumprida.',
      'Depende de escala, autorização, limite e regulamentação vigente.');
  } else if (inst === 'pmerj') {
    html += direitoItem('RAS / Serviço Adicional', 'condicionado',
      'Pode haver remuneração por serviço adicional, escala extraordinária ou programa equivalente, conforme disponibilidade e autorização.',
      'Depende de escala, publicação, limite e norma estadual.');
  } else if (inst === 'pcerj') {
    html += direitoItem('Gratificação Técnico-Científica', 'condicionado',
      'Pode ser aplicável a carreiras técnico-científicas, como peritos e médicos legistas, conforme enquadramento legal.',
      'Base: Lei 11.003/2025/RJ e cargo ocupado.');
    html += direitoItem('Verba de Representação — Delegado', 'condicionado',
      'Delegados possuem tratamento remuneratório próprio, com verba de representação prevista na reestruturação da PCERJ.',
      'Base: Lei 11.003/2025/RJ. Aplicável apenas ao cargo correspondente.');
    html += direitoItem('Auxílio-Transporte / Diárias / Auxílios específicos', 'condicionado',
      'A nova estrutura da PCERJ lista vantagens e indenizações específicas que devem ser verificadas conforme lotação, deslocamento e situação funcional.',
      'Conferir Lei 11.003/2025/RJ e regulamentação interna.');
  } else if (inst === 'pmmg') {
    html += direitoItem('ADE / VPNI / Vantagens de transição', 'condicionado',
      'ADE, VPNI e parcelas de transição podem aparecer conforme avaliação, histórico funcional e regra remuneratória individual.',
      'Conferir ficha financeira, avaliações e legislação mineira atualizada.');
  } else if (inst === 'pcmg') {
    html += direitoItem('ADE / Gratificação de Aprimoramento Profissional', 'condicionado',
      'Podem existir vantagens por desempenho, formação, titulação ou aprimoramento profissional, conforme cargo e legislação da PCMG.',
      'Conferir plano de carreira, titulação aceita e percentuais vigentes.');
  } else if (inst === 'pmba' || inst === 'pcba') {
    html += direitoItem('CET — Condição Especial de Trabalho', 'condicionado',
      'Gratificação variável ligada a condição especial de trabalho, função ou local de exercício. Não deve ser tratada como valor fixo universal.',
      'Conferir percentual, cargo, setor, publicação e legislação estadual da Bahia.');
  } else if (inst === 'pmpr') {
    html += direitoItem('Auxílio-Alimentação PMPR', 'automatico',
      'Valor mensal padrão de R$ 834,74 para servidores ativos, destacado como verba indenizatória no simulador.',
      'Base: Lei PR 22.208/2024 e informação oficial de formas de ingresso da PMPR.');
    html += direitoItem('FASPM', 'condicionado',
      'Assistência à saúde militar com contribuição facultativa. No simulador, o desconto só entra se o usuário selecionar a opção FASPM.',
      'Base: Lei PR 17.169/2012: 0,5% + 0,2% por dependente, limitado a 2%.');
  } else if (inst === 'pcpr') {
    html += direitoItem('Auxílio-Alimentação PCPR', 'automatico',
      'Valor mensal padrão de R$ 834,74 para servidores ativos, destacado como verba indenizatória no simulador.',
      'Base: Lei PR 22.208/2024 e regras estaduais de auxílio-alimentação.');
    html += direitoItem('Diária especial / extrajornada voluntária', 'condicionado',
      'Pode existir quando houver escala, autorização e cumprimento de jornada extraordinária prevista em norma. Não é verba fixa mensal.',
      'Base: LC PR 259/2023, rol de vantagens/indenizações e regulamentação administrativa.');
  } else if (inst === 'pmrs') {
    html += direitoItem('Auxílio-Alimentação BM/RS', 'automatico',
      'Valor de R$ 400,00 informado nos editais oficiais 2025 de Soldado e Oficialato da Brigada Militar.',
      'Base: editais oficiais da Brigada Militar/RS.');
    html += direitoItem('Diárias / serviço extraordinário', 'condicionado',
      'Pode existir quando houver escala, autorização, deslocamento ou serviço extraordinário previsto em norma. Não é verba fixa mensal.',
      'Conferir legislação estadual, publicação da escala e contracheque.');
  } else if (inst === 'pcrs') {
    html += direitoItem('Dedicação exclusiva / jornada de 40 horas', 'condicionado',
      'Editais da PCRS indicam regime estatutário, 40 horas semanais e dedicação exclusiva para os cargos policiais.',
      'Base: editais oficiais 2025 da Polícia Civil/RS.');
    html += direitoItem('Diárias / indenizações / serviço extraordinário', 'condicionado',
      'Podem existir conforme lotação, deslocamento, autorização e legislação estadual. Não são verbas fixas universais.',
      'Conferir rubrica, contracheque, legislação estadual e normas internas.');
  } else if (inst === 'pmsc') {
    html += direitoItem('Auxílio-Alimentação PMSC', 'automatico',
      'Valor de referência de R$ 550,00 para 40h em Santa Catarina, com caráter indenizatório e sem incorporação ao subsídio.',
      'Base: Lei SC 18.796/2023, com redação da Lei SC 19.059/2024.');
    html += direitoItem('Diárias / serviço extraordinário / indenizações', 'condicionado',
      'Podem existir conforme escala, deslocamento, autorização, local de serviço e norma específica. Não são verbas fixas mensais.',
      'Conferir legislação estadual, publicação da escala, ordem de serviço e contracheque.');
  } else if (inst === 'pcsc') {
    html += direitoItem('Auxílio-Alimentação PCSC', 'automatico',
      'Valor de referência de R$ 550,00 para 40h. Nos editais PCSC 2025, aparece compondo o total divulgado para Agente e Escrivão.',
      'Base: Lei SC 18.796/2023, Lei SC 19.059/2024 e editais PCSC 2025.');
    html += direitoItem('Dedicação exclusiva / regime policial civil', 'condicionado',
      'A carreira policial civil exige conferência do cargo, classe, jornada, lotação e regras próprias do estatuto e da Lei Orgânica Nacional.',
      'Base: Lei SC 6.843/1986, Lei Federal 14.735/2023 e regulamentação estadual.');
  } else if (inst === 'pmes') {
    html += direitoItem('Auxílio-Alimentação PMES', 'condicionado',
      `Auxílio-alimentação deve ser conferido por edital, norma e rubrica vigente. O simulador usa referência ES de ${fmt(AUX_ALIM_ES_PADRAO)} apenas como verba informativa, sem somar automaticamente ao bruto.`,
      'Base: editais PMES, legislação estadual e contracheque.');
    html += direitoItem('Auxílio-Fardamento / serviço extraordinário', 'condicionado',
      'Pode existir conforme regra própria, fornecimento ou indenização de fardamento, escala e autorização de serviço extra.',
      'Base: LC ES 420/2007, editais PMES, legislação de fardamento/indenização e atos internos.');
  } else if (inst === 'pces') {
    html += direitoItem('Auxílio-Alimentação PCES', 'automatico',
      `Concurso OIP 2025 informa auxílio-alimentação de ${fmt(AUX_ALIM_ES_PADRAO)} além da remuneração inicial. Conferir rubrica e regra vigente para cada carreira.`,
      'Base: divulgação oficial PCES do concurso OIP 2025.');
    html += direitoItem('Serviço extraordinário / escalas especiais', 'condicionado',
      'Para OIP, a LC ES 1.093/2024 prevê possibilidade de serviço extraordinário sujeito a disponibilidade, interesse de serviço, candidatura prévia e escala, com limite mensal.',
      'Base: LC ES 1.093/2024 e regulamentação do Estado.');
  }
  return html;
}

function getStatusAposentadoria(tempo, idade, requisitosApos) {
  if (requisitosApos === 'sim') return 'condicionado';
  if (tempo >= 30 && idade >= 55) return 'verificar';
  return 'atencao';
}

function getAposentadoriaTexto(inst, tempo, idade, sexo, requisitosApos, ingressoAntesEC103) {
  const tipo = ['pmesp', 'pmerj', 'pmmg', 'pmba', 'pmpr', 'pmrs', 'pmsc', 'pmes'].includes(inst) ? 'reserva remunerada/reforma' : 'aposentadoria policial';
  if (requisitosApos === 'sim') {
    return `Você informou que os requisitos de ${tipo} já foram cumpridos. O próximo passo é confirmar a regra usada, cálculo, paridade/integralidade quando cabível e eventual abono de permanência.`;
  }
  if (tempo >= 30 && idade >= 55) {
    return `Tempo e idade informados indicam possível proximidade de ${tipo}, mas isso não basta para afirmar direito automático. É indispensável conferir data de ingresso, sexo, tempo no cargo/carreira e regra de transição.`;
  }
  const idadeTxt = idade ? `${idade} ano(s) de idade` : 'idade não informada';
  const sexoTxt = sexo === 'na' ? 'sexo não informado' : `sexo ${sexo}`;
  const ingressoTxt = ingressoAntesEC103 ? 'ingresso informado antes da EC 103/2019' : 'ingresso não informado ou posterior à EC 103/2019';
  return `Com ${tempo} ano(s) de contribuição policial, ${idadeTxt}, ${sexoTxt} e ${ingressoTxt}, a análise previdenciária deve ser individual. Não é seguro afirmar direito adquirido apenas por este simulador.`;
}

/* ============================================================ */
/* === CONCURSOS (RICO) ======================================= */
/* ============================================================ */
/* BLOCO 15.12 — Renderização das páginas de concursos, ações e associações */

function getConcursoPoliciaPenal(inst) {
  if (!isPoliciaPenal(inst)) return null;
  const info = getInfoPoliciaPenal(inst);
  return {
    edital: `${info.sigla} — ${info.nome} — concursos, formação e carreira penal`,
    salario: info.concurso.salario || info.remuneracao,
    vagas: info.concurso.vagas || 'Conferir autorização, edital e Diário Oficial da unidade federativa.',
    cotas: 'Reserva de vagas conforme legislação estadual, federal e regras do edital vigente.',
    idade: 'Em regra, idade mínima de 18 anos; limites máximos, CNH, altura, aptidão física e demais requisitos dependem do edital e da legislação local.',
    escolaridade: info.concurso.escolaridade || info.escolaridade,
    materias: 'Português, Raciocínio Lógico, Informática, Direito Constitucional, Administrativo, Penal, Processo Penal, Direitos Humanos, Lei de Execução Penal, legislação penitenciária, atualidades e conhecimentos específicos, conforme edital.',
    banca: info.concurso.banca || 'A definir conforme edital.',
    inscritos: 'Sem informação automática; acompanhar Diário Oficial, portal do governo e site da banca.',
    etapas: 'Prova objetiva, investigação social, exames médicos, avaliação psicológica, TAF, curso de formação e demais fases previstas no edital.',
    cfsd: info.formacao,
    estagio: 'Estágio probatório e avaliação de desempenho conforme regime jurídico e lei da carreira penal.',
    validade: 'Conferir edital do certame.',
    previsao: `Acompanhar publicações oficiais: ${info.fonte}. Não afirmar edital aberto sem publicação oficial.`,
    site: info.url || REMUNERACAO_FONTES_OFICIAIS[inst]?.url || '#'
  };
}

function getAcoesPoliciaPenal(inst) {
  if (!isPoliciaPenal(inst)) return [];
  const info = getInfoPoliciaPenal(inst);
  return [
    { titulo: `${info.sigla} — Enquadramento, transformação de cargos e implantação da carreira`, status: 'Verificar caso a caso', ano: info.criacao, tipo: 'individual', desc: `Discussões podem envolver transformação de antigos cargos penitenciários em Polícia Penal, enquadramento, classe, referência, atribuições, efeitos financeiros e data de implantação. ${info.marco}`, base: `${info.criacao}; ato de enquadramento; ficha funcional; tabela remuneratória; Diário Oficial.`, fonte: info.fonte, fonteUrl: info.url, atualizado: 'Abril/2026' },
    { titulo: `${info.sigla} — Adicional penitenciário, risco, periculosidade, insalubridade e rubricas`, status: 'Tema dependente de rubrica e laudo', ano: 'Tema recorrente', tipo: 'individual', desc: info.vantagens, base: 'Lei estadual da carreira, laudo/ato administrativo, contracheques, lotação, escala e local de exercício.', fonte: info.fonte, fonteUrl: info.url, atualizado: 'Abril/2026' },
    { titulo: `${info.sigla} — Aposentadoria policial, transições e previdência`, status: 'Análise individual', ano: 'EC 103/2019, EC 104/2019 e normas locais', tipo: 'individual', desc: info.previdencia, base: 'Data de ingresso, tempo de contribuição, tempo no cargo/carreira, sexo, idade, regra aplicada e ficha funcional.', fonte: 'Conferência previdenciária individual', fonteUrl: info.url, atualizado: 'Abril/2026' },
    { titulo: `${info.sigla} — Plantões, escoltas, operações, diárias e serviço extraordinário`, status: 'Depende de escala e autorização', ano: 'Tema operacional', tipo: 'individual', desc: `Atribuições operacionais: ${info.atribuicoes} Diferenças dependem de escala, ordem de serviço, autorização, deslocamento e rubrica.`, base: 'Escalas, ordens de serviço, publicações, lei local, contracheques e atos administrativos.', fonte: 'Documentos funcionais e normas internas', fonteUrl: info.url, atualizado: 'Abril/2026' }
  ];
}

function getAssociacoesPoliciaPenal(inst) {
  if (!isPoliciaPenal(inst)) return [];
  const info = getInfoPoliciaPenal(inst);
  return [
    { nome: `Entidade representativa da ${info.sigla} — ${info.nome}`, foco: `${info.uf} — policiais penais ativos, aposentados e pensionistas quando abrangidos`, acao: `Representação da categoria em carreira, remuneração, saúde, aposentadoria policial, porte funcional, condições de trabalho, segurança prisional e valorização institucional. Busca sugerida: ${info.associacaoBusca}.`, site: 'Consultar site/canal oficial da entidade local', telefone: 'Consultar diretamente', mensalidade: 'Consultar diretamente na entidade', servicos: 'Orientação sindical/associativa, notícias, mobilização, acompanhamento legislativo e eventual apoio jurídico conforme regras internas.' },
    { nome: `Associação/Sindicato dos Policiais Penais — ${info.uf}`, foco: `${info.orgao}`, acao: `Acompanhamento de pautas ligadas a ${info.criacao}, implantação da carreira, adicionais, concurso, formação, segurança das unidades e direitos funcionais.`, site: 'Consultar canais oficiais e redes da entidade local', telefone: 'Consultar diretamente', mensalidade: 'Consultar diretamente', servicos: 'Atendimento associativo, comunicação, assembleias, convênios, acompanhamento legislativo e eventual suporte jurídico conforme contrato.' }
  ];
}


/* ============================================================ */
/* === COMPARADOR DE CARREIRAS ================================ */
/* ============================================================ */
/* BLOCO 15.14.1 — Comparar remuneração, benefícios, concursos e fontes entre instituições */
function getRamoComparador(inst) {
  inst = String(inst || '');
  if (inst.startsWith('pp')) return 'Penal';
  if (inst.startsWith('pc')) return 'Civil';
  if (inst.startsWith('pm')) return inst === 'pmrs' ? 'Militar / Brigada' : 'Militar';
  return 'Carreira';
}

function getOrdemComparador(inst) {
  const estado = getEstadoDaInstituicao(inst);
  const dadosEstado = HEADER_ESTADOS[estado] || {};
  if (dadosEstado.pm === inst) return 1;
  if (dadosEstado.pc === inst) return 2;
  if (dadosEstado.pp === inst) return 3;
  return 9;
}

function getInstituicoesComparador() {
  return INSTITUICOES_VALIDAS
    .filter(inst => HEADER_INSTITUICOES_INFO[inst])
    .map(inst => {
      const estado = getEstadoDaInstituicao(inst);
      const dadosEstado = HEADER_ESTADOS[estado] || HEADER_ESTADOS.sp;
      const info = HEADER_INSTITUICOES_INFO[inst] || {};
      return {
        inst,
        estado,
        uf: dadosEstado.sigla || estado.toUpperCase(),
        estadoNome: dadosEstado.nome || estado.toUpperCase(),
        sigla: info.titulo || inst.toUpperCase(),
        nome: info.desc || inst.toUpperCase(),
        ramo: getRamoComparador(inst)
      };
    })
    .sort((a, b) => {
      const estadoComp = Object.keys(HEADER_ESTADOS).indexOf(a.estado) - Object.keys(HEADER_ESTADOS).indexOf(b.estado);
      return estadoComp || getOrdemComparador(a.inst) - getOrdemComparador(b.inst);
    });
}

function inicializarComparadorCarreiras() {
  const selecao = document.getElementById('comparador-selecao');
  if (!selecao) return;

  if (!selecao.dataset.renderizado) {
    const instituicoes = getInstituicoesComparador();
    const ordemEstados = Object.keys(HEADER_ESTADOS);
    selecao.innerHTML = ordemEstados.map(estado => {
      const dadosEstado = HEADER_ESTADOS[estado] || {};
      const itens = instituicoes.filter(item => item.estado === estado);
      if (!itens.length) return '';
      return `
        <div class="comparador-check-grupo" role="group" aria-label="${escapeHtml(dadosEstado.nome || estado.toUpperCase())}">
          <div class="comparador-check-titulo">${escapeHtml(dadosEstado.nome || estado.toUpperCase())}</div>
          ${itens.map(item => `
            <label class="comparador-check-option">
              <input type="checkbox" value="${escapeHtml(item.inst)}" data-sigla="${escapeHtml(item.sigla)}" onchange="carregarComparadorCarreiras()">
              <span>
                <strong>${escapeHtml(item.sigla)}</strong>
                <small>${escapeHtml(item.nome)} · ${escapeHtml(item.uf)} · ${escapeHtml(item.ramo)}</small>
              </span>
            </label>
          `).join('')}
        </div>
      `;
    }).join('');
    selecao.dataset.renderizado = 'true';
  }

  if (!selecao.querySelector('input[type="checkbox"]:checked')) comparadorSelecionarEstadoAtual(false);
  carregarComparadorCarreiras();
}

function getComparadorSelect() {
  return document.getElementById('comparador-selecao');
}

function getComparadorCheckboxes() {
  const selecao = getComparadorSelect();
  return selecao ? Array.from(selecao.querySelectorAll('input[type="checkbox"]')) : [];
}

function toggleComparadorLista() {
  const lista = getComparadorSelect();
  const botao = document.getElementById('comparador-toggle-lista');
  if (!lista || !botao) return;
  const aberta = !lista.classList.contains('aberta');
  lista.classList.toggle('aberta', aberta);
  botao.setAttribute('aria-expanded', aberta ? 'true' : 'false');
}

function setSelecionadasComparador(valores) {
  const checkboxes = getComparadorCheckboxes();
  const setValores = new Set((valores || []).filter(Boolean));
  checkboxes.forEach(check => { check.checked = setValores.has(check.value); });
}

function atualizarResumoSelecaoComparador() {
  const resumoSelecao = document.getElementById('comparador-selecionadas');
  const contador = document.getElementById('comparador-contador-selecao');
  if (!resumoSelecao) return;

  const selecionadas = getComparadorCheckboxes()
    .filter(check => check.checked)
    .map(check => check.dataset.sigla || check.value.toUpperCase())
    .filter(Boolean);

  if (contador) contador.textContent = `${selecionadas.length} selecionada${selecionadas.length === 1 ? '' : 's'}`;

  if (!selecionadas.length) {
    resumoSelecao.innerHTML = 'Nenhuma instituição selecionada.';
    return;
  }

  resumoSelecao.innerHTML = `<strong>Selecionadas (${selecionadas.length}):</strong> ${escapeHtml(selecionadas.join(', '))}`;
}

function comparadorSelecionarEstadoAtual(exibirToast = true) {
  const estadoAtivo = getEstadoDaInstituicao(currInst);
  const dadosEstado = HEADER_ESTADOS[estadoAtivo] || HEADER_ESTADOS.sp;
  const valores = [dadosEstado.pm, dadosEstado.pc, dadosEstado.pp].filter(Boolean);
  setSelecionadasComparador(valores);
  carregarComparadorCarreiras();
  if (exibirToast) mostrarToast(`Comparando carreiras de ${dadosEstado.nome}.`);
}

function comparadorSelecionarTodas() {
  const checkboxes = getComparadorCheckboxes();
  checkboxes.forEach(check => { check.checked = true; });
  carregarComparadorCarreiras();
  mostrarToast('Todas as instituições foram selecionadas para comparação.');
}

function comparadorLimparSelecao() {
  const checkboxes = getComparadorCheckboxes();
  checkboxes.forEach(check => { check.checked = false; });
  carregarComparadorCarreiras();
}

function getConcursoComparador(inst) {
  return CONCURSOS[inst] || getConcursoPoliciaPenal(inst) || {
    edital: 'Concurso de referência não cadastrado',
    salario: 'Consultar edital vigente',
    vagas: 'Consultar edital vigente',
    inscritos: 'Consultar banca e órgão oficial',
    banca: 'Consultar edital',
    materias: 'Consultar edital do cargo',
    previsao: 'Acompanhar Diário Oficial, órgão e banca.',
    escolaridade: 'Consultar edital',
    etapas: 'Consultar edital',
    site: REMUNERACAO_FONTES_OFICIAIS[inst]?.url || '#'
  };
}

function limitarTextoComparador(texto, limite = 220) {
  texto = String(texto || '').replace(/\s+/g, ' ').trim();
  return texto.length > limite ? texto.slice(0, limite - 1).trim() + '…' : texto;
}

function getResumoRemuneracaoComparador(inst) {
  const linhas = gerarRemuneracaoTabelada(inst) || [];
  const validas = linhas.filter(l => Number(l.remuneracao || 0) > 0);
  const menor = validas.length ? Math.min(...validas.map(l => Number(l.remuneracao || 0))) : 0;
  const maior = validas.length ? Math.max(...validas.map(l => Number(l.remuneracao || 0))) : 0;
  const linhaMenor = validas.find(l => Number(l.remuneracao || 0) === menor) || linhas[0] || {};
  const linhaMaior = validas.find(l => Number(l.remuneracao || 0) === maior) || linhas[0] || {};
  const fonte = REMUNERACAO_FONTES_OFICIAIS[linhaMenor.fonteKey] || REMUNERACAO_FONTES_OFICIAIS[inst] || { nome: 'Fonte oficial da carreira', url: '#' };
  const adicionais = getAdicionaisRemuneracaoResumo(inst, linhaMenor);
  return {
    totalCargos: linhas.length,
    menor,
    maior,
    cargoMenor: linhaMenor.cargo || 'Cargo inicial/de referência',
    cargoMaior: linhaMaior.cargo || 'Topo de carreira/de referência',
    adicionais,
    fonteNome: fonte.nome || 'Fonte oficial da carreira',
    fonteUrl: fonte.url || '#'
  };
}

function getDadosComparador(inst) {
  const info = HEADER_INSTITUICOES_INFO[inst] || {};
  const estado = getEstadoDaInstituicao(inst);
  const dadosEstado = HEADER_ESTADOS[estado] || HEADER_ESTADOS.sp;
  const concurso = getConcursoComparador(inst);
  const remuneracao = getResumoRemuneracaoComparador(inst);
  return {
    inst,
    sigla: info.titulo || inst.toUpperCase(),
    nome: info.desc || inst.toUpperCase(),
    estado: dadosEstado.nome || estado.toUpperCase(),
    uf: dadosEstado.sigla || estado.toUpperCase(),
    ramo: getRamoComparador(inst),
    concurso,
    remuneracao
  };
}

function getSelecionadasComparador() {
  return getComparadorCheckboxes()
    .filter(check => check.checked)
    .map(check => check.value)
    .filter(inst => INSTITUICOES_VALIDAS.includes(inst));
}

function linkComparador(url, texto = 'Abrir fonte') {
  if (!url || url === '#') return '<span>Consultar fonte oficial</span>';
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(texto)}</a>`;
}

function carregarComparadorCarreiras() {
  const tbody = document.getElementById('comparador-tabela');
  const cards = document.getElementById('comparador-cards');
  const resumo = document.getElementById('comparador-resumo');
  const wrap = document.getElementById('comparador-tabela-wrap');
  if (!tbody || !cards || !resumo || !wrap) return;

  atualizarResumoSelecaoComparador();
  const selecionadas = getSelecionadasComparador();
  if (selecionadas.length < 2) {
    resumo.innerHTML = '';
    tbody.innerHTML = '';
    cards.innerHTML = '<div class="comparador-vazio">Selecione pelo menos duas instituições para gerar o comparativo de carreiras.</div>';
    wrap.style.display = 'none';
    return;
  }

  wrap.style.display = '';
  const dados = selecionadas.map(getDadosComparador);

  const menores = dados.map(d => d.remuneracao.menor).filter(v => v > 0);
  const maiores = dados.map(d => d.remuneracao.maior).filter(v => v > 0);
  const melhorInicial = dados
    .filter(d => d.remuneracao.menor > 0)
    .sort((a, b) => b.remuneracao.menor - a.remuneracao.menor)[0];
  const melhorTopo = dados
    .filter(d => d.remuneracao.maior > 0)
    .sort((a, b) => b.remuneracao.maior - a.remuneracao.maior)[0];

  resumo.innerHTML = `
    <div class="comparador-stat">
      <span>Instituições comparadas</span>
      <strong>${dados.length}</strong>
    </div>
    <div class="comparador-stat">
      <span>Menor remuneração encontrada</span>
      <strong>${menores.length ? fmt(Math.min(...menores)) : 'A confirmar'}</strong>
    </div>
    <div class="comparador-stat">
      <span>Maior remuneração encontrada</span>
      <strong>${maiores.length ? fmt(Math.max(...maiores)) : 'A confirmar'}</strong>
    </div>
    <div class="comparador-stat">
      <span>Destaques</span>
      <strong>${melhorInicial ? escapeHtml(melhorInicial.sigla) + ' menor base' : 'Sem base'} · ${melhorTopo ? escapeHtml(melhorTopo.sigla) + ' topo' : 'Sem topo'}</strong>
    </div>
  `;

  tbody.innerHTML = dados.map(d => {
    const c = d.concurso;
    const r = d.remuneracao;
    return `
      <tr>
        <td>
          <strong>${escapeHtml(d.sigla)}</strong><br>
          ${escapeHtml(d.nome)}<br>
          <span class="comparador-pill">${escapeHtml(d.uf)}</span>
          <span class="comparador-pill">${escapeHtml(d.ramo)}</span>
        </td>
        <td>
          <strong>Menor:</strong> ${r.menor ? fmt(r.menor) : 'A confirmar'}<br>
          <small>${escapeHtml(r.cargoMenor)}</small><br>
          <strong>Maior:</strong> ${r.maior ? fmt(r.maior) : 'A confirmar'}<br>
          <small>${escapeHtml(r.cargoMaior)}</small>
        </td>
        <td>
          ${escapeHtml(limitarTextoComparador(r.adicionais, 260))}
        </td>
        <td>
          <strong>Último edital:</strong> ${escapeHtml(c.edital || 'Edital de referência')}<br>
          <strong>Salário edital:</strong> ${escapeHtml(c.salario || 'Consultar edital')}<br>
          <strong>Próximo concurso / andamento:</strong> ${escapeHtml(limitarTextoComparador(c.previsao, 180))}
        </td>
        <td>
          <strong>Vagas:</strong> ${escapeHtml(c.vagas || 'Consultar edital')}<br>
          <strong>Inscritos:</strong> ${escapeHtml(c.inscritos || 'Consultar banca')}
        </td>
        <td>
          <strong>Banca:</strong> ${escapeHtml(c.banca || 'Consultar edital')}<br>
          <strong>Matérias:</strong> ${escapeHtml(limitarTextoComparador(c.materias, 230))}
        </td>
        <td>
          ${linkComparador(c.site || r.fonteUrl, 'Concurso')}<br>
          ${linkComparador(r.fonteUrl, 'Remuneração')}
        </td>
      </tr>
    `;
  }).join('');

  cards.innerHTML = dados.map(d => {
    const c = d.concurso;
    const r = d.remuneracao;
    return `
      <article class="comparador-card">
        <h3>${escapeHtml(d.sigla)} — ${escapeHtml(d.uf)}</h3>
        <p><strong>${escapeHtml(d.nome)}</strong> · ${escapeHtml(d.ramo)}</p>
        <ul>
          <li><strong>Faixa cadastrada:</strong> ${r.menor ? fmt(r.menor) : 'A confirmar'} até ${r.maior ? fmt(r.maior) : 'A confirmar'}.</li>
          <li><strong>Referência inferior:</strong> ${escapeHtml(r.cargoMenor)}.</li>
          <li><strong>Último edital de referência:</strong> ${escapeHtml(c.edital || 'Consultar edital vigente')}.</li>
          <li><strong>Vagas:</strong> ${escapeHtml(c.vagas || 'Consultar edital')}.</li>
          <li><strong>Banca:</strong> ${escapeHtml(c.banca || 'Consultar edital')}.</li>
          <li><strong>Escolaridade:</strong> ${escapeHtml(limitarTextoComparador(c.escolaridade, 180))}.</li>
          <li><strong>Etapas:</strong> ${escapeHtml(limitarTextoComparador(c.etapas, 200))}.</li>
        </ul>
        <p><strong>Vantagens/benefícios:</strong> ${escapeHtml(limitarTextoComparador(r.adicionais, 260))}</p>
        <p>${linkComparador(c.site || r.fonteUrl, 'Ver fonte do concurso')} · ${linkComparador(r.fonteUrl, 'Ver fonte remuneratória')}</p>
      </article>
    `;
  }).join('');
}


function carregarConcursos() {
  const cont = document.getElementById('lista-concursos');
  if (!cont) return;
  const c = CONCURSOS[currInst] || getConcursoPoliciaPenal(currInst);
  if (!c) { cont.innerHTML = ""; return; }

  cont.innerHTML = `
    <div class="direito-item acao">
      <span class="direito-nome">${c.edital}</span>
      <span class="direito-desc"><strong>Salário inicial:</strong> ${c.salario}</span>
      <span class="direito-desc"><strong>Vagas:</strong> ${c.vagas}</span>
      <span class="direito-desc"><strong>Cotas:</strong> ${c.cotas}</span>
      <span class="direito-desc"><strong>Idade exigida:</strong> ${c.idade}</span>
      <span class="direito-desc"><strong>Escolaridade:</strong> ${c.escolaridade}</span>
      <span class="direito-desc"><strong>Banca:</strong> ${c.banca} · <strong>Inscritos no último:</strong> ${c.inscritos}</span>
      <span class="direito-desc"><strong>Disciplinas:</strong> ${c.materias}</span>
      <span class="direito-desc"><strong>Etapas do certame:</strong> ${c.etapas}</span>
      <span class="direito-desc"><strong>Curso de Formação:</strong> ${c.cfsd}</span>
      <span class="direito-desc"><strong>Estágio Probatório:</strong> ${c.estagio}</span>
      <span class="direito-desc"><strong>Validade do edital:</strong> ${c.validade}</span>
      <span class="direito-desc" style="margin-top:8px;"><strong>Próximo Edital:</strong> ${c.previsao}</span>
      ${c.site ? `<a href="${c.site}" target="_blank" rel="noopener noreferrer" class="concurso-link">🔗 Site oficial da instituição</a>` : ''}
    </div>

    <a class="taf-produto-card" href="https://s.shopee.com.br/9fHIyi0uae" target="_blank" rel="noopener noreferrer" aria-label="Ver barra fixa para porta, produto útil para treino de TAF">
      <div class="taf-produto-imagem" aria-hidden="true">
        <img src="assets/img/barrafixa01.jpg" data-img-base="assets/img/barrafixa01" alt="Detalhes da Oferta do Produto - barra fixa para porta" loading="lazy" onerror="carregarImagemProduto(this)">
      </div>
      <div class="taf-produto-conteudo">
        <span class="taf-produto-selo">Produto útil para o TAF</span>
        <strong>Barra fixa para porta</strong>
        <p>Ajuda o candidato a treinar em casa um dos exercícios que mais reprovam no TAF. Com constância, a barra fortalece costas, braços, pegada e resistência, facilitando a evolução para cumprir as repetições exigidas nos testes físicos das polícias.</p>
        <span class="taf-produto-cta">Comprar</span>
      </div>
    </a>

    <a class="taf-produto-card taf-produto-card-barrafixa02" href="https://s.shopee.com.br/9fHJ0X4HVl" target="_blank" rel="noopener noreferrer" aria-label="Ver Power Rack Funcional com paralelas, suporte de agachamento, supino, barra fixa e barra paralela, produto útil para treino de TAF">
      <div class="taf-produto-imagem" aria-hidden="true">
        <img src="assets/img/barrafixa02.jpg" data-img-base="assets/img/barrafixa02" alt="Power Rack Funcional com paralelas, suporte de agachamento, supino, barra fixa e barra paralela" loading="lazy" onerror="carregarImagemProduto(this)">
      </div>
      <div class="taf-produto-conteudo">
        <span class="taf-produto-selo">Produto útil para o TAF</span>
        <strong>Power Rack Funcional com barra fixa e paralelas</strong>
        <p>Por ser maior, mais estável e permitir treino completo, o power rack ajuda o candidato a evoluir com mais segurança na barra fixa, paralelas, agachamento e fortalecimento geral. É uma opção superior para quem quer passar no TAF das polícias, porque permite treinar força, pegada, costas, braços, core e resistência em um equipamento mais robusto e versátil.</p>
        <span class="taf-produto-cta">Comprar</span>
      </div>
    </a>
  `;
}

/* ============================================================ */
/* === AÇÕES JUDICIAIS ======================================== */
/* ============================================================ */
function carregarAcoes() {
  const cont = document.getElementById('lista-acoes');
  if (!cont) return;
  const lista = ACOES_JUDICIAIS[currInst] || getAcoesPoliciaPenal(currInst) || [];

  cont.innerHTML = lista.map(a => {
    const fonteHtml = a.fonte ? `<span class="direito-desc"><strong>Fonte de conferência:</strong> ${a.fonteUrl ? `<a href="${a.fonteUrl}" target="_blank" rel="noopener noreferrer" class="concurso-link">${a.fonte}</a>` : a.fonte}</span>` : '';
    const atualizadoHtml = a.atualizado ? `<span class="direito-desc"><strong>Última atualização:</strong> ${a.atualizado}</span>` : '';

    return `
      <div class="direito-item acao">
        <span class="direito-nome">${a.titulo}</span>
        <span class="direito-status" style="color: var(--vermelho);">${a.status}</span>
        <div>
          <span class="badge-info ${a.tipo}">${a.tipo === 'coletiva' ? '⚖ Ação Coletiva' : '👤 Ação Individual'}</span>
          <span class="badge-info ativa">${a.ano}</span>
        </div>
        <span class="direito-desc">${a.desc}</span>
        <span class="direito-desc"><strong>Base legal/jurisprudência:</strong> ${a.base}</span>
        ${fonteHtml}
        ${atualizadoHtml}
      </div>
    `;
  }).join('');
}

/* ============================================================ */
/* === ASSOCIAÇÕES ============================================ */
/* ============================================================ */
function carregarAssociacoes() {
  const cont = document.getElementById('lista-associacoes');
  if (!cont) return;
  const lista = ASSOCIACOES[currInst] || getAssociacoesPoliciaPenal(currInst) || [];
  cont.innerHTML = lista.map(a => `
    <div class="direito-item associacao">
      <span class="direito-nome">${a.nome}</span>
      <span class="direito-desc"><strong>Foco:</strong> ${a.foco}</span>
      <span class="direito-desc"><strong>Atuação atual:</strong> ${a.acao}</span>
      <span class="direito-desc"><strong>Serviços:</strong> ${a.servicos}</span>
      <span class="direito-desc"><strong>Mensalidade:</strong> ${a.mensalidade}</span>
      <span class="direito-desc"><strong>Contato:</strong> ${a.telefone} · <a href="https://${a.site}" target="_blank" rel="noopener noreferrer" class="concurso-link" style="margin-top:0;">${a.site}</a></span>
    </div>
  `).join('');
}


/* ============================================================ */
/* === CONTADOR DE CARACTERES (CONTATO) ======================= */
/* ============================================================ */
/* BLOCO 15.14 — Formulário de contato e contador de caracteres */
function atualizarContador() {
  const txt = document.getElementById('contato_mensagem');
  const cnt = document.getElementById('char-counter');
  if (!txt || !cnt) return;
  const len = txt.value.length;
  cnt.textContent = `${len} / 2000 caracteres`;
  cnt.classList.toggle('over', len > 1900);
}

/* ============================================================ */
/* === ENVIO DE CONTATO ======================================= */
/* ============================================================ */
function enviarEmailContato(event) {
  event.preventDefault();
  const nome = document.getElementById('contato_nome').value.trim();
  const email = document.getElementById('contato_email').value.trim();
  const assunto = document.getElementById('contato_assunto').value;
  const msg = document.getElementById('contato_mensagem').value.trim();

  if (!nome || !email || !assunto || !msg) {
    mostrarToast('Preencha todos os campos!', 'error');
    return;
  }
  if (msg.length < 10) {
    mostrarToast('Mensagem muito curta (mínimo 10 caracteres).', 'error');
    return;
  }
  const corpo = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${msg}\n\n---\nEnviado via Universo Segurança Pública`);
  const sub = encodeURIComponent(`[CONTATO] ${assunto}`);
  window.location.href = `mailto:universosegpub@gmail.com?subject=${sub}&body=${corpo}`;
  setTimeout(() => mostrarToast('E-mail aberto no seu cliente! Resposta em até 48h.'), 300);
}

/* ============================================================ */
/* === EVENT LISTENERS / INICIALIZAÇÃO ======================== */
/* ============================================================ */
/* BLOCO 15.15 — Inicialização, eventos automáticos e atalhos de teclado */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Popula cargos usados na aba Direitos e Vantagens.
  popularCargos('pmesp');

  // Aplica o cabeçalho inicial do portal; a instituição específica só entra após escolha do usuário.
  aplicarHeaderInicialPortal();

  // Direitos: atualizar quando muda cargo/situação/tempo.
  ['cargo_dir', 'situacao_dir', 'tempo_dir'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', analisarDireitos);
  });

  // Acessibilidade: ESC fecha o menu.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const sb = document.getElementById('sidebar');
      if (sb && sb.classList.contains('active')) toggleMenu();
    }
  });
});
