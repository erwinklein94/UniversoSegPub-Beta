import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const CONFIG_PATH = process.env.CONFIG_PATH || 'config/concursos-instituicoes.json';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.4-nano';
const OPENAI_MODEL_QUALIDADE = process.env.OPENAI_MODEL_QUALIDADE || 'gpt-5.4-mini';
const MODO_QUALIDADE = String(process.env.MODO_QUALIDADE || 'economico').trim().toLowerCase();
const USAR_WEB_SEARCH = String(process.env.USAR_WEB_SEARCH || 'false').toLowerCase() === 'true';
const FORCAR_ATUALIZACAO = String(process.env.FORCAR_ATUALIZACAO || 'false').toLowerCase() === 'true';
const INSTITUICAO_ID = String(process.env.INSTITUICAO_ID || 'pmesp').trim().toLowerCase();
const LIMITE_INSTITUICOES = Number(process.env.LIMITE_INSTITUICOES || 1);
const DIAS_REVALIDACAO_COMPLETA = Number(process.env.DIAS_REVALIDACAO_COMPLETA || 14);
const MAX_PAGINAS_OFICIAIS = Number(process.env.MAX_PAGINAS_OFICIAIS || 6);
const MAX_CARACTERES_POR_PAGINA = Number(process.env.MAX_CARACTERES_POR_PAGINA || 4500);
const MIN_SCORE_PUBLICACAO = Number(process.env.MIN_SCORE_PUBLICACAO || 78);
const MAX_CRITICOS_GENERICOS = Number(process.env.MAX_CRITICOS_GENERICOS || 2);
const PERMITIR_PUBLICAR_SE_PIORA = String(process.env.PERMITIR_PUBLICAR_SE_PIORA || 'false').toLowerCase() === 'true';
const PUBLICAR_RESULTADO_QUALIFICADO_COM_OPENAI = String(process.env.PUBLICAR_RESULTADO_QUALIFICADO_COM_OPENAI || 'true').toLowerCase() === 'true';
const HOJE = new Date().toISOString().slice(0, 10);

const camposObrigatorios = ['instituicao_id','instituicao_nome','sigla','uf','tema','status','titulo','resumo','edital','salario','vagas','cotas','idade','escolaridade','materias','banca','inscritos','etapas','cfsd','estagio','validade','previsao','site','fontes','ultima_pesquisa','nivel_confianca','precisa_revisao_humana','alertas'];
const camposDeConteudo = ['edital','salario','vagas','cotas','idade','escolaridade','materias','banca','inscritos','etapas','cfsd','estagio','validade','previsao'];
const camposCriticos = ['edital','salario','vagas','escolaridade','banca','etapas'];
const camposQuePodemSerMenosConcretos = ['cotas','estagio','validade','previsao'];

const schema = { type:'object', additionalProperties:false, properties:{}, required:camposObrigatorios };
for (const campo of camposObrigatorios) {
  if (campo === 'fontes') {
    schema.properties[campo] = { type:'array', items:{ type:'object', additionalProperties:false, properties:{ titulo:{type:'string'}, url:{type:'string'}, tipo:{type:'string'}, data_consulta:{type:'string'} }, required:['titulo','url','tipo','data_consulta'] } };
  } else if (campo === 'alertas') {
    schema.properties[campo] = { type:'array', items:{ type:'string' } };
  } else if (campo === 'precisa_revisao_humana') {
    schema.properties[campo] = { type:'boolean' };
  } else {
    schema.properties[campo] = { type:'string' };
  }
}

function diasDesde(dataIso){ if(!dataIso) return Infinity; const data=new Date(`${dataIso}T00:00:00Z`); if(Number.isNaN(data.getTime())) return Infinity; return Math.floor((new Date(`${HOJE}T00:00:00Z`)-data)/86400000); }
function sha256(texto){ return crypto.createHash('sha256').update(texto).digest('hex'); }
function normalizarTexto(texto=''){ return String(texto).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<noscript[\s\S]*?<\/noscript>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim(); }
function limitar(texto,limite){ if(!texto) return ''; return texto.length<=limite?texto:`${texto.slice(0,limite).trimEnd()}\n[conteúdo cortado para economia de tokens]`; }
function escaparRegex(valor){ return String(valor).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
function normalizarParaAnalise(valor){ return String(valor ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' '); }
function valorEhRuim(valor){ const texto=normalizarParaAnalise(valor); if(!texto) return true; return ['nao encontrado em fonte oficial','nao encontrado','nao informado','dados em atualizacao','em atualizacao','nao localizado','sem informacao','sem dados','indisponivel'].some(p=>texto===p||texto.includes(p)); }
function valorTemDadoConcreto(valor){ const original=String(valor??'').trim(); const texto=normalizarParaAnalise(original); if(!texto||valorEhRuim(texto)) return false; return [/r\$\s?\d/i,/\b\d{1,4}([\.,]\d{3})*\s*(vagas?|cargos?|convocados?|nomeacoes?|inscritos?)\b/i,/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,/\b20\d{2}\b/,/\b(cebraspe|vunesp|fgv|ibfc|iades|idecan|fcc|fepese|acafe|cesgranrio)\b/i,/\b(soldado|oficial|delegado|investigador|escrivao|perito|agente|papiloscopista|inspetor|policial rodoviario federal|policial penal|bombeiro)\b/i,/\b(ensino medio|nivel medio|nivel superior|bacharelado|graduacao|cnh|direito|medicina)\b/i,/https?:\/\//i].some(r=>r.test(original)); }
function valorEhGenerico(valor){ const texto=normalizarParaAnalise(valor); if(!texto||valorEhRuim(texto)) return true; const genericos=['conferir edital','consultar edital','consultar ato','consultar atos','acompanhar a pagina','acompanhar o site','conforme edital','conforme o edital','edital especifico','varia conforme','podem variar','depende do concurso','depende do cargo','quando previsto','quando aplicavel','demais etapas','e demais','informacoes oficiais','pagina oficial','banca organizadora','criterios dependem','regras dependem','requisitos proprios','conteudo programatico proprio','concurso vigente','edital vigente']; const contem=genericos.some(p=>texto.includes(p)); return contem && !valorTemDadoConcreto(valor); }
function valorEhUtil(valor){ return !valorEhRuim(valor) && !valorEhGenerico(valor); }

function avaliarQualidadePublicacao(dados){ const ruins=camposDeConteudo.filter(c=>valorEhRuim(dados[c])); const genericos=camposDeConteudo.filter(c=>!valorEhRuim(dados[c])&&valorEhGenerico(dados[c])); const concretos=camposDeConteudo.filter(c=>valorTemDadoConcreto(dados[c])); const criticosRuins=camposCriticos.filter(c=>valorEhRuim(dados[c])); const criticosGenericos=camposCriticos.filter(c=>!valorEhRuim(dados[c])&&valorEhGenerico(dados[c])); const criticosConcretos=camposCriticos.filter(c=>valorTemDadoConcreto(dados[c])); const menos=camposQuePodemSerMenosConcretos.filter(c=>genericos.includes(c)); let score=100; score-=ruins.length*7; score-=genericos.length*5; score-=menos.length*2; score-=criticosRuins.length*10; score-=criticosGenericos.length*10; if(criticosConcretos.length<3) score-=12; if(concretos.length<6) score-=10; if(!Array.isArray(dados.fontes)||dados.fontes.length===0) score-=15; if(String(dados.nivel_confianca||'').toLowerCase()==='baixo') score-=12; if(dados.precisa_revisao_humana) score-=3; score=Math.max(0,Math.min(100,score)); return {score, qualidade: score>=82?'alta':score>=MIN_SCORE_PUBLICACAO?'media':'baixa', ruins,genericos,concretos,criticosRuins,criticosGenericos,criticosConcretos, podePublicar: score>=MIN_SCORE_PUBLICACAO&&criticosRuins.length===0&&criticosGenericos.length<=MAX_CRITICOS_GENERICOS}; }
function mesclarComDadosAtuais(novo, atual){ const base=atual&&typeof atual==='object'?atual:{}; const out={...novo}; const alertas=new Set([...(Array.isArray(novo.alertas)?novo.alertas:[])]); for(const campo of camposDeConteudo){ const novoPobre=!valorEhUtil(novo[campo]); const atualUtil=valorEhUtil(base[campo]); const novoConcreto=valorTemDadoConcreto(novo[campo]); const atualConcreto=valorTemDadoConcreto(base[campo]); if(novoPobre&&atualUtil){ out[campo]=base[campo]; alertas.add(`Campo ${campo} mantido da versão anterior porque a atualização automática veio genérica ou sem confirmação suficiente.`); continue; } if(!novoConcreto&&atualConcreto&&campo!=='previsao'){ out[campo]=base[campo]; alertas.add(`Campo ${campo} preservado porque a nova versão não trouxe dado concreto superior ao já publicado.`); }} if((!Array.isArray(out.fontes)||out.fontes.length===0)&&Array.isArray(base.fontes)){ out.fontes=base.fontes; alertas.add('Fontes mantidas da versão anterior porque a atualização automática não encontrou nova fonte publicável.'); } if(valorEhRuim(out.site)&&!valorEhRuim(base.site)) out.site=base.site; out.alertas=[...alertas]; return out; }

function mesclarResultadoQualificadoPago(novo, atual){
  const base=atual&&typeof atual==='object'?atual:{};
  const out={...novo};
  const alertas=new Set([...(Array.isArray(novo.alertas)?novo.alertas:[])]);

  for(const campo of camposDeConteudo){
    const novoVazioOuRuim=valorEhRuim(novo[campo]);
    const atualExiste=!valorEhRuim(base[campo]);

    // No modo qualificado pago, a informação gerada pela OpenAI deve ter prioridade,
    // inclusive quando for cautelosa/genérica. Só preservamos o antigo se o novo vier vazio,
    // "não encontrado" ou equivalente.
    if(novoVazioOuRuim&&atualExiste){
      out[campo]=base[campo];
      alertas.add(`Campo ${campo} preenchido com a versão anterior porque a pesquisa qualificada não trouxe valor utilizável.`);
    } else if(!novoVazioOuRuim){
      alertas.add(`Campo ${campo} atualizado/priorizado pelo modo qualificado pago.`);
    }
  }

  if((!Array.isArray(out.fontes)||out.fontes.length===0)&&Array.isArray(base.fontes)){
    out.fontes=base.fontes;
    alertas.add('Fontes mantidas da versão anterior porque a pesquisa qualificada não retornou fonte estruturada.');
  }
  if(valorEhRuim(out.site)&&!valorEhRuim(base.site)) out.site=base.site;
  out.alertas=[...alertas];
  return out;
}


function limparTextoPublico(valor, campo = '') {
  let texto = String(valor == null ? '' : valor).trim();
  if (!texto) return texto;

  texto = texto.replace(/\[([^\]]{1,120})\]\((https?:\/\/[^\s)]+)\)/gi, '$1');
  texto = texto.replace(/https?:\/\/\S+/gi, '');
  texto = texto.replace(/www\.\S+/gi, '');
  texto = texto.replace(/utm_source=[a-z0-9_-]+/gi, '');
  texto = texto.replace(/\[[^\]]*(?:\.gov|\.br|openai|http|fonte)[^\]]*\]/gi, '');
  texto = texto.replace(/\(\s*\)/g, '');
  texto = texto.replace(/\(\s*[.;,]?\s*\)/g, '');

  const substituicoes = [
    [/o trecho coletado não traz/gi, 'não foi localizado'],
    [/não veio detalhado no trecho coletado/gi, 'não foi localizado'],
    [/no trecho coletado/gi, 'nas fontes consultadas'],
    [/conteúdo-base anterior menciona/gi, 'referência anterior indica'],
    [/conteudo-base anterior menciona/gi, 'referência anterior indica'],
    [/porém esse valor não foi revalidado nesta pesquisa atual/gi, 'valor não revalidado nesta pesquisa'],
    [/porem esse valor nao foi revalidado nesta pesquisa atual/gi, 'valor não revalidado nesta pesquisa'],
    [/nas fontes oficiais consultadas/gi, 'nas fontes consultadas'],
    [/a partir das fontes consultadas/gi, 'nas fontes consultadas'],
    [/fonte oficial alternativa/gi, 'fonte consultada'],
    [/portal oficial informa que as informações completas constam no edital/gi, 'conteúdo detalhado deve ser conferido no edital'],
    [/não foi localizado nas fontes consultadas,?\s*/gi, 'Não localizado nas fontes consultadas. ']
  ];
  for (const [regex, replacement] of substituicoes) texto = texto.replace(regex, replacement);

  texto = texto.replace(/Não foi localizado[^.;]*?(?:;|\.)/gi, 'Não localizado nas fontes consultadas. ');
  texto = texto.replace(/Nao foi localizado[^.;]*?(?:;|\.)/gi, 'Não localizado nas fontes consultadas. ');
  texto = texto.replace(/\s+([,.;:])/g, '$1');
  texto = texto.replace(/([,.;:]){2,}/g, '$1');
  texto = texto.replace(/\s{2,}/g, ' ');
  texto = texto.replace(/\s+\/\s+/g, '/');
  texto = texto.replace(/\s+\./g, '.');
  texto = texto.replace(/^[-–—:;,.\s]+|[-–—:;,.\s]+$/g, '');

  const limites = { edital: 280, salario: 240, vagas: 240, cotas: 190, idade: 190, escolaridade: 220, materias: 260, banca: 190, inscritos: 220, etapas: 320, cfsd: 220, estagio: 180, validade: 180, previsao: 240, resumo: 260, titulo: 140 };
  const limite = limites[campo] || 260;
  if (texto.length > limite) {
    let cortado = texto.slice(0, limite - 1).trimEnd();
    const ultimoPonto = Math.max(cortado.lastIndexOf('.'), cortado.lastIndexOf(';'));
    texto = ultimoPonto > 80 ? cortado.slice(0, ultimoPonto + 1) : `${cortado}…`;
  }
  return texto.trim();
}

function prepararTextoFinalParaSite(dados) {
  const saida = { ...dados };
  for (const campo of [...camposDeConteudo, 'titulo', 'resumo']) {
    if (campo in saida) saida[campo] = limparTextoPublico(saida[campo], campo);
  }
  saida.fontes = Array.isArray(saida.fontes)
    ? saida.fontes.map((fonte) => ({
        titulo: limparTextoPublico(fonte.titulo || 'Fonte consultada', 'titulo') || 'Fonte consultada',
        url: String(fonte.url || '').replace(/([?&])utm_source=[^&\s]+(&?)/gi, '$1').replace(/[?&]$/g, ''),
        tipo: limparTextoPublico(fonte.tipo || 'fonte consultada', 'titulo') || 'fonte consultada',
        data_consulta: String(fonte.data_consulta || HOJE)
      })).filter((fonte) => /^https?:\/\//i.test(fonte.url))
    : [];
  saida.texto_final_limpo = true;
  saida.padrao_editorial = 'usuario-final-sem-links-nos-campos';
  return saida;
}

function urlEhOficial(url='',inst){ try{ const hostname=new URL(url).hostname.replace(/^www\./,'').toLowerCase(); return (inst.dominios_oficiais||[]).some(d=>{const limpo=String(d).replace(/^www\./,'').toLowerCase(); return hostname===limpo||hostname.endsWith(`.${limpo}`);}); }catch{return false;} }
function extrairLinks(html,baseUrl,inst){ const links=new Set(); const termos=[...(inst.termos_relevantes||[]),inst.id,inst.sigla,'concurso','edital','inscri'].filter(Boolean); const regexTermos=new RegExp(termos.map(escaparRegex).join('|'),'i'); const regex=/href=["']([^"'#]+)["']/gi; let m; while((m=regex.exec(html))){ try{ const url=new URL(m[1],baseUrl).href; const txt=decodeURIComponent(url).toLowerCase(); if(!urlEhOficial(url,inst)) continue; if(!regexTermos.test(txt)) continue; if(/\.(jpg|jpeg|png|gif|webp|svg|css|js|ico|zip|rar)$/i.test(txt)) continue; links.add(url);}catch{} } return [...links]; }
async function buscarPagina(url){ const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),20000); try{ const r=await fetch(url,{headers:{'User-Agent':'UniversoSegPubBot/1.0 (+https://www.universosegpub.com.br)',Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5'},signal:controller.signal}); const bruto=await r.text(); return {url,ok:r.ok,status:r.status,contentType:r.headers.get('content-type')||'',html:bruto,texto:normalizarTexto(bruto)}; }catch(e){ return {url,ok:false,status:0,contentType:'',html:'',texto:'',erro:e.message}; }finally{ clearTimeout(timeout); } }
async function coletarFontesOficiais(inst){ const paginas=[]; const fila=[...(inst.fontes_base||[])]; const visitadas=new Set(); while(fila.length>0&&paginas.length<MAX_PAGINAS_OFICIAIS){ const url=fila.shift(); if(!url||visitadas.has(url)) continue; visitadas.add(url); const pagina=await buscarPagina(url); paginas.push(pagina); if(pagina.ok&&pagina.html&&paginas.length<MAX_PAGINAS_OFICIAIS){ for(const link of extrairLinks(pagina.html,url,inst)){ if(!visitadas.has(link)&&fila.length<MAX_PAGINAS_OFICIAIS*3) fila.push(link); }}} return paginas; }
function resumoMonitoramento(paginas){ return paginas.map(p=>({url:p.url,ok:p.ok,status:p.status,hash:sha256(normalizarTexto(p.texto).slice(0,50000)),tamanho_texto:p.texto.length})); }
function monitorMudou(anterior, atual){ if(!anterior||!Array.isArray(anterior.fontes_monitoradas)) return true; const map=new Map(anterior.fontes_monitoradas.map(i=>[i.url,i.hash])); return atual.some(i=>!map.has(i.url)||map.get(i.url)!==i.hash); }
async function lerJson(c){ try{return JSON.parse(await fs.readFile(c,'utf8'));}catch{return null;} }
async function carregarConfig(){ const c=JSON.parse(await fs.readFile(CONFIG_PATH,'utf8')); if(!Array.isArray(c)) throw new Error(`${CONFIG_PATH} precisa conter uma lista.`); return c; }
function selecionarInstituicoes(config){ if(INSTITUICAO_ID==='todas_configuradas') return [...config].sort((a,b)=>Number(a.prioridade||99)-Number(b.prioridade||99)).slice(0,Math.max(1,LIMITE_INSTITUICOES)); const m=INSTITUICAO_ID.match(/^prioridade_(\d+)$/); if(m){ const p=Number(m[1]); return config.filter(x=>Number(x.prioridade||99)===p).sort((a,b)=>String(a.id).localeCompare(String(b.id))).slice(0,Math.max(1,LIMITE_INSTITUICOES)); } const e=config.find(x=>x.id===INSTITUICAO_ID); if(!e) throw new Error(`Instituição "${INSTITUICAO_ID}" não encontrada em ${CONFIG_PATH}.`); return [e]; }
function extrairTextoResposta(payload){ if(payload.output_text) return payload.output_text; const textos=[]; for(const item of payload.output||[]) for(const c of item.content||[]) if(typeof c.text==='string') textos.push(c.text); return textos.join('\n').trim(); }
function validarDados(dados,inst){ for(const c of camposObrigatorios) if(!(c in dados)) throw new Error(`JSON gerado para ${inst.id} sem campo obrigatório: ${c}`); if(!Array.isArray(dados.fontes)) throw new Error('fontes precisa ser lista'); if(!Array.isArray(dados.alertas)) throw new Error('alertas precisa ser lista'); dados.instituicao_id=inst.id; dados.instituicao_nome=inst.nome; dados.sigla=inst.sigla; dados.uf=inst.uf; dados.tema='concursos'; dados.site=dados.site||inst.site_principal||''; dados.ultima_pesquisa=dados.ultima_pesquisa||HOJE; return dados; }
function consultasSugeridas(inst){ const base=Array.isArray(inst.consultas_sugeridas)?inst.consultas_sugeridas:[]; const geradas=[`${inst.sigla} concurso edital ${inst.uf||''}`,`${inst.nome} concurso público edital`,`${inst.sigla} concurso vagas salário banca escolaridade`,`${inst.sigla} inscrições concurso prova etapas banca`,`${inst.sigla} diário oficial concurso edital nomeação convocação`,`${inst.sigla} edital pdf concurso banca organizadora`]; return [...new Set([...base,...geradas].filter(Boolean))].slice(0,10); }
async function salvarRascunhoBloqueado(inst,dados,paginas,payload,motivo,avaliacao=null){ const pasta='data/concursos/_rascunhos'; await fs.mkdir(pasta,{recursive:true}); await fs.writeFile(`${pasta}/${inst.id}.json`,`${JSON.stringify({gerado_em:HOJE,instituicao_id:inst.id,motivo_bloqueio:motivo,avaliacao,dados},null,2)}\n`,'utf8'); await fs.writeFile(inst.arquivo_monitoramento,`${JSON.stringify({atualizado_em:HOJE,instituicao_id:inst.id,modo_qualidade:MODO_QUALIDADE,modelo:MODO_QUALIDADE==='qualificado'?OPENAI_MODEL_QUALIDADE:OPENAI_MODEL,usou_openai:true,usou_web_search_openai:USAR_WEB_SEARCH||MODO_QUALIDADE==='qualificado',publicacao_bloqueada:true,motivo,avaliacao,usage:payload?.usage||null,fontes_monitoradas:resumoMonitoramento(paginas)},null,2)}\n`,'utf8'); }
async function chamarOpenAI({instituicao,jsonAtual,paginasColetadas,houveMudanca,forcarAtualizacao}){ const modeloDaChamada=MODO_QUALIDADE==='qualificado'?OPENAI_MODEL_QUALIDADE:OPENAI_MODEL; const usarWebSearchNaChamada=USAR_WEB_SEARCH||MODO_QUALIDADE==='qualificado'; if(!OPENAI_API_KEY) throw new Error('Defina OPENAI_API_KEY no GitHub.'); const conteudoFontes=paginasColetadas.filter(p=>p.ok&&p.texto).map((p,i)=>`FONTE ${i+1}\nURL: ${p.url}\nSTATUS HTTP: ${p.status}\nTEXTO EXTRAÍDO:\n${limitar(p.texto,MAX_CARACTERES_POR_PAGINA)}`).join('\n\n---\n\n'); const prompt=`Você está atualizando o portal Universo Seg Pub.\n\nModo de qualidade: ${MODO_QUALIDADE}.\n${MODO_QUALIDADE==='qualificado'?'Neste modo, faça pesquisa mais profunda; se as fontes coletadas falharem, use web_search para localizar fontes oficiais alternativas.':'Neste modo, seja conservador e econômico; preserve dados anteriores quando as fontes coletadas não forem suficientes.'}\n\nInstituição:\n- Nome: ${instituicao.nome}\n- Sigla: ${instituicao.sigla}\n- ID: ${instituicao.id}\n- UF: ${instituicao.uf}\n- Tema: concursos\n\nConsultas sugeridas:\n${consultasSugeridas(instituicao).map((q,i)=>`${i+1}. ${q}`).join('\n')}\n\nFontes base cadastradas:\n${(instituicao.fontes_base||[]).map((u,i)=>`${i+1}. ${u}`).join('\n')||'Nenhuma fonte base cadastrada.'}\n\nRegras rígidas:\n- Use fontes oficiais, banca oficial ou diário oficial.\n- Se as fontes automáticas estiverem vazias, bloqueadas ou pobres, use web_search no modo qualificado para encontrar fontes oficiais alternativas.\n- Não use blogs, cursinhos ou agregadores como fonte final.\n- Não invente edital, salário, vagas, datas, banca, requisitos ou etapas.\n- No modo qualificado pago, priorize os dados encontrados pela pesquisa atual; só preserve dado antigo quando o campo novo vier vazio ou claramente sem informação.\n- Evite frases genéricas como "conferir edital", "consultar página oficial" ou "conforme edital específico" como informação principal.\n- Para salário, vagas, banca, escolaridade e etapas, entregue dado concreto quando houver fonte.\n- REGRA EDITORIAL OBRIGATÓRIA: os campos visíveis do site devem ser texto final para usuário leigo, sem links, sem Markdown, sem URLs, sem domínios entre colchetes, sem utm_source e sem justificativas internas de pesquisa.\n- Links e URLs devem ficar somente no array fontes.\n- Escreva os campos como editor do portal: claro, objetivo e publicável, sem parecer log de busca.\n- Diferencie edital aberto, em andamento, encerrado e previsão.\n- Retorne apenas JSON válido.\n\nDados atualmente publicados:\n${JSON.stringify(jsonAtual,null,2)}\n\nFontes oficiais coletadas automaticamente:\n${conteudoFontes||'Nenhuma fonte oficial pôde ser coletada automaticamente.'}\n`; const body={model:modeloDaChamada,input:[{role:'system',content:'Você é um pesquisador rigoroso de concursos públicos de segurança pública no Brasil. Priorize fontes oficiais e devolva somente JSON válido.'},{role:'user',content:prompt}],text:{format:{type:'json_schema',name:'concurso_instituicao',strict:true,schema}}}; if(usarWebSearchNaChamada) body.tools=[{type:'web_search',search_context_size:MODO_QUALIDADE==='qualificado'?'medium':'low'}]; const resposta=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body)}); if(!resposta.ok){ const erro=await resposta.text(); throw new Error(`Erro OpenAI para ${instituicao.id}: HTTP ${resposta.status} - ${erro}`); } const payload=await resposta.json(); const texto=extrairTextoResposta(payload); if(!texto) throw new Error(`OpenAI não retornou JSON para ${instituicao.id}`); let gerado; try{ gerado=JSON.parse(texto); }catch{ throw new Error(`Resposta não veio como JSON válido para ${instituicao.id}: ${texto}`); } const validado=prepararTextoFinalParaSite(validarDados(gerado,instituicao)); const usarResultadoPagoComoPrioridade=MODO_QUALIDADE==='qualificado'&&PUBLICAR_RESULTADO_QUALIFICADO_COM_OPENAI&&payload&&(payload.usage||usarWebSearchNaChamada); const mescladoBruto=usarResultadoPagoComoPrioridade?mesclarResultadoQualificadoPago(validado,jsonAtual):mesclarComDadosAtuais(validado,jsonAtual); const mesclado=prepararTextoFinalParaSite(mescladoBruto); const avaliacao=avaliarQualidadePublicacao(mesclado); const avaliacaoAtual=jsonAtual?avaliarQualidadePublicacao(jsonAtual):{score:0,qualidade:'inexistente'}; mesclado.qualidade_publicacao=avaliacao.qualidade; mesclado.score_publicacao=avaliacao.score; mesclado.modo_qualidade=MODO_QUALIDADE; mesclado.bloquear_publicacao=!avaliacao.podePublicar; mesclado.alertas=[...(new Set([...(mesclado.alertas||[]),`Qualidade calculada: ${avaliacao.qualidade} (${avaliacao.score}/100). Campos concretos: ${avaliacao.concretos.length}/${camposDeConteudo.length}.`]))]; const piorou=jsonAtual&&!PERMITIR_PUBLICAR_SE_PIORA&&avaliacao.score<Math.max(MIN_SCORE_PUBLICACAO,avaliacaoAtual.score-3); const podePublicarForcadoQualificado=usarResultadoPagoComoPrioridade; if((!avaliacao.podePublicar||piorou)&&!podePublicarForcadoQualificado){ const motivo=!avaliacao.podePublicar?`Atualização bloqueada: qualidade ${avaliacao.qualidade}, score ${avaliacao.score}, campos críticos genéricos: ${avaliacao.criticosGenericos.join(', ')||'nenhum'}, campos críticos sem confirmação: ${avaliacao.criticosRuins.join(', ')||'nenhum'}.`:`Atualização bloqueada: a nova versão (${avaliacao.score}/100) ficou pior que a versão publicada (${avaliacaoAtual.score}/100).`; mesclado.precisa_revisao_humana=true; mesclado.bloquear_publicacao=true; mesclado.alertas=[...(new Set([...(mesclado.alertas||[]),motivo]))]; await salvarRascunhoBloqueado(instituicao,mesclado,paginasColetadas,payload,motivo,avaliacao); console.warn(`⚠️ ${instituicao.sigla}: ${motivo}`); console.warn(`⚠️ ${instituicao.sigla}: JSON principal preservado; rascunho salvo em data/concursos/_rascunhos/${instituicao.id}.json`); return; } if((!avaliacao.podePublicar||piorou)&&podePublicarForcadoQualificado){ const motivoForcado=`Publicação permitida em modo qualificado porque houve uso de OpenAI/web_search. Score ${avaliacao.score}/100, qualidade ${avaliacao.qualidade}. Revisão humana recomendada.`; mesclado.precisa_revisao_humana=true; mesclado.bloquear_publicacao=false; mesclado.publicado_por_modo_qualificado=true; mesclado.forcar_exibicao_site=true; mesclado.publicacao_forcada_por_credito_openai=true; mesclado.alertas=[...(new Set([...(mesclado.alertas||[]),motivoForcado,'Resultado pago da OpenAI priorizado no JSON principal para evitar gasto sem alteração visível no site.']))]; console.warn(`⚠️ ${instituicao.sigla}: ${motivoForcado}`); } if(usarResultadoPagoComoPrioridade){ mesclado.publicado_por_modo_qualificado=true; mesclado.forcar_exibicao_site=true; mesclado.publicacao_forcada_por_credito_openai=true; mesclado.bloquear_publicacao=false; mesclado.alertas=[...(new Set([...(mesclado.alertas||[]),'Resultado do modo qualificado pago aplicado no JSON principal.']))]; } await fs.mkdir(instituicao.arquivo_saida.split('/').slice(0,-1).join('/'),{recursive:true}); await fs.writeFile(instituicao.arquivo_saida,`${JSON.stringify(mesclado,null,2)}\n`,'utf8'); await fs.writeFile(instituicao.arquivo_monitoramento,`${JSON.stringify({atualizado_em:HOJE,instituicao_id:instituicao.id,modo_qualidade:MODO_QUALIDADE,modelo:modeloDaChamada,usou_openai:true,usou_web_search_openai:usarWebSearchNaChamada,publicacao_bloqueada:false,publicado_por_modo_qualificado:!!mesclado.publicado_por_modo_qualificado,forcar_exibicao_site:!!mesclado.forcar_exibicao_site,publicacao_forcada_por_credito_openai:!!mesclado.publicacao_forcada_por_credito_openai,qualidade_publicacao:avaliacao.qualidade,score_publicacao:avaliacao.score,motivo:forcarAtualizacao?'Atualização forçada manualmente.':houveMudanca?'Mudança detectada nas fontes monitoradas.':'Revalidação completa por prazo.',usage:payload.usage||null,fontes_monitoradas:resumoMonitoramento(paginasColetadas)},null,2)}\n`,'utf8'); console.log(`✅ ${instituicao.sigla}: atualizado em ${instituicao.arquivo_saida}`); console.log(`   Qualidade nova: ${avaliacao.qualidade} (${avaliacao.score}/100)`); console.log(`   Qualidade anterior: ${avaliacaoAtual.qualidade} (${avaliacaoAtual.score}/100)`); if(payload.usage) console.log(`   Uso OpenAI ${instituicao.id}: ${JSON.stringify(payload.usage)}`); }
async function processarInstituicao(instituicao){ console.log(`\n============================================================\nInstituição: ${instituicao.sigla} (${instituicao.id})\nArquivo: ${instituicao.arquivo_saida}\n============================================================`); await fs.mkdir('data/concursos',{recursive:true}); const jsonAtual=await lerJson(instituicao.arquivo_saida); const monitorAnterior=await lerJson(instituicao.arquivo_monitoramento); const paginasColetadas=await coletarFontesOficiais(instituicao); const monitorAtual=resumoMonitoramento(paginasColetadas); const houveMudanca=monitorMudou(monitorAnterior,monitorAtual); const dias=diasDesde(jsonAtual?.ultima_pesquisa); const revalidar=dias>=DIAS_REVALIDACAO_COMPLETA; console.log(`Modelo econômico: ${OPENAI_MODEL}`); console.log(`Modelo qualificado: ${OPENAI_MODEL_QUALIDADE}`); console.log(`Modo de qualidade: ${MODO_QUALIDADE}`); console.log(`Web search solicitado: ${USAR_WEB_SEARCH?'ligado':'desligado'}`); console.log(`Web search efetivo: ${USAR_WEB_SEARCH||MODO_QUALIDADE==='qualificado'?'ligado':'desligado'}`); console.log(`Forçar atualização: ${FORCAR_ATUALIZACAO?'sim':'não'}`); console.log(`Fontes coletadas: ${paginasColetadas.length}`); console.log(`Houve mudança: ${houveMudanca?'sim':'não'}`); console.log(`Dias desde última pesquisa: ${dias}`); if(!FORCAR_ATUALIZACAO&&!houveMudanca&&!revalidar){ console.log(`✅ ${instituicao.sigla}: nenhuma mudança relevante. OpenAI não foi chamada.`); return; } const fontesComTexto=paginasColetadas.filter(p=>p.ok&&p.texto&&p.texto.length>300); if(fontesComTexto.length===0&&jsonAtual&&MODO_QUALIDADE!=='qualificado'){ console.warn(`⚠️ ${instituicao.sigla}: nenhuma fonte com texto suficiente. Em modo econômico, OpenAI não foi chamada e JSON publicado foi preservado.`); await fs.writeFile(instituicao.arquivo_monitoramento,`${JSON.stringify({atualizado_em:HOJE,instituicao_id:instituicao.id,modo_qualidade:MODO_QUALIDADE,usou_openai:false,publicacao_bloqueada:true,motivo:'Nenhuma fonte oficial com texto suficiente foi coletada; conteúdo publicado preservado no modo econômico.',recomendacao:'Rode com modo_qualidade=qualificado e usar_web_search=true para tentar pesquisa profunda.',fontes_monitoradas:monitorAtual},null,2)}\n`,'utf8'); return; } if(fontesComTexto.length===0&&MODO_QUALIDADE==='qualificado') console.warn(`⚠️ ${instituicao.sigla}: fonte direta falhou. Modo qualificado chamará OpenAI com web_search para buscar fontes alternativas.`); await chamarOpenAI({instituicao,jsonAtual,paginasColetadas,houveMudanca,forcarAtualizacao:FORCAR_ATUALIZACAO}); }
const config=await carregarConfig(); const instituicoes=selecionarInstituicoes(config); console.log('Motor genérico de concursos iniciado.'); console.log(`Instituição selecionada: ${INSTITUICAO_ID}`); console.log(`Total a processar: ${instituicoes.length}`); console.log(`Modo de qualidade: ${MODO_QUALIDADE}`); console.log(`Score mínimo: ${MIN_SCORE_PUBLICACAO}`); console.log(`Publicar resultado qualificado com OpenAI: ${PUBLICAR_RESULTADO_QUALIFICADO_COM_OPENAI?'sim':'não'}`); for(const inst of instituicoes) await processarInstituicao(inst); console.log('\nExecução finalizada.');
