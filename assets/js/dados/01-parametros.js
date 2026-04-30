/* =======================================================
   BLOCO 15 — JAVASCRIPT / DADOS E FUNCIONALIDADES
   Dados das instituições, cálculos, navegação, tema,
   formulários, geração de resultados e contato.
   ======================================================= */

/* BLOCO 15.1 — Constantes oficiais e parâmetros legais 2026 */
/* ============================================================ */
/* === CONSTANTES OFICIAIS 2026 ================================ */
/* ============================================================ */
const UFESP_2026 = 38.42;            // Comunicado DICAR-88/2025 - Sefaz-SP
const AUX_ALIM_SP_DIA_PADRAO = UFESP_2026; // Padrão adotado: 1 UFESP por dia efetivamente trabalhado
const AUX_ALIM_MG_DIA_PADRAO = 50.00;      // Decreto MG 49.006/2025
const AUX_ALIM_BA_40H = 440.00;            // Decreto BA 22.863/2024
const AUX_ALIM_BA_30H = 286.00;            // Decreto BA 22.863/2024
const AUX_ALIM_RJ_PM = 433.80;             // Decreto RJ 50.081/2026 (PMERJ)
const AUX_ALIM_PR_PADRAO = 834.74;         // Lei PR 22.208/2024 — auxílio-alimentação dos servidores ativos
const AUX_ALIM_RS_BM = 400.00;              // Editais BM/RS 2025 — auxílio-alimentação informado para Soldado e Oficialato
const AUX_ALIM_SC_PADRAO = 550.00;          // Lei SC 18.796/2023, com redação da Lei 19.059/2024 — auxílio-alimentação de 40h
const AUX_ALIM_ES_PADRAO = 800.00;          // PCES/OIP 2025 — auxílio-alimentação informado oficialmente; usado como referência ES, sem somar automaticamente ao bruto
const FASPM_PR_TITULAR = 0.005;            // Lei PR 17.169/2012 — 0,5% do subsídio (facultativo)
const FASPM_PR_DEPENDENTE = 0.002;         // Lei PR 17.169/2012 — 0,2% por dependente
const FASPM_PR_LIMITE = 0.02;              // Limite de 2% do subsídio
const SAL_MIN_2026 = 1621.00;        // Decreto 12.797/2025
const ALIQ_PREV = 0.14;
const ALIQ_IPSM = 0.105;
const STORAGE_KEY = 'usegpub_form_v2';
const STORAGE_KEY_CENARIO = 'usegpub_cenario_calc_v1';

/* === IRRF 2026 (tabela progressiva mensal) === */
/* BLOCO 15.2 — Tabela de IRRF e parâmetros do imposto */
const IRRF_FAIXAS = [
  { ate: 2428.80, aliq: 0,     ded: 0      },
  { ate: 2826.65, aliq: 0.075, ded: 182.16 },
  { ate: 3751.05, aliq: 0.15,  ded: 394.16 },
  { ate: 4664.68, aliq: 0.225, ded: 675.49 },
  { ate: Infinity, aliq: 0.275, ded: 908.73 }
];
const IRRF_DEP_DEDUCAO = 189.59;
const IRRF_DESCONTO_SIMPLIFICADO = 607.20; // 25% da faixa mensal isenta da tabela progressiva (R$ 2.428,80)
let ultimoDetalheIRRF = null;
/* Redutor mensal da Lei 15.270/2025 */
const IRRF_REDUTOR_LIM_TOTAL = 5000.00;
const IRRF_REDUTOR_LIM_PARC  = 7350.00;
const IRRF_REDUTOR_FORMULA_A = 978.62;
const IRRF_REDUTOR_FORMULA_B = 0.133145;

/* ============================================================ */
/* === DADOS DE CARGOS (PADRÃO + GRATIF + RETP FATOR) ========== */
/* ============================================================ */
