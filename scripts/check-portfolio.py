"""Structural smoke check. Run: npm run build && python3 scripts/check-portfolio.py

Checks links, local images, section anchors, bilingual routes and featured order;
it deliberately does not assert marketing copy or interpret dates as project history.
"""
from datetime import date
from functools import lru_cache
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.elements = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def attrs(self, tag):
        return [attrs for name, attrs in self.elements if name == tag]


@lru_cache(maxsize=None)
def page(path):
    return Page(path.read_text())


def resolve(url, current):
    parsed = urlsplit(url)
    target = DIST / unquote(parsed.path).lstrip('/') if parsed.path.startswith('/') else current.parent / unquote(parsed.path)
    if not parsed.path:
        target = current
    if target.is_dir():
        target /= 'index.html'
    assert target.is_file(), f'{current.relative_to(DIST)}: missing {url}'
    if parsed.fragment and target.suffix == '.html':
        ids = {attrs.get('id') for _, attrs in page(target).elements}
        assert unquote(parsed.fragment) in ids, f'Broken anchor: {url}'
    return target


pages = sorted(DIST.rglob('*.html'))
assert pages, 'Build the portfolio first.'
for path in pages:
    doc = page(path)
    ids = [attrs['id'] for _, attrs in doc.elements if 'id' in attrs]
    assert len(ids) == len(set(ids)), f'Duplicate IDs in {path}'
    for tag in ('a', 'link'):
        for attrs in doc.attrs(tag):
            href = attrs.get('href', '')
            parsed = urlsplit(href)
            if href and not parsed.scheme and not parsed.netloc:
                resolve(href, path)
    for image in doc.attrs('img'):
        assert image.get('alt'), f'Missing image description in {path}'
        if image.get('src', '').startswith('/'):
            target = resolve(image['src'], path)
            if target.suffix == '.svg':
                svg = ET.parse(target).getroot()
                assert svg.find('{http://www.w3.org/2000/svg}title') is not None
    sections = [h['id'] for h in doc.attrs('h2') if 'id' in h]
    if len(sections) > 2:
        anchors = {a.get('href') for a in doc.attrs('a')}
        assert all('#' + section in anchors for section in sections), f'Missing contents links in {path}'

# Read only the scalar frontmatter fields needed for ordering, not narrative text.
projects = []
for source in (ROOT / 'src/content/projects').glob('*.md'):
    frontmatter = source.read_text().split('---', 2)[1]
    fields = dict(re.findall(r'^(lang|routeSlug|publishedDate|featuredOrder|featured):\s*(.+)$', frontmatter, re.M))
    projects.append({key: value.strip('"\'') for key, value in fields.items()})

for lang, route in [('en', 'work'), ('es', 'proyectos')]:
    entries = [entry for entry in projects if entry['lang'] == lang]
    assert {entry['routeSlug'] for entry in entries} == {entry['routeSlug'] for entry in projects if entry['lang'] != lang}
    for entry in entries:
        resolve(f'/{lang}/{route}/{entry["routeSlug"]}/', DIST / lang / 'index.html')
    expected = sorted([entry for entry in entries if entry.get('featured') != 'false'], key=lambda entry: (int(entry.get('featuredOrder', 999)), -date.fromisoformat(entry['publishedDate']).toordinal()))[:4]
    cards = [a['href'] for a in page(DIST / lang / 'index.html').attrs('a') if 'project-card' in a.get('class', '').split()]
    assert cards == [f'/{lang}/{route}/{entry["routeSlug"]}/' for entry in expected], f'Wrong featured order: {lang}'

print(f'PASS: {len(pages)} built pages; local links, images, contents anchors, bilingual routes and featured order.')
