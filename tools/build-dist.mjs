/* Сборка папки публикации (dist): только готовые страницы, assets и data.
   Временные и служебные файлы в публикацию не попадают.                 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

/* очищаем dist */
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

/* 1. HTML-страницы: только разрешённые (черновики и выкачки исключаются) */
const PAGES = [
  'index.html',
  'production/index.html',
  'kits/index.html',
  'catalog/index.html',
  'catalog/product.html',
  'services/index.html',
  'about/index.html',
  'about/portfolio.html',
  'about/guarantee.html',
  'contacts/index.html',
  'privacy/index.html',
];
for (const rel of PAGES) {
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) { console.log('НЕТ страницы:', rel); continue; }
  const out = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(src, out);
}

/* 1b. карта сайта */
const TODAY = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url><loc>https://karkaskin.ru/${p === 'index.html' ? '' : p}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /catalog/product.html\nSitemap: https://karkaskin.ru/sitemap.xml\n`, 'utf8');

/* 2. assets и data */
for (const dir of ['assets', 'data']) {
  fs.cpSync(path.join(ROOT, dir), path.join(DIST, dir), { recursive: true });
}

/* 3. служебные файлы для деплоя */
for (const f of ['robots.txt', 'sitemap.xml']) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(DIST, f));
}

/* --- проверка внутренних ссылок и ресурсов --- */
const htmlFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.html')) htmlFiles.push(full);
  }
})(DIST);

const missing = new Set();
let checked = 0;
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const re = /(?:src|href)="(\/[^"#?]*)/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (!/\.(html|css|js|json|jpg|jpeg|png|webp|svg|ico)$/i.test(url)) continue;
    checked++;
    const target = path.join(DIST, decodeURIComponent(url));
    if (!fs.existsSync(target)) missing.add(url + '  ← ' + path.relative(ROOT, f));
  }
}

/* --- итог --- */
let size = 0;
(function sz(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory()) sz(full);
    else size += fs.statSync(full).size;
  }
})(DIST);

console.log('HTML-страниц:', htmlFiles.length);
console.log('Проверено ссылок на ресурсы:', checked);
console.log('Размер dist:', (size / 1048576).toFixed(1), 'МБ');
if (missing.size) {
  console.log('\nНЕ НАЙДЕНЫ:');
  for (const x of missing) console.log(' -', x);
  process.exitCode = 1;
} else {
  console.log('Битых ссылок на локальные ресурсы нет.');
}
