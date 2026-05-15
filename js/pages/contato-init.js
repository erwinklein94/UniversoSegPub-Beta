/* Módulo organizado por responsabilidade — Contato, contador e inicialização.
   Mantém a ordem original para preservar compatibilidade. */

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
  aplicarEstruturaEstadosFaltantesNoHtml();

  // Monta os seletores internos das abas institucionais, sem escolher PMESP automaticamente.
  if (typeof montarSeletoresConsultaInstituicao === 'function') montarSeletoresConsultaInstituicao();

  // Aplica o cabeçalho inicial do portal; a instituição específica só entra após escolha do usuário.
  aplicarHeaderInicialPortal();
  if (typeof prepararSelectInstituicaoHome === 'function') prepararSelectInstituicaoHome();
  if (typeof limparConsultaInstitucionalInicial === 'function') limparConsultaInstitucionalInicial();

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
