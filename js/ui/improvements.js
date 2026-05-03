/* =======================================================
   improvements.js
   Refinamentos de comportamento da nova interface.
   - Atualiza o chip de "instituição selecionada" da sidebar
     sempre que o usuário troca o select da sidebar ou do
     header, lendo o brasão e o nome a partir da própria
     <option> selecionada.
   - Também sincroniza o chip quando o JS principal do site
     altera programaticamente o body[data-inst].
   ======================================================= */

(function () {
  'use strict';

  var DEFAULT_LOGO = 'img/LOGO/logoleao.webp';
  var DEFAULT_NAME = 'Universo Segurança Pública';
  var DEFAULT_HINT = 'Escolha uma instituição abaixo';

  // Mapa de prefixos (sigla → caminho da pasta de imagens)
  var FOLDER_MAP = {
    'pm': 'MILITAR',
    'bm': 'BOMBEIRO',
    'pc': 'CIVIL',
    'pp': 'PENAL'
  };

  function getElement(id) {
    return document.getElementById(id);
  }

  function inferInstitutionState(value) {
    if (!value || typeof value !== 'string') return '';
    // Captura UF a partir das duas últimas letras do código
    var match = value.match(/[a-z]{2}$/i);
    return match ? match[0].toUpperCase() : '';
  }

  function findOptionLabel(select, value) {
    if (!select || !value) return '';
    var opt = select.querySelector('option[value="' + value + '"]');
    return opt ? (opt.textContent || '').trim() : '';
  }

  function findOptgroupLabel(select, value) {
    if (!select || !value) return '';
    var opt = select.querySelector('option[value="' + value + '"]');
    if (!opt) return '';
    var parent = opt.parentElement;
    if (parent && parent.tagName && parent.tagName.toLowerCase() === 'optgroup') {
      return parent.getAttribute('label') || '';
    }
    return '';
  }

  function updateChip(instValue) {
    var chip = getElement('sidebar-current-chip');
    var imgEl = getElement('sidebar-current-chip-img');
    var nameEl = getElement('sidebar-current-chip-name');
    var stateEl = getElement('sidebar-current-chip-state');
    if (!chip || !imgEl || !nameEl || !stateEl) return;

    if (!instValue || instValue === 'portal' || instValue === '') {
      imgEl.src = DEFAULT_LOGO;
      imgEl.alt = 'Logo do portal';
      nameEl.textContent = DEFAULT_NAME;
      stateEl.textContent = DEFAULT_HINT;
      return;
    }

    // Tenta achar o select que contém este valor
    var sidebarSelect = getElement('instituicao');
    var headerSelect = getElement('instituicao_header');
    var label = findOptionLabel(sidebarSelect, instValue) ||
                findOptionLabel(headerSelect, instValue);
    var state = findOptgroupLabel(sidebarSelect, instValue) ||
                findOptgroupLabel(headerSelect, instValue) ||
                inferInstitutionState(instValue);

    if (label) {
      // Padrão "PMESP - Polícia Militar" → divide em sigla + nome
      var dashIdx = label.indexOf(' - ');
      var sigla = dashIdx > -1 ? label.substring(0, dashIdx) : label;
      nameEl.textContent = sigla;
    } else {
      nameEl.textContent = instValue.toUpperCase();
    }
    stateEl.textContent = state || '';

    // Atualiza imagem do brasão (tenta a mesma fonte que o header usa)
    var headerFlag = getElement('header-active-flag');
    if (headerFlag && headerFlag.getAttribute('src')) {
      imgEl.src = headerFlag.getAttribute('src');
      imgEl.alt = 'Brasão da instituição ' + (label || instValue);
    } else {
      // Fallback: monta caminho a partir do prefixo
      var prefix = instValue.substring(0, 2).toLowerCase();
      var folder = FOLDER_MAP[prefix];
      if (folder) {
        var uf = inferInstitutionState(instValue);
        if (uf) {
          imgEl.src = 'img/' + folder + '/brasao' + uf + '.webp';
          imgEl.alt = 'Brasão da instituição ' + instValue.toUpperCase();
          imgEl.onerror = function () {
            imgEl.onerror = null;
            imgEl.src = DEFAULT_LOGO;
          };
        }
      }
    }
  }

  function readCurrentInst() {
    var body = document.body;
    return body ? (body.getAttribute('data-inst') || '') : '';
  }

  function bindEvents() {
    var sidebarSelect = getElement('instituicao');
    var headerSelect = getElement('instituicao_header');

    function onChange(ev) {
      if (ev && ev.target && ev.target.value) {
        updateChip(ev.target.value);
      } else {
        updateChip(readCurrentInst());
      }
    }

    if (sidebarSelect) sidebarSelect.addEventListener('change', onChange);
    if (headerSelect) headerSelect.addEventListener('change', onChange);

    // Observa alterações do atributo data-inst do <body>
    if (window.MutationObserver) {
      var obs = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].attributeName === 'data-inst') {
            updateChip(readCurrentInst());
            return;
          }
        }
      });
      obs.observe(document.body, { attributes: true, attributeFilter: ['data-inst'] });
    }
  }

  function init() {
    bindEvents();
    updateChip(readCurrentInst());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
