/* =========================================================
   КАРКАСКИН — интерфейс 3D-конструктора (доработанная версия)
   + пресеты готовых проектов
   + троттлинг пересчёта при движении слайдеров
   + CTA «Оставить заявку» с передачей параметров в форму
   Один и тот же файл работает на karkaskin (data-configurator)
   и в самодостаточном бандле k3d.js (data-k3d, data-accent).
   ========================================================= */
import { createViewer, computeSpec, DEFAULTS, PRESETS, ROOFS, SPECIES, COVERING, SNOW } from './configurator.js';
import { fmt, money, toast } from './app.js';

const ICON = {
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
  rotate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><ellipse cx="12" cy="12" rx="9" ry="3.6"/><path d="M12 3v18" opacity=".45"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.2"/></svg>',
  roof: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10.5V20h14v-9.5"/></svg>',
};

const TOOLS = [
  ['roof', 'Кровля', 'Скрыть кровлю и увидеть фермы'],
  ['rotate', 'Вращение', 'Авто-вращение'],
  ['reset', 'Сброс вида', 'Вернуть камеру в исходное положение'],
  ['camera', 'Картинка', 'Сохранить картинку модели'],
];

const floorsLabel = n => `${n} ${n === 1 ? 'этаж' : 'этажа'}`;

/* слайдер с текущим значением и метками диапазона */
function rangeHTML(key, label, min, max, step, value, unit) {
  return `
      <div class="field">
        <label class="cfg__label" for="cfg-${key}"><span>${label}</span><span class="cfg__val" data-out="${key}"></span></label>
        <input class="range" type="range" id="cfg-${key}" min="${min}" max="${max}" step="${step}" value="${value}" data-set="${key}">
        <div class="cfg__range"><span>${min} ${unit}</span><span>${max} ${unit}</span></div>
      </div>`;
}

function panelHTML(p) {
  const presetBtns = Object.entries(PRESETS).map(([k, v]) =>
    `<button type="button" data-preset="${k}" title="${v.desc}">${v.label}</button>`).join('');

  const roofBtns = Object.entries(ROOFS).map(([k, v]) =>
    `<button type="button" data-set="roof" data-val="${k}" class="${p.roof === k ? 'is-active' : ''}">
       <b>${v.label}</b><small>${v.desc}</small>
     </button>`).join('');

  const spBtns = Object.entries(SPECIES).map(([k, v]) =>
    `<button type="button" data-set="species" data-val="${k}" class="${p.species === k ? 'is-active' : ''}">${v.label}</button>`).join('');

  const coverOpts = Object.entries(COVERING).map(([k, v]) =>
    `<option value="${k}" ${p.covering === k ? 'selected' : ''}>${v.label}</option>`).join('');

  const snowOpts = Object.entries(SNOW).map(([k, v]) =>
    `<option value="${k}" ${String(p.snow) === String(k) ? 'selected' : ''}>${v.label}</option>`).join('');

  return `
  <aside class="cfg__panel">
    <div class="cfg__title">Конструктор каркаса</div>
    <div class="cfg__hint">Задайте параметры — модель и расчёт пересчитаются сразу</div>

    <div class="cfg__group">
      <div class="cfg__label"><span>Готовые проекты</span></div>
      <div class="cfg__presets">${presetBtns}</div>
    </div>

    <div class="cfg__group">
      <div class="cfg__label"><span>Габариты здания</span></div>
      ${rangeHTML('length', 'Длина (A)', 6, 20, 0.5, p.length, 'м')}
      ${rangeHTML('span', 'Ширина / пролёт (L)', 4, 14, 0.5, p.span, 'м')}
    </div>

    <div class="cfg__group">
      <div class="cfg__label"><span>Этажность</span><span class="cfg__val" data-out="floors"></span></div>
      <div class="seg" data-set-group="floors">
        ${[1, 2, 3].map(n => `<button type="button" data-set="floors" data-val="${n}" class="${p.floors === n ? 'is-active' : ''}">${n}</button>`).join('')}
      </div>
    </div>

    <div class="cfg__group">
      <div class="cfg__label"><span>Тип крыши</span><span class="cfg__val" data-out="roof"></span></div>
      <div class="seg seg--grid" data-set-group="roof">${roofBtns}</div>
    </div>

    <div class="cfg__group">
      <div class="cfg__label"><span>Порода древесины</span><span class="cfg__val" data-out="species"></span></div>
      <div class="seg seg--grid seg--even" data-set-group="species">${spBtns}</div>
    </div>

    <details class="cfg__group cfg__more">
      <summary>Дополнительные параметры</summary>
      <div class="cfg__more-body">
        ${rangeHTML('eave', 'Свесы кровли', 0.3, 1.5, 0.1, p.eave, 'м')}
        ${rangeHTML('slope', 'Уклон ската', 15, 45, 1, p.slope, '°')}
        ${rangeHTML('step', 'Шаг ферм', 0.6, 1.2, 0.1, p.step, 'м')}
        ${rangeHTML('insulation', 'Утеплитель', 100, 300, 20, p.insulation, 'мм')}
        <div class="field">
          <label class="cfg__label" for="cfg-cover"><span>Покрытие кровли</span></label>
          <select class="select" id="cfg-cover" data-set="covering">${coverOpts}</select>
        </div>
        <div class="field">
          <label class="cfg__label" for="cfg-snow"><span>Снеговой район</span></label>
          <select class="select" id="cfg-snow" data-set="snow">${snowOpts}</select>
        </div>
      </div>
    </details>

    <div class="cfg__actions">
      <button type="button" class="btn btn--ghost btn--sm" data-reset>Сбросить параметры</button>
      <button type="button" class="btn btn--primary" data-lead>Оставить заявку по этому расчёту</button>
    </div>
  </aside>`;
}

function stageHTML() {
  const tool = ([kind, label, title]) =>
    `<button type="button" class="cfg__tool" data-tool="${kind}" title="${title}" aria-label="${title}" aria-pressed="false">
       ${ICON[kind]}<span>${label}</span>
     </button>`;
  // два ряда по две кнопки: в один ряд панель не влезает и наезжает на модель
  const tools = `<div class="cfg__tools-row">${TOOLS.slice(0, 2).map(tool).join('')}</div>` +
                `<div class="cfg__tools-row">${TOOLS.slice(2).map(tool).join('')}</div>`;
  const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  return `
  <div class="cfg__stage" data-stage>
    <div class="cfg__badge"><i></i> 3D-модель в реальном времени</div>
    <div class="cfg__tools">${tools}</div>
    <div class="cfg__hintbar">${touch ? 'Вращайте пальцем · щипок — масштаб' : 'Вращайте мышью · колесо — масштаб'}</div>
    <div class="cfg__loading" role="status">Собираем 3D-модель…</div>
  </div>`;
}

export function mountConfigurator(root, opts = {}) {
  const p = { ...DEFAULTS, ...(opts.params || {}) };
  const variant = opts.variant || 'full';
  if (opts.accent) root.style.setProperty('--cfg-accent', opts.accent);

  root.classList.add('cfg');
  if (variant === 'hero') root.classList.add('cfg--solo');
  root.innerHTML = variant === 'hero' ? stageHTML() : panelHTML(p) + stageHTML();
  const stage = root.querySelector('[data-stage]');
  const viewer = createViewer(stage, p);
  const loading = root.querySelector('.cfg__loading');
  let roofVisible = true;

  /* троттлинг: не чаще ~8 раз в секунду пересобирать модель при движении слайдера */
  let pending = false;
  function applyThrottled() {
    if (pending) return;
    pending = true;
    setTimeout(() => { pending = false; apply(); }, 120);
  }

  /* обновление полей */
  const outputs = {};
  root.querySelectorAll('[data-out]').forEach(el => { outputs[el.dataset.out] = el; });

  function paintRange(el, text) {
    const input = root.querySelector(`[data-set="${el.dataset.out}"]`);
    el.textContent = text;
    if (input && input.type === 'range') {
      const f = (parseFloat(input.value) - parseFloat(input.min)) / (parseFloat(input.max) - parseFloat(input.min));
      input.style.setProperty('--fill', `${Math.round(Math.max(0, Math.min(1, f)) * 100)}%`);
    }
  }

  function paintParams() {
    if (!Object.keys(outputs).length) return;
    if (outputs.length) paintRange(outputs.length, `${p.length} м`);
    if (outputs.span) paintRange(outputs.span, `${p.span} м`);
    if (outputs.eave) paintRange(outputs.eave, `${p.eave} м`);
    if (outputs.slope) paintRange(outputs.slope, `${p.slope}°`);
    if (outputs.step) paintRange(outputs.step, `${p.step} м`);
    if (outputs.insulation) paintRange(outputs.insulation, `${p.insulation} мм`);
    if (outputs.floors) outputs.floors.textContent = floorsLabel(p.floors);
    if (outputs.roof) outputs.roof.textContent = ROOFS[p.roof].label;
    if (outputs.species) outputs.species.textContent = SPECIES[p.species].label;
  }

  function paintSpec(built) {
    const s = computeSpec(p, built);
    const out = opts.specTarget ? document.querySelector(opts.specTarget) : null;
    if (out) {
      const fields = [
        ['Площадь застройки', s.footprint + ' м²'],
        ['Общая площадь', s.totalArea + ' м²'],
        ['Высота здания', s.height + ' м'],
        ['Стропильных ферм', s.trusses + ' шт'],
        ['Балок перекрытия', s.joists + ' шт'],
        ['МЗП пластин', s.plates + ' шт'],
        ['Объём древесины', s.woodVol + ' м³'],
        ['Вес конструкций', fmt(s.weight) + ' кг'],
        ['Кровля', s.roofArea + ' м²'],
        ['Сечение пояса', s.chord],
        ['Снеговая нагрузка', s.snow + ' кН/м²'],
        ['Ориентировочно', money(s.price)],
      ];
      out.innerHTML = '<h4>Предварительный расчёт конструкции</h4>' + fields.map(([k, v]) =>
        `<div class="spec"><b>${v}</b><span>${k}</span></div>`).join('');
    }
    const summary = document.querySelector('[data-cfg-summary]');
    if (summary) {
      summary.textContent = `${p.length} × ${p.span} м · ${floorsLabel(p.floors)} · ${ROOFS[p.roof].label} · ${SPECIES[p.species].label}`;
    }
    document.dispatchEvent(new CustomEvent('cfg:change', { detail: { params: { ...p }, spec: s } }));
    return s;
  }

  /* пересборка модели: фермы дважды не считаем — статистику берём из построенной сцены */
  function apply() {
    paintParams();
    const built = viewer.build(p);
    viewer.toggleRoof(roofVisible);
    if (loading && viewer.renderer) {
      if (built) {
        loading.classList.add('is-hidden');
        setTimeout(() => loading.remove(), 500);
      } else {
        loading.textContent = 'Не удалось собрать модель с такими параметрами';
      }
    } else if (loading) {
      loading.remove();   // WebGL недоступен — движок уже показал свою подпись
    }
    if (!built && viewer.renderer) toast('Модель с такими параметрами не построилась — показан предыдущий вариант');
    return paintSpec(built || undefined);
  }

  function syncControls() {
    root.querySelectorAll('[data-set][data-val]').forEach(b => {
      const key = b.dataset.set;
      b.classList.toggle('is-active', String(p[key]) === b.dataset.val);
      b.setAttribute('aria-pressed', String(p[key] == b.dataset.val));
    });
    root.querySelectorAll('input[type=range]').forEach(i => { i.value = p[i.dataset.set]; });
    root.querySelectorAll('select[data-set]').forEach(s => { s.value = s.dataset.set === 'snow' ? String(p.snow) : p[s.dataset.set]; });
  }

  /* слушатели панели */
  root.addEventListener('input', e => {
    const t = e.target;
    const key = t.dataset.set;
    if (!key) return;
    if (t.type !== 'range') return;
    p[key] = parseFloat(t.value);
    paintParams();
    applyThrottled();
  });
  root.addEventListener('change', e => {
    const t = e.target;
    if (t.tagName !== 'SELECT' || !t.dataset.set) return;
    p[t.dataset.set] = t.dataset.set === 'snow' ? parseInt(t.value, 10) : t.value;
    apply();
  });
  root.addEventListener('click', e => {
    const preset = e.target.closest('[data-preset]');
    if (preset) {
      const pr = PRESETS[preset.dataset.preset];
      if (pr) {
        Object.assign(p, pr.params);
        syncControls();
        apply();
        toast(`Пресет «${pr.label}» применён`);
      }
      return;
    }
    const btn = e.target.closest('[data-set][data-val]');
    if (btn) {
      const key = btn.dataset.set;
      p[key] = key === 'floors' ? parseInt(btn.dataset.val, 10) : btn.dataset.val;
      btn.parentElement.querySelectorAll('button').forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      apply();
      return;
    }
    if (e.target.closest('[data-reset]')) {
      Object.assign(p, DEFAULTS);
      roofVisible = true;
      syncControls();
      apply();
      setToolState();
      return;
    }
    if (e.target.closest('[data-lead]')) {
      const s = computeSpec(p);
      document.dispatchEvent(new CustomEvent('cfg:lead', { detail: { params: { ...p }, spec: s } }));
      toast('Параметры переданы в форму заявки');
      const target = document.getElementById('lead-wizard') || document.getElementById('contacts');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const tool = e.target.closest('[data-tool]');
    if (!tool) return;
    const kind = tool.dataset.tool;
    if (kind === 'reset') viewer.resetView();
    if (kind === 'rotate') viewer.setAutoRotate(!viewer.controls.autoRotate);
    if (kind === 'roof') roofVisible = !roofVisible;
    if (kind === 'camera') {
      const url = viewer.snapshot();
      const a = document.createElement('a');
      a.href = url;
      a.download = `karkaskin-3d-${p.length}x${p.span}.png`;
      a.click();
      toast('Картинка модели сохранена');
    }
    setToolState();
  });

  /* состояние кнопок сцены: «Кровля» и «Вращение» — переключатели */
  function setToolState() {
    const rot = !!(viewer.controls && viewer.controls.autoRotate);
    viewer.toggleRoof(roofVisible);
    root.querySelectorAll('[data-tool]').forEach(t => {
      const on = t.dataset.tool === 'roof' ? !roofVisible : t.dataset.tool === 'rotate' ? rot : false;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-pressed', String(on));
      if (t.dataset.tool === 'roof') {
        const title = roofVisible ? 'Скрыть кровлю и увидеть фермы' : 'Показать кровлю';
        t.title = title;
        t.setAttribute('aria-label', title);
      }
    });
  }

  apply();
  setToolState();

  const api = {
    viewer,
    params: p,
    getSpec: () => computeSpec(p),
    setParams: next => { Object.assign(p, next); syncControls(); apply(); },
  };
  root.__cfg = api;   // доступ для диагностики и внешних скриптов
  return api;
}

/* автозапуск контейнеров: data-configurator (karkaskin) или data-k3d (бандл) */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-configurator], [data-k3d]').forEach(el => {
    mountConfigurator(el, {
      variant: el.dataset.variant || 'full',
      params: el.dataset.params ? JSON.parse(el.dataset.params) : undefined,
      specTarget: el.dataset.specTarget || null,
      accent: el.dataset.accent || null,
    });
  });
});
