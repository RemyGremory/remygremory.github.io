// Text Cleaner tool logic

const els = {
  input: document.getElementById('input'),
  output: document.getElementById('output'),
  statsIn: document.getElementById('statsIn'),
  statsOut: document.getElementById('statsOut'),

  swTrim: document.getElementById('swTrim'),
  swCollapseSpaces: document.getElementById('swCollapseSpaces'),
  swRemoveEmpty: document.getElementById('swRemoveEmpty'),
  swCollapseEmpty: document.getElementById('swCollapseEmpty'),
  swJoin: document.getElementById('swJoin'),
  swDedupe: document.getElementById('swDedupe'),

  removeWhat: document.getElementById('removeWhat'),

  ddCase: document.getElementById('ddCase'),


  btnRun: document.getElementById('btnRun'),
  btnCopy: document.getElementById('btnCopy'),
  btnDownload: document.getElementById('btnDownload'),
  btnSample: document.getElementById('btnSample'),
  btnClear: document.getElementById('btnClear'),
};

const state = {
  trim: false,
  collapseSpaces: false,
  removeEmpty: false,
  collapseEmpty: false,
  join: false,
  dedupe: false,
  caseMode: 'none',
};

function countStats(text) {
  const lines = text.length ? text.split(/\r?\n/).length : 0;
  const words = text.trim().length ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  return { lines, words };
}

function renderStats() {
  const a = countStats(els.input.value);
  const b = countStats(els.output.value);

  els.statsIn.textContent = `${a.lines} lines • ${a.words} words`;
  els.statsOut.textContent = `${b.lines} lines • ${b.words} words`;
}

function applyCase(s, mode) {
  if (mode === 'lower') return s.toLowerCase();
  if (mode === 'upper') return s.toUpperCase();
  if (mode === 'title') {
    return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  return s;
}

function run() {
  let text = els.input.value || '';

  // normalize line endings
  text = text.replace(/\r\n/g, '\n');
  // custom remove: literal substrings; multiple values separated by comma or newline
  const removeRaw = (els.removeWhat?.value || '').trim();
  if (removeRaw) {
    const parts = removeRaw
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

    const escapeRegExp = (s) => String(s).replace(/[.*+?^{}()|[\]\\]/g, '\\$&');

    for (const p of parts) {
      text = text.replace(new RegExp(escapeRegExp(p), 'g'), '');
    }
  }


  let lines = text.split('\n');

  if (state.trim) {
    lines = lines.map((l) => l.trim());
  }

  if (state.collapseSpaces) {
    lines = lines.map((l) => l.replace(/\s+/g, ' ').trim());
  }

  if (state.removeEmpty) {
    lines = lines.filter((l) => l.trim() !== '');
  }

  if (state.collapseEmpty) {
    const out = [];
    let prevEmpty = false;
    for (const l of lines) {
      const empty = l.trim() === '';
      if (empty && prevEmpty) continue;
      out.push(l);
      prevEmpty = empty;
    }
    lines = out;
  }

  if (state.dedupe) {
    const seen = new Set();
    const out = [];
    for (const l of lines) {
      if (seen.has(l)) continue;
      seen.add(l);
      out.push(l);
    }
    lines = out;
  }

  if (state.join) {
    // join into a single line (space-separated)
    lines = [lines.join(' ').replace(/\s+/g, ' ').trim()];
  }

  // apply case
  lines = lines.map((l) => applyCase(l, state.caseMode));

  els.output.value = lines.join('\n');
  renderStats();
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function copyOut() {
  const text = els.output.value || '';
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    window.UI?.toast(window.UI?.t('toast.copied') || 'Copied!');
  });
}

function setSwitch(swEl, value) {
  swEl.classList.toggle('on', Boolean(value));
}

function bindSwitch(swEl, key) {
  swEl.addEventListener('click', () => {
    state[key] = !state[key];
    swEl.classList.toggle('on', state[key]);
    run();
  });
}

function init() {
  // switches
  bindSwitch(els.swTrim, 'trim');
  bindSwitch(els.swCollapseSpaces, 'collapseSpaces');
  bindSwitch(els.swRemoveEmpty, 'removeEmpty');
  bindSwitch(els.swCollapseEmpty, 'collapseEmpty');
  bindSwitch(els.swJoin, 'join');
  bindSwitch(els.swDedupe, 'dedupe');

  // dropdown
  const dd = window.UI?.createDropdown(els.ddCase);
  els.ddCase.addEventListener('change', (e) => {
    state.caseMode = e.detail.value;
    run();
  });

  // buttons
  els.btnRun.addEventListener('click', run);
  els.btnCopy.addEventListener('click', copyOut);
  els.btnDownload.addEventListener('click', () => {
    downloadText('cleaned.txt', els.output.value || '');
    window.UI?.toast(window.UI?.t('toast.downloaded') || 'Downloaded');
  });

  els.btnSample.addEventListener('click', () => {
    els.input.value = `  Hello   world!\n\nThis   is   a   sample.\n\n\nLine 3\nLine 3\n`;
    run();
  });

  els.btnClear.addEventListener('click', () => {
    els.input.value = '';
    els.output.value = '';
    renderStats();
  });

  // live stats
  els.input.addEventListener('input', renderStats);
  els.output.addEventListener('input', renderStats);

  els.removeWhat?.addEventListener('input', () => {
    run();
  });


  // defaults
  setSwitch(els.swTrim, state.trim);
  setSwitch(els.swCollapseSpaces, state.collapseSpaces);
  setSwitch(els.swRemoveEmpty, state.removeEmpty);
  setSwitch(els.swCollapseEmpty, state.collapseEmpty);
  setSwitch(els.swJoin, state.join);
  setSwitch(els.swDedupe, state.dedupe);

  renderStats();
}

init();