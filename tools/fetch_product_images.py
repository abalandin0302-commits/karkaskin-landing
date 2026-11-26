# -*- coding: utf-8 -*-
"""Скачивает изображения проектов каталога в assets/img/products/<slug>/."""
import os, json, ssl, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img", "products")
os.makedirs(OUT, exist_ok=True)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
PER_ITEM = 4


def enc(u):
    p = urllib.parse.urlsplit(u)
    return urllib.parse.urlunsplit((p.scheme, p.netloc,
        urllib.parse.quote(p.path, safe="/%"), urllib.parse.quote(p.query, safe="=&%"), p.fragment))


with open(os.path.join(ROOT, "data", "catalog.json"), encoding="utf-8") as f:
    items = json.load(f)["items"]

index = []
for it in items:
    slug = it["slug"]
    d = os.path.join(OUT, slug)
    os.makedirs(d, exist_ok=True)
    files = []
    for i, u in enumerate(it.get("images", [])[:PER_ITEM]):
        ext = os.path.splitext(urllib.parse.urlsplit(u).path)[1].lower()
        if ext not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        name = "%02d%s" % (len(files) + 1, ".jpg" if ext in (".jpg", ".jpeg") else ext)
        p = os.path.join(d, name)
        try:
            req = urllib.request.Request(enc(u), headers=UA)
            with urllib.request.urlopen(req, timeout=45, context=ctx) as r:
                data = r.read()
            with open(p, "wb") as fh:
                fh.write(data)
            files.append({"file": "assets/img/products/%s/%s" % (slug, name), "src": u})
        except Exception as e:
            print("  !", slug, name, str(e)[:70])
    index.append({"slug": slug, "files": files})
    print("%-58s %d imgs" % (slug[:58], len(files)))

with open(os.path.join(ROOT, "data", "product-images.json"), "w", encoding="utf-8") as f:
    json.dump(index, f, ensure_ascii=False, indent=1)
print("DONE")
