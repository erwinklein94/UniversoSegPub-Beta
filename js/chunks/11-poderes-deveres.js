/* ============================================================
   PODERES E DEVERES — aba independente da instituição principal
   ============================================================ */
const PODERES_DEVERES_DADOS_EM_BREVE = "Dados em breve";
const PODERES_DEVERES_BASE = {
  "pf": {
    "rotulo": "Polícia Federal",
    "categoria": "Federal",
    "abrangencia": "Nacional, com foco em infrações penais de competência federal, polícia judiciária da União, polícia marítima, aeroportuária e de fronteiras, repressão ao tráfico ilícito e funções administrativas federais atribuídas em lei.",
    "deveres": [
      "Apurar infrações penais contra a ordem política e social ou em detrimento de bens, serviços e interesses da União, autarquias e empresas públicas federais.",
      "Prevenir e reprimir tráfico ilícito de entorpecentes, contrabando e descaminho, sem prejuízo da atuação fazendária e de outros órgãos nas respectivas áreas.",
      "Exercer as funções de polícia judiciária da União e atuar em polícia marítima, aeroportuária e de fronteiras.",
      "Atuar em investigações de repercussão interestadual ou internacional quando presentes os requisitos legais.",
      "Fiscalizar atividades administrativas federais atribuídas à PF, como controle de segurança privada, armas e passaportes, conforme legislação específica."
    ],
    "poderes": [
      "Investigação criminal federal, instauração e condução de inquéritos policiais federais e representação por medidas cautelares quando cabíveis.",
      "Atuação ostensiva especializada em áreas federais específicas, inclusive fronteiras, aeroportos e portos, dentro da competência constitucional e legal.",
      "Fiscalização administrativa e poder de polícia em matérias federais atribuídas por lei.",
      "Cooperação com órgãos nacionais e internacionais nos limites legais e por atos formais de cooperação."
    ],
    "limites": [
      "Não substitui, de forma geral, a polícia judiciária estadual em crimes comuns sem competência federal ou sem hipótese legal de atuação federal.",
      "Atos investigativos invasivos dependem de controle judicial quando a Constituição ou a lei exigirem autorização.",
      "A competência federal deve ser demonstrada por matéria, sujeito, bem jurídico, repercussão ou previsão legal."
    ],
    "leis": [
      {
        "nome": "Constituição Federal, art. 144, § 1º",
        "resumo": "Define a Polícia Federal como órgão permanente, organizado e mantido pela União, com funções de polícia judiciária da União e atribuições federais próprias.",
        "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
      },
      {
        "nome": "Lei nº 9.266/1996",
        "resumo": "Reorganiza a carreira policial federal e disciplina aspectos estruturais dos cargos policiais federais.",
        "url": "https://www.planalto.gov.br/ccivil_03/LEIS/l9266.htm"
      },
      {
        "nome": "Lei nº 10.446/2002",
        "resumo": "Autoriza atuação da Polícia Federal em infrações de repercussão interestadual ou internacional que exijam repressão uniforme, nos casos definidos em lei.",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/2002/l10446.htm"
      },
      {
        "nome": "Lei nº 7.102/1983",
        "resumo": "Base legal relevante para fiscalização federal da segurança privada, quando aplicável.",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/l7102.htm"
      }
    ],
    "entendimentos": [
      {
        "titulo": "Competência federal deve respeitar o art. 144 da Constituição",
        "data": "Base constitucional permanente",
        "status": "Atualizado por conferência oficial",
        "resumo": "A atuação da PF deve ser lida a partir da função de polícia judiciária da União e das competências expressas no art. 144.",
        "fonte": "STF — Constituição anotada, art. 144",
        "url": "https://portal.stf.jus.br/constituicao-supremo/artigo.asp?abrirArtigo=144&abrirBase=CF"
      }
    ],
    "local": "Não se aplica; instituição federal.",
    "atualizacao": "Revisado em 02/05/2026"
  },
  "prf": {
    "rotulo": "Polícia Rodoviária Federal",
    "categoria": "Federal",
    "abrangencia": "Nacional, nas rodovias e estradas federais, com patrulhamento ostensivo, segurança viária, fiscalização de trânsito e atuação operacional vinculada à malha rodoviária federal.",
    "deveres": [
      "Realizar patrulhamento ostensivo das rodovias federais.",
      "Cumprir e fazer cumprir a legislação de trânsito no âmbito das rodovias e estradas federais.",
      "Executar fiscalização, prevenção e repressão de ilícitos relacionados ao ambiente rodoviário federal.",
      "Prestar apoio a operações integradas quando houver base legal, pertinência operacional e ato competente."
    ],
    "poderes": [
      "Fiscalização de trânsito, autuação, retenção/remoção quando prevista em lei e demais atos de autoridade de trânsito nas rodovias federais.",
      "Abordagem, prisão em flagrante e atuação ostensiva em ocorrências encontradas no patrulhamento rodoviário federal.",
      "Lavratura de termo circunstanciado em hipóteses admitidas pelo STF e por norma aplicável.",
      "Cooperação operacional com outros órgãos de segurança pública sem perder o limite funcional de sua competência constitucional."
    ],
    "limites": [
      "A competência constitucional central da PRF é o patrulhamento ostensivo das rodovias federais; investigação criminal ampla não é sua atribuição ordinária.",
      "A atuação fora do eixo rodoviário federal exige base normativa, pertinência, operação integrada ou hipótese legal específica.",
      "Medidas invasivas dependem dos mesmos controles legais e judiciais exigidos para qualquer órgão público."
    ],
    "leis": [
      {
        "nome": "Constituição Federal, art. 144, § 2º",
        "resumo": "Define a PRF como órgão permanente, organizado e mantido pela União, destinado ao patrulhamento ostensivo das rodovias federais.",
        "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
      },
      {
        "nome": "Decreto nº 1.655/1995",
        "resumo": "Define competências da Polícia Rodoviária Federal.",
        "url": "https://www.planalto.gov.br/ccivil_03/decreto/d1655.htm"
      },
      {
        "nome": "Lei nº 9.503/1997 — Código de Trânsito Brasileiro",
        "resumo": "Atribui competências de fiscalização e aplicação da legislação de trânsito à PRF no âmbito das rodovias e estradas federais.",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm"
      },
      {
        "nome": "Lei nº 9.654/1998",
        "resumo": "Cria e estrutura a carreira de Policial Rodoviário Federal.",
        "url": "https://www.planalto.gov.br/ccivil_03/Leis/l9654.htm"
      }
    ],
    "entendimentos": [
      {
        "titulo": "PRF pode lavrar termo circunstanciado de ocorrência",
        "data": "STF, 2023",
        "status": "Entendimento oficial localizado",
        "resumo": "O STF decidiu que a lavratura de TCO para infrações de menor potencial ofensivo não é atribuição exclusiva da polícia judiciária, admitindo a atuação da PRF nas hipóteses legais.",
        "fonte": "STF — notícia institucional sobre TCO pela PRF",
        "url": "https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=503028&ori=1"
      }
    ],
    "local": "Não se aplica; instituição federal.",
    "atualizacao": "Revisado em 02/05/2026"
  },
  "pm": {
    "rotulo": "Polícia Militar",
    "categoria": "Estadual/Distrital",
    "abrangencia": "Unidade federativa correspondente, com polícia ostensiva e preservação da ordem pública, nos limites da Constituição Federal, da Lei Orgânica Nacional e da legislação estadual ou distrital.",
    "deveres": [
      "Realizar policiamento ostensivo preventivo e repressivo imediato para preservação da ordem pública.",
      "Atender ocorrências emergenciais, proteger pessoas e patrimônio e agir diante de flagrante delito.",
      "Executar policiamento de trânsito urbano/rodoviário estadual quando previsto em lei, convênio ou estrutura local.",
      "Cumprir ordens legais, preservar direitos fundamentais e atuar com uso progressivo, proporcional e necessário da força."
    ],
    "poderes": [
      "Abordagem policial quando houver fundada suspeita ou contexto operacional legítimo.",
      "Prisão em flagrante e condução à autoridade competente.",
      "Lavratura de TCO em unidades federativas e hipóteses admitidas por norma local e entendimento do STF.",
      "Emprego ostensivo fardado, operações de preservação da ordem pública e apoio a outras autoridades nos limites legais."
    ],
    "limites": [
      "Não exerce, como regra, polícia judiciária ou investigação criminal típica da Polícia Civil, salvo atos de polícia militar judiciária e hipóteses legalmente autorizadas.",
      "A busca pessoal exige fundada suspeita e respeito aos direitos fundamentais.",
      "Atos administrativos locais dependem da lei estadual/distrital e de regulamentos internos."
    ],
    "leis": [
      {
        "nome": "Constituição Federal, art. 144, § 5º",
        "resumo": "Atribui às Polícias Militares a polícia ostensiva e a preservação da ordem pública.",
        "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
      },
      {
        "nome": "Lei nº 14.751/2023",
        "resumo": "Institui a Lei Orgânica Nacional das Polícias Militares e dos Corpos de Bombeiros Militares dos Estados, do Distrito Federal e dos Territórios.",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14751.htm"
      },
      {
        "nome": "Decreto-Lei nº 667/1969",
        "resumo": "Norma histórica de reorganização das Polícias Militares e Corpos de Bombeiros Militares, naquilo que permaneça compatível com a legislação posterior.",
        "url": "https://www.planalto.gov.br/ccivil_03/decreto-lei/del0667.htm"
      },
      {
        "nome": "Lei estadual/distrital específica",
        "resumo": "Dados em breve",
        "url": ""
      }
    ],
    "entendimentos": [
      {
        "titulo": "Possibilidade de lavratura de TCO por Polícia Militar em hipóteses admitidas",
        "data": "STF, 2022",
        "status": "Entendimento oficial localizado",
        "resumo": "O STF manteve a possibilidade de PM lavrar termo circunstanciado, distinguindo TCO de inquérito policial. A aplicação depende da norma local e do caso concreto.",
        "fonte": "STF — PM-MG e termo circunstanciado",
        "url": "https://noticias.stf.jus.br/postsnoticias/supremo-mantem-possibilidade-de-pm-mg-lavrar-termo-circunstanciado/"
      },
      {
        "titulo": "Leitura constitucional do art. 144",
        "data": "Base permanente",
        "status": "Fonte oficial de conferência",
        "resumo": "A atribuição central da PM permanece vinculada à polícia ostensiva e preservação da ordem pública.",
        "fonte": "STF — Constituição anotada, art. 144",
        "url": "https://portal.stf.jus.br/constituicao-supremo/artigo.asp?abrirArtigo=144&abrirBase=CF"
      }
    ],
    "local": "Dados em breve",
    "atualizacao": "Revisado em 02/05/2026"
  },
  "bm": {
    "rotulo": "Corpo de Bombeiros Militar",
    "categoria": "Estadual/Distrital",
    "abrangencia": "Unidade federativa correspondente, com execução de defesa civil, prevenção e combate a incêndios, busca e salvamento, atendimento de emergências e fiscalização técnica quando prevista na legislação local.",
    "deveres": [
      "Executar atividades de defesa civil.",
      "Prevenir e combater incêndios, realizar busca, salvamento e atendimento a emergências.",
      "Fiscalizar segurança contra incêndio e pânico quando a lei estadual/distrital atribuir esse poder ao Corpo de Bombeiros Militar.",
      "Atuar em desastres, calamidades, emergências ambientais e ações de proteção da vida."
    ],
    "poderes": [
      "Vistoria, análise técnica, emissão de auto/certificado/licença de segurança contra incêndio quando previsto em norma local.",
      "Interdição, exigência de adequação ou medida preventiva nos limites da lei estadual/distrital e do devido processo administrativo.",
      "Atuação operacional de emergência com prioridade de proteção à vida e redução de danos."
    ],
    "limites": [
      "O poder de fiscalização técnica depende de lei e regulamento local; não deve ser presumido sem base normativa.",
      "A atuação dos bombeiros voluntários/privados não pode substituir competências públicas reservadas quando houver invasão da competência constitucional.",
      "Atos restritivos devem observar legalidade, motivação, proporcionalidade e contraditório quando cabível."
    ],
    "leis": [
      {
        "nome": "Constituição Federal, art. 144, § 5º",
        "resumo": "Atribui aos Corpos de Bombeiros Militares, além das atribuições definidas em lei, a execução de atividades de defesa civil.",
        "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
      },
      {
        "nome": "Lei nº 14.751/2023",
        "resumo": "Institui a Lei Orgânica Nacional das Polícias Militares e dos Corpos de Bombeiros Militares.",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14751.htm"
      },
      {
        "nome": "Lei estadual/distrital de segurança contra incêndio e pânico",
        "resumo": "Dados em breve",
        "url": ""
      }
    ],
    "entendimentos": [
      {
        "titulo": "Competência pública dos bombeiros militares e limites a estruturas voluntárias/privadas",
        "data": "STF, 2025",
        "status": "Entendimento oficial localizado",
        "resumo": "O STF analisou normas sobre atribuições de bombeiros voluntários e reforçou a necessidade de respeito às competências constitucionais e legais dos Corpos de Bombeiros Militares.",
        "fonte": "STF — Informativo 1171",
        "url": "https://www.stf.jus.br/arquivo/informativo/documento/informativo1171.htm"
      },
      {
        "titulo": "Normas gerais de PM/CBM são matéria de competência da União",
        "data": "STF, base constitucional",
        "status": "Fonte oficial de conferência",
        "resumo": "A Constituição atribui à União competência para normas gerais de organização, efetivos, material bélico, garantias, convocação e mobilização das polícias militares e bombeiros militares.",
        "fonte": "STF — Constituição anotada, art. 144",
        "url": "https://portal.stf.jus.br/constituicao-supremo/artigo.asp?abrirArtigo=144&abrirBase=CF"
      }
    ],
    "local": "Dados em breve",
    "atualizacao": "Revisado em 02/05/2026"
  },
  "pc": {
    "rotulo": "Polícia Civil",
    "categoria": "Estadual/Distrital",
    "abrangencia": "Unidade federativa correspondente, com funções de polícia judiciária estadual e apuração de infrações penais, exceto as militares, nos termos da Constituição e da Lei Orgânica Nacional.",
    "deveres": [
      "Apurar infrações penais de competência estadual, exceto as militares.",
      "Exercer funções de polícia judiciária, formalizando inquéritos, termos, procedimentos e representações cabíveis.",
      "Coletar provas, cumprir mandados e realizar diligências investigativas com respeito à legalidade e ao controle judicial quando exigido.",
      "Atender vítimas, registrar ocorrências e articular perícias, inteligência e unidades especializadas."
    ],
    "poderes": [
      "Instauração e condução de inquérito policial e outros procedimentos investigativos previstos em lei.",
      "Representação por prisão cautelar, busca e apreensão, quebras de sigilo e demais medidas sujeitas a controle judicial.",
      "Cumprimento de mandados judiciais, prisão em flagrante e atos de polícia judiciária.",
      "Coordenação de investigação criminal estadual em conjunto com perícia oficial e Ministério Público nos limites constitucionais."
    ],
    "limites": [
      "Não apura crimes militares, que seguem rito e atribuições próprias.",
      "Medidas invasivas dependem de autorização judicial quando exigida.",
      "A investigação policial não substitui a titularidade da ação penal pública pelo Ministério Público."
    ],
    "leis": [
      {
        "nome": "Constituição Federal, art. 144, § 4º",
        "resumo": "Atribui às Polícias Civis funções de polícia judiciária e apuração de infrações penais, exceto as militares.",
        "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
      },
      {
        "nome": "Lei nº 14.735/2023",
        "resumo": "Institui a Lei Orgânica Nacional das Polícias Civis e dispõe sobre normas gerais de funcionamento.",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/L14735.htm"
      },
      {
        "nome": "Código de Processo Penal",
        "resumo": "Base processual geral para investigação criminal, inquérito policial, prisão em flagrante e medidas relacionadas.",
        "url": "https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689.htm"
      },
      {
        "nome": "Lei estadual/distrital específica",
        "resumo": "Dados em breve",
        "url": ""
      }
    ],
    "entendimentos": [
      {
        "titulo": "Função constitucional de polícia judiciária e apuração de infrações penais",
        "data": "STF, Informativo 1160, 2024",
        "status": "Entendimento oficial localizado",
        "resumo": "O STF reafirmou que o texto constitucional atribui às Polícias Civis as funções de polícia judiciária e apuração de infrações penais, exceto as militares.",
        "fonte": "STF — Informativo 1160",
        "url": "https://www.stf.jus.br/arquivo/informativo/documento/informativo1160.htm"
      }
    ],
    "local": "Dados em breve",
    "atualizacao": "Revisado em 02/05/2026"
  },
  "pp": {
    "rotulo": "Polícia Penal",
    "categoria": "Federal/Estadual/Distrital, conforme o ente",
    "abrangencia": "Sistema prisional do respectivo ente federativo, com segurança dos estabelecimentos penais e atividades vinculadas à execução penal, escolta, custódia e proteção da ordem prisional conforme lei local.",
    "deveres": [
      "Garantir a segurança dos estabelecimentos penais.",
      "Realizar custódia, vigilância, escolta e movimentação de pessoas privadas de liberdade conforme lei e regulamento.",
      "Preservar a integridade física de presos, servidores, visitantes e terceiros no ambiente prisional.",
      "Apoiar a execução penal nos limites da Lei de Execução Penal e da legislação do ente federativo."
    ],
    "poderes": [
      "Controle de acesso, revista, vigilância interna/externa e procedimentos de segurança penitenciária nos limites legais.",
      "Uso legal, necessário e proporcional da força em situações de risco, fuga, motim ou proteção de vidas.",
      "Escolta e recaptura quando previstas nas normas locais e atos administrativos.",
      "Atuação integrada com órgãos de segurança pública em ocorrências relacionadas ao sistema prisional."
    ],
    "limites": [
      "A Polícia Penal não substitui, como regra, Polícia Civil/PF na investigação criminal geral nem Polícia Militar na polícia ostensiva geral.",
      "A extensão de porte, escolta, atuação externa e grupos especializados depende de lei e regulamento do ente federativo.",
      "Dados em breve"
    ],
    "leis": [
      {
        "nome": "Emenda Constitucional nº 104/2019",
        "resumo": "Criou as polícias penais federal, estaduais e distrital e alterou o art. 144 da Constituição.",
        "url": "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc104.htm"
      },
      {
        "nome": "Constituição Federal, art. 144",
        "resumo": "Inclui a Polícia Penal no sistema de segurança pública, com vinculação à segurança dos estabelecimentos penais.",
        "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
      },
      {
        "nome": "Lei nº 7.210/1984 — Lei de Execução Penal",
        "resumo": "Regula a execução penal e serve de base para rotinas, deveres e direitos no sistema prisional.",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/l7210.htm"
      },
      {
        "nome": "Lei orgânica nacional específica da Polícia Penal",
        "resumo": "Dados em breve",
        "url": ""
      },
      {
        "nome": "Lei estadual/distrital/federal específica da carreira",
        "resumo": "Dados em breve",
        "url": ""
      }
    ],
    "entendimentos": [
      {
        "titulo": "Implementação da Polícia Penal e segurança pública prisional",
        "data": "STF, 2026",
        "status": "Entendimento oficial localizado",
        "resumo": "O STF registrou providências concretas de implementação da Polícia Penal e tratou o tema dentro da arquitetura constitucional da segurança pública e do sistema prisional.",
        "fonte": "STF — Informativo 1208",
        "url": "https://www.stf.jus.br/arquivo/informativo/documento/informativo1208.htm"
      }
    ],
    "local": "Dados em breve",
    "atualizacao": "Revisado em 02/05/2026"
  },
  "gm": {
    "rotulo": "Guarda Municipal",
    "categoria": "Municipal",
    "abrangencia": "Município que tenha criado guarda municipal por lei local, com proteção de bens, serviços e instalações municipais e ações de segurança urbana, preventiva, comunitária e de cooperação, nos limites da Constituição, do Estatuto Geral das Guardas Municipais e da lei municipal.",
    "deveres": [
      "Proteger bens, serviços, logradouros e instalações municipais.",
      "Atuar de forma preventiva, comunitária e integrada para proteção da população no espaço urbano municipal.",
      "Cooperar com órgãos de segurança pública da União, dos Estados e do Distrito Federal quando houver necessidade e formalização adequada.",
      "Apoiar proteção escolar, defesa civil municipal, ordenamento urbano e atendimento a ocorrências locais conforme lei municipal."
    ],
    "poderes": [
      "Policiamento ostensivo e comunitário no âmbito municipal, conforme entendimento do STF e sem poder de investigação criminal.",
      "Abordagem e atuação preventiva quando houver situação concreta, legalidade e respeito a direitos fundamentais.",
      "Prisão em flagrante, como qualquer do povo e agente público diante de flagrante delito, com encaminhamento à autoridade competente.",
      "Poder de polícia administrativa municipal quando a lei local atribuir fiscalização específica."
    ],
    "limites": [
      "Não possui poder de investigação criminal típico de Polícia Civil ou Polícia Federal.",
      "A atuação deve respeitar a competência municipal e não pode substituir as polícias estaduais/federais.",
      "Criação, porte, corregedoria, ouvidoria, formação e atribuições dependem da Lei nº 13.022/2014 e da lei municipal."
    ],
    "leis": [
      {
        "nome": "Constituição Federal, art. 144, § 8º",
        "resumo": "Autoriza os municípios a constituírem guardas municipais destinadas à proteção de seus bens, serviços e instalações, conforme lei.",
        "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
      },
      {
        "nome": "Lei nº 13.022/2014 — Estatuto Geral das Guardas Municipais",
        "resumo": "Define normas gerais, princípios mínimos de atuação, competências, controle interno/externo e estrutura das guardas municipais.",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l13022.htm"
      },
      {
        "nome": "Lei nº 13.675/2018 — SUSP",
        "resumo": "Disciplina o Sistema Único de Segurança Pública e a Política Nacional de Segurança Pública e Defesa Social.",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13675.htm"
      },
      {
        "nome": "Decreto nº 11.841/2023",
        "resumo": "Regulamenta a cooperação das guardas municipais com órgãos de segurança pública.",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11841.htm"
      },
      {
        "nome": "Lei municipal de criação/organização da guarda",
        "resumo": "Dados em breve",
        "url": ""
      }
    ],
    "entendimentos": [
      {
        "titulo": "Guardas municipais integram o sistema de segurança pública",
        "data": "STF, ADPF 995, 2023",
        "status": "Entendimento oficial localizado",
        "resumo": "O STF firmou entendimento de que as guardas municipais integram o sistema de segurança pública.",
        "fonte": "STF — ADPF 995",
        "url": "https://noticias.stf.jus.br/postsnoticias/guardas-municipais-integram-o-sistema-de-seguranca-publica-decide-stf/"
      },
      {
        "titulo": "Guardas municipais podem fazer policiamento urbano ostensivo e comunitário",
        "data": "STF, Tema 656, 2025",
        "status": "Entendimento oficial localizado",
        "resumo": "O STF reconheceu a constitucionalidade de ações de segurança urbana pelas guardas municipais, inclusive policiamento ostensivo e comunitário, sem atribuir poder de investigação.",
        "fonte": "STF — Tema 656",
        "url": "https://noticias.stf.jus.br/postsnoticias/guardas-municipais-podem-fazer-policiamento-urbano-decide-stf/"
      }
    ],
    "local": "Dados em breve",
    "atualizacao": "Revisado em 02/05/2026"
  }
};

function poderesEscapar(texto = '') {
  if (typeof escapeHtml === 'function') return escapeHtml(texto);
  return String(texto).replace(/[&<>'"]/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'}[ch]));
}

function poderesTipoDaInstituicao(inst) {
  inst = String(inst || '').toLowerCase();
  if (inst === 'pf') return 'pf';
  if (inst === 'prf') return 'prf';
  if (inst === 'guarda_municipal' || inst === 'gm') return 'gm';
  if (inst.startsWith('bm')) return 'bm';
  if (inst.startsWith('pp')) return 'pp';
  if (inst.startsWith('pc')) return 'pc';
  if (inst.startsWith('pm')) return 'pm';
  return 'pm';
}

function poderesRamoNome(tipo) {
  return PODERES_DEVERES_BASE[tipo]?.rotulo || PODERES_DEVERES_DADOS_EM_BREVE;
}

function poderesOrdemRamo(inst, estado) {
  if (!estado) return 9;
  if (estado.pm === inst) return 1;
  if (estado.bm === inst) return 2;
  if (estado.pc === inst) return 3;
  if (estado.pp === inst) return 4;
  if (inst === 'pf') return 1;
  if (inst === 'prf') return 2;
  return 9;
}

function poderesInstituicoesDisponiveis() {
  const itens = [];
  const vistos = new Set();

  function adicionar(inst, estadoKey, ramo) {
    if (!inst || vistos.has(inst)) return;
    vistos.add(inst);
    const estado = HEADER_ESTADOS?.[estadoKey] || {};
    const info = HEADER_INSTITUICOES_INFO?.[inst] || {};
    itens.push({
      inst,
      estadoKey,
      estadoNome: estado.nome || (estadoKey === 'br' ? 'Brasil' : PODERES_DEVERES_DADOS_EM_BREVE),
      uf: estado.sigla || (estadoKey === 'br' ? 'BR' : ''),
      sigla: info.titulo || String(inst).toUpperCase(),
      nome: info.desc || poderesRamoNome(poderesTipoDaInstituicao(inst)),
      ramo: ramo || poderesRamoNome(poderesTipoDaInstituicao(inst)),
      ordem: poderesOrdemRamo(inst, estado)
    });
  }

  Object.entries(HEADER_ESTADOS || {}).forEach(([estadoKey, estado]) => {
    if (estadoKey === 'br') return;
    ['pm', 'bm', 'pc', 'pp'].forEach(ramo => adicionar(estado?.[ramo], estadoKey, poderesRamoNome(ramo)));
  });

  adicionar('pf', 'br', poderesRamoNome('pf'));
  adicionar('prf', 'br', poderesRamoNome('prf'));
  itens.push({ inst: 'guarda_municipal', estadoKey: 'municipal', estadoNome: 'Municípios', uf: 'MUN', sigla: 'GM', nome: 'Guardas Municipais', ramo: poderesRamoNome('gm'), ordem: 1 });

  const ordemEstados = Object.keys(HEADER_ESTADOS || {});
  return itens.sort((a, b) => {
    const ia = a.estadoKey === 'municipal' ? 999 : ordemEstados.indexOf(a.estadoKey);
    const ib = b.estadoKey === 'municipal' ? 999 : ordemEstados.indexOf(b.estadoKey);
    return (ia - ib) || (a.ordem - b.ordem) || a.sigla.localeCompare(b.sigla, 'pt-BR');
  });
}

function poderesPopularSeletor() {
  const select = document.getElementById('poderes_instituicao');
  if (!select || select.dataset.renderizado) return;

  const itens = poderesInstituicoesDisponiveis();
  const grupos = new Map();
  itens.forEach(item => {
    const chave = item.estadoNome || 'Outras instituições';
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave).push(item);
  });

  select.innerHTML = '<option value="" disabled>Escolha uma instituição</option>' + Array.from(grupos.entries()).map(([grupo, lista]) => `
    <optgroup label="${poderesEscapar(grupo)}">
      ${lista.map(item => `<option value="${poderesEscapar(item.inst)}">${poderesEscapar(item.sigla)} - ${poderesEscapar(item.nome)}${item.uf ? ' · ' + poderesEscapar(item.uf) : ''}</option>`).join('')}
    </optgroup>
  `).join('');

  const preferida = itens.some(item => item.inst === currInst) ? currInst : 'pf';
  select.value = preferida;
  select.dataset.renderizado = 'true';
}

function poderesValor(valor) {
  if (valor === undefined || valor === null) return PODERES_DEVERES_DADOS_EM_BREVE;
  const texto = String(valor).trim();
  return texto ? texto : PODERES_DEVERES_DADOS_EM_BREVE;
}

function poderesEhDadoPendente(valor) {
  const texto = poderesValor(valor);
  if (texto === PODERES_DEVERES_DADOS_EM_BREVE) return true;
  if (/^(lei estadual|lei distrital|lei municipal|lei orgânica nacional específica|lei organica nacional especifica|lei estadual\/distrital|lei local|norma local)/i.test(texto)) return true;
  return /(?:dados em breve|a preencher|preencher|a confirmar|a definir|sem informação|sem informacao|pendente|fonte oficial a preencher|consultar|conferir|não localizado|nao localizado)/i.test(texto);
}

function poderesUrlValida(url) {
  return /^https?:\/\//i.test(String(url || '').trim());
}

function poderesItemDadosEmBreve(classe = 'poderes-fonte-item') {
  return `<div class="${classe}"><strong>${PODERES_DEVERES_DADOS_EM_BREVE}</strong></div>`;
}

function poderesListaHtml(lista) {
  if (!Array.isArray(lista) || !lista.length) return `<li>${PODERES_DEVERES_DADOS_EM_BREVE}</li>`;
  return lista.map(item => `<li>${poderesEscapar(poderesValor(item))}</li>`).join('');
}

function poderesLeisHtml(lista) {
  if (!Array.isArray(lista) || !lista.length) return poderesItemDadosEmBreve('poderes-fonte-item');
  return lista.map(lei => {
    const semFonteSegura = !poderesUrlValida(lei?.url) || poderesEhDadoPendente(lei?.nome) || poderesEhDadoPendente(lei?.resumo);
    if (semFonteSegura) return poderesItemDadosEmBreve('poderes-fonte-item');
    const nome = poderesEscapar(poderesValor(lei.nome));
    const resumo = poderesEscapar(poderesValor(lei.resumo));
    const link = `<a href="${poderesEscapar(lei.url)}" target="_blank" rel="noopener noreferrer" class="concurso-link">Abrir fonte oficial</a>`;
    return `<div class="poderes-fonte-item"><strong>${nome}</strong><span>${resumo}</span>${link}</div>`;
  }).join('');
}

function poderesEntendimentosHtml(lista) {
  if (!Array.isArray(lista) || !lista.length) return `<div class="direito-item acao"><span class="direito-nome">${PODERES_DEVERES_DADOS_EM_BREVE}</span></div>`;
  return lista.map(item => {
    const semFonteSegura = !poderesUrlValida(item?.url)
      || poderesEhDadoPendente(item?.titulo)
      || poderesEhDadoPendente(item?.resumo)
      || poderesEhDadoPendente(item?.fonte);
    if (semFonteSegura) return `<div class="direito-item acao"><span class="direito-nome">${PODERES_DEVERES_DADOS_EM_BREVE}</span></div>`;
    const link = `<a href="${poderesEscapar(item.url)}" target="_blank" rel="noopener noreferrer" class="concurso-link">${poderesEscapar(item.fonte)}</a>`;
    return `
      <div class="direito-item acao poderes-entendimento-item">
        <span class="direito-nome">${poderesEscapar(poderesValor(item.titulo))}</span>
        <span class="direito-status" style="color: var(--vermelho);">${poderesEscapar(poderesValor(item.status))}</span>
        <div><span class="badge-info ativa">${poderesEscapar(poderesValor(item.data))}</span></div>
        <span class="direito-desc">${poderesEscapar(poderesValor(item.resumo))}</span>
        <span class="direito-desc"><strong>Fonte:</strong> ${link}</span>
      </div>
    `;
  }).join('');
}


function poderesRenderizar(inst) {
  const painel = document.getElementById('poderes_resultado');
  const tituloSpan = document.getElementById('txt-inst-poderes');
  if (!painel) return;

  const tipo = poderesTipoDaInstituicao(inst);
  const dados = PODERES_DEVERES_BASE[tipo] || PODERES_DEVERES_BASE.pm;
  const info = inst === 'guarda_municipal'
    ? { titulo: 'GM', desc: 'Guardas Municipais' }
    : (HEADER_INSTITUICOES_INFO?.[inst] || { titulo: String(inst || '').toUpperCase(), desc: dados.rotulo });
  const estadoKey = inst === 'guarda_municipal' ? 'municipal' : (typeof getEstadoDaInstituicao === 'function' ? getEstadoDaInstituicao(inst) : '');
  const estado = HEADER_ESTADOS?.[estadoKey] || {};
  const nomeCompleto = `${info.titulo || String(inst).toUpperCase()} — ${info.desc || dados.rotulo}`;
  if (tituloSpan) tituloSpan.textContent = info.titulo || dados.rotulo;

  painel.innerHTML = `
    <section class="poderes-resumo-card" aria-label="Resumo de poderes e deveres">
      <div>
        <span class="poderes-kicker">${poderesEscapar(dados.categoria)}</span>
        <h3>${poderesEscapar(nomeCompleto)}</h3>
        <p>${poderesEscapar(dados.abrangencia)}</p>
      </div>
      <div class="poderes-meta-grid">
        <div><span>Instituição-base</span><strong>${poderesEscapar(dados.rotulo)}</strong></div>
        <div><span>Abrangência local</span><strong>${poderesEscapar(estado.nome || (estadoKey === 'municipal' ? 'Município' : 'Brasil'))}</strong></div>
        <div><span>Lei local específica</span><strong>${poderesEscapar(dados.local || PODERES_DEVERES_DADOS_EM_BREVE)}</strong></div>
        <div><span>Última revisão</span><strong>${poderesEscapar(dados.atualizacao || PODERES_DEVERES_DADOS_EM_BREVE)}</strong></div>
      </div>
    </section>

    <div class="poderes-grid">
      <section class="direito-item poderes-bloco">
        <span class="direito-nome">Deveres principais</span>
        <ul>${poderesListaHtml(dados.deveres)}</ul>
      </section>
      <section class="direito-item poderes-bloco">
        <span class="direito-nome">Abrangência de poder</span>
        <ul>${poderesListaHtml(dados.poderes)}</ul>
      </section>
      <section class="direito-item poderes-bloco poderes-bloco-largo">
        <span class="direito-nome">Limites importantes</span>
        <ul>${poderesListaHtml(dados.limites)}</ul>
      </section>
    </div>

    <section class="poderes-fontes-card">
      <h3>Leis e normas de referência</h3>
      <p>Fontes oficiais ou institucionais importantes para conferência.</p>
      <div class="poderes-fontes-lista">${poderesLeisHtml(dados.leis)}</div>
    </section>

    <section class="poderes-entendimentos-card">
      <h3>Entendimentos recentes e pontos de atenção</h3>
      <div class="result-list">${poderesEntendimentosHtml(dados.entendimentos)}</div>
    </section>

    <div class="alerta legal">
      <strong>Aviso:</strong> Esta aba é informativa e independente. Ela não substitui consulta a advogado, corregedoria, setor jurídico, legislação local, decisão judicial aplicável ou canal oficial da instituição.
    </div>
  `;
}

function inicializarPoderesDeveres() {
  poderesPopularSeletor();
  const select = document.getElementById('poderes_instituicao');
  poderesRenderizar(select?.value || 'pf');
}

function mudarInstituicaoPoderes(valor) {
  poderesRenderizar(valor || 'pf');
}
