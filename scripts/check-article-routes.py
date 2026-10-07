"""Regression check: npm run build && python3 scripts/check-article-routes.py."""
from html.parser import HTMLParser
from pathlib import Path
from tempfile import TemporaryDirectory
import json
import re
import shutil
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
SITE = 'https://mauriciosuarez.dev'
SECTIONS = {'en': '/en/writing/', 'es': '/es/articulos/'}
LOCALIZED = {
    ('modelo-entiende-codigo-decide-permiso', 'en'): 'model-interprets-code-authorizes',
    ('modelos-baratos-no-migrar', 'en'): 'cheaper-models-no-migration',
    ('endpoint-29-seconds', 'es'): 'endpoint-29-segundos',
    ('the-30-second-wall', 'es'): 'barrera-de-los-30-segundos',
    ('frozen-sentry-release', 'es'): 'release-sentry-congelado',
}


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.elements = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def attrs(self, tag):
        return [a for name, a in self.elements if name == tag]


entries = {}
for path in (ROOT / 'src/content/articles').rglob('*.md'):
    front = path.read_text().split('---', 2)[1]
    data = {k: json.loads(v) for k, v in re.findall(r'^(lang|routeSlug|draft|ogImage|tags):\s*(.+)$', front, re.M)}
    lang = data['lang']
    if lang == 'en':
        assert not set(data.get('tags', [])) & {'integracion-ia', 'arquitectura', 'seguridad', 'operaciones', 'evaluacion', 'rendimiento', 'colas', 'ia', 'automatizacion'}, f'Untranslated tags: {path.name}'
    stem = path.relative_to(ROOT / 'src/content/articles').with_suffix('').as_posix()
    assert stem.endswith('-' + lang), f'Filename language mismatch: {path.name}'
    key = stem.removesuffix('-' + lang)
    assert (key, lang) not in entries, f'Duplicate translation: {key}:{lang}'
    assert data['routeSlug'] == LOCALIZED.get((key, lang), data['routeSlug']), f'Wrong localized slug: {path.name}'
    data['route'] = SECTIONS[lang] + data['routeSlug'] + '/'
    entries[key, lang] = data

published = {key: data for key, data in entries.items() if not data.get('draft', False)}
routes = {data['route'] for data in published.values()}
assert len(routes) == len(published), 'Duplicate public article URL'

for (key, lang), data in entries.items():
    path = DIST / data['route'].lstrip('/') / 'index.html'
    if data.get('draft', False):
        assert not path.exists(), f'Draft leaked: {path}'
        continue
    html = path.read_text()
    page = Page(html)
    url = SITE + data['route']
    assert page.attrs('html')[0]['lang'] == lang
    assert [a['href'] for a in page.attrs('link') if a.get('rel') == 'canonical'] == [url]
    assert [a['content'] for a in page.attrs('meta') if a.get('property') == 'og:url'] == [url]
    ld = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)[1])
    assert ld['inLanguage'] == lang and ld['mainEntityOfPage']['@id'] == url
    cover_lang = re.search(r'-(en|es)\.[a-z]+$', data.get('ogImage', ''))
    assert not cover_lang or cover_lang[1] == lang, 'Wrong cover language'
    assert ld['image'] == SITE + data['ogImage']
    for a in page.attrs('a'):
        href = a.get('href', '')
        if href.startswith(tuple(SECTIONS.values())) and href not in SECTIONS.values():
            assert href in routes, f'Article links must use canonical URLs: {href}'
    other = 'es' if lang == 'en' else 'en'
    sibling = published.get((key, other))
    alternates = {a['hreflang']: a['href'] for a in page.attrs('link') if 'hreflang' in a}
    if sibling:
        pair = {lang: url, other: SITE + sibling['route']}
        assert alternates == {**pair, 'x-default': pair['en']}, f'Wrong hreflang: {data["route"]}'
    else:
        assert not alternates, 'No hreflang for an unpublished/missing sibling'
    switch = next(a for a in page.attrs('a') if a.get('aria-label', '').startswith('Switch to '))
    assert switch['href'] == (sibling['route'] if sibling else SECTIONS[other])

for lang in SECTIONS:
    rss = ET.parse(DIST / lang / 'rss.xml')
    assert {item.findtext('link') for item in rss.findall('./channel/item')} == {
        SITE + data['route'] for (_, locale), data in published.items() if locale == lang
    }, f'Wrong RSS routes: {lang}'
    index = Page((DIST / SECTIONS[lang].lstrip('/') / 'index.html').read_text())
    assert {a['href'] for a in index.attrs('a') if a.get('href') in routes} == {
        data['route'] for (_, locale), data in published.items() if locale == lang
    }, f'Wrong article list: {lang}'

assert (ROOT / 'public/_redirects').read_text() == (DIST / '_redirects').read_text()
aliases = {}
for line in (DIST / '_redirects').read_text().splitlines():
    old, new, status = line.split()
    if old.startswith(tuple(SECTIONS.values())):
        assert status == '301' and new in routes and old not in routes
        assert old not in aliases
        aliases[old] = new
for (key, lang), slug in LOCALIZED.items():
    if (key, lang) not in published:
        continue
    old = SECTIONS[lang] + key
    new = SECTIONS[lang] + slug + '/'
    assert aliases.get(old) == aliases.get(old + '/') == new
    fallback = Page((DIST / old.lstrip('/') / 'index.html').read_text())
    assert any(a.get('http-equiv', '').lower() == 'refresh' and new in a.get('content', '') for a in fallback.attrs('meta'))

sitemap = set()
for file in DIST.glob('sitemap-*.xml'):
    sitemap.update(ET.parse(file).getroot().itertext())
assert {SITE + route for route in routes} <= sitemap
assert not {SITE + old for old in aliases} & sitemap, 'Redirect aliases leaked to sitemap'
assert not {SITE + d['route'] for d in entries.values() if d.get('draft', False)} & sitemap

# Scaffolding shares stable filenames, not public slugs; writes only to our temp dir.
with TemporaryDirectory(prefix='article-scaffold-test-') as temp:
    script = Path(temp) / 'scripts/new-article.mjs'
    script.parent.mkdir()
    shutil.copyfile(ROOT / 'scripts/new-article.mjs', script)
    def scaffold(*args):
        return subprocess.run(['node', str(script), *args], capture_output=True, text=True)
    assert scaffold('Model permissions', '--lang', 'en', '--key', 'shared-story').returncode == 0
    assert scaffold('Permisos del modelo', '--lang', 'es', '--key', 'shared-story').returncode == 0
    sources = Path(temp) / 'src/content/articles'
    assert 'routeSlug: "model-permissions"' in (sources / 'shared-story-en.md').read_text()
    assert 'routeSlug: "permisos-del-modelo"' in (sources / 'shared-story-es.md').read_text()
    assert scaffold('Overwrite', '--lang', 'es', '--key', 'shared-story').returncode != 0
    assert scaffold('Invalid', '--key', '../escape').returncode != 0

print(f'PASS: {len(published)} articles; localized URLs, translations, canonical/OG/JSON-LD, RSS/sitemap, {len(aliases)} 301 rules, drafts hidden, stable scaffold identity.')
