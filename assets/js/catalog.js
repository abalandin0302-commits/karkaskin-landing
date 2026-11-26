/* =========================================================
   КАРКАСКИН — каталог проектов
   ========================================================= */
import { fmt } from './app.js';

/* база = каталог этого файла, не зависит от глубины страницы (корень сайта или /karkaskin-landing/) */
const __JSBASE = new URL('./', import.meta.url).href;

const CATS = [
  { key: 'all', label: 'Все проекты' },
  { key: 'house', label: 'Дома' },
  { key: 'bath', label: 'Бани' },
  { key: 'garage', label: 'Гаражи' },
];

let ITEMS = [];
let IMG_MAP = {};

async function load() {
  const [c, im] = await Promise.all([
    fetch(new URL('../../data/catalog.json', __JSBASE)).then(r => r.json()),
    fetch(new URL('../../data/product-images.json', __JSBASE)).then(r => r.json()).catch(() => ({ index: [] })),
  ]);
  ITEMS = c.items || [];
  IMG_MAP = {};
  (im.index || []).forEach(row => { IMG_MAP[row.slug] = row.files || []; });
  return ITEMS;
}

export function itemImages(slug) {
  const local = IMG_MAP[slug] || [];
  if (local.length) return local.map(f => f.file);
  const it = ITEMS.find(i => i.slug === slug);
  return (it?.images || []).slice(0, 3);
}
export function itemCover(slug) {
  const imgs = itemImages(slug);
  return imgs[0] || new URL('../img/brand/logo.png', __JSBASE).href;
}

function card(it) {
  const cover = itemCover(it.slug);
  const meta = [];
  if (it.area) meta.push(`${it.area} м²`);
  if (it.floors) meta.push(`${it.floors} ${it.floors === 1 ? 'этаж' : 'этажа'}`);
  if (it.dimensions) meta.push(it.dimensions);
  return `
  <a class="prod reveal" href="product.html?id=${encodeURIComponent(it.slug)}">
    <div class="prod__media">
      <img src="${cover}" alt="${(it.title || '').replace(/"/g, '&quot;')}" loading="lazy" width="600" height="450">
      <span class="chip chip--wood media__tag">${it.code || ''}</span>
    </div>
    <div class="prod__body">
      <div class="prod__name">${it.title || it.code}</div>
      <div class="prod__meta">${meta.map(m => `<span class="chip chip--dot">${m}</span>`).join('')}</div>
      <div class="prod__foot"><span>По запросу</span><b>Подробнее →</b></div>
    </div>
  </a>`;
}

export function renderCatalog() {
  const grid = document.querySelector('[data-catalog-grid]');
  if (!grid) return;
  const counter = document.querySelector('[data-catalog-count]');

  function draw(cat) {
    const list = ITEMS.filter(i => cat === 'all' || i.category === cat);
    grid.innerHTML = list.map(card).join('');
    if (counter) counter.textContent = list.length;
    grid.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
  }

  const filters = document.querySelector('[data-catalog-filters]');
  if (filters) {
    filters.innerHTML = CATS.map((c, i) =>
      `<button type="button" data-cat="${c.key}" class="${i === 0 ? 'is-active' : ''}">${c.label}</button>`).join('');
    filters.addEventListener('click', e => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      filters.querySelectorAll('button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      draw(b.dataset.cat);
    });
  }
  draw('all');
}

export function renderProduct() {
  const box = document.querySelector('[data-product]');
  if (!box) return;
  const id = new URLSearchParams(location.search).get('id');
  const it = ITEMS.find(i => i.slug === id);
  if (!it) {
    box.innerHTML = '<div class="card"><h3 class="h-3">Проект не найден</h3><p class="muted">Вернитесь в <a href="./index.html">каталог</a> и выберите проект.</p></div>';
    return;
  }
  document.title = `${it.title} — Каркаскин`;
  const imgs = itemImages(it.slug);
  const specs = [];
  if (it.code) specs.push(['Шифр проекта', it.code]);
  if (it.area) specs.push(['Общая площадь', it.area + ' м²']);
  if (it.floors) specs.push(['Этажность', it.floors === 1 ? '1 этаж' : it.floors + ' этажа']);
  if (it.dimensions) specs.push(['Размер дома', it.dimensions]);
  specs.push(['Стоимость', 'по запросу']);

  box.innerHTML = `
    <div class="grid g-2" style="align-items:start">
      <div>
        <div class="media" style="aspect-ratio:4/3">
          <img id="pmain" src="${imgs[0] || ''}" alt="${(it.title || '').replace(/"/g, '&quot;')}" width="800" height="600">
        </div>
        ${imgs.length > 1 ? `<div class="grid g-4" style="margin-top:12px;gap:10px">
          ${imgs.map((src, i) => `<button type="button" class="media" data-thumb="${src}" style="aspect-ratio:1/1;border:1px solid var(--line);padding:0;cursor:pointer"><img src="${src}" alt="" loading="lazy" width="200" height="200"></button>`).join('')}
        </div>` : ''}
      </div>
      <div>
        <span class="chip chip--wood">${it.code || ''}</span>
        <h1 class="h-1" style="margin:14px 0 16px">${it.title}</h1>
        <p class="lead">${it.summary || ''}</p>
        <div class="card" style="margin:24px 0">
          <table class="table"><tbody>
            ${specs.map(([k, v]) => `<tr><th style="width:45%">${k}</th><td><b>${v}</b></td></tr>`).join('')}
          </tbody></table>
        </div>
        ${(it.features || []).length ? `<h3 class="h-3" style="margin-bottom:14px">Особенности проекта</h3>
        <ul class="grid" style="gap:10px;margin-bottom:28px">
          ${it.features.map(f => `<li style="display:flex;gap:10px;align-items:flex-start"><span style="color:var(--wood);font-weight:800">✓</span><span>${f}</span></li>`).join('')}
        </ul>` : ''}
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn" href="/contacts/?project=${encodeURIComponent(it.title)}">Запросить расчёт этого проекта</a>
          <a class="btn btn--ghost" href="./index.html">Все проекты</a>
        </div>
      </div>
    </div>`;

  const main = box.querySelector('#pmain');
  box.querySelectorAll('[data-thumb]').forEach(b => b.addEventListener('click', () => {
    main.src = b.dataset.thumb;
  }));
}

/* автозапуск */
document.addEventListener('DOMContentLoaded', async () => {
  if (document.querySelector('[data-catalog-grid]') || document.querySelector('[data-product]')) {
    await load();
    renderCatalog();
    renderProduct();
  }
});
