/* =======================================================
   APP.JS — camada de comportamento do site
   Mantém o dados.js como base de dados e deixa aqui a UI,
   navegação, header, tabelas, concursos, direitos e contato.
   ======================================================= */

let currTabela = Array.isArray(window.CARGOS_PM) ? CARGOS_PM : [];
let currInst = 'pmesp';
let headerModoInicialPortal = true;

const INSTITUICOES_VALIDAS = [
  'pmesp','pcsp','ppsp','pmerj','pcerj','pprj','pmmg','pcmg','ppmg','pmba','pcba','ppba','pmpr','pcpr','pppr','pmrs','pcrs','pprs','pmsc','pcsc','ppsc','pmes','pces','ppes','pmms','pcms','ppms','pmmt','pcmt','ppmt','pmgo','pcgo','ppgo'
];

const HEADER_ESTADOS = {
  sp: { nome: 'São Paulo', sigla: 'SP', pm: 'pmesp', pc: 'pcsp', pp: 'ppsp', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg' },
  rj: { nome: 'Rio de Janeiro', sigla: 'RJ', pm: 'pmerj', pc: 'pcerj', pp: 'pprj', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_estado_do_Rio_de_Janeiro.svg' },
  mg: { nome: 'Minas Gerais', sigla: 'MG', pm: 'pmmg', pc: 'pcmg', pp: 'ppmg', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Minas_Gerais.svg' },
  ba: { nome: 'Bahia', sigla: 'BA', pm: 'pmba', pc: 'pcba', pp: 'ppba', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_da_Bahia.svg' },
  pr: { nome: 'Paraná', sigla: 'PR', pm: 'pmpr', pc: 'pcpr', pp: 'pppr', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Paran%C3%A1.svg' },
  rs: { nome: 'Rio Grande do Sul', sigla: 'RS', pm: 'pmrs', pc: 'pcrs', pp: 'pprs', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Rio_Grande_do_Sul.svg' },
  sc: { nome: 'Santa Catarina', sigla: 'SC', pm: 'pmsc', pc: 'pcsc', pp: 'ppsc', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Santa_Catarina.svg' },
  es: { nome: 'Espírito Santo', sigla: 'ES', pm: 'pmes', pc: 'pces', pp: 'ppes', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_do_Esp%C3%ADrito_Santo.svg' },
  ms: { nome: 'Mato Grosso do Sul', sigla: 'MS', pm: 'pmms', pc: 'pcms', pp: 'ppms', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Mato_Grosso_do_Sul.svg' },
  mt: { nome: 'Mato Grosso', sigla: 'MT', pm: 'pmmt', pc: 'pcmt', pp: 'ppmt', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Mato_Grosso.svg' },
  go: { nome: 'Goiás', sigla: 'GO', pm: 'pmgo', pc: 'pcgo', pp: 'ppgo', flag: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bandeira_de_Goi%C3%A1s.svg' }
};

const HEADER_INSTITUICOES_INFO = {
  pmesp: { titulo: 'PMESP', desc: 'Polícia Militar de São Paulo' }, pcsp: { titulo: 'PCSP', desc: 'Polícia Civil de São Paulo' }, ppsp: { titulo: 'PPSP', desc: 'Polícia Penal de São Paulo' },
  pmerj: { titulo: 'PMERJ', desc: 'Polícia Militar do Rio de Janeiro' }, pcerj: { titulo: 'PCERJ', desc: 'Polícia Civil do Rio de Janeiro' }, pprj: { titulo: 'PPRJ', desc: 'Polícia Penal do Rio de Janeiro' },
  pmmg: { titulo: 'PMMG', desc: 'Polícia Militar de Minas Gerais' }, pcmg: { titulo: 'PCMG', desc: 'Polícia Civil de Minas Gerais' }, ppmg: { titulo: 'PPMG', desc: 'Polícia Penal de Minas Gerais' },
  pmba: { titulo: 'PMBA', desc: 'Polícia Militar da Bahia' }, pcba: { titulo: 'PCBA', desc: 'Polícia Civil da Bahia' }, ppba: { titulo: 'PPBA', desc: 'Polícia Penal da Bahia' },
  pmpr: { titulo: 'PMPR', desc: 'Polícia Militar do Paraná' }, pcpr: { titulo: 'PCPR', desc: 'Polícia Civil do Paraná' }, pppr: { titulo: 'PPPR', desc: 'Polícia Penal do Paraná' },
  pmrs: { titulo: 'PMRS', desc: 'Brigada Militar do Rio Grande do Sul' }, pcrs: { titulo: 'PCRS', desc: 'Polícia Civil do Rio Grande do Sul' }, pprs: { titulo: 'PPRS', desc: 'Polícia Penal do Rio Grande do Sul' },
  pmsc: { titulo: 'PMSC', desc: 'Polícia Militar de Santa Catarina' }, pcsc: { titulo: 'PCSC', desc: 'Polícia Civil de Santa Catarina' }, ppsc: { titulo: 'PPSC', desc: 'Polícia Penal de Santa Catarina' },
  pmes: { titulo: 'PMES', desc: 'Polícia Militar do Espírito Santo' }, pces: { titulo: 'PCES', desc: 'Polícia Civil do Espírito Santo' }, ppes: { titulo: 'PPES', desc: 'Polícia Penal do Espírito Santo' },
  pmms: { titulo: 'PMMS', desc: 'Polícia Militar de Mato Grosso do Sul' }, pcms: { titulo: 'PCMS', desc: 'Polícia Civil de Mato Grosso do Sul' }, ppms: { titulo: 'PPMS', desc: 'Polícia Penal de Mato Grosso do Sul' },
  pmmt: { titulo: 'PMMT', desc: 'Polícia Militar de Mato Grosso' }, pcmt: { titulo: 'PCMT', desc: 'Polícia Judiciária Civil de Mato Grosso' }, ppmt: { titulo: 'PPMT', desc: 'Polícia Penal de Mato Grosso' },
  pmgo: { titulo: 'PMGO', desc: 'Polícia Militar de Goiás' }, pcgo: { titulo: 'PCGO', desc: 'Polícia Civil de Goiás' }, ppgo: { titulo: 'PPGO', desc: 'Polícia Penal de Goiás' }
};

const HEADER_INSTITUICOES_RESUMO = {
  pmesp: { criacao: '15/12/1831', ativa: 82000, reserva: 90000, populacao: 46081801, governador: 'Tarcísio de Freitas', comando: 'Comando-Geral da PMESP', atualizado: 'Atualizado em 2026' },
  pcsp: { criacao: 'Origem histórica: 1841', ativa: 28000, reserva: 35000, populacao: 46081801, governador: 'Tarcísio de Freitas', comando: 'Delegacia-Geral da PCSP', atualizado: 'Atualizado em 2026' },
  ppsp: { criacao: 'EC 104/2019 · LC SP 1.416/2024', ativaLabel: 'Carreira em implantação', reservaLabel: 'Conferir SAP/SPPREV', totalLabel: 'Órgão permanente da SAP/SP', populacao: 46081801, governador: 'Tarcísio de Freitas', comando: 'Diretoria-Geral da Polícia Penal/SP', atualizado: 'Atualizado em 2026' },
  pmerj: { criacao: '13/05/1809', ativa: 43000, reserva: 40000, populacao: 17223547, governador: 'Governo do RJ', comando: 'Comando-Geral da PMERJ', atualizado: 'Atualizado em 2026' },
  pcerj: { criacao: 'Origem histórica: 1808', ativa: 9000, reserva: 10000, populacao: 17223547, governador: 'Governo do RJ', comando: 'Secretaria de Estado de Polícia Civil', atualizado: 'Atualizado em 2026' },
  pprj: { criacao: 'EC 104/2019 · SEAP/RJ', ativaLabel: 'Conferir SEAP/RJ', reservaLabel: 'Conferir RioPrevidência', totalLabel: 'Sistema penal estadual', populacao: 17223547, governador: 'Governo do RJ', comando: 'SEAP/RJ', atualizado: 'Atualizado em 2026' },
  pmmg: { criacao: '09/06/1775', ativa: 40000, reserva: 45000, populacao: 21393441, governador: 'Governo de MG', comando: 'Comando-Geral da PMMG', atualizado: 'Atualizado em 2026' },
  pcmg: { criacao: 'Origem histórica: 1891', ativa: 10000, reserva: 11000, populacao: 21393441, governador: 'Governo de MG', comando: 'Chefia da Polícia Civil/MG', atualizado: 'Atualizado em 2026' },
  ppmg: { criacao: 'EC 104/2019 · carreira estadual', ativaLabel: 'Conferir SEJUSP/MG', reservaLabel: 'Conferir regime estadual', totalLabel: 'Sistema prisional mineiro', populacao: 21393441, governador: 'Governo de MG', comando: 'Departamento Penitenciário/MG', atualizado: 'Atualizado em 2026' },
  pmba: { criacao: '17/02/1825', ativa: 30000, reserva: 27000, populacao: 14870907, governador: 'Governo da BA', comando: 'Comando-Geral da PMBA', atualizado: 'Atualizado em 2026' },
  pcba: { criacao: 'Origem histórica: 1833', ativa: 6000, reserva: 7000, populacao: 14870907, governador: 'Governo da BA', comando: 'Delegacia-Geral da PCBA', atualizado: 'Atualizado em 2026' },
  ppba: { criacao: 'EC 104/2019 · SEAP/BA', ativaLabel: 'Conferir SEAP/BA', reservaLabel: 'Conferir Funprev/BA', totalLabel: 'Sistema prisional baiano', populacao: 14870907, governador: 'Governo da BA', comando: 'SEAP/BA', atualizado: 'Atualizado em 2026' },
  pmpr: { criacao: '10/08/1854', ativa: 18000, reserva: 20000, populacao: 11890517, governador: 'Governo do PR', comando: 'Comando-Geral da PMPR', atualizado: 'Atualizado em 2026' },
  pcpr: { criacao: 'Origem histórica: 1853', ativa: 5000, reserva: 6000, populacao: 11890517, governador: 'Governo do PR', comando: 'Delegacia-Geral da PCPR', atualizado: 'Atualizado em 2026' },
  pppr: { criacao: 'EC 104/2019 · QPPP', ativaLabel: 'Conferir PPPR', reservaLabel: 'Conferir ParanáPrevidência', totalLabel: 'QPPP modernizado', populacao: 11890517, governador: 'Governo do PR', comando: 'Diretoria-Geral da PPPR', atualizado: 'Atualizado em 2026' },
  pmrs: { criacao: '18/11/1837', ativa: 18000, reserva: 23000, populacao: 11233263, governador: 'Governo do RS', comando: 'Comando-Geral da Brigada Militar', atualizado: 'Atualizado em 2026' },
  pcrs: { criacao: 'Origem histórica: 1841', ativa: 5500, reserva: 7000, populacao: 11233263, governador: 'Governo do RS', comando: 'Chefia de Polícia/RS', atualizado: 'Atualizado em 2026' },
  pprs: { criacao: 'EC 104/2019 · LC RS 16.449/2025', ativaLabel: 'Conferir SSPS/RS', reservaLabel: 'Conferir IPE Prev/RS', totalLabel: 'Sistema penal gaúcho', populacao: 11233263, governador: 'Governo do RS', comando: 'Polícia Penal/RS', atualizado: 'Atualizado em 2026' },
  pmsc: { criacao: '05/05/1835', ativa: 10500, reserva: 12000, populacao: 8187029, governador: 'Governo de SC', comando: 'Comando-Geral da PMSC', atualizado: 'Atualizado em 2026' },
  pcsc: { criacao: 'Origem histórica: 1812', ativa: 3500, reserva: 4500, populacao: 8187029, governador: 'Governo de SC', comando: 'Delegacia-Geral da PCSC', atualizado: 'Atualizado em 2026' },
  ppsc: { criacao: 'EC 104/2019 · LC SC 774/2021', ativa: 4809, reservaLabel: 'Conferir IPREV/SC', totalLabel: 'Carreira estruturada em classes', populacao: 8187029, governador: 'Governo de SC', comando: 'Departamento de Polícia Penal/SC', atualizado: 'Atualizado em 2026' },
  pmes: { criacao: '06/04/1835', ativa: 8000, reserva: 7000, populacao: 4126854, governador: 'Governo do ES', comando: 'Comando-Geral da PMES', atualizado: 'Atualizado em 2026' },
  pces: { criacao: 'Origem histórica: 1896', ativa: 2500, reserva: 3500, populacao: 4126854, governador: 'Governo do ES', comando: 'Delegacia-Geral da PCES', atualizado: 'Atualizado em 2026' },
  ppes: { criacao: 'EC 104/2019 · LC ES 1.059/2023', ativaLabel: 'Carreira em consolidação', reservaLabel: 'Conferir IPAJM/ES', totalLabel: 'SEJUS/ES', populacao: 4126854, governador: 'Governo do ES', comando: 'Polícia Penal/ES', atualizado: 'Atualizado em 2026' },
  pmms: { criacao: '05/09/1835 · MS em 1979', ativa: 10602, populacao: 2924631, governador: 'Governo do MS', comando: 'Comando-Geral da PMMS', atualizado: 'Atualizado em 2026' },
  pcms: { criacao: 'Abril/1979 · LC MS 114/2005', ativa: 2373, populacao: 2924631, governador: 'Governo do MS', comando: 'Delegacia-Geral da PCMS', atualizado: 'Atualizado em 2026' },
  ppms: { criacao: 'EC 104/2019 · EC MS 88/2021', ativa: 1903, populacao: 2924631, governador: 'Governo do MS', comando: 'Polícia Penal/MS', atualizado: 'Atualizado em 2026' },
  pmmt: { criacao: '05/09/1835 · LC MT 529/2014', ativa: 7275, populacao: 3893659, governador: 'Governo do MT', comando: 'Comando-Geral da PMMT', atualizado: 'Atualizado em 2026' },
  pcmt: { criacao: 'Lei MT 7.935/2003 · LC MT 407/2010', ativa: 2983, populacao: 3893659, governador: 'Governo do MT', comando: 'Delegacia-Geral da PCMT', atualizado: 'Atualizado em 2026' },
  ppmt: { criacao: 'EC 104/2019 · Polícia Penal MT', ativa: 2620, populacao: 3893659, governador: 'Governo do MT', comando: 'Polícia Penal/MT', atualizado: 'Atualizado em 2026' },
  pmgo: { criacao: 'Lei GO nº 8.033/1975 · Lei GO nº 23.235/2025', ativaLabel: 'Conferir PMGO/Portal da Transparência', populacao: 7423629, governador: 'Governo de GO', comando: 'Comando-Geral da PMGO', atualizado: 'Atualizado em 2026' },
  pcgo: { criacao: 'Lei Estadual nº 185/1898 · Lei GO nº 23.235/2025', ativaLabel: 'Conferir PCGO/Portal da Transparência', populacao: 7423629, governador: 'Governo de GO', comando: 'Delegacia-Geral da PCGO', atualizado: 'Atualizado em 2026' },
  ppgo: { criacao: 'EC 104/2019 · DGPP/GO', ativa: 3693, populacao: 7423629, governador: 'Governo de GO', comando: 'DGPP/GO', atualizado: 'Atualizado em 2026' }
};

const CORES_INSTITUICAO = {
  pmesp:'#e60000', pcsp:'#4f4f4f', ppsp:'#6f4e37', pmerj:'#1E3084', pcerj:'#6B7280', pprj:'#5a4b81', pmmg:'#7c1a1a', pcmg:'#b58d3d', ppmg:'#8b5a2b', pmba:'#967117', pcba:'#333333', ppba:'#6b5b2e', pmpr:'#2f6b3f', pcpr:'#1f5e89', pppr:'#41644a', pmrs:'#0f3d75', pcrs:'#5b6472', pprs:'#315d7c', pmsc:'#1b4f8a', pcsc:'#4b5563', ppsc:'#38598b', pmes:'#0b5c9e', pces:'#4b3f72', ppes:'#5e548e', pmms:'#2f5f8f', pcms:'#4b5563', ppms:'#516b3b', pmmt:'#1f7a4d', pcmt:'#5b6472', ppmt:'#6b5f2f', pmgo:'#1f7a4d', pcgo:'#4b5563', ppgo:'#596b2d'
};

const REMUNERACAO_FONTES_OFICIAIS = {
  pmesp: { nome: 'SGGD/SP — Área Policial — Polícia Militar', url: 'https://www.sggd.sp.gov.br/sgp/normas_e_legislacao/policial' },
  pcsp: { nome: 'SGGD/SP — Área Policial — Polícia Civil', url: 'https://www.sggd.sp.gov.br/sgp/normas_e_legislacao/policial' },
  pmerj: { nome: 'GESPERJ/RJ — Caderno de Remuneração', url: 'https://www.rj.gov.br/gesperj/' },
  pcerj: { nome: 'GESPERJ/RJ — Caderno de Remuneração', url: 'https://www.rj.gov.br/gesperj/' },
  pmmg: { nome: 'MG/SEPLAG — Grupo XI — Defesa Social', url: 'https://www.mg.gov.br/planejamento' },
  pcmg: { nome: 'MG/SEPLAG — Grupo XI — Defesa Social', url: 'https://www.mg.gov.br/planejamento' },
  pmba: { nome: 'Casa Civil/BA — Leis remuneratórias 2025/2026', url: 'https://www.legislabahia.ba.gov.br/' },
  pcba: { nome: 'Casa Civil/BA — Leis remuneratórias 2025/2026', url: 'https://www.legislabahia.ba.gov.br/' },
  pmpr: { nome: 'Legislação/PR — subsídio e auxílio-alimentação', url: 'https://www.legislacao.pr.gov.br/' },
  pcpr: { nome: 'Legislação/PR — Polícia Civil e auxílio-alimentação', url: 'https://www.legislacao.pr.gov.br/' },
  pmrs: { nome: 'Governo do RS/RHE — Relação de remuneração', url: 'https://tesouro.fazenda.rs.gov.br/' },
  pcrs: { nome: 'Governo do RS/RHE — Relação de remuneração', url: 'https://tesouro.fazenda.rs.gov.br/' },
  pmsc: { nome: 'ALESC/SC — legislação remuneratória', url: 'https://leis.alesc.sc.gov.br/' },
  pcsc: { nome: 'PCSC e ALESC/SC — legislação/editais', url: 'https://pc.sc.gov.br/' },
  pmes: { nome: 'PMES/ES — legislação e editais', url: 'https://pm.es.gov.br/' },
  pces: { nome: 'PCES/ES — legislação e concursos', url: 'https://pc.es.gov.br/' },
  pmms: { nome: 'PMMS/MS — tabela e editais', url: 'https://www.pm.ms.gov.br/' },
  pcms: { nome: 'PCMS/MS — legislação e editais', url: 'https://www.pc.ms.gov.br/' },
  pmmt: { nome: 'PMMT/MT — legislação e editais', url: 'https://www.pm.mt.gov.br/' },
  pcmt: { nome: 'PJC/MT — legislação e editais', url: 'https://www.pjc.mt.gov.br/' },
  pmgo: { nome: 'Legisla Goiás — Lei GO nº 23.235/2025', url: 'https://legisla.casacivil.go.gov.br/' },
  pcgo: { nome: 'Legisla Goiás — Lei GO nº 23.235/2025', url: 'https://legisla.casacivil.go.gov.br/' },
  ppgo: { nome: 'DGPP/GO e Legisla Goiás', url: 'https://www.policiapenal.go.gov.br/' }
};

function normalizarInstituicao(inst) { return INSTITUICOES_VALIDAS.includes(inst) ? inst : 'pmesp'; }
function isPoliciaPenal(inst) { return /^pp/.test(String(inst || '')); }
function fmt(v) { return `R$ ${(+v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function valEl(id) { return parseFloat(document.getElementById(id)?.value) || 0; }
function escapeHtml(str = '') { return String(str).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch])); }
function asUrl(url) { const value = String(url || '').trim(); if (!value || /consultar/i.test(value)) return ''; return /^https?:\/\//i.test(value) ? value : `https://${value}`; }
function setTexto(id, valor) { const el = document.getElementById(id); if (el) el.textContent = valor; }

function getTabelaCargosRemuneracao(inst) {
  const map = {
    pmesp: CARGOS_PM, pcsp: CARGOS_PC, ppsp: CARGOS_PPSP,
    pmerj: CARGOS_PMERJ, pcerj: CARGOS_PCERJ, pprj: CARGOS_PPRJ,
    pmmg: CARGOS_PMMG, pcmg: CARGOS_PCMG, ppmg: CARGOS_PPMG,
    pmba: CARGOS_PMBA, pcba: CARGOS_PCBA, ppba: CARGOS_PPBA,
    pmpr: CARGOS_PMPR, pcpr: CARGOS_PCPR, pppr: CARGOS_PPPR,
    pmrs: CARGOS_PMRS, pcrs: CARGOS_PCRS, pprs: CARGOS_PPRS,
    pmsc: CARGOS_PMSC, pcsc: CARGOS_PCSC, ppsc: CARGOS_PPSC,
    pmes: CARGOS_PMES, pces: CARGOS_PCES, ppes: CARGOS_PPES,
    pmms: CARGOS_PMMS, pcms: CARGOS_PCMS, ppms: CARGOS_PPMS,
    pmmt: CARGOS_PMMT, pcmt: CARGOS_PCMT, ppmt: CARGOS_PPMT,
    pmgo: CARGOS_PMGO, pcgo: CARGOS_PCGO, ppgo: CARGOS_PPGO
  };
  return map[normalizarInstituicao(inst)] || CARGOS_PM || [];
}

function mostrarToast(msg, tipo = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show' + (tipo === 'error' ? ' error' : '');
  setTimeout(() => { toast.className = 'toast'; }, 3500);
}

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menuOverlay');
  const btn = document.querySelector('.menu-btn');
  if (!sidebar || !overlay) return;
  const isActive = sidebar.classList.toggle('active');
  overlay.classList.toggle('active', isActive);
  if (btn) btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
}

function switchPage(page, options = {}) {
  const pageEl = document.getElementById('page-' + page);
  const menuEl = document.getElementById('menu-' + page);
  if (!pageEl || !menuEl) return;

  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active');
    section.setAttribute('aria-hidden', 'true');
  });
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
  });

  pageEl.classList.add('active');
  pageEl.setAttribute('aria-hidden', 'false');
  pageEl.setAttribute('tabindex', '-1');
  menuEl.classList.add('active');
  menuEl.setAttribute('aria-current', 'page');

  atualizarHeaderDesc();
  atualizarVisibilidadeResumoInstitucional(page);

  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 968 && sidebar?.classList.contains('active')) toggleMenu();

  if (page === 'direitos') analisarDireitos();
  if (page === 'concursos') carregarConcursos();
  if (page === 'comparar') inicializarComparadorCarreiras();
  if (page === 'acoes') carregarAcoes();
  if (page === 'associacoes') carregarAssociacoes();
  if (page === 'remuneracao') carregarRemuneracaoTabelada();

  try {
    localStorage.setItem('ultimaAbaPortalUSP', page);
    if (!options.silentHash) history.replaceState(null, '', '#' + page);
  } catch (e) {}

  if (!options.noScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => pageEl.focus({ preventScroll: true }), 120);
  }
}

function atualizarVisibilidadeResumoInstitucional(page = '') {
  const ativa = document.querySelector('.page-section.active');
  const pagina = page || (ativa ? ativa.id.replace('page-', '') : 'principal');
  const mostrarResumo = pagina === 'principal';
  const painelResumo = document.querySelector('.header-facts-panel');
  const cardInstitucional = document.querySelector('.header-institution-card');
  const blocoPrincipal = document.querySelector('.header-institution-main');
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
  return ({ principal:'Principal', acoes:'Ações Judiciais', associacoes:'Associações e Sindicatos', remuneracao:'Remuneração Tabelada', concursos:'Concursos', comparar:'Comparar Carreiras', produtos:'Produtos', direitos:'Direitos e Vantagens', parceiros:'Parceiros - Anuncie aqui!' })[page] || 'Principal';
}

function atualizarHeaderDesc(descInstituicao) {
  const el = document.getElementById('header-desc');
  if (headerModoInicialPortal) {
    if (el) el.textContent = getNomeAbaAtual() === 'Principal' ? 'Escolha uma instituição' : getNomeAbaAtual();
    return;
  }
  if (el) el.textContent = getNomeAbaAtual();
  const info = HEADER_INSTITUICOES_INFO[currInst];
  setTexto('header-active-sigla', info?.titulo || currInst.toUpperCase());
  setTexto('header-active-name', descInstituicao || info?.desc || 'Instituição selecionada');
}

function toggleTheme() {
  const html = document.documentElement;
  const tema = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', tema);
  localStorage.setItem('theme', tema);
  initTheme();
}

function initTheme() {
  const tema = document.documentElement.getAttribute('data-theme') || 'dark';
  const btnHeader = document.getElementById('theme-toggle-header');
  if (btnHeader) btnHeader.innerHTML = tema === 'dark' ? '☀️ Claro' : '🌙 Escuro';
}

function popularCargos(inst) {
  currTabela = getTabelaCargosRemuneracao(inst);
  ['cargo', 'cargo_dir'].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = '';
    currTabela.forEach(c => {
      const o = document.createElement('option');
      o.value = c.val;
      o.textContent = c.text || c.cargo || c.val;
      if (c.selected) o.selected = true;
      select.appendChild(o);
    });
  });
}

function formatarNumeroHeader(valor) { return Number(valor || 0).toLocaleString('pt-BR'); }
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
    'header-label-criacao': 'Criação', 'header-label-ativa': 'Efetivo ativo', 'header-label-reserva': 'Reserva/inativos', 'header-label-total': 'Efetivo total',
    'header-label-populacao': 'População UF', 'header-label-relacao': 'Relação ativa', 'header-label-governador': 'Chefe do Executivo', 'header-label-comando': 'Comando atual'
  };
  Object.entries({ ...padrao, ...labels }).forEach(([id, valor]) => setTexto(id, valor));
}

function calcularResumoPortalHeader() {
  let ativa = 0, reserva = 0, populacao = 0;
  INSTITUICOES_VALIDAS.forEach(inst => {
    const dados = HEADER_INSTITUICOES_RESUMO[inst] || {};
    const infoPenal = isPoliciaPenal(inst) && typeof getInfoPoliciaPenal === 'function' ? getInfoPoliciaPenal(inst) : {};
    ativa += Number(dados.ativa || infoPenal.efetivoAtivo || 0);
    reserva += Number(dados.reserva || 0);
  });
  Object.values(HEADER_ESTADOS).forEach(estado => {
    const ref = HEADER_INSTITUICOES_RESUMO[estado.pm] || HEADER_INSTITUICOES_RESUMO[estado.pc] || HEADER_INSTITUICOES_RESUMO[estado.pp] || {};
    populacao += Number(ref.populacao || 0);
  });
  return { instituicoes: INSTITUICOES_VALIDAS.length, estados: Object.keys(HEADER_ESTADOS).length, ativa, reserva, total: ativa + reserva, populacao };
}

function aplicarHeaderInicialPortal() {
  headerModoInicialPortal = true;
  document.body.setAttribute('data-inst', 'portal');
  const resumoPortal = calcularResumoPortalHeader();
  const flagAtual = document.getElementById('header-active-flag');
  if (flagAtual) {
    flagAtual.style.display = '';
    flagAtual.dataset.imgBase = 'assets/img/logoleao';
    flagAtual.dataset.retry = '';
    flagAtual.src = 'assets/img/logoleao.webp';
    flagAtual.alt = 'Logo Universo Segurança Pública';
    flagAtual.setAttribute('onerror', "if(!this.dataset.retry){this.dataset.retry='png';this.src='assets/img/logoleao.png';}else if(this.dataset.retry==='png'){this.dataset.retry='jpg';this.src='assets/img/logoleao.jpg';}else if(this.dataset.retry==='jpg'){this.dataset.retry='jpeg';this.src='assets/img/logoleao.jpeg';}else{this.style.display='none';}");
    flagAtual.closest('.current-flag-frame')?.classList.add('brand-logo-frame');
  }
  setTexto('header-active-sigla', 'Universo');
  setTexto('header-active-name', 'Segurança Pública');
  setTexto('header-desc', 'Escolha uma instituição');
  setTexto('header-resumo-titulo', 'Resumo do portal');
  setTexto('header-resumo-atualizado', 'Visão geral do portal');
  atualizarLabelsHeaderResumo({
    'header-label-criacao':'Instituições', 'header-label-ativa':'Ativos estimados', 'header-label-reserva':'Reserva/inativos', 'header-label-total':'Total abrangido',
    'header-label-populacao':'População abrangida', 'header-label-relacao':'Estados', 'header-label-governador':'Cobertura', 'header-label-comando':'Primeiro passo'
  });
  setTexto('header-resumo-criacao', String(resumoPortal.instituicoes));
  setTexto('header-resumo-ativa', `${formatarEfetivoHeader(resumoPortal.ativa)}+`);
  setTexto('header-resumo-reserva', `${formatarEfetivoHeader(resumoPortal.reserva)}+`);
  setTexto('header-resumo-total', `${formatarEfetivoHeader(resumoPortal.total)}+`);
  setTexto('header-resumo-populacao', formatarNumeroHeader(resumoPortal.populacao));
  setTexto('header-resumo-relacao', `${resumoPortal.estados} estados`);
  setTexto('header-resumo-governador', 'Polícias militares, civis e penais');
  setTexto('header-resumo-comando', 'Selecione uma instituição para ver os dados específicos');
  ['instituicao','instituicao_header'].forEach(id => { const s = document.getElementById(id); if (s) s.value = ''; });
  [['header-pm-sigla','PM'],['header-pc-sigla','PC'],['header-pp-sigla','PP']].forEach(([id, valor]) => setTexto(id, valor));
  ['header-branch-pm','header-branch-pc','header-branch-pp'].forEach(id => { const b = document.getElementById(id); if (b) { b.disabled = true; b.classList.remove('active'); b.setAttribute('aria-pressed','false'); } });
  document.querySelectorAll('.state-flag').forEach(flag => { flag.classList.remove('active'); flag.setAttribute('aria-pressed','false'); });
  atualizarVisibilidadeResumoInstitucional('principal');
}

function atualizarHeaderResumo(inst) {
  atualizarLabelsHeaderResumo();
  setTexto('header-resumo-titulo', 'Resumo institucional');
  const dados = HEADER_INSTITUICOES_RESUMO[inst] || HEADER_INSTITUICOES_RESUMO.pmesp || {};
  const totalEfetivo = Number(dados.ativa || 0) + Number(dados.reserva || 0);
  setTexto('header-resumo-atualizado', dados.atualizado || 'Atualizado');
  setTexto('header-resumo-criacao', dados.criacao || 'Não informado');
  setTexto('header-resumo-ativa', dados.ativaLabel || formatarEfetivoHeader(dados.ativa));
  setTexto('header-resumo-reserva', dados.reservaLabel || formatarEfetivoHeader(dados.reserva));
  setTexto('header-resumo-total', dados.totalLabel || (totalEfetivo ? formatarEfetivoHeader(totalEfetivo) : 'Não informado'));
  setTexto('header-resumo-populacao', dados.populacao ? formatarNumeroHeader(dados.populacao) : 'Não informado');
  setTexto('header-resumo-relacao', dados.relacaoLabel || calcularRelacaoHeader(dados.populacao, dados.ativa));
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
  const dadosEstado = HEADER_ESTADOS[String(estado || '').toLowerCase()];
  if (!dadosEstado) return;
  mudarInstituicao(dadosEstado.pm || dadosEstado.pc || dadosEstado.pp);
  switchPage('principal');
  mostrarToast(`${dadosEstado.nome} selecionado. Agora escolha Militar, Civil ou Penal.`);
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
    flagAtual.closest('.current-flag-frame')?.classList.remove('brand-logo-frame');
    flagAtual.style.display = '';
    flagAtual.removeAttribute('data-retry');
    flagAtual.removeAttribute('onerror');
    flagAtual.src = dadosEstado.flag;
    flagAtual.alt = `Bandeira de ${dadosEstado.nome}`;
  }
  setTexto('header-active-sigla', instituicao.titulo);
  setTexto('header-active-name', instituicao.desc);
  const mapBtns = [['pm','header-branch-pm','header-pm-sigla'], ['pc','header-branch-pc','header-pc-sigla'], ['pp','header-branch-pp','header-pp-sigla']];
  mapBtns.forEach(([ramo, btnId, siglaId]) => {
    const chave = dadosEstado[ramo];
    const info = HEADER_INSTITUICOES_INFO[chave];
    setTexto(siglaId, info ? info.titulo : ramo.toUpperCase());
    const btn = document.getElementById(btnId);
    if (btn) {
      const ativo = !!chave && inst === chave;
      btn.disabled = !chave;
      btn.classList.toggle('active', ativo);
      btn.setAttribute('aria-pressed', ativo ? 'true' : 'false');
    }
  });
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
  const solicitada = novaInstituicao || document.getElementById('instituicao')?.value || currInst || 'pmesp';
  const inst = normalizarInstituicao(solicitada);
  if (inst !== solicitada) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }
  headerModoInicialPortal = false;
  currInst = inst;
  document.body.setAttribute('data-inst', inst);
  ['instituicao','instituicao_header'].forEach(id => {
    const seletor = document.getElementById(id);
    if (!seletor) return;
    const existe = Array.from(seletor.options || []).some(o => o.value === inst);
    if (existe) seletor.value = inst;
  });
  atualizarFlagsEstado(inst);
  const info = HEADER_INSTITUICOES_INFO[inst] || HEADER_INSTITUICOES_INFO.pmesp;
  atualizarHeaderDesc(info.desc);
  ['dir','concursos','comparar','produtos','remuneracao','acoes','assoc'].forEach(suf => {
    const id = `txt-inst-${suf}`;
    setTexto(id, info.titulo);
  });
  popularCargos(inst);
  analisarDireitos();
  carregarConcursos();
  carregarAcoes();
  carregarAssociacoes();
  carregarRemuneracaoTabelada();
  if (document.getElementById('page-comparar')?.classList.contains('active')) carregarComparadorCarreiras();
}

function linhaRemuneracaoOficial(cargo, remuneracao, beneficios, criterio, benefDesc, fonteKey, badge = 'Fonte oficial') {
  const valor = Number(remuneracao || 0);
  return { cargo, remuneracao: valor, beneficios: Number(beneficios || 0), total: valor + Number(beneficios || 0), criterio, benefDesc, fonteKey, badge, valorPendente: valor <= 0 };
}

function calcularRemuneracaoTabelada(inst, cargo) {
  inst = normalizarInstituicao(inst);
  const padrao = Number(cargo.padrao || 0);
  const gratif = Number(cargo.gratif || 0);
  let remuneracao = padrao + gratif;
  let beneficios = Number(cargo.beneficios || 0);
  let criterio = cargo.criterio || 'Vencimento/subsídio bruto mensal de referência do cargo.';
  let benefDesc = cargo.benefDesc || 'Benefícios e adicionais variáveis dependem de lei, rubrica, escala, lotação e situação funcional.';
  let fonteKey = cargo.fonteKey || inst;
  let badge = cargo.badge || (cargo.oficial ? 'Fonte oficial' : 'Referência cadastrada');

  if (inst === 'pmesp' || inst === 'pcsp') {
    remuneracao = padrao * (1 + Number(cargo.retpFator || 0)) + gratif;
    criterio = cargo.criterio || 'Padrão/vencimento + RETP quando aplicável, com gratificação cadastrada quando houver.';
    benefDesc = `Auxílio-alimentação SP: ${fmt(typeof AUX_ALIM_SP_DIA_PADRAO !== 'undefined' ? AUX_ALIM_SP_DIA_PADRAO : 0)} por dia efetivamente trabalhado; quinquênio, sexta-parte e insalubridade dependem do caso.`;
  } else if (inst === 'pmerj') {
    const gret = padrao * Number(cargo.gretPct || 0);
    const ghp = padrao * Number(cargo.ghpPct || 0);
    const gram = (padrao + gret + ghp) * 0.625;
    remuneracao = padrao + gret + ghp + gram;
    criterio = 'Soldo + GRET + GHP + GRAM, conforme estrutura da tabela remuneratória.';
    benefDesc = `Auxílio-alimentação PMERJ de referência: ${fmt(typeof AUX_ALIM_RJ_PM !== 'undefined' ? AUX_ALIM_RJ_PM : 0)}; não somado ao bruto.`;
  } else if (inst === 'pcerj') {
    const aapOuRepresentacao = cargo.delegado ? padrao * Number(cargo.representacaoPct || 2.12) : padrao * Number(cargo.aapPct || 2.30);
    const ghp = padrao * Number(cargo.ghpPct || 0);
    const gatc = padrao * Number(cargo.gatcPct || 0);
    remuneracao = padrao + aapOuRepresentacao + ghp + gatc;
    beneficios = 804;
    criterio = cargo.delegado ? 'VB + verba de representação + GHP máxima.' : 'VB + AAP + GHP máxima + GATC quando aplicável.';
    benefDesc = 'Auxílio alimentação R$ 704,00/mês + auxílio transporte R$ 100,00 quando aplicáveis.';
  } else if (inst === 'pmba') {
    const gap = Array.isArray(cargo.gapBa) ? Number(cargo.gapBa[0] || 0) : 0;
    remuneracao = padrao + gap;
    beneficios = typeof PMBA_AUX_FARDAMENTO_2026 !== 'undefined' ? PMBA_AUX_FARDAMENTO_2026 : 0;
    criterio = 'Soldo + primeira referência de GAP cadastrada. A tabela completa aparece quando o cargo tem referências.';
    benefDesc = `Auxílio fardamento de referência: ${fmt(beneficios)}. Auxílio-alimentação BA varia por jornada.`;
  } else if (inst === 'pcba') {
    const grat = Array.isArray(cargo.gratBa) ? Number(cargo.gratBa[0] || 0) : 0;
    remuneracao = padrao + grat;
    criterio = `Vencimento + primeira referência de ${cargo.gratBaLabel || 'GAJ/GAPJ'} cadastrada.`;
    benefDesc = 'CET, GIP, GQUAL ou outras vantagens dependem de função, titulação, lotação ou ato específico.';
  } else if (inst === 'pmpr' || inst === 'pcpr') {
    beneficios = typeof AUX_ALIM_PR_PADRAO !== 'undefined' ? AUX_ALIM_PR_PADRAO : 0;
    criterio = 'Subsídio bruto mensal por cargo/classe.';
    benefDesc = `Auxílio-alimentação PR: ${fmt(beneficios)}.`;
  } else if (inst === 'pmrs') {
    beneficios = typeof AUX_ALIM_RS_BM !== 'undefined' ? AUX_ALIM_RS_BM : 0;
    criterio = cargo.criterio || 'Remuneração bruta de referência por posto/graduação.';
    benefDesc = `Auxílio-alimentação BM/RS: ${fmt(beneficios)}.`;
  } else if (inst === 'pmsc' || inst === 'pcsc') {
    beneficios = typeof AUX_ALIM_SC_PADRAO !== 'undefined' ? AUX_ALIM_SC_PADRAO : 0;
    criterio = cargo.criterio || 'Subsídio/remuneração bruta mensal por cargo/classe.';
    benefDesc = `Auxílio-alimentação SC de referência: ${fmt(beneficios)}; verba indenizatória.`;
  } else if (inst === 'pmes' || inst === 'pces') {
    beneficios = typeof AUX_ALIM_ES_PADRAO !== 'undefined' ? AUX_ALIM_ES_PADRAO : 0;
    criterio = cargo.criterio || 'Subsídio/remuneração bruta mensal por cargo/categoria/referência.';
    benefDesc = `Auxílio-alimentação ES de referência: ${fmt(beneficios)}; conferir rubrica vigente.`;
  }

  if (isPoliciaPenal(inst)) {
    const info = typeof getInfoPoliciaPenal === 'function' ? getInfoPoliciaPenal(inst) : {};
    remuneracao = padrao;
    beneficios = Number(cargo.beneficios || 0);
    criterio = cargo.criterio || `Tabela remuneratória de referência da ${info.sigla || inst.toUpperCase()}.`;
    benefDesc = cargo.benefDesc || 'Auxílios, adicionais, plantões e parcelas indenizatórias dependem de lei, escala, lotação e situação funcional.';
    fonteKey = cargo.fonteKey || inst;
    badge = cargo.badge || 'Fonte oficial';
  }

  return { remuneracao, beneficios, total: remuneracao + beneficios, criterio, benefDesc, fonteKey, badge };
}

function gerarRemuneracaoTabelada(inst) {
  inst = normalizarInstituicao(inst);
  const refsBa = ['I','II','III','IV','V'];
  if (inst === 'pmba') {
    return CARGOS_PMBA.flatMap(cargo => (cargo.gapBa || [0]).map((gap, idx) => linhaRemuneracaoOficial(
      `${cargo.text} — GAP Ref. ${refsBa[idx] || idx + 1}`,
      Number(cargo.padrao || 0) + Number(gap || 0),
      typeof PMBA_AUX_FARDAMENTO_2026 !== 'undefined' ? PMBA_AUX_FARDAMENTO_2026 : 0,
      `Soldo + GAP Referência ${refsBa[idx] || idx + 1}.`,
      'Auxílio fardamento destacado; demais benefícios dependem de regra, jornada e rubrica.',
      'pmba', cargo.oficial ? 'Fonte oficial' : 'Carreira operacional'
    )));
  }
  if (inst === 'pcba') {
    return CARGOS_PCBA.flatMap(cargo => (cargo.gratBa || [0]).map((grat, idx) => linhaRemuneracaoOficial(
      `${cargo.text} — ${cargo.gratBaLabel || 'GAJ/GAPJ'} Ref. ${refsBa[idx] || idx + 1}`,
      Number(cargo.padrao || 0) + Number(grat || 0),
      0,
      `${cargo.gratBaLabel || 'GAJ/GAPJ'} Referência ${refsBa[idx] || idx + 1}.`,
      'Benefício fixo geral não somado nesta fonte.',
      'pcba', cargo.oficial ? 'Fonte oficial' : 'Carreira operacional'
    )));
  }
  return getTabelaCargosRemuneracao(inst).map(cargo => {
    const calc = calcularRemuneracaoTabelada(inst, cargo);
    return linhaRemuneracaoOficial(cargo.text || cargo.cargo || cargo.val, calc.remuneracao, calc.beneficios, calc.criterio, calc.benefDesc, calc.fonteKey, calc.badge);
  });
}

function getAdicionaisRemuneracaoResumo(inst, linha = {}) {
  inst = normalizarInstituicao(inst);
  if (linha.benefDesc) return linha.benefDesc;
  if (isPoliciaPenal(inst)) {
    const info = typeof getInfoPoliciaPenal === 'function' ? getInfoPoliciaPenal(inst) : {};
    return `${info.sigla || inst.toUpperCase()}: vantagens, adicionais, plantões, gratificações e aposentadoria dependem da lei local, lotação, escala, rubrica e contracheque.`;
  }
  const aux = {
    pmesp: `Auxílio-alimentação SP: ${fmt(typeof AUX_ALIM_SP_DIA_PADRAO !== 'undefined' ? AUX_ALIM_SP_DIA_PADRAO : 0)} por dia efetivamente trabalhado; adicionais dependem do caso.`,
    pcsp: `Auxílio-alimentação SP: ${fmt(typeof AUX_ALIM_SP_DIA_PADRAO !== 'undefined' ? AUX_ALIM_SP_DIA_PADRAO : 0)} por dia efetivamente trabalhado; adicionais dependem do caso.`,
    pmmg: `Ajuda de custo alimentação MG: ${fmt(typeof AUX_ALIM_MG_DIA_PADRAO !== 'undefined' ? AUX_ALIM_MG_DIA_PADRAO : 0)} por dia efetivo, quando atendidos os critérios.`,
    pcmg: `Ajuda de custo alimentação MG: ${fmt(typeof AUX_ALIM_MG_DIA_PADRAO !== 'undefined' ? AUX_ALIM_MG_DIA_PADRAO : 0)} por dia efetivo, quando atendidos os critérios.`,
    pmpr: `Auxílio-alimentação PR: ${fmt(typeof AUX_ALIM_PR_PADRAO !== 'undefined' ? AUX_ALIM_PR_PADRAO : 0)}.`,
    pcpr: `Auxílio-alimentação PR: ${fmt(typeof AUX_ALIM_PR_PADRAO !== 'undefined' ? AUX_ALIM_PR_PADRAO : 0)}.`,
    pmsc: `Auxílio-alimentação SC: ${fmt(typeof AUX_ALIM_SC_PADRAO !== 'undefined' ? AUX_ALIM_SC_PADRAO : 0)}.`,
    pcsc: `Auxílio-alimentação SC: ${fmt(typeof AUX_ALIM_SC_PADRAO !== 'undefined' ? AUX_ALIM_SC_PADRAO : 0)}.`,
    pmes: `Auxílio-alimentação ES de referência: ${fmt(typeof AUX_ALIM_ES_PADRAO !== 'undefined' ? AUX_ALIM_ES_PADRAO : 0)}.`,
    pces: `Auxílio-alimentação ES de referência: ${fmt(typeof AUX_ALIM_ES_PADRAO !== 'undefined' ? AUX_ALIM_ES_PADRAO : 0)}.`
  };
  return aux[inst] || 'Adicionais, auxílios e indenizações dependem de legislação, cargo, lotação, escala e situação individual.';
}

function formatarAdicionaisRemuneracaoHtml(inst, linha = {}) {
  const resumo = String(getAdicionaisRemuneracaoResumo(inst, linha) || '').replace(/\s+/g, ' ').trim();
  if (!resumo) return '<span class="adicionais-vazio">Sem adicionais específicos cadastrados.</span>';
  const partes = resumo.split(/;\s+|\.\s+/).map(p => p.trim().replace(/[.;]$/, '')).filter(Boolean);
  return `<ul class="adicionais-lista">${partes.map(texto => `<li>${escapeHtml(texto)}</li>`).join('')}</ul>`;
}

function carregarRemuneracaoTabelada() {
  const inst = normalizarInstituicao(currInst);
  const tbody = document.getElementById('lista-remuneracao');
  if (!tbody) return;
  const linhas = gerarRemuneracaoTabelada(inst);
  if (!linhas.length) { tbody.innerHTML = '<tr><td colspan="4">Não há dados cadastrados para esta instituição.</td></tr>'; return; }
  const remuneracoes = linhas.map(l => l.remuneracao).filter(v => Number(v) > 0);
  setTexto('remu-total-cargos', String(linhas.length));
  setTexto('remu-menor-total', remuneracoes.length ? fmt(Math.min(...remuneracoes)) : 'A confirmar');
  setTexto('remu-maior-total', remuneracoes.length ? fmt(Math.max(...remuneracoes)) : 'A confirmar');
  tbody.innerHTML = linhas.map(l => {
    const fonte = REMUNERACAO_FONTES_OFICIAIS[l.fonteKey] || REMUNERACAO_FONTES_OFICIAIS[inst] || { nome: 'Fonte oficial da carreira', url: '#' };
    return `<tr>
      <td><strong>${escapeHtml(l.cargo)}</strong><br><span class="remuneracao-badge">${escapeHtml(l.badge || 'Fonte oficial')}</span></td>
      <td class="valor">${l.valorPendente ? 'A confirmar' : fmt(l.remuneracao)}</td>
      <td class="adicionais">${formatarAdicionaisRemuneracaoHtml(inst, l)}</td>
      <td>${escapeHtml(l.criterio || '')}<br><span class="remuneracao-fonte">${escapeHtml(fonte.nome)}</span><br>${asUrl(fonte.url) ? `<a class="remuneracao-link" href="${escapeHtml(asUrl(fonte.url))}" target="_blank" rel="noopener noreferrer">Abrir fonte oficial</a>` : '<span class="remuneracao-fonte">Consultar fonte oficial</span>'}</td>
    </tr>`;
  }).join('');
}

function direitoSecao(titulo) { return `<div class="direitos-section-title">${escapeHtml(titulo)}</div>`; }
function direitoItem(nome, status, desc, base = '') {
  const statusMap = {
    automatico: { label:'✓ Direito automático / requisito provável', color:'var(--verde)', bg:'rgba(32, 142, 78, 0.06)' },
    condicionado: { label:'◼ Direito condicionado', color:'var(--dourado)', bg:'rgba(223,182,62,0.08)' },
    requerimento: { label:'⏳ Depende de requerimento/perícia', color:'var(--azul)', bg:'rgba(30,48,132,0.08)' },
    verificar: { label:'⚠ Verificar caso individual', color:'var(--text-muted)', bg:'var(--item-bg)' },
    atencao: { label:'⚠ Atenção / requisito não indicado', color:'#e60000', bg:'rgba(230, 0, 0, 0.05)' }
  };
  const cfg = statusMap[status] || statusMap.verificar;
  const classe = status === 'automatico' ? 'sim' : status === 'atencao' ? 'nao' : '';
  return `<div class="direito-item ${classe}" style="border-left-color:${cfg.color}; background:${cfg.bg};">
    <span class="direito-nome">${nome}</span>
    <span class="direito-status" style="color:${cfg.color};">${cfg.label}</span>
    <span class="direito-desc">${desc}</span>
    ${base ? `<span class="direito-meta"><strong>Base/observação:</strong> ${base}</span>` : ''}
  </div>`;
}

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
  const cargo = currTabela.find(x => x.val === cargoVal) || currTabela.find(x => x.selected) || currTabela[0];
  if (!cargo) { cont.innerHTML = ''; return; }
  const info = HEADER_INSTITUICOES_INFO[inst] || { titulo: inst.toUpperCase(), desc: inst.toUpperCase() };
  let html = `<div class="direito-item acao" style="border-left-color: var(--vermelho);"><span class="direito-nome">Resumo da análise — ${escapeHtml(info.titulo)}</span><span class="direito-desc"><strong>Cargo/nível:</strong> ${escapeHtml(cargo.text || cargo.val)}</span><span class="direito-desc"><strong>Situação:</strong> ${escapeHtml(sit)} · <strong>Tempo:</strong> ${tempo} ano(s) · <strong>Idade:</strong> ${idade || 'não informada'} · <strong>Sexo:</strong> ${escapeHtml(sexo)}</span><span class="direito-desc"><strong>Ingresso:</strong> ${ingresso ? ingresso.split('-').reverse().join('/') : 'não informado'} · <strong>Remuneração:</strong> ${renda ? fmt(renda) : 'não informada'} · <strong>Dependente:</strong> ${escapeHtml(dependente)}</span></div>`;
  html += direitoSecao('Direitos gerais e benefícios familiares');
  if (dependente === 'sim' && renda > 0 && renda <= 1980.38) html += direitoItem('Salário-Família', 'condicionado', 'Pode haver enquadramento no salário-família conforme dependente elegível e limite remuneratório informado.', 'Referência 2026: cota de R$ 67,54 até remuneração de R$ 1.980,38; conferir regime do servidor.');
  else html += direitoItem('Salário-Família', 'verificar', 'Depende de filho/equiparado até 14 anos ou inválido e remuneração dentro do limite legal.', 'Conferir legislação previdenciária aplicável ao servidor.');
  html += direitoItem('Pensão por morte e auxílio-funeral', 'condicionado', 'Benefícios dependem de dependentes habilitados, documentos, regime previdenciário e regra estadual.', 'Conferir órgão previdenciário estadual ou sistema de proteção social militar.');
  html += direitoSecao('Vantagens remuneratórias e adicionais');
  if (tempo >= 5) html += direitoItem('Adicional por tempo de serviço', 'condicionado', `O tempo informado indica ${Math.floor(tempo / 5)} período(s) de 5 anos para conferência de quinquênio, adicional, progressão ou vantagem equivalente.`, 'A regra muda por UF e por carreira; confirmar ficha funcional e legislação local.');
  else html += direitoItem('Adicional por tempo de serviço', 'atencao', `Ainda não há indicativo de primeiro período de 5 anos. Faltam aproximadamente ${Math.max(0, 5 - tempo)} ano(s), quando a regra existir.`, 'Nem todo regime possui a mesma verba.');
  if ((inst === 'pmesp' || inst === 'pcsp') && tempo >= 20) html += direitoItem('Sexta-parte', 'automatico', 'Em SP, 20 anos ou mais de efetivo exercício indicam possível direito à sexta-parte, observadas exceções legais.', 'Art. 129 da Constituição do Estado de São Paulo.');
  else if (inst === 'pmesp' || inst === 'pcsp') html += direitoItem('Sexta-parte', 'atencao', `Faltam aproximadamente ${Math.max(0, 20 - tempo)} ano(s) para o marco de 20 anos em SP.`, 'Art. 129 da Constituição do Estado de São Paulo.');
  html += direitoItem('Insalubridade / periculosidade / risco', 'condicionado', getAdicionaisRemuneracaoResumo(inst), 'Depende de lei local, laudo, lotação, rubrica, contracheque e eventual regime de subsídio.');
  if (localEspecial === 'sim') html += direitoItem('Localidade ou unidade especial', 'condicionado', 'Você informou atuação em localidade/unidade especial. Pode haver verba, diária, gratificação ou regra própria.', 'Depende de designação formal, escala, publicação e legislação local.');
  html += direitoSecao('Carreira, estabilidade e aposentadoria');
  html += direitoItem('Estabilidade no serviço público', tempo >= 3 ? 'automatico' : 'atencao', tempo >= 3 ? 'Com 3 anos ou mais, há indicativo de estabilidade após aprovação no estágio probatório.' : `Tempo inferior a 3 anos. Faltam aproximadamente ${Math.max(0, 3 - tempo)} ano(s) para o marco geral.`, 'Art. 41 da Constituição Federal; carreiras específicas podem ter ritos próprios.');
  html += direitoItem('Progressão / promoção / curso de formação', 'condicionado', 'Promoções e progressões dependem de interstício, avaliação, cursos, merecimento, antiguidade, vagas e conduta.', 'Conferir estatuto, plano de carreira e boletins/atos oficiais.');
  const tipoApos = /^pm/.test(inst) && inst !== 'pmmt' ? 'Reserva remunerada / reforma' : 'Aposentadoria policial';
  const statusApos = requisitosApos === 'sim' ? 'condicionado' : (tempo >= 30 && idade >= 55 ? 'verificar' : 'atencao');
  html += direitoItem(tipoApos, statusApos, requisitosApos === 'sim' ? 'Você informou que os requisitos já foram cumpridos. Confirme regra aplicada, cálculo, paridade/integralidade quando cabível e eventual abono.' : 'A análise previdenciária exige data de ingresso, idade, sexo, tempo no cargo/carreira, contribuição, regra de transição e legislação estadual.', 'Não use apenas o simulador para decisão previdenciária; conferir setor de pessoal/previdência/associação.');
  if (sit === 'ativa') html += direitoItem('Abono de permanência', requisitosApos === 'sim' ? 'condicionado' : 'verificar', requisitosApos === 'sim' ? 'Pode existir se os requisitos foram reconhecidos e o servidor permanece em atividade.' : 'Só deve ser analisado após confirmar cumprimento dos requisitos de aposentadoria/reserva.', 'Depende de requerimento e reconhecimento administrativo.');
  html += direitoSecao('Alertas e conferência');
  html += direitoItem('Conferência em fonte oficial', 'verificar', 'Use esta aba como triagem inicial. Para decisão financeira, ação judicial ou aposentadoria, confira legislação, edital, ficha funcional e contracheque.', 'Fontes: Diário Oficial, portal de transparência, setor de pessoal, previdência estadual, associação/sindicato ou advogado.');
  cont.innerHTML = html;
}

function getConcursoPoliciaPenal(inst) {
  if (!isPoliciaPenal(inst) || typeof getInfoPoliciaPenal !== 'function') return null;
  const info = getInfoPoliciaPenal(inst);
  return {
    edital: `${info.sigla} — ${info.nome} — concursos, formação e carreira penal`, salario: info.concurso?.salario || info.remuneracao || 'Consultar edital', vagas: info.concurso?.vagas || 'Conferir autorização e edital vigente', cotas: 'Reserva de vagas conforme legislação e edital.', idade: 'Conferir edital vigente.', escolaridade: info.concurso?.escolaridade || info.escolaridade || 'Conferir edital.', materias: 'Português, Raciocínio Lógico, Informática, Direito, Direitos Humanos, LEP, legislação penitenciária e conhecimentos específicos, conforme edital.', banca: info.concurso?.banca || 'A definir conforme edital.', inscritos: 'Acompanhar banca e Diário Oficial.', etapas: 'Prova objetiva, investigação social, exames, avaliação psicológica, TAF, curso de formação e demais fases previstas.', cfsd: info.formacao || 'Curso de formação conforme edital.', estagio: 'Estágio probatório conforme lei da carreira.', validade: 'Conferir edital.', previsao: `Acompanhar publicações oficiais: ${info.fonte || info.orgao}.`, site: info.url || '#'
  };
}

function carregarConcursos() {
  const cont = document.getElementById('lista-concursos');
  if (!cont) return;
  const c = (typeof CONCURSOS !== 'undefined' ? CONCURSOS[currInst] : null) || getConcursoPoliciaPenal(currInst);
  if (!c) { cont.innerHTML = '<div class="direito-item verificar"><span class="direito-nome">Concurso não cadastrado</span><span class="direito-desc">Consulte o órgão oficial da instituição.</span></div>'; return; }
  cont.innerHTML = `<div class="direito-item acao"><span class="direito-nome">${escapeHtml(c.edital || 'Concurso de referência')}</span><span class="direito-desc"><strong>Salário inicial:</strong> ${escapeHtml(c.salario || 'Consultar edital')}</span><span class="direito-desc"><strong>Vagas:</strong> ${escapeHtml(c.vagas || 'Consultar edital')}</span><span class="direito-desc"><strong>Cotas:</strong> ${escapeHtml(c.cotas || 'Conferir edital')}</span><span class="direito-desc"><strong>Idade exigida:</strong> ${escapeHtml(c.idade || 'Conferir edital')}</span><span class="direito-desc"><strong>Escolaridade:</strong> ${escapeHtml(c.escolaridade || 'Conferir edital')}</span><span class="direito-desc"><strong>Banca:</strong> ${escapeHtml(c.banca || 'Consultar edital')} · <strong>Inscritos:</strong> ${escapeHtml(c.inscritos || 'Consultar banca')}</span><span class="direito-desc"><strong>Disciplinas:</strong> ${escapeHtml(c.materias || 'Consultar edital')}</span><span class="direito-desc"><strong>Etapas:</strong> ${escapeHtml(c.etapas || 'Consultar edital')}</span><span class="direito-desc"><strong>Curso de Formação:</strong> ${escapeHtml(c.cfsd || 'Conferir edital')}</span><span class="direito-desc"><strong>Estágio Probatório:</strong> ${escapeHtml(c.estagio || 'Conferir regra')}</span><span class="direito-desc"><strong>Validade:</strong> ${escapeHtml(c.validade || 'Conferir edital')}</span><span class="direito-desc" style="margin-top:8px;"><strong>Próximo edital / andamento:</strong> ${escapeHtml(c.previsao || 'Acompanhar publicações oficiais')}</span>${asUrl(c.site) ? `<a href="${escapeHtml(asUrl(c.site))}" target="_blank" rel="noopener noreferrer" class="concurso-link">🔗 Site oficial da instituição</a>` : ''}</div>
  ${cardTAF('https://s.shopee.com.br/9fHIyi0uae','barrafixa01','Barra fixa para porta','Ajuda o candidato a treinar em casa um dos exercícios que mais reprovam no TAF. Com constância, fortalece costas, braços, pegada e resistência.')}
  ${cardTAF('https://s.shopee.com.br/9fHJ0X4HVl','barrafixa02','Power Rack Funcional com barra fixa e paralelas','Equipamento mais robusto para evoluir em barra fixa, paralelas, agachamento e fortalecimento geral com mais estabilidade.')}`;
}

function cardTAF(link, imgBase, titulo, texto) {
  return `<a class="taf-produto-card ${imgBase === 'barrafixa02' ? 'taf-produto-card-barrafixa02' : ''}" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer" aria-label="Ver ${escapeHtml(titulo)}"><div class="taf-produto-imagem" aria-hidden="true"><img src="assets/img/${imgBase}.webp" data-img-base="assets/img/${imgBase}" alt="${escapeHtml(titulo)}" loading="lazy" onerror="carregarImagemProdutoGlobal(this)"></div><div class="taf-produto-conteudo"><span class="taf-produto-selo">Produto útil para o TAF</span><strong>${escapeHtml(titulo)}</strong><p>${escapeHtml(texto)}</p><span class="taf-produto-cta">Comprar</span></div></a>`;
}

function carregarImagemProdutoGlobal(img) {
  const base = img.dataset.imgBase || img.getAttribute('src')?.replace(/\.[a-z]+$/i, '');
  const ext = ['webp','png','jpg','jpeg'];
  const tentativa = Number(img.dataset.tentativa || 0);
  if (base && tentativa < ext.length) { img.dataset.tentativa = tentativa + 1; img.src = `${base}.${ext[tentativa]}`; return; }
  img.style.display = 'none';
  img.closest('.taf-produto-card, .produto-imagem')?.classList.add('img-indisponivel');
}

function getAcoesPoliciaPenal(inst) {
  if (!isPoliciaPenal(inst) || typeof getInfoPoliciaPenal !== 'function') return [];
  const info = getInfoPoliciaPenal(inst);
  return [
    { titulo: `${info.sigla} — Enquadramento e implantação da carreira`, status: 'Verificar caso a caso', ano: info.criacao || 'EC 104/2019', tipo: 'individual', desc: info.marco || 'Carreira penal em estruturação.', base: 'Lei local, ato de enquadramento, ficha funcional, contracheque e Diário Oficial.', fonte: info.fonte || info.orgao, fonteUrl: info.url, atualizado: '2026' },
    { titulo: `${info.sigla} — Adicionais, plantões, risco e rubricas`, status: 'Depende de rubrica', ano: 'Tema recorrente', tipo: 'individual', desc: info.vantagens || 'Vantagens dependem da legislação local.', base: 'Lei estadual, laudo, escala, lotação e contracheque.', fonte: info.fonte || info.orgao, fonteUrl: info.url, atualizado: '2026' }
  ];
}

function carregarAcoes() {
  const cont = document.getElementById('lista-acoes');
  if (!cont) return;
  const lista = (typeof ACOES_JUDICIAIS !== 'undefined' ? ACOES_JUDICIAIS[currInst] : null) || getAcoesPoliciaPenal(currInst) || [];
  cont.innerHTML = lista.length ? lista.map(a => `<div class="direito-item acao"><span class="direito-nome">${escapeHtml(a.titulo)}</span><span class="direito-status" style="color: var(--vermelho);">${escapeHtml(a.status || 'Verificar')}</span><div><span class="badge-info ${escapeHtml(a.tipo || 'individual')}">${a.tipo === 'coletiva' ? '⚖ Ação Coletiva' : '👤 Ação Individual'}</span><span class="badge-info ativa">${escapeHtml(a.ano || 'Tema atual')}</span></div><span class="direito-desc">${escapeHtml(a.desc || '')}</span><span class="direito-desc"><strong>Base legal/jurisprudência:</strong> ${escapeHtml(a.base || 'Conferir caso individual.')}</span>${a.fonte ? `<span class="direito-desc"><strong>Fonte de conferência:</strong> ${asUrl(a.fonteUrl) ? `<a href="${escapeHtml(asUrl(a.fonteUrl))}" target="_blank" rel="noopener noreferrer" class="concurso-link">${escapeHtml(a.fonte)}</a>` : escapeHtml(a.fonte)}</span>` : ''}${a.atualizado ? `<span class="direito-desc"><strong>Última atualização:</strong> ${escapeHtml(a.atualizado)}</span>` : ''}</div>`).join('') : '<div class="direito-item"><span class="direito-nome">Sem ações cadastradas</span><span class="direito-desc">Consulte associação, sindicato ou advogado para triagem individual.</span></div>';
}

function getAssociacoesPoliciaPenal(inst) {
  if (!isPoliciaPenal(inst) || typeof getInfoPoliciaPenal !== 'function') return [];
  const info = getInfoPoliciaPenal(inst);
  return [{ nome: `Entidade representativa da ${info.sigla}`, foco: `${info.uf || 'UF'} — policiais penais ativos, aposentados e pensionistas`, acao: `Representação em carreira, remuneração, saúde, aposentadoria, condições de trabalho e valorização institucional.`, site: 'Consultar canais oficiais e redes da entidade local', telefone: 'Consultar diretamente', mensalidade: 'Consultar diretamente', servicos: 'Orientação associativa/sindical, notícias, mobilização, convênios e eventual apoio jurídico.' }];
}

function carregarAssociacoes() {
  const cont = document.getElementById('lista-associacoes');
  if (!cont) return;
  const lista = (typeof ASSOCIACOES !== 'undefined' ? ASSOCIACOES[currInst] : null) || getAssociacoesPoliciaPenal(currInst) || [];
  cont.innerHTML = lista.length ? lista.map(a => {
    const url = asUrl(a.site);
    const siteHtml = url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="concurso-link" style="margin-top:0;">${escapeHtml(a.site)}</a>` : escapeHtml(a.site || 'Consultar diretamente');
    return `<div class="direito-item associacao"><span class="direito-nome">${escapeHtml(a.nome)}</span><span class="direito-desc"><strong>Foco:</strong> ${escapeHtml(a.foco || '')}</span><span class="direito-desc"><strong>Atuação atual:</strong> ${escapeHtml(a.acao || '')}</span><span class="direito-desc"><strong>Serviços:</strong> ${escapeHtml(a.servicos || '')}</span><span class="direito-desc"><strong>Mensalidade:</strong> ${escapeHtml(a.mensalidade || 'Consultar')}</span><span class="direito-desc"><strong>Contato:</strong> ${escapeHtml(a.telefone || 'Consultar')} · ${siteHtml}</span></div>`;
  }).join('') : '<div class="direito-item"><span class="direito-nome">Sem entidade cadastrada</span><span class="direito-desc">Consulte canais oficiais da instituição e associações locais.</span></div>';
}

function getRamoComparador(inst) { if (String(inst).startsWith('pp')) return 'Penal'; if (String(inst).startsWith('pc')) return 'Civil'; if (String(inst).startsWith('pm')) return inst === 'pmrs' ? 'Militar / Brigada' : 'Militar'; return 'Carreira'; }
function getOrdemComparador(inst) { const estado = getEstadoDaInstituicao(inst); const e = HEADER_ESTADOS[estado] || {}; return e.pm === inst ? 1 : e.pc === inst ? 2 : e.pp === inst ? 3 : 9; }
function getInstituicoesComparador() {
  return INSTITUICOES_VALIDAS.map(inst => { const estado = getEstadoDaInstituicao(inst); const dadosEstado = HEADER_ESTADOS[estado] || HEADER_ESTADOS.sp; const info = HEADER_INSTITUICOES_INFO[inst] || {}; return { inst, estado, uf:dadosEstado.sigla, estadoNome:dadosEstado.nome, sigla:info.titulo || inst.toUpperCase(), nome:info.desc || inst.toUpperCase(), ramo:getRamoComparador(inst) }; }).sort((a,b) => Object.keys(HEADER_ESTADOS).indexOf(a.estado) - Object.keys(HEADER_ESTADOS).indexOf(b.estado) || getOrdemComparador(a.inst) - getOrdemComparador(b.inst));
}
function getComparadorSelect() { return document.getElementById('comparador-selecao'); }
function getComparadorCheckboxes() { const s = getComparadorSelect(); return s ? Array.from(s.querySelectorAll('input[type="checkbox"]')) : []; }
function toggleComparadorLista() { const lista = getComparadorSelect(); const botao = document.getElementById('comparador-toggle-lista'); if (!lista || !botao) return; const aberta = !lista.classList.contains('aberta'); lista.classList.toggle('aberta', aberta); botao.setAttribute('aria-expanded', aberta ? 'true' : 'false'); }
function setSelecionadasComparador(valores) { const set = new Set((valores || []).filter(Boolean)); getComparadorCheckboxes().forEach(c => c.checked = set.has(c.value)); }
function atualizarResumoSelecaoComparador() { const resumo = document.getElementById('comparador-selecionadas'); const contador = document.getElementById('comparador-contador-selecao'); const selecionadas = getComparadorCheckboxes().filter(c => c.checked).map(c => c.dataset.sigla || c.value.toUpperCase()); if (contador) contador.textContent = `${selecionadas.length} selecionada${selecionadas.length === 1 ? '' : 's'}`; if (resumo) resumo.innerHTML = selecionadas.length ? `<strong>Selecionadas (${selecionadas.length}):</strong> ${escapeHtml(selecionadas.join(', '))}` : 'Nenhuma instituição selecionada.'; }
function comparadorSelecionarEstadoAtual(exibirToast = true) { const estado = getEstadoDaInstituicao(currInst); const e = HEADER_ESTADOS[estado] || HEADER_ESTADOS.sp; setSelecionadasComparador([e.pm, e.pc, e.pp].filter(Boolean)); carregarComparadorCarreiras(); if (exibirToast) mostrarToast(`Comparando carreiras de ${e.nome}.`); }
function comparadorSelecionarTodas() { getComparadorCheckboxes().forEach(c => c.checked = true); carregarComparadorCarreiras(); mostrarToast('Todas as instituições foram selecionadas.'); }
function comparadorLimparSelecao() { getComparadorCheckboxes().forEach(c => c.checked = false); carregarComparadorCarreiras(); }
function inicializarComparadorCarreiras() {
  const selecao = document.getElementById('comparador-selecao'); if (!selecao) return;
  if (!selecao.dataset.renderizado) {
    const insts = getInstituicoesComparador();
    selecao.innerHTML = Object.keys(HEADER_ESTADOS).map(estado => { const e = HEADER_ESTADOS[estado]; const itens = insts.filter(i => i.estado === estado); if (!itens.length) return ''; return `<div class="comparador-check-grupo" role="group" aria-label="${escapeHtml(e.nome)}"><div class="comparador-check-titulo">${escapeHtml(e.nome)}</div>${itens.map(item => `<label class="comparador-check-option"><input type="checkbox" value="${escapeHtml(item.inst)}" data-sigla="${escapeHtml(item.sigla)}" onchange="carregarComparadorCarreiras()"><span><strong>${escapeHtml(item.sigla)}</strong><small>${escapeHtml(item.nome)} · ${escapeHtml(item.uf)} · ${escapeHtml(item.ramo)}</small></span></label>`).join('')}</div>`; }).join('');
    selecao.dataset.renderizado = 'true';
  }
  if (!selecao.querySelector('input[type="checkbox"]:checked')) comparadorSelecionarEstadoAtual(false);
  carregarComparadorCarreiras();
}
function getConcursoComparador(inst) { return (typeof CONCURSOS !== 'undefined' ? CONCURSOS[inst] : null) || getConcursoPoliciaPenal(inst) || { edital:'Concurso de referência não cadastrado', salario:'Consultar edital vigente', vagas:'Consultar edital vigente', inscritos:'Consultar banca', banca:'Consultar edital', materias:'Consultar edital', previsao:'Acompanhar Diário Oficial, órgão e banca.', escolaridade:'Consultar edital', etapas:'Consultar edital', site:REMUNERACAO_FONTES_OFICIAIS[inst]?.url || '#' }; }
function limitarTextoComparador(texto, limite = 220) { texto = String(texto || '').replace(/\s+/g, ' ').trim(); return texto.length > limite ? texto.slice(0, limite - 1).trim() + '…' : texto; }
function getResumoRemuneracaoComparador(inst) { const linhas = gerarRemuneracaoTabelada(inst); const validas = linhas.filter(l => Number(l.remuneracao) > 0); const menor = validas.length ? Math.min(...validas.map(l => Number(l.remuneracao))) : 0; const maior = validas.length ? Math.max(...validas.map(l => Number(l.remuneracao))) : 0; const linhaMenor = validas.find(l => Number(l.remuneracao) === menor) || linhas[0] || {}; const linhaMaior = validas.find(l => Number(l.remuneracao) === maior) || linhas[0] || {}; const fonte = REMUNERACAO_FONTES_OFICIAIS[linhaMenor.fonteKey] || REMUNERACAO_FONTES_OFICIAIS[inst] || {nome:'Fonte oficial da carreira', url:'#'}; return { totalCargos:linhas.length, menor, maior, cargoMenor:linhaMenor.cargo || 'Cargo inicial/de referência', cargoMaior:linhaMaior.cargo || 'Topo de carreira/de referência', adicionais:getAdicionaisRemuneracaoResumo(inst, linhaMenor), fonteNome:fonte.nome, fonteUrl:fonte.url }; }
function getDadosComparador(inst) { const info = HEADER_INSTITUICOES_INFO[inst] || {}; const estado = getEstadoDaInstituicao(inst); const e = HEADER_ESTADOS[estado] || HEADER_ESTADOS.sp; return { inst, sigla:info.titulo || inst.toUpperCase(), nome:info.desc || inst.toUpperCase(), estado:e.nome, uf:e.sigla, ramo:getRamoComparador(inst), concurso:getConcursoComparador(inst), remuneracao:getResumoRemuneracaoComparador(inst) }; }
function getSelecionadasComparador() { return getComparadorCheckboxes().filter(c => c.checked).map(c => c.value).filter(inst => INSTITUICOES_VALIDAS.includes(inst)); }
function linkComparador(url, texto = 'Abrir fonte') { const href = asUrl(url); return href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(texto)}</a>` : '<span>Consultar fonte oficial</span>'; }
function carregarComparadorCarreiras() {
  const tbody = document.getElementById('comparador-tabela'), cards = document.getElementById('comparador-cards'), resumo = document.getElementById('comparador-resumo'), wrap = document.getElementById('comparador-tabela-wrap');
  if (!tbody || !cards || !resumo || !wrap) return;
  atualizarResumoSelecaoComparador();
  const selecionadas = getSelecionadasComparador();
  if (selecionadas.length < 2) { resumo.innerHTML = ''; tbody.innerHTML = ''; cards.innerHTML = '<div class="comparador-vazio">Selecione pelo menos duas instituições para gerar o comparativo de carreiras.</div>'; wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  const dados = selecionadas.map(getDadosComparador);
  const menores = dados.map(d => d.remuneracao.menor).filter(v => v > 0), maiores = dados.map(d => d.remuneracao.maior).filter(v => v > 0);
  resumo.innerHTML = `<div class="comparador-stat"><span>Instituições comparadas</span><strong>${dados.length}</strong></div><div class="comparador-stat"><span>Menor remuneração encontrada</span><strong>${menores.length ? fmt(Math.min(...menores)) : 'A confirmar'}</strong></div><div class="comparador-stat"><span>Maior remuneração encontrada</span><strong>${maiores.length ? fmt(Math.max(...maiores)) : 'A confirmar'}</strong></div><div class="comparador-stat"><span>Destaques</span><strong>${dados.map(d => escapeHtml(d.sigla)).join(' · ')}</strong></div>`;
  tbody.innerHTML = dados.map(d => { const c = d.concurso, r = d.remuneracao; return `<tr><td><strong>${escapeHtml(d.sigla)}</strong><br>${escapeHtml(d.nome)}<br><span class="comparador-pill">${escapeHtml(d.uf)}</span><span class="comparador-pill">${escapeHtml(d.ramo)}</span></td><td><strong>Menor:</strong> ${r.menor ? fmt(r.menor) : 'A confirmar'}<br><small>${escapeHtml(r.cargoMenor)}</small><br><strong>Maior:</strong> ${r.maior ? fmt(r.maior) : 'A confirmar'}<br><small>${escapeHtml(r.cargoMaior)}</small></td><td>${escapeHtml(limitarTextoComparador(r.adicionais, 260))}</td><td><strong>Último edital:</strong> ${escapeHtml(c.edital || 'Edital de referência')}<br><strong>Salário edital:</strong> ${escapeHtml(c.salario || 'Consultar edital')}<br><strong>Próximo concurso / andamento:</strong> ${escapeHtml(limitarTextoComparador(c.previsao, 180))}</td><td><strong>Vagas:</strong> ${escapeHtml(c.vagas || 'Consultar edital')}<br><strong>Inscritos:</strong> ${escapeHtml(c.inscritos || 'Consultar banca')}</td><td><strong>Banca:</strong> ${escapeHtml(c.banca || 'Consultar edital')}<br><strong>Matérias:</strong> ${escapeHtml(limitarTextoComparador(c.materias, 230))}</td><td>${linkComparador(c.site || r.fonteUrl, 'Concurso')}<br>${linkComparador(r.fonteUrl, 'Remuneração')}</td></tr>`; }).join('');
  cards.innerHTML = dados.map(d => { const c = d.concurso, r = d.remuneracao; return `<article class="comparador-card"><h3>${escapeHtml(d.sigla)} — ${escapeHtml(d.uf)}</h3><p><strong>${escapeHtml(d.nome)}</strong> · ${escapeHtml(d.ramo)}</p><ul><li><strong>Faixa cadastrada:</strong> ${r.menor ? fmt(r.menor) : 'A confirmar'} até ${r.maior ? fmt(r.maior) : 'A confirmar'}.</li><li><strong>Referência inferior:</strong> ${escapeHtml(r.cargoMenor)}.</li><li><strong>Edital de referência:</strong> ${escapeHtml(c.edital || 'Consultar edital vigente')}.</li><li><strong>Vagas:</strong> ${escapeHtml(c.vagas || 'Consultar edital')}.</li><li><strong>Banca:</strong> ${escapeHtml(c.banca || 'Consultar edital')}.</li></ul><p><strong>Vantagens/benefícios:</strong> ${escapeHtml(limitarTextoComparador(r.adicionais, 260))}</p><p>${linkComparador(c.site || r.fonteUrl, 'Ver fonte do concurso')} · ${linkComparador(r.fonteUrl, 'Ver fonte remuneratória')}</p></article>`; }).join('');
}

function atualizarContador() { const txt = document.getElementById('contato_mensagem'); const cnt = document.getElementById('char-counter'); if (!txt || !cnt) return; const len = txt.value.length; cnt.textContent = `${len} / 2000 caracteres`; cnt.classList.toggle('over', len > 1900); }

function enviarEmailContato(event) {
  event.preventDefault();
  const nome = document.getElementById('contato_nome')?.value.trim();
  const email = document.getElementById('contato_email')?.value.trim();
  const assunto = document.getElementById('contato_assunto')?.value;
  const msg = document.getElementById('contato_mensagem')?.value.trim();
  if (!nome || !email || !assunto || !msg) { mostrarToast('Preencha todos os campos!', 'error'); return; }
  if (msg.length < 10) { mostrarToast('Mensagem muito curta (mínimo 10 caracteres).', 'error'); return; }
  const corpo = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${msg}\n\n---\nEnviado via Universo Segurança Pública`);
  const sub = encodeURIComponent(`[CONTATO] ${assunto}`);
  window.location.href = `mailto:universosegpub@gmail.com?subject=${sub}&body=${corpo}`;
  setTimeout(() => mostrarToast('E-mail aberto no seu cliente!'), 300);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  popularCargos('pmesp');
  aplicarHeaderInicialPortal();

  ['cargo_dir','situacao_dir','tempo_dir','idade_dir','sexo_dir','ingresso_dir','dependente_dir','renda_dir','local_especial_dir','requisitos_apos_dir'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', analisarDireitos);
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) el.addEventListener('input', analisarDireitos);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('sidebar')?.classList.contains('active')) toggleMenu();
  });

  carregarRemuneracaoTabelada();
  carregarConcursos();
  carregarAcoes();
  carregarAssociacoes();

  const paginasValidas = ['principal','remuneracao','direitos','concursos','comparar','acoes','associacoes','produtos','parceiros'];
  const paginaHash = String(window.location.hash || '').replace('#', '').trim();
  const paginaInicial = paginasValidas.includes(paginaHash) ? paginaHash : 'principal';
  switchPage(paginaInicial, { noScroll: true, silentHash: paginaInicial === 'principal' && !paginaHash });
});
