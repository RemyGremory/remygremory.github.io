const STORAGE_KEY_LANG = 'toolsHubLang';

const translations = {
  en: {
    'hub.title': 'Tools Hub',
    'hub.subtitle': 'Small utilities, zero backend.',
    'hub.heroTitle': 'Welcome',
    'hub.heroText': 'Pick a tool below. Everything runs locally in your browser.',
    'hub.noteTitle': 'Note',
    'hub.noteText': 'This project is static and designed for GitHub Pages.',

    'tool.textCleaner.title': 'Text Cleaner',
    'tool.textCleaner.desc': 'Clean, format, and normalize text.',


    'tool.textCleaner.optionsTitle': 'Options',
    'tool.textCleaner.notesTitle': 'Notes',
    'tool.textCleaner.run': 'Run',
    'tool.textCleaner.case': 'Case',
    'tool.textCleaner.opt.trim': 'Trim lines',
    'tool.textCleaner.opt.collapseSpaces': 'Collapse spaces',
    'tool.textCleaner.opt.removeEmpty': 'Remove empty lines',
    'tool.textCleaner.opt.collapseEmpty': 'Collapse empty lines',
    'tool.textCleaner.opt.join': 'Join lines',
    'tool.textCleaner.opt.dedupe': 'Deduplicate lines',
    'tool.textCleaner.note1': 'Works entirely in your browser',
    'tool.textCleaner.note2': 'No backend, safe for sensitive text',
    'tool.textCleaner.note3': 'Edits apply instantly while typing',
'tool.pdfToText.title': 'PDF → Text',
    'tool.pdfToText.desc': 'Extract text from a PDF locally in your browser.',
    'tool.pdfToText.pick': 'Choose PDF',
    'tool.pdfToText.drop': '…or drop it here',
    'tool.pdfToText.pages': 'Pages',
    'tool.pdfToText.pagesHint': 'e.g. 1-3,7',
    'tool.pdfToText.extract': 'Extract',
    'tool.pdfToText.clear': 'Clear',
    'tool.pdfToText.statusReady': 'Ready',
    'tool.pdfToText.statusLoading': 'Loading PDF…',
    'tool.pdfToText.statusDone': 'Done',
    'tool.pdfToText.statusError': 'Failed to read PDF',

    'ad.top': 'Ad space',
    'ad.side': 'Ad space',

    'common.back': 'Back',
    'common.copy': 'Copy',
    'common.download': 'Download',
    'common.sample': 'Sample',
    'common.clear': 'Clear',

    'toast.copied': 'Copied!',
    'toast.downloaded': 'Downloaded',

    'tool.textCleaner.removeLabel': 'Remove',
    'tool.textCleaner.removePh': 'word / symbol',

    'tool.pdfToText.all': 'All',
    'tool.pdfToText.selectAll': 'All pages',
    'tool.pdfToText.custom': 'Custom',
    'tool.pdfToText.dropped': 'PDF loaded',

  },
  ru: {
    'hub.title': 'Хаб инструментов',
    'hub.subtitle': 'Небольшие утилиты без бэкенда.',
    'hub.heroTitle': 'Добро пожаловать',
    'hub.heroText': 'Выбери инструмент ниже. Всё работает локально в браузере.',
    'hub.noteTitle': 'Заметка',
    'hub.noteText': 'Проект статический и рассчитан на GitHub Pages.',

    'tool.textCleaner.title': 'Очистка текста',
    'tool.textCleaner.desc': 'Чистка, форматирование и нормализация текста.',


    'tool.textCleaner.optionsTitle': 'Настройки',
    'tool.textCleaner.notesTitle': 'Заметки',
    'tool.textCleaner.run': 'Запустить',
    'tool.textCleaner.case': 'Регистр',
    'tool.textCleaner.opt.trim': 'Обрезать пробелы по краям',
    'tool.textCleaner.opt.collapseSpaces': 'Сжать повторные пробелы',
    'tool.textCleaner.opt.removeEmpty': 'Удалить пустые строки',
    'tool.textCleaner.opt.collapseEmpty': 'Сжать пустые строки',
    'tool.textCleaner.opt.join': 'Склеить строки',
    'tool.textCleaner.opt.dedupe': 'Удалить дубликаты строк',
    'tool.textCleaner.note1': 'Работает полностью в браузере',
    'tool.textCleaner.note2': 'Без бэкенда — безопасно для чувствительных текстов',
    'tool.textCleaner.note3': 'Изменения применяются сразу при наборе',
    'tool.pdfToText.title': 'PDF → Текст',
    'tool.pdfToText.desc': 'Извлекай текст из PDF локально в браузере.',
    'tool.pdfToText.pick': 'Выбрать PDF',
    'tool.pdfToText.drop': '…или перетащи файл сюда',
    'tool.pdfToText.pages': 'Страницы',
    'tool.pdfToText.pagesHint': 'например 1-3,7',
    'tool.pdfToText.extract': 'Извлечь',
    'tool.pdfToText.clear': 'Очистить',
    'tool.pdfToText.statusReady': 'Готово',
    'tool.pdfToText.statusLoading': 'Загружаю PDF…',
    'tool.pdfToText.statusDone': 'Готово',
    'tool.pdfToText.statusError': 'Не удалось прочитать PDF',

    'ad.top': 'Место под рекламу',
    'ad.side': 'Место под рекламу',

    'common.back': 'Назад',
    'common.copy': 'Скопировать',
    'common.download': 'Скачать',
    'common.sample': 'Пример',
    'common.clear': 'Очистить',

    'toast.copied': 'Скопировано!',
    'toast.downloaded': 'Файл скачан',

    'tool.textCleaner.removeLabel': 'Убрать',
    'tool.textCleaner.removePh': 'слово / символ',

    'tool.pdfToText.all': 'Все',
    'tool.pdfToText.selectAll': 'Все страницы',
    'tool.pdfToText.custom': 'Выбрать',
    'tool.pdfToText.dropped': 'PDF загружен',

  },
};

function getLang() {
  return localStorage.getItem(STORAGE_KEY_LANG) || 'en';
}

function setLang(lang) {
  localStorage.setItem(STORAGE_KEY_LANG, lang);
  applyLang(lang);
  syncLangButtons(lang);
}

function applyLang(lang) {
  const dict = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });


  document.documentElement.lang = lang;
}

function syncLangButtons(lang) {
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

function toast(msg, ms = 1400) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  window.clearTimeout(toast._timer);
  toast._timer = window.setTimeout(() => t.classList.remove('show'), ms);
}

// Custom dropdown helper
function createDropdown(rootEl) {
  const btn = rootEl.querySelector('[data-dd-btn]');
  const menu = rootEl.querySelector('[data-dd-menu]');
  const label = rootEl.querySelector('[data-dd-label]');

  const close = () => menu.classList.remove('open');
  const open = () => menu.classList.add('open');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  menu.addEventListener('click', (e) => {
    const item = e.target.closest('[data-dd-value]');
    if (!item) return;
    const value = item.getAttribute('data-dd-value');
    const text = item.getAttribute('data-dd-text') || item.textContent.trim();

    rootEl.dispatchEvent(new CustomEvent('change', { detail: { value } }));
    if (label) label.textContent = text;

    close();
  });

  document.addEventListener('click', close);

  return { open, close };
}

// Toggle helper
function bindSwitch(el, onChange) {
  el.addEventListener('click', () => {
    el.classList.toggle('on');
    onChange?.(el.classList.contains('on'));
  });
}

// boot
(function initUI() {
  const lang = getLang();
  applyLang(lang);
  syncLangButtons(lang);

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
  });

  // expose helpers globally for tools
  window.UI = {
    getLang,
    setLang,
    applyLang,
    toast,
    createDropdown,
    bindSwitch,
    t: (key) => (translations[getLang()]?.[key] || translations.en?.[key] || key),
  };
})();