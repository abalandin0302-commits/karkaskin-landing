# -*- coding: utf-8 -*-
"""Скачивает изображения разделов karkaskin.ru локально в assets/img/<slug>/."""
import os, re, hashlib, urllib.parse, urllib.request, ssl, json, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
os.makedirs(IMG, exist_ok=True)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}

PAGES = [
    ("home", "https://karkaskin.ru/"),
    ("proizvodstvo", "https://karkaskin.ru/proizvodstvo/"),
    ("fermy", "https://karkaskin.ru/proizvodstvo/fermy-na-mzp/"),
    ("fermy-dvuxskatnye", "https://karkaskin.ru/proizvodstvo/fermy-na-mzp/dvuxskatnye-fermy/"),
    ("fermy-odnoskatnye", "https://karkaskin.ru/proizvodstvo/fermy-na-mzp/odnoskatnye-fermy/"),
    ("fermy-mansardnye", "https://karkaskin.ru/proizvodstvo/fermy-na-mzp/mansardnye-fermy/"),
    ("fermy-noschnicy", "https://karkaskin.ru/proizvodstvo/fermy-na-mzp/fermy-s-podemom/"),
    ("fermy-segmentnye", "https://karkaskin.ru/proizvodstvo/fermy-na-mzp/segmentnye-fermy/"),
    ("fermy-frontonnye", "https://karkaskin.ru/proizvodstvo/fermy-na-mzp/frontonnye-fermy/"),
    ("perekrytiya", "https://karkaskin.ru/proizvodstvo/konstrukcii-perekrytij/"),
    ("posi-balki", "https://karkaskin.ru/proizvodstvo/konstrukcii-perekrytij/posi-balki/"),
    ("balki-stropila", "https://karkaskin.ru/proizvodstvo/konstrukcii-perekrytij/balki-i-stropila-na-mzp/"),
    ("fermy-perekrytij", "https://karkaskin.ru/proizvodstvo/konstrukcii-perekrytij/fermy-perekrytij/"),
    ("arki", "https://karkaskin.ru/proizvodstvo/arochnye-konstrukcii-arki-na-mzp/"),
    ("ramy", "https://karkaskin.ru/proizvodstvo/ramy-i-arki-na-mzp/"),
    ("opalubka", "https://karkaskin.ru/proizvodstvo/opalubka-mitek/"),
    ("komplekty", "https://karkaskin.ru/komplekty-konstrukcij/"),
    ("komplekt-dvuxskat", "https://karkaskin.ru/komplekty-konstrukcij/konstrukcii-dlya-dvuxskatnoj-kryshi/"),
    ("komplekt-svesy", "https://karkaskin.ru/komplekty-konstrukcij/komplekty-konstrukcij-dlya-dvuxskatnoj-kryshi-s-frontonnymi-svesami/"),
    ("komplekt-valm", "https://karkaskin.ru/komplekty-konstrukcij/konstrukcii-valmovoj-kryshi/"),
    ("komplekt-mansard", "https://karkaskin.ru/komplekty-konstrukcij/komplekt-konstrukcij-dlya-treugolnoj-mansardnoy-kryshi/"),
    ("komplekt-barn", "https://karkaskin.ru/komplekty-konstrukcij/konstrukcii-dlya-barn-xausa/"),
    ("komplekt-poluramy", "https://karkaskin.ru/komplekty-konstrukcij/poluramy-na-mzp/"),
    ("uslugi", "https://karkaskin.ru/uslugi/"),
    ("uslugi-dk", "https://karkaskin.ru/uslugi/derevyannie-konstrukcii/"),
    ("uslugi-domov", "https://karkaskin.ru/uslugi/proektirovanie/"),
    ("o-kompanii", "https://karkaskin.ru/o-kompanii/"),
    ("nashi-raboty", "https://karkaskin.ru/o-kompanii/nashi-raboti/"),
    ("garantii", "https://karkaskin.ru/o-kompanii/garantii-i-uslugi-raboty/"),
    ("portfolio", "https://karkaskin.ru/portfolio/"),
]

IMG_RE = re.compile(r'https://karkaskin\.ru/wp-content/uploads/[^"\'\s\\<>)]+?\.(?:jpg|jpeg|png|webp)', re.I)
SVG_RE = re.compile(r'https://karkaskin\.ru/wp-content/uploads/[^"\'\s\\<>)]+?\.svg', re.I)


def enc(url):
    """Перцент-кодируем не-ASCII части URL (кириллица в именах файлов)."""
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit((p.scheme, p.netloc,
        urllib.parse.quote(p.path, safe="/%"),
        urllib.parse.quote(p.query, safe="=&%"),
        p.fragment))


def get(url, timeout=45):
    url = enc(url)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
        return r.read()


def save(url, path):
    try:
        data = get(url)
        with open(path, "wb") as f:
            f.write(data)
        return len(data)
    except Exception as e:
        print("   ! %s -> %s" % (url[:90], e))
        return 0


manifest = {}
for slug, url in PAGES:
    d = os.path.join(IMG, slug)
    os.makedirs(d, exist_ok=True)
    try:
        html = get(url).decode("utf-8", "ignore")
    except Exception as e:
        print("FAIL page", slug, e)
        continue
    urls = []
    for m in IMG_RE.findall(html):
        m = urllib.parse.unquote(m)
        if m not in urls:
            urls.append(m)
    # og:image приоритетно
    og = re.search(r'property=["\']og:image["\']\s+content=["\']([^"\']+)', html, re.I)
    if og:
        m = urllib.parse.unquote(og.group(1))
        if m in urls:
            urls.remove(m)
        urls.insert(0, m)
    # исключаем маленькие иконки/логотипы-изображения
    urls = [u for u in urls if not re.search(r'(logo|icon|avatar|favicon|placeholder|thumb-?news)', u, re.I)]
    picked = []
    total = 0
    for i, u in enumerate(urls[:6]):
        ext = os.path.splitext(urllib.parse.urlparse(u).path)[1].lower()
        if ext not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        name = "%s-%02d%s" % (slug, len(picked) + 1, ".jpg" if ext in (".jpg", ".jpeg") else ext)
        p = os.path.join(d, name)
        n = save(u, p)
        if n:
            picked.append({"file": "assets/img/%s/%s" % (slug, name), "src": u, "bytes": n})
            total += n
    manifest[slug] = picked
    print("%-22s %2d imgs %6.2f MB" % (slug, len(picked), total / 1048576.0))

# логотипы и служебные
extras = [
    ("https://karkaskin.ru/wp-content/uploads/2026/02/KN.svg", "assets/img/brand/kn.svg"),
    ("https://karkaskin.ru/wp-content/uploads/2023/07/Logo.png", "assets/img/brand/logo.png"),
    ("https://karkaskin.ru/wp-content/uploads/2014/12/%D0%BA%D0%B0%D1%80%D0%BA%D0%B0%D1%81%D0%BA%D0%B8%D0%BD.jpg", "assets/img/brand/karkaskin.jpg"),
]
for u, rel in extras:
    p = os.path.join(ROOT, rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(p), exist_ok=True)
    n = save(u, p)
    print("extra %-40s %s" % (rel, "ok" if n else "FAIL"))

with open(os.path.join(ROOT, "data", "images.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=1)
print("DONE")
