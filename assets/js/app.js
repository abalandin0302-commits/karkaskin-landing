/* =========================================================
   КАРКАСКИН — общая логика интерфейса
   ========================================================= */
import { CONFIG } from './config.js';

/* ---------- утилиты ---------- */
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function fmt(n) {
  return new Intl.NumberFormat('ru-RU').format(Math.round(n));
}
export function money(n) {
  return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
}
export function plural(n, one, few, many) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}

/* ---------- тост ---------- */
let toastEl;
export function toast(msg, ms = 4200) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.innerHTML = `<span>${msg}</span>`;
  requestAnimationFrame(() => toastEl.classList.add('is-on'));
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove('is-on'), ms);
}

/* ---------- шапка / меню ---------- */
function initHeader() {
  const header = $('.header');
  const burger = $('.burger');
  const mobile = $('.mobile-menu');
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('is-active');
      mobile.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', mobile).forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('is-active');
      mobile.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }
  /* выпадающие меню — по наведению (десктоп) и по клику (мобильный) */
  $$('.nav__item.has-dd').forEach(item => {
    const link = $('.nav__link', item);
    const open = () => {
      $$('.nav__item.has-dd').forEach(i => { if (i !== item) i.classList.remove('is-open'); });
      item.classList.add('is-open');
    };
    const close = () => item.classList.remove('is-open');
    link.addEventListener('click', e => {
      e.preventDefault();
      item.classList.contains('is-open') ? close() : open();
    });
    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);
    document.addEventListener('click', e => { if (!item.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  });
  /* активный пункт по текущему пути */
  const path = location.pathname;
  $$('.nav__link, .dropdown a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href !== '/' && path.startsWith(href.split('#')[0]) && href.split('#')[0].length > 1) {
      a.classList.add('is-active');
      const parent = a.closest('.nav__item');
      if (parent) $('.nav__link', parent).classList.add('is-active');
    }
  });
}

/* ---------- вкладки ---------- */
export function initTabs(root = document) {
  $$('[data-tabs]', root).forEach(box => {
    const btns = $$('.tabs button', box);
    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const target = btn.dataset.tab;
      $$('.tab-panel', box).forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
    }));
  });
}

/* ---------- появление при скролле ---------- */
export function initReveal(root = document) {
  const items = $$('.reveal', root);
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('is-in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((i, idx) => {
    i.style.transitionDelay = Math.min(idx % 6, 5) * 60 + 'ms';
    io.observe(i);
  });
}

/* ---------- отправка заявок ---------- */
export function buildMessage(data, extra = {}) {
  const order = ['name', 'surname', 'phone', 'email', 'comment', 'project'];
  const labels = {
    name: 'Имя', surname: 'Фамилия', phone: 'Телефон', email: 'E-mail',
    comment: 'Комментарий', project: 'Проект', region: 'Регион строительства',
    length: 'Длина здания', span: 'Ширина здания (пролёт)', floors: 'Этажность',
    roof: 'Тип крыши', species: 'Порода древесины', eave: 'Свесы',
    slope: 'Уклон', step: 'Шаг ферм', insulation: 'Утеплитель',
    covering: 'Покрытие кровли', snow: 'Снеговой район',
    area: 'Площадь', trusses: 'Стропильных ферм', plates: 'МЗП, шт',
    woodVol: 'Объём древесины, м³', weight: 'Вес конструкций, кг',
    price: 'Ориентировочная стоимость', days: 'Срок изготовления, дн',
    chord: 'Сечение пояса',
  };
  const lines = [];
  for (const k of order) {
    if (data[k] !== undefined && data[k] !== '' && data[k] !== null) {
      lines.push(`${labels[k] || k}: ${data[k]}`);
    }
  }
  for (const [k, v] of Object.entries(extra)) {
    if (v !== undefined && v !== null && v !== '') lines.push(`${labels[k] || k}: ${v}`);
  }
  return lines.join('\n');
}

export async function sendLead(text, payload = {}) {
  const body = { text, payload };
  if (CONFIG.proxyEndpoint) {
    const r = await fetch(CONFIG.proxyEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error('proxy ' + r.status);
    return 'sent';
  }
  if (CONFIG.telegramToken && CONFIG.telegramChatId) {
    const r = await fetch(`https://api.telegram.org/bot${CONFIG.telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CONFIG.telegramChatId, text, disable_web_page_preview: true }),
    });
    if (!r.ok) throw new Error('telegram ' + r.status);
    return 'sent';
  }
  if (CONFIG.formEndpoint) {
    const r = await fetch(CONFIG.formEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('form ' + r.status);
    return 'sent';
  }
  return 'demo';
}

export function initForms() {
  $$('form[data-form]').forEach(form => {
    const ok = $('.form-ok', form);
    const err = $('.form-err', form);
    const btn = $('button[type=submit]', form);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      err?.classList.remove('is-on');
      ok?.classList.remove('is-on');

      const fd = new FormData(form);
      const data = {};
      for (const [k, v] of fd.entries()) data[k] = v;

      const name = (data.name || '').trim();
      const phone = (data.phone || '').trim();
      const consent = form.querySelector('input[name=consent]');
      if (!name) return fail(err, 'Укажите имя');
      if (phone.replace(/\D/g, '').length < 10) return fail(err, 'Укажите корректный телефон');
      if (consent && !consent.checked) return fail(err, 'Нужно согласие на обработку персональных данных');

      const extra = {};
      const specEl = form.querySelector('[data-spec]');
      if (specEl) {
        try { Object.assign(extra, JSON.parse(specEl.value || '{}')); } catch (_) {}
      }
      const text = buildMessage(data, extra);

      btn?.classList.add('is-loading');
      try {
        const res = await sendLead(text, { ...data, ...extra, source: form.dataset.form });
        if (res === 'demo') {
          const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Заявка с сайта karkaskin.ru')}&body=${encodeURIComponent(text)}`;
          window.location.href = mailto;
          fail(err, 'Форма работает в демо-режиме: открылось письмо на ' + CONFIG.email + '. Подключите Telegram-бота в assets/js/config.js.');
        } else {
          form.reset();
          ok?.classList.add('is-on');
          toast('Заявка отправлена — ответим в течение рабочего дня');
        }
      } catch (ex) {
        fail(err, 'Не удалось отправить заявку. Позвоните нам: ' + CONFIG.phone);
      } finally {
        btn?.classList.remove('is-loading');
      }
    });
  });
}
function fail(el, msg) {
  if (!el) { toast(msg); return; }
  el.textContent = msg;
  el.classList.add('is-on');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---------- копирование текста ---------- */
export function initCopy() {
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const txt = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(txt);
      toast('Скопировано');
    } catch (_) { toast('Не удалось скопировать'); }
  }));
}

/* ---------- год в подвале ---------- */
function initYear() {
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}

/* ---------- запуск ---------- */
export function boot() {
  initHeader();
  initTabs();
  initReveal();
  initForms();
  initCopy();
  initYear();
}
document.addEventListener('DOMContentLoaded', boot);
