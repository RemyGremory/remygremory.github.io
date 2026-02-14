// PDF → Text (frontend-only)
// Uses PDF.js via CDN (ESM build). Worker is also loaded from CDN.

import * as pdfjsLib from 'https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.worker.min.mjs';

const els = {
  file: document.getElementById('file'),
  btnPick: document.getElementById('btnPick'),
  btnExtract: document.getElementById('btnExtract'),
  btnClear: document.getElementById('btnClear'),
  btnCopy: document.getElementById('btnCopy'),
  btnDownload: document.getElementById('btnDownload'),
  dropzone: document.getElementById('dropzone'),
  fileName: document.getElementById('fileName'),

  swAllPages: document.getElementById('swAllPages'),
  pages: document.getElementById('pages'),

  status: document.getElementById('status'),
  stats: document.getElementById('stats'),
  output: document.getElementById('output'),
};

let currentFile = null;

function t(key) {
  return window.UI?.t(key) || key;
}

function setStatus(key) {
  els.status.textContent = t(key);
}

function normalizeNewlines(text) {
  return (text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

// Removes PDF extraction control characters (incl. U+0002 shown as "")
function sanitizePdfText(text) {
  const s = text || '';
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    const keep = c === 9 || c === 10 || c === 13; // tab / LF / CR
    const isCtrl = (c >= 0 && c <= 31) || (c >= 127 && c <= 159);
    if (!isCtrl || keep) out += s[i];
  }
  return out;
}

function countStats(text) {
  const raw = normalizeNewlines(text || '');
  const trimmed = raw.trim();
  const lines = trimmed ? raw.split('\n').length : 0;
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  return { lines, words };
}

function parsePagesSpec(spec, maxPages) {
  const s = (spec || '').trim();
  if (!s) return Array.from({ length: maxPages }, (_, i) => i + 1);

  const pages = new Set();
  const parts = s.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const m = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) continue;

    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    const start = Math.min(a, b);
    const end = Math.max(a, b);

    for (let i = start; i <= end; i++) {
      if (i >= 1 && i <= maxPages) pages.add(i);
    }
  }

  const out = Array.from(pages).sort((x, y) => x - y);
  return out.length ? out : Array.from({ length: maxPages }, (_, i) => i + 1);
}

async function extractTextFromPdf(file, pagesSpec) {
  setStatus('tool.pdfToText.statusLoading');

  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;

  const pageNums = parsePagesSpec(pagesSpec, pdf.numPages);

  let out = '';
  for (let i = 0; i < pageNums.length; i++) {
    const n = pageNums[i];
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();

    const strings = content.items
      .map((it) => (it?.str || '').trim())
      .filter(Boolean);

    out += sanitizePdfText(strings.join(' '));
    if (i !== pageNums.length - 1) out += '\n\n';
  }

  return { text: out, pages: pageNums.length };
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
    window.UI?.toast(t('toast.copied') || 'Copied!');
  });
}

function setFile(file) {
  currentFile = file;
  els.fileName.textContent = file.name;
  setStatus('tool.pdfToText.statusReady');
}

function setAllPages(on) {
  els.swAllPages.classList.toggle('on', Boolean(on));
  els.pages.disabled = Boolean(on);
  if (on) els.pages.value = '';
}

function clearAll() {
  currentFile = null;
  els.file.value = '';
  els.fileName.textContent = '';
  setAllPages(true);
  els.pages.value = '';
  els.output.value = '';
  els.stats.textContent = '0 pages • 0 lines • 0 words';
  setStatus('tool.pdfToText.statusReady');
}

function bindDropzone() {
  const dz = els.dropzone;

  const onDragOver = (e) => {
    e.preventDefault();
    dz.classList.add('dragover');
  };

  const onDragLeave = () => dz.classList.remove('dragover');

  const onDrop = (e) => {
    e.preventDefault();
    dz.classList.remove('dragover');

    const f = e.dataTransfer?.files?.[0];
    if (!f) return;

    const isPdf =
      f.type === 'application/pdf' || (f.name || '').toLowerCase().endsWith('.pdf');
    if (!isPdf) return;

    setFile(f);
    window.UI?.toast(t('tool.pdfToText.dropped') || 'PDF loaded');
  };

  // dropzone itself
  dz.addEventListener('dragover', onDragOver);
  dz.addEventListener('dragleave', onDragLeave);
  dz.addEventListener('drop', onDrop);

  // allow dropping anywhere on the page
  window.addEventListener('dragover', onDragOver);
  window.addEventListener('drop', (e) => {
    if (e.target && dz.contains(e.target)) return;
    onDrop(e);
  });
  window.addEventListener('dragleave', onDragLeave);
}

async function onExtract() {
  try {
    if (!currentFile) {
      const f = els.file.files?.[0];
      if (f) setFile(f);
    }
    if (!currentFile) return;

    els.btnExtract.disabled = true;

    const pagesSpec = els.swAllPages?.classList.contains('on') ? '' : (els.pages.value || '');
    const { text, pages } = await extractTextFromPdf(currentFile, pagesSpec);

    els.output.value = text;

    const s = countStats(text);
    els.stats.textContent = `${pages} pages • ${s.lines} lines • ${s.words} words`;

    setStatus('tool.pdfToText.statusDone');
  } catch (e) {
    console.error(e);
    window.UI?.toast(String(e?.message || e || 'Error'));
    setStatus('tool.pdfToText.statusError');
  } finally {
    els.btnExtract.disabled = false;
  }
}

function init() {
  setStatus('tool.pdfToText.statusReady');

  els.btnPick.addEventListener('click', () => els.file.click());
  els.file.addEventListener('change', () => {
    const f = els.file.files?.[0];
    if (f) setFile(f);
  });

  // slider: All pages
  setAllPages(true);
  window.UI?.bindSwitch(els.swAllPages, (v) => setAllPages(v));

  // if user types pages, switch to custom mode
  els.pages.addEventListener('input', () => {
    if ((els.pages.value || '').trim()) setAllPages(false);
  });

  els.btnExtract.addEventListener('click', onExtract);
  els.btnClear.addEventListener('click', clearAll);
  els.btnCopy.addEventListener('click', copyOut);
  els.btnDownload.addEventListener('click', () => {
    downloadText('pdf-text.txt', els.output.value || '');
    window.UI?.toast(t('toast.downloaded') || 'Downloaded');
  });

  bindDropzone();
}

init();
