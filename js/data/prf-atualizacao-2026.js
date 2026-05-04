(function atualizarDadosPublicosPRF2026() {
  const PRF = {
    instituicao: {
      chave: 'prf',
      nome: 'Polícia Rodoviária Federal',
      sigla: 'PRF',
      orgao: 'Departamento de Polícia Rodoviária Federal',
      esfera: 'Federal',
      vinculacao: 'Ministério da Justiça e Segurança Pública',
      natureza: 'Órgão permanente da União, estruturado em carreira, destinado ao patrulhamento ostensivo das rodovias federais.',
      fundamentoConstitucional: 'Constituição Federal, art. 144, § 2º',
      criacao: '24/07/1928 · Decreto nº 18.323/1928',
      abrangencia: 'Brasil · rodovias federais',
      extensaoMalha: '77 mil km de rodovias federais · fonte PRF/2025'
    },
    efetivo: {
      ativa: 13000,
      ativaLabel: '13.000+ · fonte PRF/2025',
      inativosPensionistas: 7000,
      inativosPensionistasLabel: '7.000+ · estimativa Portal da Transparência/PEP',
      mulheres: 1700,
      mulheresLabel: '1.700+ · estimativa por referência pública',
      relacaoLabel: '≈ 1 policial rodoviário federal ativo / 16.417 hab. · estimativa com população IBGE 2022'
    },
    comando: {
      diretorGeral: 'Antônio Fernando Souza Oliveira — Diretor-Geral da PRF',
      fonte: 'Site oficial da PRF · Direção-Geral'
    },
    estrutura: [
      'Direção-Geral',
      'Diretorias e coordenações-gerais nacionais',
      'Corregedoria',
      'Ouvidoria',
      'Superintendências Regionais nos estados e no Distrito Federal',
      'Delegacias e unidades operacionais em rodovias federais'
    ],
    carreira: {
      cargo: 'Policial Rodoviário Federal',
      escolaridade: 'Nível superior',
      classes: 'Terceira Classe, Segunda Classe, Primeira Classe e Classe Especial',
      padroes: 'Padrões internos por classe, com progressão e promoção conforme legislação da carreira',
      ingresso: 'Terceira Classe · Padrão I',
      topo: 'Classe Especial · Padrão III',
      fonte: 'Lei nº 9.654/1998; Decreto nº 8.282/2014; Lei nº 14.875/2024'
    },
    remuneracao: {
      referencia: 'Efeitos financeiros a partir de 01/05/2026',
      piso: 12253.84,
      teto: 23000.00,
      fonte: 'Lei nº 14.875/2024, Anexo XXVII; Tabela de Remuneração dos Servidores Públicos Federais Civis nº 87/2026'
    },
    beneficios: [
      'Auxílio-alimentação federal: R$ 1.000,00/mês · referência Executivo Federal',
      'Assistência à saúde suplementar: valor per capita por faixa de renda e idade',
      'Auxílio pré-escolar: quando devido, conforme regra federal aplicável',
      'Indenização de fronteira: R$ 91,00 por dia de efetivo trabalho em localidade prevista na Lei nº 12.855/2013',
      'Diárias, ajuda de custo, transporte e demais indenizações: conforme missão, deslocamento, lotação e legislação federal'
    ],
    direitosVantagens: [
      'Subsídio mensal por classe e padrão',
      'Progressão e promoção na carreira',
      'Férias, décimo terceiro e licenças legais do regime federal',
      'Curso de formação profissional para ingresso',
      'Aposentadoria e regras previdenciárias conforme regime constitucional e legislação federal aplicável'
    ],
    legislacao: [
      { nome: 'Constituição Federal, art. 144, § 2º', url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm' },
      { nome: 'Decreto nº 18.323/1928', url: 'https://www.planalto.gov.br/ccivil_03/decreto/1910-1929/D18323.htm' },
      { nome: 'Lei nº 9.654/1998 — carreira de Policial Rodoviário Federal', url: 'https://www.planalto.gov.br/ccivil_03/leis/l9654.htm' },
      { nome: 'Decreto nº 8.282/2014 — estrutura da carreira', url: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/decreto/d8282.htm' },
      { nome: 'Decreto nº 11.759/2023 — estrutura regimental do MJSP/PRF', url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11759.htm' },
      { nome: 'Lei nº 12.855/2013 — indenização de fronteira', url: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12855.htm' },
      { nome: 'Lei nº 14.875/2024 — reajuste e tabelas remuneratórias federais', url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14875.htm' }
    ],
    concursos: {
      edital: 'PRF 2021 — Policial Rodoviário Federal',
      salario: 'R$ 12.253,84 · inicial 2026 por tabela federal',
      vagas: '1.500 vagas',
      cotas: 'Reserva legal conforme edital e legislação federal',
      idade: 'Sem idade máxima específica; exige requisitos legais do cargo',
      escolaridade: 'Nível superior em qualquer área e CNH categoria B ou superior',
      banca: 'Cebraspe',
      inscritos: '300 mil+ · estimativa pública do concurso 2021',
      materias: 'Língua Portuguesa, Raciocínio Lógico, Informática, Física, Ética, Geopolítica, Língua Estrangeira, legislação de trânsito e conhecimentos específicos conforme edital',
      etapas: 'Prova objetiva, prova discursiva, TAF, avaliação psicológica, saúde, títulos, investigação social e curso de formação',
      cfsd: 'Curso de Formação Policial na Universidade Corporativa da PRF',
      estagio: 'Estágio probatório conforme regime federal',
      validade: 'Concurso PRF 2021 prorrogado até junho/2026 · referência pública PRF/2025',
      previsao: 'Novo concurso depende de autorização federal; dados de vagas futuras não estimados automaticamente',
      site: 'https://www.gov.br/prf/pt-br/acesso-a-informacao/servidores/carreira-prf'
    },
    links: [
      { nome: 'Site oficial da PRF', url: 'https://www.gov.br/prf/pt-br' },
      { nome: 'Carreira PRF', url: 'https://www.gov.br/prf/pt-br/acesso-a-informacao/servidores/carreira-prf' },
      { nome: 'Portal da Transparência — DPRF', url: 'https://portaldatransparencia.gov.br/orgaos/30107-departamento-de-policia-rodoviaria-federal' },
      { nome: 'Legislação federal — Planalto', url: 'https://www.planalto.gov.br/' }
    ]
  };

  const linhasFallback = [
    ['Classe Especial — Padrão III', 23000.00, 'Teto da tabela federal 2026, efeitos a partir de 01/05/2026.'],
    ['Classe Especial — Padrão II', 22367.84, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Classe Especial — Padrão I', 21735.72, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Primeira Classe — Padrão VI', 21103.59, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Primeira Classe — Padrão V', 20471.47, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Primeira Classe — Padrão IV', 19839.34, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Primeira Classe — Padrão III', 19207.22, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Primeira Classe — Padrão II', 18575.09, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Primeira Classe — Padrão I', 17942.97, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Segunda Classe — Padrão VI', 17310.84, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Segunda Classe — Padrão V', 16678.72, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Segunda Classe — Padrão IV', 16046.59, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Segunda Classe — Padrão III', 15414.47, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Segunda Classe — Padrão II', 14782.34, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Segunda Classe — Padrão I', 14150.22, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Terceira Classe — Padrão III', 13518.09, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Terceira Classe — Padrão II', 12885.97, 'Estimativa de referência entre o piso e o teto da tabela 2026.'],
    ['Terceira Classe — Padrão I', 12253.84, 'Piso de ingresso da tabela federal 2026, efeitos a partir de 01/05/2026.']
  ].map(([cargo, valor, criterio]) => ({
    id: cargo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    cargo,
    nome: cargo,
    text: cargo,
    val: cargo,
    remuneracao: valor,
    beneficios: 0,
    total: valor,
    criterio: `${criterio} Fonte: ${PRF.remuneracao.fonte}.`,
    benefDesc: PRF.beneficios.join(' '),
    fonteKey: 'prf',
    badge: /Estimativa/i.test(criterio) ? 'Estimativa identificada' : 'Lei 14.875/2024',
    valorPendente: false
  }));

  function fmtBRL(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function escapeHtml(valor) {
    return String(valor ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function mergeFonteRemuneracao() {
    if (typeof REMUNERACAO_FONTES_OFICIAIS === 'undefined') return;
    Object.assign(REMUNERACAO_FONTES_OFICIAIS, {
      prf: {
        nome: 'Lei nº 14.875/2024, Anexo XXVII; Tabela de Remuneração dos Servidores Públicos Federais Civis nº 87/2026; PRF — carreira',
        url: 'https://www.gov.br/prf/pt-br/acesso-a-informacao/servidores/carreira-prf'
      },
      prf_lei_14875_2024: {
        nome: 'Lei nº 14.875/2024 — tabela de subsídio PRF com efeitos financeiros em 2026',
        url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14875.htm'
      },
      prf_transparencia: {
        nome: 'Portal da Transparência — Departamento de Polícia Rodoviária Federal',
        url: 'https://portaldatransparencia.gov.br/orgaos/30107-departamento-de-policia-rodoviaria-federal'
      }
    });
  }

  function enriquecerLinhaRemuneracao(linha) {
    if (!linha) return linha;
    const cargo = linha.cargo || linha.nome || linha.text || linha.label || linha.id || 'Policial Rodoviário Federal';
    linha.cargo = cargo;
    linha.nome = linha.nome || cargo;
    linha.text = linha.text || cargo;
    linha.val = linha.val || cargo;
    linha.id = linha.id || String(cargo).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    linha.beneficios = Number(linha.beneficios || 0);
    linha.total = Number(linha.total || linha.remuneracao || 0);
    linha.criterio = linha.criterio || `Subsídio bruto mensal da carreira PRF. Referência: ${PRF.remuneracao.referencia}. Fonte: ${PRF.remuneracao.fonte}.`;
    linha.benefDesc = linha.benefDesc || PRF.beneficios.join(' ');
    linha.fonteKey = linha.fonteKey || 'prf';
    linha.badge = linha.badge || 'Federal 2026';
    return linha;
  }

  function mergeRemuneracao() {
    if (typeof REMUNERACAO_SP_OFICIAL === 'undefined') return;
    const atual = Array.isArray(REMUNERACAO_SP_OFICIAL.prf) ? REMUNERACAO_SP_OFICIAL.prf : [];
    const validas = atual.filter((linha) => Number(linha?.remuneracao || 0) > 0);
    if (validas.length >= 2) {
      REMUNERACAO_SP_OFICIAL.prf = atual.map(enriquecerLinhaRemuneracao);
    } else {
      REMUNERACAO_SP_OFICIAL.prf = linhasFallback.map(enriquecerLinhaRemuneracao);
    }
  }

  function mergeCabecalho() {
    if (typeof HEADER_INSTITUICOES_INFO !== 'undefined') {
      HEADER_INSTITUICOES_INFO.prf = { titulo: 'PRF', desc: 'Polícia Rodoviária Federal' };
    }
    if (typeof HEADER_INSTITUICOES_RESUMO !== 'undefined') {
      HEADER_INSTITUICOES_RESUMO.prf = {
        nome: PRF.instituicao.nome,
        sigla: PRF.instituicao.sigla,
        estado: 'União',
        estadoSigla: 'BR',
        tipo: 'Polícia Rodoviária Federal',
        criacao: PRF.instituicao.criacao,
        ativa: PRF.efetivo.ativa,
        ativaLabel: PRF.efetivo.ativaLabel,
        reserva: PRF.efetivo.inativosPensionistas,
        reservaLabel: PRF.efetivo.inativosPensionistasLabel,
        femininas: PRF.efetivo.mulheres,
        femininasLabel: PRF.efetivo.mulheresLabel,
        populacao: 213421037,
        populacaoTitulo: 'População do Brasil · IBGE 2022',
        relacaoLabel: PRF.efetivo.relacaoLabel,
        relacaoTitulo: 'Relação ativa/população',
        governador: 'Governo Federal · Ministério da Justiça e Segurança Pública',
        comando: PRF.comando.diretorGeral,
        estrutura: PRF.estrutura.join('; '),
        sede: 'Sede nacional em Brasília/DF',
        fonte: 'PRF; Portal da Transparência; Planalto; MGI/Servidor',
        atualizado: 'Referência pública: PRF/2025 e tabela federal com efeitos em 01/05/2026'
      };
    }
  }

  function mergeConcursos() {
    if (typeof CONCURSOS === 'undefined') return;
    CONCURSOS.prf = Object.assign({}, PRF.concursos);
  }

  function mergeListasComplementares() {
    const direitos = PRF.direitosVantagens.map((nome) => ({ nome, desc: 'Fonte: legislação federal aplicável à carreira PRF.', fonte: 'Planalto/PRF' }));
    const legislacao = PRF.legislacao.map((item) => ({ titulo: item.nome, desc: item.nome, base: item.nome, fonte: item.nome, fonteUrl: item.url }));
    if (typeof DIREITOS !== 'undefined') DIREITOS.prf = direitos;
    if (typeof DIREITOS_VANTAGENS !== 'undefined') DIREITOS_VANTAGENS.prf = direitos;
    if (typeof PODERES_DEVERES !== 'undefined') PODERES_DEVERES.prf = legislacao;
    if (typeof LEGISLACAO !== 'undefined') LEGISLACAO.prf = legislacao;
    if (typeof ACOES_JUDICIAIS !== 'undefined') {
      ACOES_JUDICIAIS.prf = [{
        titulo: 'Demandas funcionais da carreira PRF',
        status: 'Tema dependente de caso concreto',
        ano: 'Referência permanente',
        tipo: 'informativo',
        desc: 'Questões sobre progressão, promoção, adicionais, indenizações, aposentadoria e remoção dependem da legislação federal e da situação funcional individual.',
        base: 'Lei nº 9.654/1998; Lei nº 12.855/2013; legislação federal de pessoal',
        fonte: 'Planalto; PRF; Portal da Transparência',
        fonteUrl: 'https://www.gov.br/prf/pt-br/acesso-a-informacao/servidores/carreira-prf'
      }];
    }
  }

  function getInstSelecionada() {
    if (typeof currInst !== 'undefined' && currInst) return String(currInst).toLowerCase();
    return String(document.getElementById('instituicao_header')?.value || document.getElementById('instituicao')?.value || '').toLowerCase();
  }

  function atualizarCabecalhoVisivel() {
    if (getInstSelecionada() !== 'prf') return;
    const setText = (id, texto) => {
      const el = document.getElementById(id);
      if (el) el.textContent = texto;
    };
    setText('header-active-sigla', 'PRF');
    setText('header-active-name', PRF.instituicao.nome);
    setText('header-desc', `${PRF.instituicao.vinculacao} · ${PRF.instituicao.abrangencia}`);
    setText('header-resumo-natureza', PRF.instituicao.natureza);
    setText('header-resumo-uf', 'Brasil');
    setText('header-resumo-criacao', PRF.instituicao.criacao);
    setText('header-resumo-ativa', PRF.efetivo.ativaLabel);
    setText('header-resumo-reserva', PRF.efetivo.inativosPensionistasLabel);
    setText('header-resumo-total', PRF.efetivo.mulheresLabel);
    setText('header-resumo-populacao', '213.421.037 · IBGE 2022');
    setText('header-resumo-relacao', PRF.efetivo.relacaoLabel);
    setText('header-resumo-governador', PRF.instituicao.vinculacao);
    setText('header-resumo-comando', PRF.comando.diretorGeral);
    setText('header-resumo-dados-atualizados', 'Fontes: PRF/2025 · Portal da Transparência · Lei 14.875/2024');
  }

  function painelHtml() {
    const links = PRF.links.map((item) => `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.nome)}</a>`).join(' · ');
    const leis = PRF.legislacao.map((item) => `<li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.nome)}</a></li>`).join('');
    return `
      <section class="prf-dados-publicos-card" aria-label="Dados públicos da PRF">
        <h2>PRF — dados públicos de referência</h2>
        <div class="prf-dados-publicos-grid">
          <div><span>Natureza</span><strong>${escapeHtml(PRF.instituicao.natureza)}</strong></div>
          <div><span>Efetivo ativo</span><strong>${escapeHtml(PRF.efetivo.ativaLabel)}</strong></div>
          <div><span>Comando</span><strong>${escapeHtml(PRF.comando.diretorGeral)}</strong></div>
          <div><span>Carreira</span><strong>${escapeHtml(PRF.carreira.cargo)} · ${escapeHtml(PRF.carreira.classes)}</strong></div>
          <div><span>Remuneração 2026</span><strong>${fmtBRL(PRF.remuneracao.piso)} a ${fmtBRL(PRF.remuneracao.teto)} · ${escapeHtml(PRF.remuneracao.referencia)}</strong></div>
          <div><span>Benefícios</span><strong>${escapeHtml(PRF.beneficios.join(' · '))}</strong></div>
          <div><span>Estrutura</span><strong>${escapeHtml(PRF.estrutura.join(' · '))}</strong></div>
          <div><span>Concurso</span><strong>${escapeHtml(PRF.concursos.edital)} · ${escapeHtml(PRF.concursos.vagas)} · ${escapeHtml(PRF.concursos.banca)}</strong></div>
        </div>
        <details>
          <summary>Legislação e links oficiais</summary>
          <ul>${leis}</ul>
          <p>${links}</p>
        </details>
      </section>
    `;
  }

  function aplicarEstiloPainel() {
    if (document.getElementById('prf-dados-publicos-style')) return;
    const style = document.createElement('style');
    style.id = 'prf-dados-publicos-style';
    style.textContent = `
      .prf-dados-publicos-card{margin:18px auto;padding:18px;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:rgba(12,18,28,.72);box-shadow:0 18px 50px rgba(0,0,0,.18);max-width:1180px;color:inherit}.prf-dados-publicos-card h2{margin:0 0 14px;font-size:1.35rem}.prf-dados-publicos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.prf-dados-publicos-grid div{padding:12px;border-radius:14px;background:rgba(255,255,255,.07)}.prf-dados-publicos-grid span{display:block;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;opacity:.72;margin-bottom:6px}.prf-dados-publicos-grid strong{font-size:.95rem;line-height:1.35}.prf-dados-publicos-card details{margin-top:12px}.prf-dados-publicos-card a{font-weight:700}.prf-dados-publicos-card[hidden]{display:none!important}
    `;
    document.head.appendChild(style);
  }

  function renderizarPainel() {
    aplicarEstiloPainel();
    const inst = getInstSelecionada();
    let painel = document.querySelector('.prf-dados-publicos-card');
    if (inst !== 'prf') {
      if (painel) painel.hidden = true;
      return;
    }
    if (!painel) {
      const destino = document.querySelector('main, .page-content, .content, #conteudo, body');
      const wrapper = document.createElement('div');
      wrapper.innerHTML = painelHtml();
      painel = wrapper.firstElementChild;
      if (destino && destino !== document.body) destino.prepend(painel);
      else document.body.insertBefore(painel, document.body.firstChild);
    }
    painel.hidden = false;
  }

  function aplicarTudo() {
    mergeFonteRemuneracao();
    mergeRemuneracao();
    mergeCabecalho();
    mergeConcursos();
    mergeListasComplementares();
    atualizarCabecalhoVisivel();
    renderizarPainel();
  }

  window.UNISEG_PRF_2026 = PRF;
  aplicarTudo();
  document.addEventListener('change', (event) => {
    if (event.target && /^(instituicao|instituicao_header|comparador-instituicao)$/.test(event.target.id || '')) {
      window.setTimeout(aplicarTudo, 30);
      window.setTimeout(aplicarTudo, 250);
    }
  }, true);
  document.addEventListener('DOMContentLoaded', aplicarTudo, { once: true });
  window.setTimeout(aplicarTudo, 250);
  window.setTimeout(aplicarTudo, 900);
  window.setTimeout(aplicarTudo, 1800);
}());
