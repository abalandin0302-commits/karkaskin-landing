/* Сборка страниц сайта: общая шапка/подвал + содержимое разделов.
   Запуск:  node tools/build-pages.mjs                                      */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
function block(name) {
  const m = home.match(new RegExp(`<!--#${name}-->([\\s\\S]*?)<!--#/${name}-->`));
  if (!m) throw new Error('нет блока ' + name);
  return m[1].trim();
}
const HEAD = block('HEAD');
const HEADER = block('HEADER');
const FOOTER = block('FOOTER');

const CTA = (title, text) => `
<section class="section--tight">
  <div class="container">
    <div class="cta-band reveal">
      <div class="cta-band__in">
        <div>
          <h2 class="h-2">${title}</h2>
          <p class="lead" style="color:rgba(255,255,255,.82);margin-top:12px;max-width:640px">${text}</p>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn btn--wood btn--lg" href="/contacts/">Запросить расчёт</a>
          <a class="btn btn--ghost btn--lg" href="tel:+79219153706">+7 921 915-37-06</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

const LEAD_FORM = `
<form class="card" data-form="lead" style="max-width:720px">
  <h3 class="h-3" style="margin-bottom:18px">Заявка на расчёт конструкций</h3>
  <div class="form-err" style="margin-bottom:14px"></div>
  <div class="form-grid">
    <div class="field"><label class="field__label" for="lf-name">Имя <span>*</span></label>
      <input class="input" id="lf-name" name="name" type="text" placeholder="Иван" required></div>
    <div class="field"><label class="field__label" for="lf-phone">Телефон <span>*</span></label>
      <input class="input" id="lf-phone" name="phone" type="tel" placeholder="+7 900 000-00-00" required></div>
    <div class="field full"><label class="field__label" for="lf-email">E-mail</label>
      <input class="input" id="lf-email" name="email" type="email" placeholder="mail@example.ru"></div>
    <div class="field full"><label class="field__label" for="lf-comment">Комментарий</label>
      <textarea class="textarea" id="lf-comment" name="comment" placeholder="Пролёт, длина, тип крыши, сроки…"></textarea></div>
    <input type="hidden" name="project" value="Расчёт конструкций">
    <div class="full"><label class="check"><input type="checkbox" name="consent" value="1">
      <span>Согласен на обработку персональных данных и получение ответа по заявке</span></label></div>
    <div class="full"><button class="btn btn--wood btn--block btn--lg" type="submit">
      <span class="btn__spin"></span>
      <svg class="btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l16-8-6 16-2-6z"/></svg>
      Отправить заявку</button></div>
  </div>
  <div class="form-ok" style="margin-top:16px"><span>✓</span><span>Заявка отправлена. Мы свяжемся с вами в течение рабочего дня.</span></div>
</form>`;

/* ---------- страницы ---------- */
const PAGES = [
  {
    file: 'production/index.html',
    title: 'Производство деревянных конструкций на МЗП — Каркаскин',
    desc: 'Стропильные фермы, балки перекрытий, арки, рамы и опалубка на металлозубчатых пластинах. Заводское производство в Санкт-Петербурге.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <span>Производство конструкций</span></div>
    <h1 class="h-1">Производство деревянных конструкций на МЗП</h1>
    <p class="lead">Фермы, балки, арки, рамы и опалубка на металлозубчатых пластинах. Проектируем в специализированном ПО,
      раскраиваем на станках с ЧПУ и собираем комплект на стенде перед отгрузкой — на площадке остаётся только смонтировать.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid g-3">
      <a class="card card--hover reveal" href="#trusses">
        <div class="card__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 20h20L12 4 2 20z"/><path d="M7 20L12 11l5 9"/></svg></div>
        <h3 class="h-3">Стропильные фермы на МЗП</h3>
        <p class="small muted">Шесть типов конструкций: двускатные, односкатные, мансардные, ножницы, сегментные и фронтонные.</p>
        <div class="media media--hover" style="margin-top:18px;aspect-ratio:16/10"><img src="/assets/img/fermy/fermy-01.jpg" alt="Стропильные фермы на МЗП" loading="lazy"></div>
      </a>
      <a class="card card--hover reveal" href="#floors">
        <div class="card__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 8h18M3 16h18M8 4v16M16 4v16"/></svg></div>
        <h3 class="h-3">Конструкции перекрытий</h3>
        <p class="small muted">Балки МДК (Posi-балки), фермы перекрытий, балки и стропила на МЗП. Без скрипов и прогибов.</p>
        <div class="media media--hover" style="margin-top:18px;aspect-ratio:16/10"><img src="/assets/img/perekrytiya/perekrytiya-01.jpg" alt="Конструкции перекрытий" loading="lazy"></div>
      </a>
      <a class="card card--hover reveal" href="#arches">
        <div class="card__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 18a9 9 0 0 1 18 0"/><path d="M12 9v9M7 12.5v5.5M17 12.5v5.5"/></svg></div>
        <h3 class="h-3">Арки на МЗП</h3>
        <p class="small muted">Арочные конструкции для переходов, зимних садов, павильонов и коммерческих объектов.</p>
        <div class="media media--hover" style="margin-top:18px;aspect-ratio:16/10"><img src="/assets/img/arki/arki-01.jpg" alt="Арки на МЗП" loading="lazy"></div>
      </a>
      <a class="card card--hover reveal" href="#frames">
        <div class="card__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 9h16M4 15h16M10 3v18"/></svg></div>
        <h3 class="h-3">Рамные конструкции</h3>
        <p class="small muted">Рамы и полурамы — каркас барнхаусов, зимних садов, гаражей и коммерческих зданий.</p>
        <div class="media media--hover" style="margin-top:18px;aspect-ratio:16/10"><img src="/assets/img/ramy/ramy-01.jpg" alt="Рамные конструкции" loading="lazy"></div>
      </a>
      <a class="card card--hover reveal" href="#formwork">
        <div class="card__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16"/></svg></div>
        <h3 class="h-3">Опалубка на МЗП</h3>
        <p class="small muted">Оснастка для монолитных работ: точная геометрия, многократный оборот, ровная плоскость.</p>
        <div class="media media--hover" style="margin-top:18px;aspect-ratio:16/10"><img src="/assets/img/opalubka/opalubka-01.jpg" alt="Опалубка на МЗП" loading="lazy"></div>
      </a>
      <a class="card card--hover reveal" href="/kits/">
        <div class="card__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16v13H4z"/><path d="M4 7l2-4h12l2 4M9 12h6"/></svg></div>
        <h3 class="h-3">Комплекты конструкций</h3>
        <p class="small muted">Готовый набор под конкретную крышу — от расчёта до маркированного комплекта на участке.</p>
        <div class="media media--hover" style="margin-top:18px;aspect-ratio:16/10"><img src="/assets/img/komplekty/komplekty-01.jpg" alt="Комплекты конструкций" loading="lazy"></div>
      </a>
    </div>
  </div>
</section>

<section class="section section--paper2" id="trusses">
  <div class="container">
    <div class="sec-head">
      <div class="eyebrow">Стропильные фермы</div>
      <h2 class="h-1">Шесть типов ферм на МЗП</h2>
      <p class="lead">Каждый тип — собственная геометрия поясов и раскосов. Переключите вкладку, чтобы увидеть конструкцию.</p>
    </div>
    <div data-tabs>
      <div class="tabs">
        <button class="is-active" data-tab="dvux">Двускатные</button>
        <button data-tab="odno">Односкатные</button>
        <button data-tab="mansard">Мансардные</button>
        <button data-tab="nozh">Ножницы</button>
        <button data-tab="segment">Сегментные</button>
        <button data-tab="fronton">Фронтонные</button>
      </div>

      <div class="tab-panel is-active" data-panel="dvux">
        <div class="split">
          <div>
            <h3 class="h-2">Двускатные фермы на МЗП</h3>
            <p class="lead" style="margin-top:14px">Классическая двускатная ферма: два ската, горизонтальный нижний пояс,
              наклонные верхние пояса и треугольная решётка из стоек и раскосов. Оптимальны для жилых домов
              и любых зданий с двускатной кровлей.</p>
            <ul class="grid" style="gap:10px;margin-top:22px">
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Пролёты от 3 до 20 м</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Шаг ферм 0,6–1,2 м</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Уклон верхнего пояса от 15°</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Свесы до 1,5 м</li>
            </ul>
            <a class="btn btn--wood" style="margin-top:26px" href="/contacts/">Рассчитать двускатную ферму</a>
          </div>
          <div class="media" style="aspect-ratio:4/3"><img src="/assets/img/fermy-dvuxskatnye/fermy-dvuxskatnye-01.jpg" alt="Двускатные фермы на МЗП" loading="lazy"></div>
        </div>
      </div>

      <div class="tab-panel" data-panel="odno">
        <div class="split">
          <div>
            <h3 class="h-2">Односкатные фермы на МЗП</h3>
            <p class="lead" style="margin-top:14px">Один скат — решение для пристроек, гаражей и зданий
              с несимметричной планировкой. Позволяют вписать дом в сложный рельеф.</p>
            <ul class="grid" style="gap:10px;margin-top:22px">
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Переменный уклон по скату</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Простая геометрия узлов</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Меньше металла на единицу площади</li>
            </ul>
            <a class="btn btn--wood" style="margin-top:26px" href="/contacts/">Рассчитать односкатную ферму</a>
          </div>
          <div class="media" style="aspect-ratio:4/3"><img src="/assets/img/fermy-odnoskatnye/fermy-odnoskatnye-01.jpg" alt="Односкатные фермы на МЗП" loading="lazy"></div>
        </div>
      </div>

      <div class="tab-panel" data-panel="mansard">
        <div class="split">
          <div>
            <h3 class="h-2">Мансардные фермы на МЗП</h3>
            <p class="lead" style="margin-top:14px">Излом пояса: крутой нижний скат и пологий верхний.
              Такая геометрия даёт полезную площадь мансарды и работает на сложных объёмах.</p>
            <ul class="grid" style="gap:10px;margin-top:22px">
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Два уклона в одном поясе</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Треугольная мансардная схема</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Индивидуальный узел излома</li>
            </ul>
            <a class="btn btn--wood" style="margin-top:26px" href="/contacts/">Рассчитать мансардную ферму</a>
          </div>
          <div class="media" style="aspect-ratio:4/3"><img src="/assets/img/fermy-mansardnye/fermy-mansardnye-01.jpg" alt="Мансардные фермы на МЗП" loading="lazy"></div>
        </div>
      </div>

      <div class="tab-panel" data-panel="nozh">
        <div class="split">
          <div>
            <h3 class="h-2">Фермы-ножницы на МЗП</h3>
            <p class="lead" style="margin-top:14px">Раскосы идут от нижнего пояса к верхнему «вразножку».
              Конструкция даёт открытое пространство без сжимающих стоек — для открытых интерьеров.</p>
            <ul class="grid" style="gap:10px;margin-top:22px">
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Свободная планировка этажа</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Равномерное распределение нагрузки</li>
            </ul>
            <a class="btn btn--wood" style="margin-top:26px" href="/contacts/">Рассчитать ферму-ножницы</a>
          </div>
          <div class="media" style="aspect-ratio:4/3"><img src="/assets/img/fermy-noschnicy/fermy-noschnicy-01.jpg" alt="Фермы-ножницы на МЗП" loading="lazy"></div>
        </div>
      </div>

      <div class="tab-panel" data-panel="segment">
        <div class="split">
          <div>
            <h3 class="h-2">Сегментные фермы на МЗП</h3>
            <p class="lead" style="margin-top:14px">Верхний пояс изогнут по дуге. Применяются для арочных
              и сводчатых кровель, где нужна плавная геометрия и равномерное опирание.</p>
            <ul class="grid" style="gap:10px;margin-top:22px">
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Круговой или параболический верхний пояс</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Большие пролёты без дополнительных опор</li>
            </ul>
            <a class="btn btn--wood" style="margin-top:26px" href="/contacts/">Рассчитать сегментную ферму</a>
          </div>
          <div class="media" style="aspect-ratio:4/3"><img src="/assets/img/fermy-segmentnye/fermy-segmentnye-01.jpg" alt="Сегментные фермы на МЗП" loading="lazy"></div>
        </div>
      </div>

      <div class="tab-panel" data-panel="fronton">
        <div class="split">
          <div>
            <h3 class="h-2">Фронтонные фермы на МЗП</h3>
            <p class="lead" style="margin-top:14px">Устанавливаются по торцам здания и закрывают проём
              слуховых и фронтонных окон. Часто изготавливаются с готовым раскроем под обшивку.</p>
            <ul class="grid" style="gap:10px;margin-top:22px">
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Готовые проёмы под мансардные окна</li>
              <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Комплектование по проекту</li>
            </ul>
            <a class="btn btn--wood" style="margin-top:26px" href="/contacts/">Рассчитать фронтонные фермы</a>
          </div>
          <div class="media" style="aspect-ratio:4/3"><img src="/assets/img/fermy-frontonnye/fermy-frontonnye-01.jpg" alt="Фронтонные фермы на МЗП" loading="lazy"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="floors">
  <div class="container">
    <div class="sec-head">
      <div class="eyebrow">Конструкции перекрытий</div>
      <h2 class="h-1">Перекрытия, которые не скрипят</h2>
      <p class="lead">Балки и фермы перекрытий рассчитываются на прогиб и вибрацию — пол остаётся ровным
        и не «играет» под ногами.</p>
    </div>
    <div class="grid g-3">
      <div class="card card--hover reveal">
        <div class="media media--hover" style="aspect-ratio:16/10;margin-bottom:18px"><img src="/assets/img/posi-balki/posi-balki-01.jpg" alt="Балки МДК Posi" loading="lazy"></div>
        <h3 class="h-3">Балки МДК (Posi-балки)</h3>
        <p class="small muted">Особая геометрия полки даёт большую несущую способность при малой высоте балки.</p>
      </div>
      <div class="card card--hover reveal">
        <div class="media media--hover" style="aspect-ratio:16/10;margin-bottom:18px"><img src="/assets/img/balki-stropila/balki-stropila-01.jpg" alt="Балки и стропила на МЗП" loading="lazy"></div>
        <h3 class="h-3">Балки и стропила на МЗП</h3>
        <p class="small muted">Для межэтажных и чердачных перекрытий. Соединение на пластинах исключает скрипы.</p>
      </div>
      <div class="card card--hover reveal">
        <div class="media media--hover" style="aspect-ratio:16/10;margin-bottom:18px"><img src="/assets/img/fermy-perekrytij/fermy-perekrytij-01.jpg" alt="Фермы перекрытий" loading="lazy"></div>
        <h3 class="h-3">Фермы перекрытий</h3>
        <p class="small muted">Когда под перекрытием нужна высота: пролёт перекрывается фермой с решёткой.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="split">
      <div>
        <div class="eyebrow">Арки, рамы, опалубка</div>
        <h2 class="h-1">Конструкции под индивидуальную архитектуру</h2>
        <p class="lead" style="margin-top:16px">Помимо серийных ферм мы делаем уникальные конструкции: арки, рамы,
          полурамы и оснастку. Геометрия проектируется под объект и проверяется расчётом.</p>
        <ul class="grid" style="gap:12px;margin-top:24px">
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span><span><b>Арки на МЗП</b> — пролёты до 20 м, криволинейный верхний пояс</span></li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span><span><b>Рамные конструкции</b> — каркасы барнхаусов, зимних садов, гаражей</span></li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span><span><b>Полурамы на МЗП</b> — для вальмовых и сложных крыш</span></li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span><span><b>Опалубка</b> — многократный оборот, точная геометрия</span></li>
        </ul>
        <a class="btn btn--wood" style="margin-top:26px" href="/contacts/">Обсудить проект</a>
      </div>
      <div class="grid g-2" style="gap:12px">
        <div class="media" style="aspect-ratio:1/1"><img src="/assets/img/arki/arki-03.jpg" alt="Арки" loading="lazy"></div>
        <div class="media" style="aspect-ratio:1/1"><img src="/assets/img/ramy/ramy-03.jpg" alt="Рамные конструкции" loading="lazy"></div>
        <div class="media" style="aspect-ratio:1/1"><img src="/assets/img/komplekt-barn/komplekt-barn-02.jpg" alt="Барнхаус" loading="lazy"></div>
        <div class="media" style="aspect-ratio:1/1"><img src="/assets/img/opalubka/opalubka-02.jpg" alt="Опалубка" loading="lazy"></div>
      </div>
    </div>
  </div>
</section>

${CTA('Рассчитаем конструкцию по вашим размерам', 'Пришлите пролёт и длину здания — вернёмся с расчётом, узлами и ориентировочной стоимостью.')}
`,
  },

  {
    file: 'kits/index.html',
    title: 'Комплекты деревянных конструкций — Каркаскин',
    desc: 'Готовые комплекты конструкций для двускатной, вальмовой, мансардной крыши и барнхауса: фермы, рамы, полурамы, прогоны и крепёж.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <span>Комплекты конструкций</span></div>
    <h1 class="h-1">Комплекты конструкций под ключ</h1>
    <p class="lead">Не отдельные фермы, а готовое решение под конкретную крышу: с расчётом, раскроем,
      маркировкой деталей и крепежом. Приезжает на участок как комплект, который собирается по чертежу.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid g-3">
      <a class="card card--hover reveal" id="gable" href="/contacts/">
        <div class="media media--hover" style="aspect-ratio:16/10;margin-bottom:18px"><img src="/assets/img/komplekt-dvuxskat/komplekt-dvuxskat-01.jpg" alt="Комплект для двускатной крыши" loading="lazy"></div>
        <h3 class="h-3">Двускатная крыша</h3>
        <p class="small muted">Базовый комплект: стропильные фермы на МЗП, конёк, прогоны, свесы.</p>
        <div class="prod__foot" style="margin-top:14px"><span>Запрос цены</span><b>→</b></div>
      </a>
      <a class="card card--hover reveal" id="gable-eaves" href="/contacts/">
        <div class="media media--hover" style="aspect-ratio:16/10;margin-bottom:18px"><img src="/assets/img/komplekt-svesy/komplekt-svesy-01.jpg" alt="Комплект с фронтонными свесами" loading="lazy"></div>
        <h3 class="h-3">Двускатная с фронтонными свесами</h3>
        <p class="small muted">То же, но с выносными свесами по фронтонам — для широких фасадов и террас.</p>
        <div class="prod__foot" style="margin-top:14px"><span>Запрос цены</span><b>→</b></div>
      </a>
      <a class="card card--hover reveal" id="hip" href="/contacts/">
        <div class="media media--hover" style="aspect-ratio:16/10;margin-bottom:18px"><img src="/assets/img/komplekt-valm/komplekt-valm-01.jpg" alt="Комплект для вальмовой крыши" loading="lazy"></div>
        <h3 class="h-3">Вальмовая крыша</h3>
        <p class="small muted">Фермы, полурамы и угловые элементы для скатов с четырёх сторон.</p>
        <div class="prod__foot" style="margin-top:14px"><span>Запрос цены</span><b>→</b></div>
      </a>
      <a class="card card--hover reveal" id="mansard" href="/contacts/">
        <div class="media media--hover" style="aspect-ratio:16/10;margin-bottom:18px"><img src="/assets/img/komplekt-mansard/komplekt-mansard-01.jpg" alt="Комплект для мансардной крыши" loading="lazy"></div>
        <h3 class="h-3">Мансардная крыша</h3>
        <p class="small muted">Треугольная мансардная схема с изломом пояса и фронтонными элементами.</p>
        <div class="prod__foot" style="margin-top:14px"><span>Запрос цены</span><b>→</b></div>
      </a>
      <a class="card card--hover reveal" id="barn" href="/contacts/">
        <div class="media media--hover" style="aspect-ratio:16/10;margin-bottom:18px"><img src="/assets/img/komplekt-barn/komplekt-barn-01.jpg" alt="Барнхаус — рамы" loading="lazy"></div>
        <h3 class="h-3">Барнхаус — рамы</h3>
        <p class="small muted">Рамные конструкции с открытым пространством и строгой геометрией.</p>
        <div class="prod__foot" style="margin-top:14px"><span>Запрос цены</span><b>→</b></div>
      </a>
      <a class="card card--hover reveal" id="halframes" href="/contacts/">
        <div class="media media--hover" style="aspect-ratio:16/10;margin-bottom:18px"><img src="/assets/img/komplekt-poluramy/komplekt-poluramy-01.jpg" alt="Полурамы на МЗП" loading="lazy"></div>
        <h3 class="h-3">Полурамы на МЗП</h3>
        <p class="small muted">Элементы для вальмовых и перекрёстных крыш, мансард и нестандартных узлов.</p>
        <div class="prod__foot" style="margin-top:14px"><span>Запрос цены</span><b>→</b></div>
      </a>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="sec-head center">
      <div class="eyebrow">Что входит в комплект</div>
      <h2 class="h-1">Состав поставки</h2>
    </div>
    <div class="grid g-4">
      <div class="card reveal"><div class="card__num">01</div><h3 class="h-3" style="margin:10px 0 8px">Расчёт</h3><p class="small muted">Узлы, сечения поясов, шаг ферм и спецификация материалов.</p></div>
      <div class="card reveal"><div class="card__num">02</div><h3 class="h-3" style="margin:10px 0 8px">Раскрой</h3><p class="small muted">Детали порезаны на станках с ЧПУ, с готовыми вырезами и отверстиями.</p></div>
      <div class="card reveal"><div class="card__num">03</div><h3 class="h-3" style="margin:10px 0 8px">Металлозубчатые пластины</h3><p class="small muted">Все МЗП и крепёж входят в комплект и идут вместе с деталями.</p></div>
      <div class="card reveal"><div class="card__num">04</div><h3 class="h-3" style="margin:10px 0 8px">Маркировка</h3><p class="small muted">Каждая деталь промаркирована — монтаж идёт по чертежу без подгонки.</p></div>
    </div>
  </div>
</section>

${CTA('Соберём комплект под вашу крышу', 'Расскажите про здание — предложим состав комплекта, сроки и стоимость.')}
`,
  },

  {
    file: 'catalog/index.html',
    title: 'Каталог проектов домов, бань и гаражей — Каркаскин',
    desc: '22 готовых проекта каркасных домов, бань и гаражей с расчётом площади, габаритов и характеристик.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <span>Каталог проектов</span></div>
    <h1 class="h-1">Каталог проектов</h1>
    <p class="lead">22 готовых решения для домов, бань и гаражей. Каждый проект — база для расчёта
      конструкций: выберите подходящий, уточните размеры — инженер пересчитает под ваш участок.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="filters" data-catalog-filters></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;gap:12px;flex-wrap:wrap">
      <p class="small muted" style="margin:0">Проектов в подборке: <b data-catalog-count>22</b></p>
      <a class="btn btn--ghost btn--sm" href="/#constructor">Собрать 3D-модель по своим размерам</a>
    </div>
    <div class="grid g-4" data-catalog-grid></div>
  </div>
</section>

${CTA('Нужен нестандартный проект?', 'Мы проектируем и изготавливаем конструкции под вашу геометрию — от ломаной крыши до зимнего сада.')}
`,
    scripts: ['/assets/js/catalog.js'],
  },

  {
    file: 'catalog/product.html',
    title: 'Проект — Каркаскин',
    desc: 'Характеристики проекта каркасного дома, бани или гаража: площадь, габариты, этажность и особенности.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <a href="/catalog/">Каталог проектов</a> / <span>Проект</span></div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div data-product></div>
  </div>
</section>

${CTA('Рассчитаем этот проект под ваш участок', 'Пришлите размеры и пожелания — инженер пересчитает конструкции и подготовит спецификацию.')}
`,
    scripts: ['/assets/js/catalog.js'],
  },

  {
    file: 'services/index.html',
    title: 'Услуги — проектирование деревянных конструкций и домов — Каркаскин',
    desc: 'Проектирование деревянных конструкций на МЗП и проектирование домов: расчёт КМ, узлы, спецификации, рабочая документация.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <span>Услуги</span></div>
    <h1 class="h-1">Проектирование</h1>
    <p class="lead">Проектируем деревянные конструкции и дома так, чтобы производство и монтаж шли без сюрпризов.
      Вы получаете документацию, по которой в точности изготавливается конструкция.</p>
  </div>
</section>

<section class="section" id="structures">
  <div class="container">
    <div class="split">
      <div>
        <div class="eyebrow">Услуга 01</div>
        <h2 class="h-1">Проектирование деревянных конструкций</h2>
        <p class="lead" style="margin-top:18px">Расчёт конструкций на МЗП под ваши пролёты и нагрузки:
          стропильные фермы, балки перекрытий, арки и рамы. На выходе — рабочая документация и спецификация материалов.</p>
        <ul class="grid" style="gap:12px;margin-top:26px">
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Расчёт по пролёту, длине, снеговой и ветровой зонам</li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Узлы соединений на металлозубчатых пластинах</li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Проверка прогибов и колебаний перекрытий</li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Спецификация леса, МЗП и крепежа</li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Чертежи и раскроечные карты для производства</li>
        </ul>
        <a class="btn btn--wood" style="margin-top:28px" href="/contacts/">Заказать проект конструкций</a>
      </div>
      <div class="grid g-2" style="gap:12px">
        <div class="media" style="aspect-ratio:3/4"><img src="/assets/img/uslugi-dk/uslugi-dk-01.jpg" alt="Проектирование конструкций" loading="lazy"></div>
        <div class="media" style="aspect-ratio:3/4"><img src="/assets/img/fermy/fermy-04.jpg" alt="Расчёт конструкций" loading="lazy"></div>
        <div class="media" style="aspect-ratio:3/4"><img src="/assets/img/perekrytiya/perekrytiya-04.jpg" alt="Перекрытия" loading="lazy"></div>
        <div class="media" style="aspect-ratio:3/4"><img src="/assets/img/fermy/fermy-02.jpg" alt="Фермы" loading="lazy"></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--paper2" id="houses">
  <div class="container">
    <div class="split">
      <div class="grid g-2" style="gap:12px">
        <div class="media" style="aspect-ratio:3/4"><img src="/assets/img/uslugi-domov/uslugi-domov-01.jpg" alt="Проектирование домов" loading="lazy"></div>
        <div class="media" style="aspect-ratio:3/4"><img src="/assets/img/uslugi-domov/uslugi-domov-03.jpg" alt="Эскиз дома" loading="lazy"></div>
        <div class="media" style="aspect-ratio:3/4"><img src="/assets/img/home/home-03.jpg" alt="Дом" loading="lazy"></div>
        <div class="media" style="aspect-ratio:3/4"><img src="/assets/img/home/home-05.jpg" alt="Дом" loading="lazy"></div>
      </div>
      <div>
        <div class="eyebrow">Услуга 02</div>
        <h2 class="h-1">Проектирование домов</h2>
        <p class="lead" style="margin-top:18px">От эскиза и планировки до конструктивного решения, которое
          можно производить. Подбираем решения под участок, рельеф и бюджет.</p>
        <ul class="grid" style="gap:12px;margin-top:26px">
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Эскиз и подбор планировки</li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Архитектурные и конструктивные решения</li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Тёплый контур, узлы примыканий, пироги</li>
          <li style="display:flex;gap:10px"><span style="color:var(--wood);font-weight:800">✓</span>Комплектация под ключ: от фундамента до кровли</li>
        </ul>
        <a class="btn btn--wood" style="margin-top:28px" href="/contacts/">Обсудить проект дома</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="sec-head">
      <div class="eyebrow">Как мы работаем</div>
      <h2 class="h-1">Этапы проектирования</h2>
    </div>
    <div class="steps" style="display:grid;grid-template-columns:repeat(4,1fr)">
      <div class="step reveal"><h4 class="h-4">Бриф</h4><p class="small muted">Габариты, пожелания по планировке, участок, бюджет и сроки.</p></div>
      <div class="step reveal"><h4 class="h-4">Эскиз</h4><p class="small muted">Варианты объёма и планировки, согласуем направление.</p></div>
      <div class="step reveal"><h4 class="h-4">Конструктив</h4><p class="small muted">Расчёт конструкций на МЗП, узлы, ведомость деталей.</p></div>
      <div class="step reveal"><h4 class="h-4">Производство</h4><p class="small muted">Изготовление комплекта и отгрузка на участок.</p></div>
    </div>
  </div>
</section>

${CTA('Обсудим ваш проект', 'Пришлите габариты и план — предложим решение и сроки.')}

<section class="section">
  <div class="container">${LEAD_FORM}</div>
</section>
`,
  },

  {
    file: 'about/index.html',
    title: 'О компании — Каркаскин',
    desc: 'ООО Каркаскин: с 2014 года проектируем и производим деревянные конструкции на МЗП в Санкт-Петербурге.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <span>О компании</span></div>
    <h1 class="h-1">Прочность, рассчитанная на поколения</h1>
    <p class="lead">С 2014 года компания «Каркаскин» проектирует и производит деревянные конструкции,
      которые становятся каркасом для комфортной жизни, работы и развития.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="split">
      <div>
        <div class="eyebrow">О компании</div>
        <h2 class="h-1">Инженерно точно рассчитать — и создать</h2>
        <p class="lead" style="margin-top:18px">Каждый домокомплект, каждая ферма на металлозубчатых пластинах (МЗП)
          и каждая балка перекрытия — результат вычислений в специализированном программном обеспечении.
          Это гарантирует, что конструкции выдержат нагрузки и прослужат более 50 лет.</p>
        <p class="muted" style="margin-top:16px">Наше кредо — не просто изготовить, а точно рассчитать. Мы не работаем
          «на глазок»: каждый узел и каждый элемент рассчитываются на прочность, долговечность и оптимальное
          использование материала.</p>
        <div class="hero__stats" style="margin-top:34px;border-top-color:var(--line)">
          <div class="hero__stat"><b style="color:var(--ink)">12+</b><span style="color:var(--ink-3)">лет на рынке</span></div>
          <div class="hero__stat"><b style="color:var(--ink)">50+</b><span style="color:var(--ink-3)">лет срок службы</span></div>
          <div class="hero__stat"><b style="color:var(--ink)">22</b><span style="color:var(--ink-3)">проекта в каталоге</span></div>
        </div>
      </div>
      <div class="grid g-2" style="gap:12px">
        <div class="media" style="aspect-ratio:1/1"><img src="/assets/img/o-kompanii/o-kompanii-01.jpg" alt="Производство Каркаскин" loading="lazy"></div>
        <div class="media" style="aspect-ratio:1/1"><img src="/assets/img/nashi-raboty/nashi-raboty-01.jpg" alt="Наши работы" loading="lazy"></div>
        <div class="media" style="aspect-ratio:1/1"><img src="/assets/img/fermy/fermy-05.jpg" alt="Фермы на МЗП" loading="lazy"></div>
        <div class="media" style="aspect-ratio:1/1"><img src="/assets/img/brand/karkaskin.jpg" alt="Каркаскин" loading="lazy"></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="sec-head"><div class="eyebrow">Принципы</div><h2 class="h-1">Четыре правила, по которым мы работаем</h2></div>
    <div class="grid g-2">
      <div class="card reveal"><div class="card__num">01</div><h3 class="h-3" style="margin:10px 0 8px">Инженерная точность вместо приблизительности</h3>
        <p class="small muted">Конструкторы с большим опытом разрабатывают проекты любой сложности — от типовых до уникальных архитектурных задач. Вы получаете не набор элементов, а готовое инженерное решение.</p></div>
      <div class="card reveal"><div class="card__num">02</div><h3 class="h-3" style="margin:10px 0 8px">Качество на современном оборудовании</h3>
        <p class="small muted">Точная оснастка даёт идеальную геометрию деталей, чёткую стыковку узлов и, как следствие, высокую скорость и качество сборки на площадке.</p></div>
      <div class="card reveal"><div class="card__num">03</div><h3 class="h-3" style="margin:10px 0 8px">Диалог с наукой</h3>
        <p class="small muted">Поддерживаем деловые и научные связи с ведущими строительными вузами Санкт-Петербурга — это помогает совершенствовать технологии и быть уверенными в надёжности конструкций.</p></div>
      <div class="card reveal"><div class="card__num">04</div><h3 class="h-3" style="margin:10px 0 8px">Ответственность, закреплённая гарантией</h3>
        <p class="small muted">Наши конструкции — не товар «как есть», а продукт, за который мы отвечаем по договору. Это логичное подтверждение уверенности в своём качестве.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="sec-head"><div class="eyebrow">Что мы производим</div><h2 class="h-1">Три направления</h2></div>
    <div class="grid g-3">
      <div class="card reveal"><h3 class="h-3">Домокомплекты</h3><p class="small muted">Полный набор деревянных элементов для быстрой и точной сборки тёплого, прочного и экологичного дома.</p>
        <a class="btn btn--ghost btn--sm" style="margin-top:16px" href="/catalog/">Каталог проектов</a></div>
      <div class="card reveal"><h3 class="h-3">Фермы на МЗП</h3><p class="small muted">Лёгкие и прочные стропильные системы для любых пролётов — для частного домостроения и коммерческих объектов.</p>
        <a class="btn btn--ghost btn--sm" style="margin-top:16px" href="/production/#trusses">Подробнее</a></div>
      <div class="card reveal"><h3 class="h-3">Балки перекрытий</h3><p class="small muted">Решения для междуэтажных и чердачных перекрытий на МЗП и металлических кронштейнах — без скрипов и прогибов.</p>
        <a class="btn btn--ghost btn--sm" style="margin-top:16px" href="/production/#floors">Подробнее</a></div>
    </div>
  </div>
</section>

${CTA('Давайте создадим что-то долговечное вместе', 'Начните с точного расчёта — мы подготовим конструкции под ваш проект.')}
`,
  },

  {
    file: 'about/portfolio.html',
    title: 'Портфолио — наши работы — Каркаскин',
    desc: 'Объекты, реализованные ООО Каркаскин: дома, бани, гаражи, навесы и коммерческие конструкции.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <a href="/about/">О компании</a> / <span>Портфолио</span></div>
    <h1 class="h-1">Наши работы</h1>
    <p class="lead">Дома, бани, гаражи и коммерческие объекты в Санкт-Петербурге и Ленинградской области.
      Каждый проект — от расчёта до монтажа.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid g-3">
      <figure class="card card--hover reveal" style="padding:0;overflow:hidden;margin:0">
        <div class="media media--hover" style="aspect-ratio:4/3;border-radius:0"><img src="/assets/img/nashi-raboty/nashi-raboty-01.jpg" alt="Наши работы" loading="lazy"></div>
        <figcaption style="padding:18px 22px"><b>Частные дома</b><p class="small muted" style="margin:6px 0 0">Каркасные дома от 90 до 250 м² с фермами на МЗП</p></figcaption>
      </figure>
      <figure class="card card--hover reveal" style="padding:0;overflow:hidden;margin:0">
        <div class="media media--hover" style="aspect-ratio:4/3;border-radius:0"><img src="/assets/img/nashi-raboty/nashi-raboty-02.jpg" alt="Наши работы" loading="lazy"></div>
        <figcaption style="padding:18px 22px"><b>Бани и гостевые дома</b><p class="small muted" style="margin:6px 0 0">Комплекты под ключ с обвязкой перекрытий</p></figcaption>
      </figure>
      <figure class="card card--hover reveal" style="padding:0;overflow:hidden;margin:0">
        <div class="media media--hover" style="aspect-ratio:4/3;border-radius:0"><img src="/assets/img/nashi-raboty/nashi-raboty-03.jpg" alt="Наши работы" loading="lazy"></div>
        <figcaption style="padding:18px 22px"><b>Гаражи и навесы</b><p class="small muted" style="margin:6px 0 0">Рамные конструкции для автомобильных стоянок</p></figcaption>
      </figure>
      <figure class="card card--hover reveal" style="padding:0;overflow:hidden;margin:0">
        <div class="media media--hover" style="aspect-ratio:4/3;border-radius:0"><img src="/assets/img/nashi-raboty/nashi-raboty-04.jpg" alt="Наши работы" loading="lazy"></div>
        <figcaption style="padding:18px 22px"><b>Коммерческие объекты</b><p class="small muted" style="margin:6px 0 0">Ангаменты, мастерские, зимние сады</p></figcaption>
      </figure>
      <figure class="card card--hover reveal" style="padding:0;overflow:hidden;margin:0">
        <div class="media media--hover" style="aspect-ratio:4/3;border-radius:0"><img src="/assets/img/nashi-raboty/nashi-raboty-05.jpg" alt="Наши работы" loading="lazy"></div>
        <figcaption style="padding:18px 22px"><b>Сложные крыши</b><p class="small muted" style="margin:6px 0 0">Вальмовые, мансардные, сегментные системы</p></figcaption>
      </figure>
      <figure class="card card--hover reveal" style="padding:0;overflow:hidden;margin:0">
        <div class="media media--hover" style="aspect-ratio:4/3;border-radius:0"><img src="/assets/img/nashi-raboty/nashi-raboty-06.jpg" alt="Наши работы" loading="lazy"></div>
        <figcaption style="padding:18px 22px"><b>Ремонт и усиление</b><p class="small muted" style="margin:6px 0 0">Замена стропильных систем и перекрытий</p></figcaption>
      </figure>
    </div>
  </div>
</section>

${CTA('Хотите так же?', 'Расскажите о задаче — предложим конструкцию, сроки и стоимость.')}
`,
  },

  {
    file: 'about/guarantee.html',
    title: 'Гарантия и условия работы — Каркаскин',
    desc: 'Гарантия на деревянные конструкции, условия работы, сроки изготовления и порядок приёмки.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <a href="/about/">О компании</a> / <span>Гарантия</span></div>
    <h1 class="h-1">Гарантия и условия работы</h1>
    <p class="lead">Наши конструкции — не товар «как есть». Это продукт, за который мы отвечаем по договору
      и подтверждаем расчётом и производственным контролем.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid g-3">
      <div class="card reveal"><div class="card__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <h3 class="h-3">Гарантия на конструкции</h3>
        <p class="small muted">Гарантийный срок на несущие деревянные конструкции — 50 лет. На соединения на МЗП — в соответствии с проектной документацией и требованиями производителя пластин.</p></div>
      <div class="card reveal"><div class="card__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>
        <h3 class="h-3">Сроки</h3>
        <p class="small muted">От 10 рабочих дней на типовой комплект. Срочные заказы и объекты с монтажом — по договорённости.</p></div>
      <div class="card reveal"><div class="card__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16v13H4z"/><path d="M4 7l2-4h12l2 4M9 12h6"/></svg></div>
        <h3 class="h-3">Комплектация</h3>
        <p class="small muted">В комплект входят детали, металлозубчатые пластины, крепёж, чертежи и маркировка — всё, что нужно для сборки без подгонки.</p></div>
    </div>

    <div class="split" style="margin-top:clamp(40px,5vw,72px);align-items:start">
      <div>
        <div class="eyebrow">Порядок работы</div>
        <h2 class="h-2">Как проходит приёмка</h2>
        <ul class="grid" style="gap:16px;margin-top:20px">
          <li style="display:flex;gap:14px"><b class="card__num">01</b><span><b>Сухая сборка на стенде.</b> Перед отгрузкой комплект собирается в цехе — проверяются узлы и геометрия.</span></li>
          <li style="display:flex;gap:14px"><b class="card__num">02</b><span><b>Комплектование по маркировке.</b> Каждая деталь промаркирована, к комплекту прилагается чертёж сборки.</span></li>
          <li style="display:flex;gap:14px"><b class="card__num">03</b><span><b>Приёмка на объекте.</b> Осмотр деталей, сверка с проектом, подписание акта.</span></li>
          <li style="display:flex;gap:14px"><b class="card__num">04</b><span><b>Гарантийное сопровождение.</b> Консультации по сборке и доработкам в течение гарантийного срока.</span></li>
        </ul>
      </div>
      <div class="card" style="background:var(--navy-soft);border-color:transparent">
        <h3 class="h-3">Оферта и цены</h3>
        <p class="small muted" style="margin-top:10px">Информация о стоимости и ценах, размещённая на сайте,
          не является публичной офертой и носит информационный характер. Точную стоимость уточняйте в офисе
          или по телефону <a href="tel:+79219153706" style="text-decoration:underline;font-weight:700">+7 921 915-37-06</a>.</p>
        <a class="btn btn--wood" style="margin-top:20px" href="/contacts/">Уточнить стоимость</a>
      </div>
    </div>
  </div>
</section>

${CTA('Нужен расчёт и смета?', 'Пришлите габариты — подготовим предложение с составом комплекта и сроками.')}
`,
  },

  {
    file: 'contacts/index.html',
    title: 'Контакты — Каркаскин, Санкт-Петербург',
    desc: 'ООО Каркаскин: Санкт-Петербург, ул. Заповедная д. 62. Телефон +7 921 915-37-06, mail@karkaskin.ru. Формы заявок на расчёт.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <span>Контакты</span></div>
    <h1 class="h-1">Контакты</h1>
    <p class="lead">Приходите на производство или позвоните — обсудим проект и подготовим расчёт конструкций.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid g-4">
      <div class="card reveal"><div class="card__num">Адрес</div>
        <p class="small muted" style="margin-top:8px">197375, РФ<br>Санкт-Петербург,<br>ул. Заповедная, д. 62</p>
        <a class="btn btn--ghost btn--sm" style="margin-top:14px" href="#map">На карте</a></div>
      <div class="card reveal"><div class="card__num">Телефон</div>
        <p style="margin-top:8px"><b><a href="tel:+79219153706">+7 921 915-37-06</a></b></p>
        <p class="small muted"><a href="tel:+78129153706">8 (812) 915-37-06</a></p>
        <a class="btn btn--ghost btn--sm" style="margin-top:14px" href="http://t.me/Karkaskin_spb" target="_blank" rel="noopener">Telegram</a></div>
      <div class="card reveal"><div class="card__num">Почта</div>
        <p style="margin-top:8px"><b><a href="mailto:mail@karkaskin.ru">mail@karkaskin.ru</a></b></p>
        <p class="small muted">Отвечаем в рабочее время</p></div>
      <div class="card reveal"><div class="card__num">Режим работы</div>
        <p class="small muted" style="margin-top:8px">Пн–Пт: 9:00–18:00<br>Сб–Вс: выходные</p>
        <p class="small muted" style="margin-top:8px">Приём заявок — круглосуточно</p></div>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="sec-head"><div class="eyebrow">Формы</div><h2 class="h-1">Куда написать</h2>
      <p class="lead">Три формы — под разные задачи. Все заявки обрабатывает инженер-конструктор.</p></div>

    <div class="grid g-2" style="align-items:start">
      ${LEAD_FORM}

      <div class="card">
        <h3 class="h-3" style="margin-bottom:8px">Запрос на расчёт конструкций</h3>
        <p class="small muted" style="margin-bottom:18px">Для расчёта ферм и перекрытий нужны пролёт, длина, тип крыши и нагрузки.</p>
        <form data-form="calc-structures">
          <div class="form-err" style="margin-bottom:14px"></div>
          <div class="form-grid">
            <div class="field"><label class="field__label" for="cs-name">Имя <span>*</span></label>
              <input class="input" id="cs-name" name="name" type="text" placeholder="Иван" required></div>
            <div class="field"><label class="field__label" for="cs-phone">Телефон <span>*</span></label>
              <input class="input" id="cs-phone" name="phone" type="tel" placeholder="+7 900 000-00-00" required></div>
            <div class="field"><label class="field__label" for="cs-span">L, мм — пролёт фермы <span>*</span></label>
              <input class="input" id="cs-span" name="span" type="text" placeholder="9000" required></div>
            <div class="field"><label class="field__label" for="cs-len">A, мм — длина здания <span>*</span></label>
              <input class="input" id="cs-len" name="length" type="text" placeholder="12000" required></div>
            <div class="field"><label class="field__label" for="cs-roof">Тип крыши</label>
              <select class="select" id="cs-roof" name="roof">
                <option>Двускатная</option><option>Односкатная</option><option>Вальмовая</option>
                <option>Мансардная</option><option>Плоская</option></select></div>
            <div class="field"><label class="field__label" for="cs-step">Шаг ферм</label>
              <input class="input" id="cs-step" name="step" type="text" placeholder="900"></div>
            <div class="field"><label class="field__label" for="cs-snow">Снеговой район</label>
              <select class="select" id="cs-snow" name="snow"><option>I</option><option>II</option><option>III</option><option>IV</option></select></div>
            <div class="field"><label class="field__label" for="cs-cover">Покрытие кровли</label>
              <input class="input" id="cs-cover" name="covering" type="text" placeholder="Металлочерепица"></div>
            <div class="field full"><label class="field__label" for="cs-comment">Комментарий</label>
              <textarea class="textarea" id="cs-comment" name="comment" placeholder="Высота фермы, уклон, утеплитель, свесы…"></textarea></div>
            <input type="hidden" name="project" value="Расчёт конструкций">
            <div class="full"><label class="check"><input type="checkbox" name="consent" value="1">
              <span>Согласен на обработку персональных данных</span></label></div>
            <div class="full"><button class="btn btn--wood btn--block" type="submit"><span class="btn__spin"></span>
              <svg class="btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l16-8-6 16-2-6z"/></svg>
              Отправить</button></div>
          </div>
          <div class="form-ok" style="margin-top:16px"><span>✓</span><span>Заявка отправлена.</span></div>
        </form>
      </div>
    </div>
  </div>
</section>

<section class="section" id="map">
  <div class="container">
    <div class="sec-head"><div class="eyebrow">Схема проезда</div><h2 class="h-1">Мы на карте</h2></div>
    <div style="border-radius:var(--r-lg);overflow:hidden;border:1px solid var(--line)">
      <iframe src="https://yandex.ru/map-widget/v1/?mode=search&text=%D0%9A%D0%B0%D1%80%D0%BA%D0%B0%D1%81%D0%BA%D0%B8%D0%BD%2C%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%2C%20%D1%83%D0%BB.%20%D0%97%D0%B0%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D0%BD%D0%B0%D1%8F%2C%2062"
        width="100%" height="420" frameborder="0" allowfullscreen loading="lazy" title="Каркаскин на карте"></iframe>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px">
      <a class="btn btn--ghost" href="https://yandex.ru/maps/org/karkaskin/1264554017/" target="_blank" rel="noopener">Открыть в Яндекс Картах</a>
      <a class="btn btn--ghost" href="https://yandex.ru/maps/org/karkaskin/1264554017/reviews/" target="_blank" rel="noopener">Читать отзывы</a>
    </div>
  </div>
</section>
`,
  },

  {
    file: 'privacy/index.html',
    title: 'Политика конфиденциальности — Каркаскин',
    desc: 'Политика обработки персональных данных и конфиденциальности ООО Каркаскин.',
    body: `
<section class="pagehead">
  <div class="container">
    <div class="crumbs"><a href="/">Главная</a> / <span>Политика конфиденциальности</span></div>
    <h1 class="h-1">Политика конфиденциальности</h1>
    <p class="lead">Как мы обращаемся с персональными данными, которые вы оставляете в формах на сайте.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="split" style="align-items:start">
      <div class="card" style="max-width:820px">
        <h3 class="h-3">Общие положения</h3>
        <p class="small muted">Настоящая Политика описывает порядок обработки персональных данных пользователей сайта karkaskin.ru
          (далее — Сайт) и разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</p>

        <h3 class="h-3" style="margin-top:26px">Какие данные мы собираем</h3>
        <p class="small muted">Через формы на Сайте мы получаем имя, номер телефона, адрес электронной почты, регион строительства,
          сведения о проекте и, при отправке расчёта, параметры конструкции (габариты, тип крыши, порода древесины и иные
          технические параметры), которые вы указываете в форме или формируете в 3D-конструкторе.</p>

        <h3 class="h-3" style="margin-top:26px">Цели обработки</h3>
        <p class="small muted">Данные используются исключительно для обработки заявки: подготовки расчёта конструкций,
          подготовки коммерческого предложения, связи с вами по заявке и выполнения договора.</p>

        <h3 class="h-3" style="margin-top:26px">Правовое основание и срок хранения</h3>
        <p class="small muted">Обработка осуществляется с вашего согласия, выраженного при отправке формы.
          Данные хранятся не дольше, чем этого требуют цели обработки, а также сроки, установленные законодательством РФ.</p>

        <h3 class="h-3" style="margin-top:26px">Передача третьим лицам</h3>
        <p class="small muted">Мы не продаём и не передаём персональные данные третьим лицам, за исключением случаев,
          предусмотренных законодательством, а также привлечения подрядчиков, обеспечивающих работу Сайта
          и доставку сообщений (в том числе сервиса мессенджеров) — на условиях конфиденциальности.</p>

        <h3 class="h-3" style="margin-top:26px">Ваши права</h3>
        <p class="small muted">Вы вправе запросить сведения об обработке своих данных, потребовать их уточнения,
          блокирования или удаления, а также отозвать согласие на обработку. Для этого напишите на
          <a href="mailto:mail@karkaskin.ru" style="text-decoration:underline">mail@karkaskin.ru</a> или позвоните
          по телефону <a href="tel:+79219153706" style="text-decoration:underline">+7 921 915-37-06</a>.</p>

        <h3 class="h-3" style="margin-top:26px">Файлы cookie</h3>
        <p class="small muted">Сайт использует технические cookie и сервисы аналитики для корректной работы интерфейса
          и оценки посещаемости. Вы можете отключить cookie в настройках браузера.</p>

        <h3 class="h-3" style="margin-top:26px">Оферта</h3>
        <p class="small muted">Информация о стоимости и ценах, размещённая на Сайте, не является публичной офертой
          и носит информационный характер. Точную стоимость уточняйте в офисе компании.</p>

        <p class="small muted" style="margin-top:26px">© <span data-year>2026</span> ООО «Каркаскин»</p>
      </div>
      <div>
        <div class="card" style="background:var(--navy-soft);border-color:transparent">
          <h3 class="h-3">Вопросы по данным</h3>
          <p class="small muted" style="margin-top:10px">Напишите нам — ответим в течение рабочего дня.</p>
          <a class="btn btn--wood" style="margin-top:16px" href="mailto:mail@karkaskin.ru">Написать на почту</a>
        </div>
      </div>
    </div>
  </div>
</section>
`,
  },
];

/* ---------- сборка ---------- */
let count = 0;
for (const p of PAGES) {
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:type" content="website">
${HEAD}
</head>
<body>
${HEADER}
${p.body.trim()}
${FOOTER}
<script type="module" src="/assets/js/app.js"></script>
${(p.scripts || []).map(s => `<script type="module" src="${s}"></script>`).join('\n')}
</body>
</html>
`;
  const out = path.join(ROOT, p.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, 'utf8');
  count++;
  console.log('✓', p.file);
}
console.log('Готово страниц:', count);
