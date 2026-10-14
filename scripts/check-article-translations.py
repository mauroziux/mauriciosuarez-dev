#!/usr/bin/env python3
"""After `npm run build`, check published article routes and filename-based siblings."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://mauriciosuarez.dev'
SECTIONS = {'es': 'articulos', 'en': 'writing'}


class Page(HTMLParser):
    def __init__(self, content):
        super().__init__()
        self.links = []
        self.images = []
        self.anchors = []
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == 'link':
            self.links.append(data)
        elif tag == 'img':
            self.images.append(data)
        elif tag == 'a':
            self.anchors.append(data.get('href'))


published = {}
for source in sorted((ROOT / 'src/content/articles').glob('*.md')):
    front = source.read_text().split('---', 2)[1]
    if re.search(r'^draft: true\s*$', front, re.M):
        continue
    fields = {k: json.loads(v) for k, v in re.findall(r'^(lang|routeSlug): (".*")\s*$', front, re.M)}
    lang = fields['lang']
    assert source.stem.endswith('-' + lang), source
    key = source.stem[:-(len(lang) + 1)]
    path = f'/{lang}/{SECTIONS[lang]}/{fields["routeSlug"]}/'
    assert (key, lang) not in published, source
    published[key, lang] = path

sitemap = {item.text for item in ET.parse(ROOT / 'dist/sitemap-0.xml').iter()
           if item.tag.endswith('}loc')}
feeds = {lang: {item.text for item in ET.parse(ROOT / f'dist/{lang}/rss.xml').findall('.//item/link')}
         for lang in SECTIONS}
for (key, lang), path in published.items():
    page = Page((ROOT / 'dist' / path.lstrip('/') / 'index.html').read_text())
    url = ORIGIN + path
    assert any(link.get('rel') == 'canonical' and link.get('href') == url for link in page.links), path
    assert url in sitemap and url in feeds[lang], path
    alternates = {link.get('hreflang'): link.get('href') for link in page.links
                  if link.get('rel') == 'alternate' and link.get('hreflang')}
    other = 'en' if lang == 'es' else 'es'
    sibling = published.get((key, other))
    if sibling:
        for locale in SECTIONS:
            assert alternates.get(locale) == ORIGIN + published[key, locale], (path, alternates)
        assert alternates.get('x-default') == ORIGIN + published[key, 'en'], path
        assert sibling in page.anchors, path
    else:
        assert other not in alternates, path
    for image in page.images:
        src = image.get('src', '')
        if src.startswith('/articles/'):
            assert image.get('alt', '').strip(), (path, src)
            assert (ROOT / 'dist' / src.lstrip('/')).is_file(), (path, src)
print(f'PASS: {len(published)} articles; localized sibling links, canonical, hreflang, RSS/sitemap and images.')
